"use client";

import { motion } from "framer-motion";
import { Check, Circle, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
  className?: string;
}

export default function OnboardingProgress({
  currentStep,
  totalSteps,
  stepTitles,
  className = "",
}: OnboardingProgressProps) {
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

  return (
    <div className={`w-full ${className}`}>
      {/* Progress Bar */}
      <div className="relative mb-8">
        <div className="flex items-center justify-between">
          {Array.from({ length: totalSteps }, (_, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;

            return (
              <div key={stepNumber} className="flex items-center">
                {/* Step Circle */}
                <motion.div
                  className={`
                    relative z-10 flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold
                    ${
                      isCompleted
                        ? "bg-gradient-to-r from-purple-heart to-royal-blue text-white shadow-lg"
                        : isCurrent
                        ? "bg-white dark:bg-gray-800 border-2 border-purple-heart text-purple-heart shadow-sm"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    }
                  `}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Check className="w-5 h-5" />
                    </motion.div>
                  ) : isCurrent ? (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Circle className="w-4 h-4 fill-current" />
                    </motion.div>
                  ) : (
                    <span>{stepNumber}</span>
                  )}
                </motion.div>

                {/* Connecting Line */}
                {index < totalSteps - 1 && (
                  <div className="flex-1 h-1 mx-4 relative">
                    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-heart to-royal-blue rounded-full"
                      initial={{ width: "0%" }}
                      animate={{
                        width: stepNumber < currentStep ? "100%" : "0%",
                      }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Step Labels */}
        <div className="flex justify-between mt-4">
          {stepTitles.map((title, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;

            return (
              <motion.div
                key={index}
                className="flex flex-col items-center max-w-[120px]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <span
                  className={`
                    text-xs font-medium text-center leading-tight
                    ${
                      isCompleted || isCurrent
                        ? "text-purple-heart dark:text-purple-heart"
                        : "text-gray-500 dark:text-gray-400"
                    }
                  `}
                >
                  {title}
                </span>
                {isCurrent && (
                  <motion.div
                    className="w-2 h-1 bg-gradient-to-r from-purple-heart to-royal-blue rounded-full mt-1"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Current Step Indicator */}
      <motion.div
        className="text-center p-4 rounded-xl"
        style={{
          background: isDarkMode 
            ? 'linear-gradient(to right, rgba(90, 45, 207, 0.1), rgba(32, 102, 228, 0.1))' 
            : 'linear-gradient(to right, rgba(90, 45, 207, 0.08), rgba(32, 102, 228, 0.08))',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: isDarkMode ? 'rgba(90, 45, 207, 0.3)' : '#d1d5db', // light gray in light mode, purple in dark mode
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center gap-2 text-sm">
          <span style={{ 
            color: isDarkMode ? '#d1d5db' : '#374151', // light gray in dark mode, dark gray in light mode
            fontWeight: '500' 
          }}>
            Step {currentStep} of {totalSteps}
          </span>
          <ArrowRight 
            className="w-4 h-4" 
            style={{ color: isDarkMode ? '#d1d5db' : '#374151' }}
          />
          <span style={{ 
            color: '#5a2dcf', 
            fontWeight: '600' 
          }}>
            {stepTitles[currentStep - 1]}
          </span>
        </div>
      </motion.div>
    </div>
  );
}