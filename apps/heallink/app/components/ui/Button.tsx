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

  // Size classes
  const sizeClasses = {
    sm: "py-2 px-4 text-sm",
    md: "py-3 px-6 text-base",
    lg: "py-4 px-8 text-lg",
  }[size];

  // Improved variant classes with better contrast for light mode
  const variantClasses = {
    primary: `bg-gradient-to-r from-purple-heart to-royal-blue text-white ${
      isPressed ? "neumorph-pressed" : "neumorph-flat"
    }`,
    secondary: `bg-gradient-to-r from-royal-blue-500 to-royal-blue-800 text-white ${
      isPressed ? "neumorph-pressed" : "neumorph-flat"
    }`,
    outline: `border-2 border-purple-heart dark:text-white light:text-[color:var(--button-outline-text)] bg-transparent ${
      isPressed ? "neumorph-pressed" : "neumorph-flat"
    }`,
    ghost: `bg-transparent ${
      isPressed ? "bg-purple-heart/10" : "hover:bg-purple-heart/5"
    } dark:text-white light:text-[color:var(--button-outline-text)]`,
  }[variant];

  // Combined classes
  const classes = `${baseClasses} ${sizeClasses} ${variantClasses} ${className} ${
    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
  }`;

  // Handle press effect
  const handleMouseDown = () => {
    if (!disabled) setIsPressed(true);
  };

  const handleMouseUp = () => {
    if (!disabled) setIsPressed(false);
  };

  // Render as anchor if href is provided
  if (href) {
    return (
      <a
        href={href}
        className={classes}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => setIsPressed(false)}
      >
        {children}
      </a>
    );
  }

  // Render as button otherwise
  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setIsPressed(false)}
    >
      {children}
    </button>
  );
}
