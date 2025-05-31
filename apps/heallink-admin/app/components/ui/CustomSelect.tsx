"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { createPortal } from "react-dom";

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
  disabled = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !triggerRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Calculate dropdown position
  const calculatePosition = () => {
    if (!triggerRef.current) return { top: 0, left: 0, width: 0 };
    
    const rect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const dropdownHeight = Math.min(options.length * 40 + 16, 200); // Max height
    
    // Determine if dropdown should open upward or downward
    const openUpward = rect.bottom + dropdownHeight > viewportHeight && rect.top > dropdownHeight;
    
    return {
      top: openUpward ? rect.top - dropdownHeight - 4 : rect.bottom + 4,
      left: rect.left,
      width: rect.width,
      openUpward,
    };
  };

  const selectedOption = options.find(option => option.value === value);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const position = isOpen ? calculatePosition() : null;

  return (
    <>
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          relative flex items-center justify-between w-full px-3 py-2 
          border border-[color:var(--border)] rounded-lg 
          bg-[color:var(--background)] text-[color:var(--foreground)]
          focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)]
          transition-colors
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[color:var(--accent)]'}
          ${isOpen ? 'ring-2 ring-[color:var(--ring)]' : ''}
          ${className}
        `}
      >
        <span className={`truncate ${!selectedOption ? 'text-[color:var(--muted-foreground)]' : ''}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-[color:var(--muted-foreground)] transition-transform duration-200 flex-shrink-0 ml-2 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Portal */}
      {isOpen && position && createPortal(
        <div
          ref={dropdownRef}
          className="fixed z-50000 bg-[color:var(--card)] border border-[color:var(--border)] rounded-lg shadow-xl"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            width: `${position.width}px`,
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        >
          <div className="py-2">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionClick(option.value)}
                className={`
                  w-full flex items-center justify-between px-3 py-2 text-left
                  hover:bg-[color:var(--accent)] transition-colors
                  ${option.value === value ? 'bg-[color:var(--accent)] text-[color:var(--primary)]' : 'text-[color:var(--foreground)]'}
                `}
              >
                <span className="truncate">{option.label}</span>
                {option.value === value && (
                  <Check className="w-4 h-4 text-[color:var(--primary)] flex-shrink-0 ml-2" />
                )}
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}