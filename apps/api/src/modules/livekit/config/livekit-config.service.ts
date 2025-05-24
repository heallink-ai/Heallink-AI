import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LiveKitConfigService {
  constructor(private configService: ConfigService) {}

  get apiKey(): string {
    return this.configService.get<string>('LIVEKIT_API_KEY');
  }

  get apiSecret(): string {
    return this.configService.get<string>('LIVEKIT_API_SECRET');
  }

  get serverUrl(): string {
    return this.configService.get<string>('LIVEKIT_SERVER_URL');
  }

  get openaiApiKey(): string {
    return this.configService.get<string>('OPENAI_API_KEY');
  }

  get deepgramApiKey(): string {
    return this.configService.get<string>('DEEPGRAM_API_KEY');
  }
}
