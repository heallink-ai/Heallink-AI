"use client";

import OnboardingLayout from "../../features/onboarding/components/OnboardingLayout";
import WorkflowContainer from "../../features/onboarding/containers/WorkflowContainer";

const STEP_TITLES = [
  "Choose Roles",
  "Profile", 
  "Credentials",
  "Compliance",
  "Workflow",
  "Review",
];

export default function WorkflowPage() {
  const handleSave = () => {
    // Handle save functionality if needed
    console.log("Save workflow progress");
  };

  return (
    <OnboardingLayout
      currentStep={5}
      totalSteps={6}
      stepTitles={STEP_TITLES}
      title="Workflow Setup"
      subtitle="Configure your scheduling, appointments, and practice preferences"
      showBackButton={true}
      onSave={handleSave}
    >
      <WorkflowContainer />
    </OnboardingLayout>
  );
}