/**
 * API error response
 */
export interface ApiError {
  message: string;
  statusCode?: number;
  error?: string;
}

/**
 * Generic API response type
 */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  statusCode?: number;
}

/**
 * Authentication response with tokens
 */
export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email?: string;
    phone?: string;
    name?: string;
    role: string;
    emailVerified: boolean;
    phoneVerified: boolean;
  };
}

/**
 * Password reset request payload
 */
export interface PasswordResetRequestPayload {
  email: string;
}

/**
 * Password reset response
 */
export interface PasswordResetResponse {
  message: string;
}

/**
 * Reset password payload
 */
export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

/**
 * Generic message response
 */
export interface MessageResponse {
  message: string;
}

/**
 * OTP response
 */
export interface OtpResponse {
  sent: boolean;
  message: string;
}

/**
 * Provider-specific types
 */
export interface ProviderScheduleResponse {
  availableSlots: Array<{
    date: string;
    slots: Array<{
      startTime: string;
      endTime: string;
      isBooked: boolean;
      appointmentId?: string;
    }>;
  }>;
}