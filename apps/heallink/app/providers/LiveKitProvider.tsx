"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useMemo,
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

  // Create the Room instance only once
  const room = useMemo(
    () =>
      new Room({
        adaptiveStream: true,
        dynacast: true,
      }),
    []
  );

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [remoteParticipants, setRemoteParticipants] = useState<
    RemoteParticipant[]
  >([]);

  // Use the React Query hook for token generation
  const tokenMutation = useLiveKitToken({
    onError: (err) => {
      setError(err instanceof Error ? err : new Error(String(err)));
      setIsConnecting(false);
    },
  });

  // Track remote participants
  const updateRemoteParticipants = useCallback(() => {
    setRemoteParticipants(Array.from(room.remoteParticipants.values()));
  }, [room]);

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
      setIsConnected(true);
      setIsConnecting(false);
      updateRemoteParticipants();
    };

    const handleDisconnected = () => {
      setIsConnected(false);
      setIsConnecting(false);
      setRemoteParticipants([]);
    };

    const handleConnectionStateChanged = (state: ConnectionState) => {
      setIsConnecting(state === ConnectionState.Connecting);
      setIsConnected(state === ConnectionState.Connected);
    };

    const handleParticipantConnected = () => {
      updateRemoteParticipants();
    };

    const handleParticipantDisconnected = () => {
      updateRemoteParticipants();
    };

    // Add all event listeners
    room.on(RoomEvent.Connected, handleConnected);
    room.on(RoomEvent.Disconnected, handleDisconnected);
    room.on(RoomEvent.ConnectionStateChanged, handleConnectionStateChanged);
    room.on(RoomEvent.ParticipantConnected, handleParticipantConnected);
    room.on(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);

    return () => {
      // Remove all event listeners
      room.off(RoomEvent.Connected, handleConnected);
      room.off(RoomEvent.Disconnected, handleDisconnected);
      room.off(RoomEvent.ConnectionStateChanged, handleConnectionStateChanged);
      room.off(RoomEvent.ParticipantConnected, handleParticipantConnected);
      room.off(
        RoomEvent.ParticipantDisconnected,
        handleParticipantDisconnected
      );
    };
  }, [room, updateRemoteParticipants]);

  // Memoize the connect function to avoid recreation on each render
  const connect = useCallback(
    async (roomName: string) => {
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
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsConnecting(false);
        throw err; // Rethrow for handling by the caller
      }
    },
    [room, session, tokenMutation]
  );

  // Memoize the disconnect function
  const disconnect = useCallback(() => {
    room.disconnect();
    setIsConnected(false);
  }, [room]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo<LiveKitContextType>(
    () => ({
      room,
      isConnected,
      isConnecting,
      error,
      localParticipant: room.localParticipant || null,
      remoteParticipants,
      connect,
      disconnect,
    }),
    [
      room,
      isConnected,
      isConnecting,
      error,
      remoteParticipants,
      connect,
      disconnect,
    ]
  );

  return (
    <LiveKitContext.Provider value={contextValue}>
      {children}
    </LiveKitContext.Provider>
  );
};
