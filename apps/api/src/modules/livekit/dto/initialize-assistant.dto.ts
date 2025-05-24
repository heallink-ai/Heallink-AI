import { IsNotEmpty, IsString } from 'class-validator';

export class InitializeAssistantDto {
  @IsNotEmpty()
  @IsString()
  roomName: string;

  @IsNotEmpty()
  @IsString()
  identity: string;
}
