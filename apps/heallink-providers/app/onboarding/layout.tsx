import { ReactNode } from "react";
import { OnboardingProvider } from "../features/onboarding/providers/OnboardingProvider";

interface OnboardingLayoutProps {
  children: ReactNode;
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return (
    <OnboardingProvider>
      <div className="min-h-screen bg-background">
        {children}
      </div>
    </OnboardingProvider>
  );
}

export const metadata = {
  title: "Provider Onboarding - HealLink",
  description: "Complete your provider registration and verification process",
};