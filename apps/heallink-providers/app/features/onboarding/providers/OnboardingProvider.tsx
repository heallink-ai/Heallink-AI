"use client";

import { createContext, useContext, ReactNode } from "react";
import { useOnboardingState } from "../hooks/useOnboardingState";
import { OnboardingProgress } from "../types";

interface OnboardingContextType {
  progress: OnboardingProgress;
  isLoading: boolean;
  error: string | null;
  updateProgress: (updates: Partial<OnboardingProgress>) => void;
  updateSelectedRoles: (roles: any[]) => void;
  updateLegalIdentity: (data: any) => void;
  updateContactLocations: (locations: any[]) => void;
  updateContactLocation: (index: number, updates: any) => void;
  addContactLocation: () => void;
  removeContactLocation: (index: number) => void;
  updatePayoutTax: (data: any) => void;
  goToStep: (step: number) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  markStepComplete: (step: number) => void;
  updateComplianceModule: (moduleId: string, updates: any) => void;
  saveProgress: () => Promise<boolean>;
  submitOnboarding: () => Promise<boolean>;
  resetOnboarding: () => void;
  getStepValidation: (step: number) => any;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

interface OnboardingProviderProps {
  children: ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const onboardingState = useOnboardingState();

  return (
    <OnboardingContext.Provider value={onboardingState}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}