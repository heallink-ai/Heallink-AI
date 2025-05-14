"use client";

import { useState } from "react";
import InputField from "@/app/components/auth/InputField";
import PhoneInput from "@/app/components/auth/PhoneInput";
import SocialButtons from "@/app/components/auth/SocialButtons";
import AuthDivider from "@/app/components/auth/AuthDivider";
import Button from "@/app/components/ui/Button";
import AuthLayout from "@/app/components/auth/AuthLayout";

export type UserFormData = {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  accountType: "patient" | "provider";
};

interface SignupFormProps {
  onSubmit: (userData: UserFormData) => void;
  isLoading: boolean;
  error: string | null;
}

export default function SignupForm({
  onSubmit,
  isLoading,
  error,
}: SignupFormProps) {
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState<"patient" | "provider">(
    "patient"
  );

  // Form state
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Validation for email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Final form validation before submission
  const validateForm = () => {
    // Validate password meets requirements
    if (password.length < 8) {
      setValidationError("Password must be at least 8 characters");
      return false;
    }

    // Check if it contains uppercase, lowercase, and special characters
    const passwordRegex =
      /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
    if (!passwordRegex.test(password)) {
      setValidationError(
        "Password must include uppercase, lowercase letters, and at least one number or special character"
      );
      return false;
    }

    // Check password match
    if (password !== confirmPassword) {
      setValidationError("Passwords don't match");
      return false;
    }

    // Check email or phone is provided
    if (!email && !phone) {
      setValidationError("Email or phone number is required");
      return false;
    }

    // If email is provided, validate it
    if (email && !validateEmail(email)) {
      setValidationError("Please enter a valid email address");
      return false;
    }

    // If phone is provided, validate it (isPhoneValid is set by PhoneInput component)
    if (phone && !isPhoneValid) {
      setValidationError("Please enter a valid phone number");
      return false;
    }

    // Check name fields
    if (!firstName || !lastName) {
      setValidationError("First and last name are required");
      return false;
    }

    // Check terms agreement
    if (!agreedToTerms) {
      setValidationError("You must agree to the terms of service");
      return false;
    }

    return true;
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validate the form
    if (!validateForm()) {
      return;
    }

    // Prepare user data and call onSubmit
    onSubmit({
      email,
      phone,
      password,
      firstName,
      lastName,
      accountType,
    });
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate first step before proceeding
    if (!email && !phone) {
      setValidationError("Email or phone number is required");
      return;
    }

    if (email && !validateEmail(email)) {
      setValidationError("Please enter a valid email address");
      return;
    }

    if (phone && !isPhoneValid) {
      setValidationError("Please enter a valid phone number");
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

    setValidationError(null); // Clear any errors
    setStep(2);
  };

  // Display either validation errors or API errors
  const displayError = error || validationError;

  return (
    <AuthLayout
      title="Create Account"
      subtitle={
        step === 1
          ? "Join Heallink to get personalized healthcare routing"
          : "Complete your profile to get started"
      }
    >
      {displayError && (
        <div className="mb-6 p-4 rounded-xl neumorph-pressed bg-red-500/5 text-red-500 text-sm">
          {displayError}
        </div>
      )}

      {step === 1 && (
        <div>
          {/* Account type selector */}
          <div className="mb-6 p-2 rounded-xl neumorph-flat flex">
            <button
              type="button"
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex flex-col items-center gap-2 ${
                accountType === "patient"
                  ? "neumorph-pressed bg-gradient-to-r from-purple-heart/10 to-royal-blue/10 text-purple-heart"
                  : "hover:bg-purple-heart/5"
              }`}
              onClick={() => setAccountType("patient")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
              Patient
            </button>
            <button
              type="button"
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex flex-col items-center gap-2 ${
                accountType === "provider"
                  ? "neumorph-pressed bg-gradient-to-r from-purple-heart/10 to-royal-blue/10 text-purple-heart"
                  : "hover:bg-purple-heart/5"
              }`}
              onClick={() => setAccountType("provider")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                />
              </svg>
              Provider
            </button>
          </div>

          <form onSubmit={handleNextStep} className="space-y-6">
            <InputField
              id="email"
              type="email"
              label="Email address"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              autoComplete="email"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              }
            />

            <PhoneInput
              value={phone}
              onChange={setPhone}
              onValidationChange={setIsPhoneValid}
            />

            <InputField
              id="password"
              type="password"
              label="Password"
              placeholder="Create a strong password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
              }
            />

            <InputField
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="Repeat your password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              error={
                password !== confirmPassword && confirmPassword !== ""
                  ? "Passwords don't match"
                  : undefined
              }
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              }
            />

            <Button type="submit" className="w-full">
              Continue
            </Button>

            <AuthDivider text="or sign up with" />

            <SocialButtons />

            <div className="text-center text-sm light-text-muted">
              Already have an account?{" "}
              <a
                href="/auth/signin"
                className="text-purple-heart hover:text-purple-heart-600 font-medium"
              >
                Sign in
              </a>
            </div>
          </form>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleSignUp} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              id="firstName"
              type="text"
              label="First Name"
              placeholder="Enter your first name"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoComplete="given-name"
            />

            <InputField
              id="lastName"
              type="text"
              label="Last Name"
              placeholder="Enter your last name"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              autoComplete="family-name"
            />
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                required
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-purple-heart dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="light-text-muted text-xs">
                I agree to Heallink&apos;s{" "}
                <a
                  href="/terms-of-service"
                  className="text-purple-heart hover:text-purple-heart-600"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy-policy"
                  className="text-purple-heart hover:text-purple-heart-600"
                >
                  Privacy Policy
                </a>
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setStep(1)}
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !agreedToTerms}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
