import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SocialLoginDto, SocialProvider } from './dto/social-login.dto';
import { SendOtpDto, VerifyOtpDto } from './dto/otp.dto';
import {
  PasswordResetRequestDto,
  PasswordResetDto,
} from './dto/password-reset.dto';
import mongoose from 'mongoose';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    verifyEmail: jest.fn(),
    login: jest.fn(),
    refreshTokens: jest.fn(),
    logout: jest.fn(),
    validateSocialLogin: jest.fn(),
    sendOtp: jest.fn(),
    verifyOtp: jest.fn(),
    requestPasswordReset: jest.fn(),
    resetPassword: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'Password123',
        name: 'Test User',
      };

      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        email: 'test@example.com',
        name: 'Test User',
      };

      mockAuthService.register.mockResolvedValue(mockUser);

      const result = await controller.register(registerDto);

      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('verifyEmail', () => {
    it('should verify email with token', async () => {
      const token = 'valid-verification-token';
      const expectedResponse = {
        success: true,
        message: 'Email verified successfully',
      };

      mockAuthService.verifyEmail.mockResolvedValue(expectedResponse);

      const result = await controller.verifyEmail(token);

      expect(mockAuthService.verifyEmail).toHaveBeenCalledWith(token);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('login', () => {
    it('should login user and return tokens', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'Password123',
      };

      const req = {
        user: {
          _id: new mongoose.Types.ObjectId(),
          email: 'test@example.com',
        },
      };

      const expectedResponse = {
        accessToken: 'jwt-access-token',
        refreshToken: 'jwt-refresh-token',
        user: {
          id: req.user._id,
          email: 'test@example.com',
        },
      };

      mockAuthService.login.mockResolvedValue(expectedResponse);

      const result = await controller.login(req, loginDto);

      expect(mockAuthService.login).toHaveBeenCalledWith(req.user);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('refreshToken', () => {
    it('should refresh tokens', async () => {
      const req = {
        user: { id: new mongoose.Types.ObjectId().toString() },
        headers: { authorization: 'Bearer refresh-token' },
      };

      const expectedResponse = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      mockAuthService.refreshTokens.mockResolvedValue(expectedResponse);

      const result = await controller.refreshToken(req);

      expect(mockAuthService.refreshTokens).toHaveBeenCalledWith(
        req.user.id,
        'refresh-token',
      );
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('logout', () => {
    it('should log out the user', async () => {
      const req = {
        user: { id: new mongoose.Types.ObjectId().toString() },
      };

      mockAuthService.logout.mockResolvedValue(undefined);

      await controller.logout(req);

      expect(mockAuthService.logout).toHaveBeenCalledWith(req.user.id);
    });
  });

  describe('socialLogin', () => {
    it('should handle social login', async () => {
      const socialLoginDto: SocialLoginDto = {
        provider: SocialProvider.GOOGLE,
        token: 'google-auth-token',
      };

      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        email: 'social@example.com',
      };

      const expectedResponse = {
        accessToken: 'jwt-access-token',
        refreshToken: 'jwt-refresh-token',
        user: {
          id: mockUser._id,
          email: 'social@example.com',
        },
      };

      mockAuthService.validateSocialLogin.mockResolvedValue(mockUser);
      mockAuthService.login.mockResolvedValue(expectedResponse);

      const result = await controller.socialLogin(socialLoginDto);

      expect(mockAuthService.validateSocialLogin).toHaveBeenCalledWith(
        socialLoginDto,
      );
      expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('sendOtp', () => {
    it('should send OTP', async () => {
      const sendOtpDto: SendOtpDto = {
        phone: '+1234567890',
      };

      const expectedResponse = { success: true };

      mockAuthService.sendOtp.mockResolvedValue(expectedResponse);

      const result = await controller.sendOtp(sendOtpDto);

      expect(mockAuthService.sendOtp).toHaveBeenCalledWith(sendOtpDto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('verifyOtp', () => {
    it('should verify OTP', async () => {
      const verifyOtpDto: VerifyOtpDto = {
        phone: '+1234567890',
        code: '123456',
      };

      const expectedResponse = {
        verified: true,
        message: 'OTP verified successfully',
        tokens: {
          accessToken: 'jwt-access-token',
          refreshToken: 'jwt-refresh-token',
          user: {
            id: new mongoose.Types.ObjectId(),
            phone: '+1234567890',
          },
        },
      };

      mockAuthService.verifyOtp.mockResolvedValue(expectedResponse);

      const result = await controller.verifyOtp(verifyOtpDto);

      expect(mockAuthService.verifyOtp).toHaveBeenCalledWith(verifyOtpDto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('requestPasswordReset', () => {
    it('should request password reset', async () => {
      const resetRequestDto: PasswordResetRequestDto = {
        email: 'test@example.com',
      };

      const expectedResponse = { message: 'Password reset email sent' };

      mockAuthService.requestPasswordReset.mockResolvedValue(expectedResponse);

      const result = await controller.requestPasswordReset(resetRequestDto);

      expect(mockAuthService.requestPasswordReset).toHaveBeenCalledWith(
        resetRequestDto.email,
      );
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('resetPassword', () => {
    it('should reset password', async () => {
      const resetDto: PasswordResetDto = {
        token: 'reset-token',
        newPassword: 'NewPassword123',
      };

      const expectedResponse = { message: 'Password reset successful' };

      mockAuthService.resetPassword.mockResolvedValue(expectedResponse);

      const result = await controller.resetPassword(resetDto);

      expect(mockAuthService.resetPassword).toHaveBeenCalledWith(
        resetDto.token,
        resetDto.newPassword,
      );
      expect(result).toEqual(expectedResponse);
    });
  });
});
