import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { AuthProvider, UserDocument } from '../users/schemas/user.schema';
import { SocialLoginDto } from './dto/social-login.dto';
import { SendOtpDto, VerifyOtpDto } from './dto/otp.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SocialProvider } from './dto/social-login.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { EmailService } from '../emails/email.service';
import { randomBytes } from 'crypto';

interface UserPayload {
  _id: string;
  email?: string;
  phone?: string;
  name?: string;
  role: string;
  [key: string]: any;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (user && (await user.comparePassword(password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
          `Failed to send verification email: ${error.message}`,
        );
        // Continue even if verification email fails - user is already created
      }
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
        emailVerified: user.emailVerified,
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

    // For demonstration, we'll mock the validation process
    let providerData;

    switch (socialLoginDto.provider) {
      case SocialProvider.GOOGLE:
        // In a real app, you'd call Google's API to verify the token
        providerData = {
          provider: AuthProvider.GOOGLE,
          providerId: 'google-123456', // This would be the ID from Google
          email: 'user@example.com', // This would come from Google's response
          name: 'User Name', // This would come from Google's response
        };
        break;

      case SocialProvider.FACEBOOK:
        // In a real app, you'd call Facebook's API to verify the token
        providerData = {
          provider: AuthProvider.FACEBOOK,
          providerId: 'facebook-123456', // This would be the ID from Facebook
          email: 'user@example.com', // This would come from Facebook's response
          name: 'User Name', // This would come from Facebook's response
        };
        break;

      case SocialProvider.APPLE:
        // In a real app, you'd call Apple's API to verify the token
        providerData = {
          provider: AuthProvider.APPLE,
          providerId: 'apple-123456', // This would be the ID from Apple
          email: 'user@example.com', // This would come from Apple's response
          name: 'User Name', // This would come from Apple's response
        };
        break;

      default:
        throw new BadRequestException('Unsupported provider');
    }

    // Find existing user or create a new one
    return this.usersService.findByIdOrCreate(providerData);
  }

  async sendOtp(sendOtpDto: SendOtpDto): Promise<{ success: boolean }> {
    // In a real app, you'd send an OTP via SMS here
    // For demonstration, we'll just return success

    // You could use Twilio, Nexmo, or similar service to send SMS
    console.log(`Sending OTP to ${sendOtpDto.phone}`);

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
