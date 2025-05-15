import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { EmailService } from '../emails/email.service';
import { RegisterDto } from './dto/register.dto';
import { AuthProvider, UserRole } from '../users/schemas/user.schema';
import mongoose from 'mongoose';
import { SocialLoginDto, SocialProvider } from './dto/social-login.dto';
import { UserDocument } from '../users/schemas/user.schema';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    findByPhone: jest.fn(),
    validateUserExistenceByEmailOrPhone: jest.fn(),
    create: jest.fn(),
    createEmailVerificationToken: jest.fn(),
    verifyEmail: jest.fn(),
    updateRefreshToken: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    createPasswordResetToken: jest.fn(),
    resetPassword: jest.fn(),
    createPhoneOtp: jest.fn(),
    verifyPhoneOtp: jest.fn(),
    findBySocialId: jest.fn(),
    connectSocialAccount: jest.fn(),
    upsertSocialUser: jest.fn(),
    findByIdOrCreate: jest.fn(),
    findByResetToken: jest.fn(),
    update: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config = {
        'jwt.secret': 'test-jwt-secret',
        'jwt.expiresIn': '15m',
        'jwt.refreshSecret': 'test-jwt-refresh-secret',
        'jwt.refreshExpiresIn': '7d',
        'frontend.url': 'http://localhost:3000',
      };
      return config[key] || null;
    }),
  };

  const mockEmailService = {
    sendWelcomeEmail: jest.fn(),
    sendVerificationEmail: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: EmailService, useValue: mockEmailService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user when credentials are valid', async () => {
      const mockId = new mongoose.Types.ObjectId();
      const mockUser = {
        _id: mockId,
        email: 'test@example.com',
        role: UserRole.USER,
        comparePassword: jest.fn().mockResolvedValue(true),
        toJSON: jest.fn().mockReturnValue({
          _id: mockId,
          email: 'test@example.com',
          role: UserRole.USER,
          password: 'hashed_password',
          refreshToken: 'refresh_token',
        }),
      };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      const result = await service.validateUser('test@example.com', 'password');

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(mockUser.comparePassword).toHaveBeenCalledWith('password');
      expect(result).toBeDefined();
      expect(result).not.toHaveProperty('password');
      expect(result).not.toHaveProperty('refreshToken');
    });

    it('should return null when credentials are invalid', async () => {
      const mockUser = {
        email: 'test@example.com',
        comparePassword: jest.fn().mockResolvedValue(false),
      };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      const result = await service.validateUser(
        'test@example.com',
        'wrong_password',
      );

      expect(result).toBeNull();
    });
  });

  describe('validateUserByPhone', () => {
    it('should return user when phone credentials are valid', async () => {
      const mockId = new mongoose.Types.ObjectId();
      const mockUser = {
        _id: mockId,
        phone: '+1234567890',
        role: UserRole.USER,
        comparePassword: jest.fn().mockResolvedValue(true),
        toJSON: jest.fn().mockReturnValue({
          _id: mockId,
          phone: '+1234567890',
          role: UserRole.USER,
          password: 'hashed_password',
          refreshToken: 'refresh_token',
        }),
      };

      mockUsersService.findByPhone.mockResolvedValue(mockUser);

      const result = await service.validateUserByPhone(
        '+1234567890',
        'password',
      );

      expect(mockUsersService.findByPhone).toHaveBeenCalledWith('+1234567890');
      expect(mockUser.comparePassword).toHaveBeenCalledWith('password');
      expect(result).toBeDefined();
      expect(result).not.toHaveProperty('password');
      expect(result).not.toHaveProperty('refreshToken');
    });
  });

  describe('register', () => {
    it('should register a new user successfully with email', async () => {
      const registerDto: RegisterDto = {
        email: 'newuser@example.com',
        name: 'New User',
        password: 'Password123',
      };

      const userId = new mongoose.Types.ObjectId();
      const mockUser = {
        _id: userId,
        email: 'newuser@example.com',
        name: 'New User',
        toJSON: jest.fn().mockReturnValue({
          _id: userId,
          email: 'newuser@example.com',
          name: 'New User',
          password: 'hashed_password',
          refreshToken: null,
        }),
      };

      mockUsersService.validateUserExistenceByEmailOrPhone.mockResolvedValue(
        null,
      );
      mockUsersService.create.mockResolvedValue(mockUser);
      mockUsersService.createEmailVerificationToken.mockResolvedValue(
        'verification-token',
      );

      const result = await service.register(registerDto);

      expect(
        mockUsersService.validateUserExistenceByEmailOrPhone,
      ).toHaveBeenCalledWith('newuser@example.com', undefined);
      expect(mockUsersService.create).toHaveBeenCalledWith({
        email: 'newuser@example.com',
        phone: undefined,
        name: 'New User',
        password: 'Password123',
        providers: [AuthProvider.LOCAL],
      });
      expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith(
        'newuser@example.com',
        'New User',
      );
      expect(
        mockUsersService.createEmailVerificationToken,
      ).toHaveBeenCalledWith(userId);
      expect(mockEmailService.sendVerificationEmail).toHaveBeenCalledWith(
        'newuser@example.com',
        'New User',
        'verification-token',
      );
      expect(result).toBeDefined();
      expect(result).not.toHaveProperty('password');
      expect(result).not.toHaveProperty('refreshToken');
    });

    it('should throw BadRequestException if user already exists', async () => {
      const registerDto: RegisterDto = {
        email: 'existing@example.com',
        password: 'Password123',
        name: 'Existing User',
      };

      mockUsersService.validateUserExistenceByEmailOrPhone.mockResolvedValue({
        email: 'existing@example.com',
      });

      await expect(service.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(
        mockUsersService.validateUserExistenceByEmailOrPhone,
      ).toHaveBeenCalledWith('existing@example.com', undefined);
    });

    it('should throw BadRequestException if neither email nor phone is provided', async () => {
      const registerDto: RegisterDto = {
        name: 'New User',
        password: 'Password123',
      } as RegisterDto; // Type assertion to simulate invalid input

      await expect(service.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('verifyEmail', () => {
    it('should verify email successfully', async () => {
      const token = 'valid-verification-token';
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        email: 'test@example.com',
        emailVerified: true,
      };

      mockUsersService.verifyEmail.mockResolvedValue(mockUser);

      const result = await service.verifyEmail(token);

      expect(mockUsersService.verifyEmail).toHaveBeenCalledWith(token);
      expect(result).toEqual({
        success: true,
        message: 'Email verified successfully',
      });
    });

    it('should throw BadRequestException if token is not provided', async () => {
      await expect(service.verifyEmail('')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if token is invalid', async () => {
      mockUsersService.verifyEmail.mockResolvedValue(null);

      await expect(service.verifyEmail('invalid-token')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('login', () => {
    it('should generate tokens and update refresh token', async () => {
      const userId = new mongoose.Types.ObjectId();
      const user = {
        _id: userId.toString(), // Convert to string for test
        email: 'test@example.com',
        role: UserRole.USER,
        name: 'Test User',
        emailVerified: true,
      };

      mockJwtService.sign
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');

      const result = await service.login(user);

      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
      expect(mockUsersService.updateRefreshToken).toHaveBeenCalledWith(
        user._id,
        'refresh-token',
      );
      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: {
          id: user._id,
          email: user.email,
          phone: undefined,
          name: user.name,
          role: user.role,
          emailVerified: user.emailVerified,
        },
      });
    });
  });

  describe('validateSocialLogin', () => {
    beforeEach(() => {
      // Store original NODE_ENV
      process.env.NODE_ENV = 'development';
    });

    it('should validate Google social login', async () => {
      // Mock data
      const socialLoginDto: SocialLoginDto = {
        provider: SocialProvider.GOOGLE,
        token: 'google-token',
        email: 'test@gmail.com',
        name: 'Test User',
      };

      const mockUser = { id: 'google-user-id' } as UserDocument;

      // Mocking findByIdOrCreate
      mockUsersService.findByIdOrCreate.mockResolvedValue(mockUser);

      // Call the service method
      const result = await service.validateSocialLogin(socialLoginDto);

      // Assertions
      expect(result).toEqual(mockUser);
      expect(mockUsersService.findByIdOrCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          provider: AuthProvider.GOOGLE,
        }),
      );
    });

    it('should validate Facebook social login', async () => {
      // Mock data
      const socialLoginDto: SocialLoginDto = {
        provider: SocialProvider.FACEBOOK,
        token: 'facebook-token',
        email: 'test@facebook.com',
        name: 'Test User',
      };

      const mockUser = { id: 'facebook-user-id' } as UserDocument;

      // Mocking findByIdOrCreate
      mockUsersService.findByIdOrCreate.mockResolvedValue(mockUser);

      // Call the service method
      const result = await service.validateSocialLogin(socialLoginDto);

      // Assertions
      expect(result).toEqual(mockUser);
      expect(mockUsersService.findByIdOrCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          provider: AuthProvider.FACEBOOK,
        }),
      );
    });

    it('should verify tokens in production mode', async () => {
      // Set to production mode
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      // Spy on the verification methods
      const verifyGoogleSpy = jest
        .spyOn(service as any, 'verifyGoogleToken')
        .mockResolvedValue({
          sub: 'google-12345',
          email: 'test@gmail.com',
          name: 'Test User',
          email_verified: true,
        });

      // Mock data
      const socialLoginDto: SocialLoginDto = {
        provider: SocialProvider.GOOGLE,
        token: 'google-token',
        email: 'test@gmail.com',
        name: 'Test User',
      };

      const mockUser = { id: 'google-user-id' } as UserDocument;

      // Mocking findByIdOrCreate
      mockUsersService.findByIdOrCreate.mockResolvedValue(mockUser);

      // Call the service method
      const result = await service.validateSocialLogin(socialLoginDto);

      // Assertions
      expect(verifyGoogleSpy).toHaveBeenCalledWith('google-token');
      expect(result).toEqual(mockUser);
      expect(mockUsersService.findByIdOrCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          provider: AuthProvider.GOOGLE,
          providerId: 'google-12345',
        }),
      );

      // Restore environment
      process.env.NODE_ENV = originalEnv;
    });

    it('should throw error for unsupported provider', async () => {
      // Mock data with an invalid provider
      const socialLoginDto: SocialLoginDto = {
        provider: 'invalid-provider' as SocialProvider,
        token: 'invalid-token',
        email: 'test@icloud.com',
        name: 'Test User',
      };

      // Expect it to throw exception
      await expect(service.validateSocialLogin(socialLoginDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw error when email is missing', async () => {
      // Mock data missing email
      const socialLoginDto: SocialLoginDto = {
        provider: SocialProvider.GOOGLE,
        token: 'google-token',
        email: undefined as any, // Explicitly set to undefined
        name: 'Test User',
      };

      // Expect it to throw exception
      await expect(service.validateSocialLogin(socialLoginDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.validateSocialLogin(socialLoginDto)).rejects.toThrow(
        'Email is required for social login',
      );
    });

    it('should throw error when name is missing', async () => {
      // Mock data missing name
      const socialLoginDto: SocialLoginDto = {
        provider: SocialProvider.GOOGLE,
        token: 'google-token',
        email: 'test@gmail.com',
        name: undefined as any, // Explicitly set to undefined
      };

      // Expect it to throw exception
      await expect(service.validateSocialLogin(socialLoginDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.validateSocialLogin(socialLoginDto)).rejects.toThrow(
        'Name is required for social login',
      );
    });
  });

  describe('requestPasswordReset', () => {
    it('should generate token and send email when user exists', async () => {
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        email: 'test@example.com',
        name: 'Test User',
      };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      const result = await service.requestPasswordReset('test@example.com');

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(mockUsersService.update).toHaveBeenCalledWith(
        mockUser._id,
        expect.objectContaining({
          resetToken: expect.any(String),
          resetTokenExpiry: expect.any(Date),
        }),
      );
      expect(mockEmailService.sendPasswordResetEmail).toHaveBeenCalledWith(
        'test@example.com',
        expect.any(String),
        'Test User',
      );
      expect(result).toEqual({
        message:
          'If an account with that email exists, a reset link has been sent.',
      });
    });

    it('should return same message when user does not exist', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      const result = await service.requestPasswordReset(
        'nonexistent@example.com',
      );

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(
        'nonexistent@example.com',
      );
      expect(mockUsersService.update).not.toHaveBeenCalled();
      expect(mockEmailService.sendPasswordResetEmail).not.toHaveBeenCalled();
      expect(result).toEqual({
        message:
          'If an account with that email exists, a reset link has been sent.',
      });
    });

    it('should handle email sending errors gracefully', async () => {
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        email: 'test@example.com',
        name: 'Test User',
      };

      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockEmailService.sendPasswordResetEmail.mockRejectedValue(
        new Error('Email error'),
      );

      const result = await service.requestPasswordReset('test@example.com');

      expect(mockUsersService.update).toHaveBeenCalled();
      expect(mockEmailService.sendPasswordResetEmail).toHaveBeenCalled();
      expect(result).toEqual({
        message:
          'If an account with that email exists, a reset link has been sent.',
      });
    });
  });

  describe('resetPassword', () => {
    it('should update password when token is valid', async () => {
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        email: 'test@example.com',
      };

      mockUsersService.findByResetToken.mockResolvedValue(mockUser);

      const result = await service.resetPassword(
        'valid-token',
        'NewPassword123',
      );

      expect(mockUsersService.findByResetToken).toHaveBeenCalledWith(
        'valid-token',
      );
      expect(mockUsersService.update).toHaveBeenCalledWith(
        mockUser._id,
        expect.objectContaining({
          password: expect.any(String),
          resetToken: null,
          resetTokenExpiry: null,
        }),
      );
      expect(result).toEqual({
        message:
          'Password reset successful. You can now log in with your new password.',
      });
    });

    it('should throw BadRequestException when token is invalid', async () => {
      mockUsersService.findByResetToken.mockResolvedValue(null);

      await expect(
        service.resetPassword('invalid-token', 'NewPassword123'),
      ).rejects.toThrow(BadRequestException);

      expect(mockUsersService.findByResetToken).toHaveBeenCalledWith(
        'invalid-token',
      );
      expect(mockUsersService.update).not.toHaveBeenCalled();
    });
  });

  // Additional tests to be implemented:
  // - refreshTokens
  // - logout
  // - validateSocialLogin
  // - sendOtp
  // - verifyOtp
  // - requestPasswordReset
  // - resetPassword
});
