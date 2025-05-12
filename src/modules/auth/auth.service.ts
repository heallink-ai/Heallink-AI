import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { RegisterDto } from "./dto/register.dto";
import { User, AuthProvider, UserDocument } from "../users/schemas/user.schema";
import { SocialLoginDto } from "./dto/social-login.dto";
import { SendOtpDto, VerifyOtpDto } from "./dto/otp.dto";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { SocialProvider } from "./dto/social-login.dto";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { randomBytes } from "crypto";
import { EmailService } from "../emails/email.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (user && (await user.comparePassword(password))) {
      const {
        password: _password,
        refreshToken: _refreshToken,
        ...result
      } = user.toJSON();
      return result;
    }

    return null;
  }

  async validateUserByPhone(phone: string, password: string): Promise<any> {
    const user = await this.usersService.findByPhone(phone);

    if (user && (await user.comparePassword(password))) {
      const {
        password: _password,
        refreshToken: _refreshToken,
        ...result
      } = user.toJSON();
      return result;
    }

    return null;
  }

  async register(registerDto: RegisterDto): Promise<any> {
    if (!registerDto.email && !registerDto.phone) {
      throw new BadRequestException("Either email or phone is required");
    }

    // Check if user already exists
    const existingUser =
      await this.usersService.validateUserExistenceByEmailOrPhone(
        registerDto.email,
        registerDto.phone
      );

    if (existingUser) {
      throw new BadRequestException(
        "User with this email or phone already exists"
      );
    }

    // Create new user
    const user = await this.usersService.create({
      email: registerDto.email,
      phone: registerDto.phone,
      name: registerDto.name,
      password: registerDto.password,
      providers: [AuthProvider.LOCAL],
    });

    // Send welcome email (non-blocking)
    if (registerDto.email) {
      this.emailService
        .sendWelcomeEmail(registerDto.email, registerDto.name || "New User")
        .catch((error) => {
          // Just log error but don't block registration
          console.error("Failed to send welcome email:", error);
        });
    }

    // Return sanitized user object without sensitive fields
    const userObj = user.toJSON();
    const {
      password: _password,
      refreshToken: _refreshToken,
      ...result
    } = userObj;
    return result;
  }

  async login(
    user: any
  ): Promise<{ accessToken: string; refreshToken: string; user: any }> {
    const payload = { sub: user._id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("jwt.secret") || "dev-jwt-secret",
      expiresIn: this.configService.get<string>("jwt.expiresIn") || "15m",
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret:
        this.configService.get<string>("jwt.refreshSecret") ||
        "dev-jwt-refresh-secret",
      expiresIn: this.configService.get<string>("jwt.refreshExpiresIn") || "7d",
    });

    // Store the refresh token in the user document
    await this.usersService.updateRefreshToken(
      user._id.toString(),
      refreshToken
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        role: user.role,
      },
    };
  }

  async refreshTokens(
    userId: string,
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.findOne(userId);

    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const payload = { sub: user._id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("jwt.secret") || "dev-jwt-secret",
      expiresIn: this.configService.get<string>("jwt.expiresIn") || "15m",
    });

    const newRefreshToken = this.jwtService.sign(payload, {
      secret:
        this.configService.get<string>("jwt.refreshSecret") ||
        "dev-jwt-refresh-secret",
      expiresIn: this.configService.get<string>("jwt.refreshExpiresIn") || "7d",
    });

    // Update the refresh token in the user document
    await this.usersService.updateRefreshToken(
      user._id.toString(),
      newRefreshToken
    );

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.updateRefreshToken(userId, null);
  }

  async validateSocialLogin(
    socialLoginDto: SocialLoginDto
  ): Promise<UserDocument> {
    // In a real-world app, you'd verify the token with the provider
    // For Google, Facebook, Apple, etc.

    // For demonstration, we'll mock the validation process
    let providerData;

    switch (socialLoginDto.provider) {
      case SocialProvider.GOOGLE:
        // In a real app, you'd call Google's API to verify the token
        providerData = {
          provider: AuthProvider.GOOGLE,
          providerId: "google-123456", // This would be the ID from Google
          email: "user@example.com", // This would come from Google's response
          name: "User Name", // This would come from Google's response
        };
        break;

      case SocialProvider.FACEBOOK:
        // In a real app, you'd call Facebook's API to verify the token
        providerData = {
          provider: AuthProvider.FACEBOOK,
          providerId: "facebook-123456", // This would be the ID from Facebook
          email: "user@example.com", // This would come from Facebook's response
          name: "User Name", // This would come from Facebook's response
        };
        break;

      case SocialProvider.APPLE:
        // In a real app, you'd call Apple's API to verify the token
        providerData = {
          provider: AuthProvider.APPLE,
          providerId: "apple-123456", // This would be the ID from Apple
          email: "user@example.com", // This would come from Apple's response
          name: "User Name", // This would come from Apple's response
        };
        break;

      default:
        throw new BadRequestException("Unsupported provider");
    }

    // Find existing user or create a new one
    const user = await this.usersService.findByIdOrCreate(providerData);

    // Send welcome email if this is a new user (check createdAt vs updatedAt)
    if (user.createdAt.getTime() === user.updatedAt.getTime() && user.email) {
      this.emailService
        .sendWelcomeEmail(user.email, user.name || "New User")
        .catch((error) => {
          // Just log error but don't block login
          console.error("Failed to send welcome email:", error);
        });
    }

    return user;
  }

  async sendOtp(sendOtpDto: SendOtpDto): Promise<{ success: boolean }> {
    // In a real app, you'd send an OTP via SMS here
    // For demonstration, we'll just return success

    // You could use Twilio, Nexmo, or similar service to send SMS
    console.log(`Sending OTP to ${sendOtpDto.phone}`);

    return { success: true };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<any> {
    // In a real app, you'd verify the OTP against what was sent
    // For demonstration, we'll assume OTP is valid if it's 123456

    if (verifyOtpDto.code !== "123456") {
      throw new UnauthorizedException("Invalid OTP");
    }

    // Find or create user with the given phone number
    if (!verifyOtpDto.phone && !verifyOtpDto.email) {
      throw new BadRequestException("Either phone or email is required");
    }

    let user;

    if (verifyOtpDto.phone) {
      user = await this.usersService.findByPhone(verifyOtpDto.phone);
    } else if (verifyOtpDto.email) {
      user = await this.usersService.findByEmail(verifyOtpDto.email);
    }

    if (!user) {
      // Create a new user with this phone number or email
      const createUserDto: CreateUserDto = {
        phone: verifyOtpDto.phone,
        email: verifyOtpDto.email,
        providers: [AuthProvider.LOCAL],
      };

      if (verifyOtpDto.phone) {
        createUserDto.phoneVerified = true;
      } else {
        createUserDto.emailVerified = true;
      }

      user = await this.usersService.create(createUserDto);

      // Send welcome email for new users
      if (verifyOtpDto.email) {
        this.emailService
          .sendWelcomeEmail(verifyOtpDto.email, user.name || "New User")
          .catch((error) => {
            // Just log error but don't block verification
            console.error("Failed to send welcome email:", error);
          });
      }
    } else {
      // Update verification status
      const updateData: any = {};

      if (verifyOtpDto.phone) {
        updateData.phoneVerified = true;
      } else if (verifyOtpDto.email) {
        updateData.emailVerified = true;
      }

      user = await this.usersService.update(user._id.toString(), updateData);
    }

    // Generate tokens and return
    return this.login(user);
  }

  /**
   * Request a password reset for a user
   */
  async requestPasswordReset(email: string): Promise<{ success: boolean }> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      // Don't reveal whether the email exists or not for security
      return { success: true };
    }

    // Generate a reset token
    const resetToken = randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setMinutes(
      resetTokenExpiry.getMinutes() +
        (this.configService.get<number>("email.passwordResetExpiryMinutes") ||
          30)
    );

    // Save the reset token to the user
    await this.usersService.update(user._id.toString(), {
      resetToken,
      resetTokenExpiry,
    });

    // Send the password reset email
    await this.emailService.sendPasswordResetEmail(
      email,
      resetToken,
      user.name || "User"
    );

    return { success: true };
  }

  /**
   * Reset a user's password using a valid reset token
   */
  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ success: boolean }> {
    // Find user with this reset token and valid expiry
    const user = await this.usersService.findByResetToken(token);

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new UnauthorizedException("Invalid or expired reset token");
    }

    // Hash the new password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password and clear the reset token
    await this.usersService.update(user._id.toString(), {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    });

    return { success: true };
  }
}
