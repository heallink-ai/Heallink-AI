import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AccessToken } from 'livekit-server-sdk';
import { LiveKitConfigService } from './config/livekit-config.service';
import { GenerateTokenDto } from './dto/generate-token.dto';
import { InitializeAssistantDto } from './dto/initialize-assistant.dto';
import { TokenResponse } from './interfaces/token-response.interface';
import { VoiceAssistantState } from './interfaces/voice-assistant-state.interface';
import { llm, pipeline } from '@livekit/agents';
import * as deepgram from '@livekit/agents-plugin-deepgram';
import * as openai from '@livekit/agents-plugin-openai';
import * as silero from '@livekit/agents-plugin-silero';

@Injectable()
export class LiveKitService implements OnModuleInit {
  private readonly logger = new Logger(LiveKitService.name);
  private agents = new Map<string, pipeline.VoicePipelineAgent>();
  private assistantStates = new Map<string, VoiceAssistantState>();

  constructor(private readonly config: LiveKitConfigService) {}

  async onModuleInit() {
    // Log config availability (without revealing secrets)
    this.logger.log('LiveKit integration initialized');
    this.logger.log(
      `LiveKit Server URL: ${this.config.serverUrl || 'Not configured'}`,
    );
    this.logger.log(`LiveKit API Key configured: ${!!this.config.apiKey}`);
    this.logger.log(`OpenAI API Key configured: ${!!this.config.openaiApiKey}`);
    this.logger.log(
      `Deepgram API Key configured: ${!!this.config.deepgramApiKey}`,
    );
  }

  /**
   * Generate a LiveKit token for connecting to a room
   */
  generateToken(dto: GenerateTokenDto): TokenResponse {
    try {
      const { identity, roomName } = dto;

      // Create a new access token
      const token = new AccessToken(this.config.apiKey, this.config.apiSecret, {
        identity,
        ttl: 60 * 60, // 1 hour
      });

      // Grant permissions to the token
      token.addGrant({
        roomJoin: true,
        room: roomName,
        canPublish: true,
        canSubscribe: true,
        canPublishData: true,
      });

      return {
        token: token.toJwt(),
        serverUrl: this.config.serverUrl,
      };
    } catch (error) {
      this.logger.error(
        `Failed to generate token: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Initialize the voice assistant for a room
   */
  async initializeAssistant(dto: InitializeAssistantDto): Promise<void> {
    try {
      const { roomName, identity } = dto;

      // Generate a token for the assistant
      const assistantIdentity = `assistant-${roomName}`;
      const assistantToken = new AccessToken(
        this.config.apiKey,
        this.config.apiSecret,
        {
          identity: assistantIdentity,
          ttl: 60 * 60, // 1 hour
        },
      );

      assistantToken.addGrant({
        roomJoin: true,
        room: roomName,
        canPublish: true,
        canSubscribe: true,
        canPublishData: true,
      });

      this.logger.log(`Initializing voice assistant for room: ${roomName}`);

      // Initialize the voice assistant state
      this.assistantStates.set(roomName, {
        roomName,
        participants: [
          { id: identity, identity, isAgent: false },
          { id: assistantIdentity, identity: assistantIdentity, isAgent: true },
        ],
        isListening: false,
        isSpeaking: false,
        transcript: '',
      });

      // Set up the agent with VAD, STT, LLM, and TTS components
      const initialContext = new llm.ChatContext().append({
        role: llm.ChatRole.SYSTEM,
        text: 'You are a helpful healthcare assistant for the Heallink platform. You help users navigate the platform, answer questions about their health data, and provide general healthcare information. Be concise, helpful, and friendly. Do not provide medical diagnoses or treatment recommendations.',
      });

      try {
        // Initialize the voice pipeline agent
        const voiceAgent = new pipeline.VoicePipelineAgent(
          await silero.VAD.load(),
          new deepgram.STT({
            apiKey: this.config.deepgramApiKey,
            model: 'nova-2-general',
          }),
          new openai.LLM({
            apiKey: this.config.openaiApiKey,
            model: 'gpt-4o-mini',
            temperature: 0.5,
          }),
          new openai.TTS({
            apiKey: this.config.openaiApiKey,
            voice: 'alloy',
            model: 'tts-1',
          }),
          {
            chatCtx: initialContext,
            allowInterruptions: true,
            interruptSpeechDuration: 500,
            interruptMinWords: 0,
            minEndpointingDelay: 500,
            beforeLLMCallback: this.handleBeforeLLM.bind(this),
            beforeTTSCallback: this.handleBeforeTTS.bind(this),
          },
        );

        // Set up event listeners
        this.setupAgentEventListeners(voiceAgent, roomName);

        // Store the agent
        this.agents.set(roomName, voiceAgent);

        // Connect to the room
        const { Room } = await import('@livekit/agents');
        const room = new Room();

        // Connect to the room using the token
        await room.connect(this.config.serverUrl, assistantToken.toJwt());

        // Start the agent
        voiceAgent.start(room);

        this.logger.log(`Voice assistant connected to room: ${roomName}`);
      } catch (error) {
        this.logger.error(
          `Failed to initialize voice agent: ${error.message}`,
          error.stack,
        );
        throw error;
      }
    } catch (error) {
      this.logger.error(
        `Failed to initialize assistant: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Get the current state of the voice assistant for a room
   */
  getAssistantState(roomName: string): VoiceAssistantState | null {
    return this.assistantStates.get(roomName) || null;
  }

  /**
   * Callback before sending text to the LLM
   */
  private async handleBeforeLLM(
    agent: pipeline.VoicePipelineAgent,
    chatCtx: llm.ChatContext,
  ): Promise<void> {
    // Truncate context if it gets too long to optimize token usage
    if (chatCtx.messages.length > 15) {
      // Keep system prompt and last 14 messages
      const systemPrompt = chatCtx.messages.find(
        (m) => m.role === llm.ChatRole.SYSTEM,
      );
      const recentMessages = chatCtx.messages.slice(-14);

      chatCtx.messages = systemPrompt
        ? [systemPrompt, ...recentMessages]
        : recentMessages;
    }
  }

  /**
   * Callback before sending text to TTS
   */
  private async handleBeforeTTS(
    agent: pipeline.VoicePipelineAgent,
    text: string | AsyncIterable<string>,
  ): Promise<string | AsyncIterable<string>> {
    // Custom pronunciation handling
    if (typeof text === 'string') {
      // Example of replacing specific terms with phonetic pronunciation
      text = text.replace(/heallink/gi, 'Heal-link');
    }
    return text;
  }

  /**
   * Set up event listeners for the voice pipeline agent
   */
  private setupAgentEventListeners(
    agent: pipeline.VoicePipelineAgent,
    roomName: string,
  ): void {
    // Listen for state changes
    agent.on(pipeline.VPAEvent.USER_STARTED_SPEAKING, () => {
      this.updateAssistantState(roomName, {
        isListening: true,
        isSpeaking: false,
      });
      this.logger.debug(`[${roomName}] User started speaking`);
    });

    agent.on(pipeline.VPAEvent.USER_STOPPED_SPEAKING, () => {
      this.updateAssistantState(roomName, { isListening: false });
      this.logger.debug(`[${roomName}] User stopped speaking`);
    });

    agent.on(pipeline.VPAEvent.AGENT_STARTED_SPEAKING, () => {
      this.updateAssistantState(roomName, {
        isListening: false,
        isSpeaking: true,
      });
      this.logger.debug(`[${roomName}] Agent started speaking`);
    });

    agent.on(pipeline.VPAEvent.AGENT_STOPPED_SPEAKING, () => {
      this.updateAssistantState(roomName, { isSpeaking: false });
      this.logger.debug(`[${roomName}] Agent stopped speaking`);
    });

    agent.on(
      pipeline.VPAEvent.USER_SPEECH_COMMITTED,
      (msg: llm.ChatMessage) => {
        let content = '';
        if (Array.isArray(msg.content)) {
          content = msg.content
            .map((x) => (typeof x === 'string' ? x : '[image]'))
            .join(' ');
        } else {
          content = msg.content as string;
        }

        this.updateAssistantState(roomName, {
          transcript: content,
        });
        this.logger.debug(`[${roomName}] User speech committed: ${content}`);
      },
    );

    agent.on(
      pipeline.VPAEvent.AGENT_SPEECH_COMMITTED,
      (msg: llm.ChatMessage) => {
        let content = '';
        if (Array.isArray(msg.content)) {
          content = msg.content
            .map((x) => (typeof x === 'string' ? x : '[image]'))
            .join(' ');
        } else {
          content = msg.content as string;
        }

        // Append agent's response to the transcript
        const currentState = this.assistantStates.get(roomName);
        if (currentState) {
          this.updateAssistantState(roomName, {
            transcript: `${currentState.transcript}\n\nAssistant: ${content}`,
          });
        }
        this.logger.debug(`[${roomName}] Agent speech committed: ${content}`);
      },
    );

    agent.on(pipeline.VPAEvent.METRICS_COLLECTED, (metrics) => {
      this.logger.debug(`[${roomName}] Metrics: ${JSON.stringify(metrics)}`);
    });
  }

  /**
   * Update assistant state with new values
   */
  private updateAssistantState(
    roomName: string,
    updates: Partial<VoiceAssistantState>,
  ): void {
    const currentState = this.assistantStates.get(roomName);
    if (currentState) {
      this.assistantStates.set(roomName, { ...currentState, ...updates });
    }
  }

  /**
   * End a voice assistant session
   */
  async endAssistant(roomName: string): Promise<void> {
    try {
      const agent = this.agents.get(roomName);
      if (agent) {
        // Disconnect the agent
        agent.stop();
        this.agents.delete(roomName);
        this.assistantStates.delete(roomName);
        this.logger.log(`Voice assistant removed for room: ${roomName}`);
      }
    } catch (error) {
      this.logger.error(
        `Failed to end assistant: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
