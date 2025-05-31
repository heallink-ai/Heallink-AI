import { 
  IsEmail, 
  IsOptional, 
  IsString, 
  IsEnum, 
  IsDateString, 
  IsPhoneNumber, 
  IsArray, 
  ValidateNested, 
  IsBoolean,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SubscriptionPlan } from '../schemas/user.schema';

class AddressDto {
  @ApiPropertyOptional({ description: 'Street address' })
  @IsOptional()
  @IsString()
  streetAddress?: string;

  @ApiPropertyOptional({ description: 'City' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'State or province' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ description: 'ZIP or postal code' })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiPropertyOptional({ description: 'Country' })
  @IsOptional()
  @IsString()
  country?: string;
}

class EmergencyContactDto {
  @ApiProperty({ description: 'Emergency contact name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Relationship to patient' })
  @IsString()
  relationship: string;

  @ApiProperty({ description: 'Emergency contact phone number' })
  @IsPhoneNumber()
  phone: string;

  @ApiPropertyOptional({ description: 'Emergency contact email' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ 
    description: 'Permissions for emergency contact',
    isArray: true,
    example: ['view_medical_info', 'emergency_access'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];
}

class InsuranceDto {
  @ApiPropertyOptional({ description: 'Insurance provider name' })
  @IsOptional()
  @IsString()
  provider?: string;

  @ApiPropertyOptional({ description: 'Insurance policy number' })
  @IsOptional()
  @IsString()
  policyNumber?: string;

  @ApiPropertyOptional({ description: 'Insurance group number' })
  @IsOptional()
  @IsString()
  groupNumber?: string;

  @ApiPropertyOptional({ description: 'Primary insured person' })
  @IsOptional()
  @IsString()
  primaryInsured?: string;

  @ApiPropertyOptional({ description: 'Relationship to primary insured' })
  @IsOptional()
  @IsString()
  relationship?: string;
}

class MedicalInformationDto {
  @ApiPropertyOptional({ 
    description: 'Blood type',
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'],
  })
  @IsOptional()
  @IsEnum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'])
  bloodType?: string;

  @ApiPropertyOptional({ 
    description: 'Known allergies',
    isArray: true,
    example: ['Penicillin', 'Shellfish'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allergies?: string[];

  @ApiPropertyOptional({ 
    description: 'Current medications',
    isArray: true,
    example: ['Aspirin 81mg daily', 'Lisinopril 10mg daily'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  medications?: string[];

  @ApiPropertyOptional({ 
    description: 'Chronic conditions',
    isArray: true,
    example: ['Hypertension', 'Type 2 Diabetes'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  chronicConditions?: string[];

  @ApiPropertyOptional({ description: 'Primary care physician name' })
  @IsOptional()
  @IsString()
  primaryCarePhysician?: string;
}

export class CreatePatientDto {
  @ApiProperty({ 
    description: 'Patient email address',
    example: 'patient@example.com',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ 
    description: 'Patient phone number',
    example: '+1234567890',
  })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty({ 
    description: 'Patient full name',
    example: 'John Doe',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ 
    description: 'Temporary password (if not provided, invitation will be sent)',
    minLength: 8,
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @ApiPropertyOptional({ 
    description: 'Date of birth',
    example: '1990-01-15',
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ 
    description: 'Gender',
    enum: ['male', 'female', 'other', 'prefer-not-to-say'],
  })
  @IsOptional()
  @IsEnum(['male', 'female', 'other', 'prefer-not-to-say'])
  gender?: string;

  @ApiPropertyOptional({ description: 'Patient address' })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;

  @ApiPropertyOptional({ description: 'Emergency contact information' })
  @IsOptional()
  @ValidateNested()
  @Type(() => EmergencyContactDto)
  emergencyContact?: EmergencyContactDto;

  @ApiPropertyOptional({ description: 'Insurance information' })
  @IsOptional()
  @ValidateNested()
  @Type(() => InsuranceDto)
  insurance?: InsuranceDto;

  @ApiPropertyOptional({ description: 'Medical information' })
  @IsOptional()
  @ValidateNested()
  @Type(() => MedicalInformationDto)
  medicalInformation?: MedicalInformationDto;

  @ApiPropertyOptional({ 
    description: 'Subscription plan',
    enum: SubscriptionPlan,
    default: SubscriptionPlan.FREE,
  })
  @IsOptional()
  @IsEnum(SubscriptionPlan)
  subscriptionPlan?: SubscriptionPlan = SubscriptionPlan.FREE;

  @ApiPropertyOptional({ 
    description: 'Send invitation email immediately',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  sendInvitation?: boolean = true;

  @ApiPropertyOptional({ 
    description: 'Mark email as verified (skip verification)',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  skipEmailVerification?: boolean = false;

  @ApiPropertyOptional({ 
    description: 'Mark phone as verified (skip verification)',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  skipPhoneVerification?: boolean = false;

  @ApiPropertyOptional({ 
    description: 'Additional metadata',
    example: { source: 'admin_portal', notes: 'VIP patient' },
  })
  @IsOptional()
  meta?: Record<string, any>;
}