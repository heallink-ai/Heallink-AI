import {
  QueryClient,
  useMutation,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { checkAndRefreshToken } from "@/app/api/auth-api";
import { useAuthStatus } from "./auth-hooks";
import { queryClient } from "./client";

/**
 * Type for API response
 */
export interface ApiQueryResponse<T> {
  data?: T;
  error?: string;
  statusCode?: number;
}

/**
 * Creates a fetch function with auth token management
 * @param queryClient QueryClient instance for invalidating queries
 */
export function createAuthFetch(queryClient: QueryClient) {
  return async function authFetch<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiQueryResponse<T>> {
    try {
      // Get auth tokens from session storage on client
      let accessToken: string | undefined;
      let refreshToken: string | undefined;

      if (typeof window !== "undefined") {
        try {
          const session = JSON.parse(
            sessionStorage.getItem("auth-session") || "{}"
          );
          accessToken = session.accessToken;
          refreshToken = session.refreshToken;
        } catch (e) {
          console.error("Error getting tokens from session storage:", e);
        }
      }

      // Check if tokens need refreshing
      if (accessToken && refreshToken) {
        const refreshedTokens = await checkAndRefreshToken(
          accessToken,
          refreshToken
        );

        if (refreshedTokens && refreshedTokens.accessToken !== accessToken) {
          // Update tokens in session storage if refreshed
          if (typeof window !== "undefined") {
            const session = JSON.parse(
              sessionStorage.getItem("auth-session") || "{}"
            );
            session.accessToken = refreshedTokens.accessToken;
            session.refreshToken = refreshedTokens.refreshToken;
            sessionStorage.setItem("auth-session", JSON.stringify(session));
          }

          // Update tokens for current request
          accessToken = refreshedTokens.accessToken;
          refreshToken = refreshedTokens.refreshToken;

          // Notify React Query that tokens have been refreshed (optional)
          queryClient.invalidateQueries({ queryKey: ["auth"] });
        }
      }

      // Add auth header if we have a token
      const headers = new Headers(options.headers || {});
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }

      // Make the API request
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Parse response
      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.message || "Request failed",
          statusCode: response.status,
        };
      }

      return { data: data as T };
    } catch (error) {
      console.error("API request error:", error);
      return {
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };
}

/**
 * Hook for making authenticated API GET requests
 */
export function useAuthQuery<TData = unknown>(
  endpoint: string,
  options?: Omit<
    UseQueryOptions<ApiQueryResponse<TData>>,
    "queryKey" | "queryFn"
  >
) {
  const { tokens, isAuthenticated } = useAuthStatus();
  const authFetch = createAuthFetch(queryClient);

  return useQuery<ApiQueryResponse<TData>>({
    queryKey: ["api", endpoint],
    queryFn: async () => {
      // Only attach auth header if user is authenticated
      const headers: HeadersInit = {};
      if (isAuthenticated && tokens?.accessToken) {
        headers.Authorization = `Bearer ${tokens.accessToken}`;
      }

      return authFetch<TData>(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        headers,
      });
    },
    ...options,
  });
}

/**
 * Hook for making authenticated API mutations (POST, PUT, DELETE, etc)
 */
export function useAuthMutation<TData = unknown, TVariables = unknown>(
  endpoint: string,
  method = "POST",
  options?: {
    onSuccess?: (data: ApiQueryResponse<TData>) => void;
    onError?: (error: unknown) => void;
  }
) {
  const { tokens, isAuthenticated } = useAuthStatus();
  const authFetch = createAuthFetch(queryClient);

  return useMutation<ApiQueryResponse<TData>, unknown, TVariables>({
    mutationFn: async (variables) => {
      // Only attach auth header if user is authenticated
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (isAuthenticated && tokens?.accessToken) {
        headers.Authorization = `Bearer ${tokens.accessToken}`;
      }

      return authFetch<TData>(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method,
        headers,
        body: variables ? JSON.stringify(variables) : undefined,
      });
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}
