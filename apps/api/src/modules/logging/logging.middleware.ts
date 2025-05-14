import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from './logging.service';

interface RequestWithId extends Request {
  requestId: string;
}

interface RequestLog {
  method: string;
  originalUrl: string;
  ip: string;
  headers: Record<string, unknown>;
  body: unknown;
  requestId: string;
}

interface ResponseLog {
  statusCode: number;
}

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly loggingService: LoggingService) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const method = request.method;
    const originalUrl = request.originalUrl;
    const ip = request.ip || '';
    const headers = request.headers as Record<string, unknown>;
    const body = request.body as unknown;
    const requestId =
      (request.headers['x-request-id'] as string) || this.generateRequestId();

    // Set the request ID in the response header
    response.setHeader('x-request-id', requestId);

    // Set requestId on request object for use in handlers
    (request as RequestWithId).requestId = requestId;

    const startTime = Date.now();

    this.loggingService.log(
      `Incoming Request: ${method} ${originalUrl}`,
      'HttpMiddleware',
    );

    // Log response after it's sent
    response.on('finish', () => {
      const responseTime = Date.now() - startTime;
      const statusCode = response.statusCode;

      if (statusCode >= 400) {
        this.loggingService.error(
          `Request Error: ${method} ${originalUrl} - Status ${statusCode}`,
          undefined,
          'HttpMiddleware',
        );
      }

      const requestLog: RequestLog = {
        method,
        originalUrl,
        ip,
        headers,
        body,
        requestId,
      };

      const responseLog: ResponseLog = {
        statusCode,
      };

      this.loggingService.logRequest(requestLog, responseLog, responseTime);
    });

    next();
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }
}
