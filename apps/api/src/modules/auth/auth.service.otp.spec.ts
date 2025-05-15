import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { EmailService } from '../emails/email.service';
import { SmsService } from '../sms/sms.service';
import { SendOtpDto, VerifyOtpDto } from './dto/otp.dto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserRole } from '../users/schemas/user.schema';
import { Types } from 'mongoose';

describe('AuthService OTP functionality', () => {
  let service: AuthService;
  let usersService: {
    findByPhone: jest.Mock;
    findByEmail: jest.Mock;
    update: jest.Mock;
  };
  let smsService: {
    sendOtp: jest.Mock;
  };

  beforeEach(async () => {
    // Create mock implementations
    usersService = {
      findByPhone: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
    };

    smsService = {
      sendOtp: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersService,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'test-token'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'jwt.secret') return 'test-secret';
              if (key === 'jwt.expiresIn') return '15m';
              if (key === 'jwt.refreshSecret') return 'test-refresh-secret';
              if (key === 'jwt.refreshExpiresIn') return '7d';
              return null;
            }),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendWelcomeEmail: jest.fn(),
            sendVerificationEmail: jest.fn(),
            sendPasswordResetEmail: jest.fn(),
          },
        },
        {
          provide: SmsService,
          useValue: smsService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('sendOtp', () => {
    it('should send OTP to a valid phone number', async () => {
      // Arrange
      const sendOtpDto: SendOtpDto = {
        phone: '+15005550010',
      };

      const mockUser = {
        _id: new Types.ObjectId(),
        phone: '+15005550010',
        role: UserRole.USER,
      };

      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10);

      usersService.findByPhone.mockResolvedValue(mockUser);
      smsService.sendOtp.mockResolvedValue({
        code: '123456',
        messageSid: 'test-sid',
        expiresAt,
      });
      usersService.update.mockResolvedValue({});

      // Act
      const result = await service.sendOtp(sendOtpDto);

      // Assert
      expect(result.success).toBe(true);
      expect(result.expiresAt).toBeDefined();
      expect(smsService.sendOtp).toHaveBeenCalledWith({
        phone: sendOtpDto.phone,
        expiry: 10,
        length: 6,
      });
      expect(usersService.update).toHaveBeenCalled();
    });

    it('should throw BadRequestException if phone number is missing', async () => {
      // Arrange
      const sendOtpDto: SendOtpDto = {
        // Missing phone number
      };

      // Act & Assert
      await expect(service.sendOtp(sendOtpDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('verifyOtp', () => {
    it('should verify a valid OTP code', async () => {
      // Arrange
      const verifyOtpDto: VerifyOtpDto = {
        phone: '+15005550010',
        code: '123456',
      };

      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 5); // Still valid (5 mins in future)

      const mockUser = {
        _id: new Types.ObjectId(),
        phone: '+15005550010',
        otpCode: '123456',
        otpExpiry: expiresAt,
        role: UserRole.USER,
        toJSON: jest.fn().mockReturnValue({
          _id: 'user-id',
          phone: '+15005550010',
          role: UserRole.USER,
        }),
      };

      usersService.findByPhone.mockResolvedValue(mockUser);
      usersService.update.mockResolvedValue({});

      // Mock the login method partially - this is a method of the service itself
      jest.spyOn(service, 'login').mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: { id: 'user-id', phone: '+15005550010' },
      });

      // Act
      const result = await service.verifyOtp(verifyOtpDto);

      // Assert
      expect(result.verified).toBe(true);
      expect(result.message).toBe('Phone number verified successfully');
      expect(result.tokens).toBeDefined();
      expect(usersService.update).toHaveBeenCalledWith(mockUser._id, {
        otpCode: null,
        otpExpiry: null,
        phoneVerified: true,
      });
    });

    it('should throw UnauthorizedException for invalid OTP code', async () => {
      // Arrange
      const verifyOtpDto: VerifyOtpDto = {
        phone: '+15005550010',
        code: '999999', // Wrong code
      };

      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 5);

      const mockUser = {
        _id: new Types.ObjectId(),
        phone: '+15005550010',
        otpCode: '123456', // Different from the one being verified
        otpExpiry: expiresAt,
      };

      usersService.findByPhone.mockResolvedValue(mockUser);

      // Act & Assert
      await expect(service.verifyOtp(verifyOtpDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for expired OTP code', async () => {
      // Arrange
      const verifyOtpDto: VerifyOtpDto = {
        phone: '+15005550010',
        code: '123456',
      };

      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() - 5); // Expired (5 mins in past)

      const mockUser = {
        _id: new Types.ObjectId(),
        phone: '+15005550010',
        otpCode: '123456',
        otpExpiry: expiresAt, // Expired
      };

      usersService.findByPhone.mockResolvedValue(mockUser);

      // Act & Assert
      await expect(service.verifyOtp(verifyOtpDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if user not found', async () => {
      // Arrange
      const verifyOtpDto: VerifyOtpDto = {
        phone: '+15005550010',
        code: '123456',
      };

      usersService.findByPhone.mockResolvedValue(null);

      // Act & Assert
      await expect(service.verifyOtp(verifyOtpDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
