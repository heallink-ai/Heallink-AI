"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../providers/OnboardingProvider";
import CredentialsPresentation from "../components/CredentialsPresentation";

export interface Credential {
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

export default function CredentialsContainer() {
  const router = useRouter();
  const { progress, updateCredentials, goToNextStep, saveProgress, isLoading } = useOnboarding();
  const [credentials, setCredentials] = useState<Credential[]>(progress.credentials || []);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    // Update onboarding state when credentials change
    updateCredentials(credentials);
  }, [credentials, updateCredentials]);

  const handleCredentialAdd = (newCredential: Omit<Credential, 'id' | 'status'>) => {
    const credential: Credential = {
      ...newCredential,
      id: `credential_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending'
    };
    
    setCredentials(prev => [...prev, credential]);
  };

  const handleCredentialRemove = (id: string) => {
    setCredentials(prev => prev.filter(cred => cred.id !== id));
  };

  const handleCredentialUpdate = (id: string, updates: Partial<Credential>) => {
    setCredentials(prev => 
      prev.map(cred => 
        cred.id === id ? { ...cred, ...updates } : cred
      )
    );
  };

  const handleContinue = async () => {
    // Validate that at least one credential is added
    if (credentials.length === 0) {
      setErrors({ general: "Please add at least one credential to continue." });
      return;
    }

    // Clear any errors
    setErrors({});

    // Save progress and continue to next step
    const saved = await saveProgress();
    if (saved) {
      goToNextStep();
      router.push("/onboarding/compliance");
    }
  };

  const handleBack = () => {
    router.push("/onboarding/core-profile");
  };

  return (
    <CredentialsPresentation
      credentials={credentials}
      onCredentialAdd={handleCredentialAdd}
      onCredentialRemove={handleCredentialRemove}
      onCredentialUpdate={handleCredentialUpdate}
      onContinue={handleContinue}
      onBack={handleBack}
      isLoading={isLoading}
      errors={errors}
    />
  );
}