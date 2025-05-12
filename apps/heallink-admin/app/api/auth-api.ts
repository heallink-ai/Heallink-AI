import { ApiResponse, User } from "../types/auth-types";

// Helper type for environment variable fallback
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003/api/v1";

/**
 * Login admin user with email and password
 */
export async function loginAdminUser(credentials: {
  email: string;
  password: string;
}): Promise<
  ApiResponse<{ accessToken: string; refreshToken: string; user: User }>
> {
  try {
    const response = await fetch(`${API_URL}/auth/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.message || "Login failed" };
    }

    return { data };
  } catch (error) {
    console.error("Error during admin login:", error);
    return { error: "Network error" };
  }
}

/**
 * Request password reset for admin
 */
export async function requestPasswordReset(
  email: string
): Promise<ApiResponse<{ message: string }>> {
  try {
    const response = await fetch(`${API_URL}/auth/admin/request-reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.message || "Password reset request failed" };
    }

    return { data };
  } catch (error) {
    console.error("Error requesting password reset:", error);
    return { error: "Network error" };
  }
}

/**
 * Verify auth token
 */
export async function verifyToken(
  token: string
): Promise<ApiResponse<{ valid: boolean }>> {
  try {
    const response = await fetch(`${API_URL}/auth/verify-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.message || "Token verification failed" };
    }

    return { data };
  } catch (error) {
    console.error("Error verifying token:", error);
    return { error: "Network error" };
  }
}

/**
 * Logout admin user
 */
export async function logoutAdminUser(
  accessToken: string
): Promise<ApiResponse<{ message: string }>> {
  try {
    const response = await fetch(`${API_URL}/auth/admin/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.message || "Logout failed" };
    }

    return { data };
  } catch (error) {
    console.error("Error during logout:", error);
    return { error: "Network error" };
  }
}
