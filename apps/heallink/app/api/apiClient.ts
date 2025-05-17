// Base API client configuration
import { getSession } from "next-auth/react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003/api/v1";

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

/**
 * Base fetch wrapper with authentication and error handling
 */
export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Get the current session for the token
  const session = await getSession();
  const accessToken = session?.accessToken;

  // Prepare headers with content type
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  // Add auth token if available
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  // Prepare the request
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const config: RequestInit = {
    ...options,
    headers,
    credentials: "include", // Keep credential cookies as well
  };

  try {
    const response = await fetch(url, config);

    // Handle JSON parsing (some endpoints might not return JSON)
    const data = await response.json().catch(() => ({}));

    // Handle non-successful responses
    if (!response.ok) {
      throw new ApiError(
        response.status,
        data.message ||
          response.statusText ||
          `API request failed with status ${response.status}`,
        data
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Convert other errors to ApiError for consistent handling
    throw new ApiError(
      500,
      error instanceof Error ? error.message : "Unknown error occurred",
      { originalError: error }
    );
  }
}
