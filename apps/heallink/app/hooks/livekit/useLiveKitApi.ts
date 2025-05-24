"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/app/api/apiClient";

// Types
interface TokenRequest {
  identity: string;
  room_name: string;
}

interface TokenResponse {
  token: string;
  serverUrl: string;
}

interface InitializeAssistantRequest {
  identity: string;
  room_name: string;
}

interface AgentResponse {
  agent_id: string;
  room_name: string;
  identity: string;
  status: string;
  connected_at: string;
  disconnected_at: string | null;
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

// API base URL from environment variables
const rawAiEngineUrl =
  process.env.NEXT_PUBLIC_AI_ENGINE_URL || "http://localhost:8000/api/v1";

// Format the base URL to have consistent structure
// We want to ensure it ends with api/v1 without duplicate slashes
let AI_ENGINE_URL = rawAiEngineUrl;
if (!AI_ENGINE_URL.includes("/api/v1")) {
  AI_ENGINE_URL = `${AI_ENGINE_URL.replace(/\/$/, "")}/api/v1`;
}

console.log("Using AI Engine URL:", AI_ENGINE_URL);

// Get current agent ID from window if available
const getCurrentAgentId = (): string | null => {
  if (typeof window !== "undefined") {
    return window.currentAgentId;
  }
  return null;
};

/**
 * Hook to generate a LiveKit token
 */
export function useGenerateLiveKitToken() {
  return useMutation<TokenResponse, Error, TokenRequest>({
    mutationFn: async (request: TokenRequest) => {
      console.log("Requesting LiveKit token:", request);
      try {
        // Call AI Engine API directly for token generation
        const endpoint = `${AI_ENGINE_URL}/livekit/token`;
        console.log("Token endpoint:", endpoint);

        const response = await fetchApi<TokenResponse>(endpoint, {
          method: "POST",
          body: JSON.stringify(request),
        });

        console.log("Token response received:", !!response.token);
        return response;
      } catch (error) {
        console.error("Failed to generate LiveKit token:", error);
        throw error;
      }
    },
  });
}

/**
 * Hook to initialize the voice assistant
 */
export function useInitializeVoiceAssistant() {
  return useMutation<AgentResponse, Error, InitializeAssistantRequest>({
    mutationFn: async (request: InitializeAssistantRequest) => {
      console.log("Initializing voice assistant:", request);
      try {
        // Call AI Engine API to create an agent
        const endpoint = `${AI_ENGINE_URL}/livekit/agents`;
        console.log("Agents endpoint:", endpoint);

        const response = await fetchApi<AgentResponse>(endpoint, {
          method: "POST",
          body: JSON.stringify({
            room_name: request.room_name,
            identity: `assistant-${request.identity}`,
            display_name: "Heallink Assistant",
          }),
        });

        console.log("Agent initialized:", response.agent_id);
        return response;
      } catch (error) {
        console.error("Failed to initialize voice assistant:", error);
        throw error;
      }
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
    queryKey: ["voiceAssistant", "state", roomName, getCurrentAgentId()],
    queryFn: async () => {
      if (!roomName) {
        throw new Error("Room name is required");
      }

      // If we have an agent ID, use it directly
      const agentId = getCurrentAgentId();
      console.log("Getting voice assistant state for agent:", agentId);

      if (agentId) {
        try {
          const endpoint = `${AI_ENGINE_URL}/livekit/agents/${agentId}`;
          console.log("Agent state endpoint:", endpoint);

          const agentState = await fetchApi<AgentResponse>(endpoint);
          console.log("Received agent state:", agentState);

          return {
            roomName,
            participants: [
              {
                id: agentState.agent_id,
                identity: agentState.identity,
                isAgent: true,
              },
            ],
            isListening: agentState.status === "active",
            isSpeaking: false, // We don't have a direct way to know if speaking
            transcript: "", // We don't have transcript from this endpoint
          };
        } catch (error) {
          console.error("Failed to get agent state:", error);
          // Clear agent ID if it's invalid
          if (typeof window !== "undefined") {
            window.currentAgentId = null;
          }
        }
      }

      // Default state if no agent found
      return {
        roomName,
        participants: [],
        isListening: false,
        isSpeaking: false,
        transcript: "",
      };
    },
    enabled: !!roomName && enabled,
    refetchInterval: enabled ? 1000 : false, // Poll every second when enabled
  });
}

/**
 * Hook to end a voice assistant session
 */
export function useEndVoiceAssistant() {
  return useMutation<void, Error, string | undefined>({
    mutationFn: async () => {
      try {
        const agentId = getCurrentAgentId();
        console.log("Ending voice assistant session for agent:", agentId);

        if (agentId) {
          const endpoint = `${AI_ENGINE_URL}/livekit/agents/disconnect`;
          console.log("Disconnect endpoint:", endpoint);

          await fetchApi<AgentResponse>(endpoint, {
            method: "POST",
            body: JSON.stringify({ agent_id: agentId }),
          });

          console.log("Successfully disconnected agent");

          // Clear agent ID after disconnecting
          if (typeof window !== "undefined") {
            window.currentAgentId = null;
          }
        }
      } catch (error) {
        console.error("Failed to end voice assistant:", error);
      }
    },
  });
}
