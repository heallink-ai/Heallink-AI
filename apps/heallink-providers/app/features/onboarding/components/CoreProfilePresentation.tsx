"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  User, 
  MapPin, 
  CreditCard, 
  FileText, 
  Plus, 
  Trash2,
  Building,
  Phone,
  Mail,
  Calendar,
  CreditCard as IdCard,
  Shield,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Lock,
  Star
} from "lucide-react";
import { InputField, SelectField, FileUpload, ToggleField } from "./FormComponents";
import { LegalIdentity, ContactLocation, PayoutTax } from "../types";

interface CoreProfilePresentationProps {
  legalIdentity: Partial<LegalIdentity>;
  contactLocations: ContactLocation[];
  payoutTax: Partial<PayoutTax>;
  onLegalIdentityChange: (data: Partial<LegalIdentity>) => void;
  onContactLocationChange: (index: number, data: Partial<ContactLocation>) => void;
  onAddContactLocation: () => void;
  onRemoveContactLocation: (index: number) => void;
  onPayoutTaxChange: (data: Partial<PayoutTax>) => void;
  onContinue: () => void;
  onBack: () => void;
  isLoading: boolean;
  errors: any;
}

export default function CoreProfilePresentation({
  legalIdentity,
  contactLocations,
  payoutTax,
  onLegalIdentityChange,
  onContactLocationChange,
  onAddContactLocation,
  onRemoveContactLocation,
  onPayoutTaxChange,
  onContinue,
  onBack,
  isLoading,
  errors,
}: CoreProfilePresentationProps) {
  const [activeSection, setActiveSection] = useState<'legal' | 'contact' | 'payout'>('legal');
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

  const sections = [
    { id: 'legal', name: 'Legal Identity', icon: User, description: 'Personal information and identification' },
    { id: 'contact', name: 'Contact & Practice', icon: MapPin, description: 'Locations and contact information' },
    { id: 'payout', name: 'Payout & Tax', icon: CreditCard, description: 'Banking and tax information' },
  ];

  const idTypes = [
    { value: 'ssn', label: 'Social Security Number' },
    { value: 'passport', label: 'Passport' },
    { value: 'driver-license', label: 'Driver License' },
    { value: 'ein', label: 'Employer Identification Number' },
  ];

  const accountTypes = [
    { value: 'checking', label: 'Checking Account' },
    { value: 'savings', label: 'Savings Account' },
  ];

  const taxIdTypes = [
    { value: 'ssn', label: 'Social Security Number' },
    { value: 'ein', label: 'Employer Identification Number' },
  ];

  const stateOptions = [
    { value: 'CA', label: 'California' },
    { value: 'NY', label: 'New York' },
    { value: 'TX', label: 'Texas' },
    { value: 'FL', label: 'Florida' },
    // Add more states as needed
  ];

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
            scale: [1, 1.02, 1],
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
              background: 'linear-gradient(135deg, #5a2dcf 0%, #2066e4 100%)',
              boxShadow: '0 10px 20px rgba(90, 45, 207, 0.3)',
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
            <User className="w-10 h-10 text-white relative z-10" />
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
              <Sparkles className="w-3 h-3 text-purple-500" />
            </motion.div>
          ))}
        </motion.div>

        <div>
          <motion.h1 
            className="text-4xl font-bold mb-3"
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
            Build Your Professional Profile
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
            Complete your professional information to verify your identity and set up payments
          </motion.p>
        </div>
      </motion.div>

      {/* Enhanced Section Navigation */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex flex-wrap gap-6 justify-center">
          {sections.map((section, index) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            const isCompleted = index < sections.findIndex(s => s.id === activeSection);
            
            return (
              <motion.button
                key={section.id}
                onClick={() => setActiveSection(section.id as any)}
                className="relative group overflow-hidden"
                style={{
                  background: isActive 
                    ? 'linear-gradient(135deg, #5a2dcf 0%, #2066e4 100%)'
                    : isCompleted
                      ? (isDarkMode ? 'linear-gradient(135deg, #065f46 0%, #1f2937 100%)' : 'linear-gradient(135deg, #ecfdf5 0%, #f0f9ff 100%)')
                      : (isDarkMode ? 'linear-gradient(135deg, #374151 0%, #1f2937 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'),
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: isActive 
                    ? 'transparent'
                    : isCompleted 
                      ? '#10b981'
                      : (isDarkMode ? '#4b5563' : '#e2e8f0'),
                  borderRadius: '20px',
                  padding: '20px 24px',
                  boxShadow: isActive
                    ? '0 10px 25px rgba(90, 45, 207, 0.3), 0 4px 6px rgba(90, 45, 207, 0.2)'
                    : isCompleted
                      ? '0 8px 16px rgba(16, 185, 129, 0.15)'
                      : (isDarkMode ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)'),
                }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  boxShadow: isActive
                    ? '0 15px 30px rgba(90, 45, 207, 0.4), 0 8px 12px rgba(90, 45, 207, 0.3)'
                    : '0 12px 20px rgba(0, 0, 0, 0.15)'
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              >
                {/* Shimmer effect for active state */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 -skew-x-12"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
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

                <div className="flex items-center gap-4 relative z-10">
                  {/* Enhanced Icon Container */}
                  <motion.div
                    className="relative"
                    animate={{
                      rotate: isActive ? [0, 5, -5, 0] : 0,
                      scale: isActive ? [1, 1.05, 1] : 1,
                    }}
                    transition={{
                      duration: 3,
                      repeat: isActive ? Infinity : 0,
                      ease: "easeInOut"
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center relative overflow-hidden"
                      style={{
                        background: isActive 
                          ? 'rgba(255, 255, 255, 0.2)'
                          : isCompleted 
                            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                            : (isDarkMode ? 'rgba(156, 163, 175, 0.1)' : 'rgba(107, 114, 128, 0.1)'),
                        backdropFilter: isActive ? 'blur(10px)' : 'none',
                      }}
                    >
                      <AnimatePresence mode="wait">
                        {isCompleted && !isActive ? (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ duration: 0.3 }}
                          >
                            <CheckCircle className="w-6 h-6 text-white" />
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Icon 
                              className="w-6 h-6" 
                              style={{ 
                                color: isActive ? '#ffffff' : isCompleted ? '#ffffff' : (isDarkMode ? '#9ca3af' : '#6b7280')
                              }}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Status indicator for completed */}
                    <AnimatePresence>
                      {isCompleted && !isActive && (
                        <motion.div
                          className="absolute -top-1 -right-1"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Star className="w-4 h-4 text-green-400 fill-current" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Text Content */}
                  <div className="text-left min-w-0">
                    <h3 
                      className="font-bold text-lg leading-tight"
                      style={{ 
                        color: isActive ? '#ffffff' : isCompleted ? '#10b981' : (isDarkMode ? '#f9fafb' : '#1f2937')
                      }}
                    >
                      {section.name}
                    </h3>
                    <p 
                      className="text-sm leading-relaxed mt-1"
                      style={{ 
                        color: isActive ? 'rgba(255, 255, 255, 0.8)' : isCompleted ? '#065f46' : (isDarkMode ? '#d1d5db' : '#64748b')
                      }}
                    >
                      {section.description}
                    </p>
                  </div>

                  {/* Arrow indicator for active */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ArrowRight className="w-5 h-5 text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Enhanced Section Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 30, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -30, scale: 0.98 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="space-y-8"
        >
          {/* Legal Identity Section */}
          {activeSection === 'legal' && (
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Enhanced Section Header */}
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
                      background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                      boxShadow: '0 10px 25px rgba(30, 64, 175, 0.3)',
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
                    <User className="w-10 h-10 text-white relative z-10" />
                  </div>
                </motion.div>

                <div>
                  <h2 
                    className="text-3xl font-bold mb-3"
                    style={{ color: isDarkMode ? '#f9fafb' : '#1f2937' }}
                  >
                    Legal Identity Verification
                  </h2>
                  <p 
                    className="text-lg max-w-xl mx-auto"
                    style={{ 
                      color: isDarkMode ? '#d1d5db' : '#64748b',
                      lineHeight: '1.6',
                    }}
                  >
                    Provide your legal name and government identification for secure verification
                  </p>
                </div>
              </motion.div>

              {/* Enhanced Personal Information Form */}
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
                    ? '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)' 
                    : '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <motion.div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                      }}
                      animate={{
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <User className="w-5 h-5 text-white" />
                    </motion.div>
                    <h3 
                      className="text-xl font-bold"
                      style={{ color: isDarkMode ? '#f9fafb' : '#1f2937' }}
                    >
                      Personal Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="First Name"
                      name="firstName"
                      value={legalIdentity.firstName || ""}
                      onChange={(value) => onLegalIdentityChange({ ...legalIdentity, firstName: value })}
                      placeholder="Enter your first name"
                      required
                      icon={<User className="w-4 h-4" />}
                      error={errors?.firstName}
                    />

                    <InputField
                      label="Middle Name"
                      name="middleName"
                      value={legalIdentity.middleName || ""}
                      onChange={(value) => onLegalIdentityChange({ ...legalIdentity, middleName: value })}
                      placeholder="Enter your middle name (optional)"
                      icon={<User className="w-4 h-4" />}
                    />

                    <InputField
                      label="Last Name"
                      name="lastName"
                      value={legalIdentity.lastName || ""}
                      onChange={(value) => onLegalIdentityChange({ ...legalIdentity, lastName: value })}
                      placeholder="Enter your last name"
                      required
                      icon={<User className="w-4 h-4" />}
                      error={errors?.lastName}
                    />

                    <InputField
                      label="Date of Birth"
                      name="dateOfBirth"
                      type="date"
                      value={legalIdentity.dateOfBirth || ""}
                      onChange={(value) => onLegalIdentityChange({ ...legalIdentity, dateOfBirth: value })}
                      required
                      icon={<Calendar className="w-4 h-4" />}
                      error={errors?.dateOfBirth}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Enhanced Government ID Section */}
              <motion.div
                className="relative overflow-hidden rounded-3xl"
                style={{
                  background: isDarkMode 
                    ? 'linear-gradient(135deg, #065f46 0%, #1f2937 100%)' 
                    : 'linear-gradient(135deg, #ecfdf5 0%, #f0f9ff 100%)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: isDarkMode ? '#059669' : '#a7f3d0',
                  boxShadow: '0 20px 25px -5px rgba(16, 185, 129, 0.15), 0 10px 10px -5px rgba(16, 185, 129, 0.1)',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <motion.div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                      }}
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Shield className="w-5 h-5 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 
                        className="text-xl font-bold"
                        style={{ color: isDarkMode ? '#10b981' : '#065f46' }}
                      >
                        Government Identification
                      </h3>
                      <p 
                        className="text-sm mt-1"
                        style={{ color: isDarkMode ? '#a7f3d0' : '#047857' }}
                      >
                        Secure verification with end-to-end encryption
                      </p>
                    </div>
                    <Lock className="w-5 h-5" style={{ color: '#10b981' }} />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SelectField
                      label="ID Type"
                      name="idType"
                      value={legalIdentity.governmentId?.type || ""}
                      onChange={(value) => onLegalIdentityChange({
                        ...legalIdentity,
                        governmentId: { ...legalIdentity.governmentId, type: value as any }
                      })}
                      options={idTypes}
                      required
                      icon={<Shield className="w-4 h-4" />}
                    />

                    <InputField
                      label="ID Number"
                      name="idNumber"
                      value={legalIdentity.governmentId?.number || ""}
                      onChange={(value) => onLegalIdentityChange({
                        ...legalIdentity,
                        governmentId: { ...legalIdentity.governmentId, number: value }
                      })}
                      placeholder="Enter your ID number"
                      required
                      mask={legalIdentity.governmentId?.type === 'ssn' ? 'ssn' : legalIdentity.governmentId?.type === 'ein' ? 'ein' : undefined}
                      icon={<IdCard className="w-4 h-4" />}
                    />
                  </div>

                  <div className="mt-6">
                    <FileUpload
                      label="Upload ID Document"
                      name="idDocument"
                      value={legalIdentity.governmentId?.uploadedDocument}
                      onChange={(file) => onLegalIdentityChange({
                        ...legalIdentity,
                        governmentId: { ...legalIdentity.governmentId, uploadedDocument: file }
                      })}
                      accept=".pdf,.jpg,.jpeg,.png"
                      description="Upload a clear photo or scan of your government ID"
                      icon={<FileText className="w-4 h-4" />}
                      required
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Contact & Practice Locations Section */}
          {activeSection === 'contact' && (
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Enhanced Section Header */}
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
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div
                    className="w-20 h-20 rounded-3xl flex items-center justify-center relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #dc2626 0%, #ea580c 100%)',
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
                    <MapPin className="w-10 h-10 text-white relative z-10" />
                  </div>
                </motion.div>

                <div>
                  <h2 
                    className="text-3xl font-bold mb-3"
                    style={{ color: isDarkMode ? '#f9fafb' : '#1f2937' }}
                  >
                    Practice Locations
                  </h2>
                  <p 
                    className="text-lg max-w-xl mx-auto"
                    style={{ 
                      color: isDarkMode ? '#d1d5db' : '#64748b',
                      lineHeight: '1.6',
                    }}
                  >
                    Add your practice locations and contact information for patients to find you
                  </p>
                </div>
              </motion.div>

              {/* Enhanced Location Cards */}
              {contactLocations.map((location, index) => (
                <motion.div
                  key={location.id}
                  className="relative overflow-hidden rounded-3xl"
                  style={{
                    background: isDarkMode 
                      ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' 
                      : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: isDarkMode ? '#374151' : '#e2e8f0',
                    boxShadow: isDarkMode 
                      ? '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)' 
                      : '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <Building className="w-5 h-5" />
                        {location.type === 'primary' ? 'Primary Location' : `Additional Location ${index}`}
                      </h3>
                      {location.type !== 'primary' && (
                        <button
                          onClick={() => onRemoveContactLocation(index)}
                          className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      )}
                    </div>

                    <ToggleField
                      label="Telehealth Only Location"
                      name={`telehealth-${index}`}
                      value={location.isTelehealthOnly}
                      onChange={(value) => onContactLocationChange(index, { ...location, isTelehealthOnly: value })}
                      description="Check this if this is a virtual/telehealth only practice location"
                    />

                    {!location.isTelehealthOnly && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <InputField
                            label="Street Address"
                            name={`street-${index}`}
                            value={location.address?.street || ""}
                            onChange={(value) => onContactLocationChange(index, {
                              ...location,
                              address: { ...location.address, street: value }
                            })}
                            placeholder="Enter street address"
                            required
                            icon={<MapPin className="w-4 h-4" />}
                          />
                        </div>

                        <InputField
                          label="City"
                          name={`city-${index}`}
                          value={location.address?.city || ""}
                          onChange={(value) => onContactLocationChange(index, {
                            ...location,
                            address: { ...location.address, city: value }
                          })}
                          placeholder="Enter city"
                          required
                        />

                        <SelectField
                          label="State"
                          name={`state-${index}`}
                          value={location.address?.state || ""}
                          onChange={(value) => onContactLocationChange(index, {
                            ...location,
                            address: { ...location.address, state: value }
                          })}
                          options={stateOptions}
                          required
                        />

                        <InputField
                          label="ZIP Code"
                          name={`zip-${index}`}
                          value={location.address?.zipCode || ""}
                          onChange={(value) => onContactLocationChange(index, {
                            ...location,
                            address: { ...location.address, zipCode: value }
                          })}
                          placeholder="Enter ZIP code"
                          required
                        />

                        <InputField
                          label="Country"
                          name={`country-${index}`}
                          value={location.address?.country || "United States"}
                          onChange={(value) => onContactLocationChange(index, {
                            ...location,
                            address: { ...location.address, country: value }
                          })}
                          placeholder="Enter country"
                          required
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField
                        label="Phone Number"
                        name={`phone-${index}`}
                        value={location.phone || ""}
                        onChange={(value) => onContactLocationChange(index, { ...location, phone: value })}
                        placeholder="Enter phone number"
                        required
                        mask="phone"
                        icon={<Phone className="w-4 h-4" />}
                      />

                      <InputField
                        label="Email Address"
                        name={`email-${index}`}
                        type="email"
                        value={location.email || ""}
                        onChange={(value) => onContactLocationChange(index, { ...location, email: value })}
                        placeholder="Enter email address"
                        required
                        icon={<Mail className="w-4 h-4" />}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Enhanced Add Location Button */}
              <motion.button
                onClick={onAddContactLocation}
                className="w-full relative overflow-hidden rounded-3xl"
                style={{
                  background: isDarkMode 
                    ? 'linear-gradient(135deg, #374151 0%, #1f2937 100%)' 
                    : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  borderWidth: '2px',
                  borderStyle: 'dashed',
                  borderColor: '#5a2dcf',
                  padding: '24px',
                }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 180, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Plus className="w-6 h-6 text-purple-500" />
                  </motion.div>
                  <span className="text-lg font-semibold text-purple-500">
                    Add Additional Location
                  </span>
                </div>
              </motion.button>
            </motion.div>
          )}

        {/* Payout & Tax Section */}
        {activeSection === 'payout' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-heart to-royal-blue flex items-center justify-center mb-4">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Payout & Tax Information</h2>
              <p className="text-muted-foreground">
                Set up your banking and tax information for payments
              </p>
            </div>

            {/* Bank Account Section */}
            <div className="space-y-6 p-6 neumorph-card rounded-xl">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Bank Account Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField
                  label="Account Type"
                  name="accountType"
                  value={payoutTax.bankAccount?.accountType || ""}
                  onChange={(value) => onPayoutTaxChange({
                    ...payoutTax,
                    bankAccount: { ...payoutTax.bankAccount, accountType: value as any }
                  })}
                  options={accountTypes}
                  required
                />

                <InputField
                  label="Account Holder Name"
                  name="accountHolderName"
                  value={payoutTax.bankAccount?.accountHolderName || ""}
                  onChange={(value) => onPayoutTaxChange({
                    ...payoutTax,
                    bankAccount: { ...payoutTax.bankAccount, accountHolderName: value }
                  })}
                  placeholder="Name on account"
                  required
                />

                <InputField
                  label="Routing Number"
                  name="routingNumber"
                  value={payoutTax.bankAccount?.routingNumber || ""}
                  onChange={(value) => onPayoutTaxChange({
                    ...payoutTax,
                    bankAccount: { ...payoutTax.bankAccount, routingNumber: value }
                  })}
                  placeholder="9-digit routing number"
                  required
                />

                <InputField
                  label="Account Number"
                  name="accountNumber"
                  value={payoutTax.bankAccount?.accountNumber || ""}
                  onChange={(value) => onPayoutTaxChange({
                    ...payoutTax,
                    bankAccount: { ...payoutTax.bankAccount, accountNumber: value }
                  })}
                  placeholder="Account number"
                  required
                />
              </div>
            </div>

            {/* Tax Information Section */}
            <div className="space-y-6 p-6 neumorph-card rounded-xl">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Tax Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField
                  label="Tax ID Type"
                  name="taxIdType"
                  value={payoutTax.taxInfo?.taxIdType || ""}
                  onChange={(value) => onPayoutTaxChange({
                    ...payoutTax,
                    taxInfo: { ...payoutTax.taxInfo, taxIdType: value as any }
                  })}
                  options={taxIdTypes}
                  required
                />

                <InputField
                  label="Tax ID Number"
                  name="taxId"
                  value={payoutTax.taxInfo?.taxId || ""}
                  onChange={(value) => onPayoutTaxChange({
                    ...payoutTax,
                    taxInfo: { ...payoutTax.taxInfo, taxId: value }
                  })}
                  placeholder="Enter tax ID"
                  required
                  mask={payoutTax.taxInfo?.taxIdType === 'ssn' ? 'ssn' : payoutTax.taxInfo?.taxIdType === 'ein' ? 'ein' : undefined}
                />
              </div>

              {payoutTax.taxInfo?.taxIdType === 'ein' && (
                <InputField
                  label="Corporate Tax ID (if different)"
                  name="corporateTaxId"
                  value={payoutTax.taxInfo?.corporateTaxId || ""}
                  onChange={(value) => onPayoutTaxChange({
                    ...payoutTax,
                    taxInfo: { ...payoutTax.taxInfo, corporateTaxId: value }
                  })}
                  placeholder="Corporate tax ID"
                  mask="ein"
                />
              )}

              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Important:</strong> You'll need to complete W-9 or W-8BEN forms electronically in the next step.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        </motion.div>
      </AnimatePresence>

      {/* Enhanced Navigation Buttons */}
      <motion.div
        className="flex flex-col sm:flex-row gap-6 justify-between pt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
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
            Back to Role Selection
          </span>
        </motion.button>

        {/* Enhanced Continue Button */}
        <motion.button
          onClick={onContinue}
          disabled={isLoading}
          className="relative overflow-hidden rounded-2xl"
          style={{
            background: isLoading 
              ? (isDarkMode ? '#4b5563' : '#e5e7eb')
              : 'linear-gradient(135deg, #5a2dcf 0%, #2066e4 100%)',
            borderWidth: '0px',
            padding: '16px 32px',
            boxShadow: isLoading 
              ? 'none' 
              : '0 10px 25px rgba(90, 45, 207, 0.3), 0 4px 6px rgba(90, 45, 207, 0.2)',
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
          whileHover={!isLoading ? { 
            scale: 1.05, 
            y: -3,
            boxShadow: '0 15px 30px rgba(90, 45, 207, 0.4), 0 8px 12px rgba(90, 45, 207, 0.3)'
          } : {}}
          whileTap={!isLoading ? { scale: 0.98 } : {}}
        >
          {/* Shimmer effect */}
          <AnimatePresence>
            {!isLoading && (
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
                  Saving Profile...
                </span>
              </>
            ) : (
              <>
                <CheckCircle className="w-6 h-6 text-white" />
                <span className="font-bold text-lg text-white">
                  Continue to Credentials
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