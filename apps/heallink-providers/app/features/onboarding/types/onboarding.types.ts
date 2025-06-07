// Provider Onboarding Types

export type ProviderRole = 
  | 'physician'
  | 'nurse-practitioner'
  | 'physician-assistant'
  | 'registered-nurse'
  | 'therapist'
  | 'lab'
  | 'imaging'
  | 'pharmacy'
  | 'dme'
  | 'billing-coding'
  | 'hospital'
  | 'asc'
  | 'urgent-care'
  | 'home-health'
  | 'telehealth-group'
  | 'remote-monitoring'
  | 'digital-therapeutics'
  | 'other';

export interface ProviderRoleCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  roles: ProviderRole[];
}

export interface SelectedRole {
  role: ProviderRole;
  category: string;
  customDescription?: string; // For "other" role
}

export interface LegalIdentity {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  governmentId: {
    type: 'ssn' | 'passport' | 'driver-license' | 'ein';
    number: string;
    uploadedDocument?: File;
  };
}

export interface ContactLocation {
  id: string;
  type: 'primary' | 'additional';
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  phone: string;
  email: string;
  isTelehealthOnly: boolean;
}

export interface PayoutTax {
  bankAccount: {
    accountType: 'checking' | 'savings';
    routingNumber: string;
    accountNumber: string;
    accountHolderName: string;
    plaidToken?: string;
  };
  taxInfo: {
    taxId: string;
    taxIdType: 'ssn' | 'ein';
    w9Signed: boolean;
    w8BenSigned?: boolean;
    corporateTaxId?: string;
  };
}

export interface LicenseInfo {
  state: string;
  licenseNumber: string;
  expirationDate: string;
  verified: boolean;
  isPrimary: boolean;
}

export interface PhysicianCredentials {
  licenses: LicenseInfo[];
  deaCertificate?: {
    number: string;
    expirationDate: string;
    prescribesControlledSubstances: boolean;
    uploadedDocument?: File;
  };
  boardCertification?: {
    boardName: string;
    certificationId: string;
    expirationDate: string;
  };
  malpracticeInsurance: {
    provider: string;
    policyNumber: string;
    expirationDate: string;
    coverageAmount: string;
    uploadedDocument?: File;
  };
}

export interface TelehealthGroupCredentials {
  corporateEntityName: string;
  multiStateRegistrations: {
    state: string;
    registrationNumber: string;
    expirationDate: string;
  }[];
  hipaaBaaSigned: boolean;
  dataSecurityAnswers: {
    question: string;
    answer: string;
  }[];
}

export interface ComplianceModule {
  id: string;
  name: string;
  description: string;
  videoUrl: string;
  duration: number; // in minutes
  completed: boolean;
  completedAt?: string;
  watchedPercentage: number;
}

export interface WorkflowSetup {
  availability: {
    schedule: {
      [day: string]: {
        isAvailable: boolean;
        timeSlots: {
          start: string;
          end: string;
        }[];
      };
    };
    timezone: string;
  };
  ehrIntegration?: {
    provider: 'athena' | 'drchrono' | 'epic' | 'cerner' | 'other';
    isConnected: boolean;
    oauthToken?: string;
  };
  sandboxCompleted: boolean;
}

export interface OnboardingProgress {
  currentStep: number;
  totalSteps: number;
  completedSteps: string[];
  selectedRoles: SelectedRole[];
  legalIdentity?: LegalIdentity;
  contactLocations: ContactLocation[];
  payoutTax?: PayoutTax;
  credentials: {
    physician?: PhysicianCredentials;
    telehealthGroup?: TelehealthGroupCredentials;
    [key: string]: any;
  };
  complianceModules: ComplianceModule[];
  workflowSetup?: WorkflowSetup;
  submittedAt?: string;
  verificationStatus: 'pending' | 'in-progress' | 'completed' | 'rejected';
}

export interface OnboardingStepProps {
  progress: OnboardingProgress;
  onNext: (data: Partial<OnboardingProgress>) => void;
  onBack: () => void;
  onSave: (data: Partial<OnboardingProgress>) => void;
}

// Verification Item Status
export interface VerificationItem {
  id: string;
  name: string;
  status: 'verified' | 'pending' | 'action-needed' | 'failed';
  eta?: string;
  description?: string;
  actionRequired?: string;
}

// Form validation types
export interface FormErrors {
  [key: string]: string | FormErrors;
}

export interface StepValidation {
  isValid: boolean;
  errors: FormErrors;
  warnings: string[];
}