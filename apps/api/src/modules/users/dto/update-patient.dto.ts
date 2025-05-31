import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsOptional, 
  IsString, 
  IsEnum, 
  IsBoolean, 
  IsArray,
  MinLength,
} from 'class-validator';
import { CreatePatientDto } from './create-patient.dto';
import { AccountStatus, InsuranceStatus, SubscriptionPlan } from '../schemas/user.schema';

export class UpdatePatientDto extends PartialType(CreatePatientDto) {
  @ApiPropertyOptional({ 
    description: 'Account status',
    enum: AccountStatus,
  })
  @IsOptional()
  @IsEnum(AccountStatus)
  accountStatus?: AccountStatus;

  @ApiPropertyOptional({ 
    description: 'Reason for suspension or deactivation',
    example: 'Policy violation',
  })
  @IsOptional()
  @IsString()
  suspensionReason?: string;

  @ApiPropertyOptional({ 
    description: 'Enable or disable two-factor authentication',
  })
  @IsOptional()
  @IsBoolean()
  twoFactorEnabled?: boolean;

  @ApiPropertyOptional({ 
    description: 'Mark email as verified',
  })
  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;

  @ApiPropertyOptional({ 
    description: 'Mark phone as verified',
  })
  @IsOptional()
  @IsBoolean()
  phoneVerified?: boolean;

  @ApiPropertyOptional({ 
    description: 'Update insurance verification status',
    enum: InsuranceStatus,
  })
  @IsOptional()
  @IsEnum(InsuranceStatus)
  insuranceStatus?: InsuranceStatus;

  @ApiPropertyOptional({ 
    description: 'Admin notes to add',
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  adminNotes?: string[];
}

export class ChangePatientPasswordDto {
  @ApiPropertyOptional({ 
    description: 'New password for the patient',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  newPassword: string;

  @ApiPropertyOptional({ 
    description: 'Send password reset email instead of setting directly',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  sendResetEmail?: boolean = false;

  @ApiPropertyOptional({ 
    description: 'Force password change on next login',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  forcePasswordChange?: boolean = true;
}

export class PatientStatusChangeDto {
  @ApiPropertyOptional({ 
    description: 'New account status',
    enum: AccountStatus,
  })
  @IsEnum(AccountStatus)
  accountStatus: AccountStatus;

  @ApiPropertyOptional({ 
    description: 'Reason for status change',
    example: 'Requested by patient',
  })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({ 
    description: 'Send notification to patient about status change',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  sendNotification?: boolean = true;
}

export class PatientSubscriptionChangeDto {
  @ApiPropertyOptional({ 
    description: 'New subscription plan',
    enum: SubscriptionPlan,
  })
  @IsEnum(SubscriptionPlan)
  subscriptionPlan: SubscriptionPlan;

  @ApiPropertyOptional({ 
    description: 'Subscription start date (defaults to now)',
  })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ 
    description: 'Subscription end date',
  })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({ 
    description: 'Reason for subscription change',
    example: 'Upgraded to premium features',
  })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class AddAdminNoteDto {
  @ApiPropertyOptional({ 
    description: 'Admin note content',
    example: 'Patient called regarding billing inquiry',
  })
  @IsString()
  @MinLength(1)
  note: string;

  @ApiPropertyOptional({ 
    description: 'Note category',
    enum: ['general', 'medical', 'billing', 'support', 'technical'],
    default: 'general',
  })
  @IsOptional()
  @IsEnum(['general', 'medical', 'billing', 'support', 'technical'])
  category?: string = 'general';

  @ApiPropertyOptional({ 
    description: 'Mark note as private (visible only to admin who created it)',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean = false;
}