"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../providers/OnboardingProvider";
import ReviewPresentation from "../components/ReviewPresentation";

export default function ReviewContainer() {
  const router = useRouter();
  const { progress, submitOnboarding, isLoading } = useOnboarding();
  const [errors, setErrors] = useState<any>({});

  const handleEdit = (section: string) => {
    // Navigate to the specific section for editing
    switch (section) {
      case 'roles':
        router.push('/onboarding/role-selection');
        break;
      case 'profile':
        router.push('/onboarding/core-profile');
        break;
      case 'credentials':
        router.push('/onboarding/credentials');
        break;
      case 'compliance':
        router.push('/onboarding/compliance');
        break;
      case 'workflow':
        router.push('/onboarding/workflow');
        break;
      default:
        break;
    }
  };

  const handleSubmit = async () => {
    // Validate all sections are complete
    const validationErrors: any = {};

    if (!progress.selectedRoles || progress.selectedRoles.length === 0) {
      validationErrors.roles = "Please select at least one provider role";
    }

    if (!progress.legalIdentity || !progress.contactLocations || progress.contactLocations.length === 0 || !progress.payoutTax) {
      validationErrors.profile = "Please complete all profile sections";
    }

    if (!progress.credentials || progress.credentials.length === 0) {
      validationErrors.credentials = "Please add at least one credential";
    }

    if (!progress.complianceModules || !progress.complianceModules.every((module: any) => module.completed)) {
      validationErrors.compliance = "Please complete all training modules";
    }

    if (!progress.workflowSettings || 
        !progress.workflowSettings.availability?.some((slot: any) => slot.enabled) ||
        !progress.workflowSettings.appointmentTypes?.length) {
      validationErrors.workflow = "Please complete workflow setup";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Clear any errors
    setErrors({});

    // Submit the onboarding application
    const submitted = await submitOnboarding();
    if (submitted) {
      // Redirect to success page or dashboard
      router.push("/onboarding/success");
    }
  };

  const handleBack = () => {
    router.push("/onboarding/workflow");
  };

  return (
    <ReviewPresentation
      progress={progress}
      onEdit={handleEdit}
      onSubmit={handleSubmit}
      onBack={handleBack}
      isLoading={isLoading}
      errors={errors}
    />
  );
}