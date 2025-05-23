import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface VoiceAssistantContextType {
  isConnected: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  connect: () => Promise<void>;
  disconnect: () => void;
  toggleMicrophone: (isActive: boolean) => void;
}

const defaultVoiceAssistantContext: VoiceAssistantContextType = {
  isConnected: false,
  isListening: false,
  isSpeaking: false,
  transcript: "",
  connect: async () => {},
  disconnect: () => {},
  toggleMicrophone: () => {},
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
  const [room, setRoom] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    // Generate a random user ID if not already set
    if (!userId) {
      setUserId(`user-${Math.floor(Math.random() * 100000)}`);
    }

    // Cleanup function
    return () => {
      if (room) {
        disconnect();
      }
    };
  }, []);

  const connect = async () => {
    try {
      // Load the LiveKit client dynamically
      const { Room } = await import("livekit-client");

      // Create a new room instance
      const newRoom = new Room();
      setRoom(newRoom);

      // Generate a random room name
      const roomName = `heallink-room-${Math.floor(Math.random() * 100000)}`;

      // Get token from backend
      const response = await fetch("/api/livekit/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identity: userId,
          roomName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get LiveKit token");
      }

      const { token, serverUrl } = await response.json();

      // Connect to the LiveKit room
      await newRoom.connect(serverUrl, token);

      // Enable local microphone
      await newRoom.localParticipant.setMicrophoneEnabled(true);

      // Initialize the AI assistant
      await fetch("/api/voice-assistant/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomName,
          identity: userId,
        }),
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

      // Subscribe to agent state changes
      // This would typically be done with LiveKit's state synchronization
      // For now, we'll just simulate state changes
      simulateAssistantStateChanges();
    } catch (error) {
      console.error("Failed to connect to LiveKit:", error);
      setIsConnected(false);
    }
  };

  // This is a temporary simulation function
  // In a real implementation, we would listen to LiveKit state changes
  const simulateAssistantStateChanges = () => {
    const stateInterval = setInterval(() => {
      // Randomly toggle between listening and speaking states
      const randomState = Math.floor(Math.random() * 3);
      if (randomState === 0) {
        setIsListening(true);
        setIsSpeaking(false);
      } else if (randomState === 1) {
        setIsListening(false);
        setIsSpeaking(true);
        // Simulate transcript updates
        setTranscript((prev) => prev + " " + getRandomResponse());
      } else {
        setIsListening(false);
        setIsSpeaking(false);
      }
    }, 3000);

    // Clean up interval
    return () => clearInterval(stateInterval);
  };

  const getRandomResponse = () => {
    const responses = [
      "I can help you schedule an appointment.",
      "Your last checkup was three months ago.",
      "Would you like me to remind you about your medication?",
      "Your test results look normal.",
      "I've updated your prescription refill request.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const disconnect = () => {
    if (room) {
      room.disconnect();
      setRoom(null);
      setIsConnected(false);
      setIsListening(false);
      setIsSpeaking(false);
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
