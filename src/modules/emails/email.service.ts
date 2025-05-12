import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Resend } from "resend";

type EmailPayload = {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  text?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
};

@Injectable()
export class EmailService {
  private readonly resend: Resend;
  private readonly logger = new Logger(EmailService.name);
  private readonly defaultFrom: string;
  private readonly frontendUrl: string;
  private readonly adminFrontendUrl: string;

  constructor(private readonly configService: ConfigService) {
    const resendApiKey = this.configService.get<string>("email.resendApiKey");

    if (!resendApiKey) {
      this.logger.warn(
        "RESEND_API_KEY is not set. Email sending will be disabled."
      );
    }

    this.resend = new Resend(resendApiKey);
    this.defaultFrom =
      this.configService.get<string>("email.from") ||
      "Heallink <noreply@heallink.com>";
    this.frontendUrl =
      this.configService.get<string>("frontend.url") || "http://localhost:3000";
    this.adminFrontendUrl =
      this.configService.get<string>("admin.url") || "http://localhost:3002";
  }

  /**
   * Send an email using Resend
   * This method is non-blocking and will log errors but not throw them
   */
  async sendEmail(payload: EmailPayload): Promise<boolean> {
    try {
      const { to, subject, html, text, cc, bcc, replyTo } = payload;
      const from = payload.from || this.defaultFrom;

      // Prevent sending emails in test environment
      if (process.env.NODE_ENV === "test") {
        this.logger.debug(`[TEST] Email would be sent to ${to}: ${subject}`);
        return true;
      }

      const data = await this.resend.emails.send({
        from,
        to,
        subject,
        html,
        text,
        cc,
        bcc,
        replyTo,
      });

      this.logger.log(`Email sent successfully to ${to}`);
      return true;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Failed to send email: ${errorMessage}`, errorStack);
      return false;
    }
  }

  /**
   * Send a welcome email to a new user
   */
  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const subject = "Welcome to Heallink";
    const html = this.getWelcomeEmailTemplate(name);

    return this.sendEmail({
      to: email,
      subject,
      html,
    });
  }

  /**
   * Send a password reset email
   */
  async sendPasswordResetEmail(
    email: string,
    resetToken: string,
    name: string
  ): Promise<boolean> {
    const subject = "Reset Your Heallink Password";
    const resetUrl = `${this.frontendUrl}/auth/reset-password?token=${resetToken}`;
    const html = this.getPasswordResetEmailTemplate(name, resetUrl);

    return this.sendEmail({
      to: email,
      subject,
      html,
    });
  }

  /**
   * Send a welcome email to a new admin user with credentials
   */
  async sendAdminWelcomeEmail(
    email: string,
    name: string,
    password: string
  ): Promise<boolean> {
    const subject = "Welcome to Heallink Admin Portal";
    const loginUrl = `${this.adminFrontendUrl}/auth/signin`;
    const html = this.getAdminWelcomeEmailTemplate(
      name,
      email,
      password,
      loginUrl
    );

    return this.sendEmail({
      to: email,
      subject,
      html,
    });
  }

  /**
   * Email template for welcome emails
   */
  private getWelcomeEmailTemplate(name: string): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Heallink</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            padding: 20px 0;
          }
          .logo {
            max-width: 200px;
            margin-bottom: 20px;
          }
          .content {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
          }
          .footer {
            text-align: center;
            padding: 20px 0;
            font-size: 12px;
            color: #666;
          }
          h1 {
            color: #5a2dcf;
            margin-top: 0;
          }
          .button {
            display: inline-block;
            background: linear-gradient(to right, #5a2dcf, #2066e4);
            color: white;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
          }
          .social-links {
            margin-top: 20px;
          }
          .social-links a {
            display: inline-block;
            margin: 0 8px;
          }
          .highlight {
            color: #5a2dcf;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <!-- Logo -->
            <img src="https://heallink.com/logo.png" alt="Heallink Logo" class="logo">
          </div>
          <div class="content">
            <h1>Welcome to Heallink!</h1>
            <p>Hi ${name},</p>
            <p>Thank you for joining Heallink! We're excited to have you as part of our healthcare community.</p>
            <p>Heallink connects you with the right healthcare providers through our AI-driven health routing platform. No more waiting, no more confusion — just immediate, intelligent care.</p>
            <p>Here's what you can do with your new account:</p>
            <ul>
              <li>Book appointments with healthcare providers</li>
              <li>Keep track of your medical records</li>
              <li>Securely message your healthcare team</li>
              <li>Get personalized health insights</li>
            </ul>
            <p>Ready to get started?</p>
            <div style="text-align: center;">
              <a href="${this.frontendUrl}/dashboard" class="button">Go to Dashboard</a>
            </div>
            <p>If you have any questions, our support team is here to help. Just reply to this email!</p>
            <p>Best regards,<br>The Heallink Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Heallink. All rights reserved.</p>
            <p>2 Tower of David, Accra - Ghana</p>
            <div class="social-links">
              <a href="https://facebook.com/heallink">Facebook</a> |
              <a href="https://twitter.com/heallink">Twitter</a> |
              <a href="https://instagram.com/heallink">Instagram</a>
            </div>
            <p>You're receiving this email because you recently created a new Heallink account.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Email template for password reset emails
   */
  private getPasswordResetEmailTemplate(
    name: string,
    resetUrl: string
  ): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Heallink Password</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            padding: 20px 0;
          }
          .logo {
            max-width: 200px;
            margin-bottom: 20px;
          }
          .content {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
          }
          .footer {
            text-align: center;
            padding: 20px 0;
            font-size: 12px;
            color: #666;
          }
          h1 {
            color: #5a2dcf;
            margin-top: 0;
          }
          .button {
            display: inline-block;
            background: linear-gradient(to right, #5a2dcf, #2066e4);
            color: white;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
          }
          .warning {
            padding: 15px;
            background-color: #fff8e1;
            border-left: 4px solid #ffc107;
            margin: 20px 0;
          }
          .social-links {
            margin-top: 20px;
          }
          .social-links a {
            display: inline-block;
            margin: 0 8px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <!-- Logo -->
            <img src="https://heallink.com/logo.png" alt="Heallink Logo" class="logo">
          </div>
          <div class="content">
            <h1>Reset Your Password</h1>
            <p>Hi ${name},</p>
            <p>We received a request to reset your password for your Heallink account. If you didn't make this request, you can safely ignore this email.</p>
            <p>To reset your password, click the button below:</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            <div class="warning">
              <p><strong>Note:</strong> This password reset link is only valid for the next 30 minutes.</p>
            </div>
            <p>If the button above doesn't work, copy and paste this URL into your browser:</p>
            <p style="word-break: break-all; font-size: 12px;">${resetUrl}</p>
            <p>If you have any issues, please contact our support team.</p>
            <p>Best regards,<br>The Heallink Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Heallink. All rights reserved.</p>
            <p>2 Tower of David, Accra - Ghana</p>
            <div class="social-links">
              <a href="https://facebook.com/heallink">Facebook</a> |
              <a href="https://twitter.com/heallink">Twitter</a> |
              <a href="https://instagram.com/heallink">Instagram</a>
            </div>
            <p>You're receiving this email because a password reset was requested for your account.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Email template for new admin welcome emails with credentials
   */
  private getAdminWelcomeEmailTemplate(
    name: string,
    email: string,
    password: string,
    loginUrl: string
  ): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Heallink Admin Portal</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            padding: 20px 0;
            background: linear-gradient(to right, #5a2dcf, #2066e4);
            border-radius: 8px 8px 0 0;
          }
          .logo {
            max-width: 200px;
            margin-bottom: 10px;
          }
          .content {
            background: white;
            padding: 30px;
            border-radius: 0 0 8px 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
          }
          .footer {
            text-align: center;
            padding: 20px 0;
            font-size: 12px;
            color: #666;
          }
          h1 {
            color: #5a2dcf;
            margin-top: 0;
          }
          .credentials-box {
            background-color: #f5f8ff;
            border: 1px solid #d1d9ff;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
          }
          .credentials-item {
            margin-bottom: 10px;
          }
          .label {
            font-weight: 600;
            display: inline-block;
            width: 100px;
          }
          .button {
            display: inline-block;
            background: linear-gradient(to right, #5a2dcf, #2066e4);
            color: white;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
          }
          .warning {
            padding: 15px;
            background-color: #fff8e1;
            border-left: 4px solid #ffc107;
            margin: 20px 0;
          }
          .social-links {
            margin-top: 20px;
          }
          .social-links a {
            display: inline-block;
            margin: 0 8px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <!-- Logo -->
            <img src="https://heallink.com/logo-white.png" alt="Heallink Admin Logo" class="logo">
          </div>
          <div class="content">
            <h1>Welcome to Heallink Admin Portal</h1>
            <p>Hi ${name},</p>
            <p>You've been added as an administrator to the Heallink platform. The admin portal gives you access to manage users, providers, analytics, and system settings.</p>
            <p>Your admin account has been created with the following credentials:</p>
            <div class="credentials-box">
              <div class="credentials-item">
                <span class="label">Email:</span> ${email}
              </div>
              <div class="credentials-item">
                <span class="label">Password:</span> ${password}
              </div>
            </div>
            <div class="warning">
              <p><strong>Important:</strong> For security reasons, please change your password immediately after logging in for the first time.</p>
            </div>
            <p>To get started, click the button below to access the admin portal:</p>
            <div style="text-align: center;">
              <a href="${loginUrl}" class="button">Access Admin Portal</a>
            </div>
            <p>If you have any questions or need assistance, please contact the system administrator.</p>
            <p>Best regards,<br>The Heallink Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Heallink. All rights reserved.</p>
            <p>2 Tower of David, Accra - Ghana</p>
            <div class="social-links">
              <a href="https://facebook.com/heallink">Facebook</a> |
              <a href="https://twitter.com/heallink">Twitter</a> |
              <a href="https://instagram.com/heallink">Instagram</a>
            </div>
            <p>This is a confidential admin access email. Please do not forward it.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
