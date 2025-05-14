"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import SignupForm, { UserFormData } from "../components/SignupForm";
import VerificationNotice from "../components/VerificationNotice";

// Get the correct API URL based on whether we're on server or client
const API_URL =
  typeof window === "undefined"
    ? process.env.API_URL || "http://api:3003/api/v1" // Server-side (in Docker network)
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003/api/v1"; // Client-side (browser)

export default function SignupContainer() {
  const router = useRouter();
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

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
      try {
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
            "Cannot connect to the API server. Make sure the backend is running and accessible."
          );
        }
        throw error;
      }
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
        // Store the email for verification notice
        if (userData.email) {
          setRegisteredEmail(userData.email);
          return;
        }

        try {
          // Registration successful - Now log the user in automatically if no email provided
          const signInResult = await signIn("credentials", {
            email: userData.email || undefined,
            password: userData.password,
            redirect: false,
          });

          if (signInResult?.error) {
            // If auto-login fails, redirect to login page
            console.error("Auto-login failed:", signInResult.error);
            router.push("/auth/signin?registered=true");
          } else {
            // If auto-login succeeds, redirect to dashboard
            router.push("/dashboard");
          }
        } catch (signInError) {
          console.error("Error during auto-login:", signInError);
          // Still redirect to login page with registered=true
          router.push("/auth/signin?registered=true");
        }
      },
    });
  };

  // Format error message for display
  const errorMessage = error instanceof Error ? error.message : null;

  // If we have a registered email, show the verification notice
  if (registeredEmail) {
    return <VerificationNotice email={registeredEmail} />;
  }

  // Otherwise show the form
  return (
    <SignupForm
      onSubmit={handleSubmit}
      isLoading={isPending}
      error={errorMessage}
    />
  );
}
