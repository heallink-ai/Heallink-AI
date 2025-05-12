"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLayout from "@/app/components/auth/AuthLayout";
import InputField from "@/app/components/auth/InputField";
import PhoneInput from "@/app/components/auth/PhoneInput";
import SocialButtons from "@/app/components/auth/SocialButtons";
import AuthDivider from "@/app/components/auth/AuthDivider";
import Button from "@/app/components/ui/Button";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [authMethod, setAuthMethod] = useState<"email" | "phone" | "social">(
    "email"
  );
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("email", {
        email,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError("Failed to sign in. Please try again.");
      } else {
        router.push("/auth/verify-request");
      }
    } catch (error) {
      setError("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Here you would implement sending OTP logic
      // For demo purposes, we'll just simulate it
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setOtpSent(true);
    } catch (error) {
      setError("Failed to send OTP. Please try again.");
    }

    setIsLoading(false);
  };

  const handlePhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("phone", {
        phone,
        otp,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError("Invalid OTP. Please try again.");
      } else {
        router.push(callbackUrl);
      }
    } catch (error) {
      setError("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account to continue your healthcare journey"
    >
      {error && (
        <div className="mb-6 p-4 rounded-xl neumorph-pressed bg-red-500/5 text-red-500 text-sm">
          {error}
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
            Don't have an account?{" "}
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
              <PhoneInput value={phone} onChange={setPhone} error={error} />

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
                Don't have an account?{" "}
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
              <div className="text-center mb-6">
                <div className="inline-block rounded-full p-3 bg-gradient-to-r from-purple-heart/10 to-royal-blue/10 neumorph-flat">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-purple-heart"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium high-contrast-text mt-3">
                  Verification Code
                </h3>
                <p className="text-sm light-text-muted">
                  We've sent a code to {phone}
                </p>
              </div>

              <InputField
                id="otp"
                type="text"
                label="Enter verification code"
                placeholder="Enter the 6-digit code"
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
                      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
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

          <AuthDivider />

          <div className="text-center text-sm light-text-muted">
            Don't have an account?{" "}
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
