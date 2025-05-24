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

interface VoiceAssistantContextType {
  isConnected: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  toggleMicrophone: (isActive: boolean) => Promise<void>;
}

const defaultVoiceAssistantContext: VoiceAssistantContextType = {
  isConnected: false,
  isListening: false,
  isSpeaking: false,
  transcript: "",
  connect: async () => {},
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

export const VoiceAssistantProvider: React.FC<VoiceAssistantProviderProps> = ({
  children,
}) => {
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
      if (room) {
        // Clean up voice assistant on the backend using React Query mutation
        if (roomName) {
          await endAssistantMutation.mutateAsync(roomName);
        }

        // Disconnect from the LiveKit room
        room.disconnect();
        setRoom(null);
        setIsConnected(false);
        setIsListening(false);
        setIsSpeaking(false);
        setTranscript("");
        setRoomName("");
      }
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  }, [room, roomName, endAssistantMutation]);

  // Generate user ID on mount and handle cleanup
  useEffect(() => {
    if (!userId) {
      setUserId(`user-${Math.floor(Math.random() * 100000)}`);
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
      // Load the LiveKit client dynamically
      const livekitClient = await import("livekit-client");
      const Room = livekitClient.Room;

      // Create a new room instance
      const newRoom = new Room();
      setRoom(newRoom);

      // Generate a random room name
      const newRoomName = `heallink-room-${Math.floor(Math.random() * 100000)}`;
      setRoomName(newRoomName);

      // Get token from backend using React Query mutation
      const tokenResponse = await tokenMutation.mutateAsync({
        identity: userId,
        roomName: newRoomName,
      });

      // Connect to the LiveKit room
      await newRoom.connect(tokenResponse.serverUrl, tokenResponse.token);

      // Enable local microphone
      await newRoom.localParticipant.setMicrophoneEnabled(true);

      // Initialize the AI assistant using React Query mutation
      await initializeAssistantMutation.mutateAsync({
        identity: userId,
        roomName: newRoomName,
      });

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
    } catch (error) {
      console.error("Failed to connect to LiveKit:", error);
      setIsConnected(false);
      setRoomName("");
    }
  };

  const toggleMicrophone = async (isActive: boolean) => {
    if (!room) {
      if (isActive) {
        await connect();
      }
      return;
    }

    try {
      await room.localParticipant.setMicrophoneEnabled(isActive);
    } catch (error) {
      console.error("Failed to toggle microphone:", error);
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
