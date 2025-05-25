import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({
    description: 'Room name to create',
    example: 'voice-assistant-room',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Empty timeout in minutes',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @IsNumber()
  emptyTimeout?: number;

  @ApiProperty({
    description: 'Maximum number of participants',
    example: 2,
    default: 2,
  })
  @IsOptional()
  @IsNumber()
  maxParticipants?: number;

  @ApiProperty({
    description: 'Whether the room is for voice only',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isVoiceOnly?: boolean;
}