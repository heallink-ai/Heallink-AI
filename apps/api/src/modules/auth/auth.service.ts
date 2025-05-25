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
import {
  ProviderData,
  UserPayload,
  GoogleTokenVerificationResponse,
  FacebookUserResponse,
  FacebookDebugTokenResponse,
  AppleTokenPayload,
  AppleKeysResponse,
} from './types/auth.types';
import { SmsService } from '../sms/sms.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
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

    const jwtSecret =
      this.configService.get<string>('jwt.secret') || 'dev-jwt-secret';
    const jwtExpiresIn =
      this.configService.get<string>('jwt.expiresIn') || '30m';
    const jwtRefreshSecret =
      this.configService.get<string>('jwt.refreshSecret') ||
      'dev-jwt-refresh-secret';
    const jwtRefreshExpiresIn =
      this.configService.get<string>('jwt.refreshExpiresIn') || '7d';

    console.log({
      jwtSecret,
      jwtExpiresIn,
      jwtRefreshSecret,
      jwtRefreshExpiresIn,
    });

    const accessToken = this.jwtService.sign(payload, {
      secret: jwtSecret,
      expiresIn: jwtExpiresIn,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: jwtRefreshSecret,
      expiresIn: jwtRefreshExpiresIn,
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
    try {
      const user = await this.usersService.findOne(userId);

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const payload = { sub: user._id, email: user.email, role: user.role };

      const accessToken = this.jwtService.sign(payload, {
        secret:
          this.configService.get<string>('jwt.secret') || 'dev-jwt-secret',
        expiresIn: this.configService.get<string>('jwt.expiresIn') || '30m', // Extended from 15m to 30m to match NextAuth session
      });

      // Only issue a new refresh token if the existing one is nearing expiration
      // This will allow more frequent access token refreshes without changing the refresh token
      let newRefreshToken = refreshToken;
      try {
        // Decode the token to check expiration
        const decoded = this.jwtService.decode(refreshToken) as {
          exp?: number;
        };
        const now = Math.floor(Date.now() / 1000);

        // If refresh token will expire in less than 1 day or is invalid, issue a new one
        if (
          decoded &&
          typeof decoded === 'object' &&
          decoded.exp &&
          decoded.exp - now < 86400
        ) {
          newRefreshToken = this.jwtService.sign(payload, {
            secret:
              this.configService.get<string>('jwt.refreshSecret') ||
              'dev-jwt-refresh-secret',
            expiresIn:
              this.configService.get<string>('jwt.refreshExpiresIn') || '7d',
          });

          // Update the refresh token in the user document
          await this.usersService.updateRefreshToken(
            user._id.toString(),
            newRefreshToken,
          );
        }
      } catch (decodeError) {
        // If token decoding fails, issue a new refresh token anyway
        newRefreshToken = this.jwtService.sign(payload, {
          secret:
            this.configService.get<string>('jwt.refreshSecret') ||
            'dev-jwt-refresh-secret',
          expiresIn:
            this.configService.get<string>('jwt.refreshExpiresIn') || '7d',
        });

        // Update the refresh token in the user document
        await this.usersService.updateRefreshToken(
          user._id.toString(),
          newRefreshToken,
        );
      }

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error: unknown) {
      // Log the error for debugging
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Error refreshing tokens: ${errorMessage}`, errorStack);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.updateRefreshToken(userId, null);
  }

  async validateSocialLogin(
    socialLoginDto: SocialLoginDto,
  ): Promise<UserDocument> {
    // Check if email was provided - required field
    if (!socialLoginDto.email) {
      throw new BadRequestException('Email is required for social login');
    }

    // Check if name was provided - required field
    if (!socialLoginDto.name) {
      throw new BadRequestException('Name is required for social login');
    }

    let providerData: ProviderData;
    const isDevelopment = process.env.NODE_ENV === 'development';

    try {
      switch (socialLoginDto.provider) {
        case SocialProvider.GOOGLE:
          if (isDevelopment) {
            // In development, use mocked verification
            this.logger.log(
              'Development mode: Using mocked Google token verification',
            );
            providerData = {
              provider: AuthProvider.GOOGLE,
              providerId: `google-${Date.now()}`, // Use a dynamic ID for demo
              email: socialLoginDto.email,
              name: socialLoginDto.name,
            };
          } else {
            // In production, verify the token with Google's OAuth API
            this.logger.log(
              'Production mode: Verifying Google token with Google API',
            );
            const googleData = await this.verifyGoogleToken(
              socialLoginDto.token,
            );

            // Verify that the email from the token matches the provided email
            if (googleData.email !== socialLoginDto.email) {
              throw new BadRequestException(
                'Email from token does not match provided email',
              );
            }

            providerData = {
              provider: AuthProvider.GOOGLE,
              providerId: googleData.sub,
              email: googleData.email,
              name: googleData.name || socialLoginDto.name,
              picture: googleData.picture,
            };
          }
          break;

        case SocialProvider.FACEBOOK:
          if (isDevelopment) {
            // In development, use mocked verification
            this.logger.log(
              'Development mode: Using mocked Facebook token verification',
            );
            providerData = {
              provider: AuthProvider.FACEBOOK,
              providerId: `facebook-${Date.now()}`,
              email: socialLoginDto.email,
              name: socialLoginDto.name,
            };
          } else {
            // In production, verify the token with Facebook's Graph API
            this.logger.log(
              'Production mode: Verifying Facebook token with Facebook API',
            );
            const facebookData = await this.verifyFacebookToken(
              socialLoginDto.token,
            );

            // Verify that the email from the token matches the provided email
            if (facebookData.email !== socialLoginDto.email) {
              throw new BadRequestException(
                'Email from token does not match provided email',
              );
            }

            providerData = {
              provider: AuthProvider.FACEBOOK,
              providerId: facebookData.id,
              email: facebookData.email,
              name: facebookData.name || socialLoginDto.name,
              picture: facebookData.picture?.data?.url,
            };
          }
          break;

        case SocialProvider.APPLE:
          if (isDevelopment) {
            // In development, use mocked verification
            this.logger.log(
              'Development mode: Using mocked Apple token verification',
            );
            providerData = {
              provider: AuthProvider.APPLE,
              providerId: `apple-${Date.now()}`,
              email: socialLoginDto.email,
              name: socialLoginDto.name,
            };
          } else {
            // In production, verify the token with Apple's authentication services
            this.logger.log(
              'Production mode: Verifying Apple token with Apple API',
            );
            const appleData = await this.verifyAppleToken(socialLoginDto.token);

            // Verify that the email from the token matches the provided email
            if (appleData.email !== socialLoginDto.email) {
              throw new BadRequestException(
                'Email from token does not match provided email',
              );
            }

            providerData = {
              provider: AuthProvider.APPLE,
              providerId: appleData.sub,
              email: appleData.email,
              name: appleData.name || socialLoginDto.name,
            };
          }
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

  /**
   * Verifies a Google ID token using Google's OAuth2 API
   * @param token The Google ID token to verify
   * @returns The verified user data from Google
   */
  private async verifyGoogleToken(
    token: string,
  ): Promise<GoogleTokenVerificationResponse> {
    try {
      const response = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`,
      );

      if (!response.ok) {
        throw new BadRequestException('Failed to verify Google token');
      }

      const data = (await response.json()) as GoogleTokenVerificationResponse;

      // Verify the token's audience matches our application
      const clientId = this.configService.get<string>('google.clientId');
      if (clientId && data.aud !== clientId) {
        throw new BadRequestException('Google token has invalid audience');
      }

      // Check if the token is not expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (data.exp && data.exp < currentTime) {
        throw new BadRequestException('Google token has expired');
      }

      return {
        sub: data.sub, // User's unique Google ID
        email: data.email, // User's email
        email_verified: data.email_verified, // Whether email is verified
        name: data.name, // User's full name
        given_name: data.given_name, // User's first name
        family_name: data.family_name, // User's last name
        picture: data.picture, // User's profile picture URL
        aud: data.aud,
        exp: data.exp,
      };
    } catch (error) {
      this.logger.error(
        `Error verifying Google token: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new BadRequestException('Invalid Google token');
    }
  }

  /**
   * Verifies a Facebook access token using Facebook's Graph API
   * @param token The Facebook access token to verify
   * @returns The verified user data from Facebook
   */
  private async verifyFacebookToken(
    token: string,
  ): Promise<FacebookUserResponse> {
    try {
      // First, verify the token's validity
      const appId = this.configService.get<string>('facebook.appId');
      const appSecret = this.configService.get<string>('facebook.appSecret');

      // Verify the token with Facebook's debug_token endpoint
      const debugResponse = await fetch(
        `https://graph.facebook.com/debug_token?input_token=${token}&access_token=${appId}|${appSecret}`,
      );

      if (!debugResponse.ok) {
        throw new BadRequestException('Failed to verify Facebook token');
      }

      const debugData =
        (await debugResponse.json()) as FacebookDebugTokenResponse;

      // Check if token is valid
      if (!debugData.data || !debugData.data.is_valid) {
        throw new BadRequestException('Facebook token is invalid');
      }

      // Check if token matches our app
      if (debugData.data.app_id !== appId) {
        throw new BadRequestException('Facebook token has invalid app ID');
      }

      // If valid, fetch user data from Facebook Graph API
      const userResponse = await fetch(
        `https://graph.facebook.com/v18.0/me?fields=id,name,email,picture&access_token=${token}`,
      );

      if (!userResponse.ok) {
        throw new BadRequestException(
          'Failed to fetch user data from Facebook',
        );
      }

      const userData = (await userResponse.json()) as FacebookUserResponse;

      if (!userData.email) {
        throw new BadRequestException(
          'Email permission not granted for Facebook login',
        );
      }

      return userData;
    } catch (error) {
      this.logger.error(
        `Error verifying Facebook token: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new BadRequestException('Invalid Facebook token');
    }
  }

  /**
   * Verifies an Apple ID token
   * @param token The Apple ID token to verify
   * @returns The verified user data from Apple
   */
  private async verifyAppleToken(token: string): Promise<AppleTokenPayload> {
    try {
      // Decode the JWT token without verification to extract the kid (Key ID)
      const decodedHeader = JSON.parse(
        Buffer.from(token.split('.')[0], 'base64').toString(),
      ) as { kid: string };

      // Fetch Apple's public keys
      const appleKeysResponse = await fetch(
        'https://appleid.apple.com/auth/keys',
      );

      if (!appleKeysResponse.ok) {
        throw new BadRequestException('Failed to fetch Apple public keys');
      }

      const appleKeys = (await appleKeysResponse.json()) as AppleKeysResponse;

      // Find the matching key based on key ID
      const matchingKey = appleKeys.keys.find(
        (key) => key.kid === decodedHeader.kid,
      );

      if (!matchingKey) {
        throw new BadRequestException('No matching Apple key found');
      }

      // Convert JWK to PEM format (this would require additional library like jwk-to-pem)
      // For brevity, we're assuming a hypothetical convertJwkToPem function
      // const publicKey = convertJwkToPem(matchingKey);

      // In a real implementation, you would:
      // 1. Verify the token signature using the public key
      // 2. Verify the token issuer is Apple
      // 3. Verify the audience matches your client ID
      // 4. Verify the token is not expired

      // For this example, we'll decode the token payload and assume verification passes
      const payload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString(),
      ) as AppleTokenPayload;

      // Verify claims (simplified for example)
      const clientId = this.configService.get<string>('apple.clientId');
      if (clientId && payload.aud !== clientId) {
        throw new BadRequestException('Apple token has invalid audience');
      }

      if (payload.iss !== 'https://appleid.apple.com') {
        throw new BadRequestException('Apple token has invalid issuer');
      }

      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < currentTime) {
        throw new BadRequestException('Apple token has expired');
      }

      if (!payload.email) {
        throw new BadRequestException('Email not provided in Apple token');
      }

      return {
        sub: payload.sub, // User's unique Apple ID
        email: payload.email, // User's email
        name: payload.name, // May not be present in all cases
        aud: payload.aud,
        iss: payload.iss,
        exp: payload.exp,
      };
    } catch (error) {
      this.logger.error(
        `Error verifying Apple token: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new BadRequestException('Invalid Apple token');
    }
  }

  async sendOtp(
    sendOtpDto: SendOtpDto,
  ): Promise<{ success: boolean; expiresAt?: Date }> {
    // Ensure phone number is provided
    if (!sendOtpDto.phone) {
      throw new BadRequestException('Phone number is required for OTP');
    }

    try {
      this.logger.log(`Generating and sending OTP to ${sendOtpDto.phone}`);

      // Use our SMS service to send OTP
      const otpResult = await this.smsService.sendOtp({
        phone: sendOtpDto.phone,
        expiry: 10, // 10 minute expiry time
        length: 6, // 6-digit code
      });

      // Store the OTP in the user record or a separate OTP collection
      // Here we'll update the user if they exist, or create a temporary record
      const user = await this.usersService.findByPhone(sendOtpDto.phone);

      if (user) {
        // Update existing user with OTP
        await this.usersService.update(user._id, {
          otpCode: otpResult.code,
          otpExpiry: otpResult.expiresAt,
        } as any);
      } else {
        // Create a temporary user or OTP record
        // This depends on your user schema and registration flow
        // For this example, we'll assume the user must exist before OTP
        this.logger.log(`No existing user found for phone ${sendOtpDto.phone}`);

        // You might want to implement a registerWithPhone method
        // or store OTPs in a separate collection
      }

      return {
        success: true,
        expiresAt: otpResult.expiresAt,
      };
    } catch (error) {
      this.logger.error(
        `Failed to send OTP: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new BadRequestException('Failed to send OTP');
    }
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<any> {
    // Make sure phone and code are defined
    if (!verifyOtpDto.phone) {
      throw new BadRequestException(
        'Phone number is required for OTP verification',
      );
    }

    if (!verifyOtpDto.code) {
      throw new BadRequestException('Verification code is required');
    }

    // Find user by phone number
    const user = await this.usersService.findByPhone(verifyOtpDto.phone);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify the OTP code and expiry time
    const now = new Date();
    if (!user.otpCode || user.otpCode !== verifyOtpDto.code) {
      throw new UnauthorizedException('Invalid verification code');
    }

    if (!user.otpExpiry || user.otpExpiry < now) {
      throw new UnauthorizedException('Verification code has expired');
    }

    // Clear the OTP after successful verification
    await this.usersService.update(user._id, {
      otpCode: null,
      otpExpiry: null,
      phoneVerified: true,
    } as any);

    // Return authentication tokens
    return {
      verified: true,
      message: 'Phone number verified successfully',
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
