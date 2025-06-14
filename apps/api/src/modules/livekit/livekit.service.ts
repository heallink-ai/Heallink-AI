import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AccessToken,
  RoomServiceClient,
  Room,
  WebhookReceiver,
} from 'livekit-server-sdk';
import { CreateRoomDto, CreateTokenDto } from './dto';

interface LiveKitConfig {
  url: string;
  apiKey: string;
  apiSecret: string;
}

@Injectable()
export class LivekitService {
  private readonly logger = new Logger(LivekitService.name);
  private roomService: RoomServiceClient;
  private apiKey: string;
  private apiSecret: string;
  private webhookReceiver: WebhookReceiver;
  private aiEngineUrl: string;

  constructor(private configService: ConfigService) {
    const livekitConfig = this.configService.get<LiveKitConfig>('livekit');

    if (
      !livekitConfig ||
      !livekitConfig.url ||
      !livekitConfig.apiKey ||
      !livekitConfig.apiSecret
    ) {
      this.logger.error('LiveKit configuration is missing');
      throw new Error('LiveKit configuration is missing');
    }

    this.apiKey = livekitConfig.apiKey;
    this.apiSecret = livekitConfig.apiSecret;

    // Initialize the room service client
    this.roomService = new RoomServiceClient(
      livekitConfig.url.replace('wss://', 'https://'),
      this.apiKey,
      this.apiSecret,
    );

    // Initialize webhook receiver
    this.webhookReceiver = new WebhookReceiver(this.apiKey, this.apiSecret);

    // Get AI Engine URL from config
    const aiEngineConfig = this.configService.get('aiEngine');
    this.aiEngineUrl = aiEngineConfig?.url || 'http://ai-engine:8000';

    // Log webhook configuration (no need to await this)
    // this.configureWebhooks();
  }

  /**
   * Configure webhooks to be sent to the AI Engine
   */
  private configureWebhooks(): void {
    try {
      this.logger.log('Configuring LiveKit webhooks');

      // Get webhook endpoint
      const webhookEndpoint = `${this.aiEngineUrl}/api/v1/webhooks/livekit`;
      this.logger.log(`Setting up webhook to endpoint: ${webhookEndpoint}`);

      // Note: This is just logging that we would set up the webhook
      // In a real implementation, you would use the LiveKit Admin API to set up webhooks
      // or configure them through the LiveKit Cloud dashboard
      this.logger.log(`LiveKit webhook would be configured with:
        - API Key: ${this.apiKey.substring(0, 4)}...
        - Endpoint: ${webhookEndpoint}
        - Events: participant_joined, participant_left
      `);

      // Instructions for manually setting up webhooks
      this.logger.log(`
        To configure webhooks in LiveKit Cloud:
        1. Go to the LiveKit Cloud dashboard
        2. Navigate to your project's settings
        3. Add a webhook with the following details:
           - URL: ${webhookEndpoint}
           - Events: Select "Participant Joined" and other events of interest
           - API Key: Use the same API key as your LiveKit config
      `);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to configure webhooks: ${errorMessage}`,
        errorStack,
      );
    }
  }

  /**
   * Generate a token for a participant to join a room
   */
  async createToken(createTokenDto: CreateTokenDto): Promise<string> {
    const {
      roomName,
      identity,
      canPublish = true,
      canSubscribe = true,
      canPublishData = true,
    } = createTokenDto;

    try {
      // Create an access token with the given identity
      const token = new AccessToken(this.apiKey, this.apiSecret, {
        identity,
        ttl: '1h', // Token expires after 1 hour
      });

      // Add permissions to the token
      token.addGrant({
        roomJoin: true,
        room: roomName,
        canPublish,
        canSubscribe,
        canPublishData,
      });

      // Create the room if it doesn't exist
      await this.createRoomIfNotExists(roomName);

      // Generate JWT token
      return await token.toJwt();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Failed to create token: ${errorMessage}`, errorStack);

      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Failed to create token: ${errorMessage}`);
    }
  }

  /**
   * Create a new room or ensure it exists
   */
  async createRoom(createRoomDto: CreateRoomDto): Promise<Room> {
    const { name, emptyTimeout = 10, maxParticipants = 2 } = createRoomDto;

    try {
      // Create room options
      const roomOptions = {
        name,
        emptyTimeout: emptyTimeout * 60, // Convert minutes to seconds
        maxParticipants,
        // Add specific metadata for voice-only rooms if needed
        metadata: createRoomDto.isVoiceOnly
          ? JSON.stringify({ isVoiceOnly: true })
          : undefined,
      };

      // Create the room
      const room = await this.roomService.createRoom(roomOptions);
      this.logger.log(`Room created: ${name}`);
      return room;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Failed to create room: ${errorMessage}`, errorStack);

      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Failed to create room: ${errorMessage}`);
    }
  }

  /**
   * Create a room if it doesn't exist
   */
  private async createRoomIfNotExists(roomName: string): Promise<void> {
    try {
      // Try to list the room to check if it exists
      const rooms = await this.roomService.listRooms();
      const roomExists = rooms.some((room) => room.name === roomName);

      // If room doesn't exist, create it
      if (!roomExists) {
        await this.createRoom({ name: roomName });
        this.logger.log(`Room created because it didn't exist: ${roomName}`);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to check/create room: ${errorMessage}`,
        errorStack,
      );

      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Failed to check/create room: ${errorMessage}`);
    }
  }

  /**
   * List all rooms
   */
  async listRooms(): Promise<Room[]> {
    try {
      return await this.roomService.listRooms();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Failed to list rooms: ${errorMessage}`, errorStack);

      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Failed to list rooms: ${errorMessage}`);
    }
  }

  /**
   * Delete a room
   */
  async deleteRoom(roomName: string): Promise<void> {
    try {
      await this.roomService.deleteRoom(roomName);
      this.logger.log(`Room deleted: ${roomName}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Failed to delete room: ${errorMessage}`, errorStack);

      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Failed to delete room: ${errorMessage}`);
    }
  }
}
