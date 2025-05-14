"use client";

import { useState } from "react";
import InputField from "@/app/components/auth/InputField";
import PhoneInput from "@/app/components/auth/PhoneInput";
import SocialButtons from "@/app/components/auth/SocialButtons";
import AuthDivider from "@/app/components/auth/AuthDivider";
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
};

export default function SigninForm({
  onSubmit,
  isLoading,
  error,
}: SigninFormProps) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [authMethod, setAuthMethod] = useState<"email" | "phone" | "social">(
    "email"
  );
  const [otpSent, setOtpSent] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Validation for email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone || !isPhoneValid) {
      setValidationError("Please enter a valid phone number");
      return;
    }

    setValidationError(null);
    setOtpSent(true);
    // In a real implementation, this would trigger an API call to send OTP
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

    onSubmit({ email, phone: "", otp: "" });
  };

  const handlePhoneSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!phone || !isPhoneValid) {
      setValidationError("Please enter a valid phone number");
      return;
    }

    if (!otp) {
      setValidationError("Please enter the verification code");
      return;
    }

    onSubmit({ email: "", phone, otp });
  };

  // Display either validation errors or API errors
  const displayError = error || validationError;

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account to continue your healthcare journey"
    >
      {displayError && (
        <div className="mb-6 p-4 rounded-xl neumorph-pressed bg-red-500/5 text-red-500 text-sm">
          {displayError}
        </div>
      )}

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
        <button
          type="button"
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            authMethod === "social"
              ? "neumorph-pressed bg-gradient-to-r from-purple-heart/10 to-royal-blue/10 text-purple-heart"
              : "hover:bg-purple-heart/5"
          }`}
          onClick={() => setAuthMethod("social")}
        >
          Social
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

          <div>
            <Button type="submit" disabled={isLoading} className="w-full">
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
                  Signing In...
                </>
              ) : (
                "Sign in with Email"
              )}
            </Button>
          </div>

          <div className="text-center text-sm">
            <a
              href="/auth/forgot-password"
              className="text-purple-heart hover:text-purple-heart-600"
            >
              Forgot password?
            </a>
          </div>

          <AuthDivider text="or sign in with" />

          <SocialButtons />

          <div className="text-center text-sm light-text-muted">
            Don&apos;t have an account?{" "}
            <a
              href="/auth/signup"
              className="text-purple-heart hover:text-purple-heart-600 font-medium"
            >
              Create account
            </a>
          </div>
        </form>
      )}

      {/* Phone sign in form */}
      {authMethod === "phone" && (
        <div className="space-y-6">
          {!otpSent ? (
            <form onSubmit={handleSendOtp}>
              <PhoneInput
                value={phone}
                onChange={setPhone}
                onValidationChange={setIsPhoneValid}
                error={validationError || undefined}
              />

              <div className="mt-6">
                <Button type="submit" disabled={isLoading} className="w-full">
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
                      Sending...
                    </>
                  ) : (
                    "Send Verification Code"
                  )}
                </Button>
              </div>

              <AuthDivider text="or sign in with" />

              <SocialButtons />

              <div className="text-center text-sm light-text-muted">
                Don&apos;t have an account?{" "}
                <a
                  href="/auth/signup"
                  className="text-purple-heart hover:text-purple-heart-600 font-medium"
                >
                  Create account
                </a>
              </div>
            </form>
          ) : (
            <form onSubmit={handlePhoneSignIn}>
              <InputField
                id="otp"
                type="text"
                label="Verification Code"
                placeholder="Enter the code sent to your phone"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
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
                      d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33"
                    />
                  </svg>
                }
              />

              <div className="mt-6">
                <Button type="submit" disabled={isLoading} className="w-full">
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
                      Verifying...
                    </>
                  ) : (
                    "Verify Code"
                  )}
                </Button>
              </div>

              <div className="mt-4 flex justify-between text-sm">
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-purple-heart hover:text-purple-heart-600"
                >
                  Change phone number
                </button>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="text-purple-heart hover:text-purple-heart-600"
                >
                  Resend code
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Social sign in */}
      {authMethod === "social" && (
        <div className="space-y-6">
          <SocialButtons />

          <div className="text-center text-sm light-text-muted">
            Don&apos;t have an account?{" "}
            <a
              href="/auth/signup"
              className="text-purple-heart hover:text-purple-heart-600 font-medium"
            >
              Create account
            </a>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
