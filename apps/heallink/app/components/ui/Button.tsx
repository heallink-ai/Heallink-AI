// src/components/ui/Button.tsx
"use client";

import { useState } from "react";
import { useTheme } from "@/app/theme/ThemeProvider";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  href?: string;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  href,
  type = "button",
}: ButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const { theme } = useTheme();

  const baseClasses =
    "relative rounded-xl font-medium transition-all duration-200 focus:outline-none flex items-center justify-center";

  const sizeClasses = {
    sm: "py-2 px-4 text-sm",
    md: "py-3 px-6 text-base",
    lg: "py-4 px-8 text-lg",
  }[size];

  const getVariantClasses = () => {
    const isDark = theme === "dark";

    switch (variant) {
      case "primary":
        return `${
          isDark
            ? "bg-gradient-to-r from-purple-heart to-royal-blue"
            : "bg-gradient-to-r from-purple-600 to-blue-700"
        } text-white ${isPressed ? "shadow-inner" : "shadow-md"}`;

      case "secondary":
        return `${
          isDark
            ? "bg-gradient-to-r from-royal-blue-500 to-royal-blue-800"
            : "bg-gradient-to-r from-blue-600 to-blue-800"
        } text-white ${isPressed ? "shadow-inner" : "shadow-md"}`;

      case "outline":
        return `border-2 border-purple-heart ${
          isDark ? "text-white" : "text-purple-800"
        } bg-transparent ${isPressed ? "shadow-inner" : "shadow-sm"}`;

      case "ghost":
        return `bg-transparent ${
          isPressed ? "bg-purple-600/10" : "hover:bg-purple-600/5"
        } ${isDark ? "text-white" : "text-purple-800"}`;

      default:
        return "";
    }
  };

  const classes = `${baseClasses} ${sizeClasses} ${getVariantClasses()} ${className} ${
    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
  }`;

  const handleMouseDown = () => {
    if (!disabled) setIsPressed(true);
  };

  const handleMouseUp = () => {
    if (!disabled) setIsPressed(false);
  };

  const handleMouseLeave = () => {
    setIsPressed(false);
  };

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  );
}
