"use client";

import { useState } from "react";
import Link from "next/link";
import InputField from "@/app/components/auth/InputField";
import Button from "@/app/components/ui/Button";
import AuthLayout from "@/app/components/auth/AuthLayout";

export type ProviderFormData = {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  specialization: string;
  licenseNumber: string;
  practiceType: string;
  yearsExperience: number;
};

interface SignupFormProps {
  onSubmit: (userData: ProviderFormData) => void;
  isLoading: boolean;
  error: string | null;
}

const SPECIALIZATIONS = [
  "Cardiology", "Dermatology", "Emergency Medicine", "Family Medicine",
  "Internal Medicine", "Neurology", "Obstetrics & Gynecology", "Oncology",
  "Orthopedics", "Pediatrics", "Psychiatry", "Radiology", "Surgery", "Other"
];

const PRACTICE_TYPES = [
  "Private Practice", "Hospital", "Clinic", "Urgent Care", "Telemedicine", "Other"
];

export default function SignupForm({ onSubmit, isLoading, error }: SignupFormProps) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [practiceType, setPracticeType] = useState("");
  const [yearsExperience, setYearsExperience] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    if (password.length < 8) {
      setValidationError("Password must be at least 8 characters");
      return false;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords don't match");
      return false;
    }

    if (!email && !phone) {
      setValidationError("Email or phone number is required");
      return false;
    }

    if (email && !validateEmail(email)) {
      setValidationError("Please enter a valid email address");
      return false;
    }

    if (!firstName || !lastName) {
      setValidationError("First and last name are required");
      return false;
    }

    if (!specialization) {
      setValidationError("Please select your specialization");
      return false;
    }

    if (!licenseNumber) {
      setValidationError("Medical license number is required");
      return false;
    }

    if (!practiceType) {
      setValidationError("Please select your practice type");
      return false;
    }

    if (!agreedToTerms) {
      setValidationError("You must agree to the terms of service");
      return false;
    }

    return true;
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!validateForm()) {
      return;
    }

    onSubmit({
      email,
      phone,
      password,
      firstName,
      lastName,
      specialization,
      licenseNumber,
      practiceType,
      yearsExperience,
    });
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email && !phone) {
      setValidationError("Email or phone number is required");
      return;
    }

    if (email && !validateEmail(email)) {
      setValidationError("Please enter a valid email address");
      return;
    }

    if (password.length < 8) {
      setValidationError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords don't match");
      return;
    }

    setValidationError(null);
    setStep(2);
  };

  const displayError = error || validationError;

  return (
    <AuthLayout
      title="Provider Registration"
      subtitle={
        step === 1
          ? "Create your provider account to join the Heallink network"
          : "Complete your professional profile"
      }
    >
      {displayError && (
        <div className="mb-6 p-4 rounded-xl neumorph-pressed bg-red-500/5 text-red-500 text-sm">
          {displayError}
        </div>
      )}

      {step === 1 && (
        <form onSubmit={handleNextStep} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              id="firstName"
              type="text"
              label="First Name"
              placeholder="John"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />
            <InputField
              id="lastName"
              type="text"
              label="Last Name"
              placeholder="Smith"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />
          </div>

          <InputField
            id="email"
            type="email"
            label="Email Address"
            placeholder="dr.smith@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            }
          />

          <div className="text-center text-sm text-gray-500">or</div>

          <InputField
            id="phone"
            type="tel"
            label="Phone Number"
            placeholder="+1 (555) 123-4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            }
          />

          <InputField
            id="password"
            type="password"
            label="Password"
            placeholder="Create a strong password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
          />

          <InputField
            id="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />

          <Button type="submit" className="w-full">
            Continue to Professional Info
          </Button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSignUp} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Medical Specialization <span className="text-red-500">*</span>
            </label>
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="w-full px-4 py-3 rounded-xl neumorph-pressed bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-purple-heart/20"
              required
            >
              <option value="">Select your specialization</option>
              {SPECIALIZATIONS.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          <InputField
            id="licenseNumber"
            type="text"
            label="Medical License Number"
            placeholder="MD123456"
            required
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Practice Type <span className="text-red-500">*</span>
            </label>
            <select
              value={practiceType}
              onChange={(e) => setPracticeType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl neumorph-pressed bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-purple-heart/20"
              required
            >
              <option value="">Select practice type</option>
              {PRACTICE_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Years of Experience
            </label>
            <input
              type="number"
              min="0"
              max="50"
              value={yearsExperience}
              onChange={(e) => setYearsExperience(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 rounded-xl neumorph-pressed bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-purple-heart/20"
              placeholder="Years of practice"
            />
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 rounded border-gray-300 text-purple-heart focus:ring-purple-heart"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree to the{" "}
              <Link href="/legal/terms" className="text-purple-heart hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/legal/privacy" className="text-purple-heart hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>

          <div className="flex space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setStep(1)}
              className="flex-1"
            >
              Back
            </Button>
            <Button type="submit" isLoading={isLoading} className="flex-1">
              Create Provider Account
            </Button>
          </div>
        </form>
      )}

      <div className="mt-6 text-center text-sm text-gray-600">
        Already have a provider account?{" "}
        <Link href="/auth/signin" className="text-purple-heart hover:underline font-medium">
          Sign in here
        </Link>
      </div>
    </AuthLayout>
  );
}