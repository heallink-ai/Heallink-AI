"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginPage } from "@/features/auth";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const provider = localStorage.getItem('provider');
    if (provider) {
      router.push('/dashboard');
      return;
    }

    // Check if there's an existing onboarding session
    const onboardingProgress = localStorage.getItem('heallink-providers-onboarding');
    if (onboardingProgress) {
      try {
        const progress = JSON.parse(onboardingProgress);
        if (progress.currentStep && progress.currentStep > 1) {
          // Continue onboarding from where they left off
          const stepRoutes = [
            '',
            '/onboarding/role-selection',
            '/onboarding/core-profile',
            '/onboarding/credentials',
            '/onboarding/compliance',
            '/onboarding/workflow-setup',
            '/onboarding/review-submit'
          ];
          
          const currentRoute = stepRoutes[progress.currentStep] || '/onboarding/role-selection';
          router.push(currentRoute);
          return;
        }
      } catch (error) {
        console.error('Error parsing onboarding progress:', error);
      }
    }
  }, [router]);

  return <LoginPage />;
}
