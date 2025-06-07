import { redirect } from "next/navigation";

export default function CredentialsPage() {
  // Placeholder - redirect back to core profile for now
  redirect("/onboarding/core-profile");
}

export const metadata = {
  title: "Credentials - HealLink Providers",
  description: "Upload and verify your professional credentials",
};