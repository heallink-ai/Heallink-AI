"use client";

import React, { SelectHTMLAttributes } from 'react';
import { useTheme } from '@/app/theme/ThemeProvider';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label: string;
  id: string;
  options: SelectOption[];
  error?: string;
  helper?: string;
  size?: 'default' | 'sm' | 'lg';
}

export const SelectField = ({
  label,
  id,
  options,
  error,
  helper,
  size = 'default',
  className = '',
  ...props
}: SelectFieldProps) => {
  const { theme } = useTheme();
  
  // Determine neumorphic style based on theme
  const neumorphicStyle = theme === 'dark' 
    ? 'bg-transparent shadow-[inset_4px_4px_8px_#0d0d0d,_inset_-4px_-4px_8px_#2a2a2a] focus-within:shadow-[inset_2px_2px_4px_#0d0d0d,_inset_-2px_-2px_4px_#2a2a2a]' 
    : 'bg-transparent shadow-[inset_4px_4px_8px_#d0d0d0,_inset_-4px_-4px_8px_#ffffff] focus-within:shadow-[inset_2px_2px_4px_#d0d0d0,_inset_-2px_-2px_4px_#ffffff]';

  // Determine padding based on size
  const paddingClass = size === 'sm' 
    ? 'px-3 py-1.5' 
    : size === 'lg' 
      ? 'px-5 py-4' 
      : 'px-4 py-3';

  return (
    <div className="w-full space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      
      <div className={`relative flex items-center rounded-lg ${neumorphicStyle}`}>
        <select
          id={id}
          className={`w-full appearance-none rounded-lg bg-transparent ${paddingClass} transition focus:outline-none ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
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
            className="text-muted-foreground"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
      
      {(error || helper) && (
        <p className={`text-xs ${error ? 'text-red-500' : 'text-muted-foreground'}`}>
          {error || helper}
        </p>
      )}
    </div>
  );
};