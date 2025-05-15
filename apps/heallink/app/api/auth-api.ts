/**
 * API client for interacting with the NestJS authentication API.
 * This bridges the Auth.js frontend authentication with the NestJS backend.
 */

import { AuthProvider, UserRole } from "@/app/types/auth-types";
import {
  ApiResponse,
  AuthTokenResponse,
  MessageResponse,
  PasswordResetRequestPayload,
  ResetPasswordPayload,
} from "../api-types";

// User type definition
interface User {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  role: UserRole;
  image?: string;
}

// Authentication response type
interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Get the correct API URL based on whether we're on server or client
const API_URL =
  typeof window === "undefined"
    ? process.env.API_URL || "http://api:3003/api/v1" // Server-side (in Docker network)
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003/api/v1"; // Client-side (browser)

/**
 * Register a new user with email/phone and password
 */
export async function registerUser(userData: {
  email?: string;
  phone?: string;
  name?: string;
  password: string;
}): Promise<ApiResponse<AuthResponse>> {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle specific error codes
      if (response.status === 409) {
        return {
          error: "This email or phone number is already registered",
          statusCode: response.status,
        };
      }

      if (response.status === 400) {
        // Extract specific validation errors if available
        if (data.message && Array.isArray(data.message)) {
          const errorMessages = data.message.join(". ");
          return { error: errorMessages, statusCode: response.status };
        }
      }

      return {
        error: data.message || "Registration failed",
        statusCode: response.status,
      };
    }

    return { data };
  } catch (error) {
    console.error("Registration network error:", error);
    return {
      error: "Network error. Please check your connection and try again.",
    };
  }
}

/**
 * Login with email/phone and password
 */
export async function loginUser(credentials: {
  email?: string;
  phone?: string;
  password: string;
}): Promise<ApiResponse<AuthResponse>> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        return {
          error:
            "Invalid credentials. Please check your email/phone and password.",
          statusCode: response.status,
        };
      }

      return {
        error: data.message || "Login failed",
        statusCode: response.status,
      };
    }

    return { data };
  } catch (error) {
    console.error("Login network error:", error);

    // Check for connection refused error specifically
    const isConnectionRefused =
      error instanceof Error &&
      error.cause &&
      typeof error.cause === "object" &&
      "code" in error.cause &&
      error.cause.code === "ECONNREFUSED";

    if (isConnectionRefused) {
      return {
        error:
          "Cannot connect to the API server. If running in Docker, make sure NEXT_PUBLIC_API_URL is set correctly (e.g., http://api:3003/api/v1).",
      };
    }

    return {
      error: "Network error. Please check your connection and try again.",
    };
  }
}

/**
 * Social login with token from provider
 */
export async function socialLogin(
  provider: AuthProvider,
  token: string,
  email?: string,
  name?: string
): Promise<ApiResponse<AuthResponse>> {
  try {
    const response = await fetch(`${API_URL}/auth/social-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ provider, token, email, name }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.message || "Social login failed",
        statusCode: response.status,
      };
    }

    return { data };
  } catch (error) {
    console.error("Social login network error:", error);
    return {
      error: "Network error. Please check your connection and try again.",
    };
  }
}

/**
 * Send OTP to phone number
 */
export async function sendOtp(
  phone: string
): Promise<ApiResponse<{ sent: boolean; message: string }>> {
  try {
    const response = await fetch(`${API_URL}/auth/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.message || "Failed to send OTP",
        statusCode: response.status,
      };
    }

    return { data };
  } catch (error) {
    console.error("Send OTP network error:", error);
    return {
      error: "Network error. Please check your connection and try again.",
    };
  }
}

/**
 * Verify OTP and login/register user
 */
export async function verifyOtp(
  phone: string,
  otp: string
): Promise<ApiResponse<AuthResponse>> {
  try {
    const response = await fetch(`${API_URL}/auth/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone, otp }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        return {
          error:
            "Invalid or expired OTP. Please try again or request a new code.",
          statusCode: response.status,
        };
      }

      return {
        error: data.message || "Invalid OTP",
        statusCode: response.status,
      };
    }

    return { data };
  } catch (error) {
    console.error("OTP verification network error:", error);
    return {
      error: "Network error. Please check your connection and try again.",
    };
  }
}

/**
 * Refresh access token
 */
export async function refreshToken(
  refreshToken: string
): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> {
  try {
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        return {
          error: "Your session has expired. Please login again.",
          statusCode: response.status,
        };
      }

      return {
        error: data.message || "Failed to refresh token",
        statusCode: response.status,
      };
    }

    return { data };
  } catch (error) {
    console.error("Token refresh network error:", error);
    return {
      error: "Network error. Please check your connection and try again.",
    };
  }
}

/**
 * Logout user
 */
export async function logoutUser(
  accessToken: string
): Promise<ApiResponse<{ message: string }>> {
  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.message || "Logout failed",
        statusCode: response.status,
      };
    }

    return { data };
  } catch (error) {
    console.error("Logout network error:", error);
    // Non-critical error for logout, so we return success anyway
    return { data: { message: "Logged out" } };
  }
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<ApiResponse<AuthTokenResponse>> {
  try {
    const response = await fetch(`${API_URL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.message || "Authentication failed",
        statusCode: response.status,
      };
    }

    return { data };
  } catch (error) {
    console.error("Sign in error:", error);
    return {
      error: "Network error. Please check your connection and try again.",
    };
  }
}

/**
 * Sign in with phone number and OTP
 */
export async function signInWithOtp(
  phone: string,
  otp: string
): Promise<ApiResponse<AuthTokenResponse>> {
  try {
    const response = await fetch(`${API_URL}/auth/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone, otp }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.message || "OTP verification failed",
        statusCode: response.status,
      };
    }

    return { data };
  } catch (error) {
    console.error("OTP verification error:", error);
    return {
      error: "Network error. Please check your connection and try again.",
    };
  }
}

/**
 * Sign up new user
 */
export async function signUp(userData: {
  email?: string;
  phone?: string;
  password: string;
  name: string;
}): Promise<ApiResponse<MessageResponse>> {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.message || "Registration failed",
        statusCode: response.status,
      };
    }

    return { data };
  } catch (error) {
    console.error("Sign up error:", error);
    return {
      error: "Network error. Please check your connection and try again.",
    };
  }
}

/**
 * Sign out (clear tokens)
 */
export async function signOut(): Promise<ApiResponse<MessageResponse>> {
  try {
    const response = await fetch(`${API_URL}/auth/signout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.message || "Sign out failed",
        statusCode: response.status,
      };
    }

    return { data };
  } catch (error) {
    console.error("Sign out error:", error);
    return {
      error: "Network error. Please check your connection and try again.",
    };
  }
}

/**
 * Verify email with token
 */
export async function verifyEmail(
  token: string
): Promise<ApiResponse<MessageResponse>> {
  try {
    const response = await fetch(`${API_URL}/auth/verify-email/${token}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.message || "Email verification failed",
        statusCode: response.status,
      };
    }

    return { data };
  } catch (error) {
    console.error("Email verification error:", error);
    return {
      error: "Network error. Please check your connection and try again.",
    };
  }
}

/**
 * Request a password reset
 */
export async function requestPasswordReset({
  email,
}: PasswordResetRequestPayload): Promise<ApiResponse<MessageResponse>> {
  try {
    const response = await fetch(`${API_URL}/auth/request-password-reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.message || "Failed to request password reset",
        statusCode: response.status,
      };
    }

    return { data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Reset password with token
 */
export async function resetPassword({
  token,
  newPassword,
}: ResetPasswordPayload): Promise<ApiResponse<MessageResponse>> {
  try {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.message || "Failed to reset password",
        statusCode: response.status,
      };
    }

    return { data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
