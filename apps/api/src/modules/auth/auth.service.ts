import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { User, AuthProvider, UserDocument } from '../users/schemas/user.schema';
import { SocialLoginDto } from './dto/social-login.dto';
import { SendOtpDto, VerifyOtpDto } from './dto/otp.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    
    if (user && await user.comparePassword(password)) {
      const { password, refreshToken, ...result } = user.toJSON();
      return result;
    }
    
    return null;
  }

  async validateUserByPhone(phone: string, password: string): Promise<any> {
    const user = await this.usersService.findByPhone(phone);
    
    if (user && await user.comparePassword(password)) {
      const { password, refreshToken, ...result } = user.toJSON();
      return result;
    }
    
    return null;
  }

  async register(registerDto: RegisterDto): Promise<any> {
    if (!registerDto.email && !registerDto.phone) {
      throw new BadRequestException('Either email or phone is required');
    }

    // Check if user already exists
    const existingUser = await this.usersService.validateUserExistenceByEmailOrPhone(
      registerDto.email,
      registerDto.phone,
    );

    if (existingUser) {
      throw new BadRequestException('User with this email or phone already exists');
    }

    // Create new user
    const user = await this.usersService.create({
      email: registerDto.email,
      phone: registerDto.phone,
      name: registerDto.name,
      password: registerDto.password,
      providers: [AuthProvider.LOCAL],
    });

    const { password, refreshToken, ...result } = user.toJSON();
    return result;
  }

  async login(user: any): Promise<{ accessToken: string; refreshToken: string; user: any }> {
    const payload = { sub: user._id, email: user.email, role: user.role };
    
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret') || 'dev-jwt-secret',
      expiresIn: this.configService.get<string>('jwt.expiresIn') || '15m',
    });
    
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret') || 'dev-jwt-refresh-secret',
      expiresIn: this.configService.get<string>('jwt.refreshExpiresIn') || '7d',
    });
    
    // Store the refresh token in the user document
    await this.usersService.updateRefreshToken(user._id.toString(), refreshToken);
    
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

  async refreshTokens(userId: string, refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
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
      secret: this.configService.get<string>('jwt.refreshSecret') || 'dev-jwt-refresh-secret',
      expiresIn: this.configService.get<string>('jwt.refreshExpiresIn') || '7d',
    });
    
    // Update the refresh token in the user document
    await this.usersService.updateRefreshToken(user._id.toString(), newRefreshToken);
    
    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.updateRefreshToken(userId, null);
  }

  async validateSocialLogin(socialLoginDto: SocialLoginDto): Promise<UserDocument> {
    // In a real-world app, you'd verify the token with the provider
    // For Google, Facebook, Apple, etc.
    
    // For demonstration, we'll mock the validation process
    let providerData;
    
    switch (socialLoginDto.provider) {
      case AuthProvider.GOOGLE:
        // In a real app, you'd call Google's API to verify the token
        providerData = {
          provider: AuthProvider.GOOGLE,
          providerId: 'google-123456', // This would be the ID from Google
          email: 'user@example.com', // This would come from Google's response
          name: 'User Name', // This would come from Google's response
        };
        break;
        
      case AuthProvider.FACEBOOK:
        // In a real app, you'd call Facebook's API to verify the token
        providerData = {
          provider: AuthProvider.FACEBOOK,
          providerId: 'facebook-123456', // This would be the ID from Facebook
          email: 'user@example.com', // This would come from Facebook's response
          name: 'User Name', // This would come from Facebook's response
        };
        break;
        
      case AuthProvider.APPLE:
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
    // In a real app, you'd verify the OTP against what was sent
    // For demonstration, we'll assume OTP is valid if it's 123456
    
    if (verifyOtpDto.otp !== '123456') {
      throw new UnauthorizedException('Invalid OTP');
    }
    
    // Find or create user with the given phone number
    let user = await this.usersService.findByPhone(verifyOtpDto.phone);
    
    if (!user) {
      // Create a new user with this phone number
      const createUserDto: CreateUserDto = {
        phone: verifyOtpDto.phone,
        providers: [AuthProvider.LOCAL],
      };
      
      createUserDto.phoneVerified = true;
      user = await this.usersService.create(createUserDto);
    } else {
      // Update phone verification status
      user = await this.usersService.update(user._id.toString(), { phoneVerified: true });
    }
    
    // Generate tokens and return
    return this.login(user);
  }
}