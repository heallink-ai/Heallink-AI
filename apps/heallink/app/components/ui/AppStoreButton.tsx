// src/components/ui/AppStoreButtons.tsx
"use client";

import { useState } from "react";
import { useTheme } from "@/app/theme/ThemeProvider";
import { motion } from "framer-motion";

export default function AppStoreButtons({
  className = "",
}: {
  className?: string;
}) {
  const [pressedButton, setPressedButton] = useState<string | null>(null);
  const { theme } = useTheme();

  // Get button style classes based on theme
  const getButtonStyles = (buttonName: string) => {
    const isPressed = pressedButton === buttonName;

    const baseClasses =
      "flex items-center gap-2 rounded-xl px-4 sm:px-6 py-3 transition-all w-full sm:w-auto";
    const shadowClasses = isPressed ? "neumorph-pressed" : "neumorph-flat";

    // Light theme needs a solid background for contrast
    if (theme === "light") {
      return `${baseClasses} ${shadowClasses} bg-gradient-to-r from-purple-heart to-royal-blue text-white`;
    } else {
      return `${baseClasses} ${shadowClasses} bg-gradient-to-r from-purple-heart/80 to-royal-blue/80 text-white`;
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
    tap: {
      scale: 0.95,
      boxShadow:
        "0 5px 10px -3px rgba(0, 0, 0, 0.1), 0 2px 3px -2px rgba(0, 0, 0, 0.05)",
    },
  };

  return (
    <div className={`flex flex-col xs:flex-row gap-4 w-full ${className}`}>
      {/* App Store Button */}
      <motion.a
        href="#"
        className={getButtonStyles("apple")}
        onMouseDown={() => setPressedButton("apple")}
        onMouseUp={() => setPressedButton(null)}
        onMouseLeave={() => setPressedButton(null)}
        target="_blank"
        rel="noopener noreferrer"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 384 512"
          className="text-white fill-current flex-shrink-0"
        >
          <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
        </svg>
        <div className="text-left">
          <div className="text-xs text-white/80">Download on the</div>
          <div className="text-sm font-semibold text-white">App Store</div>
        </div>
      </motion.a>

      {/* Play Store Button */}
      <motion.a
        href="#"
        className={getButtonStyles("google")}
        onMouseDown={() => setPressedButton("google")}
        onMouseUp={() => setPressedButton(null)}
        onMouseLeave={() => setPressedButton(null)}
        target="_blank"
        rel="noopener noreferrer"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 512 512"
          className="text-white fill-current flex-shrink-0"
        >
          <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
        </svg>
        <div className="text-left">
          <div className="text-xs text-white/80">GET IT ON</div>
          <div className="text-sm font-semibold text-white">Google Play</div>
        </div>
      </motion.a>
    </div>
  );
}
