"use client";

import { useState, useEffect, useRef } from "react";
import { useVoiceAssistant } from "@/app/providers/VoiceAssistantProvider";

export const useDashboardVoiceAssistant = () => {
  // Voice assistant state
  const [isMicActive, setIsMicActive] = useState(false);
  const {
    isConnected,
    isListening,
    isSpeaking,
    transcript,
    toggleMicrophone,
    disconnect,
  } = useVoiceAssistant();

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
    if (isConnected && isMicActive) {
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

    // Show listening feedback
    if (isListening && isConnected) {
      setToast({
        message: "Listening...",
        isVisible: true,
        type: "info",
      });

      return () => setToast((prev) => ({ ...prev, isVisible: false }));
    }
  }, [isConnected, isMicActive, isListening]);

  // Cleanup voice assistant connection on unmount
  useEffect(() => {
    return () => {
      if (isConnected) {
        disconnect();
        setIsMicActive(false);
      }
    };
  }, [isConnected, disconnect]);

  // Handle microphone toggle with proper error handling
  const handleMicrophoneToggle = async (isDragging: boolean) => {
    console.log("handleMicrophoneToggle", isDragging);

    if (isDragging) return;

    try {
      const newMicState = !isMicActive;
      console.log("Setting microphone state to:", newMicState);

      // Set state first (UI feedback)
      setIsMicActive(newMicState);

      // Toggle microphone with proper error handling
      console.log("Calling toggleMicrophone with:", newMicState);
      await toggleMicrophone(newMicState);

      console.log("After toggleMicrophone, isConnected:", isConnected);

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
    isConnected,
    isListening,
    isSpeaking,
    transcript: transcriptRef.current,
    showTranscript,
    toast,
    handleMicrophoneToggle,
  };
};
