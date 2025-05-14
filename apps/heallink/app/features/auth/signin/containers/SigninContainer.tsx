"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import SigninForm, { SigninCredentials } from "../components/SigninForm";

export default function SigninContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const isRegistered = searchParams.get("registered") === "true";

  // Login mutation with React Query
  const { mutate, isPending, error } = useMutation({
    mutationFn: async (credentials: SigninCredentials) => {
      try {
        if (credentials.email) {
          // Handle email sign in
          const result = await signIn("credentials", {
            email: credentials.email,
            password: credentials.password, // Use the password field for email login
            redirect: false,
            callbackUrl,
          });

          if (result?.error) {
            throw new Error("Invalid email or password");
          }

          return result;
        } else if (credentials.phone) {
          // Handle phone sign in with OTP
          const result = await signIn("phone", {
            phone: credentials.phone,
            otp: credentials.otp,
            redirect: false,
            callbackUrl,
          });

          if (result?.error) {
            throw new Error("Invalid verification code");
          }

          return result;
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

  // Handle form submission
  const handleSubmit = (credentials: SigninCredentials) => {
    console.log("Submitting credentials:", credentials);
    mutate(credentials);
  };

  // Format error message for display
  const errorMessage =
    error instanceof Error
      ? error.message
      : isRegistered
        ? null // Don't show error if they just registered
        : null;

  return (
    <SigninForm
      onSubmit={handleSubmit}
      isLoading={isPending}
      error={errorMessage}
    />
  );
}
