export interface UserProfileData {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  avatarUrl?: string;
  role: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other" | "prefer-not-to-say";
  address?: {
    streetAddress?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phone?: string;
  };
  medicalInformation?: {
    bloodType?:
      | "A+"
      | "A-"
      | "B+"
      | "B-"
      | "AB+"
      | "AB-"
      | "O+"
      | "O-"
      | "unknown";
    allergies?: string[];
    medications?: string[];
    chronicConditions?: string[];
  };
  insurance?: {
    provider?: string;
    policyNumber?: string;
    groupNumber?: string;
    primaryInsured?: string;
    relationship?: string;
  };
  communicationPreferences?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export interface UserProfileFormData {
  name: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: {
    streetAddress?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phone?: string;
  };
  medicalInformation?: {
    bloodType?:
      | "A+"
      | "A-"
      | "B+"
      | "B-"
      | "AB+"
      | "AB-"
      | "O+"
      | "O-"
      | "unknown";
    allergies?: string[];
    medications?: string[];
    chronicConditions?: string[];
  };
  insurance?: {
    provider?: string;
    policyNumber?: string;
    groupNumber?: string;
    primaryInsured?: string;
    relationship?: string;
  };
  communicationPreferences?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export type ProfileUpdateStatus = "idle" | "loading" | "success" | "error";
