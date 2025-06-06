"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LogoSection from "../components/auth/LogoSection";
import Button from "../components/auth/Button";

export default function VerifyOTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const email = searchParams.get("email");
  const phone = searchParams.get("phone");
  const type = searchParams.get("type");
  const credential = email || phone;
  const authMode = email ? "email" : "phone";

  useEffect(() => {
    setMounted(true);
    
    if (!credential) {
      router.push("/signup");
    }
  }, [credential, router]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    
    if (otpCode.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // TODO: Implement actual OTP verification
      console.log("Verifying OTP:", { credential, otpCode, type });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, accept any 6-digit code
      if (type === "signup") {
        // Store user as verified and redirect to dashboard
        localStorage.setItem('provider', JSON.stringify({
          id: '1',
          email: email || `${phone}@provider.com`,
          name: 'Dr. Provider',
          type: 'provider',
          verified: true
        }));
        
        router.push('/dashboard');
      } else {
        router.push('/reset-password');
      }
      
    } catch (err) {
      console.error("OTP verification error:", err);
      setError("Invalid verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      // TODO: Implement resend OTP logic
      console.log("Resending OTP to:", credential);
      setError("");
      // Show success message or handle resend
    } catch (err) {
      setError("Failed to resend code. Please try again.");
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[color:var(--background)] p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <LogoSection />
        </div>

        <div className="neumorph-card rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl neumorph-flat bg-gradient-to-br from-purple-heart/10 to-royal-blue/10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 text-purple-heart"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[color:var(--foreground)] mb-2">
              Verify Your {authMode === "email" ? "Email" : "Phone"}
            </h1>
            <p className="text-[color:var(--muted-foreground)]">
              We've sent a 6-digit verification code to{" "}
              <span className="font-medium text-[color:var(--foreground)]">
                {credential}
              </span>
            </p>
          </div>

          {error && (
            <div className="p-4 mb-6 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
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
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                  />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* OTP Input */}
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-semibold rounded-xl neumorph-input bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-purple-heart/30 text-[color:var(--foreground)]"
                />
              ))}
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              onClick={handleVerify}
            >
              Verify Code
            </Button>

            <div className="text-center">
              <p className="text-sm text-[color:var(--muted-foreground)]">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="font-medium text-purple-heart hover:text-purple-heart/80 transition-colors"
                >
                  Resend
                </button>
              </p>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => router.back()}
                className="text-sm text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors"
              >
                ← Back to {type === "signup" ? "signup" : "login"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-[color:var(--muted-foreground)]">
            &copy; {new Date().getFullYear()} Heallink Healthcare. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}