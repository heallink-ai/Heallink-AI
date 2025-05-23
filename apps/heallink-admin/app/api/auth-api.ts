import { ApiResponse, User } from "../types/auth-types";

// Helper function to determine if we're on the server side
const isServer = typeof window === "undefined";

// Select appropriate API URL based on environment
const getApiUrl = () => {
  if (isServer) {
    // Use internal Docker network URL for server-side requests
    return process.env.API_URL || "http://api:3003/api/v1";
  } else {
    // Use public URL for client-side requests
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003/api/v1";
  }
};

console.log(
  `API URL configured as: ${getApiUrl()} (${isServer ? "server-side" : "client-side"})`
);

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
    const API_URL = getApiUrl();
    console.log("Attempting admin login for:", credentials.email);
    console.log("Using API URL:", API_URL);

    const response = await fetch(`${API_URL}/auth/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    console.log("Login response status:", response.status);
    const data = await response.json();
    console.log("Login response data:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error("Login failed:", data.message || "Unknown error");
      return { error: data.message || "Login failed" };
    }

    console.log("Login successful for:", credentials.email);
    return { data };
  } catch (error) {
    console.error("Error during admin login:", error);
    return { error: "Network error" };
  }
}

/**
 * Refresh access token using refresh token
 */
export async function refreshToken(
  refreshToken: string
): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> {
  try {
    const API_URL = getApiUrl();
    console.log("Refreshing access token");

    const response = await fetch(`${API_URL}/auth/admin/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Token refresh failed:", data.message || "Unknown error");
      return { error: data.message || "Token refresh failed" };
    }

    console.log("Token refresh successful");
    return { data };
  } catch (error) {
    console.error("Error refreshing token:", error);
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
    const API_URL = getApiUrl();
    console.log("Requesting password reset for:", email);

    const response = await fetch(`${API_URL}/auth/admin/request-reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Password reset request failed:", data.message);
      return { error: data.message || "Password reset request failed" };
    }

    console.log("Password reset request successful for:", email);
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
    const API_URL = getApiUrl();
    const response = await fetch(`${API_URL}/auth/admin/verify-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Token verification failed:", data.message);
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
    const API_URL = getApiUrl();
    const response = await fetch(`${API_URL}/auth/admin/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Logout failed:", data.message);
      return { error: data.message || "Logout failed" };
    }

    console.log("Logout successful");
    return { data };
  } catch (error) {
    console.error("Error during logout:", error);
    return { error: "Network error" };
  }
}
