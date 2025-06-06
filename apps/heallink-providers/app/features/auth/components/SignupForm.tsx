"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, User, Building, Stethoscope, Key, Lock, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import { signupStepOneSchema, signupStepTwoSchema, type SignupStepOneData, type SignupStepTwoData } from "../utils/validation";
import { Button } from "./Button";
import { InputField } from "./InputField";
import { PhoneInput } from "./PhoneInput";
import { SocialButton } from "./SocialButton";
import { AuthMode } from "../types/auth.types";

interface SignupFormProps {
  onSubmit: (data: any) => Promise<void>;
  onSocialLogin: (provider: string) => Promise<void>;
  isLoading?: boolean;
  isSocialLoading?: boolean;
  error?: string;
}

export function SignupForm({ 
  onSubmit, 
  onSocialLogin, 
  isLoading = false, 
  isSocialLoading = false,
  error 
}: SignupFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [authMode, setAuthMode] = useState<AuthMode>("email");
  const [stepOneData, setStepOneData] = useState<SignupStepOneData | null>(null);

  const stepOneForm = useForm<SignupStepOneData>({
    resolver: zodResolver(signupStepOneSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

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

  const handleStepOneSubmit = async (data: SignupStepOneData) => {
    // If phone authentication, redirect to OTP
    if (data.phone && !data.email) {
      await onSubmit({ ...data, type: "phone" });
      return;
    }
    
    setStepOneData(data);
    setCurrentStep(2);
  };

  const handleStepTwoSubmit = async (data: SignupStepTwoData) => {
    const completeData = { ...stepOneData, ...data };
    await onSubmit(completeData);
  };

  const handleSocialClick = async (provider: string) => {
    try {
      await onSocialLogin(provider);
    } catch (error) {
      console.error("Social signup error:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            currentStep >= 1 ? "bg-gradient-to-r from-purple-heart to-royal-blue text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500"
          }`}>
            1
          </div>
          <div className={`w-16 h-1 transition-all duration-300 ${
            currentStep > 1 ? "bg-gradient-to-r from-purple-heart to-royal-blue" : "bg-gray-200 dark:bg-gray-700"
          }`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            currentStep >= 2 ? "bg-gradient-to-r from-purple-heart to-royal-blue text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500"
          }`}>
            2
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {currentStep === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Auth mode toggle */}
            <motion.div 
              className="neumorph-flat rounded-xl p-1 flex mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <button
                type="button"
                onClick={() => setAuthMode("email")}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                  authMode === "email"
                    ? "bg-gradient-to-r from-purple-heart to-royal-blue text-white shadow-lg"
                    : "text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] hover:bg-purple-heart/5"
                }`}
              >
                <Mail className="w-4 h-4 mx-auto mb-1" />
                Email
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("phone")}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                  authMode === "phone"
                    ? "bg-gradient-to-r from-purple-heart to-royal-blue text-white shadow-lg"
                    : "text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] hover:bg-purple-heart/5"
                }`}
              >
                <Phone className="w-4 h-4 mx-auto mb-1" />
                Phone
              </button>
            </motion.div>

            {/* Error display */}
            {(stepOneForm.formState.errors.root || error) && (
              <motion.div 
                className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 mb-6"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <span className="text-sm">{stepOneForm.formState.errors.root?.message || error}</span>
                </div>
              </motion.div>
            )}

            <form onSubmit={stepOneForm.handleSubmit(handleStepOneSubmit)} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <InputField
                    {...stepOneForm.register("firstName")}
                    label="First Name"
                    placeholder="John"
                    required
                    error={stepOneForm.formState.errors.firstName?.message}
                    icon={<User className="w-5 h-5" />}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <InputField
                    {...stepOneForm.register("lastName")}
                    label="Last Name"
                    placeholder="Doe"
                    required
                    error={stepOneForm.formState.errors.lastName?.message}
                    icon={<User className="w-5 h-5" />}
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {authMode === "email" ? (
                  <InputField
                    {...stepOneForm.register("email")}
                    label="Email Address"
                    type="email"
                    placeholder="dr.johndoe@hospital.com"
                    required
                    error={stepOneForm.formState.errors.email?.message}
                    icon={<Mail className="w-5 h-5" />}
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
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  className="w-full group"
                  loading={stepOneForm.formState.isSubmitting || isLoading}
                >
                  {authMode === "phone" ? "Send OTP" : "Continue"}
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </form>

            {/* Social signup */}
            <motion.div 
              className="relative my-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[color:var(--border)]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[color:var(--background)] text-[color:var(--muted-foreground)]">
                  Or sign up with
                </span>
              </div>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <SocialButton
                provider="google"
                onClick={() => handleSocialClick("google")}
                loading={isSocialLoading}
              />
              <SocialButton
                provider="facebook"
                onClick={() => handleSocialClick("facebook")}
                loading={isSocialLoading}
              />
              <SocialButton
                provider="apple"
                onClick={() => handleSocialClick("apple")}
                loading={isSocialLoading}
              />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={stepTwoForm.handleSubmit(handleStepTwoSubmit)} className="space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <InputField
                  {...stepTwoForm.register("organization")}
                  label="Organization"
                  placeholder="General Hospital"
                  required
                  error={stepTwoForm.formState.errors.organization?.message}
                  icon={<Building className="w-5 h-5" />}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <InputField
                  {...stepTwoForm.register("specialty")}
                  label="Medical Specialty"
                  placeholder="Internal Medicine"
                  required
                  error={stepTwoForm.formState.errors.specialty?.message}
                  icon={<Stethoscope className="w-5 h-5" />}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <InputField
                  {...stepTwoForm.register("licenseNumber")}
                  label="License Number (Optional)"
                  placeholder="MD123456"
                  error={stepTwoForm.formState.errors.licenseNumber?.message}
                  icon={<Key className="w-5 h-5" />}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <InputField
                  {...stepTwoForm.register("password")}
                  label="Password"
                  type="password"
                  placeholder="Create a secure password"
                  required
                  error={stepTwoForm.formState.errors.password?.message}
                  icon={<Lock className="w-5 h-5" />}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <InputField
                  {...stepTwoForm.register("confirmPassword")}
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                  required
                  error={stepTwoForm.formState.errors.confirmPassword?.message}
                  icon={<Lock className="w-5 h-5" />}
                />
              </motion.div>

              <div className="flex gap-3">
                <motion.div
                  className="flex-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={() => setCurrentStep(1)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                </motion.div>
                <motion.div
                  className="flex-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Button
                    type="submit"
                    variant="default"
                    size="lg"
                    className="w-full"
                    loading={stepTwoForm.formState.isSubmitting || isLoading}
                  >
                    Create Account
                  </Button>
                </motion.div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sign in link */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-sm text-[color:var(--muted-foreground)]">
          Already have an account?{" "}
          <Link
            href="/"
            className="font-medium text-purple-heart hover:text-purple-heart/80 transition-colors"
          >
            Sign in here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}