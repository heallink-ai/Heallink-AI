import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LiveKitController } from './livekit.controller';
import { LiveKitService } from './livekit.service';
import { LiveKitConfigService } from './config/livekit-config.service';

@Module({
  imports: [ConfigModule],
  controllers: [LiveKitController],
  providers: [LiveKitService, LiveKitConfigService],
  exports: [LiveKitService],
})
export class LiveKitModule {}
