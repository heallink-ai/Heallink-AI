"use client";

import { useState, useEffect, useRef } from "react";
import { useVoiceAssistant } from "@/app/providers/VoiceAssistantProvider";
import { useLiveKit } from "@/app/providers/LiveKitProvider";
import { v4 as uuidv4 } from "uuid";

export const useDashboardVoiceAssistant = () => {
  // Voice assistant state
  const [isMicActive, setIsMicActive] = useState(false);
  const {
    isConnected: isVoiceAssistantConnected,
    isListening,
    isSpeaking,
    transcript,
    toggleMicrophone,
    disconnect: disconnectVoiceAssistant,
  } = useVoiceAssistant();

  // LiveKit integration
  const {
    isConnected: isLiveKitConnected,
    isConnecting: isLiveKitConnecting,
    connect: connectToLiveKit,
    disconnect: disconnectFromLiveKit,
  } = useLiveKit();

  // Toast notification state
  const [toast, setToast] = useState({
    message: "",
    isVisible: false,
    type: "info" as "info" | "success" | "error",
  });

  // Store the voice transcript in a ref for UI display
  const transcriptRef = useRef("");
  const [showTranscript, setShowTranscript] = useState(false);
  const [transcriptTimeout, setTranscriptTimeout] =
    useState<NodeJS.Timeout | null>(null);

  // Generate a unique room name for this user's session
  const roomNameRef = useRef<string>(`voice-assistant-${uuidv4()}`);

  // Update transcript and handle visibility
  useEffect(() => {
    if (transcript && transcript !== transcriptRef.current) {
      transcriptRef.current = transcript;
      setShowTranscript(true);

      // Clear any existing timeout
      if (transcriptTimeout) {
        clearTimeout(transcriptTimeout);
      }

      // Hide transcript after 5 seconds of inactivity
      const timeout = setTimeout(() => {
        setShowTranscript(false);
      }, 5000);

      setTranscriptTimeout(timeout);
    }

    // Cleanup on unmount
    return () => {
      if (transcriptTimeout) {
        clearTimeout(transcriptTimeout);
      }
    };
  }, [transcript, transcriptTimeout]);

  // Show toast notification based on connection state
  useEffect(() => {
    if ((isVoiceAssistantConnected || isLiveKitConnected) && isMicActive) {
      setToast({
        message: "Connected to AI Assistant",
        isVisible: true,
        type: "success",
      });

      // Hide toast after 3 seconds
      const timeout = setTimeout(() => {
        setToast((prev) => ({ ...prev, isVisible: false }));
      }, 3000);

      return () => clearTimeout(timeout);
    }

    // Show connecting feedback
    if (isLiveKitConnecting) {
      setToast({
        message: "Connecting...",
        isVisible: true,
        type: "info",
      });

      return () => {};
    }

    // Show listening feedback
    if (isListening && isVoiceAssistantConnected) {
      setToast({
        message: "Listening...",
        isVisible: true,
        type: "info",
      });

      return () => setToast((prev) => ({ ...prev, isVisible: false }));
    }
  }, [
    isVoiceAssistantConnected,
    isLiveKitConnected,
    isLiveKitConnecting,
    isMicActive,
    isListening,
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
  const handleMicrophoneToggle = async (isDragging: boolean) => {
    console.log("handleMicrophoneToggle", isDragging);

    if (isDragging) return;

    try {
      const newMicState = !isMicActive;
      console.log("Setting microphone state to:", newMicState);

      // Set state first (UI feedback)
      setIsMicActive(newMicState);

      if (newMicState) {
        // Connect to LiveKit room when activating microphone
        await connectToLiveKit(roomNameRef.current);
        console.log("Connected to LiveKit room:", roomNameRef.current);
      } else {
        // Disconnect from LiveKit room when deactivating microphone
        disconnectFromLiveKit();
        console.log("Disconnected from LiveKit room");
      }

      // Toggle original voice assistant as well
      console.log("Calling toggleMicrophone with:", newMicState);
      await toggleMicrophone(newMicState);

      console.log(
        "After toggleMicrophone, isConnected:",
        isVoiceAssistantConnected
      );

      if (!newMicState) {
        setToast({
          message: "AI Assistant disconnected",
          isVisible: true,
          type: "info",
        });

        // Hide toast after 3 seconds
        setTimeout(() => {
          setToast((prev) => ({ ...prev, isVisible: false }));
        }, 3000);
      }
    } catch (error) {
      console.error("Failed to toggle microphone:", error);

      // Reset mic state on error
      setIsMicActive(false);

      setToast({
        message: "Failed to connect to AI Assistant",
        isVisible: true,
        type: "error",
      });

      // Hide toast after 3 seconds
      setTimeout(() => {
        setToast((prev) => ({ ...prev, isVisible: false }));
      }, 3000);
    }
  };

  return {
    isMicActive,
    isConnected: isVoiceAssistantConnected || isLiveKitConnected,
    isListening,
    isSpeaking,
    transcript: transcriptRef.current,
    showTranscript,
    toast,
    handleMicrophoneToggle,
  };
};
