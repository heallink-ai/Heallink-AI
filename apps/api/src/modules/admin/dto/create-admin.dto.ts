import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  Matches,
  Length,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole, AdminRole } from '../../users/schemas/user.schema';

export class CreateAdminDto {
  @ApiProperty({ description: 'Admin email address', example: 'admin@heallink.com' })
  @IsString()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ 
    description: 'Phone number in E.164 format', 
    example: '+1234567890' 
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be a valid E.164 format',
  })
  phone?: string;

  @ApiProperty({ description: 'Admin full name', example: 'John Doe' })
  @IsString()
  @Length(2, 100)
  name: string;

  @ApiPropertyOptional({ 
    description: 'Admin password (optional, will be generated if not provided)',
    minLength: 6,
    maxLength: 30
  })
  @IsOptional()
  @IsString()
  @Length(6, 30)
  password?: string;

  @ApiProperty({ 
    description: 'User role',
    enum: UserRole,
    example: UserRole.ADMIN
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ 
    description: 'Admin role for specific permissions',
    enum: AdminRole,
    example: AdminRole.SYSTEM_ADMIN
  })
  @IsEnum(AdminRole)
  adminRole: AdminRole;

  @ApiPropertyOptional({ 
    description: 'Specific permissions for the admin',
    type: [String],
    example: ['user_management', 'admin_management']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];

  @ApiPropertyOptional({ 
    description: 'Avatar URL',
    example: 'https://example.com/avatar.jpg'
  })
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
