import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend;
  private readonly fromEmail: string;
  private readonly templatesDir: string;

  constructor(private configService: ConfigService) {
    const resendApiKey = this.configService.get<string>('email.resendApiKey');

    if (!resendApiKey) {
      this.logger.warn(
        'Resend API key not found. Email service will not function properly.',
      );
    }

    this.resend = new Resend(resendApiKey);
    this.fromEmail =
      this.configService.get<string>('email.from') || 'noreply@heallink.com';
    this.templatesDir = path.join(__dirname, 'templates');

    // Create templates directory if it doesn't exist
    if (!fs.existsSync(this.templatesDir)) {
      fs.mkdirSync(this.templatesDir, { recursive: true });
    }
  }

  /**
   * Compile a handlebars template with data
   */
  private compileTemplate(
    templateName: string,
    data: Record<string, any>,
  ): string {
    try {
      const templatePath = path.join(this.templatesDir, `${templateName}.hbs`);

      if (!fs.existsSync(templatePath)) {
        this.logger.error(`Template not found: ${templatePath}`);
        throw new Error(`Template not found: ${templateName}`);
      }

      const templateSource = fs.readFileSync(templatePath, 'utf-8');
      const template = handlebars.compile(templateSource);
      return template({
        ...data,
        currentYear: new Date().getFullYear(),
      });
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `Failed to compile template: ${err.message}`,
        err.stack,
      );
      throw error;
    }
  }

  /**
   * Send an email using Resend with a template
   */
  async sendTemplatedEmail(
    to: string,
    subject: string,
    templateName: string,
    data: Record<string, any>,
  ): Promise<boolean> {
    try {
      const html = this.compileTemplate(templateName, data);

      const { error } = await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject,
        html,
      });

      if (error) {
        this.logger.error(`Failed to send email: ${error.message}`);
        return false;
      }

      this.logger.log(`Email sent successfully to ${to}`);
      return true;
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(`Error sending email: ${err.message}`, err.stack);
      return false;
    }
  }

  /**
   * Send welcome email to new user
   */
  async sendWelcomeEmail(to: string, name: string): Promise<boolean> {
    const dashboardUrl = `${this.configService.get('app.frontendUrl')}/dashboard`;

    return this.sendTemplatedEmail(to, 'Welcome to Heallink', 'welcome-email', {
      name,
      dashboardUrl,
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(
    to: string,
    resetToken: string,
    username: string,
  ): Promise<boolean> {
    const resetLink = `${this.configService.get('app.frontendUrl')}/reset-password?token=${resetToken}`;

    return this.sendTemplatedEmail(
      to,
      'Reset Your Heallink Password',
      'password-reset',
      { resetLink, username },
    );
  }

  /**
   * Send admin account creation email
   */
  async sendAdminCreationEmail(
    to: string,
    name: string,
    tempPassword: string,
  ): Promise<boolean> {
    const loginLink = `${this.configService.get('app.adminUrl')}/login`;

    return this.sendTemplatedEmail(
      to,
      'Your Heallink Admin Account',
      'admin-creation',
      { name, tempPassword, loginLink, to },
    );
  }
}
