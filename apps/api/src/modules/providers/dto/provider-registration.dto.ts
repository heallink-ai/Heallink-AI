import { IsString, IsEmail, IsOptional, IsArray, IsEnum, IsDateString, IsNumber, Min, Max, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LicenseStatus } from '../schemas/provider.schema';

export class ProviderRegistrationDto {
  @ApiProperty({ description: 'Provider first name' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Provider last name' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'Professional title (Dr., MD, DO, NP, PA, etc.)' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Medical license number' })
  @IsString()
  licenseNumber: string;

  @ApiProperty({ description: 'State where license was issued' })
  @IsString()
  licenseState: string;

  @ApiPropertyOptional({ enum: LicenseStatus, description: 'License status' })
  @IsOptional()
  @IsEnum(LicenseStatus)
  licenseStatus?: LicenseStatus;

  @ApiProperty({ description: 'License expiry date' })
  @IsDateString()
  licenseExpiryDate: string;

  @ApiPropertyOptional({ description: 'Board certifications', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  boardCertifications?: string[];

  @ApiProperty({ description: 'Specialization IDs', type: [String] })
  @IsArray()
  @IsString({ each: true })
  specializations: string[];

  @ApiPropertyOptional({ description: 'Professional bio' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ description: 'Languages spoken', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @ApiPropertyOptional({ description: 'Years of experience' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(70)
  yearsOfExperience?: number;

  @ApiPropertyOptional({ description: 'Education background', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  education?: string[];

  @ApiPropertyOptional({ description: 'Professional awards', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  awards?: string[];

  @ApiPropertyOptional({ description: 'Publications', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  publications?: string[];

  @ApiPropertyOptional({ description: 'Accepts new patients' })
  @IsOptional()
  @IsBoolean()
  acceptsNewPatients?: boolean;

  @ApiPropertyOptional({ description: 'Telehealth enabled' })
  @IsOptional()
  @IsBoolean()
  teleheathEnabled?: boolean;

  @ApiPropertyOptional({ description: 'Insurance plans accepted', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  insuranceAccepted?: string[];
}