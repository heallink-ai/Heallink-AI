"use client";

import OnboardingLayout from "../../features/onboarding/components/OnboardingLayout";
import CredentialsContainer from "../../features/onboarding/containers/CredentialsContainer";

const STEP_TITLES = [
  "Choose Roles",
  "Profile", 
  "Credentials",
  "Compliance",
  "Workflow",
  "Review",
];

export default function CredentialsPage() {
  const handleSave = () => {
    // Handle save functionality if needed
    console.log("Save progress");
  };

  return (
    <OnboardingLayout
      currentStep={3}
      totalSteps={6}
      stepTitles={STEP_TITLES}
      title="Professional Credentials"
      subtitle="Upload and verify your licenses, certifications, and qualifications"
      showBackButton={true}
      onSave={handleSave}
    >
      <CredentialsContainer />
    </OnboardingLayout>
  );
}

