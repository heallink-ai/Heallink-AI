import { redirect } from "next/navigation";

export default function OnboardingPage() {
  // Redirect to first step of onboarding
  redirect("/onboarding/role-selection");
}

export const metadata = {
  title: "Provider Onboarding - HealLink",
  description: "Complete your provider onboarding to start using HealLink",
};