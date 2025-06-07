"use client";

import { useRouter } from "next/navigation";
import CoreProfilePresentation from "../components/CoreProfilePresentation";
import OnboardingLayout from "../components/OnboardingLayout";
import { useOnboarding } from "../providers/OnboardingProvider";

const STEP_TITLES = [
  'Choose Roles',
  'Profile',
  'Credentials', 
  'Compliance',
  'Workflow',
  'Review'
];

export default function CoreProfileContainer() {
  const router = useRouter();
  const {
    progress,
    isLoading,
    updateLegalIdentity,
    updateContactLocation,
    addContactLocation,
    removeContactLocation,
    updatePayoutTax,
    goToNextStep,
    goToPreviousStep,
    saveProgress,
    getStepValidation,
  } = useOnboarding();

  const validation = getStepValidation(2);

  const handleContinue = async () => {
    if (!validation.isValid) return;
    
    const saved = await saveProgress();
    if (saved) {
      goToNextStep();
      router.push('/onboarding/credentials');
    }
  };

  const handleBack = () => {
    goToPreviousStep();
    router.push('/onboarding/role-selection');
  };

  const handleSave = () => {
    saveProgress();
  };

  const sidebarContent = (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground">Profile Guidelines</h3>
      <div className="space-y-3 text-sm text-muted-foreground">
        <div className="flex items-start gap-2">
          <div className="w-1.5 h-1.5 bg-purple-heart rounded-full mt-2 flex-shrink-0" />
          <p>All information must match your government-issued ID exactly</p>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-1.5 h-1.5 bg-purple-heart rounded-full mt-2 flex-shrink-0" />
          <p>Bank account information is used for secure payments only</p>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-1.5 h-1.5 bg-purple-heart rounded-full mt-2 flex-shrink-0" />
          <p>You can add multiple practice locations if needed</p>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-1.5 h-1.5 bg-purple-heart rounded-full mt-2 flex-shrink-0" />
          <p>Telehealth-only locations don't require physical addresses</p>
        </div>
      </div>
    </div>
  );

  return (
    <OnboardingLayout
      currentStep={2}
      totalSteps={6}
      stepTitles={STEP_TITLES}
      title="Core Profile"
      subtitle="Complete your professional profile information"
      onBack={handleBack}
      onSave={handleSave}
      sidebarContent={sidebarContent}
    >
      <CoreProfilePresentation
        legalIdentity={progress.legalIdentity || {}}
        contactLocations={progress.contactLocations}
        payoutTax={progress.payoutTax || {}}
        onLegalIdentityChange={updateLegalIdentity}
        onContactLocationChange={updateContactLocation}
        onAddContactLocation={addContactLocation}
        onRemoveContactLocation={removeContactLocation}
        onPayoutTaxChange={updatePayoutTax}
        onContinue={handleContinue}
        onBack={handleBack}
        isLoading={isLoading}
        errors={validation.errors}
      />
    </OnboardingLayout>
  );
}