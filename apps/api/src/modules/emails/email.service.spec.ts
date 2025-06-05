import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import * as fs from 'fs';
import * as handlebars from 'handlebars';

// Mock fs and handlebars
jest.mock('fs', () => ({
  existsSync: jest.fn().mockReturnValue(true),
  mkdirSync: jest.fn(),
  readFileSync: jest.fn().mockReturnValue('Hello {{name}}'),
}));

jest.mock('handlebars', () => ({
  compile: jest.fn().mockImplementation(() => {
    return (data: any) => `Compiled template with ${JSON.stringify(data)}`;
  }),
}));

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn().mockResolvedValue({ data: {}, error: null }),
    },
  })),
}));

describe('EmailService', () => {
  let service: EmailService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'email.resendApiKey':
                  return 'test-resend-api-key';
                case 'email.from':
                  return 'Heallink <noreply@heallink.io>';
                case 'app.frontendUrl':
                  return 'http://localhost:3000';
                case 'app.adminUrl':
                  return 'http://localhost:3002';
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should use correct email from address', () => {
    // Access the private field for testing
    const fromEmail = (service as any).fromEmail;
    expect(fromEmail).toBe('Heallink <noreply@heallink.io>');
    expect(configService.get).toHaveBeenCalledWith('email.from');
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
    it('should send a password reset email with correct parameters', async () => {
      const sendSpy = jest
        .spyOn((service as any).resend.emails, 'send')
        .mockResolvedValue({ data: {}, error: null });

      const to = 'user@example.com';
      const token = 'reset-token-123';
      const username = 'Test User';

      await service.sendPasswordResetEmail(to, token, username);

      expect(sendSpy).toHaveBeenCalledWith({
        from: 'Heallink <noreply@heallink.io>',
        to,
        subject: 'Reset Your Heallink Password',
        html: expect.any(String),
      });

      const html = (sendSpy.mock.calls[0][0] as any).html as string;
      expect(html).toContain(token);
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
    it('should send a verification email with correct parameters', async () => {
      const sendSpy = jest
        .spyOn((service as any).resend.emails, 'send')
        .mockResolvedValue({ data: {}, error: null });

      const to = 'user@example.com';
      const name = 'Test User';
      const token = 'verification-token-123';

      await service.sendVerificationEmail(to, name, token);

      expect(sendSpy).toHaveBeenCalledWith({
        from: 'Heallink <noreply@heallink.io>',
        to,
        subject: 'Verify Your Email Address - Heallink',
        html: expect.any(String),
      });
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
