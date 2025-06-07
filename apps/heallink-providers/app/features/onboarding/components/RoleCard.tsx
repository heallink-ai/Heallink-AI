"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Circle, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

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
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if dark mode is active
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => observer.disconnect();
  }, []);

  // Dynamic styles based on state and theme
  const getCardStyles = () => {
    if (disabled) {
      return {
        backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb',
        borderColor: isDarkMode ? '#374151' : '#e5e7eb',
        opacity: 0.6,
        cursor: 'not-allowed',
      };
    }

    if (isSelected) {
      return {
        backgroundColor: isDarkMode ? '#1e1b4b' : '#fefbff',
        borderColor: '#5a2dcf',
        borderWidth: '2px',
        boxShadow: isDarkMode 
          ? '0 20px 25px -5px rgba(90, 45, 207, 0.3), 0 10px 10px -5px rgba(90, 45, 207, 0.2)' 
          : '0 20px 25px -5px rgba(90, 45, 207, 0.15), 0 10px 10px -5px rgba(90, 45, 207, 0.1)',
      };
    }

    return {
      backgroundColor: isDarkMode ? '#111827' : '#ffffff',
      borderColor: isDarkMode ? '#374151' : '#e5e7eb',
      borderWidth: '1px',
      boxShadow: isHovered 
        ? (isDarkMode 
          ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)' 
          : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)')
        : (isDarkMode 
          ? '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.12)' 
          : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'),
    };
  };

  const getIconContainerStyles = () => {
    if (isSelected) {
      return {
        background: 'linear-gradient(135deg, #5a2dcf 0%, #2066e4 100%)',
        boxShadow: '0 8px 16px rgba(90, 45, 207, 0.3)',
      };
    }

    return {
      background: isDarkMode 
        ? 'linear-gradient(135deg, #374151 0%, #4b5563 100%)' 
        : 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
      boxShadow: isDarkMode 
        ? '0 4px 8px rgba(0, 0, 0, 0.2)' 
        : '0 4px 8px rgba(0, 0, 0, 0.1)',
    };
  };

  const getTextStyles = () => {
    return {
      title: {
        color: isSelected 
          ? '#5a2dcf' 
          : (isDarkMode ? '#f9fafb' : '#111827'),
        fontWeight: '700',
        fontSize: '1.125rem',
        lineHeight: '1.75rem',
      },
      description: {
        color: isSelected 
          ? (isDarkMode ? '#c084fc' : '#7c3aed')
          : (isDarkMode ? '#d1d5db' : '#4b5563'),
        fontWeight: '400',
        fontSize: '0.875rem',
        lineHeight: '1.5',
      }
    };
  };

  const textStyles = getTextStyles();

  return (
    <motion.div
      className="relative w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {/* Main Card */}
      <motion.button
        className="relative w-full p-6 rounded-2xl text-left overflow-hidden"
        style={{
          ...getCardStyles(),
          borderStyle: 'solid',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onClick={() => !disabled && onSelect(id)}
        onMouseEnter={() => !disabled && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={!disabled ? { y: -8, scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        disabled={disabled}
      >
        {/* Gradient Overlay for Selected State */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              className="absolute inset-0 opacity-5"
              style={{
                background: 'linear-gradient(135deg, #5a2dcf 0%, #2066e4 100%)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.05 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>

        {/* Selection Indicator */}
        <motion.div
          className="absolute top-4 right-4 flex items-center justify-center rounded-full"
          style={{
            width: '28px',
            height: '28px',
            backgroundColor: isSelected ? '#5a2dcf' : 'transparent',
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: isSelected ? '#5a2dcf' : (isDarkMode ? '#6b7280' : '#d1d5db'),
          }}
          initial={false}
          animate={{
            scale: isSelected ? [1, 1.15, 1] : 1,
            backgroundColor: isSelected ? '#5a2dcf' : 'transparent',
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <AnimatePresence mode="wait">
            {isSelected ? (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <Check 
                  className="w-4 h-4" 
                  style={{ color: '#ffffff' }}
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Circle 
                  className="w-3 h-3" 
                  style={{ color: isDarkMode ? '#6b7280' : '#d1d5db' }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Icon Container */}
        <motion.div
          className="mb-6 relative"
          animate={{
            rotate: isHovered && !disabled ? [0, -5, 5, 0] : 0,
            scale: isSelected ? 1.05 : 1,
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <div
            className="w-18 h-18 rounded-2xl flex items-center justify-center relative overflow-hidden"
            style={{
              width: '72px',
              height: '72px',
              ...getIconContainerStyles(),
            }}
          >
            {/* Shimmer effect for selected state */}
            <AnimatePresence>
              {isSelected && (
                <motion.div
                  className="absolute inset-0 -skew-x-12"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  }}
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    repeatDelay: 2,
                    ease: "easeInOut" 
                  }}
                />
              )}
            </AnimatePresence>
            
            <span 
              className="text-4xl relative z-10"
              style={{ 
                color: isSelected ? '#ffffff' : (isDarkMode ? '#d1d5db' : '#6b7280'),
                filter: isSelected ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'none',
              }}
            >
              {icon}
            </span>
          </div>

          {/* Sparkle effects for selected state */}
          <AnimatePresence>
            {isSelected && (
              <>
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      top: `${20 + i * 15}%`,
                      right: `${10 + i * 10}%`,
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: [0, 1, 0], 
                      opacity: [0, 1, 0],
                      rotate: [0, 180, 360] 
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      delay: i * 0.3,
                      ease: "easeInOut" 
                    }}
                  >
                    <Sparkles 
                      className="w-3 h-3" 
                      style={{ color: '#5a2dcf' }}
                    />
                  </motion.div>
                ))}
              </>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Content */}
        <div className="space-y-3 relative z-10">
          <motion.h3
            style={textStyles.title}
            animate={{ 
              color: textStyles.title.color,
            }}
            transition={{ duration: 0.3 }}
          >
            {name}
          </motion.h3>
          
          <motion.p
            style={textStyles.description}
            animate={{ 
              color: textStyles.description.color,
            }}
            transition={{ duration: 0.3 }}
          >
            {description}
          </motion.p>
        </div>

        {/* Interactive Pulse Effect */}
        <AnimatePresence>
          {isHovered && !disabled && !isSelected && (
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(90, 45, 207, 0.03) 0%, rgba(32, 102, 228, 0.03) 100%)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
      </motion.button>

      {/* Selection Glow Effect */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            className="absolute inset-0 rounded-2xl -z-10"
            style={{
              background: isDarkMode 
                ? 'linear-gradient(135deg, rgba(90, 45, 207, 0.2) 0%, rgba(32, 102, 228, 0.2) 100%)'
                : 'linear-gradient(135deg, rgba(90, 45, 207, 0.1) 0%, rgba(32, 102, 228, 0.1) 100%)',
              filter: 'blur(20px)',
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}