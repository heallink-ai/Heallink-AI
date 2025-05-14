"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import SigninForm, { SigninCredentials } from "../components/SigninForm";

export default function SigninContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  // Login mutation with React Query
  const { mutate, isPending, error } = useMutation({
    mutationFn: async (credentials: SigninCredentials) => {
      if (credentials.email) {
        // Handle email sign in
        const result = await signIn("credentials", {
          email: credentials.email,
          password: credentials.otp, // In the email case, we're using the password
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
    mutate(credentials);
  };

  // Format error message for display
  const errorMessage = error instanceof Error ? error.message : null;

  return (
    <SigninForm
      onSubmit={handleSubmit}
      isLoading={isPending}
      error={errorMessage}
    />
  );
}
