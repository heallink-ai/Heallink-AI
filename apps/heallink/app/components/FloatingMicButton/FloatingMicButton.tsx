"use client";

import React, { useState, useEffect, useRef } from "react";
import { useDrag } from "react-use-gesture";
import styles from "./FloatingMicButton.module.css";

interface FloatingMicButtonProps {
  onMicToggle: (isActive: boolean) => void;
  isConnected: boolean;
  isListening: boolean;
  isSpeaking: boolean;
}

const FloatingMicButton: React.FC<FloatingMicButtonProps> = ({
  onMicToggle,
  isConnected,
  isListening,
  isSpeaking,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);

  // Set initial position to bottom right when the component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      setPosition({
        x: window.innerWidth - 80,
        y: window.innerHeight - 160,
      });
    }
  }, []);

  // Make the button draggable
  const bind = useDrag(({ offset: [x, y] }) => {
    setPosition({ x, y });
  });

  const handleMicToggle = () => {
    const newState = !isActive;
    setIsActive(newState);
    onMicToggle(newState);
  };

  // Generate classes based on state
  const getButtonClasses = () => {
    let classes = styles.floatingMicButton;

    if (isActive) classes += ` ${styles.active}`;
    if (isListening) classes += ` ${styles.listening}`;
    if (isSpeaking) classes += ` ${styles.speaking}`;

    return classes;
  };

  return (
    <div
      ref={buttonRef}
      className={styles.floatingButtonContainer}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      {...bind()}
    >
      <button
        className={getButtonClasses()}
        onClick={handleMicToggle}
        disabled={!isConnected}
        aria-label={
          isActive ? "Disable voice assistant" : "Enable voice assistant"
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" x2="12" y1="19" y2="22" />
        </svg>
      </button>
      {isSpeaking && (
        <div className={styles.soundWaves}>
          <div className={styles.wave}></div>
          <div className={styles.wave}></div>
          <div className={styles.wave}></div>
        </div>
      )}
      {isActive && isConnected && (
        <div className={styles.statusIndicator}>
          {isSpeaking ? "Speaking..." : isListening ? "Listening..." : "Ready"}
        </div>
      )}
    </div>
  );
};

export default FloatingMicButton;
