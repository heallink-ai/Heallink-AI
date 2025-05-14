"use client";

import { useMutation } from "@tanstack/react-query";
import { AuthProvider, UserRole } from "@/app/types/auth-types";

// Types
interface User {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  role: UserRole;
  image?: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface ApiError {
  message: string;
  statusCode: number;
}

// Get the correct API URL based on whether we're on server or client
const API_URL =
  typeof window === "undefined"
    ? process.env.API_URL || "http://api:3003/api/v1" // Server-side (in Docker network)
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003/api/v1"; // Client-side (browser)

/**
 * Custom hook for registering a new user
 */
export function useRegister() {
  return useMutation<
    AuthResponse,
    ApiError,
    { email?: string; phone?: string; name: string; password: string }
  >({
    mutationFn: async (userData) => {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Format error based on response
        throw {
          message: data.message || "Registration failed",
          statusCode: response.status,
        };
      }

      return data;
    },
  });
}

/**
 * Custom hook for user login
 */
export function useLogin() {
  return useMutation<
    AuthResponse,
    ApiError,
    { email?: string; phone?: string; password: string }
  >({
    mutationFn: async (credentials) => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          message: data.message || "Login failed",
          statusCode: response.status,
        };
      }

      return data;
    },
  });
}

/**
 * Custom hook for social login
 */
export function useSocialLogin() {
  return useMutation<
    AuthResponse,
    ApiError,
    { provider: AuthProvider; token: string; email: string; name: string }
  >({
    mutationFn: async ({ provider, token, email, name }) => {
      const response = await fetch(`${API_URL}/auth/social-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ provider, token, email, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          message: data.message || "Social login failed",
          statusCode: response.status,
        };
      }

      return data;
    },
  });
}

/**
 * Custom hook for sending OTP
 */
export function useSendOtp() {
  return useMutation<
    { sent: boolean; message: string },
    ApiError,
    { phone: string }
  >({
    mutationFn: async ({ phone }) => {
      const response = await fetch(`${API_URL}/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          message: data.message || "Failed to send OTP",
          statusCode: response.status,
        };
      }

      return data;
    },
  });
}

/**
 * Custom hook for verifying OTP
 */
export function useVerifyOtp() {
  return useMutation<AuthResponse, ApiError, { phone: string; otp: string }>({
    mutationFn: async ({ phone, otp }) => {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          message: data.message || "Invalid OTP",
          statusCode: response.status,
        };
      }

      return data;
    },
  });
}

/**
 * Custom hook for refreshing tokens
 */
export function useRefreshToken() {
  return useMutation<
    { accessToken: string; refreshToken: string },
    ApiError,
    { refreshToken: string }
  >({
    mutationFn: async ({ refreshToken }) => {
      const response = await fetch(`${API_URL}/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          message: data.message || "Failed to refresh token",
          statusCode: response.status,
        };
      }

      return data;
    },
  });
}

/**
 * Custom hook for logging out
 */
export function useLogout() {
  return useMutation<{ message: string }, ApiError, { accessToken: string }>({
    mutationFn: async ({ accessToken }) => {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          message: data.message || "Logout failed",
          statusCode: response.status,
        };
      }

      return data;
    },
  });
}
