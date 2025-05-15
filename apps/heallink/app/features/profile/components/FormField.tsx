"use client";

import React, { InputHTMLAttributes } from "react";
import { useTheme } from "@/app/theme/ThemeProvider";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  helper?: string;
  isVerified?: boolean;
}

export const FormField = ({
  label,
  id,
  error,
  helper,
  isVerified,
  className = "",
  ...props
}: FormFieldProps) => {
  const { theme } = useTheme();

  // Determine neumorphic style based on theme
  const neumorphicStyle =
    theme === "dark"
      ? "bg-transparent shadow-[inset_4px_4px_8px_#0d0d0d,_inset_-4px_-4px_8px_#2a2a2a] focus-within:shadow-[inset_2px_2px_4px_#0d0d0d,_inset_-2px_-2px_4px_#2a2a2a]"
      : "bg-transparent shadow-[inset_4px_4px_8px_#d0d0d0,_inset_-4px_-4px_8px_#ffffff] focus-within:shadow-[inset_2px_2px_4px_#d0d0d0,_inset_-2px_-2px_4px_#ffffff]";

  return (
    <div className="w-full space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
        {isVerified !== undefined && (
          <span
            className={`ml-2 text-xs ${isVerified ? "text-green-500" : "text-amber-500"}`}
          >
            {isVerified ? "(Verified)" : "(Not Verified)"}
          </span>
        )}
      </label>

      <div
        className={`relative flex items-center rounded-lg ${neumorphicStyle}`}
      >
        <input
          id={id}
          className={`w-full rounded-lg bg-transparent px-4 py-3 transition focus:outline-none ${className}`}
          {...props}
        />

        {isVerified !== undefined && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isVerified ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-500"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-amber-500"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            )}
          </div>
        )}
      </div>

      {(error || helper) && (
        <p
          className={`text-xs ${error ? "text-red-500" : "text-muted-foreground"}`}
        >
          {error || helper}
        </p>
      )}
    </div>
  );
};
