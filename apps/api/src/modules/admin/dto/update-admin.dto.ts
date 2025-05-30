import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminDto } from './create-admin.dto';
import { IsOptional, IsBoolean, IsEnum, IsDate, IsArray, IsString } from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AdminRole } from '../../users/schemas/user.schema';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
  @ApiPropertyOptional({ description: 'Whether email is verified' })
  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;

  @ApiPropertyOptional({ description: 'Whether phone is verified' })
  @IsOptional()
  @IsBoolean()
  phoneVerified?: boolean;

  @ApiPropertyOptional({ description: 'Whether admin is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ 
    description: 'Last login timestamp',
    type: Date
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastLogin?: Date;
}

export class UpdateAdminRoleDto {
  @ApiProperty({ 
    description: 'New admin role',
    enum: AdminRole,
    example: AdminRole.SYSTEM_ADMIN
  })
  @IsEnum(AdminRole)
  adminRole: AdminRole;

  @ApiPropertyOptional({ 
    description: 'Updated permissions for the admin',
    type: [String],
    example: ['user_management', 'admin_management']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];
}
