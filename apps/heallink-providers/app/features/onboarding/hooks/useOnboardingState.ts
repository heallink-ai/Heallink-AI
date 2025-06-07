"use client";

import { useState, useEffect } from "react";
import { OnboardingProgress, SelectedRole, LegalIdentity, ContactLocation, PayoutTax } from "../types";

const STORAGE_KEY = "heallink-providers-onboarding";

const initialProgress: OnboardingProgress = {
  currentStep: 1,
  totalSteps: 6,
  completedSteps: [],
  selectedRoles: [],
  contactLocations: [
    {
      id: "primary",
      type: "primary",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States",
      },
      phone: "",
      email: "",
      isTelehealthOnly: false,
    },
  ],
  credentials: {},
  complianceModules: [
    {
      id: "hipaa",
      name: "HIPAA Compliance",
      description: "Understanding patient privacy and data protection requirements",
      videoUrl: "/videos/hipaa-training.mp4",
      duration: 15,
      completed: false,
      watchedPercentage: 0,
    },
    {
      id: "privacy",
      name: "Privacy & Security",
      description: "Best practices for maintaining patient privacy and data security",
      videoUrl: "/videos/privacy-training.mp4",
      duration: 12,
      completed: false,
      watchedPercentage: 0,
    },
    {
      id: "telehealth",
      name: "Telehealth Best Practices",
      description: "Guidelines for effective virtual patient consultations",
      videoUrl: "/videos/telehealth-training.mp4",
      duration: 18,
      completed: false,
      watchedPercentage: 0,
    },
    {
      id: "platform",
      name: "Platform Guidelines",
      description: "How to use HealLink platform effectively",
      videoUrl: "/videos/platform-training.mp4",
      duration: 20,
      completed: false,
      watchedPercentage: 0,
    },
    {
      id: "terms",
      name: "Terms & Conditions",
      description: "Understanding our terms of service and provider agreement",
      videoUrl: "/videos/terms-training.mp4",
      duration: 10,
      completed: false,
      watchedPercentage: 0,
    },
  ],
  verificationStatus: "pending",
};

export function useOnboardingState() {
  const [progress, setProgress] = useState<OnboardingProgress>(initialProgress);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved progress on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setProgress({ ...initialProgress, ...parsed });
        } catch (err) {
          console.error("Failed to parse saved onboarding progress:", err);
        }
      }
    }
  }, []);

  // Save progress whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }, [progress]);

  const updateProgress = (updates: Partial<OnboardingProgress>) => {
    setProgress(prev => ({ ...prev, ...updates }));
  };

  const updateSelectedRoles = (roles: SelectedRole[]) => {
    updateProgress({ selectedRoles: roles });
  };

  const updateLegalIdentity = (legalIdentity: Partial<LegalIdentity>) => {
    updateProgress({ 
      legalIdentity: { ...progress.legalIdentity, ...legalIdentity } as LegalIdentity 
    });
  };

  const updateContactLocations = (locations: ContactLocation[]) => {
    updateProgress({ contactLocations: locations });
  };

  const updateContactLocation = (index: number, updates: Partial<ContactLocation>) => {
    const newLocations = [...progress.contactLocations];
    newLocations[index] = { ...newLocations[index], ...updates };
    updateContactLocations(newLocations);
  };

  const addContactLocation = () => {
    const newLocation: ContactLocation = {
      id: `location-${Date.now()}`,
      type: "additional",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States",
      },
      phone: "",
      email: "",
      isTelehealthOnly: false,
    };
    updateContactLocations([...progress.contactLocations, newLocation]);
  };

  const removeContactLocation = (index: number) => {
    if (progress.contactLocations[index].type !== "primary") {
      const newLocations = progress.contactLocations.filter((_, i) => i !== index);
      updateContactLocations(newLocations);
    }
  };

  const updatePayoutTax = (payoutTax: Partial<PayoutTax>) => {
    updateProgress({ 
      payoutTax: { ...progress.payoutTax, ...payoutTax } as PayoutTax 
    });
  };

  const goToStep = (step: number) => {
    updateProgress({ currentStep: step });
  };

  const goToNextStep = () => {
    const nextStep = Math.min(progress.currentStep + 1, progress.totalSteps);
    const newCompletedSteps = [...progress.completedSteps];
    
    if (!newCompletedSteps.includes(progress.currentStep.toString())) {
      newCompletedSteps.push(progress.currentStep.toString());
    }

    updateProgress({ 
      currentStep: nextStep,
      completedSteps: newCompletedSteps 
    });
  };

  const goToPreviousStep = () => {
    const prevStep = Math.max(progress.currentStep - 1, 1);
    updateProgress({ currentStep: prevStep });
  };

  const markStepComplete = (step: number) => {
    const newCompletedSteps = [...progress.completedSteps];
    if (!newCompletedSteps.includes(step.toString())) {
      newCompletedSteps.push(step.toString());
      updateProgress({ completedSteps: newCompletedSteps });
    }
  };

  const updateComplianceModule = (moduleId: string, updates: any) => {
    const newModules = progress.complianceModules.map(module =>
      module.id === moduleId ? { ...module, ...updates } : module
    );
    updateProgress({ complianceModules: newModules });
  };

  const saveProgress = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real implementation, this would save to your backend
      console.log("Progress saved:", progress);
      
      return true;
    } catch (err) {
      setError("Failed to save progress. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const submitOnboarding = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      updateProgress({ 
        submittedAt: new Date().toISOString(),
        verificationStatus: "in-progress" 
      });
      
      return true;
    } catch (err) {
      setError("Failed to submit onboarding. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetOnboarding = () => {
    setProgress(initialProgress);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const getStepValidation = (step: number) => {
    switch (step) {
      case 1: // Role Selection
        return {
          isValid: progress.selectedRoles.length > 0,
          errors: progress.selectedRoles.length === 0 ? { roles: "Please select at least one provider role" } : {},
          warnings: [],
        };
      
      case 2: // Core Profile
        const legalValid = progress.legalIdentity?.firstName && 
                          progress.legalIdentity?.lastName && 
                          progress.legalIdentity?.dateOfBirth &&
                          progress.legalIdentity?.governmentId?.type &&
                          progress.legalIdentity?.governmentId?.number;
        
        const contactValid = progress.contactLocations.every(loc => 
          loc.email && loc.phone && (loc.isTelehealthOnly || 
          (loc.address?.street && loc.address?.city && loc.address?.state && loc.address?.zipCode))
        );
        
        const payoutValid = progress.payoutTax?.bankAccount?.accountType &&
                           progress.payoutTax?.bankAccount?.routingNumber &&
                           progress.payoutTax?.bankAccount?.accountNumber &&
                           progress.payoutTax?.taxInfo?.taxIdType &&
                           progress.payoutTax?.taxInfo?.taxId;

        return {
          isValid: !!legalValid && contactValid && !!payoutValid,
          errors: {
            ...(legalValid ? {} : { legal: "Please complete legal identity information" }),
            ...(contactValid ? {} : { contact: "Please complete contact information for all locations" }),
            ...(payoutValid ? {} : { payout: "Please complete payout and tax information" }),
          },
          warnings: [],
        };

      default:
        return { isValid: true, errors: {}, warnings: [] };
    }
  };

  return {
    progress,
    isLoading,
    error,
    updateProgress,
    updateSelectedRoles,
    updateLegalIdentity,
    updateContactLocations,
    updateContactLocation,
    addContactLocation,
    removeContactLocation,
    updatePayoutTax,
    goToStep,
    goToNextStep,
    goToPreviousStep,
    markStepComplete,
    updateComplianceModule,
    saveProgress,
    submitOnboarding,
    resetOnboarding,
    getStepValidation,
  };
}