"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ className, type, label, error, icon, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword ? (passwordVisible ? "text" : "password") : type;

    return (
      <div className="mb-4">
        <label
          className="block text-sm font-medium text-[color:var(--muted-foreground)] mb-2"
        >
          {label} {props.required && <span className="text-purple-heart">*</span>}
        </label>

        <div
          className={cn(
            "relative rounded-xl transition-all duration-300 neumorph-input",
            focused && "ring-2 ring-purple-heart/30 shadow-[inset_6px_6px_12px_#e6eaf6,_inset_-6px_-6px_12px_#ffffff] dark:shadow-[inset_6px_6px_12px_#0f1222,_inset_-6px_-6px_12px_#1f2545]",
            error && "ring-2 ring-red-500/30"
          )}
        >
          <div className="flex items-center">
            {icon && (
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--muted-foreground)]">
                {icon}
              </div>
            )}

            <input
              type={inputType}
              className={cn(
                "w-full bg-transparent px-4 py-3.5 rounded-xl text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)] focus:outline-none",
                icon && "pl-11",
                isPassword && "pr-11",
                props.disabled && "opacity-50 cursor-not-allowed",
                className
              )}
              ref={ref}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              {...props}
            />

            {isPassword && (
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors"
              >
                {passwordVisible ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
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

InputField.displayName = "InputField";