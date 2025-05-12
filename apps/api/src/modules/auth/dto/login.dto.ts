import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiPropertyOptional({
    description: 'User email address',
    example: 'user@example.com',
    format: 'email',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+12345678901',
    format: 'phone',
  })
  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'User password',
    example: 'StrongP@ssw0rd',
    minLength: 8,
    format: 'password',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
