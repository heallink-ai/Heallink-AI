"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../theme/ThemeProvider";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "compact" | "floating";
}

// Helper functions defined outside component
const getSizeClasses = (size: string) => {
  switch (size) {
    case "sm":
      return "w-8 h-8";
    case "lg":
      return "w-12 h-12";
    default:
      return "w-10 h-10";
  }
};

const getVariantClasses = (variant: string) => {
  switch (variant) {
    case "compact":
      return "border border-border bg-background/80 backdrop-blur-sm";
    case "floating":
      return "neumorph-card shadow-lg";
    default:
      return "neumorph-button";
  }
};

const getIconSize = (size: string) => {
  switch (size) {
    case "sm":
      return "w-4 h-4";
    case "lg":
      return "w-6 h-6";
    default:
      return "w-5 h-5";
  }
};

export default function ThemeToggle({
  className = "",
  size = "md",
  variant = "default",
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`
          ${getSizeClasses(size)} 
          ${getVariantClasses(variant)}
          ${className}
          animate-pulse bg-gray-200 dark:bg-gray-700 rounded-full
        `}
      />
    );
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className={`
        flex items-center justify-center rounded-full transition-all duration-300
        hover:scale-105 active:scale-95
        ${getSizeClasses(size)}
        ${getVariantClasses(variant)}
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-center"
      >
        {theme === "light" ? (
          <Moon
            className={`
              ${getIconSize(size)} 
              text-purple-heart transition-colors
            `}
          />
        ) : (
          <Sun
            className={`
              ${getIconSize(size)} 
              text-yellow-500 transition-colors
            `}
          />
        )}
      </motion.div>
    </motion.button>
  );
}