import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';

/**
 * Interface for SMS sending options
 */
export interface SmsOptions {
  to: string;
  body: string;
  from?: string;
}

/**
 * Interface for OTP options
 */
export interface OtpOptions {
  phone: string;
  expiry?: number; // expiry time in minutes, defaults to 10
  length?: number; // code length, defaults to 6
  alphanumeric?: boolean; // whether to use alphanumeric codes, defaults to false (numeric only)
}

/**
 * Service for sending SMS messages using Twilio
 */
@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly twilioClient: twilio.Twilio | null = null;
  private readonly defaultFromNumber: string;

  constructor(private readonly configService: ConfigService) {
    const accountSid = this.configService.get<string>('twilio.accountSid');
    const authToken = this.configService.get<string>('twilio.authToken');

    // Initialize Twilio client if credentials are provided
    if (accountSid && authToken) {
      this.twilioClient = twilio.default(accountSid, authToken);
      this.logger.log('Twilio client initialized');
    } else {
      this.logger.warn(
        'Twilio credentials not provided, SMS functionality will be mocked',
      );
    }

    this.defaultFromNumber =
      this.configService.get<string>('twilio.fromNumber') || '';
  }

  /**
   * Sends an SMS message via Twilio
   * @param options The SMS options
   * @returns Promise with the Twilio message instance or mock response
   */
  async sendSms(
    options: SmsOptions,
  ): Promise<MessageInstance | { sid: string; status: string }> {
    const { to, body, from = this.defaultFromNumber } = options;

    try {
      // Log sanitized message (not showing full content for security)
      this.logger.debug(
        `Sending SMS to ${to.substring(0, 5)}...${to.substring(to.length - 2)} with message: ${body.substring(
          0,
          10,
        )}...`,
      );

      // If Twilio client is available, send actual SMS
      if (this.twilioClient) {
        const message = await this.twilioClient.messages.create({
          to,
          from,
          body,
        });

        this.logger.log(`SMS sent with SID: ${message.sid}`);
        return message;
      } else {
        // Mock response when in development or when Twilio is not configured
        this.logger.log(
          `[MOCK] SMS would be sent to ${to} with message: ${body}`,
        );
        return {
          sid: `mock_${Date.now()}`,
          status: 'mock-delivered',
        };
      }
    } catch (error) {
      this.logger.error(
        `Failed to send SMS: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  /**
   * Generates and sends an OTP code via SMS
   * @param options The OTP options
   * @returns Promise with the generated OTP code and message SID
   */
  async sendOtp(
    options: OtpOptions,
  ): Promise<{ code: string; messageSid: string; expiresAt: Date }> {
    const { phone, expiry = 10, length = 6, alphanumeric = false } = options;

    // Generate OTP code
    const code = this.generateOtpCode(length, alphanumeric);

    // Calculate expiry time
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + expiry);

    // Prepare message content
    const messageBody = `Your Heallink verification code is: ${code}. Valid for ${expiry} minutes.`;

    try {
      // Send SMS with the OTP
      const message = await this.sendSms({
        to: phone,
        body: messageBody,
      });

      return {
        code,
        messageSid: message.sid,
        expiresAt,
      };
    } catch (error) {
      this.logger.error(
        `Failed to send OTP: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  /**
   * Generate a random OTP code
   * @param length The length of the code (default: 6)
   * @param alphanumeric Whether to include letters (default: false)
   * @returns The generated OTP code
   */
  private generateOtpCode(
    length: number = 6,
    alphanumeric: boolean = false,
  ): string {
    const characters = alphanumeric
      ? '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      : '0123456789';

    let code = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      code += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return code;
  }
}
