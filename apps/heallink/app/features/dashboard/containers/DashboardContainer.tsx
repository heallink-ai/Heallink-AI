"use client";

import { useState, useEffect } from "react";

// Hooks
import { useDashboardVoiceAssistant } from "../hooks/useDashboardVoiceAssistant";
import { useFloatingButton } from "../hooks/useFloatingButton";
import { useLoading } from "../hooks/useLoading";

// Components
import DashboardPresentation from "../components/DashboardPresentation";

// Services
import { getUserData } from "../services/mockData";

const DashboardContainer = () => {
  // State for sidebar toggle on mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Voice assistant hooks
  const {
    isMicActive,
    isConnected,
    isListening,
    isSpeaking,
    transcript,
    showTranscript,
    toast,
    handleMicrophoneToggle,
  } = useDashboardVoiceAssistant();

  // Floating button hooks
  const {
    floatingBtnPosition,
    setFloatingBtnPosition,
    isDragging,
    setIsDragging,
  } = useFloatingButton();

  // Loading state
  const loading = useLoading(1500);

  // Add AI Engine URL debugging
  useEffect(() => {
    console.log("AI Engine URL:", process.env.NEXT_PUBLIC_AI_ENGINE_URL);
  }, []);

  // Get user data - in a real app this would be fetched from an API
  const userData = getUserData();

  return (
    <DashboardPresentation
      userData={userData}
      loading={loading}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      isMicActive={isMicActive}
      isConnected={isConnected}
      isListening={isListening}
      isSpeaking={isSpeaking}
      transcript={transcript}
      showTranscript={showTranscript}
      toast={toast}
      floatingBtnPosition={floatingBtnPosition}
      setFloatingBtnPosition={setFloatingBtnPosition}
      handleMicrophoneToggle={handleMicrophoneToggle}
      setIsDragging={setIsDragging}
    />
  );
};

export default DashboardContainer;