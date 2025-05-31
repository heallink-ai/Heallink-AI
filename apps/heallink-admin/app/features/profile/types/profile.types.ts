export interface ProfileData {
  id: string;
  email: string;
  name: string;
  role: string;
  adminRole?: string;
  permissions: string[];
  phone?: string;
  department?: string;
  bio?: string;
  avatarUrl?: string;
  isActive: boolean;
  emailVerified: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileUpdateData {
  name?: string;
  phone?: string;
  department?: string;
  bio?: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileResponse {
  success: boolean;
  data: ProfileData;
  message?: string;
}

export interface ProfileUpdateResponse {
  success: boolean;
  data: ProfileData;
  message: string;
}

export interface PasswordChangeResponse {
  success: boolean;
  message: string;
}

export interface AvatarUploadResponse {
  success: boolean;
  avatarUrl: string;
  message: string;
}