// src/components/ui/FeatureCard.tsx
"use client";

import { useState } from "react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
  className = "",
}: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`rounded-2xl p-6 transition-all duration-300 ${
        isHovered ? "neumorph-pressed" : "neumorph-flat"
      } ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`w-14 h-14 rounded-xl mb-5 flex items-center justify-center transition-all duration-300 ${
          isHovered
            ? "bg-gradient-to-br from-purple-heart to-royal-blue text-white"
            : "bg-muted dark:bg-transparent neumorph-flat text-purple-heart"
        }`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
