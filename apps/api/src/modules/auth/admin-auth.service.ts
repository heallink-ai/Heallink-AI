import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';

import {
  AdminUser,
  AdminRole,
  UserRole,
} from '../users/entities/admin-user.entity';
import {
  AdminLoginDto,
  AdminRegisterDto,
  AdminPasswordResetRequestDto,
  AdminPasswordResetDto,
  UpdateAdminRoleDto,
} from './dto/admin-auth.dto';
import { ADMIN_PERMISSIONS } from './constants/admin-permissions.constant';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  adminRole: string;
  permissions: string[];
}

@Injectable()
export class AdminAuthService {
  constructor(
    @InjectModel(AdminUser.name) private adminUserModel: Model<AdminUser>,
    private jwtService: JwtService,
  ) {}

  /**
   * Login admin user with email and password
   */
  async login(loginDto: AdminLoginDto) {
    const { email, password } = loginDto;

    // Find the admin user by email
    const user = await this.adminUserModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if the user is active
    if (!user.isActive) {
      throw new ForbiddenException('Account is disabled');
    }

    // Check if password matches
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Store refresh token
    user.addRefreshToken(tokens.refreshToken);
    await user.save();

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: this.sanitizeUser(user),
    };
  }

  /**
   * Register a new admin user (typically only called by superadmin)
   */
  async register(registerDto: AdminRegisterDto, creatorAdminRole: AdminRole) {
    const { email, password, name, adminRole } = registerDto;

    // Validate that adminRole is a valid enum value
    if (!Object.values(AdminRole).includes(adminRole as AdminRole)) {
      throw new BadRequestException('Invalid admin role');
    }

    // Check if creator has permission to create this type of admin
    if (
      creatorAdminRole !== AdminRole.SUPER_ADMIN &&
      adminRole === AdminRole.SUPER_ADMIN
    ) {
      throw new ForbiddenException(
        'Only super admins can create other super admins',
      );
    }

    // Check if user already exists
    const existingUser = await this.adminUserModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Get permissions for the role
    const rolePermissions = ADMIN_PERMISSIONS[adminRole as AdminRole] || [];

    // Create new admin user
    const newUser = new this.adminUserModel({
      email,
      password,
      name,
      role: UserRole.ADMIN,
      adminRole,
      permissions: rolePermissions,
    });

    // Save the user
    await newUser.save();

    return {
      user: this.sanitizeUser(newUser),
    };
  }

  /**
   * Request password reset for admin
   */
  async requestPasswordReset(resetRequestDto: AdminPasswordResetRequestDto) {
    const { email } = resetRequestDto;

    // Find the admin user by email
    const user = await this.adminUserModel.findOne({ email });

    if (!user) {
      // Don't reveal if user exists for security
      return {
        message:
          'If an account with this email exists, a password reset link will be sent',
      };
    }

    // Generate token
    const token = randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(token, 10);

    // Store token and request timestamp
    user.passwordResetToken = hashedToken;
    user.passwordResetRequestedAt = new Date();
    await user.save();

    // In a real implementation, send email with reset link
    // const resetLink = `${process.env.ADMIN_URL}/reset-password?token=${token}`;
    // await this.mailService.sendPasswordResetEmail(email, resetLink);

    return {
      message:
        'If an account with this email exists, a password reset link will be sent',
      // For development only, remove in production:
      token,
    };
  }

  /**
   * Reset password with token
   */
  async resetPassword(resetDto: AdminPasswordResetDto) {
    const { token, newPassword } = resetDto;

    // Find user with reset token
    const users = await this.adminUserModel.find({
      passwordResetRequestedAt: { $ne: null },
    });

    // Find user with matching token
    let matchedUser: AdminUser | null = null;
    for (const u of users) {
      if (u.passwordResetToken) {
        const isMatch = await bcrypt.compare(token, u.passwordResetToken);
        if (isMatch) {
          matchedUser = u;
          break;
        }
      }
    }

    if (!matchedUser) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // Check if token is expired (1 hour validity)
    if (matchedUser.passwordResetRequestedAt) {
      const tokenAge =
        Date.now() - matchedUser.passwordResetRequestedAt.getTime();
      if (tokenAge > 3600000) {
        // 1 hour in milliseconds
        // Clear the reset token
        this.clearResetToken(matchedUser);
        await matchedUser.save();

        throw new UnauthorizedException('Token has expired');
      }
    }

    // Update password
    matchedUser.password = newPassword;
    this.clearResetToken(matchedUser);

    // Invalidate all refresh tokens
    matchedUser.refreshTokens = [];

    await matchedUser.save();

    return { message: 'Password has been reset successfully' };
  }

  /**
   * Helper method to clear reset token fields
   */
  private clearResetToken(user: AdminUser): void {
    // Use this approach to set Mongoose fields to null
    user.set('passwordResetToken', null);
    user.set('passwordResetRequestedAt', null);
  }

  /**
   * Validate token
   */
  async validateToken(token: string) {
    try {
      await this.jwtService.verifyAsync(token);
      return { valid: true };
    } catch {
      return { valid: false };
    }
  }

  /**
   * Logout admin user
   */
  async logout(userId: string, refreshToken: string) {
    // Find the user
    const user = await this.adminUserModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Remove the refresh token
    user.removeRefreshToken(refreshToken);
    await user.save();

    return { message: 'Logged out successfully' };
  }

  /**
   * Refresh tokens
   */
  async refreshTokens(refreshToken: string) {
    try {
      // Verify token
      const payload = (await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      })) as JwtPayload;

      // Find user
      const user = await this.adminUserModel.findById(payload.sub);

      if (!user || !user.refreshTokens.includes(refreshToken)) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(user);

      // Remove old refresh token and add new one
      user.removeRefreshToken(refreshToken);
      user.addRefreshToken(tokens.refreshToken);
      await user.save();

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Update admin user's role and permissions
   */
  async updateAdminRole(
    updateDto: UpdateAdminRoleDto,
    currentUserRole: AdminRole,
  ) {
    const { userId, adminRole, customPermissions } = updateDto;

    // Validate that adminRole is a valid enum value
    if (!Object.values(AdminRole).includes(adminRole as AdminRole)) {
      throw new BadRequestException('Invalid admin role');
    }

    // Only super admins can modify other admin roles
    if (currentUserRole !== AdminRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only super admins can modify admin roles');
    }

    // Find user
    const user = await this.adminUserModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update role
    user.adminRole = adminRole as AdminRole;

    // Update permissions
    if (customPermissions && customPermissions.length > 0) {
      user.permissions = customPermissions;
    } else {
      // Use default permissions for this role
      const rolePermissions = ADMIN_PERMISSIONS[adminRole as AdminRole] || [];
      user.permissions = rolePermissions;
    }

    await user.save();

    return {
      user: this.sanitizeUser(user),
      message: 'Admin role and permissions updated successfully',
    };
  }

  /**
   * Get all admins (for super admin view)
   */
  async getAllAdmins() {
    const admins = await this.adminUserModel
      .find()
      .select('-password -refreshTokens');
    return { admins };
  }

  /**
   * Helper method to generate JWT tokens
   */
  private async generateTokens(user: AdminUser) {
    const payload = {
      sub: String(user._id),
      email: user.email,
      role: user.role,
      adminRole: user.adminRole,
      permissions: user.permissions,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '15m', // Short lived
        secret: process.env.JWT_SECRET,
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d', // Longer lived
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Helper method to sanitize user object before returning
   */
  private sanitizeUser(user: AdminUser) {
    // Convert Mongoose document to plain JavaScript object
    const userObj = user.toObject();

    return {
      id: userObj._id,
      email: userObj.email,
      name: userObj.name,
      role: userObj.role,
      adminRole: userObj.adminRole,
      permissions: userObj.permissions,
      emailVerified: userObj.emailVerified,
      isActive: userObj.isActive,
      lastLogin: userObj.lastLogin,
    };
  }
}
