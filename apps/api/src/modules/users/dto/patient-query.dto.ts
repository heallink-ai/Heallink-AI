import { IsOptional, IsEnum, IsString, IsDateString, IsInt, Min, Max, IsArray, IsBoolean } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AccountStatus, InsuranceStatus, SubscriptionPlan } from '../schemas/user.schema';

export class PatientQueryDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    minimum: 1,
    maximum: 100,
    default: 25,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 25;

  @ApiPropertyOptional({
    description: 'Free text search across name, email, phone, user ID',
    example: 'john doe',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Fields to search in',
    isArray: true,
    enum: ['name', 'email', 'phone'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  searchFields?: string[];

  @ApiPropertyOptional({
    description: 'Field to sort by',
    enum: ['name', 'email', 'createdAt', 'lastLogin', 'accountStatus'],
    default: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';

  // Status Filters
  @ApiPropertyOptional({
    description: 'Filter by account status',
    enum: AccountStatus,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(AccountStatus, { each: true })
  @Transform(({ value }) => Array.isArray(value) ? value : [value])
  accountStatus?: AccountStatus[];

  @ApiPropertyOptional({
    description: 'Filter by insurance status',
    enum: InsuranceStatus,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(InsuranceStatus, { each: true })
  @Transform(({ value }) => Array.isArray(value) ? value : [value])
  insuranceStatus?: InsuranceStatus[];

  @ApiPropertyOptional({
    description: 'Filter by subscription plan',
    enum: SubscriptionPlan,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(SubscriptionPlan, { each: true })
  @Transform(({ value }) => Array.isArray(value) ? value : [value])
  subscriptionPlan?: SubscriptionPlan[];

  // Verification Filters
  @ApiPropertyOptional({
    description: 'Filter by email verification status',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  emailVerified?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by phone verification status',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  phoneVerified?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by two-factor authentication status',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  twoFactorEnabled?: boolean;

  // Date Range Filters
  @ApiPropertyOptional({
    description: 'Filter patients created after this date',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  createdAfter?: string;

  @ApiPropertyOptional({
    description: 'Filter patients created before this date',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  createdBefore?: string;

  @ApiPropertyOptional({
    description: 'Filter patients with last login after this date',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  lastLoginAfter?: string;

  @ApiPropertyOptional({
    description: 'Filter patients with last login before this date',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  lastLoginBefore?: string;

  @ApiPropertyOptional({
    description: 'Filter patients who have not logged in for X days',
    minimum: 1,
    example: 30,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  inactiveDays?: number;

  // Location Filters
  @ApiPropertyOptional({
    description: 'Filter by country',
    example: 'United States',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    description: 'Filter by state/region',
    example: 'California',
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({
    description: 'Filter by city',
    example: 'San Francisco',
  })
  @IsOptional()
  @IsString()
  city?: string;

  // Age Range
  @ApiPropertyOptional({
    description: 'Minimum age filter',
    minimum: 0,
    maximum: 150,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(150)
  minAge?: number;

  @ApiPropertyOptional({
    description: 'Maximum age filter',
    minimum: 0,
    maximum: 150,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(150)
  maxAge?: number;

  // Insurance Provider Filter
  @ApiPropertyOptional({
    description: 'Filter by insurance provider',
    example: 'Blue Cross Blue Shield',
  })
  @IsOptional()
  @IsString()
  insuranceProvider?: string;

  // Activity Filters
  @ApiPropertyOptional({
    description: 'Include patients with no appointments',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  hasAppointments?: boolean;

  @ApiPropertyOptional({
    description: 'Include patients with no messages',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  hasMessages?: boolean;

  // Invitation Status
  @ApiPropertyOptional({
    description: 'Filter by invitation status',
    enum: ['invited_only', 'completed_signup', 'self_registered'],
  })
  @IsOptional()
  @IsString()
  invitationStatus?: string;

  // Export Options
  @ApiPropertyOptional({
    description: 'Include fields for export (excludes sensitive data by default)',
    isArray: true,
    example: ['name', 'email', 'phone', 'accountStatus'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  exportFields?: string[];

  @ApiPropertyOptional({
    description: 'Include PII in export (requires special permissions)',
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  includePII?: boolean = false;
}