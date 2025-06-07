"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Plus } from "lucide-react";
import { useState } from "react";
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

      {/* Continue Button */}
      <motion.div
        className="flex justify-center pt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <button
          onClick={onContinue}
          disabled={selectedRoles.length === 0 || isLoading}
          className="px-12 py-4 bg-gradient-to-r from-purple-heart to-royal-blue text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed border-0"
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            `Continue with ${selectedRoles.length} selection${selectedRoles.length > 1 ? 's' : ''}`
          )}
        </button>
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