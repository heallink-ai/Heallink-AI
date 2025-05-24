import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateTokenDto {
  @IsNotEmpty()
  @IsString()
  identity: string;

  @IsNotEmpty()
  @IsString()
  roomName: string;
}
