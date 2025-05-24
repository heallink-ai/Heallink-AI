import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { LiveKitService } from './livekit.service';
import { GenerateTokenDto } from './dto/generate-token.dto';
import { InitializeAssistantDto } from './dto/initialize-assistant.dto';
import { TokenResponse } from './interfaces/token-response.interface';
import { VoiceAssistantState } from './interfaces/voice-assistant-state.interface';

@Controller('livekit')
export class LiveKitController {
  constructor(private readonly livekitService: LiveKitService) {}

  @Post('token')
  @HttpCode(HttpStatus.OK)
  generateToken(@Body() generateTokenDto: GenerateTokenDto): TokenResponse {
    return this.livekitService.generateToken(generateTokenDto);
  }

  @Post('voice-assistant/initialize')
  @HttpCode(HttpStatus.OK)
  async initializeAssistant(
    @Body() initializeDto: InitializeAssistantDto,
  ): Promise<{ success: boolean }> {
    await this.livekitService.initializeAssistant(initializeDto);
    return { success: true };
  }

  @Get('voice-assistant/:roomName/state')
  getAssistantState(@Param('roomName') roomName: string): VoiceAssistantState {
    const state = this.livekitService.getAssistantState(roomName);
    if (!state) {
      return {
        roomName,
        participants: [],
        isListening: false,
        isSpeaking: false,
        transcript: '',
      };
    }
    return state;
  }

  @Delete('voice-assistant/:roomName')
  @HttpCode(HttpStatus.OK)
  async endAssistant(
    @Param('roomName') roomName: string,
  ): Promise<{ success: boolean }> {
    await this.livekitService.endAssistant(roomName);
    return { success: true };
  }
}
