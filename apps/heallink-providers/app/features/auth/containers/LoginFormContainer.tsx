"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { LoginForm } from "../components/LoginForm";
import { LoginFormData } from "../utils/validation";

export function LoginFormContainer() {
  const router = useRouter();
  const { login, socialLogin } = useAuth();

  const handleSubmit = async (data: LoginFormData) => {
    // If phone authentication, redirect to OTP page
    if (data.phone && !data.email) {
      router.push(`/verify-otp?phone=${encodeURIComponent(data.phone)}&type=login`);
      return;
    }

    // Regular email/password login
    const result = await login.mutateAsync(data);
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
    <LoginForm
      onSubmit={handleSubmit}
      onSocialLogin={handleSocialLogin}
      isLoading={login.isPending}
      isSocialLoading={socialLogin.isPending}
    />
  );
}