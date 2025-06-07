"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, HelpCircle, Save, Lightbulb, Shield, Zap, Clock, FileCheck, Upload, Lock, CheckCircle, Sparkles, Star, Heart, Waves } from "lucide-react";
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
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: isDarkMode 
          ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
          : 'linear-gradient(135deg, #fdfbff 0%, #f8fafc 50%, #f1f5f9 100%)',
      }}
    >
      {/* Animated Background Patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              width: `${100 + i * 50}px`,
              height: `${100 + i * 50}px`,
              background: isDarkMode 
                ? `radial-gradient(circle, rgba(90, 45, 207, 0.1) 0%, transparent 70%)`
                : `radial-gradient(circle, rgba(90, 45, 207, 0.05) 0%, transparent 70%)`,
              left: `${10 + i * 20}%`,
              top: `${20 + i * 15}%`,
            }}
            animate={{
              x: [0, 30, -30, 0],
              y: [0, -20, 20, 0],
              scale: [1, 1.1, 0.9, 1],
            }}
            transition={{
              duration: 15 + i * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2,
            }}
          />
        ))}

        {/* Grid Pattern */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: isDarkMode 
              ? `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%235a2dcf' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              : `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%235a2dcf' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
          animate={{
            backgroundPosition: ['0px 0px', '60px 60px'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Enhanced Header */}
      <header 
        className="sticky top-0 z-50 backdrop-blur-xl"
        style={{
          background: isDarkMode 
            ? 'rgba(15, 15, 35, 0.8)'
            : 'rgba(255, 255, 255, 0.8)',
          borderBottom: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Enhanced Logo and Brand */}
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #5a2dcf 0%, #2066e4 100%)',
                    boxShadow: '0 8px 16px rgba(90, 45, 207, 0.3)',
                  }}
                >
                  {/* Animated shimmer */}
                  <motion.div
                    className="absolute inset-0 -skew-x-12"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    }}
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: "easeInOut"
                    }}
                  />
                  <span className="text-white font-bold text-xl relative z-10">H</span>
                </div>
                
                {/* Floating heart */}
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: 1,
                  }}
                >
                  <Heart className="w-4 h-4 text-red-400 fill-current" />
                </motion.div>
              </motion.div>
              
              <div>
                <motion.h1 
                  className="text-xl font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #5a2dcf 0%, #2066e4 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                  }}
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  HealLink
                </motion.h1>
                <p 
                  className="text-sm font-medium"
                  style={{ 
                    color: isDarkMode ? '#a1a1aa' : '#71717a',
                  }}
                >
                  Provider Portal ✨
                </p>
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

      {/* Enhanced Main Content */}
      <main className="container mx-auto px-6 py-8 relative">
        {/* Floating Design Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${20 + i * 30}%`,
                top: `${30 + i * 20}%`,
                width: `${40 + i * 20}px`,
                height: `${40 + i * 20}px`,
                background: isDarkMode 
                  ? `radial-gradient(circle, rgba(90, 45, 207, 0.03) 0%, transparent 70%)`
                  : `radial-gradient(circle, rgba(90, 45, 207, 0.02) 0%, transparent 70%)`,
                borderRadius: '50%',
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 180, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 1.5,
              }}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative">
          {/* Enhanced Main Content Area */}
          <div className="lg:col-span-3">
            {/* Enhanced Step Header */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {showBackButton && onBack && (
                <motion.button
                  onClick={onBack}
                  className="group relative flex items-center gap-3 mb-6 overflow-hidden"
                  style={{
                    background: isDarkMode 
                      ? 'linear-gradient(135deg, #374151 0%, #4b5563 100%)' 
                      : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: isDarkMode ? '#6b7280' : '#e2e8f0',
                    borderRadius: '12px',
                    padding: '12px 20px',
                    boxShadow: isDarkMode 
                      ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' 
                      : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                  whileHover={{ 
                    x: -5, 
                    scale: 1.02,
                    boxShadow: isDarkMode 
                      ? '0 8px 12px -2px rgba(0, 0, 0, 0.4)' 
                      : '0 8px 12px -2px rgba(0, 0, 0, 0.15)',
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Hover gradient overlay */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100"
                    style={{
                      background: 'linear-gradient(135deg, rgba(90, 45, 207, 0.05) 0%, rgba(32, 102, 228, 0.05) 100%)',
                      borderRadius: '12px',
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  <motion.div
                    className="relative flex items-center gap-3"
                    animate={{
                      x: [-2, 0, -2],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <ArrowLeft 
                      className="w-4 h-4" 
                      style={{ color: '#5a2dcf' }}
                    />
                    <span 
                      className="text-sm font-medium"
                      style={{ color: isDarkMode ? '#d1d5db' : '#374151' }}
                    >
                      Back to Previous Step
                    </span>
                  </motion.div>
                </motion.button>
              )}
              
              {/* Enhanced Title Section */}
              <div className="relative">
                <motion.h2 
                  className="text-4xl font-bold mb-3 relative z-10"
                  style={{
                    background: 'linear-gradient(135deg, #1f2937 0%, #5a2dcf 50%, #2066e4 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    backgroundSize: '200% 200%',
                  }}
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {title}
                </motion.h2>
                
                {/* Title underline decoration */}
                <motion.div
                  className="absolute -bottom-2 left-0 h-1 rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #5a2dcf 0%, #2066e4 100%)',
                  }}
                  initial={{ width: '0%' }}
                  animate={{ width: '60px' }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
                
                {subtitle && (
                  <motion.p 
                    className="text-xl mt-4 relative z-10"
                    style={{ 
                      color: isDarkMode ? '#a1a1aa' : '#64748b',
                      fontWeight: '400',
                      lineHeight: '1.6',
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {subtitle}
                  </motion.p>
                )}
              </div>
            </motion.div>

            {/* Enhanced Step Content Container */}
            <motion.div
              className="relative overflow-hidden rounded-3xl"
              style={{
                background: isDarkMode 
                  ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' 
                  : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: isDarkMode ? '#374151' : '#e2e8f0',
                boxShadow: isDarkMode 
                  ? '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 10px 15px -3px rgba(0, 0, 0, 0.3)' 
                  : '0 25px 50px -12px rgba(0, 0, 0, 0.08), 0 10px 15px -3px rgba(0, 0, 0, 0.05)',
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {/* Animated background pattern */}
              <motion.div
                className="absolute inset-0 opacity-30"
                style={{
                  background: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%235a2dcf' fill-opacity='0.02'%3E%3Cpath d='M50 50c0-27.614-22.386-50-50-50s-50 22.386-50 50 22.386 50 50 50 50-22.386 50-50z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
                animate={{
                  backgroundPosition: ['0px 0px', '100px 100px'],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              {/* Content with enhanced padding */}
              <div className={`relative p-10 ${className}`}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20, scale: 0.98 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -20, scale: 0.98 }}
                    transition={{ 
                      duration: 0.4,
                      ease: "easeOut"
                    }}
                  >
                    {children}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Subtle border glow effect */}
              <motion.div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(90, 45, 207, 0.1) 0%, rgba(32, 102, 228, 0.1) 100%)',
                  filter: 'blur(1px)',
                  opacity: 0,
                }}
                animate={{
                  opacity: [0, 0.3, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
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

              {/* Enhanced Tips Card */}
              <motion.div
                className="relative overflow-hidden rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                style={{
                  background: isDarkMode 
                    ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' 
                    : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: isDarkMode ? '#374151' : '#e2e8f0',
                  boxShadow: isDarkMode 
                    ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)' 
                    : '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
                }}
              >
                {/* Animated gradient background */}
                <motion.div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: 'linear-gradient(45deg, rgba(90, 45, 207, 0.1) 0%, rgba(32, 102, 228, 0.1) 50%, rgba(90, 45, 207, 0.1) 100%)',
                    backgroundSize: '200% 200%',
                  }}
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                <div className="relative p-6">
                  {/* Header with animated icon */}
                  <div className="flex items-center gap-3 mb-5">
                    <motion.div
                      className="relative"
                      animate={{
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(135deg, #5a2dcf 0%, #2066e4 100%)',
                          boxShadow: '0 4px 12px rgba(90, 45, 207, 0.3)',
                        }}
                      >
                        <Lightbulb 
                          className="w-5 h-5" 
                          style={{ color: '#ffffff' }}
                        />
                      </div>
                      
                      {/* Sparkle effect */}
                      <motion.div
                        className="absolute -top-1 -right-1"
                        animate={{
                          scale: [0, 1, 0],
                          rotate: [0, 180, 360],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: 1,
                        }}
                      >
                        <Sparkles 
                          className="w-3 h-3" 
                          style={{ color: '#5a2dcf' }}
                        />
                      </motion.div>
                    </motion.div>
                    
                    <h3 
                      className="font-bold text-lg"
                      style={{ 
                        color: isDarkMode ? '#f9fafb' : '#1f2937',
                      }}
                    >
                      Quick Tips
                    </h3>
                  </div>

                  {/* Enhanced tips with icons */}
                  <div className="space-y-4">
                    {[
                      { icon: Zap, text: "All information is auto-saved as you type", delay: 0.1 },
                      { icon: Clock, text: "You can come back and edit anytime", delay: 0.2 },
                      { icon: Upload, text: "Upload documents in PDF or image format", delay: 0.3 },
                      { icon: FileCheck, text: "Need to step away? Your progress is saved", delay: 0.4 },
                    ].map((tip, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: tip.delay }}
                      >
                        <motion.div
                          className="mt-0.5"
                          animate={{
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.5,
                          }}
                        >
                          <tip.icon 
                            className="w-4 h-4" 
                            style={{ color: '#5a2dcf' }}
                          />
                        </motion.div>
                        <p 
                          className="text-sm leading-relaxed"
                          style={{ 
                            color: isDarkMode ? '#d1d5db' : '#64748b',
                            fontWeight: '500',
                          }}
                        >
                          {tip.text}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Enhanced Security Notice */}
              <motion.div
                className="relative overflow-hidden rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                style={{
                  background: isDarkMode 
                    ? 'linear-gradient(135deg, #064e3b 0%, #1f2937 100%)' 
                    : 'linear-gradient(135deg, #ecfdf5 0%, #f0f9ff 100%)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: isDarkMode ? '#065f46' : '#a7f3d0',
                  boxShadow: isDarkMode 
                    ? '0 10px 15px -3px rgba(6, 78, 59, 0.3), 0 4px 6px -2px rgba(6, 78, 59, 0.15)' 
                    : '0 10px 15px -3px rgba(16, 185, 129, 0.08), 0 4px 6px -2px rgba(16, 185, 129, 0.04)',
                }}
              >
                {/* Animated security pattern */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.05'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm10 0c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                  animate={{
                    x: [0, 30, 0],
                    y: [0, -30, 0],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                <div className="relative p-6">
                  {/* Header with pulsing shield */}
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div
                      className="relative"
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                        }}
                      >
                        <Shield 
                          className="w-4 h-4" 
                          style={{ color: '#ffffff' }}
                        />
                      </div>

                      {/* Pulsing ring */}
                      <motion.div
                        className="absolute inset-0 rounded-lg"
                        style={{
                          border: '2px solid #10b981',
                          opacity: 0.3,
                        }}
                        animate={{
                          scale: [1, 1.3],
                          opacity: [0.3, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeOut"
                        }}
                      />
                    </motion.div>

                    <h3 
                      className="font-bold text-sm"
                      style={{ 
                        color: isDarkMode ? '#f9fafb' : '#1f2937',
                      }}
                    >
                      Secure & Private
                    </h3>

                    {/* Status indicator */}
                    <motion.div
                      className="ml-auto flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <CheckCircle 
                          className="w-4 h-4" 
                          style={{ color: '#10b981' }}
                        />
                      </motion.div>
                      <span 
                        className="text-xs font-medium"
                        style={{ color: '#10b981' }}
                      >
                        Protected
                      </span>
                    </motion.div>
                  </div>

                  {/* Enhanced security features */}
                  <div className="space-y-3">
                    {[
                      { icon: Lock, text: "End-to-end encryption", delay: 0.1 },
                      { icon: Shield, text: "HIPAA compliant", delay: 0.2 },
                      { icon: CheckCircle, text: "Never shared without consent", delay: 0.3 },
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: feature.delay }}
                      >
                        <feature.icon 
                          className="w-3 h-3" 
                          style={{ color: '#10b981' }}
                        />
                        <span 
                          className="text-xs"
                          style={{ 
                            color: isDarkMode ? '#a7f3d0' : '#047857',
                            fontWeight: '500',
                          }}
                        >
                          {feature.text}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}