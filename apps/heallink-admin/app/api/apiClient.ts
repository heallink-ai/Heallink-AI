// Base API client configuration
import { getSession } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

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

/**
 * Base fetch wrapper with authentication and error handling
 */
export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Get the current session for the token
  const session = await getSession();
  const token = session?.user?.token;

  // Prepare headers
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add auth token if available
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Prepare the request
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // Parse the JSON response
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

    // Convert other errors to ApiError
    throw new ApiError(
      500,
      error instanceof Error ? error.message : "Unknown error occurred",
      { originalError: error }
    );
  }
}
