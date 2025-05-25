"use client";

import { motion } from "framer-motion";
import { FloatingButtonPosition } from "../types";

interface VoiceAssistantButtonProps {
  isMicActive: boolean;
  isSpeaking: boolean;
  floatingBtnPosition: FloatingButtonPosition;
  setFloatingBtnPosition: (position: FloatingButtonPosition) => void;
  handleMicrophoneToggle: (isDragging: boolean) => void;
  setIsDragging: (isDragging: boolean) => void;
}

const VoiceAssistantButton = ({
  isMicActive,
  isSpeaking,
  floatingBtnPosition,
  setFloatingBtnPosition,
  handleMicrophoneToggle,
  setIsDragging,
}: VoiceAssistantButtonProps) => {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        x: floatingBtnPosition.x,
        y: floatingBtnPosition.y,
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 1.2,
      }}
      drag
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(e, info) => {
        setIsDragging(false);
        setFloatingBtnPosition((prev) => ({
          x: prev.x + info.offset.x,
          y: prev.y + info.offset.y,
        }));
      }}
      onClick={() => handleMicrophoneToggle(false)}
      className={`voice-assistant-button ${
        isMicActive
          ? "bg-red-500 gradient-pulse"
          : "bg-gradient-to-tr from-purple-heart to-royal-blue"
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {isSpeaking ? (
        // Sound wave animation when assistant is speaking
        <div className="sound-wave-container">
          <span className="sound-wave-bar animate-sound-wave-1"></span>
          <span className="sound-wave-bar animate-sound-wave-2"></span>
          <span className="sound-wave-bar animate-sound-wave-3"></span>
        </div>
      ) : isMicActive ? (
        // Stop icon when microphone is active
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="6" y="6" width="12" height="12" rx="2" ry="2" />
        </svg>
      ) : (
        // Mic icon when inactive
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2c1.7 0 3 1.3 3 3v9c0 1.7-1.3 3-3 3s-3-1.3-3-3V5c0-1.7 1.3-3 3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" x2="12" y1="19" y2="22" />
        </svg>
      )}
    </motion.button>
  );
};

export default VoiceAssistantButton;