"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import OnboardingLayout from "../components/OnboardingLayout";
import RoleSelectionPresentation from "../components/RoleSelectionPresentation";
import { useOnboarding } from "../providers/OnboardingProvider";
import { ProviderRole, ProviderRoleCategory, SelectedRole } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, 
  Users, 
  Settings, 
  Plus, 
  ArrowRight, 
  Star,
  Trophy,
  Target,
  Layers
} from "lucide-react";

const ROLE_CATEGORIES: ProviderRoleCategory[] = [
  {
    id: "clinical",
    name: "Clinical",
    description: "Direct patient care providers and medical professionals",
    icon: "🩺",
    roles: [
      "physician",
      "nurse-practitioner",
      "physician-assistant",
      "registered-nurse",
      "therapist",
    ],
  },
  {
    id: "ancillary",
    name: "Ancillary",
    description: "Supporting healthcare services and specialized providers",
    icon: "🔬",
    roles: ["lab", "imaging", "pharmacy", "dme", "billing-coding"],
  },
  {
    id: "facility",
    name: "Facility",
    description: "Healthcare facilities and care delivery locations",
    icon: "🏥",
    roles: ["hospital", "asc", "urgent-care", "home-health"],
  },
  {
    id: "digital-only",
    name: "Digital-only",
    description: "Technology-enabled healthcare and remote services",
    icon: "💻",
    roles: ["telehealth-group", "remote-monitoring", "digital-therapeutics"],
  },
];

const STEP_TITLES = [
  "Choose Roles",
  "Profile",
  "Credentials",
  "Compliance",
  "Workflow",
  "Review",
];

export default function RoleSelectionContainer() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const {
    progress,
    isLoading,
    updateSelectedRoles,
    goToNextStep,
    saveProgress,
  } = useOnboarding();

  useEffect(() => {
    // Check if dark mode is active
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();

    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Show stats after a short delay
    setTimeout(() => setShowStats(true), 1000);

    return () => observer.disconnect();
  }, []);

  const handleRoleSelect = (categoryId: string, roleId: string) => {
    const role = roleId as ProviderRole;
    const selectedRoles = progress.selectedRoles;
    const isAlreadySelected = selectedRoles.some((sr) => sr.role === role);

    if (isAlreadySelected) {
      const newRoles = selectedRoles.filter((sr) => sr.role !== role);
      updateSelectedRoles(newRoles);
    } else {
      const newRole: SelectedRole = {
        role,
        category: categoryId,
      };
      updateSelectedRoles([...selectedRoles, newRole]);
    }
  };

  const handleRoleDeselect = (roleId: string) => {
    const newRoles = progress.selectedRoles.filter((sr) => sr.role !== roleId);
    updateSelectedRoles(newRoles);
  };

  const handleCustomRoleAdd = (description: string) => {
    const customRole: SelectedRole = {
      role: "other",
      category: "clinical",
      customDescription: description,
    };
    updateSelectedRoles([...progress.selectedRoles, customRole]);
  };

  const handleContinue = async () => {
    if (progress.selectedRoles.length === 0) return;

    const saved = await saveProgress();
    if (saved) {
      goToNextStep();
      router.push("/onboarding/core-profile");
    }
  };

  const handleSave = () => {
    saveProgress();
  };

  const sidebarContent = (
    <div className="space-y-6">
      {/* Selection Counter Card */}
      <motion.div
        className="relative overflow-hidden rounded-2xl"
        style={{
          background: isDarkMode 
            ? 'linear-gradient(135deg, #3730a3 0%, #1e1b4b 100%)' 
            : 'linear-gradient(135deg, #8b5cf6 0%, #5a2dcf 100%)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: isDarkMode ? '#4338ca' : '#7c3aed',
          boxShadow: '0 10px 25px rgba(90, 45, 207, 0.3)',
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <div className="relative p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Target className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h3 className="font-bold text-lg">Your Progress</h3>
                <p className="text-white/80 text-sm">Keep going!</p>
              </div>
            </div>
            
            <motion.div
              className="text-right"
              animate={{
                scale: progress.selectedRoles.length > 0 ? [1, 1.1, 1] : 1,
              }}
              transition={{
                duration: 0.5,
                repeat: progress.selectedRoles.length > 0 ? Infinity : 0,
              }}
            >
              <div className="text-3xl font-bold">
                {progress.selectedRoles.length}
              </div>
              <div className="text-white/80 text-xs">
                {progress.selectedRoles.length === 1 ? 'Selection' : 'Selections'}
              </div>
            </motion.div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-2 mb-3">
            <motion.div
              className="bg-white rounded-full h-2"
              initial={{ width: "0%" }}
              animate={{ 
                width: `${Math.min((progress.selectedRoles.length / 3) * 100, 100)}%` 
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          
          <p className="text-white/90 text-sm">
            {progress.selectedRoles.length === 0 
              ? "Start by selecting your provider types"
              : progress.selectedRoles.length < 3
                ? "Great start! You can select more if needed"
                : "Excellent selection! Ready to proceed"
            }
          </p>
        </div>
      </motion.div>

      {/* Enhanced Guidelines Card */}
      <motion.div
        className="relative overflow-hidden rounded-2xl"
        style={{
          background: isDarkMode 
            ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' 
            : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: isDarkMode ? '#374151' : '#e2e8f0',
          boxShadow: isDarkMode 
            ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)' 
            : '0 10px 15px -3px rgba(0, 0, 0, 0.08)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              className="relative"
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
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
                <Layers className="w-5 h-5 text-white" />
              </div>
              
              {/* Floating sparkle */}
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: 0.5,
                }}
              >
                <Star className="w-3 h-3 text-yellow-400" />
              </motion.div>
            </motion.div>
            
            <h3 
              className="font-bold text-lg"
              style={{ 
                color: isDarkMode ? '#f9fafb' : '#1f2937',
              }}
            >
              Selection Guidelines
            </h3>
          </div>

          {/* Enhanced Guidelines */}
          <div className="space-y-4">
            {[
              { 
                icon: Users, 
                text: "Select multiple types if you offer various services", 
                delay: 0.1,
                color: "#5a2dcf" 
              },
              { 
                icon: CheckCircle, 
                text: "Selections determine your credentials & compliance", 
                delay: 0.2,
                color: "#10b981" 
              },
              { 
                icon: Settings, 
                text: "Modify selections anytime in profile settings", 
                delay: 0.3,
                color: "#f59e0b" 
              },
              { 
                icon: Plus, 
                text: 'Choose "Other" to add custom specialties', 
                delay: 0.4,
                color: "#ef4444" 
              },
            ].map((guideline, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-4 group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: guideline.delay }}
              >
                <motion.div
                  className="flex-shrink-0 mt-0.5"
                  whileHover={{ scale: 1.1 }}
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.5,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: `${guideline.color}15`,
                      border: `1px solid ${guideline.color}30`,
                    }}
                  >
                    <guideline.icon 
                      className="w-4 h-4" 
                      style={{ color: guideline.color }}
                    />
                  </div>
                </motion.div>
                
                <p 
                  className="text-sm leading-relaxed group-hover:translate-x-1 transition-transform duration-200"
                  style={{ 
                    color: isDarkMode ? '#d1d5db' : '#64748b',
                    fontWeight: '500',
                  }}
                >
                  {guideline.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Stats Card - Only show when selections exist */}
      <AnimatePresence>
        {progress.selectedRoles.length > 0 && showStats && (
          <motion.div
            className="relative overflow-hidden rounded-2xl"
            style={{
              background: isDarkMode 
                ? 'linear-gradient(135deg, #065f46 0%, #1f2937 100%)' 
                : 'linear-gradient(135deg, #ecfdf5 0%, #f0f9ff 100%)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: isDarkMode ? '#059669' : '#a7f3d0',
              boxShadow: '0 10px 15px rgba(16, 185, 129, 0.15)',
            }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative p-6">
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <Trophy className="w-5 h-5 text-green-600" />
                </motion.div>
                <h4 
                  className="font-semibold text-sm"
                  style={{ 
                    color: isDarkMode ? '#10b981' : '#065f46',
                  }}
                >
                  Great Progress!
                </h4>
              </div>
              
              <div className="space-y-2">
                {progress.selectedRoles.map((role, index) => (
                  <motion.div
                    key={role.role}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span 
                      className="text-xs"
                      style={{ 
                        color: isDarkMode ? '#a7f3d0' : '#047857',
                        fontWeight: '500',
                      }}
                    >
                      {role.customDescription || 
                        role.role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
                      }
                    </span>
                  </motion.div>
                ))}
              </div>

              {progress.selectedRoles.length >= 1 && (
                <motion.div
                  className="mt-4 pt-4"
                  style={{
                    borderTop: `1px solid ${isDarkMode ? '#059669' : '#a7f3d0'}`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-green-600" />
                    <span 
                      className="text-xs font-medium"
                      style={{ color: isDarkMode ? '#10b981' : '#065f46' }}
                    >
                      Ready for next step!
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <OnboardingLayout
      currentStep={1}
      totalSteps={6}
      stepTitles={STEP_TITLES}
      title="Provider Role Selection"
      subtitle="Choose your provider types to customize your experience"
      showBackButton={false}
      onSave={handleSave}
      sidebarContent={sidebarContent}
    >
      <RoleSelectionPresentation
        categories={ROLE_CATEGORIES}
        selectedRoles={progress.selectedRoles}
        onRoleSelect={handleRoleSelect}
        onRoleDeselect={handleRoleDeselect}
        onCustomRoleAdd={handleCustomRoleAdd}
        onContinue={handleContinue}
        isLoading={isLoading}
      />
    </OnboardingLayout>
  );
}
