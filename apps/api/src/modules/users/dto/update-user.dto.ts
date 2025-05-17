import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
  IsObject,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { AuthProvider, UserRole } from '../schemas/user.schema';
import { Type } from 'class-transformer';

export class AddressDto {
  @IsString()
  @IsOptional()
  streetAddress?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  zipCode?: string;

  @IsString()
  @IsOptional()
  country?: string;
}

export class EmergencyContactDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  relationship?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}

export class MedicalInformationDto {
  @IsString()
  @IsOptional()
  bloodType?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  allergies?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  medications?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  chronicConditions?: string[];

  @IsString()
  @IsOptional()
  insuranceProvider?: string;

  @IsString()
  @IsOptional()
  insurancePolicyNumber?: string;

  @IsString()
  @IsOptional()
  primaryCarePhysician?: string;
}

export class InsuranceDto {
  @IsString()
  @IsOptional()
  provider?: string;

  @IsString()
  @IsOptional()
  policyNumber?: string;

  @IsString()
  @IsOptional()
  groupNumber?: string;

  @IsString()
  @IsOptional()
  primaryInsured?: string;

  @IsString()
  @IsOptional()
  relationship?: string;
}

export class CommunicationPreferencesDto {
  @IsBoolean()
  @IsOptional()
  email?: boolean;

  @IsBoolean()
  @IsOptional()
  sms?: boolean;

  @IsBoolean()
  @IsOptional()
  push?: boolean;
}

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsOptional()
  emailVerified?: boolean;

  @IsOptional()
  phoneVerified?: boolean;

  @IsEnum(AuthProvider, { each: true })
  @IsOptional()
  providers?: AuthProvider[];

  @IsOptional()
  accounts?: Array<{ provider: AuthProvider; providerId: string }>;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @IsOptional()
  dateOfBirth?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsObject()
  @IsOptional()
  @Type(() => AddressDto)
  address?: AddressDto;

  @IsObject()
  @IsOptional()
  @Type(() => EmergencyContactDto)
  emergencyContact?: EmergencyContactDto;

  @IsObject()
  @IsOptional()
  @Type(() => MedicalInformationDto)
  medicalInformation?: MedicalInformationDto;

  @IsObject()
  @IsOptional()
  @Type(() => InsuranceDto)
  insurance?: InsuranceDto;

  @IsObject()
  @IsOptional()
  @Type(() => CommunicationPreferencesDto)
  communicationPreferences?: CommunicationPreferencesDto;
}
