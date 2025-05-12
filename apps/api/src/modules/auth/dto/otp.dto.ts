import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiPropertyOptional({
    description: 'User email address to send OTP',
    example: 'user@example.com',
    format: 'email',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'User phone number to send OTP',
    example: '+12345678901',
    format: 'phone',
  })
  @IsPhoneNumber()
  @IsOptional()
  phone?: string;
}

export class VerifyOtpDto {
  @ApiPropertyOptional({
    description: 'User email address for verification',
    example: 'user@example.com',
    format: 'email',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'User phone number for verification',
    example: '+12345678901',
    format: 'phone',
  })
  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'One-time password code',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}
