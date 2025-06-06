"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { SignupForm } from "../components/SignupForm";

export function SignupFormContainer() {
  const router = useRouter();
  const { signup, socialLogin } = useAuth();

  const handleSubmit = async (data: any) => {
    // If phone authentication, redirect to OTP page
    if (data.phone && !data.email) {
      router.push(`/verify-otp?phone=${encodeURIComponent(data.phone)}&type=signup`);
      return;
    }

    // Regular email/password signup
    const result = await signup.mutateAsync(data);
    if (!result.success && result.message) {
      throw new Error(result.message);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    const result = await socialLogin.mutateAsync(provider);
    if (!result.success && result.message) {
      throw new Error(result.message);
    }
  };

  return (
    <SignupForm
      onSubmit={handleSubmit}
      onSocialLogin={handleSocialLogin}
      isLoading={signup.isPending}
      isSocialLoading={socialLogin.isPending}
    />
  );
}