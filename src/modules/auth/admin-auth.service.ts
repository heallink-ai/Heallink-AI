import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { randomBytes } from "crypto";
import * as bcrypt from "bcrypt";

import {
  AdminUser,
  AdminRole,
  UserRole,
} from "../users/entities/admin-user.entity";
import {
  AdminLoginDto,
  AdminRegisterDto,
  AdminPasswordResetRequestDto,
  AdminPasswordResetDto,
  UpdateAdminRoleDto,
  InitialAdminSetupDto,
} from "./dto/admin-auth.dto";
import { ADMIN_PERMISSIONS } from "./constants/admin-permissions.constant";
import { LoggingService } from "../logging/logging.service";
import { EmailService } from "../emails/email.service";

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
    private configService: ConfigService,
    private loggingService: LoggingService,
    private emailService: EmailService
  ) {
    this.loggingService.setContext("AdminAuthService");
  }

  /**
   * Register a new admin user (typically only called by superadmin)
   */
  async register(registerDto: AdminRegisterDto, creatorAdminRole: AdminRole) {
    const { email, password, name, adminRole } = registerDto;

    // Validate that adminRole is a valid enum value
    if (!Object.values(AdminRole).includes(adminRole as AdminRole)) {
      throw new BadRequestException("Invalid admin role");
    }

    // Check if creator has permission to create this type of admin
    if (
      creatorAdminRole !== AdminRole.SUPER_ADMIN &&
      (adminRole as AdminRole) === AdminRole.SUPER_ADMIN
    ) {
      throw new ForbiddenException(
        "Only super admins can create other super admins"
      );
    }

    // Check if user already exists
    const existingUser = await this.adminUserModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException("User with this email already exists");
    }

    // Generate a random password if none is provided
    const finalPassword = password || this.generateRandomPassword();

    // Get permissions for the role
    const adminRoleEnum = adminRole as AdminRole;
    const rolePermissions = ADMIN_PERMISSIONS[adminRoleEnum] || [];

    // Create new admin user
    const newUser = new this.adminUserModel({
      email,
      password: finalPassword, // Will be hashed by pre-save hook
      name,
      role: UserRole.ADMIN,
      adminRole: adminRoleEnum,
      permissions: rolePermissions,
    });

    // Save the user
    await newUser.save();

    // Send welcome email with credentials if this is a new admin
    try {
      await this.emailService.sendAdminWelcomeEmail(
        email,
        name,
        finalPassword // Send the unhashed password
      );
    } catch (error) {
      // Log the error but don't fail the request
      this.loggingService.error(
        `Failed to send admin welcome email to ${email}: ${error.message}`
      );
    }

    return {
      user: this.sanitizeUser(newUser),
    };
  }

  /**
   * Generate a random secure password
   * @private
   */
  private generateRandomPassword(): string {
    return randomBytes(12).toString("hex");
  }

  // ... rest of the auth service methods unchanged
}
