import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LoggingService } from './logging.service';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly loggingService: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const { method, originalUrl, ip, headers, body } = request;
    const userAgent = headers['user-agent'] || 'unknown';
    const startTime = Date.now();
    const requestId = headers['x-request-id'] || this.generateRequestId();

    // Set the request ID in the response header for tracing
    response.setHeader('x-request-id', requestId);

    // Add request ID to the request object for use in handlers
    (request as any).requestId = requestId;

    this.loggingService.log(
      `Incoming Request: ${method} ${originalUrl}`,
      'HttpInterceptor',
    );

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - startTime;
        const statusCode = response.statusCode;

        // Log successful requests
        this.loggingService.logRequest(
          { method, originalUrl, ip, headers, body, requestId },
          { statusCode },
          responseTime,
        );
      }),
      catchError((error) => {
        const responseTime = Date.now() - startTime;
        const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;

        // Log error requests
        this.loggingService.error(
          `Request Error: ${method} ${originalUrl} - ${error.message}`,
          error.stack,
          'HttpInterceptor',
        );

        this.loggingService.logRequest(
          { method, originalUrl, ip, headers, body, requestId },
          { statusCode },
          responseTime,
        );

        throw error;
      }),
    );
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }
}
