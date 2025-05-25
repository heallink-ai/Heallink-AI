import { useMutation } from "@tanstack/react-query";
import { fetchApi } from "@/app/api/apiClient";

// Types
interface CreateTokenRequest {
  roomName: string;
  identity: string;
  canPublish?: boolean;
  canSubscribe?: boolean;
  canPublishData?: boolean;
}

interface CreateTokenResponse {
  token: string;
}

/**
 * Hook to generate a LiveKit token directly from our NestJS API
 */
export function useLiveKitToken() {
  return useMutation<CreateTokenResponse, Error, CreateTokenRequest>({
    mutationFn: async (request: CreateTokenRequest) => {
      try {
        console.log("Requesting LiveKit token from NestJS API:", request);

        // Call our NestJS API endpoint directly
        const response = await fetchApi<CreateTokenResponse>("/livekit/token", {
          method: "POST",
          body: JSON.stringify(request),
        });

        console.log("Token received successfully");
        return response;
      } catch (error) {
        console.error("Failed to generate LiveKit token:", error);
        throw error;
      }
    },
  });
}
