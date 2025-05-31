import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AccountStatus, InsuranceStatus, SubscriptionPlan } from '../schemas/user.schema';

export class PatientAddressResponseDto {
  @ApiPropertyOptional()
  streetAddress?: string;

  @ApiPropertyOptional()
  city?: string;

  @ApiPropertyOptional()
  state?: string;

  @ApiPropertyOptional()
  zipCode?: string;

  @ApiPropertyOptional()
  country?: string;
}

export class PatientEmergencyContactResponseDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  relationship: string;

  @ApiProperty()
  phone: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional({ isArray: true })
  permissions?: string[];

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;
}

export class PatientInsuranceResponseDto {
  @ApiPropertyOptional()
  provider?: string;

  @ApiPropertyOptional()
  policyNumber?: string;

  @ApiPropertyOptional()
  groupNumber?: string;

  @ApiPropertyOptional()
  primaryInsured?: string;

  @ApiPropertyOptional()
  relationship?: string;

  @ApiPropertyOptional({ enum: InsuranceStatus })
  status?: InsuranceStatus;

  @ApiPropertyOptional()
  verifiedAt?: Date;

  @ApiPropertyOptional()
  verifiedBy?: string;

  @ApiPropertyOptional()
  lastVerificationCheck?: Date;
}

export class PatientMedicalInfoResponseDto {
  @ApiPropertyOptional({ 
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'],
  })
  bloodType?: string;

  @ApiPropertyOptional({ isArray: true })
  allergies?: string[];

  @ApiPropertyOptional({ isArray: true })
  medications?: string[];

  @ApiPropertyOptional({ isArray: true })
  chronicConditions?: string[];

  @ApiPropertyOptional()
  primaryCarePhysician?: string;
}

export class PatientUsageMetricsResponseDto {
  @ApiProperty()
  appointmentsBooked: number;

  @ApiPropertyOptional()
  lastAppointmentDate?: Date;

  @ApiProperty()
  messagesSent: number;

  @ApiPropertyOptional()
  lastMessageDate?: Date;

  @ApiProperty()
  vitalsLogged: number;

  @ApiPropertyOptional()
  lastVitalsDate?: Date;

  @ApiProperty()
  aiInteractions: number;

  @ApiPropertyOptional()
  lastAiInteractionDate?: Date;

  @ApiPropertyOptional()
  lastAppAccess?: Date;

  @ApiProperty()
  totalLoginCount: number;
}

export class PatientAdminNoteResponseDto {
  @ApiProperty()
  note: string;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  isPrivate: boolean;

  @ApiProperty()
  category: string;
}

export class PatientActiveSessionResponseDto {
  @ApiProperty()
  sessionId: string;

  @ApiProperty()
  deviceInfo: string;

  @ApiProperty()
  ipAddress: string;

  @ApiProperty()
  userAgent: string;

  @ApiProperty()
  lastActivity: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  isActive: boolean;
}

export class PatientResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  avatarUrl?: string;

  @ApiProperty()
  emailVerified: boolean;

  @ApiProperty()
  phoneVerified: boolean;

  @ApiProperty({ enum: AccountStatus })
  accountStatus: AccountStatus;

  @ApiProperty()
  isActive: boolean;

  @ApiPropertyOptional()
  lastLogin?: Date;

  @ApiPropertyOptional()
  suspensionReason?: string;

  @ApiPropertyOptional()
  suspendedAt?: Date;

  @ApiPropertyOptional()
  suspendedBy?: string;

  @ApiPropertyOptional()
  deactivatedAt?: Date;

  @ApiPropertyOptional()
  deactivatedBy?: string;

  // Two-Factor Authentication
  @ApiProperty()
  twoFactorEnabled: boolean;

  @ApiPropertyOptional()
  twoFactorEnabledAt?: Date;

  // Invitation and Signup
  @ApiPropertyOptional()
  invitedBy?: string;

  @ApiPropertyOptional()
  invitedAt?: Date;

  @ApiPropertyOptional()
  signupCompletedAt?: Date;

  // Subscription
  @ApiProperty({ enum: SubscriptionPlan })
  subscriptionPlan: SubscriptionPlan;

  @ApiPropertyOptional()
  subscriptionStartDate?: Date;

  @ApiPropertyOptional()
  subscriptionEndDate?: Date;

  @ApiPropertyOptional()
  subscriptionStatus?: string;

  // Personal Information
  @ApiPropertyOptional()
  dateOfBirth?: string;

  @ApiPropertyOptional({ enum: ['male', 'female', 'other', 'prefer-not-to-say'] })
  gender?: string;

  @ApiPropertyOptional()
  address?: PatientAddressResponseDto;

  @ApiPropertyOptional()
  emergencyContact?: PatientEmergencyContactResponseDto;

  @ApiPropertyOptional({ isArray: true })
  emergencyContacts?: PatientEmergencyContactResponseDto[];

  // Medical and Insurance
  @ApiPropertyOptional()
  insurance?: PatientInsuranceResponseDto;

  @ApiPropertyOptional()
  medicalInformation?: PatientMedicalInfoResponseDto;

  // Usage and Activity
  @ApiPropertyOptional()
  usageMetrics?: PatientUsageMetricsResponseDto;

  // Admin Features
  @ApiPropertyOptional({ isArray: true })
  adminNotes?: PatientAdminNoteResponseDto[];

  @ApiPropertyOptional({ isArray: true })
  activeSessions?: PatientActiveSessionResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional()
  meta?: Record<string, any>;
}

export class PatientListResponseDto {
  @ApiProperty({ isArray: true, type: PatientResponseDto })
  patients: PatientResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;

  @ApiPropertyOptional()
  filters?: Record<string, any>;

  @ApiPropertyOptional()
  summary?: {
    activeCount: number;
    suspendedCount: number;
    deactivatedCount: number;
    pendingVerificationCount: number;
    totalUsageMetrics: PatientUsageMetricsResponseDto;
  };
}

export class PatientStatsResponseDto {
  @ApiProperty()
  totalPatients: number;

  @ApiProperty()
  activePatients: number;

  @ApiProperty()
  suspendedPatients: number;

  @ApiProperty()
  deactivatedPatients: number;

  @ApiProperty()
  pendingVerificationPatients: number;

  @ApiProperty()
  recentlyCreated: number; // Last 30 days

  @ApiProperty()
  recentlyActive: number; // Last 30 days

  @ApiPropertyOptional()
  statusDistribution?: Record<string, number>;

  @ApiPropertyOptional()
  subscriptionDistribution?: Record<string, number>;

  @ApiPropertyOptional()
  verificationDistribution?: {
    emailVerified: number;
    phoneVerified: number;
    bothVerified: number;
    noneVerified: number;
  };

  @ApiPropertyOptional()
  insuranceDistribution?: Record<string, number>;

  @ApiPropertyOptional()
  twoFactorDistribution?: {
    enabled: number;
    disabled: number;
  };

  @ApiPropertyOptional()
  ageDistribution?: Record<string, number>;

  @ApiPropertyOptional()
  locationDistribution?: {
    countries: Record<string, number>;
    states: Record<string, number>;
  };

  @ApiPropertyOptional()
  usageStats?: {
    totalAppointments: number;
    totalMessages: number;
    totalVitalsLogged: number;
    totalAiInteractions: number;
    averageSessionsPerUser: number;
  };
}

export class PatientActivityLogResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  action: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  timestamp: Date;

  @ApiPropertyOptional()
  ipAddress?: string;

  @ApiPropertyOptional()
  userAgent?: string;

  @ApiPropertyOptional()
  location?: string;

  @ApiPropertyOptional()
  outcome?: string; // success, failure, etc.

  @ApiPropertyOptional()
  metadata?: Record<string, any>;
}

export class PatientDetailResponseDto extends PatientResponseDto {
  @ApiPropertyOptional({ isArray: true })
  activityLog?: PatientActivityLogResponseDto[];

  @ApiPropertyOptional()
  riskAssessment?: {
    level: string; // low, medium, high
    factors: string[];
    lastAssessment: Date;
  };

  @ApiPropertyOptional()
  careTeam?: Array<{
    providerId: string;
    providerName: string;
    role: string;
    assignedAt: Date;
    isActive: boolean;
  }>;

  @ApiPropertyOptional()
  familyMembers?: Array<{
    memberId: string;
    memberName: string;
    relationship: string;
    permissions: string[];
    isActive: boolean;
  }>;
}