"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, HelpCircle, Save } from "lucide-react";
import OnboardingProgress from "./OnboardingProgress";
import { ReactNode, useState, useEffect } from "react";

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onSave?: () => void;
  showBackButton?: boolean;
  showSaveButton?: boolean;
  sidebarContent?: ReactNode;
  className?: string;
}

export default function OnboardingLayout({
  children,
  currentStep,
  totalSteps,
  stepTitles,
  title,
  subtitle,
  onBack,
  onSave,
  showBackButton = true,
  showSaveButton = true,
  sidebarContent,
  className = "",
}: OnboardingLayoutProps) {
  const [showHelp, setShowHelp] = useState(false);
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

  // Button styles for light and dark modes
  const getButtonStyles = () => {
    if (isDarkMode) {
      return {
        color: '#a855f7', // purple-400 for dark mode
        backgroundColor: '#1f2937', // gray-800 for dark mode
        borderColor: '#8b5cf6', // purple-500 for dark mode
        borderWidth: '1px',
      };
    } else {
      return {
        color: '#5a2dcf', // purple-heart for light mode
        backgroundColor: '#ffffff', // white for light mode
        borderColor: '#5a2dcf', // purple-heart for light mode
        borderWidth: '1px',
      };
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isDarkMode) {
      e.currentTarget.style.backgroundColor = '#8b5cf620';
      e.currentTarget.style.color = '#c084fc';
    } else {
      e.currentTarget.style.backgroundColor = '#5a2dcf08';
      e.currentTarget.style.color = '#4c1d95';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isDarkMode) {
      e.currentTarget.style.backgroundColor = '#1f2937';
      e.currentTarget.style.color = '#a855f7';
    } else {
      e.currentTarget.style.backgroundColor = '#ffffff';
      e.currentTarget.style.color = '#5a2dcf';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-heart to-royal-blue flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <div>
                <h1 className="text-lg font-bold gradient-text">HealLink</h1>
                <p className="text-xs text-muted-foreground">Provider Portal</p>
              </div>
            </motion.div>

            {/* Header Actions */}
            <div className="flex items-center gap-3">
              {showSaveButton && (
                <motion.button
                  onClick={onSave}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg shadow-sm hover:shadow-md"
                  style={getButtonStyles()}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save className="w-4 h-4" />
                  Save Progress
                </motion.button>
              )}
              
              <motion.button
                onClick={() => setShowHelp(!showHelp)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg shadow-sm hover:shadow-md"
                style={getButtonStyles()}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <HelpCircle className="w-4 h-4" />
                Need Help?
              </motion.button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <OnboardingProgress
              currentStep={currentStep}
              totalSteps={totalSteps}
              stepTitles={stepTitles}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Step Header */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {showBackButton && onBack && (
                <motion.button
                  onClick={onBack}
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-purple-heart transition-colors mb-4"
                  whileHover={{ x: -5 }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Previous Step
                </motion.button>
              )}
              
              <h2 className="text-3xl font-bold text-foreground mb-2">{title}</h2>
              {subtitle && (
                <p className="text-lg text-muted-foreground">{subtitle}</p>
              )}
            </motion.div>

            {/* Step Content */}
            <motion.div
              className={`neumorph-card rounded-2xl p-8 ${className}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              className="sticky top-32 space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Help Panel */}
              <AnimatePresence>
                {showHelp && (
                  <motion.div
                    className="neumorph-card rounded-xl p-6"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <HelpCircle className="w-5 h-5 text-purple-heart" />
                      <h3 className="font-semibold text-foreground">Need Help?</h3>
                    </div>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p>Having trouble with this step? Our support team is here to help.</p>
                      <div className="space-y-2">
                        <a
                          href="mailto:support@heallink.io"
                          className="block text-purple-heart hover:underline"
                        >
                          📧 Email Support
                        </a>
                        <a
                          href="tel:+353874831977"
                          className="block text-purple-heart hover:underline"
                        >
                          📞 Call Support
                        </a>
                        <button className="block text-purple-heart hover:underline text-left">
                          💬 Live Chat
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Custom Sidebar Content */}
              {sidebarContent && (
                <motion.div
                  className="neumorph-card rounded-xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {sidebarContent}
                </motion.div>
              )}

              {/* Tips Card */}
              <motion.div
                className="neumorph-card rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h3 className="font-semibold text-foreground mb-3">💡 Quick Tips</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• All information is auto-saved as you type</p>
                  <p>• You can come back and edit anytime</p>
                  <p>• Upload documents in PDF or image format</p>
                  <p>• Need to step away? Your progress is saved</p>
                </div>
              </motion.div>

              {/* Security Notice */}
              <motion.div
                className="neumorph-card rounded-xl p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <h3 className="font-semibold text-foreground text-sm">Secure & Private</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your data is encrypted and HIPAA compliant. We never share your information without consent.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}