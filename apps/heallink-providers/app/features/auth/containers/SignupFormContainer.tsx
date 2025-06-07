"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { SignupForm } from "../components/SignupForm";

export function SignupFormContainer() {
  const router = useRouter();

  // Signup mutation
  const signup = useMutation({
    mutationFn: async (data: any) => {
      // If phone authentication, redirect to OTP page
      if (data.phone && !data.email) {
        router.push(
          `/verify-otp?phone=${encodeURIComponent(data.phone)}&type=signup`
        );
        return { success: true };
      }

      // For actual signup, we'll make an API call
      try {
        // Format the name
        const formattedData = {
          ...data,
          name: `${data.firstName} ${data.lastName}`,
        };

        // Make a request to register
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedData),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Registration failed");
        }

        // Redirect to signin page
        router.push("/signin?registered=true");
        return { success: true };
      } catch (error) {
        console.error("Signup error:", error);
        throw error;
      }
    },
  });

  // Social login mutation
  const socialLogin = useMutation({
    mutationFn: async (provider: string) => {
      await signIn(provider, { callbackUrl: "/dashboard" });
      return { success: true };
    },
  });

  const handleSubmit = async (data: any) => {
    try {
      await signup.mutateAsync(data);
    } catch (error) {
      console.error("Error during signup:", error);
      throw error;
    }
  };

  const handleSocialLogin = async (provider: string) => {
    try {
      await socialLogin.mutateAsync(provider);
    } catch (error) {
      console.error("Error during social login:", error);
      throw error;
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
