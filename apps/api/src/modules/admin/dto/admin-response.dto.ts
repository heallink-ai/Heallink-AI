import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole, AdminRole } from '../../users/schemas/user.schema';

export class AdminResponseDto {
  @ApiProperty({ description: 'Admin ID' })
  id: string;

  @ApiProperty({ description: 'Admin email address' })
  email: string;

  @ApiPropertyOptional({ description: 'Admin phone number' })
  phone?: string;

  @ApiProperty({ description: 'Admin full name' })
  name: string;

  @ApiProperty({ description: 'User role', enum: UserRole })
  role: UserRole;

  @ApiProperty({ description: 'Admin role', enum: AdminRole })
  adminRole: AdminRole;

  @ApiPropertyOptional({ description: 'Admin permissions', type: [String] })
  permissions?: string[];

  @ApiPropertyOptional({ description: 'Avatar URL' })
  avatarUrl?: string;

  @ApiProperty({ description: 'Whether email is verified' })
  emailVerified: boolean;

  @ApiPropertyOptional({ description: 'Whether phone is verified' })
  phoneVerified?: boolean;

  @ApiProperty({ description: 'Whether admin is active' })
  isActive: boolean;

  @ApiPropertyOptional({ description: 'Last login timestamp' })
  lastLogin?: Date;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}

export class AdminListResponseDto {
  @ApiProperty({ description: 'List of admin users', type: [AdminResponseDto] })
  admins: AdminResponseDto[];

  @ApiProperty({ description: 'Total number of admins' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;
}

export class AdminStatsResponseDto {
  @ApiProperty({ description: 'Total number of admin users' })
  totalAdmins: number;

  @ApiProperty({ description: 'Number of active admin users' })
  activeAdmins: number;

  @ApiProperty({ description: 'Number of recently created admin users' })
  recentlyCreated: number;

  @ApiProperty({ 
    description: 'Distribution of admins by role',
    type: 'object',
    additionalProperties: { type: 'number' }
  })
  roleDistribution: Record<string, number>;
}

export class BulkActionResponseDto {
  @ApiProperty({ description: 'Response message' })
  message: string;

  @ApiProperty({ description: 'Number of successful operations' })
  success: number;

  @ApiProperty({ description: 'Number of failed operations' })
  failed: number;

  @ApiPropertyOptional({ 
    description: 'Details of failed operations',
    type: [String]
  })
  errors?: string[];
}