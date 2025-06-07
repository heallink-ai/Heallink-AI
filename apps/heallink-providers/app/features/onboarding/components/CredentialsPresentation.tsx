"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  Upload, 
  FileText, 
  FileCheck as Certificate, 
  Shield, 
  CheckCircle,
  AlertCircle,
  Star,
  Award,
  BookOpen,
  GraduationCap,
  Briefcase,
  Clock,
  ArrowRight,
  Plus,
  X,
  Eye
} from "lucide-react";
import { FileUpload, InputField, SelectField } from "./FormComponents";

interface Credential {
  id: string;
  type: 'license' | 'certification' | 'education' | 'experience';
  title: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate?: string;
  credentialNumber: string;
  file?: File;
  status: 'pending' | 'verified' | 'rejected';
}

interface CredentialsPresentationProps {
  credentials: Credential[];
  onCredentialAdd: (credential: Omit<Credential, 'id' | 'status'>) => void;
  onCredentialRemove: (id: string) => void;
  onCredentialUpdate: (id: string, credential: Partial<Credential>) => void;
  onContinue: () => void;
  onBack: () => void;
  isLoading: boolean;
  errors: any;
}

export default function CredentialsPresentation({
  credentials,
  onCredentialAdd,
  onCredentialRemove,
  onCredentialUpdate,
  onContinue,
  onBack,
  isLoading,
  errors,
}: CredentialsPresentationProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCredential, setNewCredential] = useState({
    type: 'license' as const,
    title: '',
    issuingOrganization: '',
    issueDate: '',
    expirationDate: '',
    credentialNumber: '',
    file: undefined as File | undefined,
  });

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

  const credentialTypes = [
    { value: 'license', label: 'Professional License' },
    { value: 'certification', label: 'Board Certification' },
    { value: 'education', label: 'Education Degree' },
    { value: 'experience', label: 'Work Experience' },
  ];

  const getCredentialIcon = (type: string) => {
    switch (type) {
      case 'license':
        return <Certificate className="w-6 h-6" />;
      case 'certification':
        return <Award className="w-6 h-6" />;
      case 'education':
        return <GraduationCap className="w-6 h-6" />;
      case 'experience':
        return <Briefcase className="w-6 h-6" />;
      default:
        return <FileText className="w-6 h-6" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return '#10b981';
      case 'rejected':
        return '#ef4444';
      default:
        return '#f59e0b';
    }
  };

  const handleAddCredential = () => {
    if (newCredential.title && newCredential.issuingOrganization && newCredential.issueDate) {
      onCredentialAdd(newCredential);
      setNewCredential({
        type: 'license',
        title: '',
        issuingOrganization: '',
        issueDate: '',
        expirationDate: '',
        credentialNumber: '',
        file: undefined,
      });
      setShowAddForm(false);
    }
  };

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
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)',
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
            <Certificate className="w-10 h-10 text-white relative z-10" />
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
              <Star className="w-3 h-3 text-yellow-500" />
            </motion.div>
          ))}
        </motion.div>

        <div>
          <motion.h1 
            className="text-4xl font-bold mb-3"
            style={{
              background: 'linear-gradient(135deg, #1f2937 0%, #f59e0b 50%, #d97706 100%)',
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
            Professional Credentials
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
            Upload your licenses, certifications, education, and experience documents for verification
          </motion.p>
        </div>
      </motion.div>

      {/* Credentials List */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {credentials.map((credential, index) => (
          <motion.div
            key={credential.id}
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
            <div className="p-8">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {/* Credential Icon */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${getStatusColor(credential.status)}20 0%, ${getStatusColor(credential.status)}10 100%)`,
                      border: `2px solid ${getStatusColor(credential.status)}30`,
                    }}
                  >
                    <span style={{ color: getStatusColor(credential.status) }}>
                      {getCredentialIcon(credential.type)}
                    </span>
                  </div>

                  {/* Credential Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 
                        className="text-xl font-bold"
                        style={{ color: isDarkMode ? '#f9fafb' : '#1f2937' }}
                      >
                        {credential.title}
                      </h3>
                      <div
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${getStatusColor(credential.status)}20`,
                          color: getStatusColor(credential.status),
                        }}
                      >
                        {credential.status}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p 
                        className="font-medium"
                        style={{ color: isDarkMode ? '#d1d5db' : '#4b5563' }}
                      >
                        {credential.issuingOrganization}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                          Issued: {new Date(credential.issueDate).toLocaleDateString()}
                        </span>
                        {credential.expirationDate && (
                          <span style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                            Expires: {new Date(credential.expirationDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {credential.credentialNumber && (
                        <p 
                          className="text-sm font-mono"
                          style={{ color: isDarkMode ? '#a1a1aa' : '#64748b' }}
                        >
                          #{credential.credentialNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {credential.file && (
                    <motion.button
                      className="p-2 rounded-lg transition-colors"
                      style={{
                        backgroundColor: 'transparent',
                        border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
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
                      <Eye className="w-4 h-4" style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }} />
                    </motion.button>
                  )}
                  <motion.button
                    onClick={() => onCredentialRemove(credential.id)}
                    className="p-2 rounded-lg transition-colors"
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid #ef4444',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Add Credential Button */}
        <AnimatePresence>
          {!showAddForm && (
            <motion.button
              onClick={() => setShowAddForm(true)}
              className="w-full relative overflow-hidden rounded-3xl"
              style={{
                background: isDarkMode 
                  ? 'linear-gradient(135deg, #374151 0%, #1f2937 100%)' 
                  : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                borderWidth: '2px',
                borderStyle: 'dashed',
                borderColor: '#f59e0b',
                padding: '32px',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-center gap-4">
                <motion.div
                  animate={{ rotate: [0, 180, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Plus className="w-8 h-8 text-amber-500" />
                </motion.div>
                <span className="text-xl font-semibold text-amber-500">
                  Add Professional Credential
                </span>
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Add Credential Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              className="relative overflow-hidden rounded-3xl"
              style={{
                background: isDarkMode 
                  ? 'linear-gradient(135deg, #065f46 0%, #1f2937 100%)' 
                  : 'linear-gradient(135deg, #ecfdf5 0%, #f0f9ff 100%)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: isDarkMode ? '#059669' : '#a7f3d0',
                boxShadow: '0 20px 25px -5px rgba(16, 185, 129, 0.15)',
              }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <h3 
                    className="text-xl font-bold"
                    style={{ color: isDarkMode ? '#10b981' : '#065f46' }}
                  >
                    Add New Credential
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SelectField
                    label="Credential Type"
                    name="type"
                    value={newCredential.type}
                    onChange={(value) => setNewCredential({ ...newCredential, type: value as any })}
                    options={credentialTypes}
                    required
                    icon={getCredentialIcon(newCredential.type)}
                  />

                  <InputField
                    label="Title"
                    name="title"
                    value={newCredential.title}
                    onChange={(value) => setNewCredential({ ...newCredential, title: value })}
                    placeholder="e.g., Medical License, Board Certification"
                    required
                    icon={<FileText className="w-4 h-4" />}
                  />

                  <InputField
                    label="Issuing Organization"
                    name="issuingOrganization"
                    value={newCredential.issuingOrganization}
                    onChange={(value) => setNewCredential({ ...newCredential, issuingOrganization: value })}
                    placeholder="e.g., State Medical Board"
                    required
                    icon={<Shield className="w-4 h-4" />}
                  />

                  <InputField
                    label="Credential Number"
                    name="credentialNumber"
                    value={newCredential.credentialNumber}
                    onChange={(value) => setNewCredential({ ...newCredential, credentialNumber: value })}
                    placeholder="License/Certificate number"
                    icon={<BookOpen className="w-4 h-4" />}
                  />

                  <InputField
                    label="Issue Date"
                    name="issueDate"
                    type="date"
                    value={newCredential.issueDate}
                    onChange={(value) => setNewCredential({ ...newCredential, issueDate: value })}
                    required
                    icon={<Clock className="w-4 h-4" />}
                  />

                  <InputField
                    label="Expiration Date"
                    name="expirationDate"
                    type="date"
                    value={newCredential.expirationDate}
                    onChange={(value) => setNewCredential({ ...newCredential, expirationDate: value })}
                    icon={<Clock className="w-4 h-4" />}
                  />
                </div>

                <div className="mt-6">
                  <FileUpload
                    label="Upload Document"
                    name="credentialFile"
                    value={newCredential.file}
                    onChange={(file) => setNewCredential({ ...newCredential, file })}
                    accept=".pdf,.jpg,.jpeg,.png"
                    description="Upload a clear copy of your credential document"
                    icon={<Upload className="w-4 h-4" />}
                    required
                  />
                </div>

                <div className="flex gap-4 mt-8">
                  <motion.button
                    onClick={handleAddCredential}
                    className="flex-1 relative overflow-hidden rounded-2xl"
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      padding: '16px 24px',
                      border: 'none',
                      boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
                    }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="font-semibold text-white flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Add Credential
                    </span>
                  </motion.button>

                  <motion.button
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-4 rounded-2xl font-semibold transition-colors"
                    style={{
                      backgroundColor: 'transparent',
                      border: `2px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
                      color: isDarkMode ? '#d1d5db' : '#4b5563',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isDarkMode ? '#374151' : '#f3f4f6';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Enhanced Navigation Buttons */}
      <motion.div
        className="flex flex-col sm:flex-row gap-6 justify-between pt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
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
            Back to Profile
          </span>
        </motion.button>

        {/* Enhanced Continue Button */}
        <motion.button
          onClick={onContinue}
          disabled={isLoading || credentials.length === 0}
          className="relative overflow-hidden rounded-2xl"
          style={{
            background: (isLoading || credentials.length === 0)
              ? (isDarkMode ? '#4b5563' : '#e5e7eb')
              : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            borderWidth: '0px',
            padding: '16px 32px',
            boxShadow: (isLoading || credentials.length === 0)
              ? 'none' 
              : '0 10px 25px rgba(245, 158, 11, 0.3), 0 4px 6px rgba(245, 158, 11, 0.2)',
            cursor: (isLoading || credentials.length === 0) ? 'not-allowed' : 'pointer',
          }}
          whileHover={!(isLoading || credentials.length === 0) ? { 
            scale: 1.05, 
            y: -3,
            boxShadow: '0 15px 30px rgba(245, 158, 11, 0.4), 0 8px 12px rgba(245, 158, 11, 0.3)'
          } : {}}
          whileTap={!(isLoading || credentials.length === 0) ? { scale: 0.98 } : {}}
        >
          {/* Shimmer effect */}
          <AnimatePresence>
            {!(isLoading || credentials.length === 0) && (
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
                  Saving Credentials...
                </span>
              </>
            ) : credentials.length === 0 ? (
              <>
                <AlertCircle className="w-6 h-6" style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }} />
                <span 
                  className="font-bold text-lg"
                  style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
                >
                  Add credentials to continue
                </span>
              </>
            ) : (
              <>
                <CheckCircle className="w-6 h-6 text-white" />
                <span className="font-bold text-lg text-white">
                  Continue to Compliance
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