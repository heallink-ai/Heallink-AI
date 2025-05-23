import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';

import {
  User,
  UserDocument,
  UserRole,
  AdminRole,
} from '../users/schemas/user.schema';
import {
  AdminLoginDto,
  AdminRegisterDto,
  AdminPasswordResetRequestDto,
  AdminPasswordResetDto,
  UpdateAdminRoleDto,
  InitialAdminSetupDto,
} from './dto/admin-auth.dto';
import { ADMIN_PERMISSIONS } from './constants/admin-permissions.constant';
import { LoggingService } from '../logging/logging.service';
import { EmailService } from '../emails/email.service';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  adminRole?: string;
  permissions?: string[];
  rememberMe?: boolean;
}

@Injectable()
export class AdminAuthService {
  private readonly logger = new Logger(AdminAuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private loggingService: LoggingService,
    private emailService: EmailService,
  ) {
    this.loggingService.setContext('AdminAuthService');
  }

  /**
   * Login admin user with email and password
   */
  async login(adminLoginDto: AdminLoginDto) {
    const { email, password, rememberMe } = adminLoginDto;

    const user = await this.userModel
      .findOne({
        email,
        role: UserRole.ADMIN,
      })
      .exec();

    if (!user) {
      this.loggingService.logAuth('unknown', 'admin-login', false, {
        email,
        reason: 'User not found',
      });
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.isActive === false) {
      this.loggingService.logAuth(
        user._id?.toString() || 'unknown',
        'admin-login',
        false,
        {
          reason: 'Account inactive',
        },
      );
      throw new UnauthorizedException('Your account has been deactivated');
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      this.loggingService.logAuth(
        user._id?.toString() || 'unknown',
        'admin-login',
        false,
        {
          reason: 'Invalid password',
        },
      );
      throw new UnauthorizedException('Invalid email or password');
    }

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save();

    const tokens = await this.generateTokens(user, rememberMe);

    // Store refresh token
    if (typeof user.addRefreshToken === 'function') {
      user.addRefreshToken(tokens.refreshToken);
      await user.save();
    } else {
      // Fallback if method doesn't exist - add to refreshTokens array directly
      if (!user.refreshTokens) {
        user.refreshTokens = [];
      }
      user.refreshTokens.push(tokens.refreshToken);
      await user.save();
    }

    this.loggingService.logAuth(
      user._id?.toString() || 'unknown',
      'admin-login',
      true,
      {
        adminRole: user.adminRole,
        ip: adminLoginDto.ip || 'unknown',
        rememberMe: !!rememberMe,
      },
    );

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
      (adminRole as AdminRole) === AdminRole.SUPER_ADMIN
    ) {
      throw new ForbiddenException(
        'Only super admins can create other super admins',
      );
    }

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Get permissions for the role
    const adminRoleEnum = adminRole as AdminRole;
    const rolePermissions = ADMIN_PERMISSIONS[adminRoleEnum] || [];

    // Create new admin user
    const newUser = new this.userModel({
      email,
      password,
      name,
      role: UserRole.ADMIN,
      adminRole: adminRoleEnum,
      permissions: rolePermissions,
      emailVerified: false,
      isActive: true,
      providers: ['local'],
    });

    // Save the user
    await newUser.save();

    // Send email with admin creation notification
    await this.emailService.sendAdminCreationEmail(email, name, password);

    return {
      user: this.sanitizeUser(newUser),
    };
  }

  /**
   * Register the initial admin user when none exists in the system
   */
  async registerInitialAdmin(setupDto: InitialAdminSetupDto) {
    const { email, password, name, setupKey } = setupDto;

    // Verify setup key
    const configuredSetupKey =
      this.configService.get<string>('admin.setupKey') || 'heallink_setup_key';
    if (setupKey !== configuredSetupKey) {
      this.loggingService.logAuth('unknown', 'initial-admin-setup', false, {
        email,
        reason: 'Invalid setup key',
      });
      throw new UnauthorizedException('Invalid setup key');
    }

    // Check if any admin users already exist
    const existingAdminsCount = await this.userModel.countDocuments({
      role: UserRole.ADMIN,
    });

    if (existingAdminsCount > 0) {
      this.loggingService.logAuth('unknown', 'initial-admin-setup', false, {
        email,
        reason: 'Admin already exists',
      });
      throw new ForbiddenException(
        'Initial admin setup has already been completed',
      );
    }

    // Check if user with the email already exists
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      this.loggingService.logAuth('unknown', 'initial-admin-setup', false, {
        email,
        reason: 'Email already exists',
      });
      throw new BadRequestException('Email is already in use');
    }

    // Create the initial admin as SUPER_ADMIN
    const superAdminRole = AdminRole.SUPER_ADMIN;
    const rolePermissions = ADMIN_PERMISSIONS[superAdminRole] || ['*'];

    // Create new admin user
    const newUser = new this.userModel({
      email,
      password,
      name,
      role: UserRole.ADMIN,
      adminRole: superAdminRole, // Always create as super admin
      permissions: rolePermissions,
      emailVerified: true, // Auto-verify for initial setup
      isActive: true,
      providers: ['local'],
    });

    await newUser.save();

    // Generate JWT tokens
    const tokens = await this.generateTokens(newUser);

    // Store refresh token
    if (typeof newUser.addRefreshToken === 'function') {
      newUser.addRefreshToken(tokens.refreshToken);
      await newUser.save();
    } else {
      // Fallback if method doesn't exist
      if (!newUser.refreshTokens) {
        newUser.refreshTokens = [];
      }
      newUser.refreshTokens.push(tokens.refreshToken);
      await newUser.save();
    }

    this.loggingService.logAuth(
      newUser._id?.toString() || 'unknown',
      'initial-admin-setup',
      true,
      {
        adminRole: newUser.adminRole,
        ip: setupDto.ip || 'unknown',
      },
    );

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: this.sanitizeUser(newUser),
    };
  }

  /**
   * Request password reset for admin
   */
  async requestPasswordReset(resetRequestDto: AdminPasswordResetRequestDto) {
    const { email } = resetRequestDto;

    // Find the admin user by email
    const user = await this.userModel.findOne({
      email,
      role: UserRole.ADMIN,
    });

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

    // Send email with reset link
    await this.emailService.sendPasswordResetEmail(
      email,
      token,
      user.name || 'Admin User',
    );

    return {
      message:
        'If an account with this email exists, a password reset link will be sent',
    };
  }

  /**
   * Reset password with token
   */
  async resetPassword(resetDto: AdminPasswordResetDto) {
    const { token, newPassword } = resetDto;

    // Find user with reset token
    const users = await this.userModel.find({
      passwordResetRequestedAt: { $ne: null },
      role: UserRole.ADMIN,
    });

    // Find user with matching token
    let matchedUser: UserDocument | null = null;
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
  private clearResetToken(user: UserDocument): void {
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
    try {
      const user = await this.userModel.findById(userId).exec();

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Remove refresh token
      if (typeof user.removeRefreshToken === 'function') {
        user.removeRefreshToken(refreshToken);
      } else {
        // Fallback if method doesn't exist
        if (user.refreshTokens && Array.isArray(user.refreshTokens)) {
          user.refreshTokens = user.refreshTokens.filter(
            (token) => token !== refreshToken,
          );
        }
      }

      await user.save();

      this.loggingService.logAuth(userId, 'admin-logout', true, {});

      return { success: true };
    } catch (error) {
      this.logger.error(`Logout error: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Refresh tokens
   */
  async refreshTokens(refreshToken: string) {
    try {
      // Verify refresh token
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('auth.refreshTokenSecret'),
      });

      const userId = payload.sub;
      const user = await this.userModel.findById(userId).exec();

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Check if the refresh token exists in the user's refresh tokens
      let isValidToken = false;

      if (user.refreshTokens && Array.isArray(user.refreshTokens)) {
        isValidToken = user.refreshTokens.includes(refreshToken);
      }

      if (!isValidToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Check if payload has rememberMe flag (from previous token)
      const rememberMe = payload.rememberMe === true;

      // Generate new tokens
      const tokens = await this.generateTokens(user, rememberMe);

      // Remove old refresh token and add new one
      if (
        typeof user.removeRefreshToken === 'function' &&
        typeof user.addRefreshToken === 'function'
      ) {
        user.removeRefreshToken(refreshToken);
        user.addRefreshToken(tokens.refreshToken);
      } else {
        // Fallback if methods don't exist
        if (user.refreshTokens && Array.isArray(user.refreshTokens)) {
          user.refreshTokens = user.refreshTokens.filter(
            (token) => token !== refreshToken,
          );
          user.refreshTokens.push(tokens.refreshToken);
        } else {
          user.refreshTokens = [tokens.refreshToken];
        }
      }

      await user.save();

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      this.logger.error(`Refresh token error: ${error.message}`, error.stack);
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
    const user = await this.userModel.findById(userId);

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
      const adminRoleEnum = adminRole as AdminRole;
      const rolePermissions = ADMIN_PERMISSIONS[adminRoleEnum] || [];
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
    const admins = await this.userModel
      .find({ role: UserRole.ADMIN })
      .select('-password -refreshTokens')
      .lean();
    return { admins };
  }

  /**
   * Helper method to generate JWT tokens
   */
  private async generateTokens(user: UserDocument, rememberMe = false) {
    const payload: JwtPayload = {
      sub: String(user._id),
      email: user.email || '',
      role: user.role,
      adminRole: user.adminRole,
      permissions: user.permissions,
      rememberMe: rememberMe,
    };

    // Use environment variables directly to avoid config mapping issues
    const jwtSecret = process.env.JWT_SECRET || 'dev-jwt-secret-key';
    const jwtRefreshSecret =
      process.env.JWT_REFRESH_SECRET ||
      process.env.JWT_SECRET ||
      'dev-jwt-refresh-secret-key';

    this.logger.debug(
      `Generating tokens with JWT_SECRET: ${jwtSecret ? '[SECRET CONFIGURED]' : 'fallback secret'}`,
    );

    // Set token expiration based on rememberMe flag
    const accessTokenExpiry = rememberMe ? '2h' : '15m';
    const refreshTokenExpiry = rememberMe ? '30d' : '7d';

    this.logger.debug(
      `Token expiry: accessToken=${accessTokenExpiry}, refreshToken=${refreshTokenExpiry}, rememberMe=${rememberMe}`,
    );

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: accessTokenExpiry,
        secret: jwtSecret,
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: refreshTokenExpiry,
        secret: jwtRefreshSecret,
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
  private sanitizeUser(user: UserDocument) {
    // Convert Mongoose document to plain JavaScript object
    const userObj = user.toObject ? user.toObject() : user;

    return {
      id: userObj._id?.toString() || '',
      email: userObj.email || '',
      name: userObj.name || '',
      role: userObj.role,
      adminRole: userObj.adminRole,
      permissions: userObj.permissions || [],
      emailVerified: userObj.emailVerified || false,
      isActive: userObj.isActive || false,
      lastLogin: userObj.lastLogin || null,
    };
  }
}
