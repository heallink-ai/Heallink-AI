"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  Room,
  RoomEvent,
  LocalParticipant,
  RemoteParticipant,
  ConnectionState,
  RemoteTrack,
  Track,
  RemoteTrackPublication,
} from "livekit-client";
import { useSession } from "next-auth/react";
import "@livekit/components-styles";
import { useLiveKitToken } from "@/app/hooks/livekit/useLiveKitTokenApi";

// Debug component to show audio controls when needed
const AudioDebugControls = () => {
  const [showControls, setShowControls] = useState(false);

  // Only show in development
  if (process.env.NODE_ENV !== "development") return null;

  // Toggle controls visibility
  const toggleControls = () => {
    setShowControls((prev) => !prev);
  };

  return (
    <>
      {/* Small floating button to toggle debug controls */}
      <button
        onClick={toggleControls}
        style={{
          position: "fixed",
          bottom: "10px",
          right: "10px",
          zIndex: 9999,
          background: "#5a2dcf",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "24px",
          height: "24px",
          fontSize: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          opacity: 0.6,
        }}
        title="Toggle audio debug controls"
      >
        🔊
      </button>

      {/* Actual controls panel */}
      {showControls && (
        <div
          style={{
            position: "fixed",
            bottom: "40px",
            right: "10px",
            zIndex: 9999,
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          <h4 style={{ margin: "0 0 5px 0" }}>Audio Debug</h4>
          <div>
            <audio
              id="debug-audio-element"
              controls
              style={{ display: "block", marginBottom: "5px" }}
            />
            <button
              onClick={() => {
                const mainAudio = document.getElementById(
                  "heallink-agent-audio"
                ) as HTMLAudioElement;
                const debugAudio = document.getElementById(
                  "debug-audio-element"
                ) as HTMLAudioElement;

                if (mainAudio && debugAudio && mainAudio.srcObject) {
                  // Clone the audio stream to the debug element
                  debugAudio.srcObject = mainAudio.srcObject;
                  debugAudio
                    .play()
                    .catch((e) => console.error("Debug audio play failed:", e));
                } else {
                  alert("No active audio stream found");
                }
              }}
              style={{
                background: "#2066e4",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "5px 10px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              Connect to Agent Audio
            </button>
          </div>
        </div>
      )}
    </>
  );
};

interface LiveKitContextType {
  room: Room | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
  localParticipant: LocalParticipant | null;
  remoteParticipants: RemoteParticipant[];
  connect: (roomName: string) => Promise<void>;
  disconnect: () => void;
  isMicrophoneEnabled: boolean;
  toggleMicrophone: () => Promise<void>;
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
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const audioTrackQueueRef = useRef<RemoteTrack[]>([]);
  const isProcessingAudioRef = useRef<boolean>(false);
  const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState(false);

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

  // Safe audio play function with proper error handling
  const safePlayAudio = async (
    audioElement: HTMLAudioElement
  ): Promise<void> => {
    if (!audioElement) return;

    try {
      // Always set these properties before playing
      audioElement.muted = false;
      audioElement.volume = 1.0;

      // Attempt to play with promise handling
      await audioElement.play();
      console.log("Audio playback started successfully");
    } catch (error) {
      console.error("Audio playback failed:", error);

      // Setup one-time click handler to unlock audio
      const unlockAudio = () => {
        if (audioElement) {
          audioElement
            .play()
            .then(() => {
              console.log("Audio unlocked by user interaction");
              document.removeEventListener("click", unlockAudio);
              document.removeEventListener("touchstart", unlockAudio);
            })
            .catch((e) => console.error("Still couldn't play audio:", e));
        }
      };

      document.addEventListener("click", unlockAudio, { once: true });
      document.addEventListener("touchstart", unlockAudio, { once: true });
    }
  };

  // Process the next audio track in the queue
  const processNextAudioTrack = async () => {
    if (
      isProcessingAudioRef.current ||
      audioTrackQueueRef.current.length === 0
    ) {
      return;
    }

    isProcessingAudioRef.current = true;

    try {
      // Get the next track from the queue
      const track = audioTrackQueueRef.current.shift();
      if (!track) {
        isProcessingAudioRef.current = false;
        return;
      }

      console.log("Processing next audio track in queue");

      // Create or get audio element
      if (!audioElementRef.current) {
        const audioElement = document.createElement("audio");
        audioElement.id = "heallink-agent-audio";
        audioElement.autoplay = false; // We'll manually control playback
        audioElement.muted = false;
        audioElement.volume = 1.0;
        audioElement.controls = false;
        audioElement.style.display = "none";
        audioElement.setAttribute("playsinline", "true");
        document.body.appendChild(audioElement);
        audioElementRef.current = audioElement;

        console.log("Created new audio element:", audioElement.id);
      }

      // Detach any existing tracks
      if (audioElementRef.current.srcObject) {
        audioElementRef.current.srcObject = null;
        audioElementRef.current.load(); // Reset the audio element
      }

      // Attach the new track
      track.attach(audioElementRef.current);

      // Play the audio
      await safePlayAudio(audioElementRef.current);
    } catch (error) {
      console.error("Error processing audio track:", error);
    } finally {
      isProcessingAudioRef.current = false;

      // Process the next track if there are more in the queue
      if (audioTrackQueueRef.current.length > 0) {
        // Add a small delay to prevent rapid consecutive plays
        setTimeout(() => {
          processNextAudioTrack();
        }, 100);
      }
    }
  };

  // Add a track to the queue and process it
  const queueAudioTrack = (track: RemoteTrack) => {
    // Add to queue
    audioTrackQueueRef.current.push(track);
    console.log(
      `Added track to queue. Queue length: ${audioTrackQueueRef.current.length}`
    );

    // Process the next track if not already processing
    if (!isProcessingAudioRef.current) {
      processNextAudioTrack();
    }
  };

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
      console.log(
        "Participant connected:",
        Array.from(room.remoteParticipants.values())
      );
      updateRemoteParticipants();
    };

    const handleParticipantDisconnected = () => {
      updateRemoteParticipants();
    };

    // Handle remote track subscription
    const handleTrackSubscribed = (
      track: RemoteTrack,
      publication: RemoteTrackPublication,
      participant: RemoteParticipant
    ) => {
      console.log(
        "Track subscribed:",
        track.kind,
        "from participant:",
        participant.identity
      );

      // Only handle audio tracks
      if (track.kind === Track.Kind.Audio) {
        console.log("Audio track received, adding to queue");
        queueAudioTrack(track);
      }
    };

    // Handle track unsubscription
    const handleTrackUnsubscribed = (track: RemoteTrack) => {
      console.log("Track unsubscribed:", track.kind);
      if (track.kind === Track.Kind.Audio) {
        try {
          track.detach();
          console.log("Audio track detached");
        } catch (error) {
          console.error("Error detaching audio track:", error);
        }
      }
    };

    // Add all event listeners
    room.on(RoomEvent.Connected, handleConnected);
    room.on(RoomEvent.Disconnected, handleDisconnected);
    room.on(RoomEvent.ConnectionStateChanged, handleConnectionStateChanged);
    room.on(RoomEvent.ParticipantConnected, handleParticipantConnected);
    room.on(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);
    room.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);
    room.on(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed);

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
      room.off(RoomEvent.TrackSubscribed, handleTrackSubscribed);
      room.off(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed);

      // Clean up audio element
      if (audioElementRef.current) {
        document.body.removeChild(audioElementRef.current);
        audioElementRef.current = null;
      }
    };
  }, [room, updateRemoteParticipants]);

  // Toggle microphone state
  const toggleMicrophone = useCallback(async () => {
    if (!room || !room.localParticipant) return;

    try {
      const newState = !isMicrophoneEnabled;
      await room.localParticipant.setMicrophoneEnabled(newState);
      setIsMicrophoneEnabled(newState);
      console.log(`Microphone ${newState ? "enabled" : "disabled"}`);
    } catch (error) {
      console.error("Error toggling microphone:", error);
    }
  }, [room, isMicrophoneEnabled]);

  // After successful connection, enable microphone
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

        // Enable microphone after successful connection
        await room.localParticipant.setMicrophoneEnabled(true);
        setIsMicrophoneEnabled(true);
        console.log("Microphone enabled automatically after connection");
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
      isMicrophoneEnabled,
      toggleMicrophone,
    }),
    [
      room,
      isConnected,
      isConnecting,
      error,
      remoteParticipants,
      connect,
      disconnect,
      isMicrophoneEnabled,
      toggleMicrophone,
    ]
  );

  return (
    <LiveKitContext.Provider value={contextValue}>
      {children}
      <AudioDebugControls />
    </LiveKitContext.Provider>
  );
};
