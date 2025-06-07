"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../providers/OnboardingProvider";
import CompliancePresentation, { ComplianceModule } from "../components/CompliancePresentation";

export default function ComplianceContainer() {
  const router = useRouter();
  const { progress, updateComplianceModule, goToNextStep, saveProgress, isLoading } = useOnboarding();
  const [modules, setModules] = useState<ComplianceModule[]>(progress.complianceModules || []);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    // Update local state when progress changes
    setModules(progress.complianceModules || []);
  }, [progress.complianceModules]);

  const handleModuleUpdate = (moduleId: string, updates: Partial<ComplianceModule>) => {
    // Update the module in the onboarding state
    updateComplianceModule(moduleId, updates);
    
    // Update local state
    setModules(prev => 
      prev.map(module => 
        module.id === moduleId ? { ...module, ...updates } : module
      )
    );
  };

  const handleContinue = async () => {
    // Validate that all modules are completed
    const incompleteModules = modules.filter(module => !module.completed);
    
    if (incompleteModules.length > 0) {
      setErrors({ 
        general: `Please complete all training modules. ${incompleteModules.length} module(s) remaining.` 
      });
      return;
    }

    // Clear any errors
    setErrors({});

    // Save progress and continue to next step
    const saved = await saveProgress();
    if (saved) {
      goToNextStep();
      router.push("/onboarding/workflow");
    }
  };

  const handleBack = () => {
    router.push("/onboarding/credentials");
  };

  return (
    <CompliancePresentation
      modules={modules}
      onModuleUpdate={handleModuleUpdate}
      onContinue={handleContinue}
      onBack={handleBack}
      isLoading={isLoading}
      errors={errors}
    />
  );
}