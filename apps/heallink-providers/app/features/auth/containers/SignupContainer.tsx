"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, Lock, User, Building2, Stethoscope, FileText, Check } from "lucide-react";
import Link from "next/link";

import { useAuth } from "../hooks/useAuth";
import { signupStepOneSchema, signupStepTwoSchema, type SignupStepOneData, type SignupStepTwoData } from "../utils/validation";
import { Button } from "../components/Button";
import { InputField } from "../components/InputField";
import { PhoneInput } from "../components/PhoneInput";
import { SocialButton } from "../components/SocialButton";
import { AuthMode } from "../types/auth.types";

export function SignupContainer() {
  const [currentStep, setCurrentStep] = useState(1);
  const [authMode, setAuthMode] = useState<AuthMode>("email");
  const [stepOneData, setStepOneData] = useState<SignupStepOneData | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptMarketing, setAcceptMarketing] = useState(false);
  
  const { signup, socialLogin } = useAuth();

  // Step 1 form
  const stepOneForm = useForm<SignupStepOneData>({
    resolver: zodResolver(signupStepOneSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  // Step 2 form
  const stepTwoForm = useForm<SignupStepTwoData>({
    resolver: zodResolver(signupStepTwoSchema),
    defaultValues: {
      organization: "",
      specialty: "",
      licenseNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleStepOneSubmit = (data: SignupStepOneData) => {
    setStepOneData(data);
    setCurrentStep(2);
  };

  const handleStepTwoSubmit = async (data: SignupStepTwoData) => {
    if (!stepOneData) return;
    if (!acceptTerms) {
      stepTwoForm.setError("root", { message: "Please accept the Terms of Service to continue" });
      return;
    }

    const fullData = { ...stepOneData, ...data };
    
    try {
      const result = await signup.mutateAsync(fullData);
      if (!result.success && result.message) {
        stepTwoForm.setError("root", { message: result.message });
      }
    } catch (error) {
      console.error("Signup error:", error);
      stepTwoForm.setError("root", { message: "An unexpected error occurred" });
    }
  };

  const handleSocialSignup = async (provider: string) => {
    try {
      const result = await socialLogin.mutateAsync(provider);
      if (!result.success && result.message) {
        stepOneForm.setError("root", { message: result.message });
      }
    } catch (error) {
      console.error("Social signup error:", error);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
            currentStep >= 1 ? "bg-gradient-to-r from-purple-heart to-royal-blue text-white shadow-lg scale-110" : "bg-[color:var(--muted)] text-[color:var(--muted-foreground)]"
          }`}>
            {currentStep > 1 ? <Check className="w-4 h-4" /> : "1"}
          </div>
          <div className={`w-12 h-0.5 transition-all duration-300 ${
            currentStep >= 2 ? "bg-gradient-to-r from-purple-heart to-royal-blue" : "bg-[color:var(--border)]"
          }`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
            currentStep >= 2 ? "bg-gradient-to-r from-purple-heart to-royal-blue text-white shadow-lg scale-110" : "bg-[color:var(--muted)] text-[color:var(--muted-foreground)]"
          }`}>
            2
          </div>
        </div>
      </div>

      {currentStep === 1 ? (
        <div className="space-y-5">
          {/* Step 1: Basic Information */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-[color:var(--foreground)]">Personal Information</h3>
            <p className="text-sm text-[color:var(--muted-foreground)]">Let's start with your basic details</p>
          </div>

          {/* Error display */}
          {stepOneForm.formState.errors.root && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <span className="text-sm">{stepOneForm.formState.errors.root.message}</span>
              </div>
            </div>
          )}

          <form onSubmit={stepOneForm.handleSubmit(handleStepOneSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <InputField
                {...stepOneForm.register("firstName")}
                label="First Name"
                type="text"
                placeholder="John"
                required
                error={stepOneForm.formState.errors.firstName?.message}
                icon={<User className="w-5 h-5" />}
                autoComplete="given-name"
              />
              <InputField
                {...stepOneForm.register("lastName")}
                label="Last Name"
                type="text"
                placeholder="Doe"
                required
                error={stepOneForm.formState.errors.lastName?.message}
                icon={<User className="w-5 h-5" />}
                autoComplete="family-name"
              />
            </div>

            {/* Auth mode toggle */}
            <div className="neumorph-flat rounded-xl p-1 flex">
              <button
                type="button"
                onClick={() => setAuthMode("email")}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  authMode === "email"
                    ? "bg-gradient-to-r from-purple-heart to-royal-blue text-white shadow-lg"
                    : "text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]"
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("phone")}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  authMode === "phone"
                    ? "bg-gradient-to-r from-purple-heart to-royal-blue text-white shadow-lg"
                    : "text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]"
                }`}
              >
                Phone
              </button>
            </div>

            {authMode === "email" ? (
              <InputField
                {...stepOneForm.register("email")}
                label="Email Address"
                type="email"
                placeholder="dr.smith@hospital.com"
                required
                error={stepOneForm.formState.errors.email?.message}
                icon={<Mail className="w-5 h-5" />}
                autoComplete="email"
              />
            ) : (
              <PhoneInput
                {...stepOneForm.register("phone")}
                label="Phone Number"
                placeholder="+1 (555) 123-4567"
                required
                error={stepOneForm.formState.errors.phone?.message}
                onValueChange={(value) => stepOneForm.setValue("phone", value)}
                value={stepOneForm.watch("phone")}
              />
            )}

            <Button
              type="submit"
              variant="default"
              size="lg"
              className="w-full"
            >
              Continue
            </Button>
          </form>

          {/* Social signup */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[color:var(--border)]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[color:var(--background)] text-[color:var(--muted-foreground)]">
                Or sign up with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <SocialButton
              provider="google"
              onClick={() => handleSocialSignup("google")}
              loading={socialLogin.isPending}
            />
            <SocialButton
              provider="facebook"
              onClick={() => handleSocialSignup("facebook")}
              loading={socialLogin.isPending}
            />
            <SocialButton
              provider="apple"
              onClick={() => handleSocialSignup("apple")}
              loading={socialLogin.isPending}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Step 2: Professional Information */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-[color:var(--foreground)]">Professional Details</h3>
            <p className="text-sm text-[color:var(--muted-foreground)]">Tell us about your practice</p>
          </div>

          {/* Error display */}
          {stepTwoForm.formState.errors.root && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <span className="text-sm">{stepTwoForm.formState.errors.root.message}</span>
              </div>
            </div>
          )}

          <form onSubmit={stepTwoForm.handleSubmit(handleStepTwoSubmit)} className="space-y-5">
            <InputField
              {...stepTwoForm.register("organization")}
              label="Organization/Hospital"
              type="text"
              placeholder="City General Hospital"
              required
              error={stepTwoForm.formState.errors.organization?.message}
              icon={<Building2 className="w-5 h-5" />}
            />

            <InputField
              {...stepTwoForm.register("specialty")}
              label="Medical Specialty"
              type="text"
              placeholder="Internal Medicine, Cardiology, etc."
              required
              error={stepTwoForm.formState.errors.specialty?.message}
              icon={<Stethoscope className="w-5 h-5" />}
            />

            <InputField
              {...stepTwoForm.register("licenseNumber")}
              label="Medical License Number (Optional)"
              type="text"
              placeholder="MD123456"
              error={stepTwoForm.formState.errors.licenseNumber?.message}
              icon={<FileText className="w-5 h-5" />}
            />

            <InputField
              {...stepTwoForm.register("password")}
              label="Password"
              type="password"
              placeholder="Minimum 8 characters"
              required
              error={stepTwoForm.formState.errors.password?.message}
              icon={<Lock className="w-5 h-5" />}
              autoComplete="new-password"
            />

            <InputField
              {...stepTwoForm.register("confirmPassword")}
              label="Confirm Password"
              type="password"
              placeholder="Re-enter your password"
              required
              error={stepTwoForm.formState.errors.confirmPassword?.message}
              icon={<Check className="w-5 h-5" />}
              autoComplete="new-password"
            />

            {/* Terms and conditions */}
            <div className="space-y-3">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-[color:var(--border)] text-purple-heart focus:ring-purple-heart/30"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                />
                <label className="ml-2 text-sm text-[color:var(--foreground)]">
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

              <div className="flex items-start">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-[color:var(--border)] text-purple-heart focus:ring-purple-heart/30"
                  checked={acceptMarketing}
                  onChange={(e) => setAcceptMarketing(e.target.checked)}
                />
                <label className="ml-2 text-sm text-[color:var(--muted-foreground)]">
                  I'd like to receive updates about new features and healthcare insights
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full"
                onClick={handlePrevStep}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full"
                loading={stepTwoForm.formState.isSubmitting}
              >
                Create Account
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Sign in link */}
      <div className="text-center">
        <p className="text-sm text-[color:var(--muted-foreground)]">
          Already have an account?{" "}
          <Link
            href="/"
            className="font-medium text-purple-heart hover:text-purple-heart/80 transition-colors"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}