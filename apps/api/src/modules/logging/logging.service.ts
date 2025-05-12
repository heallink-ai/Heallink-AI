import { Injectable, LoggerService, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Inject } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggingService implements LoggerService {
  private context?: string;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly winstonLogger: winston.Logger,
    private readonly configService: ConfigService,
  ) {}

  setContext(context: string): this {
    this.context = context;
    return this;
  }

  log(message: string, context?: string): void {
    this.winstonLogger.info(message, {
      context: context || this.context,
      timestamp: new Date().toISOString(),
    });
  }

  error(message: string, trace?: string, context?: string): void {
    this.winstonLogger.error(message, {
      trace,
      context: context || this.context,
      timestamp: new Date().toISOString(),
    });
  }

  warn(message: string, context?: string): void {
    this.winstonLogger.warn(message, {
      context: context || this.context,
      timestamp: new Date().toISOString(),
    });
  }

  debug(message: string, context?: string): void {
    if (this.configService.get<string>('nodeEnv') !== 'production') {
      this.winstonLogger.debug(message, {
        context: context || this.context,
        timestamp: new Date().toISOString(),
      });
    }
  }

  verbose(message: string, context?: string): void {
    if (this.configService.get<string>('nodeEnv') !== 'production') {
      this.winstonLogger.verbose(message, {
        context: context || this.context,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Method to log API requests
  logRequest(req: any, res: any, responseTime: number): void {
    const { method, originalUrl, ip, headers, body } = req;
    const userAgent = headers['user-agent'];
    const { statusCode } = res;

    const sanitizedBody = this.sanitizeData(body);

    this.log(
      `[HTTP] ${method} ${originalUrl} ${statusCode} ${responseTime}ms`,
      'HttpRequest',
    );

    this.verbose(
      JSON.stringify({
        method,
        url: originalUrl,
        statusCode,
        responseTime,
        ip,
        userAgent,
        body: sanitizedBody,
      }),
      'HttpRequestDetails',
    );
  }

  // Log authentication events
  logAuth(
    userId: string,
    action: string,
    success: boolean,
    details?: any,
  ): void {
    const log = {
      userId,
      action,
      success,
      details: this.sanitizeData(details),
      timestamp: new Date().toISOString(),
    };

    if (success) {
      this.log(
        `[AUTH] ${action} successful for user ${userId}`,
        'Authentication',
      );
    } else {
      this.warn(`[AUTH] ${action} failed for user ${userId}`, 'Authentication');
    }

    this.verbose(JSON.stringify(log), 'AuthDetails');
  }

  // Log system events
  logSystem(action: string, details?: any): void {
    const log = {
      action,
      details,
      timestamp: new Date().toISOString(),
    };

    this.log(`[SYSTEM] ${action}`, 'System');
    this.verbose(JSON.stringify(log), 'SystemDetails');
  }

  // Helper to sanitize sensitive data
  private sanitizeData(data: any): any {
    if (!data) return data;

    const sanitized = { ...data };
    const sensitiveFields = [
      'password',
      'token',
      'accessToken',
      'refreshToken',
      'secret',
      'apiKey',
    ];

    sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });

    return sanitized;
  }
}
