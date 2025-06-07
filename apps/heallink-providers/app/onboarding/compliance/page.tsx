"use client";

import OnboardingLayout from "../../features/onboarding/components/OnboardingLayout";
import ComplianceContainer from "../../features/onboarding/containers/ComplianceContainer";

const STEP_TITLES = [
  "Choose Roles",
  "Profile", 
  "Credentials",
  "Compliance",
  "Workflow",
  "Review",
];

export default function CompliancePage() {
  const handleSave = () => {
    // Handle save functionality if needed
    console.log("Save compliance progress");
  };

  return (
    <OnboardingLayout
      currentStep={4}
      totalSteps={6}
      stepTitles={STEP_TITLES}
      title="Compliance Training"
      subtitle="Complete required training modules for healthcare compliance and best practices"
      showBackButton={true}
      onSave={handleSave}
    >
      <ComplianceContainer />
    </OnboardingLayout>
  );
}