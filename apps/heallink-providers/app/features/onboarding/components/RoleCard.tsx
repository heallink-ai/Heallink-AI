"use client";

import { motion } from "framer-motion";
import { Check, Plus } from "lucide-react";
import { useState } from "react";

interface RoleCardProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  delay?: number;
  disabled?: boolean;
}

export default function RoleCard({
  id,
  name,
  description,
  icon,
  isSelected,
  onSelect,
  delay = 0,
  disabled = false,
}: RoleCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      className={`
        relative w-full p-6 rounded-2xl border transition-all duration-300 text-left
        ${
          isSelected
            ? "border-purple-heart bg-gradient-to-br from-purple-heart/10 to-royal-blue/10 shadow-lg"
            : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-heart/50 hover:shadow-md"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
      onClick={() => !disabled && onSelect(id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={!disabled ? { y: -5 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      disabled={disabled}
    >
      {/* Selection Indicator */}
      <motion.div
        className={`
          absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center
          ${
            isSelected
              ? "border-purple-heart bg-purple-heart"
              : "border-gray-300 dark:border-gray-600"
          }
        `}
        initial={false}
        animate={{
          scale: isSelected ? [1, 1.2, 1] : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Check className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Icon */}
      <motion.div
        className="mb-4"
        animate={{
          rotate: isHovered ? [0, -10, 10, 0] : 0,
        }}
        transition={{ duration: 0.5 }}
      >
        <div
          className={`
            text-4xl w-16 h-16 rounded-xl flex items-center justify-center
            ${
              isSelected
                ? "bg-gradient-to-br from-purple-heart to-royal-blue shadow-lg"
                : "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800"
            }
          `}
        >
          <span
            className={
              isSelected ? "text-white" : "text-gray-600 dark:text-gray-300"
            }
          >
            {icon}
          </span>
        </div>
      </motion.div>

      {/* Content */}
      <div className="space-y-2">
        <h3
          className={`
            font-bold text-lg
            ${
              isSelected
                ? "text-purple-heart"
                : "text-gray-800 dark:text-gray-100"
            }
          `}
        >
          {name}
        </h3>
        <p
          className={`
            text-sm leading-relaxed
            ${
              isSelected
                ? "text-purple-heart/80"
                : "text-gray-700 dark:text-gray-300"
            }
          `}
        >
          {description}
        </p>
      </div>

      {/* Hover Effect Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-purple-heart/5 to-royal-blue/5 rounded-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered && !isSelected ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />

      {/* Selection Glow */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-heart/20 to-royal-blue/20 rounded-2xl -z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  );
}

// Animated Presence Component for proper exit animations
import { AnimatePresence } from "framer-motion";