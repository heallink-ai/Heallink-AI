// Enhanced API client with token refresh capabilities
import axios, { AxiosInstance, AxiosError } from "axios";
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
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
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
  resolve: (value: string | null) => void;
  reject: (reason?: any) => void;
};
let failedQueue: QueuePromise[] = [];

// Process the failed queue
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Function to refresh token using our Next.js API route
const refreshTokenRequest = async (): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
  const response = await fetch("/api/auth/refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  return response.json();
};

// Request interceptor to add the auth token to requests
apiClient.interceptors.request.use(
  async (config) => {
    // If we're in the browser, get the session
    if (!isServer) {
      const session = await getSession();
      if (session?.accessToken) {
        config.headers["Authorization"] = `Bearer ${session.accessToken}`;
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
    const originalRequest: any = error.config;

    // If the error is not 401 or we've already tried to refresh, reject
    if (
      !error.response ||
      error.response.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    // Set the retry flag so we don't loop infinitely
    originalRequest._retry = true;

    // If we're already refreshing, queue this request
    if (isRefreshing) {
      return new Promise<string | null>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (token) {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return apiClient(originalRequest);
          }
          return Promise.reject(new Error("Token refresh failed"));
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    isRefreshing = true;

    // Try to get a new token using our Next.js API route
    try {
      // Call our server-side endpoint for token refresh
      const tokens = await refreshTokenRequest();

      // Now retry the original request with new token
      originalRequest.headers["Authorization"] = `Bearer ${tokens.accessToken}`;

      // Process any queued requests
      processQueue(null, tokens.accessToken);

      isRefreshing = false;
      return apiClient(originalRequest);
    } catch (refreshError) {
      // If refresh fails, redirect to login
      if (!isServer) {
        await signOut({ redirect: true, callbackUrl: "/" });
      }

      processQueue(
        refreshError instanceof Error
          ? refreshError
          : new Error("Token refresh failed")
      );
      isRefreshing = false;
      return Promise.reject(refreshError);
    }
  }
);

/**
 * Helper function to use with react-query
 */
export const fetchWithAuth = async <T>(
  endpoint: string,
  options?: any
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
