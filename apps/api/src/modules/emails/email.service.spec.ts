import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import * as fs from 'fs';
import * as handlebars from 'handlebars';

jest.mock('resend', () => {
  return {
    Resend: jest.fn().mockImplementation(() => ({
      emails: {
        send: jest.fn().mockResolvedValue({ error: null }),
      },
    })),
  };
});

jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  mkdirSync: jest.fn(),
}));

jest.mock('handlebars', () => ({
  compile: jest.fn(),
}));

describe('EmailService', () => {
  let service: EmailService;
  let mockConfigService: Partial<ConfigService>;

  beforeEach(async () => {
    mockConfigService = {
      get: jest.fn((key: string) => {
        const config = {
          'email.resendApiKey': 'test-api-key',
          'email.from': 'noreply@heallink.com',
          'app.frontendUrl': 'http://localhost:3000',
          'app.adminUrl': 'http://localhost:3002',
        };
        return config[key] || null;
      }),
    };

    // Mock file system calls
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue('Test template {{data}}');
    (handlebars.compile as jest.Mock).mockReturnValue(
      (data: any) => `Compiled template with ${JSON.stringify(data)}`,
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendTemplatedEmail', () => {
    it('should send an email with compiled template', async () => {
      const result = await service.sendTemplatedEmail(
        'test@example.com',
        'Test Subject',
        'test-template',
        { key: 'value' },
      );

      expect(result).toBe(true);
      expect(fs.readFileSync).toHaveBeenCalled();
      expect(handlebars.compile).toHaveBeenCalled();
    });

    it('should return false when template compilation fails', async () => {
      // Setup
      jest.spyOn(fs, 'existsSync').mockReturnValueOnce(false);

      // Act
      const result = await service.sendTemplatedEmail(
        'test@example.com',
        'Test Subject',
        'nonexistent-template',
        { key: 'value' },
      );

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('sendPasswordResetEmail', () => {
    it('should call sendTemplatedEmail with correct parameters', async () => {
      // Spy on the sendTemplatedEmail method
      const sendTemplatedEmailSpy = jest.spyOn(service, 'sendTemplatedEmail');
      sendTemplatedEmailSpy.mockResolvedValue(true);

      const result = await service.sendPasswordResetEmail(
        'test@example.com',
        'reset-token-123',
        'John Doe',
      );

      expect(result).toBe(true);
      expect(sendTemplatedEmailSpy).toHaveBeenCalledWith(
        'test@example.com',
        'Reset Your Heallink Password',
        'password-reset',
        {
          resetLink:
            'http://localhost:3000/auth/reset-password?token=reset-token-123',
          username: 'John Doe',
        },
      );

      // Verify the path in the resetLink parameter
      const callArgs = sendTemplatedEmailSpy.mock.calls[0][3];
      expect(callArgs.resetLink).toContain('/auth/reset-password?token=');
    });
  });

  describe('sendWelcomeEmail', () => {
    it('should call sendTemplatedEmail with correct parameters', async () => {
      const sendTemplatedEmailSpy = jest.spyOn(service, 'sendTemplatedEmail');
      sendTemplatedEmailSpy.mockResolvedValue(true);

      await service.sendWelcomeEmail('test@example.com', 'John Doe');

      expect(sendTemplatedEmailSpy).toHaveBeenCalledWith(
        'test@example.com',
        'Welcome to Heallink',
        'welcome-email',
        expect.objectContaining({
          name: 'John Doe',
          dashboardUrl: 'http://localhost:3000/dashboard',
        }),
      );
    });
  });

  describe('sendVerificationEmail', () => {
    it('should call sendTemplatedEmail with correct parameters', async () => {
      const sendTemplatedEmailSpy = jest.spyOn(service, 'sendTemplatedEmail');
      sendTemplatedEmailSpy.mockResolvedValue(true);

      await service.sendVerificationEmail(
        'test@example.com',
        'John Doe',
        'verification-token-123',
      );

      expect(sendTemplatedEmailSpy).toHaveBeenCalledWith(
        'test@example.com',
        'Verify Your Email Address - Heallink',
        'verify-email',
        expect.objectContaining({
          name: 'John Doe',
          verificationLink:
            'http://localhost:3000/auth/verify-email?token=verification-token-123',
        }),
      );
    });
  });

  describe('sendAdminCreationEmail', () => {
    it('should call sendTemplatedEmail with correct parameters', async () => {
      const sendTemplatedEmailSpy = jest.spyOn(service, 'sendTemplatedEmail');
      sendTemplatedEmailSpy.mockResolvedValue(true);

      await service.sendAdminCreationEmail(
        'admin@example.com',
        'Admin User',
        'temp-pass-123',
      );

      expect(sendTemplatedEmailSpy).toHaveBeenCalledWith(
        'admin@example.com',
        'Your Heallink Admin Account',
        'admin-creation',
        expect.objectContaining({
          name: 'Admin User',
          tempPassword: 'temp-pass-123',
          loginLink: 'http://localhost:3002/login',
          to: 'admin@example.com',
        }),
      );
    });
  });
});
