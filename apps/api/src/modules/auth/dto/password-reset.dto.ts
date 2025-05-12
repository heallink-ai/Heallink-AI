import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class PasswordResetRequestDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@heallink.com',
  })
  @IsEmail()
  email: string;
}

export class PasswordResetDto {
  @ApiProperty({
    description: 'Reset token from email',
    example: '6a9b8c7d6e5f4a3b2c1d0e',
  })
  @IsString()
  token: string;

  @ApiProperty({
    description: 'New password',
    example: 'NewSecurePassword123!',
  })
  @IsString()
  @MinLength(8)
  newPassword: string;
}
