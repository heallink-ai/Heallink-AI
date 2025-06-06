"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";

import { LogoSection } from "../components/LogoSection";
import { ThemeToggle } from "../components/ThemeToggle";
import { Button } from "../components/Button";
import { useAuth } from "../hooks/useAuth";

export function VerifyOTPPageContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  
  const { verifyOTP, resendOTP } = useAuth();

  const email = searchParams.get("email");
  const phone = searchParams.get("phone");
  const type = searchParams.get("type") as "signup" | "login" | "reset";
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

    if (!credential) return;

    try {
      const result = await verifyOTP.mutateAsync({
        credential,
        code: otpCode,
        type: type || "signup"
      });
      
      if (!result.success && result.message) {
        setError(result.message);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  const handleResendOTP = async () => {
    if (!credential) return;
    
    try {
      const result = await resendOTP.mutateAsync(credential);
      if (result.success) {
        setError("");
      } else if (result.message) {
        setError(result.message);
      }
    } catch (error) {
      setError("Failed to resend code. Please try again.");
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[color:var(--background)] p-4 relative">
      <ThemeToggle />
      
      <div className="max-w-md w-full">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <LogoSection />
        </motion.div>

        <motion.div 
          className="neumorph-card rounded-2xl p-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-center mb-8">
            <motion.div 
              className="w-16 h-16 mx-auto mb-4 rounded-2xl neumorph-flat bg-gradient-to-br from-purple-heart/10 to-royal-blue/10 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
            >
              <Mail className="w-8 h-8 text-purple-heart" />
            </motion.div>
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
            <motion.div 
              className="p-4 mb-6 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <span className="text-sm">{error}</span>
              </div>
            </motion.div>
          )}

          <div className="space-y-6">
            {/* OTP Input */}
            <motion.div 
              className="flex justify-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {otp.map((digit, index) => (
                <motion.input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-semibold rounded-xl neumorph-input bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-purple-heart/30 text-[color:var(--foreground)] transition-all duration-200"
                  whileFocus={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                />
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Button
                variant="default"
                size="lg"
                className="w-full"
                loading={verifyOTP.isPending}
                onClick={handleVerify}
              >
                Verify Code
              </Button>
            </motion.div>

            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p className="text-sm text-[color:var(--muted-foreground)]">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendOTP.isPending}
                  className="font-medium text-purple-heart hover:text-purple-heart/80 transition-colors disabled:opacity-50"
                >
                  {resendOTP.isPending ? "Sending..." : "Resend"}
                </button>
              </p>
            </motion.div>

            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 text-sm text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to {type === "signup" ? "signup" : "login"}
              </button>
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <p className="text-xs text-[color:var(--muted-foreground)]">
            &copy; {new Date().getFullYear()} Heallink Healthcare. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
}