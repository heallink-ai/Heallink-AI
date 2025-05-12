"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import InputField from "../components/auth/InputField";
import Button from "../components/auth/Button";

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [isValidToken, setIsValidToken] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const resetToken = searchParams.get("token");
    if (!resetToken) {
      setError("Missing reset token");
      setIsValidating(false);
      return;
    }

    setToken(resetToken);

    // Validate the token
    const validateToken = async () => {
      try {
        const response = await fetch(`/api/reset-password?token=${resetToken}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Invalid or expired token");
          setIsValidToken(false);
        } else {
          setIsValidToken(true);
        }
      } catch (err) {
        console.error("Error validating token:", err);
        setError("Failed to validate reset token");
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to reset password");
      } else {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/");
        }, 3000);
      }
    } catch (err) {
      console.error("Error resetting password:", err);
      setError("An error occurred while resetting your password");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[color:var(--background)] p-4">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[color:var(--primary)] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-[color:var(--foreground)]">
            Validating reset token...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[color:var(--background)] p-4">
      <div className="card-admin p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-[color:var(--foreground)]">
            {success ? "Password Reset Successful" : "Reset Your Password"}
          </h1>
          {!success && !error && isValidToken && (
            <p className="text-[color:var(--muted-foreground)] mt-2">
              Please enter your new password below
            </p>
          )}
        </div>

        {error && (
          <div className="p-4 mb-6 text-sm rounded-lg bg-[color:var(--error)]/10 text-[color:var(--error)]">
            <div className="flex items-center gap-2">
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
              <span>{error}</span>
            </div>
          </div>
        )}

        {success ? (
          <div className="text-center py-6">
            <div className="mb-4 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-[color:var(--success)]/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8 text-[color:var(--success)]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-[color:var(--muted-foreground)] mb-6">
              Your password has been reset successfully. You will be redirected
              to the login page shortly.
            </p>
            <Link
              href="/"
              className="px-4 py-2 rounded-md bg-[color:var(--primary)] text-white hover:bg-[color:var(--primary)]/90 transition-colors"
            >
              Return to Login
            </Link>
          </div>
        ) : isValidToken ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              id="new-password"
              label="New Password"
              type="password"
              placeholder="Enter your new password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
              id="confirm-password"
              label="Confirm Password"
              type="password"
              placeholder="Confirm your new password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              }
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isSubmitting}
            >
              Reset Password
            </Button>
          </form>
        ) : (
          <div className="text-center py-6">
            <Link
              href="/"
              className="px-4 py-2 rounded-md bg-[color:var(--primary)] text-white hover:bg-[color:var(--primary)]/90 transition-colors"
            >
              Return to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
