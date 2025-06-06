"use client";

import { useState, useEffect } from "react";

interface PhoneInputProps {
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  onValidityChange?: (isValid: boolean) => void;
  error?: string;
  disabled?: boolean;
}

export default function PhoneInput({
  id,
  label,
  placeholder,
  required = false,
  value,
  onChange,
  onValidityChange,
  error,
  disabled = false,
}: PhoneInputProps) {
  const [focused, setFocused] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Simple phone validation (at least 10 digits)
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    const valid = phoneRegex.test(value.replace(/\s/g, ''));
    setIsValid(valid);
    onValidityChange?.(valid);
  }, [value, onValidityChange]);

  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-[color:var(--muted-foreground)] mb-2"
      >
        {label} {required && <span className="text-purple-heart">*</span>}
      </label>

      <div
        className={`relative rounded-xl transition-all duration-300 neumorph-input ${
          focused
            ? "ring-2 ring-purple-heart/30 shadow-[inset_6px_6px_12px_#e6eaf6,_inset_-6px_-6px_12px_#ffffff] dark:shadow-[inset_6px_6px_12px_#0f1222,_inset_-6px_-6px_12px_#1f2545]"
            : ""
        } ${error ? "ring-2 ring-red-500/30" : ""}`}
      >
        <div className="flex items-center">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--muted-foreground)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
              />
            </svg>
          </div>

          <input
            id={id}
            type="tel"
            placeholder={placeholder}
            required={required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={`w-full bg-transparent pl-11 pr-11 py-3.5 rounded-xl text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)] focus:outline-none ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />

          {value && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {isValid ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-green-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-red-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}