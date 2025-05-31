import { 
  IsArray, 
  IsEnum, 
  IsOptional, 
  IsString, 
  IsBoolean, 
  ArrayMinSize,
  IsEmail,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AccountStatus, SubscriptionPlan } from '../schemas/user.schema';

export enum BulkAction {
  ACTIVATE = 'activate',
  DEACTIVATE = 'deactivate',
  SUSPEND = 'suspend',
  REINSTATE = 'reinstate',
  DELETE = 'delete',
  SEND_PASSWORD_RESET = 'send_password_reset',
  RESEND_VERIFICATION = 'resend_verification',
  VERIFY_EMAIL = 'verify_email',
  VERIFY_PHONE = 'verify_phone',
  ASSIGN_SUBSCRIPTION = 'assign_subscription',
  EXPORT = 'export',
  SEND_NOTIFICATION = 'send_notification',
}

export class BulkPatientActionDto {
  @ApiProperty({ 
    description: 'Array of patient IDs to perform action on',
    isArray: true,
    example: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  patientIds: string[];

  @ApiProperty({ 
    description: 'Bulk action to perform',
    enum: BulkAction,
  })
  @IsEnum(BulkAction)
  action: BulkAction;

  @ApiPropertyOptional({ 
    description: 'Reason for the action',
    example: 'Quarterly account review',
  })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({ 
    description: 'Send notification to patients about the action',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  sendNotification?: boolean = true;

  // Action-specific parameters
  @ApiPropertyOptional({ 
    description: 'New subscription plan (for assign_subscription action)',
    enum: SubscriptionPlan,
  })
  @IsOptional()
  @IsEnum(SubscriptionPlan)
  subscriptionPlan?: SubscriptionPlan;

  @ApiPropertyOptional({ 
    description: 'Export format (for export action)',
    enum: ['csv', 'json', 'xlsx'],
    default: 'csv',
  })
  @IsOptional()
  @IsEnum(['csv', 'json', 'xlsx'])
  exportFormat?: string = 'csv';

  @ApiPropertyOptional({ 
    description: 'Fields to include in export',
    isArray: true,
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
  @IsBoolean()
  includePII?: boolean = false;

  @ApiPropertyOptional({ 
    description: 'Custom notification message (for send_notification action)',
  })
  @IsOptional()
  @IsString()
  notificationMessage?: string;
}

export class PatientImportRowDto {
  @ApiProperty({ description: 'Patient email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Patient name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Patient phone' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Date of birth (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ description: 'Gender' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({ description: 'Street address' })
  @IsOptional()
  @IsString()
  streetAddress?: string;

  @ApiPropertyOptional({ description: 'City' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'State' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ description: 'ZIP code' })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiPropertyOptional({ description: 'Country' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: 'Insurance provider' })
  @IsOptional()
  @IsString()
  insuranceProvider?: string;

  @ApiPropertyOptional({ description: 'Insurance policy number' })
  @IsOptional()
  @IsString()
  insurancePolicyNumber?: string;

  @ApiPropertyOptional({ description: 'Emergency contact name' })
  @IsOptional()
  @IsString()
  emergencyContactName?: string;

  @ApiPropertyOptional({ description: 'Emergency contact phone' })
  @IsOptional()
  @IsString()
  emergencyContactPhone?: string;

  @ApiPropertyOptional({ description: 'Emergency contact relationship' })
  @IsOptional()
  @IsString()
  emergencyContactRelationship?: string;
}

export class BulkPatientImportDto {
  @ApiProperty({ 
    description: 'Array of patient data to import',
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PatientImportRowDto)
  patients: PatientImportRowDto[];

  @ApiPropertyOptional({ 
    description: 'Send invitation emails to imported patients',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  sendInvitations?: boolean = true;

  @ApiPropertyOptional({ 
    description: 'Skip email verification for imported patients',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  skipEmailVerification?: boolean = false;

  @ApiPropertyOptional({ 
    description: 'Default subscription plan for imported patients',
    enum: SubscriptionPlan,
    default: SubscriptionPlan.FREE,
  })
  @IsOptional()
  @IsEnum(SubscriptionPlan)
  defaultSubscriptionPlan?: SubscriptionPlan = SubscriptionPlan.FREE;

  @ApiPropertyOptional({ 
    description: 'Handle duplicate emails',
    enum: ['skip', 'update', 'error'],
    default: 'skip',
  })
  @IsOptional()
  @IsEnum(['skip', 'update', 'error'])
  duplicateHandling?: string = 'skip';

  @ApiPropertyOptional({ 
    description: 'Validate required fields before import',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  validateFields?: boolean = true;
}

export class BulkActionResultDto {
  @ApiProperty({ description: 'Whether the operation was successful' })
  success: boolean;

  @ApiProperty({ description: 'Operation result message' })
  message: string;

  @ApiProperty({ description: 'Number of successful operations' })
  successCount: number;

  @ApiProperty({ description: 'Number of failed operations' })
  failureCount: number;

  @ApiPropertyOptional({ 
    description: 'Details of failed operations',
    isArray: true,
  })
  failures?: Array<{
    patientId: string;
    error: string;
    details?: any;
  }>;

  @ApiPropertyOptional({ 
    description: 'List of errors that occurred',
    isArray: true,
  })
  errors?: Array<{
    item: string;
    error: string;
  }>;

  @ApiPropertyOptional({ 
    description: 'Export file URL (for export actions)',
  })
  exportUrl?: string;

  @ApiPropertyOptional({ 
    description: 'Download URL for exported data',
  })
  downloadUrl?: string;

  @ApiPropertyOptional({ 
    description: 'Import summary (for import actions)',
  })
  importSummary?: {
    imported: number;
    skipped: number;
    errors: number;
    duplicates: number;
  };

  @ApiProperty({ description: 'Timestamp when operation completed' })
  completedAt: Date;

  @ApiPropertyOptional({ description: 'Additional metadata about the operation' })
  metadata?: Record<string, any>;
}