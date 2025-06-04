import { useMutation } from "@tanstack/react-query";
import {
  loginUser,
  registerUser,
  socialLogin,
  verifyOtp,
  refreshAuthToken,
  logoutUser,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
  sendOtp,
} from "@/app/api/auth-api";
import { AuthProvider } from "@/app/types/auth-types";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

/**
 * Hook for user registration
 */
export function useRegister() {
  return useMutation({
    mutationFn: (userData: {
      email?: string;
      phone?: string;
      name?: string;
      password: string;
    }) => registerUser(userData),
  });
}

/**
 * Hook for user login
 */
export function useLogin() {
  return useMutation({
    mutationFn: (credentials: {
      email?: string;
      phone?: string;
      password: string;
    }) => loginUser(credentials),
  });
}

/**
 * Hook for social login
 */
export function useSocialLogin() {
  return useMutation({
    mutationFn: ({
      provider,
      token,
      email,
      name,
    }: {
      provider: AuthProvider;
      token: string;
      email?: string;
      name?: string;
    }) => socialLogin(provider, token, email, name),
  });
}

/**
 * Hook for sending OTP
 */
export function useSendOtp() {
  return useMutation({
    mutationFn: (phone: string) => sendOtp(phone),
  });
}

/**
 * Hook for verifying OTP
 */
export function useVerifyOtp() {
  return useMutation({
    mutationFn: ({ phone, otp }: { phone: string; otp: string }) =>
      verifyOtp(phone, otp),
  });
}

/**
 * Hook for refreshing access token
 */
export function useRefreshToken() {
  return useMutation({
    mutationFn: (refreshToken: string) => refreshAuthToken(refreshToken),
  });
}

/**
 * Hook for logging out user
 */
export function useLogout() {
  return useMutation({
    mutationFn: (accessToken: string) => logoutUser(accessToken),
  });
}

/**
 * Hook for verifying email
 */
export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) => verifyEmail(token),
  });
}

/**
 * Hook for requesting password reset
 */
export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: ({ email }: { email: string }) =>
      requestPasswordReset({ email }),
  });
}

/**
 * Hook for resetting password
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: ({
      token,
      newPassword,
    }: {
      token: string;
      newPassword: string;
    }) => resetPassword({ token, newPassword }),
  });
}

/**
 * Hook for getting current user's authentication status and tokens
 * Simply wraps next-auth's useSession for convenience and to provide a consistent interface
 */
export function useAuthStatus() {
  const { data: session, status, update } = useSession();

  const isAuthenticated = status === "authenticated" && !!session?.user;
  const isLoading = status === "loading";
  const tokens = isAuthenticated
    ? {
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      }
    : null;

  return {
    isAuthenticated,
    isLoading,
    user: session?.user || null,
    tokens,
    status,
    updateSession: update,
  };
}

/**
 * Hook for automatic token refresh in the background
 * Can be used in layout components or a global auth provider component
 */
export function useAutoRefreshToken() {
  const { tokens, status, updateSession } = useAuthStatus();
  const refreshTokenMutation = useRefreshToken();

  // Set up token refresh effect
  useEffect(() => {
    if (
      status !== "authenticated" ||
      !tokens?.accessToken ||
      !tokens?.refreshToken
    ) {
      return;
    }

    try {
      // Decode token to check expiry
      const decodedToken = jwtDecode<{ exp: number }>(tokens.accessToken);
      const currentTime = Math.floor(Date.now() / 1000);
      const expiryTime = decodedToken.exp;

      // If token is invalid or already expired, refresh immediately
      if (!expiryTime || expiryTime <= currentTime) {
        refreshTokenMutation.mutate(tokens.refreshToken, {
          onSuccess: (result) => {
            if (result.data) {
              updateSession({
                accessToken: result.data.accessToken,
                refreshToken: result.data.refreshToken,
              });
            }
          },
        });
        return;
      }

      // Calculate time until token expires (in milliseconds)
      const timeUntilExpiry = (expiryTime - currentTime) * 1000;

      // Set up timer to refresh token 1 minute before it expires
      const refreshTime = Math.max(0, timeUntilExpiry - 60000);
      const timerId = setTimeout(() => {
        if (tokens.refreshToken) {
          refreshTokenMutation.mutate(tokens.refreshToken, {
            onSuccess: (result) => {
              if (result.data) {
                updateSession({
                  accessToken: result.data.accessToken,
                  refreshToken: result.data.refreshToken,
                });
              }
            },
          });
        }
      }, refreshTime);

      // Clean up timer on component unmount
      return () => clearTimeout(timerId);
    } catch (error) {
      console.error("Error setting up token refresh:", error);
    }
  }, [
    tokens?.accessToken,
    tokens?.refreshToken,
    status,
    updateSession,
    refreshTokenMutation,
  ]);

  return {
    isRefreshing: refreshTokenMutation.isPending,
    error: refreshTokenMutation.error,
  };
}
