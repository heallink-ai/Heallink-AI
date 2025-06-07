export type AuthMode = "email" | "phone";

export interface AuthState {
  isAuthenticated: boolean;
  provider: Provider | null;
  loading: boolean;
}

export interface Provider {
  id: string;
  email: string;
  name: string;
  type: "provider";
  verified?: boolean;
  organization?: string;
  specialty?: string;
  licenseNumber?: string;
}

export interface LoginFormData {
  email?: string;
  phone?: string;
  password?: string;
  remember: boolean;
}

export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  organization: string;
  specialty: string;
  licenseNumber: string;
}

export interface OTPVerificationData {
  credential: string;
  code: string;
  type: "signup" | "login" | "reset";
}

export interface SocialProvider {
  id: "google" | "facebook" | "apple";
  name: string;
  color: string;
  icon: React.ReactNode;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  provider?: Provider;
  redirectUrl?: string;
}
