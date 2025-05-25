"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  Room,
  RoomEvent,
  LocalParticipant,
  RemoteParticipant,
  ConnectionState,
} from "livekit-client";
import { useSession } from "next-auth/react";
import "@livekit/components-styles";
import { useLiveKitToken } from "@/app/hooks/livekit/useLiveKitTokenApi";

interface LiveKitContextType {
  room: Room | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
  localParticipant: LocalParticipant | null;
  remoteParticipants: RemoteParticipant[];
  connect: (roomName: string) => Promise<void>;
  disconnect: () => void;
}

const LiveKitContext = createContext<LiveKitContextType | null>(null);

export const useLiveKit = () => {
  const context = useContext(LiveKitContext);
  if (!context) {
    throw new Error("useLiveKit must be used within a LiveKitProvider");
  }
  return context;
};

interface LiveKitProviderProps {
  children: ReactNode;
}

export const LiveKitProvider: React.FC<LiveKitProviderProps> = ({
  children,
}) => {
  const { data: session } = useSession();
  const [room] = useState(
    () =>
      new Room({
        adaptiveStream: true,
        dynacast: true,
      })
  );
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Use the React Query hook for token generation
  const tokenMutation = useLiveKitToken();

  // Clean up the room when component unmounts
  useEffect(() => {
    return () => {
      if (room) {
        room.disconnect();
      }
    };
  }, [room]);

  // Set up room event listeners
  useEffect(() => {
    const handleConnected = () => {
      console.log("Connected to LiveKit room");
      setIsConnected(true);
      setIsConnecting(false);
    };

    const handleDisconnected = () => {
      console.log("Disconnected from LiveKit room");
      setIsConnected(false);
      setIsConnecting(false);
    };

    const handleConnectionStateChanged = (state: ConnectionState) => {
      console.log("Connection state changed:", state);
      setIsConnecting(state === ConnectionState.Connecting);
      setIsConnected(state === ConnectionState.Connected);
    };

    room.on(RoomEvent.Connected, handleConnected);
    room.on(RoomEvent.Disconnected, handleDisconnected);
    room.on(RoomEvent.ConnectionStateChanged, handleConnectionStateChanged);

    return () => {
      room.off(RoomEvent.Connected, handleConnected);
      room.off(RoomEvent.Disconnected, handleDisconnected);
      room.off(RoomEvent.ConnectionStateChanged, handleConnectionStateChanged);
    };
  }, [room]);

  const connect = async (roomName: string) => {
    if (!session?.user?.id) {
      throw new Error(
        "User must be authenticated to connect to a LiveKit room"
      );
    }

    const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;
    if (!livekitUrl) {
      throw new Error(
        "NEXT_PUBLIC_LIVEKIT_URL is not defined in environment variables"
      );
    }

    setError(null);
    setIsConnecting(true);

    try {
      // Get token directly from NestJS API using React Query
      const result = await tokenMutation.mutateAsync({
        roomName,
        identity: session.user.id,
        canPublish: true,
        canSubscribe: true,
        canPublishData: true,
      });

      // Connect to the room using the token
      await room.connect(livekitUrl, result.token);
      console.log("Connected to room:", roomName);
    } catch (err) {
      console.error("Failed to connect to LiveKit room:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    room.disconnect();
    setIsConnected(false);
  };

  const contextValue: LiveKitContextType = {
    room,
    isConnected,
    isConnecting,
    error,
    localParticipant: room.localParticipant || null,
    remoteParticipants: Array.from(room.remoteParticipants.values()),
    connect,
    disconnect,
  };

  return (
    <LiveKitContext.Provider value={contextValue}>
      {children}
    </LiveKitContext.Provider>
  );
};
