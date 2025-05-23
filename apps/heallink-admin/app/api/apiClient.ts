// Enhanced API client with token refresh capabilities
import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from "axios";
import { getSession, signOut } from "next-auth/react";

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

const API_BASE_URL = getApiUrl();

/**
 * Handles API errors consistently
 */
export class ApiError extends Error {
  status: number;
  data: Record<string, unknown>;

  constructor(status: number, message: string, data?: Record<string, unknown>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data || {};
  }
}

// Create a custom axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Track if we're currently refreshing the token
let isRefreshing = false;
// Store pending requests that should be retried after token refresh
type QueuePromise = {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  config: AxiosRequestConfig;
};
let failedQueue: QueuePromise[] = [];

// Process the failed queue
const processQueue = (error: Error | null, newToken: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (newToken) {
      // Clone the original request config
      const retryConfig = { ...promise.config };
      // Update with new token
      retryConfig.headers = {
        ...retryConfig.headers,
        Authorization: `Bearer ${newToken}`,
      };
      // Resolve with a new request using updated config
      promise.resolve(apiClient(retryConfig));
    } else {
      promise.reject(new Error("Token refresh failed"));
    }
  });

  failedQueue = [];
};

// Function to refresh token using our Next.js API route
const refreshTokenRequest = async (): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
  try {
    const session = await getSession();
    if (!session?.refreshToken) {
      console.error("No refresh token in session");
      throw new Error("No refresh token available");
    }

    console.log(
      "Attempting to refresh token with:",
      session.refreshToken.substring(0, 10) + "..."
    );

    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    });

    // Log response details for debugging
    console.log("Refresh token response status:", response.status);

    if (!response.ok) {
      let errorMessage = "Failed to refresh token";

      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (parseError) {
        console.error("Error parsing error response:", parseError);
      }

      throw new Error(errorMessage);
    }

    // Safely parse the JSON response
    try {
      const data = await response.json();

      if (!data || !data.accessToken || !data.refreshToken) {
        console.error(
          "Invalid response format from refresh token endpoint:",
          data
        );
        throw new Error("Invalid token response format");
      }

      console.log("Token refresh successful, received new tokens");
      return data;
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      throw new Error("Invalid JSON response from token refresh");
    }
  } catch (error) {
    console.error("Token refresh error:", error);
    throw error;
  }
};

// Request interceptor to add the auth token to requests
apiClient.interceptors.request.use(
  async (config) => {
    // If we're in the browser, get the session
    if (!isServer) {
      try {
        const session = await getSession();
        if (session?.accessToken) {
          config.headers["Authorization"] = `Bearer ${session.accessToken}`;
        }
      } catch (error) {
        console.error("Error getting session:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    // Need to type cast here since _retry isn't in the type
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Prevent infinite retry of failed refreshes
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // If it's not an auth error or refresh token is invalid/expired
    if (
      !error.response ||
      error.response.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    // Mark as retried
    originalRequest._retry = true;

    // If we're already refreshing, queue this request to retry after refresh completes
    if (isRefreshing) {
      console.log("Token refresh in progress, queueing request");
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve,
          reject,
          config: originalRequest,
        });
      });
    }

    // Start refreshing process
    isRefreshing = true;
    console.log("Starting token refresh");

    try {
      // Get new tokens from our API route
      const tokens = await refreshTokenRequest();
      console.log("Token refresh successful");

      // Update session with new tokens (this doesn't persist to client storage)
      if (typeof window !== "undefined") {
        // This will trigger a session update in NextAuth
        await fetch("/api/auth/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          }),
        });
      }

      // Process any queued requests with the new token
      processQueue(null, tokens.accessToken);
      isRefreshing = false;

      // Retry the original request with new token
      originalRequest.headers = {
        ...originalRequest.headers,
        Authorization: `Bearer ${tokens.accessToken}`,
      };
      return apiClient(originalRequest);
    } catch (refreshError) {
      // Handle refresh failure
      processQueue(
        refreshError instanceof Error
          ? refreshError
          : new Error("Token refresh failed")
      );
      isRefreshing = false;

      // Only redirect if not on login page already and in browser
      if (!isServer && !window.location.pathname.includes("/login")) {
        console.error("Token refresh failed, redirecting to login");
        await signOut({ redirect: true, callbackUrl: "/" });
      }

      return Promise.reject(refreshError);
    }
  }
);

/**
 * Helper function to use with react-query
 */
export const fetchWithAuth = async <T>(
  endpoint: string,
  options?: Record<string, unknown>
): Promise<T> => {
  try {
    const url = endpoint.startsWith("/") ? endpoint.substring(1) : endpoint;
    const response = await apiClient.request({
      url,
      ...options,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new ApiError(
        error.response?.status || 500,
        error.response?.data?.message || error.message,
        error.response?.data
      );
    }
    throw error;
  }
};

export default apiClient;
