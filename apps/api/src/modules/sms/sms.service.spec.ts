import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { SmsService } from './sms.service';

// Mock Twilio
jest.mock('twilio', () => {
  // Mock Twilio client factory
  return jest.fn(() => ({
    messages: {
      create: jest.fn().mockResolvedValue({
        sid: 'test_message_sid',
        status: 'delivered',
      }),
    },
  }));
});

describe('SmsService', () => {
  let service: SmsService;
  let mockConfigService: Partial<ConfigService>;

  beforeEach(async () => {
    // Mock config service
    mockConfigService = {
      get: jest.fn((key: string) => {
        const config = {
          'twilio.accountSid': 'test_account_sid',
          'twilio.authToken': 'test_auth_token',
          'twilio.fromNumber': '+15005550006',
        };
        return config[key];
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SmsService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SmsService>(SmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendSms', () => {
    it('should send an SMS message', async () => {
      const options = {
        to: '+15005550010',
        body: 'Test message',
      };

      const result = await service.sendSms(options);

      expect(result).toBeDefined();
      expect(result.sid).toBe('test_message_sid');
      expect(result.status).toBe('delivered');
    });

    it('should use default from number if not provided', async () => {
      const options = {
        to: '+15005550010',
        body: 'Test message',
      };

      const result = await service.sendSms(options);

      expect(result).toBeDefined();
    });
  });

  describe('sendOtp', () => {
    it('should generate and send an OTP', async () => {
      const options = {
        phone: '+15005550010',
        expiry: 5,
        length: 4,
      };

      const result = await service.sendOtp(options);

      expect(result).toBeDefined();
      expect(result.code).toHaveLength(4);
      expect(result.messageSid).toBe('test_message_sid');
      expect(result.expiresAt).toBeInstanceOf(Date);
    });

    it('should use default OTP parameters', async () => {
      const options = {
        phone: '+15005550010',
      };

      const result = await service.sendOtp(options);

      expect(result).toBeDefined();
      expect(result.code).toHaveLength(6); // default length
    });
  });

  describe('Mock Configuration', () => {
    beforeEach(async () => {
      jest.clearAllMocks();
      // Mock config service without Twilio credentials
      mockConfigService = {
        get: jest.fn((key: string) => {
          const config = {
            'twilio.accountSid': null,
            'twilio.authToken': null,
            'twilio.fromNumber': '+15005550006',
          };
          return config[key];
        }),
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          SmsService,
          {
            provide: ConfigService,
            useValue: mockConfigService,
          },
          {
            provide: Logger,
            useValue: {
              log: jest.fn(),
              error: jest.fn(),
              warn: jest.fn(),
              debug: jest.fn(),
            },
          },
        ],
      }).compile();

      service = module.get<SmsService>(SmsService);
    });

    it('should use mock functionality when Twilio is not configured', async () => {
      const options = {
        to: '+15005550010',
        body: 'Test message',
      };

      const result = await service.sendSms(options);

      expect(result).toBeDefined();
      expect(result.sid).toContain('mock_');
      expect(result.status).toBe('mock-delivered');
    });
  });
});
