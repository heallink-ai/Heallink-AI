import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum SocialProvider {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  APPLE = 'apple',
}

export class SocialLoginDto {
  @ApiProperty({
    description: 'Social provider token/code from OAuth flow',
    example: 'ya29.a0AfB_byD2cZYMDtKKRN0...',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: 'Social provider type',
    example: 'google',
    enum: SocialProvider,
    enumName: 'SocialProvider',
  })
  @IsEnum(SocialProvider)
  @IsNotEmpty()
  provider: SocialProvider;

  @ApiPropertyOptional({
    description: 'URL to redirect after successful authentication',
    example: 'https://example.com/auth-callback',
  })
  @IsString()
  @IsOptional()
  redirectUrl?: string;

  @ApiProperty({
    description: 'Email address associated with the social account',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User name from social provider',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
