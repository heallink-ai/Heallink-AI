import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SmsService } from './sms.service';
import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [ConfigModule, LoggingModule],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
