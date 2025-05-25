"use client";

import { useState, useEffect } from "react";
import { FloatingButtonPosition } from "../types";

export const useFloatingButton = () => {
  const [floatingBtnPosition, setFloatingBtnPosition] = useState<FloatingButtonPosition>({
    x: 0,
    y: 0,
  });
  const [isDragging, setIsDragging] = useState(false);

  // Load saved position on component mount
  useEffect(() => {
    try {
      const savedPosition = localStorage.getItem("floatingBtnPosition");
      if (savedPosition) {
        setFloatingBtnPosition(JSON.parse(savedPosition));
      }
    } catch (error) {
      console.error("Error loading button position:", error);
    }
  }, []);

  // Save position to localStorage when it changes
  useEffect(() => {
    if (floatingBtnPosition.x !== 0 || floatingBtnPosition.y !== 0) {
      try {
        localStorage.setItem(
          "floatingBtnPosition",
          JSON.stringify(floatingBtnPosition)
        );
      } catch (error) {
        console.error("Error saving button position:", error);
      }
    }
  }, [floatingBtnPosition]);

  return {
    floatingBtnPosition,
    setFloatingBtnPosition,
    isDragging,
    setIsDragging,
  };
};