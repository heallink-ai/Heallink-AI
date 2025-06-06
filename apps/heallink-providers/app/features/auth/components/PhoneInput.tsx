"use client";

import { forwardRef, useState, useEffect } from "react";
import { Phone, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  error?: string;
  onValueChange?: (value: string) => void;
  onValidityChange?: (isValid: boolean) => void;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, label, error, onValueChange, onValidityChange, value, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
      // Simple phone validation (at least 10 digits)
      const phoneRegex = /^\+?[1-9]\d{9,14}$/;
      const valid = phoneRegex.test(String(value || '').replace(/\s/g, ''));
      setIsValid(valid);
      onValidityChange?.(valid);
    }, [value, onValidityChange]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onValueChange?.(e.target.value);
    };

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-[color:var(--muted-foreground)] mb-2">
          {label} {props.required && <span className="text-purple-heart">*</span>}
        </label>

        <div
          className={cn(
            "relative rounded-xl transition-all duration-300",
            focused ? "neumorph-input-purple ring-2 ring-purple-heart/40" : "neumorph-input",
            error && "ring-2 ring-red-500/40 border-red-500/40"
          )}
        >
          <div className="flex items-center">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--muted-foreground)]">
              <Phone className="w-5 h-5" />
            </div>

            <input
              ref={ref}
              type="tel"
              value={value}
              onChange={handleChange}
              className={cn(
                "w-full bg-transparent pl-11 pr-11 py-3.5 rounded-xl text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)] focus:outline-none",
                props.disabled && "opacity-50 cursor-not-allowed",
                className
              )}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              {...props}
            />

            {value && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {isValid ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <X className="w-5 h-5 text-red-500" />
                )}
              </div>
            )}
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";