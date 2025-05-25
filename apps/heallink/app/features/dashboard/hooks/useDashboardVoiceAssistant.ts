"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useVoiceAssistant } from "@/app/providers/VoiceAssistantProvider";
import { useLiveKit } from "@/app/providers/LiveKitProvider";
import { v4 as uuidv4 } from "uuid";

export type ToastType = "info" | "success" | "error";

export interface VoiceAssistantToast {
  message: string;
  isVisible: boolean;
  type: ToastType;
}

export const useDashboardVoiceAssistant = () => {
  // Voice assistant state
  const [isMicActive, setIsMicActive] = useState(false);

  // Voice assistant context
  const voiceAssistant = useVoiceAssistant();
  const {
    isConnected: isVoiceAssistantConnected,
    isListening,
    isSpeaking,
    transcript,
    toggleMicrophone,
    disconnect: disconnectVoiceAssistant,
  } = voiceAssistant;

  // LiveKit integration
  const liveKit = useLiveKit();
  const {
    isConnected: isLiveKitConnected,
    isConnecting: isLiveKitConnecting,
    connect: connectToLiveKit,
    disconnect: disconnectFromLiveKit,
  } = liveKit;

  // Toast notification state
  const [toast, setToast] = useState<VoiceAssistantToast>({
    message: "",
    isVisible: false,
    type: "info",
  });

  // Store the voice transcript in a ref for UI display
  const transcriptRef = useRef("");
  const [showTranscript, setShowTranscript] = useState(false);
  const transcriptTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Generate a unique room name for this user's session - memoized to stay consistent
  const roomName = useMemo(() => `voice-assistant-${uuidv4()}`, []);

  // Show toast with auto-hide
  const showToastMessage = useCallback(
    (message: string, type: ToastType = "info", duration = 3000) => {
      setToast({
        message,
        isVisible: true,
        type,
      });

      // Auto-hide after specified duration
      const timeout = setTimeout(() => {
        setToast((prev) => ({ ...prev, isVisible: false }));
      }, duration);

      return () => clearTimeout(timeout);
    },
    []
  );

  // Update transcript and handle visibility
  useEffect(() => {
    if (transcript && transcript !== transcriptRef.current) {
      transcriptRef.current = transcript;
      setShowTranscript(true);

      // Clear any existing timeout
      if (transcriptTimeoutRef.current) {
        clearTimeout(transcriptTimeoutRef.current);
      }

      // Hide transcript after 5 seconds of inactivity
      transcriptTimeoutRef.current = setTimeout(() => {
        setShowTranscript(false);
      }, 5000);
    }

    // Cleanup on unmount
    return () => {
      if (transcriptTimeoutRef.current) {
        clearTimeout(transcriptTimeoutRef.current);
      }
    };
  }, [transcript]);

  // Show toast notification based on connection state
  useEffect(() => {
    if ((isVoiceAssistantConnected || isLiveKitConnected) && isMicActive) {
      return showToastMessage("Connected to AI Assistant", "success");
    }

    // Show connecting feedback
    if (isLiveKitConnecting) {
      return showToastMessage("Connecting...", "info");
    }

    // Show listening feedback
    if (isListening && isVoiceAssistantConnected) {
      return showToastMessage("Listening...", "info");
    }

    return undefined;
  }, [
    isVoiceAssistantConnected,
    isLiveKitConnected,
    isLiveKitConnecting,
    isMicActive,
    isListening,
    showToastMessage,
  ]);

  // Cleanup voice assistant connection on unmount
  useEffect(() => {
    return () => {
      if (isVoiceAssistantConnected) {
        disconnectVoiceAssistant();
        setIsMicActive(false);
      }
      if (isLiveKitConnected) {
        disconnectFromLiveKit();
      }
    };
  }, [
    isVoiceAssistantConnected,
    isLiveKitConnected,
    disconnectVoiceAssistant,
    disconnectFromLiveKit,
  ]);

  // Handle microphone toggle with proper error handling
  const handleMicrophoneToggle = useCallback(
    async (isDragging: boolean) => {
      if (isDragging) return;

      try {
        const newMicState = !isMicActive;

        // Set state first (UI feedback)
        setIsMicActive(newMicState);

        if (newMicState) {
          // Connect to LiveKit room when activating microphone
          await connectToLiveKit(roomName);
        } else {
          // Disconnect from LiveKit room when deactivating microphone
          disconnectFromLiveKit();
          showToastMessage("AI Assistant disconnected", "info");
        }

        // Toggle original voice assistant as well
        await toggleMicrophone(newMicState);
      } catch (error) {
        // Reset mic state on error
        setIsMicActive(false);
        showToastMessage("Failed to connect to AI Assistant", "error");
      }
    },
    [
      isMicActive,
      connectToLiveKit,
      disconnectFromLiveKit,
      toggleMicrophone,
      roomName,
      showToastMessage,
    ]
  );

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(
    () => ({
      isMicActive,
      isConnected: isVoiceAssistantConnected || isLiveKitConnected,
      isListening,
      isSpeaking,
      transcript: transcriptRef.current,
      showTranscript,
      toast,
      handleMicrophoneToggle,
    }),
    [
      isMicActive,
      isVoiceAssistantConnected,
      isLiveKitConnected,
      isListening,
      isSpeaking,
      showTranscript,
      toast,
      handleMicrophoneToggle,
    ]
  );
};
