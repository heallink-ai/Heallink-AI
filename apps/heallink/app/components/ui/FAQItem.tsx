// src/components/ui/FAQItem.tsx
"use client";

import { useState } from "react";

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen?: boolean;
  toggleOpen?: () => void;
  className?: string;
}

export default function FAQItem({
  question,
  answer,
  isOpen = false,
  toggleOpen,
  className = "",
}: FAQItemProps) {
  const [isLocalOpen, setIsLocalOpen] = useState(isOpen);

  const handleToggle = () => {
    if (toggleOpen) {
      toggleOpen();
    } else {
      setIsLocalOpen(!isLocalOpen);
    }
  };

  const open = toggleOpen ? isOpen : isLocalOpen;

  return (
    <div
      className={`rounded-2xl overflow-hidden transition-all duration-300 neumorph-flat ${className}`}
    >
      <button
        className="w-full text-left p-6 flex justify-between items-center focus:outline-none"
        onClick={handleToggle}
      >
        <h3 className="text-lg font-medium pr-8">{question}</h3>
        <div
          className={`transition-transform duration-300 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="text-purple-heart"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="p-6 pt-0 text-gray-600 dark:text-gray-300">
          {answer}
        </div>
      </div>
    </div>
  );
}
