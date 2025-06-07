"use client";

import OnboardingLayout from "../../features/onboarding/components/OnboardingLayout";
import ReviewContainer from "../../features/onboarding/containers/ReviewContainer";

const STEP_TITLES = [
  "Choose Roles",
  "Profile", 
  "Credentials",
  "Compliance",
  "Workflow",
  "Review",
];

export default function ReviewPage() {
  const handleSave = () => {
    // Handle save functionality if needed
    console.log("Save review progress");
  };

  return (
    <OnboardingLayout
      currentStep={6}
      totalSteps={6}
      stepTitles={STEP_TITLES}
      title="Review & Submit"
      subtitle="Review your information and submit your provider application"
      showBackButton={true}
      onSave={handleSave}
    >
      <ReviewContainer />
    </OnboardingLayout>
  );
}