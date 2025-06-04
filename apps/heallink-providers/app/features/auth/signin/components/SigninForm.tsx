"use client";

import { useState } from "react";
import Link from "next/link";
import InputField from "@/app/components/auth/InputField";
import Button from "@/app/components/ui/Button";
import AuthLayout from "@/app/components/auth/AuthLayout";

export type SigninFormProps = {
  onSubmit: (credentials: SigninCredentials) => void;
  isLoading: boolean;
  error: string | null;
};

export type SigninCredentials = {
  email: string;
  phone: string;
  otp: string;
  password: string;
};

export default function SigninForm({ onSubmit, isLoading, error }: SigninFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [otpSent, setOtpSent] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setValidationError("Please enter a phone number");
      return;
    }
    setValidationError(null);
    setOtpSent(true);
  };

  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!email) {
      setValidationError("Email is required");
      return;
    }
    if (!validateEmail(email)) {
      setValidationError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setValidationError("Password is required");
      return;
    }
    if (password.length < 8) {
      setValidationError("Password must be at least 8 characters");
      return;
    }

    onSubmit({ email, phone: "", otp: "", password });
  };

  const handlePhoneSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!phone) {
      setValidationError("Please enter a phone number");
      return;
    }
    if (!otp) {
      setValidationError("Please enter the verification code");
      return;
    }

    onSubmit({ email: "", phone, otp, password: "" });
  };

  const displayError = error || validationError;

  return (
    <AuthLayout
      title="Provider Sign In"
      subtitle="Access your provider dashboard to manage patients and practice"
    >
      {displayError && (
        <div className="mb-6 p-4 rounded-xl neumorph-pressed bg-red-500/5 text-red-500 text-sm">
          {displayError}
        </div>
      )}

      {/* Demo credentials info */}
      <div className="mb-6 p-4 rounded-xl neumorph-flat bg-blue-500/5 text-blue-600 text-sm">
        <p className="font-medium mb-2">Demo Credentials:</p>
        <p>Email: dr.smith@example.com</p>
        <p>Password: password123</p>
        <p className="mt-2 text-xs">Or use phone: +1234567890 with any 6-digit OTP</p>
      </div>

      {/* Auth method selector */}
      <div className="mb-6 p-2 rounded-xl neumorph-flat flex">
        <button
          type="button"
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            authMethod === "email"
              ? "neumorph-pressed bg-gradient-to-r from-purple-heart/10 to-royal-blue/10 text-purple-heart"
              : "hover:bg-purple-heart/5"
          }`}
          onClick={() => setAuthMethod("email")}
        >
          Email
        </button>
        <button
          type="button"
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            authMethod === "phone"
              ? "neumorph-pressed bg-gradient-to-r from-purple-heart/10 to-royal-blue/10 text-purple-heart"
              : "hover:bg-purple-heart/5"
          }`}
          onClick={() => setAuthMethod("phone")}
        >
          Phone
        </button>
      </div>

      {/* Email sign in form */}
      {authMethod === "email" && (
        <form onSubmit={handleEmailSignIn} className="space-y-6">
          <InputField
            id="email"
            type="email"
            label="Email address"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            }
          />

          <InputField
            id="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
          />

          <Button type="submit" isLoading={isLoading} className="w-full">
            Sign In
          </Button>
        </form>
      )}

      {/* Phone sign in form */}
      {authMethod === "phone" && (
        <div className="space-y-6">
          {!otpSent ? (
            <form onSubmit={handleSendOtp}>
              <InputField
                id="phone"
                type="tel"
                label="Phone number"
                placeholder="Enter your phone number"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                }
              />
              <Button type="submit" className="w-full mt-4">
                Send Verification Code
              </Button>
            </form>
          ) : (
            <form onSubmit={handlePhoneSignIn}>
              <InputField
                id="otp"
                type="text"
                label="Verification Code"
                placeholder="Enter 6-digit code"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <Button type="submit" isLoading={isLoading} className="w-full mt-4">
                Verify & Sign In
              </Button>
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-full mt-2 text-sm text-purple-heart hover:underline"
              >
                Use different phone number
              </button>
            </form>
          )}
        </div>
      )}

      {/* Footer links */}
      <div className="mt-6 text-center space-y-2">
        <Link href="/auth/forgot-password" className="text-sm text-purple-heart hover:underline">
          Forgot your password?
        </Link>
        <div className="text-sm text-gray-600">
          Don't have a provider account?{" "}
          <Link href="/auth/signup" className="text-purple-heart hover:underline font-medium">
            Sign up here
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}