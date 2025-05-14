"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import SignupForm, { UserFormData } from "../components/SignupForm";

// API URL from env
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003/api/v1";

export default function SignupContainer() {
  const router = useRouter();

  // Registration mutation with React Query
  const {
    mutate: register,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (userData: {
      email?: string;
      phone?: string;
      name: string;
      password: string;
    }) => {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Format error based on response
        throw new Error(data.message || "Registration failed");
      }

      return data;
    },
    onError: (error) => {
      console.error("Registration error:", error);
    },
  });

  // Handle form submission
  const handleSubmit = async (userData: UserFormData) => {
    // Format the data as expected by the API
    const apiData = {
      email: userData.email || undefined,
      phone: userData.phone || undefined,
      name: `${userData.firstName} ${userData.lastName}`,
      password: userData.password,
    };

    // Call the register mutation
    register(apiData, {
      onSuccess: async () => {
        // Registration successful - Now log the user in automatically
        const signInResult = await signIn("credentials", {
          email: userData.email || undefined,
          password: userData.password,
          redirect: false,
        });

        if (signInResult?.error) {
          // If auto-login fails, redirect to login page
          router.push("/auth/signin?registered=true");
        } else {
          // If auto-login succeeds, redirect to dashboard
          router.push("/dashboard");
        }
      },
    });
  };

  // Format error message for display
  const errorMessage = error instanceof Error ? error.message : null;

  return (
    <SignupForm
      onSubmit={handleSubmit}
      isLoading={isPending}
      error={errorMessage}
    />
  );
}
