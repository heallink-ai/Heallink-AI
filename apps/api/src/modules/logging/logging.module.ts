import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { LoggingService } from './logging.service';
import { LoggingInterceptor } from './logging.interceptor';
import { configureWinston } from './winston.config';

@Module({
  imports: [
    ConfigModule,
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configureWinston(configService),
    }),
  ],
  providers: [LoggingService, LoggingInterceptor],
  exports: [LoggingService, LoggingInterceptor],
})
export class LoggingModule {}
