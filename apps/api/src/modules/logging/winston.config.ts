import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { format } from 'winston';
import { join } from 'path';

export function configureWinston(
  configService: ConfigService,
): winston.LoggerOptions {
  // Log directory - defaults to logs in project root
  const logDir =
    configService.get<string>('LOG_DIR') || join(process.cwd(), 'logs');
  const nodeEnv = configService.get<string>('nodeEnv') || 'development';

  // Format for console logs
  const consoleFormat = format.combine(
    format.timestamp(),
    format.ms(),
    format.colorize(),
    format.printf(({ timestamp, level, message, context, trace, ...meta }) => {
      return `[${timestamp}] [${level}] ${context ? `[${context}] ` : ''}${message} ${trace ? `\n${trace}` : ''} ${
        Object.keys(meta).length
          ? `\nmeta: ${JSON.stringify(meta, null, 2)}`
          : ''
      }`;
    }),
  );

  // Format for file logs - JSON for better parsing
  const fileFormat = format.combine(
    format.timestamp(),
    format.ms(),
    format.uncolorize(),
    format.json(),
  );

  // Configure log rotation for application logs
  const appLogRotation: DailyRotateFile.DailyRotateFileTransportOptions = {
    dirname: logDir,
    filename: 'app-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxFiles: '30d', // keep logs for 30 days
    maxSize: '20m', // rotate when file size exceeds 20MB
    createSymlink: true,
    symlinkName: 'app-current.log',
  };

  // Configure log rotation for error logs
  const errorLogRotation: DailyRotateFile.DailyRotateFileTransportOptions = {
    dirname: logDir,
    filename: 'error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxFiles: '30d',
    maxSize: '20m',
    level: 'error',
    createSymlink: true,
    symlinkName: 'error-current.log',
  };

  // Configure log rotation for HTTP access logs
  const httpLogRotation: DailyRotateFile.DailyRotateFileTransportOptions = {
    dirname: join(logDir, 'http'),
    filename: 'http-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxFiles: '30d',
    maxSize: '20m',
    createSymlink: true,
    symlinkName: 'http-current.log',
  };

  // Configure log rotation for auth logs
  const authLogRotation: DailyRotateFile.DailyRotateFileTransportOptions = {
    dirname: join(logDir, 'auth'),
    filename: 'auth-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxFiles: '60d', // keep auth logs longer
    maxSize: '20m',
    createSymlink: true,
    symlinkName: 'auth-current.log',
  };

  // Set up transports based on environment
  const transports: winston.transport[] = [
    // Console transport - always enabled
    new winston.transports.Console({
      format: consoleFormat,
      level: nodeEnv === 'production' ? 'info' : 'silly',
    }),
  ];

  // File transports - can be conditionally enabled
  if (
    nodeEnv === 'production' ||
    configService.get<string>('ENABLE_FILE_LOGGING') === 'true'
  ) {
    transports.push(
      // App logs - combined
      new DailyRotateFile({
        ...appLogRotation,
        format: fileFormat,
        level: nodeEnv === 'production' ? 'info' : 'debug',
      }),

      // Error logs
      new DailyRotateFile({
        ...errorLogRotation,
        format: fileFormat,
      }),

      // HTTP logs
      new DailyRotateFile({
        ...httpLogRotation,
        format: fileFormat,
      }),

      // Auth logs
      new DailyRotateFile({
        ...authLogRotation,
        format: fileFormat,
      }),
    );
  }

  return {
    level: nodeEnv === 'production' ? 'info' : 'silly',
    format: format.combine(
      format.timestamp(),
      format.errors({ stack: true }),
      format.splat(),
    ),
    defaultMeta: { service: 'heallink-api' },
    transports,
    exitOnError: false,
  };
}
