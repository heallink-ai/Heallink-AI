// Enums aligned with backend
export enum AccountStatus {
  ACTIVE = 'active',
  PENDING_VERIFICATION = 'pending_verification',
  SUSPENDED = 'suspended',
  DEACTIVATED = 'deactivated',
  PENDING_SIGNUP = 'pending_signup',
}

export enum InsuranceStatus {
  VERIFIED = 'verified',
  PENDING = 'pending',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
  NOT_PROVIDED = 'not_provided',
}

export enum SubscriptionPlan {
  FREE = 'free',
  BASIC = 'basic',
  PREMIUM = 'premium',
  FAMILY = 'family',
  ENTERPRISE = 'enterprise',
}

export enum UserRole {
  USER = 'user',
  PROVIDER = 'provider',
  ADMIN = 'admin',
}

// Core Patient Types (aligned with backend DTOs)
export interface PatientAddress {
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface PatientEmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  permissions?: string[];
  isActive: boolean;
  createdAt: Date;
}

export interface PatientInsurance {
  provider?: string;
  policyNumber?: string;
  groupNumber?: string;
  primaryInsured?: string;
  relationship?: string;
  status?: InsuranceStatus;
  verifiedAt?: Date;
  verifiedBy?: string;
  lastVerificationCheck?: Date;
}

export interface PatientMedicalInfo {
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'unknown';
  allergies?: string[];
  medications?: string[];
  chronicConditions?: string[];
  primaryCarePhysician?: string;
}

export interface PatientUsageMetrics {
  appointmentsBooked: number;
  lastAppointmentDate?: Date;
  messagesSent: number;
  lastMessageDate?: Date;
  vitalsLogged: number;
  lastVitalsDate?: Date;
  aiInteractions: number;
  lastAiInteractionDate?: Date;
  lastAppAccess?: Date;
  totalLoginCount: number;
}

export interface PatientAdminNote {
  note: string;
  createdBy: string;
  createdAt: Date;
  isPrivate: boolean;
  category: string;
}

export interface PatientActiveSession {
  sessionId: string;
  deviceInfo: string;
  ipAddress: string;
  userAgent: string;
  lastActivity: Date;
  createdAt: Date;
  isActive: boolean;
}

export interface PatientActivityLog {
  id: string;
  action: string;
  description: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  location?: string;
  outcome?: string;
  metadata?: Record<string, any>;
}

// Main Patient Interface
export interface Patient {
  id: string;
  email: string;
  phone?: string;
  name: string;
  avatarUrl?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  accountStatus: AccountStatus;
  isActive: boolean;
  lastLogin?: Date;
  suspensionReason?: string;
  suspendedAt?: Date;
  suspendedBy?: string;
  deactivatedAt?: Date;
  deactivatedBy?: string;

  // Two-Factor Authentication
  twoFactorEnabled: boolean;
  twoFactorEnabledAt?: Date;

  // Invitation and Signup
  invitedBy?: string;
  invitedAt?: Date;
  signupCompletedAt?: Date;

  // Subscription
  subscriptionPlan: SubscriptionPlan;
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  subscriptionStatus?: string;

  // Personal Information
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  address?: PatientAddress;
  emergencyContact?: PatientEmergencyContact;
  emergencyContacts?: PatientEmergencyContact[];

  // Medical and Insurance
  insurance?: PatientInsurance;
  medicalInformation?: PatientMedicalInfo;

  // Usage and Activity
  usageMetrics?: PatientUsageMetrics;

  // Admin Features
  adminNotes?: PatientAdminNote[];
  activeSessions?: PatientActiveSession[];

  createdAt: Date;
  updatedAt: Date;
  meta?: Record<string, any>;
}

// Extended Patient Detail Interface
export interface PatientDetail extends Patient {
  activityLog?: PatientActivityLog[];
  riskAssessment?: {
    level: string;
    factors: string[];
    lastAssessment: Date;
  };
  careTeam?: Array<{
    providerId: string;
    providerName: string;
    role: string;
    assignedAt: Date;
    isActive: boolean;
  }>;
  familyMembers?: Array<{
    memberId: string;
    memberName: string;
    relationship: string;
    permissions: string[];
    isActive: boolean;
  }>;
}

// API Request DTOs
export interface CreatePatientDto {
  email: string;
  phone?: string;
  name: string;
  password?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  
  // Address
  address?: PatientAddress;
  
  // Emergency Contacts
  emergencyContacts?: Omit<PatientEmergencyContact, 'createdAt' | 'isActive'>[];
  
  // Insurance
  insurance?: PatientInsurance;
  
  // Medical Information
  medicalInformation?: PatientMedicalInfo;
  
  // Subscription
  subscriptionPlan?: SubscriptionPlan;
  
  // Admin settings
  accountStatus?: AccountStatus;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  sendWelcomeEmail?: boolean;
  requirePasswordReset?: boolean;
  
  // Admin metadata
  invitedBy?: string;
  meta?: Record<string, any>;
}

export interface UpdatePatientDto {
  email?: string;
  phone?: string;
  name?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  address?: PatientAddress;
  emergencyContacts?: Omit<PatientEmergencyContact, 'createdAt' | 'isActive'>[];
  insurance?: PatientInsurance;
  medicalInformation?: PatientMedicalInfo;
  avatarUrl?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  twoFactorEnabled?: boolean;
  meta?: Record<string, any>;
}

export interface PatientStatusChangeDto {
  accountStatus: AccountStatus;
  reason?: string;
  notifyUser?: boolean;
  sendEmail?: boolean;
}

export interface ChangePatientPasswordDto {
  newPassword?: string;
  generateRandomPassword?: boolean;
  sendResetEmail?: boolean;
  requirePasswordChange?: boolean;
}

export interface AddAdminNoteDto {
  note: string;
  category: string;
  isPrivate?: boolean;
}

// Query and Response DTOs
export interface PatientQueryDto {
  // Pagination
  page?: number;
  limit?: number;
  
  // Search
  search?: string;
  searchFields?: string[];
  
  // Filters
  accountStatus?: AccountStatus | AccountStatus[];
  subscriptionPlan?: SubscriptionPlan | SubscriptionPlan[];
  emailVerified?: boolean;
  phoneVerified?: boolean;
  twoFactorEnabled?: boolean;
  
  // Date filters
  createdAfter?: string;
  createdBefore?: string;
  lastLoginAfter?: string;
  lastLoginBefore?: string;
  
  // Location filters
  country?: string;
  state?: string;
  city?: string;
  
  // Usage filters
  hasAppointments?: boolean;
  hasRecentActivity?: boolean; // Last 30 days
  isActiveUser?: boolean; // Based on usage metrics
  
  // Insurance filters
  insuranceStatus?: InsuranceStatus;
  hasInsurance?: boolean;
  
  // Medical filters
  hasAllergies?: boolean;
  hasMedications?: boolean;
  hasChronicConditions?: boolean;
  
  // Admin filters
  suspendedBy?: string;
  hasAdminNotes?: boolean;
  
  // Sorting
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  
  // Export options
  exportFormat?: 'csv' | 'json' | 'excel';
  exportFields?: string[];
  includePII?: boolean;
}

export interface PatientListResponse {
  patients: Patient[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters?: Record<string, any>;
  summary?: {
    activeCount: number;
    suspendedCount: number;
    deactivatedCount: number;
    pendingVerificationCount: number;
    totalUsageMetrics: PatientUsageMetrics;
  };
}

export interface PatientStatsResponse {
  totalPatients: number;
  activePatients: number;
  suspendedPatients: number;
  deactivatedPatients: number;
  pendingVerificationPatients: number;
  recentlyCreated: number; // Last 30 days
  recentlyActive: number; // Last 30 days
  statusDistribution?: Record<string, number>;
  subscriptionDistribution?: Record<string, number>;
  verificationDistribution?: {
    emailVerified: number;
    phoneVerified: number;
    bothVerified: number;
    noneVerified: number;
  };
  insuranceDistribution?: Record<string, number>;
  twoFactorDistribution?: {
    enabled: number;
    disabled: number;
  };
  ageDistribution?: Record<string, number>;
  locationDistribution?: {
    countries: Record<string, number>;
    states: Record<string, number>;
  };
  usageStats?: {
    totalAppointments: number;
    totalMessages: number;
    totalVitalsLogged: number;
    totalAiInteractions: number;
    averageSessionsPerUser: number;
  };
}

// Bulk Operations
export interface BulkPatientActionDto {
  action: 'activate' | 'suspend' | 'deactivate' | 'delete' | 'export' | 'verify_email' | 'verify_phone' | 'enable_2fa' | 'disable_2fa';
  patientIds: string[];
  reason?: string;
  notifyUsers?: boolean;
  sendEmails?: boolean;
  exportFormat?: 'csv' | 'json' | 'excel';
  exportFields?: string[];
  includePII?: boolean;
}

export interface BulkPatientImportDto {
  patients: CreatePatientDto[];
  duplicateHandling: 'skip' | 'update' | 'error';
  sendWelcomeEmails?: boolean;
  requirePasswordReset?: boolean;
  defaultSubscriptionPlan?: SubscriptionPlan;
  validateEmails?: boolean;
  validatePhones?: boolean;
}

export interface BulkActionResultDto {
  success: boolean;
  message: string;
  successCount: number;
  failureCount: number;
  errors?: Array<{
    item: string;
    error: string;
  }>;
  downloadUrl?: string; // For export actions
  importSummary?: {
    imported: number;
    skipped: number;
    errors: number;
    duplicates: number;
  };
}

// Component Props Types
export interface PatientTableProps {
  patients: Patient[];
  isLoading: boolean;
  onStatusChange: (id: string, status: AccountStatus, reason?: string) => void;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onImpersonate: (id: string) => void;
  onResetPassword: (id: string) => void;
  onTerminateSessions: (id: string) => void;
  onBulkAction: (action: string, patientIds: string[]) => void;
  selectedPatients: string[];
  onSelectionChange: (patientIds: string[]) => void;
}

export interface PatientDetailDrawerProps {
  patient: PatientDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (patient: Patient) => void;
  onStatusChange: (id: string, status: AccountStatus, reason?: string) => void;
  onResetPassword: (id: string) => void;
  onImpersonate: (id: string) => void;
  onTerminateSessions: (id: string) => void;
  onAddNote: (id: string, note: AddAdminNoteDto) => void;
}

export interface PatientFormProps {
  patient?: Patient;
  onSubmit: (data: CreatePatientDto | UpdatePatientDto) => void;
  onCancel: () => void;
  isLoading: boolean;
  isEdit?: boolean;
}

export interface PatientListPresentationProps {
  patients: Patient[];
  totalPatients: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  searchTerm: string;
  filters: PatientFilters;
  selectedPatients: string[];
  queryParams?: PatientQueryDto;
  onSearchChange: (value: string) => void;
  onFilterChange: (key: string, value: any) => void;
  onPageChange: (page: number) => void;
  onSelectionChange: (patientIds: string[]) => void;
  onStatusChange: (id: string, status: AccountStatus, reason?: string) => void;
  onBulkAction: (action: string, patientIds: string[], options?: any) => void;
  onPatientView: (id: string) => void;
  onPatientEdit: (id: string) => void;
  onResetPassword: (id: string) => void;
  onPasswordReset: (id: string) => void;
  onImpersonate: (id: string) => void;
  onTerminateSessions: (id: string) => void;
  onExport: (format?: string, patientIds?: string[]) => Promise<void> | void;
  onImport: (file?: File) => Promise<void> | void;
  onRefresh: () => void;
}

// Form Data Types
export interface PatientFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  
  // Address
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  
  // Emergency Contact
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  emergencyContactEmail: string;
  
  // Insurance
  insuranceProvider: string;
  policyNumber: string;
  groupNumber: string;
  primaryInsured: string;
  insuranceRelationship: string;
  
  // Medical Information
  bloodType: string;
  allergies: string[];
  medications: string[];
  chronicConditions: string[];
  primaryCarePhysician: string;
  
  // Account Settings
  accountStatus: AccountStatus;
  subscriptionPlan: SubscriptionPlan;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  sendWelcomeEmail: boolean;
  requirePasswordReset: boolean;
}

// Filter and Search Types
export interface PatientFilters {
  accountStatus: AccountStatus | 'all';
  subscriptionPlan: SubscriptionPlan | 'all';
  verificationStatus: 'all' | 'email_verified' | 'phone_verified' | 'both_verified' | 'none_verified';
  twoFactorEnabled: boolean | 'all';
  hasInsurance: boolean | 'all';
  hasRecentActivity: boolean | 'all';
  dateRange: {
    start?: string;
    end?: string;
  };
  location: {
    country?: string;
    state?: string;
    city?: string;
  };
}

export interface PatientSearchOptions {
  term: string;
  fields: ('name' | 'email' | 'phone' | 'id')[];
  caseSensitive: boolean;
  exactMatch: boolean;
}

// API Error Types
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
  timestamp: string;
  path: string;
}

// Export Types
export interface ExportOptions {
  format: 'csv' | 'json' | 'excel';
  fields: string[];
  includePII: boolean;
  patientIds?: string[];
  filters?: PatientQueryDto;
}

// Import Types
export interface ImportOptions {
  file: File;
  duplicateHandling: 'skip' | 'update' | 'error';
  sendWelcomeEmails: boolean;
  requirePasswordReset: boolean;
  validateEmails: boolean;
  validatePhones: boolean;
}