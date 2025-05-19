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
import { jwtDecode } from "jwt-decode";

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
export async function refreshAuthToken(
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

/**
 * Checks if the current token is valid or needs refresh
 */
export async function checkAndRefreshToken(
  accessToken: string | undefined,
  refreshToken: string | undefined
): Promise<{ accessToken: string; refreshToken: string } | null> {
  if (!accessToken || !refreshToken) {
    console.warn("Missing tokens for refresh check");
    return null;
  }

  try {
    // Check if token is expired or will expire in the next 60 seconds
    const decodedToken = jwtDecode<{ exp: number }>(accessToken);
    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = decodedToken.exp - currentTime;

    // If token is valid for more than one minute, no need to refresh
    if (timeUntilExpiry > 60) {
      return { accessToken, refreshToken };
    }

    // Token is expired or will expire soon, try to refresh
    console.log("Token expiring soon, refreshing...");
    const { data, error } = await refreshAuthToken(refreshToken);

    if (error || !data) {
      console.error("Failed to refresh token:", error);
      // Session is invalid, return null to trigger a new login
      return null;
    }

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return null;
  }
}

/**
 * Makes an authenticated API request with token refresh if needed
 *
 * Note: This function is kept for backwards compatibility and simple cases.
 * For most cases, consider using the React Query-based hooks instead.
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
  accessToken?: string,
  refreshToken?: string
): Promise<Response> {
  // Try to get tokens from session if not provided
  if (!accessToken || !refreshToken) {
    try {
      // This works only on client-side
      const session =
        typeof window !== "undefined"
          ? // This is a simplified approach. In a real app, you'd use a proper session management solution
            JSON.parse(sessionStorage.getItem("auth-session") || "{}")
          : null;

      if (session?.accessToken && session?.refreshToken) {
        accessToken = session.accessToken;
        refreshToken = session.refreshToken;
      }
    } catch (error) {
      console.error("Error getting session data:", error);
    }
  }

  // If we still don't have tokens, proceed without authentication
  if (!accessToken || !refreshToken) {
    return fetch(url, options);
  }

  // Check and refresh token if needed
  const tokens = await checkAndRefreshToken(accessToken, refreshToken);

  if (!tokens) {
    // Token refresh failed, proceed with original request (will likely fail)
    return fetch(url, options);
  }

  // If tokens were refreshed, update the session storage
  if (tokens.accessToken !== accessToken) {
    try {
      if (typeof window !== "undefined") {
        const session = JSON.parse(
          sessionStorage.getItem("auth-session") || "{}"
        );
        session.accessToken = tokens.accessToken;
        session.refreshToken = tokens.refreshToken;
        sessionStorage.setItem("auth-session", JSON.stringify(session));
      }
    } catch (error) {
      console.error("Error updating session data:", error);
    }
  }

  // Add the (possibly refreshed) token to the request
  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Bearer ${tokens.accessToken}`);

  return fetch(url, {
    ...options,
    headers,
  });
}
