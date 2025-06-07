"use client";

import { useRouter } from "next/navigation";
import RoleSelectionPresentation from "../components/RoleSelectionPresentation";
import OnboardingLayout from "../components/OnboardingLayout";
import { ProviderRoleCategory, SelectedRole, ProviderRole } from "../types";
import { useOnboarding } from "../providers/OnboardingProvider";

const ROLE_CATEGORIES: ProviderRoleCategory[] = [
  {
    id: "clinical",
    name: "Clinical",
    description: "Direct patient care providers and medical professionals",
    icon: "🩺",
    roles: [
      "physician",
      "nurse-practitioner",
      "physician-assistant",
      "registered-nurse",
      "therapist",
    ],
  },
  {
    id: "ancillary",
    name: "Ancillary",
    description: "Supporting healthcare services and specialized providers",
    icon: "🔬",
    roles: ["lab", "imaging", "pharmacy", "dme", "billing-coding"],
  },
  {
    id: "facility",
    name: "Facility",
    description: "Healthcare facilities and care delivery locations",
    icon: "🏥",
    roles: ["hospital", "asc", "urgent-care", "home-health"],
  },
  {
    id: "digital-only",
    name: "Digital-only",
    description: "Technology-enabled healthcare and remote services",
    icon: "💻",
    roles: ["telehealth-group", "remote-monitoring", "digital-therapeutics"],
  },
];

const STEP_TITLES = [
  "Choose Roles",
  "Profile",
  "Credentials",
  "Compliance",
  "Workflow",
  "Review",
];

export default function RoleSelectionContainer() {
  const router = useRouter();
  const {
    progress,
    isLoading,
    updateSelectedRoles,
    goToNextStep,
    saveProgress,
  } = useOnboarding();

  const handleRoleSelect = (categoryId: string, roleId: string) => {
    const role = roleId as ProviderRole;
    const selectedRoles = progress.selectedRoles;
    const isAlreadySelected = selectedRoles.some((sr) => sr.role === role);

    if (isAlreadySelected) {
      const newRoles = selectedRoles.filter((sr) => sr.role !== role);
      updateSelectedRoles(newRoles);
    } else {
      const newRole: SelectedRole = {
        role,
        category: categoryId,
      };
      updateSelectedRoles([...selectedRoles, newRole]);
    }
  };

  const handleRoleDeselect = (roleId: string) => {
    const newRoles = progress.selectedRoles.filter((sr) => sr.role !== roleId);
    updateSelectedRoles(newRoles);
  };

  const handleCustomRoleAdd = (description: string) => {
    const customRole: SelectedRole = {
      role: "other",
      category: "clinical",
      customDescription: description,
    };
    updateSelectedRoles([...progress.selectedRoles, customRole]);
  };

  const handleContinue = async () => {
    if (progress.selectedRoles.length === 0) return;

    const saved = await saveProgress();
    if (saved) {
      goToNextStep();
      router.push("/onboarding/core-profile");
    }
  };

  const handleSave = () => {
    saveProgress();
  };

  const sidebarContent = (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground">Selection Guidelines</h3>
      <div className="space-y-3 text-sm text-muted-foreground">
        <div className="flex items-start gap-2">
          <div className="w-1.5 h-1.5 bg-purple-heart rounded-full mt-2 flex-shrink-0" />
          <p>
            You can select multiple provider types if you offer various services
          </p>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-1.5 h-1.5 bg-purple-heart rounded-full mt-2 flex-shrink-0" />
          <p>
            Your selections determine which credentials and compliance
            requirements apply
          </p>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-1.5 h-1.5 bg-purple-heart rounded-full mt-2 flex-shrink-0" />
          <p>You can modify your selections later in your profile settings</p>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-1.5 h-1.5 bg-purple-heart rounded-full mt-2 flex-shrink-0" />
          <p>Choose "Other&quot; to add custom specialties not listed</p>
        </div>
      </div>
    </div>
  );

  return (
    <OnboardingLayout
      currentStep={1}
      totalSteps={6}
      stepTitles={STEP_TITLES}
      title="Provider Role Selection"
      subtitle="Choose your provider types to customize your experience"
      showBackButton={false}
      onSave={handleSave}
      sidebarContent={sidebarContent}
    >
      <RoleSelectionPresentation
        categories={ROLE_CATEGORIES}
        selectedRoles={progress.selectedRoles}
        onRoleSelect={handleRoleSelect}
        onRoleDeselect={handleRoleDeselect}
        onCustomRoleAdd={handleCustomRoleAdd}
        onContinue={handleContinue}
        isLoading={isLoading}
      />
    </OnboardingLayout>
  );
}
