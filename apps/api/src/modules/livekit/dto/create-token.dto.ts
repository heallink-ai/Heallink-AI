import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateTokenDto {
  @ApiProperty({
    description: 'Room name to join',
    example: 'voice-assistant-room',
  })
  @IsNotEmpty()
  @IsString()
  roomName: string;

  @ApiProperty({
    description: 'Participant identity',
    example: 'user-123',
  })
  @IsNotEmpty()
  @IsString()
  identity: string;

  @ApiProperty({
    description: 'Can publish audio/video',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  canPublish?: boolean;

  @ApiProperty({
    description: 'Can subscribe to others tracks',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  canSubscribe?: boolean;

  @ApiProperty({
    description: 'Can publish data',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  canPublishData?: boolean;
}