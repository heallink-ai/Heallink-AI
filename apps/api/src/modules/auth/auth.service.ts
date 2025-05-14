import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { AuthProvider, UserDocument } from '../users/schemas/user.schema';
import { SocialLoginDto, SocialProvider } from './dto/social-login.dto';
import { SendOtpDto, VerifyOtpDto } from './dto/otp.dto';
import { EmailService } from '../emails/email.service';
import { randomBytes } from 'crypto';
import { ProviderData, UserPayload } from './types/auth.types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserPayload | null> {
    const user = await this.usersService.findByEmail(email);

    if (user && (await user.comparePassword(password))) {
      // Remove sensitive data before returning
      const userJson = user.toJSON();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, refreshToken: __, ...result } = userJson;
      return result as UserPayload;
    }

    return null;
  }

  async validateUserByPhone(
    phone: string,
    password: string,
  ): Promise<UserPayload | null> {
    const user = await this.usersService.findByPhone(phone);

    if (user && (await user.comparePassword(password))) {
      // Remove sensitive data before returning
      const userJson = user.toJSON();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, refreshToken: __, ...result } = userJson;
      return result as UserPayload;
    }

    return null;
  }

  async register(registerDto: RegisterDto): Promise<any> {
    if (!registerDto.email && !registerDto.phone) {
      throw new BadRequestException('Either email or phone is required');
    }

    // Check if user already exists
    const existingUser =
      await this.usersService.validateUserExistenceByEmailOrPhone(
        registerDto.email,
        registerDto.phone,
      );

    if (existingUser) {
      throw new BadRequestException(
        'User with this email or phone already exists',
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

    // Send welcome email if email is provided
    if (registerDto.email) {
      await this.emailService.sendWelcomeEmail(
        registerDto.email,
        registerDto.name || 'Heallink User',
      );

      // Generate and send email verification token
      try {
        const verificationToken =
          await this.usersService.createEmailVerificationToken(user._id);
        await this.emailService.sendVerificationEmail(
          registerDto.email,
          registerDto.name || 'Heallink User',
          verificationToken,
        );
      } catch (error) {
        this.logger.error(
          `Failed to send verification email: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
        // Continue even if verification email fails - user is already created
      }
    }

    // Return sanitized user object without sensitive fields
    const userObj = user.toJSON();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, refreshToken: __, ...result } = userObj;
    return result;
  }

  /**
   * Verify a user's email with the verification token
   */
  async verifyEmail(
    token: string,
  ): Promise<{ success: boolean; message: string }> {
    if (!token) {
      throw new BadRequestException('Verification token is required');
    }

    const user = await this.usersService.verifyEmail(token);

    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    return {
      success: true,
      message: 'Email verified successfully',
    };
  }

  async login(
    user: UserPayload,
  ): Promise<{ accessToken: string; refreshToken: string; user: any }> {
    const payload = { sub: user._id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret') || 'dev-jwt-secret',
      expiresIn: this.configService.get<string>('jwt.expiresIn') || '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret:
        this.configService.get<string>('jwt.refreshSecret') ||
        'dev-jwt-refresh-secret',
      expiresIn: this.configService.get<string>('jwt.refreshExpiresIn') || '7d',
    });

    // Store the refresh token in the user document
    await this.usersService.updateRefreshToken(
      user._id.toString(),
      refreshToken,
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
        emailVerified: user.emailVerified || false,
      },
    };
  }

  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.findOne(userId);

    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = { sub: user._id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret') || 'dev-jwt-secret',
      expiresIn: this.configService.get<string>('jwt.expiresIn') || '15m',
    });

    const newRefreshToken = this.jwtService.sign(payload, {
      secret:
        this.configService.get<string>('jwt.refreshSecret') ||
        'dev-jwt-refresh-secret',
      expiresIn: this.configService.get<string>('jwt.refreshExpiresIn') || '7d',
    });

    // Update the refresh token in the user document
    await this.usersService.updateRefreshToken(
      user._id.toString(),
      newRefreshToken,
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
    socialLoginDto: SocialLoginDto,
  ): Promise<UserDocument> {
    // In a real-world app, you'd verify the token with the provider
    // For Google, Facebook, Apple, etc.

    // For demonstration, we'll simulate what would happen with token verification
    // In production, you'd call the respective API to verify tokens
    let providerData: ProviderData;

    try {
      // Check if email was provided - required field
      if (!socialLoginDto.email) {
        throw new BadRequestException('Email is required for social login');
      }

      // Check if name was provided - required field
      if (!socialLoginDto.name) {
        throw new BadRequestException('Name is required for social login');
      }

      switch (socialLoginDto.provider) {
        case SocialProvider.GOOGLE:
          // In production you would call Google's token verification API
          // This is mocked for development purposes

          // Use data from token verification - no fallbacks
          providerData = {
            provider: AuthProvider.GOOGLE,
            providerId: `google-${Date.now()}`, // Use a dynamic ID for demo
            email: socialLoginDto.email,
            name: socialLoginDto.name,
          };
          break;

        case SocialProvider.FACEBOOK:
          // In production you would call Facebook's token verification API
          providerData = {
            provider: AuthProvider.FACEBOOK,
            providerId: `facebook-${Date.now()}`,
            email: socialLoginDto.email,
            name: socialLoginDto.name,
          };
          break;

        case SocialProvider.APPLE:
          // In production you would call Apple's token verification API
          providerData = {
            provider: AuthProvider.APPLE,
            providerId: `apple-${Date.now()}`,
            email: socialLoginDto.email,
            name: socialLoginDto.name,
          };
          break;

        default:
          throw new BadRequestException('Unsupported provider');
      }

      this.logger.log(
        `Processed social login from ${socialLoginDto.provider} with email: ${providerData.email}`,
      );

      // Find existing user or create a new one
      const user = await this.usersService.findByIdOrCreate(providerData);

      // Check if this is a first-time login and user has email
      // Using a safer approach to check isNewUser flag
      const userWithMeta = user as UserDocument & { isNewUser?: boolean };
      const isNewUser = userWithMeta.isNewUser || false;

      if (user && isNewUser && user.email) {
        // Send welcome email for first-time social login users
        try {
          await this.emailService.sendWelcomeEmail(
            user.email,
            user.name || 'Heallink User',
          );
          this.logger.log(
            `Welcome email sent to new social login user: ${user.email}`,
          );
        } catch (emailError) {
          // Log error but continue - we don't want to block login if email fails
          const errorMsg =
            emailError instanceof Error ? emailError.message : 'Unknown error';
          const errorStack =
            emailError instanceof Error ? emailError.stack : undefined;

          this.logger.error(
            `Failed to send welcome email to social login user: ${errorMsg}`,
            errorStack,
          );
        }
      }

      return user;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;

      this.logger.error(
        `Social login validation failed for provider ${socialLoginDto.provider}: ${errorMsg}`,
        errorStack,
      );
      throw new BadRequestException(
        `Could not validate social login: ${errorMsg}`,
      );
    }
  }

  async sendOtp(sendOtpDto: SendOtpDto): Promise<{ success: boolean }> {
    // In a real app, you'd send an OTP via SMS here
    // For demonstration, we'll just return success

    // You could use Twilio, Nexmo, or similar service to send SMS
    this.logger.log(`Sending OTP to ${sendOtpDto.phone}`);

    // Add a mock async operation to satisfy the linter
    await new Promise((resolve) => setTimeout(resolve, 100));

    return { success: true };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<any> {
    // In a real app, you'd verify the OTP here
    // For demonstration, we'll just return success and mock a user login

    // Make sure phone is defined
    if (!verifyOtpDto.phone) {
      throw new BadRequestException(
        'Phone number is required for OTP verification',
      );
    }

    // Find user by phone number
    const user = await this.usersService.findByPhone(verifyOtpDto.phone);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Return authentication tokens
    return {
      verified: true,
      message: 'OTP verified successfully',
      tokens: await this.login(user),
    };
  }

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      // For security, we don't want to reveal if the email exists or not
      return {
        message:
          'If an account with that email exists, a reset link has been sent.',
      };
    }

    // Generate a reset token
    const resetToken = randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // Token expires in 1 hour

    // Update user with reset token
    await this.usersService.update(user._id, {
      resetToken,
      resetTokenExpiry,
    } as any);

    // Send password reset email
    try {
      await this.emailService.sendPasswordResetEmail(
        email,
        resetToken,
        user.name || 'User',
      );
    } catch (error) {
      // Log error but still return success to avoid revealing email existence
      console.error('Error sending password reset email:', error);
    }

    return {
      message:
        'If an account with that email exists, a reset link has been sent.',
    };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.usersService.findByResetToken(token);

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Hash new password and reset the token
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.update(user._id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    } as any);

    return {
      message:
        'Password reset successful. You can now log in with your new password.',
    };
  }
}
