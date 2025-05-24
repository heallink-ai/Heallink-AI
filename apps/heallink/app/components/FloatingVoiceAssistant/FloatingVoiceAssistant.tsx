"use client";

import React from "react";
import dynamic from "next/dynamic";
import { VoiceAssistantProvider } from "../../providers/VoiceAssistantProvider";

// Dynamically import the FloatingMicButton to ensure it only loads on the client-side
// This is important because it uses browser APIs
const FloatingMicButton = dynamic(() => import("../FloatingMicButton"), {
  ssr: false,
});

export default function FloatingVoiceAssistant() {
  return (
    <VoiceAssistantProvider>
      <FloatingVoiceAssistantContent />
    </VoiceAssistantProvider>
  );
}

function FloatingVoiceAssistantContent() {
  // Access the voice assistant context
  const { isConnected, isListening, isSpeaking, toggleMicrophone } =
    useVoiceAssistant();

  const handleMicToggle = (isActive: boolean) => {
    toggleMicrophone(isActive);
  };

  return (
    <FloatingMicButton
      onMicToggle={handleMicToggle}
      isConnected={isConnected}
      isListening={isListening}
      isSpeaking={isSpeaking}
    />
  );
}

// Import useVoiceAssistant inside the client component to avoid SSR issues
import { useVoiceAssistant } from "../../providers/VoiceAssistantProvider";
