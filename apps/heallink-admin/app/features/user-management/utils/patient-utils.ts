import { Patient } from "../types/user.types";

/**
 * Format date to a user-friendly string
 */
export const formatDate = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long", 
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Format date to a short string
 */
export const formatDateShort = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Get status color classes for patient account status
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400";
    case 'pending_verification':
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400";
    case 'suspended':
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
    case 'deactivated':
      return "bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-400";
  }
};

/**
 * Get human-readable status label
 */
export const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'active':
      return 'Active';
    case 'pending_verification':
      return 'Pending Verification';
    case 'suspended':
      return 'Suspended';
    case 'deactivated':
      return 'Deactivated';
    default:
      return 'Unknown';
  }
};

/**
 * Get plan icon name for subscription plans
 */
export const getPlanIconName = (plan: string): string => {
  if (plan === "premium") return "Crown";
  if (plan === "basic") return "Shield";
  return "User";
};

/**
 * Get plan styling classes
 */
export const getPlanStyle = (plan: string): string => {
  if (plan === "premium") return "bg-gradient-to-r from-purple-500 to-pink-500 text-white";
  if (plan === "basic") return "bg-gradient-to-r from-blue-500 to-indigo-500 text-white";
  return "bg-gradient-to-r from-gray-400 to-gray-500 text-white";
};

/**
 * Format gender display text
 */
export const formatGender = (gender?: string): string => {
  if (!gender) return 'Not specified';
  return gender.replace('_', ' ').replace('-', ' ');
};

/**
 * Check if patient has complete profile information
 */
export const hasCompleteProfile = (patient: Patient): boolean => {
  return !!(
    patient.name &&
    patient.email &&
    patient.phone &&
    patient.dateOfBirth &&
    patient.gender &&
    patient.address?.streetAddress &&
    patient.address?.city &&
    patient.address?.state &&
    patient.address?.zipCode
  );
};

/**
 * Calculate profile completion percentage
 */
export const getProfileCompletionPercentage = (patient: Patient): number => {
  const requiredFields = [
    patient.name,
    patient.email,
    patient.phone,
    patient.dateOfBirth,
    patient.gender,
    patient.address?.streetAddress,
    patient.address?.city,
    patient.address?.state,
    patient.address?.zipCode,
    patient.emergencyContact?.name,
    patient.emergencyContact?.phone,
  ];

  const completedFields = requiredFields.filter(Boolean).length;
  return Math.round((completedFields / requiredFields.length) * 100);
};

/**
 * Check if communication preference is enabled
 */
export const isCommunicationEnabled = (
  patient: Patient,
  type: 'email' | 'sms' | 'push'
): boolean => {
  return (patient as any).communicationPreferences?.[type] !== false;
};

/**
 * Get activity status color
 */
export const getActivityStatusColor = (outcome?: string): string => {
  if (!outcome) return '';
  
  return outcome === 'success' 
    ? 'bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400'
    : 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400';
};

/**
 * Check if patient account is active
 */
export const isPatientActive = (patient: Patient): boolean => {
  return patient.accountStatus === 'active';
};

/**
 * Get verification status for contact methods
 */
export const getVerificationStatus = (
  patient: Patient,
  type: 'email' | 'phone'
): { verified: boolean; icon: string; color: string } => {
  const verified = type === 'email' ? patient.emailVerified : patient.phoneVerified;
  
  return {
    verified: verified || false,
    icon: verified ? 'CheckCircle' : 'XCircle',
    color: verified ? 'text-green-500' : 'text-red-500'
  };
};

/**
 * Format address as a single string
 */
export const formatAddress = (address?: Patient['address']): string => {
  if (!address) return 'No address provided';
  
  const parts = [
    address.streetAddress,
    address.city,
    address.state,
    address.zipCode,
    address.country
  ].filter(Boolean);
  
  return parts.length > 0 ? parts.join(', ') : 'No address provided';
};

/**
 * Get patient age from date of birth
 */
export const getPatientAge = (dateOfBirth?: string): number | null => {
  if (!dateOfBirth) return null;
  
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Generate patient initials for avatar fallback
 */
export const getPatientInitials = (name?: string): string => {
  if (!name) return 'P';
  
  const nameParts = name.split(' ');
  if (nameParts.length >= 2) {
    return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
  }
  return name[0].toUpperCase();
};