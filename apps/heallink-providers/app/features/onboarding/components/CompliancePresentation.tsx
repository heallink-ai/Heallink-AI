"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Clock,
  Shield,
  FileText,
  Video,
  Award,
  AlertTriangle,
  ArrowRight,
  Lock,
  Star,
  BookOpen,
  Users,
  Monitor
} from "lucide-react";

export interface ComplianceModule {
  id: string;
  name: string;
  description: string;
  videoUrl: string;
  duration: number; // in minutes
  completed: boolean;
  watchedPercentage: number;
}

interface CompliancePresentationProps {
  modules: ComplianceModule[];
  onModuleUpdate: (moduleId: string, updates: Partial<ComplianceModule>) => void;
  onContinue: () => void;
  onBack: () => void;
  isLoading: boolean;
  errors: any;
}

export default function CompliancePresentation({
  modules,
  onModuleUpdate,
  onContinue,
  onBack,
  isLoading,
  errors,
}: CompliancePresentationProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

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

  const getModuleIcon = (moduleId: string) => {
    switch (moduleId) {
      case 'hipaa':
        return <Shield className="w-6 h-6" />;
      case 'privacy':
        return <Lock className="w-6 h-6" />;
      case 'telehealth':
        return <Monitor className="w-6 h-6" />;
      case 'platform':
        return <BookOpen className="w-6 h-6" />;
      case 'terms':
        return <FileText className="w-6 h-6" />;
      default:
        return <Video className="w-6 h-6" />;
    }
  };

  const getModuleColor = (moduleId: string) => {
    switch (moduleId) {
      case 'hipaa':
        return '#dc2626'; // red
      case 'privacy':
        return '#7c3aed'; // purple
      case 'telehealth':
        return '#059669'; // green
      case 'platform':
        return '#2563eb'; // blue
      case 'terms':
        return '#d97706'; // orange
      default:
        return '#6b7280'; // gray
    }
  };

  const handleModuleClick = (moduleId: string) => {
    setActiveModule(activeModule === moduleId ? null : moduleId);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleModuleComplete = (moduleId: string) => {
    onModuleUpdate(moduleId, {
      completed: true,
      watchedPercentage: 100,
    });
  };

  const handleReset = (moduleId: string) => {
    onModuleUpdate(moduleId, {
      completed: false,
      watchedPercentage: 0,
    });
    setCurrentTime(0);
  };

  const completedModules = modules.filter(m => m.completed).length;
  const totalModules = modules.length;
  const overallProgress = (completedModules / totalModules) * 100;
  const canContinue = completedModules === totalModules;

  const totalDuration = modules.reduce((acc, module) => acc + module.duration, 0);
  const completedDuration = modules
    .filter(m => m.completed)
    .reduce((acc, module) => acc + module.duration, 0);

  return (
    <div className="space-y-10">
      {/* Enhanced Header Section */}
      <motion.div
        className="text-center space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="relative inline-flex"
          animate={{
            rotate: [0, 3, -3, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #dc2626 0%, #7c3aed 100%)',
              boxShadow: '0 10px 25px rgba(220, 38, 38, 0.3)',
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
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "easeInOut"
              }}
            />
            <Shield className="w-10 h-10 text-white relative z-10" />
          </div>
          
          {/* Floating sparkles */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                top: `${10 + i * 15}%`,
                right: `${5 + i * 10}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                rotate: [0, 180, 360],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
            >
              <Star className="w-3 h-3 text-red-500" />
            </motion.div>
          ))}
        </motion.div>

        <div>
          <motion.h1 
            className="text-4xl font-bold mb-3"
            style={{
              background: 'linear-gradient(135deg, #1f2937 0%, #dc2626 50%, #7c3aed 100%)',
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
            Compliance Training
          </motion.h1>
          <motion.p 
            className="text-xl max-w-2xl mx-auto"
            style={{ 
              color: isDarkMode ? '#a1a1aa' : '#64748b',
              fontWeight: '400',
              lineHeight: '1.6',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Complete required training modules to ensure compliance with healthcare regulations and best practices
          </motion.p>
        </div>
      </motion.div>

      {/* Enhanced Progress Overview */}
      <motion.div
        className="relative overflow-hidden rounded-3xl"
        style={{
          background: isDarkMode 
            ? 'linear-gradient(135deg, #1e3a8a 0%, #1f2937 100%)' 
            : 'linear-gradient(135deg, #dbeafe 0%, #f0f9ff 100%)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: isDarkMode ? '#1e40af' : '#93c5fd',
          boxShadow: '0 20px 25px -5px rgba(30, 64, 175, 0.15)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  boxShadow: '0 8px 16px rgba(37, 99, 235, 0.3)',
                }}
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Award className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h2 
                  className="text-2xl font-bold"
                  style={{ color: isDarkMode ? '#f9fafb' : '#1f2937' }}
                >
                  Training Progress
                </h2>
                <p 
                  className="text-lg"
                  style={{ color: isDarkMode ? '#d1d5db' : '#64748b' }}
                >
                  {completedModules} of {totalModules} modules completed
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div 
                className="text-4xl font-bold"
                style={{ color: '#2563eb' }}
              >
                {Math.round(overallProgress)}%
              </div>
              <p 
                className="text-sm"
                style={{ color: isDarkMode ? '#a1a1aa' : '#6b7280' }}
              >
                {completedDuration} / {totalDuration} minutes
              </p>
            </div>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="relative">
            <div 
              className="w-full h-4 rounded-full"
              style={{
                backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
              }}
            >
              <motion.div
                className="h-4 rounded-full relative overflow-hidden"
                style={{
                  background: 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)',
                  boxShadow: '0 2px 8px rgba(59, 130, 246, 0.4)',
                }}
                initial={{ width: "0%" }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 -skew-x-12"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </div>
            
            {/* Progress indicators */}
            <div className="flex justify-between mt-2">
              {modules.map((_, index) => {
                const position = ((index + 1) / totalModules) * 100;
                const isCompleted = index < completedModules;
                
                return (
                  <motion.div
                    key={index}
                    className="absolute w-3 h-3 rounded-full transform -translate-x-1/2"
                    style={{
                      left: `${position}%`,
                      top: '-4px',
                      backgroundColor: isCompleted ? '#10b981' : (isDarkMode ? '#374151' : '#d1d5db'),
                      boxShadow: isCompleted ? '0 2px 8px rgba(16, 185, 129, 0.4)' : 'none',
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Training Modules */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {modules.map((module, index) => {
          const isActive = activeModule === module.id;
          const moduleColor = getModuleColor(module.id);
          
          return (
            <motion.div
              key={module.id}
              className="relative overflow-hidden rounded-3xl"
              style={{
                background: module.completed
                  ? (isDarkMode ? 'linear-gradient(135deg, #065f46 0%, #1f2937 100%)' : 'linear-gradient(135deg, #ecfdf5 0%, #f0f9ff 100%)')
                  : isActive
                    ? (isDarkMode ? 'linear-gradient(135deg, #1e40af 0%, #1f2937 100%)' : 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)')
                    : (isDarkMode ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'),
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: module.completed 
                  ? '#10b981'
                  : isActive 
                    ? '#3b82f6'
                    : (isDarkMode ? '#374151' : '#e2e8f0'),
                boxShadow: module.completed
                  ? '0 20px 25px -5px rgba(16, 185, 129, 0.15)'
                  : isActive
                    ? '0 20px 25px -5px rgba(59, 130, 246, 0.15)'
                    : (isDarkMode ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)' : '0 10px 15px -3px rgba(0, 0, 0, 0.08)'),
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.01 }}
            >
              <div className="p-8">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-6 flex-1">
                    {/* Enhanced Module Icon */}
                    <motion.div
                      className="relative"
                      animate={{
                        rotate: isActive ? [0, 5, -5, 0] : 0,
                        scale: module.completed ? [1, 1.05, 1] : 1,
                      }}
                      transition={{
                        duration: 3,
                        repeat: isActive || module.completed ? Infinity : 0,
                        ease: "easeInOut"
                      }}
                    >
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center relative overflow-hidden"
                        style={{
                          background: module.completed
                            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                            : `linear-gradient(135deg, ${moduleColor} 0%, ${moduleColor}80 100%)`,
                          boxShadow: `0 8px 16px ${moduleColor}30`,
                        }}
                      >
                        <AnimatePresence mode="wait">
                          {module.completed ? (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              exit={{ scale: 0, rotate: 180 }}
                              transition={{ duration: 0.4 }}
                            >
                              <CheckCircle className="w-8 h-8 text-white" />
                            </motion.div>
                          ) : (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              transition={{ duration: 0.2 }}
                              style={{ color: '#ffffff' }}
                            >
                              {getModuleIcon(module.id)}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Completion badge */}
                      <AnimatePresence>
                        {module.completed && (
                          <motion.div
                            className="absolute -top-2 -right-2"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Star className="w-6 h-6 text-green-400 fill-current" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Module Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 
                          className="text-xl font-bold"
                          style={{ 
                            color: module.completed ? '#10b981' : isActive ? '#3b82f6' : (isDarkMode ? '#f9fafb' : '#1f2937')
                          }}
                        >
                          {module.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" style={{ color: isDarkMode ? '#a1a1aa' : '#6b7280' }} />
                          <span 
                            className="text-sm font-medium"
                            style={{ color: isDarkMode ? '#a1a1aa' : '#6b7280' }}
                          >
                            {module.duration} min
                          </span>
                        </div>
                      </div>
                      
                      <p 
                        className="text-lg mb-4"
                        style={{ 
                          color: module.completed ? '#065f46' : isActive ? '#1e40af' : (isDarkMode ? '#d1d5db' : '#64748b'),
                          lineHeight: '1.6',
                        }}
                      >
                        {module.description}
                      </p>

                      {/* Progress bar for module */}
                      {(module.watchedPercentage > 0 || module.completed) && (
                        <motion.div
                          className="mb-4"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span 
                              className="text-sm font-medium"
                              style={{ color: isDarkMode ? '#d1d5db' : '#374151' }}
                            >
                              Progress
                            </span>
                            <span 
                              className="text-sm font-bold"
                              style={{ color: moduleColor }}
                            >
                              {module.watchedPercentage}%
                            </span>
                          </div>
                          <div 
                            className="w-full h-2 rounded-full"
                            style={{
                              backgroundColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(229, 231, 235, 0.8)',
                            }}
                          >
                            <motion.div
                              className="h-2 rounded-full"
                              style={{
                                background: `linear-gradient(90deg, ${moduleColor} 0%, ${moduleColor}cc 100%)`,
                              }}
                              initial={{ width: "0%" }}
                              animate={{ width: `${module.watchedPercentage}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Enhanced Action Buttons */}
                  <div className="flex items-center gap-3">
                    {module.completed ? (
                      <motion.button
                        onClick={() => handleReset(module.id)}
                        className="relative overflow-hidden rounded-xl"
                        style={{
                          background: 'transparent',
                          border: `2px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
                          padding: '12px 16px',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = isDarkMode ? '#374151' : '#f3f4f6';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <RotateCcw className="w-5 h-5" style={{ color: isDarkMode ? '#d1d5db' : '#374151' }} />
                      </motion.button>
                    ) : (
                      <motion.button
                        onClick={() => handleModuleClick(module.id)}
                        className="relative overflow-hidden rounded-xl"
                        style={{
                          background: `linear-gradient(135deg, ${moduleColor} 0%, ${moduleColor}cc 100%)`,
                          border: 'none',
                          padding: '12px 24px',
                          boxShadow: `0 8px 16px ${moduleColor}30`,
                        }}
                        whileHover={{ 
                          scale: 1.05, 
                          y: -2,
                          boxShadow: `0 12px 20px ${moduleColor}40`
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {/* Shimmer effect */}
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
                        
                        <div className="relative flex items-center gap-2">
                          <Play className="w-5 h-5 text-white" />
                          <span className="font-semibold text-white">
                            {isActive ? 'Resume' : 'Start Training'}
                          </span>
                        </div>
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>

              {/* Enhanced Expanded Training Content */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div 
                      className="p-8 pt-0"
                      style={{
                        borderTop: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                        marginTop: '0',
                      }}
                    >
                      {/* Enhanced Video Player Mockup */}
                      <div
                        className="relative rounded-2xl overflow-hidden mb-6"
                        style={{
                          backgroundColor: '#000000',
                          aspectRatio: '16/9',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
                        }}
                      >
                        {/* Video placeholder */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center text-white">
                            <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium opacity-75">
                              {module.name} Training Video
                            </p>
                            <p className="text-sm opacity-50">
                              Duration: {module.duration} minutes
                            </p>
                          </div>
                        </div>

                        {/* Enhanced Video Controls */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                          <div className="flex items-center gap-4">
                            <motion.button
                              onClick={handlePlayPause}
                              className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {isPlaying ? (
                                <Pause className="w-6 h-6 text-white" />
                              ) : (
                                <Play className="w-6 h-6 text-white ml-1" />
                              )}
                            </motion.button>

                            <div className="flex-1">
                              <div className="w-full h-1 bg-white/20 rounded-full">
                                <motion.div
                                  className="h-1 bg-white rounded-full"
                                  style={{ width: `${module.watchedPercentage}%` }}
                                  animate={{ width: `${module.watchedPercentage}%` }}
                                  transition={{ duration: 0.3 }}
                                />
                              </div>
                            </div>

                            <span className="text-white text-sm font-medium">
                              {Math.round((module.watchedPercentage / 100) * module.duration)}m / {module.duration}m
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Action Buttons */}
                      <div className="flex gap-4 justify-center">
                        <motion.button
                          onClick={() => handleModuleComplete(module.id)}
                          disabled={module.watchedPercentage < 80}
                          className="relative overflow-hidden rounded-2xl"
                          style={{
                            background: module.watchedPercentage >= 80 
                              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                              : (isDarkMode ? '#4b5563' : '#e5e7eb'),
                            border: 'none',
                            padding: '16px 32px',
                            boxShadow: module.watchedPercentage >= 80 
                              ? '0 10px 25px rgba(16, 185, 129, 0.3)'
                              : 'none',
                            cursor: module.watchedPercentage >= 80 ? 'pointer' : 'not-allowed',
                          }}
                          whileHover={module.watchedPercentage >= 80 ? { 
                            scale: 1.05, 
                            y: -2,
                            boxShadow: '0 15px 30px rgba(16, 185, 129, 0.4)'
                          } : {}}
                          whileTap={module.watchedPercentage >= 80 ? { scale: 0.95 } : {}}
                        >
                          <div className="relative flex items-center gap-3">
                            {module.watchedPercentage >= 80 ? (
                              <CheckCircle className="w-5 h-5 text-white" />
                            ) : (
                              <AlertTriangle className="w-5 h-5" style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }} />
                            )}
                            <span 
                              className="font-semibold text-lg"
                              style={{ 
                                color: module.watchedPercentage >= 80 ? '#ffffff' : (isDarkMode ? '#9ca3af' : '#6b7280')
                              }}
                            >
                              {module.watchedPercentage >= 80 ? 'Mark as Complete' : `Watch ${80 - module.watchedPercentage}% more to complete`}
                            </span>
                          </div>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Enhanced Navigation Buttons */}
      <motion.div
        className="flex flex-col sm:flex-row gap-6 justify-between pt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {/* Enhanced Back Button */}
        <motion.button
          onClick={onBack}
          className="relative overflow-hidden rounded-2xl"
          style={{
            background: isDarkMode 
              ? 'linear-gradient(135deg, #374151 0%, #4b5563 100%)' 
              : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: isDarkMode ? '#6b7280' : '#e2e8f0',
            padding: '16px 32px',
            boxShadow: isDarkMode 
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' 
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
          whileHover={{ 
            scale: 1.02, 
            y: -2,
            boxShadow: isDarkMode 
              ? '0 8px 12px -2px rgba(0, 0, 0, 0.4)' 
              : '0 8px 12px -2px rgba(0, 0, 0, 0.15)',
          }}
          whileTap={{ scale: 0.98 }}
        >
          <span 
            className="font-semibold text-lg"
            style={{ color: isDarkMode ? '#d1d5db' : '#374151' }}
          >
            Back to Credentials
          </span>
        </motion.button>

        {/* Enhanced Continue Button */}
        <motion.button
          onClick={onContinue}
          disabled={isLoading || !canContinue}
          className="relative overflow-hidden rounded-2xl"
          style={{
            background: (isLoading || !canContinue)
              ? (isDarkMode ? '#4b5563' : '#e5e7eb')
              : 'linear-gradient(135deg, #dc2626 0%, #7c3aed 100%)',
            borderWidth: '0px',
            padding: '16px 32px',
            boxShadow: (isLoading || !canContinue)
              ? 'none' 
              : '0 10px 25px rgba(220, 38, 38, 0.3), 0 4px 6px rgba(124, 58, 237, 0.2)',
            cursor: (isLoading || !canContinue) ? 'not-allowed' : 'pointer',
          }}
          whileHover={!(isLoading || !canContinue) ? { 
            scale: 1.05, 
            y: -3,
            boxShadow: '0 15px 30px rgba(220, 38, 38, 0.4), 0 8px 12px rgba(124, 58, 237, 0.3)'
          } : {}}
          whileTap={!(isLoading || !canContinue) ? { scale: 0.98 } : {}}
        >
          {/* Shimmer effect */}
          <AnimatePresence>
            {!(isLoading || !canContinue) && (
              <motion.div
                className="absolute inset-0 -skew-x-12"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                }}
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut"
                }}
              />
            )}
          </AnimatePresence>

          <div className="relative flex items-center gap-3">
            {isLoading ? (
              <>
                <motion.div
                  className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span className="font-bold text-lg text-white">
                  Saving Progress...
                </span>
              </>
            ) : !canContinue ? (
              <>
                <AlertTriangle className="w-6 h-6" style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }} />
                <span 
                  className="font-bold text-lg"
                  style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
                >
                  Complete all modules to continue
                </span>
              </>
            ) : (
              <>
                <CheckCircle className="w-6 h-6 text-white" />
                <span className="font-bold text-lg text-white">
                  Continue to Workflow Setup
                </span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-6 h-6 text-white" />
                </motion.div>
              </>
            )}
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
}