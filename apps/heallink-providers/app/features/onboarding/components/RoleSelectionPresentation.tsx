"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Plus, ArrowRight, Sparkles, CheckCircle, Rocket } from "lucide-react";
import { useState, useEffect } from "react";
import RoleCard from "./RoleCard";
import { ProviderRoleCategory, SelectedRole } from "../types";

interface RoleSelectionPresentationProps {
  categories: ProviderRoleCategory[];
  selectedRoles: SelectedRole[];
  onRoleSelect: (categoryId: string, roleId: string) => void;
  onRoleDeselect: (roleId: string) => void;
  onCustomRoleAdd: (description: string) => void;
  onContinue: () => void;
  isLoading: boolean;
}

export default function RoleSelectionPresentation({
  categories,
  selectedRoles,
  onRoleSelect,
  onRoleDeselect,
  onCustomRoleAdd,
  onContinue,
  isLoading,
}: RoleSelectionPresentationProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customDescription, setCustomDescription] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);

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

  // Filter categories based on search
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCustomSubmit = () => {
    if (customDescription.trim()) {
      onCustomRoleAdd(customDescription.trim());
      setCustomDescription("");
      setShowCustomInput(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-heart to-royal-blue flex items-center justify-center shadow-lg">
          <span className="text-2xl">🏥</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground">
          Tell us what kind of provider you are
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Select all that apply. This helps us customize your onboarding experience and ensure you have access to the right tools and features.
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        className="relative max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search provider types..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 neumorph-input rounded-xl border-0 focus:ring-2 focus:ring-purple-heart/20 transition-all"
        />
      </motion.div>

      {/* Selected Roles Summary */}
      <AnimatePresence>
        {selectedRoles.length > 0 && (
          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-gradient-to-r from-purple-heart/5 to-royal-blue/5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-purple-heart rounded-full animate-pulse" />
                <h3 className="font-semibold text-foreground">
                  You've selected: {selectedRoles.length} provider type{selectedRoles.length > 1 ? 's' : ''}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedRoles.map((selectedRole, index) => (
                  <motion.div
                    key={selectedRole.role}
                    className="flex items-center gap-2 px-3 py-2 bg-purple-heart/10 border border-purple-heart/20 rounded-lg text-sm"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <span className="text-purple-heart font-medium">
                      {selectedRole.customDescription || 
                        categories
                          .find(cat => cat.id === selectedRole.category)
                          ?.roles.includes(selectedRole.role) ? 
                          selectedRole.role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) :
                          'Other'
                      }
                    </span>
                    <button
                      onClick={() => onRoleDeselect(selectedRole.role)}
                      className="w-4 h-4 flex items-center justify-center rounded-full bg-purple-heart/20 hover:bg-purple-heart/40 transition-colors"
                    >
                      <X className="w-3 h-3 text-purple-heart" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Role Categories */}
      <div className="space-y-12">
        {filteredCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center justify-center gap-3">
                <span className="text-3xl">{category.icon}</span>
                {category.name}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {category.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.roles.map((role, roleIndex) => {
                const isSelected = selectedRoles.some(sr => sr.role === role);
                return (
                  <RoleCard
                    key={role}
                    id={role}
                    name={role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    description={getRoleDescription(role)}
                    icon={getRoleIcon(role)}
                    isSelected={isSelected}
                    onSelect={() => onRoleSelect(category.id, role)}
                    delay={roleIndex * 0.05}
                  />
                );
              })}

              {/* Add Other Option */}
              {category.id === 'clinical' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: category.roles.length * 0.05 }}
                >
                  <AnimatePresence>
                    {!showCustomInput ? (
                      <motion.button
                        onClick={() => setShowCustomInput(true)}
                        className="w-full p-6 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-heart/50 transition-all bg-white dark:bg-gray-800 shadow-sm"
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="text-center space-y-4">
                          <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                            <Plus className="w-8 h-8 text-gray-500" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-600 dark:text-gray-300">
                              Other
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Don't see your specialty? Add it here.
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    ) : (
                      <motion.div
                        className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 bg-white dark:bg-gray-800 shadow-lg"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                      >
                        <div className="space-y-4">
                          <h3 className="font-bold text-lg text-foreground">
                            Describe your specialty
                          </h3>
                          <textarea
                            value={customDescription}
                            onChange={(e) => setCustomDescription(e.target.value)}
                            placeholder="e.g., Pediatric Oncologist, Sports Medicine Specialist..."
                            className="w-full p-3 neumorph-input rounded-lg border-0 focus:ring-2 focus:ring-purple-heart/20 resize-none"
                            rows={3}
                            autoFocus
                          />
                          <div className="flex gap-3">
                            <button
                              onClick={handleCustomSubmit}
                              disabled={!customDescription.trim()}
                              className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-heart to-royal-blue text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                            >
                              Add Specialty
                            </button>
                            <button
                              onClick={() => {
                                setShowCustomInput(false);
                                setCustomDescription("");
                              }}
                              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-purple-heart transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Enhanced Continue Button */}
      <motion.div
        className="flex justify-center pt-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="relative">
          {/* Glow Effect */}
          <AnimatePresence>
            {selectedRoles.length > 0 && !isLoading && (
              <motion.div
                className="absolute inset-0 rounded-2xl blur-xl"
                style={{
                  background: 'linear-gradient(135deg, #5a2dcf 0%, #2066e4 100%)',
                  opacity: buttonHovered ? 0.6 : 0.3,
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: buttonHovered ? 0.6 : 0.3, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>

          {/* Main Button */}
          <motion.button
            onClick={onContinue}
            disabled={selectedRoles.length === 0 || isLoading}
            onMouseEnter={() => setButtonHovered(true)}
            onMouseLeave={() => setButtonHovered(false)}
            className="relative overflow-hidden rounded-2xl"
            style={{
              background: selectedRoles.length > 0 && !isLoading
                ? 'linear-gradient(135deg, #5a2dcf 0%, #2066e4 100%)'
                : (isDarkMode ? '#374151' : '#e5e7eb'),
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: selectedRoles.length > 0 && !isLoading
                ? 'transparent'
                : (isDarkMode ? '#4b5563' : '#d1d5db'),
              boxShadow: selectedRoles.length > 0 && !isLoading
                ? (buttonHovered 
                  ? '0 20px 25px -5px rgba(90, 45, 207, 0.4), 0 10px 10px -5px rgba(90, 45, 207, 0.3)' 
                  : '0 10px 15px -3px rgba(90, 45, 207, 0.3), 0 4px 6px -2px rgba(90, 45, 207, 0.2)')
                : (isDarkMode 
                  ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' 
                  : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'),
              cursor: selectedRoles.length > 0 && !isLoading ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            whileHover={selectedRoles.length > 0 && !isLoading ? { 
              scale: 1.05, 
              y: -2 
            } : {}}
            whileTap={selectedRoles.length > 0 && !isLoading ? { 
              scale: 0.98 
            } : {}}
          >
            {/* Shimmer Effect for Active State */}
            <AnimatePresence>
              {selectedRoles.length > 0 && !isLoading && (
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

            {/* Button Content */}
            <div className="relative px-12 py-5">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Enhanced Loading Spinner */}
                    <div className="relative">
                      <motion.div
                        className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <motion.div
                        className="absolute inset-0 w-6 h-6 border-3 border-transparent border-r-white/50 rounded-full"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      />
                    </div>
                    <span 
                      className="font-bold text-lg"
                      style={{ color: '#ffffff' }}
                    >
                      Processing...
                    </span>
                  </motion.div>
                ) : selectedRoles.length === 0 ? (
                  <motion.div
                    key="disabled"
                    className="flex items-center gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: isDarkMode ? '#6b7280' : '#9ca3af',
                      }}
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                    <span 
                      className="font-bold text-lg"
                      style={{ 
                        color: isDarkMode ? '#9ca3af' : '#6b7280',
                      }}
                    >
                      Select provider types to continue
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="active"
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Success Icon with Animation */}
                    <motion.div
                      className="relative"
                      animate={{
                        scale: buttonHovered ? [1, 1.2, 1] : 1,
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: buttonHovered ? Infinity : 0,
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{
                          background: 'rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      
                      {/* Sparkles around the icon */}
                      {buttonHovered && (
                        <>
                          {[...Array(4)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute"
                              style={{
                                top: `${-8 + Math.sin((i * Math.PI) / 2) * 20}px`,
                                left: `${-8 + Math.cos((i * Math.PI) / 2) * 20}px`,
                              }}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ 
                                scale: [0, 1, 0], 
                                opacity: [0, 1, 0],
                                rotate: [0, 180, 360] 
                              }}
                              transition={{ 
                                duration: 1.5, 
                                repeat: Infinity, 
                                delay: i * 0.2,
                                ease: "easeInOut" 
                              }}
                            >
                              <Sparkles className="w-3 h-3 text-white" />
                            </motion.div>
                          ))}
                        </>
                      )}
                    </motion.div>

                    {/* Button Text */}
                    <div className="flex flex-col items-start">
                      <span 
                        className="font-bold text-lg text-white"
                      >
                        Continue with {selectedRoles.length} selection{selectedRoles.length > 1 ? 's' : ''}
                      </span>
                      <motion.span 
                        className="text-sm text-white/80"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        Ready to build your profile
                      </motion.span>
                    </div>

                    {/* Arrow Icon */}
                    <motion.div
                      animate={{
                        x: buttonHovered ? [0, 5, 0] : 0,
                      }}
                      transition={{
                        duration: 1,
                        repeat: buttonHovered ? Infinity : 0,
                        ease: "easeInOut"
                      }}
                    >
                      <ArrowRight className="w-6 h-6 text-white" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Ripple Effect on Click */}
            <AnimatePresence>
              {buttonHovered && selectedRoles.length > 0 && !isLoading && (
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                  }}
                  initial={{ scale: 0, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                />
              )}
            </AnimatePresence>
          </motion.button>

          {/* Floating Elements for Active State */}
          <AnimatePresence>
            {selectedRoles.length > 0 && !isLoading && (
              <>
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      top: `${-20 + i * 10}px`,
                      right: `${-15 + i * 8}px`,
                    }}
                    initial={{ opacity: 0, scale: 0, y: 20 }}
                    animate={{ 
                      opacity: [0, 1, 0], 
                      scale: [0, 1, 0],
                      y: [20, -20, -40] 
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      delay: i * 0.8,
                      ease: "easeOut" 
                    }}
                  >
                    <Rocket 
                      className="w-4 h-4" 
                      style={{ color: '#5a2dcf', opacity: 0.6 }}
                    />
                  </motion.div>
                ))}
              </>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

// Helper functions
function getRoleDescription(role: string): string {
  const descriptions: Record<string, string> = {
    'physician': 'Licensed medical doctors specializing in patient care and diagnosis',
    'nurse-practitioner': 'Advanced practice nurses providing comprehensive healthcare',
    'physician-assistant': 'Licensed healthcare providers working under physician supervision',
    'registered-nurse': 'Licensed nurses providing direct patient care and support',
    'therapist': 'Specialists in rehabilitation and therapeutic interventions',
    'lab': 'Laboratory services for diagnostic testing and analysis',
    'imaging': 'Medical imaging services including X-ray, MRI, and CT scans',
    'pharmacy': 'Medication dispensing and pharmaceutical care services',
    'dme': 'Durable medical equipment providers and services',
    'billing-coding': 'Medical billing and coding services',
    'hospital': 'Inpatient and emergency healthcare facilities',
    'asc': 'Ambulatory surgery centers for outpatient procedures',
    'urgent-care': 'Walk-in clinics for immediate medical attention',
    'home-health': 'Healthcare services provided in patient homes',
    'telehealth-group': 'Remote healthcare delivery organizations',
    'remote-monitoring': 'Digital health monitoring and tracking services',
    'digital-therapeutics': 'Software-based therapeutic interventions',
  };
  return descriptions[role] || 'Specialized healthcare provider';
}

function getRoleIcon(role: string): string {
  const icons: Record<string, string> = {
    'physician': '👨‍⚕️',
    'nurse-practitioner': '👩‍⚕️',
    'physician-assistant': '🩺',
    'registered-nurse': '👩‍🔬',
    'therapist': '🤲',
    'lab': '🔬',
    'imaging': '📱',
    'pharmacy': '💊',
    'dme': '🩼',
    'billing-coding': '📊',
    'hospital': '🏥',
    'asc': '🏢',
    'urgent-care': '⚡',
    'home-health': '🏠',
    'telehealth-group': '💻',
    'remote-monitoring': '📡',
    'digital-therapeutics': '📱',
  };
  return icons[role] || '👤';
}