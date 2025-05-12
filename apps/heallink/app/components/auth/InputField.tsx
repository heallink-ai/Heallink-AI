"use client";

import { useState } from "react";

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: React.ReactNode;
  autoComplete?: string;
}

export default function InputField({
  id,
  label,
  type,
  placeholder,
  required = false,
  value,
  onChange,
  error,
  icon,
  autoComplete,
}: InputFieldProps) {
  const [focused, setFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword ? (passwordVisible ? "text" : "password") : type;

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium light-text-contrast mb-2">
        {label} {required && <span className="text-royal-blue">*</span>}
      </label>
      
      <div className={`relative rounded-xl transition-all duration-300 ${
        focused 
          ? "neumorph-pressed" 
          : "neumorph-flat hover:shadow-md"
      }`}>
        <div className="flex items-center">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          
          <input
            id={id}
            type={inputType}
            placeholder={placeholder}
            required={required}
            value={value}
            onChange={onChange}
            autoComplete={autoComplete}
            className={`w-full bg-transparent px-4 py-3.5 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none ${
              icon ? "pl-11" : ""
            } ${isPassword ? "pr-11" : ""}`}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          
          {isPassword && (
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {passwordVisible ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}