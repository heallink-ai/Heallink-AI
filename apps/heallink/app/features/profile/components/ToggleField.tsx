"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/app/theme/ThemeProvider';

interface ToggleFieldProps {
  label: string;
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const ToggleField = ({
  label,
  id,
  checked,
  onChange,
  disabled = false,
}: ToggleFieldProps) => {
  const { theme } = useTheme();
  
  // Determine neumorphic style based on theme
  const neumorphicTrackStyle = theme === 'dark' 
    ? 'shadow-[inset_2px_2px_4px_#0d0d0d,_inset_-2px_-2px_4px_#2a2a2a]' 
    : 'shadow-[inset_2px_2px_4px_#d0d0d0,_inset_-2px_-2px_4px_#ffffff]';
  
  const neumorphicThumbStyle = theme === 'dark' 
    ? 'shadow-[2px_2px_4px_#0d0d0d,_-2px_-2px_4px_#2a2a2a]' 
    : 'shadow-[2px_2px_4px_#d0d0d0,_-2px_-2px_4px_#ffffff]';

  const handleToggleChange = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-center gap-3 ${disabled ? 'opacity-50' : ''}`}
    >
      <div
        className={`relative h-6 w-11 rounded-full ${neumorphicTrackStyle} ${
          checked ? 'bg-primary/20' : 'bg-muted'
        }`}
        onClick={handleToggleChange}
      >
        <motion.div
          className={`absolute top-1 h-4 w-4 rounded-full ${neumorphicThumbStyle} ${
            checked ? 'bg-primary' : 'bg-muted-foreground/30'
          }`}
          animate={{ left: checked ? '1.375rem' : '0.375rem' }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={() => onChange(!checked)}
          disabled={disabled}
          className="sr-only"
        />
      </div>
      <span className="text-sm">{label}</span>
    </label>
  );
};