"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  useGenerateLiveKitToken,
  useInitializeVoiceAssistant,
  useVoiceAssistantState,
  useEndVoiceAssistant,
} from "@/app/hooks/livekit/useLiveKitApi";

// Declare external module to fix TypeScript errors
declare global {
  interface Window {
    currentAgentId: string | null;
  }
}

// Initialize window.currentAgentId if in browser
if (typeof window !== "undefined") {
  window.currentAgentId = window.currentAgentId || null;
}

interface VoiceAssistantContextType {
  isConnected: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  connect: () => Promise<boolean>;
  disconnect: () => Promise<void>;
  toggleMicrophone: (isActive: boolean) => Promise<void>;
}

const defaultVoiceAssistantContext: VoiceAssistantContextType = {
  isConnected: false,
  isListening: false,
  isSpeaking: false,
  transcript: "",
  connect: async () => false,
  disconnect: async () => {},
  toggleMicrophone: async () => {},
};

const VoiceAssistantContext = createContext<VoiceAssistantContextType>(
  defaultVoiceAssistantContext
);

export const useVoiceAssistant = () => useContext(VoiceAssistantContext);

interface VoiceAssistantProviderProps {
  children: ReactNode;
}

export const VoiceAssistantProvider = ({
  children,
}: VoiceAssistantProviderProps) => {
  // Define Room type properly
  const [room, setRoom] = useState<import("livekit-client").Room | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [userId, setUserId] = useState("");
  const [roomName, setRoomName] = useState<string>("");

  // LiveKit API hooks
  const tokenMutation = useGenerateLiveKitToken();
  const initializeAssistantMutation = useInitializeVoiceAssistant();
  const endAssistantMutation = useEndVoiceAssistant();
  const { data: assistantState } = useVoiceAssistantState(
    roomName,
    isConnected
  );

  // Define disconnect function with useCallback to avoid dependency issues
  const disconnect = useCallback(async () => {
    try {
      console.log("Disconnect called, current room:", room);
      if (room) {
        // Clean up voice assistant on the backend using React Query mutation
        console.log("Calling end assistant mutation");
        await endAssistantMutation.mutateAsync(undefined);

        // Clear the current agent ID
        if (typeof window !== "undefined") {
          window.currentAgentId = null;
        }

        // Disconnect from the LiveKit room
        room.disconnect();
        setRoom(null);
        setIsConnected(false);
        setIsListening(false);
        setIsSpeaking(false);
        setTranscript("");
        setRoomName("");
        console.log("Successfully disconnected");
      }
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  }, [room, endAssistantMutation]);

  // Generate user ID on mount and handle cleanup
  useEffect(() => {
    if (!userId) {
      const newUserId = `user-${Math.floor(Math.random() * 100000)}`;
      console.log("Generated new user ID:", newUserId);
      setUserId(newUserId);
    }

    // Cleanup function for component unmount
    return () => {
      if (room) {
        disconnect();
      }
    };
  }, [userId, room, disconnect]);

  // Update assistant state from backend data
  useEffect(() => {
    if (assistantState) {
      setIsListening(assistantState.isListening);
      setIsSpeaking(assistantState.isSpeaking);

      // Only update transcript if there's new content
      if (
        assistantState.transcript &&
        assistantState.transcript !== transcript
      ) {
        setTranscript(assistantState.transcript);
      }
    }
  }, [assistantState, transcript]);

  // Cleanup on roomName change or component unmount
  useEffect(() => {
    return () => {
      if (roomName && room) {
        disconnect();
      }
    };
  }, [roomName, room, disconnect]);

  const connect = async () => {
    try {
      console.log("Connect called, userId:", userId);
      if (!userId) {
        const newUserId = `user-${Math.floor(Math.random() * 100000)}`;
        console.log("Setting new user ID in connect:", newUserId);
        setUserId(newUserId);
      }

      // Load the LiveKit client dynamically
      console.log("Loading LiveKit client");
      let livekitClient;
      try {
        livekitClient = await import("livekit-client");
        console.log("LiveKit client loaded successfully");
      } catch (error) {
        console.error("Failed to load LiveKit client:", error);
        throw new Error("Failed to load LiveKit client module");
      }

      const Room = livekitClient.Room;

      // Create a new room instance
      const newRoom = new Room();
      setRoom(newRoom);

      // Generate a random room name
      const newRoomName = `heallink-room-${Math.floor(Math.random() * 100000)}`;
      console.log("Generated room name:", newRoomName);
      setRoomName(newRoomName);

      // Get token from backend using React Query mutation
      console.log("Getting token from backend");
      let tokenResponse;
      try {
        tokenResponse = await tokenMutation.mutateAsync({
          identity: userId || `user-${Math.floor(Math.random() * 100000)}`,
          room_name: newRoomName,
        });
        console.log("Token received:", !!tokenResponse.token);
      } catch (error) {
        console.error("Failed to get token:", error);
        throw new Error("Failed to get LiveKit token from AI Engine");
      }

      // Connect to the LiveKit room
      console.log("Connecting to LiveKit room");
      try {
        await newRoom.connect(tokenResponse.serverUrl, tokenResponse.token);
        console.log("Connected to LiveKit room");
      } catch (error) {
        console.error("Failed to connect to LiveKit room:", error);
        throw new Error("Failed to connect to LiveKit room");
      }

      // Enable local microphone
      console.log("Enabling microphone");
      try {
        await newRoom.localParticipant.setMicrophoneEnabled(true);
        console.log("Microphone enabled");
      } catch (error) {
        console.error("Failed to enable microphone:", error);
        throw new Error(
          "Failed to enable microphone - check browser permissions"
        );
      }

      // Initialize the AI assistant using React Query mutation
      console.log("Initializing AI assistant");
      let initializeResponse;
      try {
        initializeResponse = await initializeAssistantMutation.mutateAsync({
          identity: userId || `user-${Math.floor(Math.random() * 100000)}`,
          room_name: newRoomName,
        });
        console.log(
          "AI assistant initialized with ID:",
          initializeResponse.agent_id
        );
      } catch (error) {
        console.error("Failed to initialize AI assistant:", error);
        // Disconnect from room since we failed to initialize the assistant
        newRoom.disconnect();
        throw new Error("Failed to initialize AI assistant");
      }

      // Store the agent ID for future requests
      const newAgentId = initializeResponse.agent_id;

      // Store in global window object for useLiveKitApi.ts to access
      if (typeof window !== "undefined") {
        window.currentAgentId = newAgentId;
        console.log("Stored agent ID in window:", newAgentId);
      }

      // Set up event listeners
      newRoom.on("participantConnected", (participant) => {
        if (participant.identity.startsWith("assistant-")) {
          console.log("Assistant connected", participant);
        }
      });

      newRoom.on("participantDisconnected", (participant) => {
        if (participant.identity.startsWith("assistant-")) {
          console.log("Assistant disconnected", participant);
        }
      });

      // Set state
      setIsConnected(true);
      console.log("Connection successful");
      return true;
    } catch (error) {
      console.error("Failed to connect to LiveKit:", error);
      setIsConnected(false);
      setRoomName("");

      // Show error toast notification via DOM alert since we don't have the toast component
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      alert(
        `Failed to connect to the voice assistant: ${errorMessage}. Please check the console for details.`
      );
      return false;
    }
  };

  const toggleMicrophone = async (isActive: boolean) => {
    console.log("toggleMicrophone called with isActive:", isActive);

    try {
      if (isActive) {
        // If activating and not connected yet, connect first
        if (!isConnected || !room) {
          console.log("Not connected yet, connecting first");
          const connected = await connect();

          if (!connected) {
            console.error("Failed to connect");
            return;
          }

          // Connection established the microphone should already be enabled
          console.log("Connection established with microphone enabled");
          return;
        } else {
          // We're already connected, just enable the microphone
          console.log("Already connected, enabling microphone");
          await room.localParticipant.setMicrophoneEnabled(true);
        }
      } else {
        // If deactivating, disable microphone if connected
        if (isConnected && room) {
          console.log("Disabling microphone");
          await room.localParticipant.setMicrophoneEnabled(false);
        } else {
          // Not connected, no need to do anything
          console.log("Not connected, nothing to disable");
        }
      }
    } catch (error) {
      console.error("Failed to toggle microphone:", error);

      // Show error alert
      alert(
        "Failed to access microphone. Please check permissions and try again."
      );
    }
  };

  const value = {
    isConnected,
    isListening,
    isSpeaking,
    transcript,
    connect,
    disconnect,
    toggleMicrophone,
  };

  return (
    <VoiceAssistantContext.Provider value={value}>
      {children}
    </VoiceAssistantContext.Provider>
  );
};
