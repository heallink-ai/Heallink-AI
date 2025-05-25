import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { fetchApi } from "@/app/api/apiClient";

// Types
export interface CreateTokenRequest {
  roomName: string;
  identity: string;
  canPublish?: boolean;
  canSubscribe?: boolean;
  canPublishData?: boolean;
}

export interface CreateTokenResponse {
  token: string;
}

/**
 * Hook to generate a LiveKit token directly from our NestJS API
 * @param options - Optional mutation options for additional configuration
 */
export function useLiveKitToken(
  options?: Omit<
    UseMutationOptions<CreateTokenResponse, Error, CreateTokenRequest>,
    "mutationFn"
  >
) {
  return useMutation<CreateTokenResponse, Error, CreateTokenRequest>({
    mutationFn: async (request: CreateTokenRequest) => {
      try {
        // Call our NestJS API endpoint directly
        const response = await fetchApi<CreateTokenResponse>("/livekit/token", {
          method: "POST",
          body: JSON.stringify(request),
        });

        return response;
      } catch (error) {
        console.error("Failed to generate LiveKit token:", error);
        throw error;
      }
    },
    // Default options for better performance
    retry: 2,
    onError: (error) => {
      console.error("LiveKit token generation failed:", error);
    },
    // Spread any user-provided options
    ...options,
  });
}
