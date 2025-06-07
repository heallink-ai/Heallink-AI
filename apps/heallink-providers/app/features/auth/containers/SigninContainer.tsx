"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { LoginForm } from "../components/LoginForm";
import { LoginFormData } from "../types/auth.types";

export default function SigninContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  // Login mutation with React Query
  const { mutate, isPending, error } = useMutation({
    mutationFn: async (credentials: LoginFormData) => {
      try {
        if (credentials.email) {
          // Handle email sign in
          const result = await signIn("credentials", {
            email: credentials.email,
            password: credentials.password,
            redirect: false,
            callbackUrl,
          });

          if (result?.error) {
            throw new Error(result.error);
          }

          return result;
        } else if (credentials.phone) {
          // Handle phone sign in with OTP
          // TODO: Implement phone authentication
          throw new Error("Phone authentication not yet implemented");
        }

        throw new Error("Either email or phone is required");
      } catch (error) {
        // Check for connection refused error
        if (
          error instanceof Error &&
          error.cause &&
          typeof error.cause === "object" &&
          "code" in error.cause &&
          error.cause.code === "ECONNREFUSED"
        ) {
          throw new Error(
            "Cannot connect to the authentication server. Please check your connection and try again."
          );
        }
        throw error;
      }
    },
    onSuccess: () => {
      // On successful login, redirect to callback URL or dashboard
      router.push(callbackUrl);
    },
    onError: (error) => {
      console.error("Sign-in error:", error);
    },
  });

  // Handle social login
  const handleSocialLogin = async (provider: string) => {
    await signIn(provider, { callbackUrl });
  };

  // Handle form submission
  const handleSubmit = (credentials: LoginFormData) => {
    console.log("Submitting credentials:", credentials);
    mutate(credentials);
  };

  // Format error message for display
  const errorMessage = error instanceof Error ? error.message : undefined;

  return (
    <LoginForm
      onSubmit={handleSubmit}
      onSocialLogin={handleSocialLogin}
      isLoading={isPending}
      error={errorMessage}
    />
  );
}
