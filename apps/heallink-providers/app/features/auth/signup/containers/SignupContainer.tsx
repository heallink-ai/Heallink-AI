"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import SignupForm, { ProviderFormData } from "../components/SignupForm";

export default function SignupContainer() {
  const router = useRouter();
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  // Registration mutation with dummy data
  const { mutate: register, isPending, error } = useMutation({
    mutationFn: async (userData: ProviderFormData) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if email already exists (dummy validation)
      const existingEmails = ["dr.smith@example.com", "dr.johnson@example.com"];
      if (userData.email && existingEmails.includes(userData.email)) {
        throw new Error("A provider with this email already exists");
      }
      
      // Simulate successful registration
      const newProvider = {
        id: Math.random().toString(36).substr(2, 9),
        email: userData.email,
        phone: userData.phone,
        name: `${userData.firstName} ${userData.lastName}`,
        specialization: userData.specialization,
        licenseNumber: userData.licenseNumber,
        practiceType: userData.practiceType,
        yearsExperience: userData.yearsExperience
      };
      
      // Store in localStorage for demo
      localStorage.setItem('newProvider', JSON.stringify(newProvider));
      
      return { success: true, provider: newProvider };
    },
    onError: (error) => {
      console.error("Registration error:", error);
    },
  });

  const handleSubmit = async (userData: ProviderFormData) => {
    register(userData, {
      onSuccess: () => {
        if (userData.email) {
          setRegisteredEmail(userData.email);
        } else {
          // Auto-login for phone registration
          router.push("/auth/signin?registered=true");
        }
      },
    });
  };

  const errorMessage = error instanceof Error ? error.message : null;

  // If we have a registered email, show verification notice
  if (registeredEmail) {
    return (
      <div className="w-full max-w-md mx-auto p-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl neumorph-flat bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h1>
          <p className="text-gray-600 text-sm">
            We've sent a verification link to <strong>{registeredEmail}</strong>
          </p>
        </div>
        
        <div className="neumorph-flat rounded-2xl p-6 text-center">
          <p className="text-sm text-gray-600 mb-4">
            Please check your email and click the verification link to activate your provider account.
          </p>
          <button
            onClick={() => router.push("/auth/signin")}
            className="text-purple-heart hover:underline text-sm font-medium"
          >
            Return to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <SignupForm
      onSubmit={handleSubmit}
      isLoading={isPending}
      error={errorMessage}
    />
  );
}