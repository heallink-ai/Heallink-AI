"use client";

import { useState } from "react";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  icon?: React.ReactNode;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  type = "button",
  className = "",
  icon,
}: ButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const baseClasses = `
    inline-flex items-center justify-center gap-2 font-medium rounded-xl 
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--ring)]
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? "w-full" : ""}
    ${isPressed ? "scale-95" : ""}
  `;

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm", 
    lg: "px-6 py-3.5 text-base",
  };

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-purple-heart to-royal-blue text-white
      neumorph-button hover:from-purple-heart/90 hover:to-royal-blue/90
      shadow-lg hover:shadow-xl
    `,
    secondary: `
      bg-[color:var(--secondary)] text-white
      neumorph-button hover:bg-[color:var(--secondary)]/90
    `,
    outline: `
      border-2 border-[color:var(--border)] bg-transparent text-[color:var(--foreground)]
      neumorph-flat hover:bg-[color:var(--muted)]
    `,
    ghost: `
      bg-transparent text-[color:var(--foreground)]
      hover:bg-[color:var(--muted)]
    `,
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}