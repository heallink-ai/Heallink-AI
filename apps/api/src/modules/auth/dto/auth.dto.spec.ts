import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { RegisterDto } from './register.dto';
import { LoginDto } from './login.dto';
import { SocialLoginDto, SocialProvider } from './social-login.dto';
import { SendOtpDto, VerifyOtpDto } from './otp.dto';
import {
  PasswordResetRequestDto,
  PasswordResetDto,
} from './password-reset.dto';

describe('Auth DTOs', () => {
  describe('RegisterDto', () => {
    it('should validate a valid register DTO with email', async () => {
      const dto = plainToClass(RegisterDto, {
        email: 'test@example.com',
        password: 'Password123',
        name: 'Test User',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation if email is invalid', async () => {
      const dto = plainToClass(RegisterDto, {
        email: 'invalid-email',
        password: 'Password123',
        name: 'Test User',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail validation if required field is missing', async () => {
      const dto = plainToClass(RegisterDto, {
        email: 'test@example.com',
        password: 'Password123',
        // name is missing
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail validation if password is too weak', async () => {
      const dto = plainToClass(RegisterDto, {
        email: 'test@example.com',
        password: 'weakpass', // No uppercase, numbers or special chars
        name: 'Test User',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('LoginDto', () => {
    it('should validate a valid login DTO with email', async () => {
      const dto = plainToClass(LoginDto, {
        email: 'test@example.com',
        password: 'Password123',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should validate a valid login DTO with phone', async () => {
      const dto = plainToClass(LoginDto, {
        phone: '+12345678901',
        password: 'Password123',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation if password is missing', async () => {
      const dto = plainToClass(LoginDto, {
        email: 'test@example.com',
        // password is missing
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail validation if email is invalid', async () => {
      const dto = plainToClass(LoginDto, {
        email: 'invalid-email',
        password: 'Password123',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('SocialLoginDto', () => {
    it('should validate a valid social login DTO', async () => {
      const dto = plainToClass(SocialLoginDto, {
        provider: SocialProvider.GOOGLE,
        token: 'google-auth-token',
        email: 'test@gmail.com',
        name: 'Test User',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation if provider is invalid', async () => {
      const dto = plainToClass(SocialLoginDto, {
        provider: 'invalid-provider',
        token: 'some-token',
        email: 'test@gmail.com',
        name: 'Test User',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail validation if email is missing', async () => {
      const dto = plainToClass(SocialLoginDto, {
        provider: SocialProvider.GOOGLE,
        token: 'google-auth-token',
        // email is missing
        name: 'Test User',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail validation if name is missing', async () => {
      const dto = plainToClass(SocialLoginDto, {
        provider: SocialProvider.GOOGLE,
        token: 'google-auth-token',
        email: 'test@gmail.com',
        // name is missing
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('SendOtpDto', () => {
    it('should validate a valid send OTP DTO with phone', async () => {
      const dto = plainToClass(SendOtpDto, {
        phone: '+12345678901',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should validate a valid send OTP DTO with email', async () => {
      const dto = plainToClass(SendOtpDto, {
        email: 'test@example.com',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation if phone is invalid', async () => {
      const dto = plainToClass(SendOtpDto, {
        phone: '123456', // Invalid phone format
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('VerifyOtpDto', () => {
    it('should validate a valid verify OTP DTO with phone', async () => {
      const dto = plainToClass(VerifyOtpDto, {
        phone: '+12345678901',
        code: '123456',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should validate a valid verify OTP DTO with email', async () => {
      const dto = plainToClass(VerifyOtpDto, {
        email: 'test@example.com',
        code: '123456',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation if code is missing', async () => {
      const dto = plainToClass(VerifyOtpDto, {
        phone: '+12345678901',
        // code is missing
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('PasswordResetRequestDto', () => {
    it('should validate a valid password reset request DTO', async () => {
      const dto = plainToClass(PasswordResetRequestDto, {
        email: 'test@example.com',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation if email is invalid', async () => {
      const dto = plainToClass(PasswordResetRequestDto, {
        email: 'invalid-email',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('PasswordResetDto', () => {
    it('should validate a valid password reset DTO', async () => {
      const dto = plainToClass(PasswordResetDto, {
        token: 'valid-token',
        newPassword: 'NewPassword123',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation if token is missing', async () => {
      const dto = plainToClass(PasswordResetDto, {
        newPassword: 'NewPassword123',
        // token is missing
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail validation if newPassword is too short', async () => {
      const dto = plainToClass(PasswordResetDto, {
        token: 'valid-token',
        newPassword: 'short',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});
