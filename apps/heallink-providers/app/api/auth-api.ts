/**
 * API client for interacting with the NestJS authentication API.
 * This bridges the Auth.js frontend authentication with the NestJS backend.
 * Provider-specific version.
 */

import { AuthProvider, UserRole } from "../types/auth-types";
import {
  ApiResponse,
  MessageResponse,
  PasswordResetRequestPayload,
  ResetPasswordPayload,
} from "../api-types";

// User type definition for providers
interface Provider {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  role: UserRole;
  image?: string;
  specialization?: string;
  licenseNumber?: string;
}

// Authentication response type
interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: Provider;
}

// Password reset response type
interface PasswordResetResponse {
  message: string;
}

// Get the correct API URL based on whether we're on server or client
const API_URL =
  typeof window === "undefined"
    ? process.env.API_URL || "http://api:3003/api/v1" // Server-side (in Docker network)
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003/api/v1"; // Client-side (browser)

/**
 * Register a new provider with email/phone and password
 */
export async function registerProvider(userData: {
  email?: string;
  phone?: string;
  name?: string;
  password: string;
  specialization?: string;
  licenseNumber?: string;
}): Promise<ApiResponse<AuthResponse>> {
  try {
    const response = await fetch(`${API_URL}/auth/provider/register`, {
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
export async function loginProvider(credentials: {
  email?: string;
  phone?: string;
  password: string;
}): Promise<ApiResponse<AuthResponse>> {
  try {
    const response = await fetch(`${API_URL}/auth/provider/login`, {
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
    const response = await fetch(`${API_URL}/auth/provider/social-login`, {
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
 * Refresh the authentication token
 */
export async function refreshAuthToken(
  refreshToken: string
): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> {
  try {
    const response = await fetch(`${API_URL}/auth/provider/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.message || "Token refresh failed",
        statusCode: response.status,
      };
    }

    return { data };
  } catch (error) {
    console.error("Token refresh network error:", error);
    return {
      error: "Network error during token refresh.",
    };
  }
}

/**
 * Send password reset request
 */
export async function requestPasswordReset(
  payload: PasswordResetRequestPayload
): Promise<ApiResponse<PasswordResetResponse>> {
  try {
    const response = await fetch(
      `${API_URL}/auth/provider/reset-password-request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.message || "Failed to request password reset",
        statusCode: response.status,
      };
    }

    return { data };
  } catch (error) {
    console.error("Password reset request error:", error);
    return {
      error: "Network error. Please check your connection and try again.",
    };
  }
}

/**
 * Reset password with token
 */
export async function resetPassword(
  payload: ResetPasswordPayload
): Promise<ApiResponse<MessageResponse>> {
  try {
    const response = await fetch(`${API_URL}/auth/provider/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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
    console.error("Password reset error:", error);
    return {
      error: "Network error. Please check your connection and try again.",
    };
  }
}

/**
 * Logout user
 */
export async function logoutProvider(
  accessToken: string
): Promise<ApiResponse<{ message: string }>> {
  try {
    const response = await fetch(`${API_URL}/auth/provider/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
    console.error("Logout error:", error);
    return {
      error: "Network error during logout.",
    };
  }
}
