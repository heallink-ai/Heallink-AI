"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  CheckCircle,
  ArrowRight,
  Edit,
  User,
  MapPin,
  CreditCard,
  FileCheck,
  Shield,
  Calendar,
  Users,
  Settings,
  Award,
  Star,
  Sparkles,
  Trophy,
  Send,
  Clock,
  Video,
  Phone,
  Mail,
  DollarSign,
  Bell,
  AlertTriangle,
  Zap,
  Eye,
  EyeOff,
  Copy,
  Check
} from "lucide-react";

interface ReviewPresentationProps {
  progress: any;
  onEdit: (section: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  isLoading: boolean;
  errors: any;
}

export default function ReviewPresentation({
  progress,
  onEdit,
  onSubmit,
  onBack,
  isLoading,
  errors,
}: ReviewPresentationProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    roles: true,
    profile: false,
    credentials: false,
    compliance: false,
    workflow: false,
  });
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

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

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const maskSensitiveData = (data: string, type: 'ssn' | 'account' | 'routing') => {
    if (!data) return '';
    if (showSensitiveData) return data;
    
    switch (type) {
      case 'ssn':
        return `***-**-${data.slice(-4)}`;
      case 'account':
        return `****${data.slice(-4)}`;
      case 'routing':
        return `*****${data.slice(-4)}`;
      default:
        return data;
    }
  };

  const sections = [
    {
      id: 'roles',
      title: 'Provider Roles',
      icon: Users,
      color: '#5a2dcf',
      description: 'Selected provider types and specializations',
      isComplete: progress.selectedRoles?.length > 0,
      data: progress.selectedRoles || [],
    },
    {
      id: 'profile',
      title: 'Professional Profile',
      icon: User,
      color: '#2066e4',
      description: 'Legal identity, contact information, and banking details',
      isComplete: progress.legalIdentity && progress.contactLocations?.length > 0 && progress.payoutTax,
      data: {
        legal: progress.legalIdentity,
        contact: progress.contactLocations,
        payout: progress.payoutTax,
      },
    },
    {
      id: 'credentials',
      title: 'Credentials',
      icon: FileCheck,
      color: '#f59e0b',
      description: 'Professional licenses, certifications, and qualifications',
      isComplete: progress.credentials?.length > 0,
      data: progress.credentials || [],
    },
    {
      id: 'compliance',
      title: 'Compliance Training',
      icon: Shield,
      color: '#dc2626',
      description: 'Completed healthcare compliance and training modules',
      isComplete: progress.complianceModules?.every((module: any) => module.completed),
      data: progress.complianceModules || [],
    },
    {
      id: 'workflow',
      title: 'Workflow Setup',
      icon: Settings,
      color: '#10b981',
      description: 'Scheduling, appointment types, and booking preferences',
      isComplete: progress.workflowSettings?.availability?.some((slot: any) => slot.enabled) && 
                   progress.workflowSettings?.appointmentTypes?.length > 0,
      data: progress.workflowSettings,
    },
  ];

  const completedSections = sections.filter(section => section.isComplete).length;
  const totalSections = sections.length;
  const overallProgress = (completedSections / totalSections) * 100;
  const canSubmit = completedSections === totalSections;

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
            rotate: [0, 2, -2, 0],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center relative overflow-hidden"
            style={{
              background: canSubmit 
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              boxShadow: canSubmit 
                ? '0 10px 25px rgba(16, 185, 129, 0.4)'
                : '0 10px 25px rgba(245, 158, 11, 0.4)',
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
            {canSubmit ? (
              <Trophy className="w-12 h-12 text-white relative z-10" />
            ) : (
              <Award className="w-12 h-12 text-white relative z-10" />
            )}
          </div>
          
          {/* Floating sparkles */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                top: `${10 + i * 12}%`,
                right: `${5 + i * 8}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                rotate: [0, 180, 360],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            >
              <Star className="w-3 h-3 text-yellow-400" />
            </motion.div>
          ))}
        </motion.div>

        <div>
          <motion.h1 
            className="text-4xl font-bold mb-4"
            style={{
              background: canSubmit 
                ? 'linear-gradient(135deg, #1f2937 0%, #10b981 50%, #059669 100%)'
                : 'linear-gradient(135deg, #1f2937 0%, #f59e0b 50%, #d97706 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
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
          >
            {canSubmit ? 'Ready to Submit!' : 'Review & Complete'}
          </motion.h1>
          <motion.p 
            className="text-xl max-w-3xl mx-auto"
            style={{ 
              color: isDarkMode ? '#a1a1aa' : '#64748b',
              fontWeight: '400',
              lineHeight: '1.6',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {canSubmit 
              ? 'All sections completed! Review your information and submit your application for verification.'
              : 'Please review and complete all sections before submitting your provider application.'
            }
          </motion.p>
        </div>
      </motion.div>

      {/* Enhanced Progress Overview */}
      <motion.div
        className="relative overflow-hidden rounded-3xl"
        style={{
          background: canSubmit
            ? (isDarkMode ? 'linear-gradient(135deg, #065f46 0%, #1f2937 100%)' : 'linear-gradient(135deg, #ecfdf5 0%, #f0f9ff 100%)')
            : (isDarkMode ? 'linear-gradient(135deg, #92400e 0%, #1f2937 100%)' : 'linear-gradient(135deg, #fef3c7 0%, #fef7cd 100%)'),
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: canSubmit ? '#10b981' : '#f59e0b',
          boxShadow: canSubmit 
            ? '0 20px 25px -5px rgba(16, 185, 129, 0.15)'
            : '0 20px 25px -5px rgba(245, 158, 11, 0.15)',
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
                  background: canSubmit 
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  boxShadow: canSubmit
                    ? '0 8px 16px rgba(16, 185, 129, 0.3)'
                    : '0 8px 16px rgba(245, 158, 11, 0.3)',
                }}
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: canSubmit ? [0, 5, -5, 0] : 0,
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {canSubmit ? (
                  <CheckCircle className="w-8 h-8 text-white" />
                ) : (
                  <Clock className="w-8 h-8 text-white" />
                )}
              </motion.div>
              <div>
                <h2 
                  className="text-2xl font-bold"
                  style={{ 
                    color: canSubmit 
                      ? (isDarkMode ? '#10b981' : '#065f46')
                      : (isDarkMode ? '#f59e0b' : '#92400e')
                  }}
                >
                  Application Progress
                </h2>
                <p 
                  className="text-lg"
                  style={{ 
                    color: canSubmit 
                      ? (isDarkMode ? '#a7f3d0' : '#047857')
                      : (isDarkMode ? '#fcd34d' : '#a16207')
                  }}
                >
                  {completedSections} of {totalSections} sections completed
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div 
                className="text-4xl font-bold"
                style={{ 
                  color: canSubmit ? '#10b981' : '#f59e0b'
                }}
              >
                {Math.round(overallProgress)}%
              </div>
              <p 
                className="text-sm"
                style={{ 
                  color: canSubmit 
                    ? (isDarkMode ? '#a7f3d0' : '#047857')
                    : (isDarkMode ? '#fcd34d' : '#a16207')
                }}
              >
                {canSubmit ? 'Ready to submit' : `${totalSections - completedSections} remaining`}
              </p>
            </div>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="relative">
            <div 
              className="w-full h-4 rounded-full"
              style={{
                backgroundColor: canSubmit 
                  ? (isDarkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)')
                  : (isDarkMode ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.1)'),
              }}
            >
              <motion.div
                className="h-4 rounded-full relative overflow-hidden"
                style={{
                  background: canSubmit 
                    ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
                    : 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)',
                  boxShadow: canSubmit 
                    ? '0 2px 8px rgba(16, 185, 129, 0.4)'
                    : '0 2px 8px rgba(245, 158, 11, 0.4)',
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
          </div>
        </div>
      </motion.div>

      {/* Enhanced Sections Review */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {sections.map((section, index) => {
          const Icon = section.icon;
          const isExpanded = expandedSections[section.id];
          
          return (
            <motion.div
              key={section.id}
              className="relative overflow-hidden rounded-3xl"
              style={{
                background: section.isComplete
                  ? (isDarkMode ? 'linear-gradient(135deg, #065f46 0%, #1f2937 100%)' : 'linear-gradient(135deg, #ecfdf5 0%, #f0f9ff 100%)')
                  : (isDarkMode ? 'linear-gradient(135deg, #92400e 0%, #1f2937 100%)' : 'linear-gradient(135deg, #fef3c7 0%, #fff7ed 100%)'),
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: section.isComplete ? '#10b981' : '#f59e0b',
                boxShadow: section.isComplete
                  ? '0 20px 25px -5px rgba(16, 185, 129, 0.15)'
                  : '0 20px 25px -5px rgba(245, 158, 11, 0.15)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 flex-1">
                    {/* Enhanced Section Icon */}
                    <motion.div
                      className="relative"
                      animate={{
                        rotate: section.isComplete ? [0, 5, -5, 0] : 0,
                        scale: section.isComplete ? [1, 1.05, 1] : 1,
                      }}
                      transition={{
                        duration: 3,
                        repeat: section.isComplete ? Infinity : 0,
                        ease: "easeInOut"
                      }}
                    >
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center relative overflow-hidden"
                        style={{
                          background: section.isComplete
                            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                            : `linear-gradient(135deg, ${section.color} 0%, ${section.color}cc 100%)`,
                          boxShadow: section.isComplete
                            ? '0 8px 16px rgba(16, 185, 129, 0.3)'
                            : `0 8px 16px ${section.color}30`,
                        }}
                      >
                        <AnimatePresence mode="wait">
                          {section.isComplete ? (
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
                            >
                              <Icon className="w-8 h-8 text-white" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Completion badge */}
                      <AnimatePresence>
                        {section.isComplete && (
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

                    {/* Section Content */}
                    <div className="flex-1">
                      <h3 
                        className="text-xl font-bold mb-2"
                        style={{ 
                          color: section.isComplete 
                            ? (isDarkMode ? '#10b981' : '#065f46')
                            : (isDarkMode ? '#f59e0b' : '#92400e')
                        }}
                      >
                        {section.title}
                      </h3>
                      <p 
                        className="text-lg"
                        style={{ 
                          color: section.isComplete 
                            ? (isDarkMode ? '#a7f3d0' : '#047857')
                            : (isDarkMode ? '#fcd34d' : '#a16207')
                        }}
                      >
                        {section.description}
                      </p>
                    </div>
                  </div>

                  {/* Enhanced Action Buttons */}
                  <div className="flex items-center gap-3">
                    {section.isComplete && (
                      <motion.button
                        onClick={() => toggleSection(section.id)}
                        className="relative overflow-hidden rounded-xl"
                        style={{
                          background: 'transparent',
                          border: '2px solid #10b981',
                          padding: '12px 16px',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="flex items-center gap-2">
                          <Eye className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-green-600">
                            {isExpanded ? 'Hide' : 'View'}
                          </span>
                        </div>
                      </motion.button>
                    )}

                    <motion.button
                      onClick={() => onEdit(section.id)}
                      className="relative overflow-hidden rounded-xl"
                      style={{
                        background: section.isComplete 
                          ? 'transparent'
                          : `linear-gradient(135deg, ${section.color} 0%, ${section.color}cc 100%)`,
                        border: section.isComplete 
                          ? `2px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`
                          : 'none',
                        padding: '12px 24px',
                        boxShadow: section.isComplete 
                          ? 'none'
                          : `0 8px 16px ${section.color}30`,
                      }}
                      onMouseEnter={(e) => {
                        if (section.isComplete) {
                          e.currentTarget.style.backgroundColor = isDarkMode ? '#374151' : '#f3f4f6';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (section.isComplete) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                      whileHover={{ 
                        scale: 1.05, 
                        y: -2,
                        boxShadow: section.isComplete 
                          ? undefined
                          : `0 12px 20px ${section.color}40`
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="flex items-center gap-2">
                        <Edit className="w-5 h-5" style={{ color: section.isComplete ? (isDarkMode ? '#9ca3af' : '#6b7280') : '#ffffff' }} />
                        <span 
                          className="font-semibold"
                          style={{ color: section.isComplete ? (isDarkMode ? '#9ca3af' : '#6b7280') : '#ffffff' }}
                        >
                          {section.isComplete ? 'Edit' : 'Complete'}
                        </span>
                      </div>
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Enhanced Expanded Content */}
              <AnimatePresence>
                {isExpanded && section.isComplete && (
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
                      }}
                    >
                      {/* Section-specific content */}
                      {section.id === 'roles' && (
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold" style={{ color: isDarkMode ? '#f9fafb' : '#1f2937' }}>
                            Selected Provider Roles
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {section.data.map((role: any, idx: number) => (
                              <motion.div
                                key={idx}
                                className="px-4 py-2 rounded-xl"
                                style={{
                                  backgroundColor: section.color + '20',
                                  border: `1px solid ${section.color}40`,
                                }}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                              >
                                <span className="font-medium" style={{ color: section.color }}>
                                  {role.customDescription || role.role.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {section.id === 'profile' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                          {/* Legal Identity */}
                          <div className="space-y-4">
                            <h4 className="text-lg font-semibold flex items-center gap-2" style={{ color: isDarkMode ? '#f9fafb' : '#1f2937' }}>
                              <User className="w-5 h-5" />
                              Legal Identity
                            </h4>
                            <div className="space-y-3">
                              <div>
                                <span className="text-sm font-medium" style={{ color: isDarkMode ? '#a1a1aa' : '#6b7280' }}>Name:</span>
                                <p className="font-semibold" style={{ color: isDarkMode ? '#f9fafb' : '#1f2937' }}>
                                  {section.data.legal?.firstName} {section.data.legal?.middleName} {section.data.legal?.lastName}
                                </p>
                              </div>
                              <div>
                                <span className="text-sm font-medium" style={{ color: isDarkMode ? '#a1a1aa' : '#6b7280' }}>Date of Birth:</span>
                                <p className="font-semibold" style={{ color: isDarkMode ? '#f9fafb' : '#1f2937' }}>
                                  {section.data.legal?.dateOfBirth ? new Date(section.data.legal.dateOfBirth).toLocaleDateString() : 'Not provided'}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium" style={{ color: isDarkMode ? '#a1a1aa' : '#6b7280' }}>ID Number:</span>
                                <p className="font-mono text-sm" style={{ color: isDarkMode ? '#f9fafb' : '#1f2937' }}>
                                  {maskSensitiveData(section.data.legal?.governmentId?.number || '', 'ssn')}
                                </p>
                                <motion.button
                                  onClick={() => copyToClipboard(section.data.legal?.governmentId?.number || '', 'id')}
                                  className="p-1 rounded"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  {copiedField === 'id' ? (
                                    <Check className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <Copy className="w-4 h-4" style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }} />
                                  )}
                                </motion.button>
                              </div>
                            </div>
                          </div>

                          {/* Contact Locations */}
                          <div className="space-y-4">
                            <h4 className="text-lg font-semibold flex items-center gap-2" style={{ color: isDarkMode ? '#f9fafb' : '#1f2937' }}>
                              <MapPin className="w-5 h-5" />
                              Locations ({section.data.contact?.length || 0})
                            </h4>
                            <div className="space-y-3">
                              {section.data.contact?.slice(0, 2).map((location: any, idx: number) => (
                                <div key={idx} className="space-y-1">
                                  <p className="font-semibold" style={{ color: isDarkMode ? '#f9fafb' : '#1f2937' }}>
                                    {location.type === 'primary' ? 'Primary Location' : `Location ${idx + 1}`}
                                  </p>
                                  {location.isTelehealthOnly ? (
                                    <p className="text-sm flex items-center gap-1" style={{ color: '#10b981' }}>
                                      <Video className="w-4 h-4" />
                                      Telehealth Only
                                    </p>
                                  ) : (
                                    <p className="text-sm" style={{ color: isDarkMode ? '#a1a1aa' : '#6b7280' }}>
                                      {location.address?.street}, {location.address?.city}, {location.address?.state}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Banking Info */}
                          <div className="space-y-4">
                            <h4 className="text-lg font-semibold flex items-center gap-2" style={{ color: isDarkMode ? '#f9fafb' : '#1f2937' }}>
                              <CreditCard className="w-5 h-5" />
                              Banking
                              <motion.button
                                onClick={() => setShowSensitiveData(!showSensitiveData)}
                                className="p-1 rounded"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                {showSensitiveData ? (
                                  <EyeOff className="w-4 h-4" style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }} />
                                ) : (
                                  <Eye className="w-4 h-4" style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }} />
                                )}
                              </motion.button>
                            </h4>
                            <div className="space-y-3">
                              <div>
                                <span className="text-sm font-medium" style={{ color: isDarkMode ? '#a1a1aa' : '#6b7280' }}>Account Type:</span>
                                <p className="font-semibold" style={{ color: isDarkMode ? '#f9fafb' : '#1f2937' }}>
                                  {section.data.payout?.bankAccount?.accountType || 'Not specified'}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium" style={{ color: isDarkMode ? '#a1a1aa' : '#6b7280' }}>Account:</span>
                                <p className="font-mono text-sm" style={{ color: isDarkMode ? '#f9fafb' : '#1f2937' }}>
                                  {maskSensitiveData(section.data.payout?.bankAccount?.accountNumber || '', 'account')}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {section.id === 'credentials' && (
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold" style={{ color: isDarkMode ? '#f9fafb' : '#1f2937' }}>
                            Professional Credentials ({section.data.length})
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {section.data.slice(0, 4).map((credential: any, idx: number) => (
                              <motion.div
                                key={idx}
                                className="p-4 rounded-xl"
                                style={{
                                  backgroundColor: isDarkMode ? '#374151' : '#f8fafc',
                                  borderWidth: '1px',
                                  borderStyle: 'solid',
                                  borderColor: isDarkMode ? '#4b5563' : '#e2e8f0',
                                }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                              >
                                <div className="flex items-center gap-3 mb-2">
                                  <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: section.color + '20' }}
                                  >
                                    <FileCheck className="w-4 h-4" style={{ color: section.color }} />
                                  </div>
                                  <span className="font-semibold" style={{ color: isDarkMode ? '#f9fafb' : '#1f2937' }}>
                                    {credential.title}
                                  </span>
                                </div>
                                <p className="text-sm" style={{ color: isDarkMode ? '#a1a1aa' : '#6b7280' }}>
                                  {credential.issuingOrganization}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span
                                    className="px-2 py-1 rounded-full text-xs font-medium"
                                    style={{
                                      backgroundColor: credential.status === 'verified' ? '#10b98120' : '#f59e0b20',
                                      color: credential.status === 'verified' ? '#10b981' : '#f59e0b',
                                    }}
                                  >
                                    {credential.status}
                                  </span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {section.id === 'compliance' && (
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold" style={{ color: isDarkMode ? '#f9fafb' : '#1f2937' }}>
                            Training Modules ({section.data.filter((m: any) => m.completed).length}/{section.data.length})
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {section.data.map((module: any, idx: number) => (
                              <motion.div
                                key={idx}
                                className="p-4 rounded-xl"
                                style={{
                                  backgroundColor: module.completed 
                                    ? (isDarkMode ? '#065f46' : '#ecfdf5')
                                    : (isDarkMode ? '#374151' : '#f8fafc'),
                                  borderWidth: '1px',
                                  borderStyle: 'solid',
                                  borderColor: module.completed ? '#10b981' : (isDarkMode ? '#4b5563' : '#e2e8f0'),
                                }}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                              >
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="flex items-center gap-2">
                                    {module.completed ? (
                                      <CheckCircle className="w-5 h-5 text-green-500" />
                                    ) : (
                                      <Clock className="w-5 h-5" style={{ color: '#f59e0b' }} />
                                    )}
                                    <span className="font-semibold" style={{ 
                                      color: module.completed 
                                        ? (isDarkMode ? '#10b981' : '#065f46')
                                        : (isDarkMode ? '#f9fafb' : '#1f2937')
                                    }}>
                                      {module.name}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-sm mb-2" style={{ 
                                  color: module.completed 
                                    ? (isDarkMode ? '#a7f3d0' : '#047857')
                                    : (isDarkMode ? '#a1a1aa' : '#6b7280')
                                }}>
                                  {module.duration} minutes
                                </p>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="h-2 rounded-full"
                                    style={{
                                      width: `${module.watchedPercentage}%`,
                                      backgroundColor: module.completed ? '#10b981' : '#f59e0b',
                                    }}
                                  />
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {section.id === 'workflow' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Availability */}
                          <div className="space-y-4">
                            <h4 className="text-lg font-semibold flex items-center gap-2" style={{ color: isDarkMode ? '#f9fafb' : '#1f2937' }}>
                              <Calendar className="w-5 h-5" />
                              Weekly Availability
                            </h4>
                            <div className="space-y-2">
                              {section.data?.availability?.filter((slot: any) => slot.enabled).map((slot: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-lg" style={{
                                  backgroundColor: isDarkMode ? '#374151' : '#f8fafc',
                                }}>
                                  <span className="font-medium" style={{ color: isDarkMode ? '#f9fafb' : '#1f2937' }}>
                                    {slot.day}
                                  </span>
                                  <span className="text-sm" style={{ color: isDarkMode ? '#a1a1aa' : '#6b7280' }}>
                                    {slot.startTime} - {slot.endTime}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Appointment Types */}
                          <div className="space-y-4">
                            <h4 className="text-lg font-semibold flex items-center gap-2" style={{ color: isDarkMode ? '#f9fafb' : '#1f2937' }}>
                              <Users className="w-5 h-5" />
                              Services ({section.data?.appointmentTypes?.length || 0})
                            </h4>
                            <div className="space-y-3">
                              {section.data?.appointmentTypes?.slice(0, 3).map((apt: any, idx: number) => (
                                <div key={idx} className="p-3 rounded-lg" style={{
                                  backgroundColor: isDarkMode ? '#374151' : '#f8fafc',
                                }}>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold" style={{ color: isDarkMode ? '#f9fafb' : '#1f2937' }}>
                                      {apt.name}
                                    </span>
                                    <span className="font-bold" style={{ color: apt.color }}>
                                      ${apt.price}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm" style={{ color: isDarkMode ? '#a1a1aa' : '#6b7280' }}>
                                    <span>{apt.duration} min</span>
                                    <div className="flex items-center gap-2">
                                      {apt.isVirtual && <Video className="w-4 h-4" />}
                                      {apt.isInPerson && <MapPin className="w-4 h-4" />}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
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
        transition={{ duration: 0.5, delay: 0.7 }}
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
            Back to Workflow
          </span>
        </motion.button>

        {/* Enhanced Submit Button */}
        <motion.button
          onClick={onSubmit}
          disabled={isLoading || !canSubmit}
          className="relative overflow-hidden rounded-2xl"
          style={{
            background: (isLoading || !canSubmit)
              ? (isDarkMode ? '#4b5563' : '#e5e7eb')
              : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderWidth: '0px',
            padding: '16px 32px',
            boxShadow: (isLoading || !canSubmit)
              ? 'none' 
              : '0 10px 25px rgba(16, 185, 129, 0.4), 0 4px 6px rgba(5, 150, 105, 0.3)',
            cursor: (isLoading || !canSubmit) ? 'not-allowed' : 'pointer',
          }}
          whileHover={!(isLoading || !canSubmit) ? { 
            scale: 1.05, 
            y: -3,
            boxShadow: '0 15px 30px rgba(16, 185, 129, 0.5), 0 8px 12px rgba(5, 150, 105, 0.4)'
          } : {}}
          whileTap={!(isLoading || !canSubmit) ? { scale: 0.98 } : {}}
        >
          {/* Enhanced Shimmer effect */}
          <AnimatePresence>
            {!(isLoading || !canSubmit) && (
              <motion.div
                className="absolute inset-0 -skew-x-12"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
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
                  Submitting Application...
                </span>
              </>
            ) : !canSubmit ? (
              <>
                <AlertTriangle className="w-6 h-6" style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }} />
                <span 
                  className="font-bold text-lg"
                  style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
                >
                  Complete all sections to submit
                </span>
              </>
            ) : (
              <>
                <Trophy className="w-6 h-6 text-white" />
                <span className="font-bold text-lg text-white">
                  Submit Application
                </span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Send className="w-6 h-6 text-white" />
                </motion.div>
              </>
            )}
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
}