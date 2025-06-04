"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import SigninForm, { SigninCredentials } from "../components/SigninForm";

// Dummy provider data for testing
const DUMMY_PROVIDERS = [
  {
    email: "dr.smith@example.com",
    password: "password123",
    name: "Dr. John Smith",
    specialization: "Cardiology",
    licenseNumber: "MD123456"
  },
  {
    email: "dr.johnson@example.com", 
    password: "password123",
    name: "Dr. Sarah Johnson",
    specialization: "Pediatrics",
    licenseNumber: "MD789012"
  },
  {
    phone: "+1234567890",
    password: "password123",
    name: "Dr. Michael Brown",
    specialization: "Orthopedics",
    licenseNumber: "MD345678"
  }
];

export default function SigninContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const isRegistered = searchParams.get("registered") === "true";

  // Login mutation with dummy data
  const { mutate, isPending, error } = useMutation({
    mutationFn: async (credentials: SigninCredentials) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (credentials.email) {
        // Find provider by email
        const provider = DUMMY_PROVIDERS.find(p => 
          p.email === credentials.email && p.password === credentials.password
        );
        
        if (!provider) {
          throw new Error("Invalid email or password");
        }
        
        // Store provider data in localStorage for demo
        localStorage.setItem('provider', JSON.stringify({
          id: Math.random().toString(36).substr(2, 9),
          ...provider
        }));
        
        return { success: true };
      } else if (credentials.phone) {
        // Find provider by phone
        const provider = DUMMY_PROVIDERS.find(p => 
          p.phone === credentials.phone
        );
        
        if (!provider) {
          throw new Error("Phone number not found");
        }
        
        // For demo, accept any 6-digit OTP
        if (!/^\d{6}$/.test(credentials.otp)) {
          throw new Error("Invalid verification code");
        }
        
        // Store provider data in localStorage for demo
        localStorage.setItem('provider', JSON.stringify({
          id: Math.random().toString(36).substr(2, 9),
          ...provider
        }));
        
        return { success: true };
      }
      
      throw new Error("Either email or phone is required");
    },
    onSuccess: () => {
      router.push(callbackUrl);
    },
    onError: (error) => {
      console.error("Sign-in error:", error);
    },
  });

  const handleSubmit = (credentials: SigninCredentials) => {
    console.log("Submitting provider credentials:", credentials);
    mutate(credentials);
  };

  const errorMessage = error instanceof Error ? error.message : null;

  return (
    <SigninForm
      onSubmit={handleSubmit}
      isLoading={isPending}
      error={errorMessage}
    />
  );
}