import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/app/api/apiClient";

// Types
interface TokenRequest {
  identity: string;
  roomName: string;
}

interface TokenResponse {
  token: string;
  serverUrl: string;
}

interface InitializeAssistantRequest {
  identity: string;
  roomName: string;
}

interface VoiceAssistantState {
  roomName: string;
  participants: {
    id: string;
    identity: string;
    isAgent: boolean;
  }[];
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
}

// Direct API base URL (using environment variable)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003";

/**
 * Hook to generate a LiveKit token
 */
export function useGenerateLiveKitToken() {
  return useMutation<TokenResponse, Error, TokenRequest>({
    mutationFn: async (request: TokenRequest) => {
      // Call NestJS API directly instead of going through Next.js API
      return fetchApi<TokenResponse>(`${API_BASE_URL}/api/v1/livekit/token`, {
        method: "POST",
        body: JSON.stringify(request),
      });
    },
  });
}

/**
 * Hook to initialize the voice assistant
 */
export function useInitializeVoiceAssistant() {
  return useMutation<void, Error, InitializeAssistantRequest>({
    mutationFn: async (request: InitializeAssistantRequest) => {
      // Call NestJS API directly
      await fetchApi<{ success: boolean }>(
        `${API_BASE_URL}/api/v1/livekit/voice-assistant/initialize`,
        {
          method: "POST",
          body: JSON.stringify(request),
        }
      );
    },
  });
}

/**
 * Hook to fetch the current state of a voice assistant
 */
export function useVoiceAssistantState(
  roomName: string | null,
  enabled = false
) {
  return useQuery<VoiceAssistantState, Error>({
    queryKey: ["voiceAssistant", "state", roomName],
    queryFn: async () => {
      if (!roomName) {
        throw new Error("Room name is required");
      }

      // Call NestJS API directly
      return fetchApi<VoiceAssistantState>(
        `${API_BASE_URL}/api/v1/livekit/voice-assistant/${roomName}/state`
      );
    },
    enabled: !!roomName && enabled,
    refetchInterval: enabled ? 1000 : false, // Poll every second when enabled
  });
}

/**
 * Hook to end a voice assistant session
 */
export function useEndVoiceAssistant() {
  return useMutation<void, Error, string>({
    mutationFn: async (roomName: string) => {
      // Call NestJS API directly
      await fetchApi<{ success: boolean }>(
        `${API_BASE_URL}/api/v1/livekit/voice-assistant/${roomName}`,
        {
          method: "DELETE",
        }
      );
    },
  });
}
