"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/app/components/auth/AuthLayout";
import InputField from "@/app/components/auth/InputField";
import Button from "@/app/components/ui/Button";
import { useForgotPassword } from "@/app/hooks/auth/use-auth";
import { ApiError } from "@/app/api-types";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const {
    mutate: requestPasswordReset,
    isPending: isLoading,
    error: resetError,
  } = useForgotPassword();

  const error = resetError ? (resetError as ApiError).message : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    requestPasswordReset(
      { email },
      {
        onSuccess: () => {
          setSubmitted(true);
        },
      }
    );
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your email and we'll send you instructions to reset your password"
    >
      {error && (
        <div className="mb-6 p-4 rounded-xl neumorph-pressed bg-red-500/5 text-red-500 text-sm">
          {error}
        </div>
      )}

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.push("/auth/signin")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
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
                "Send Reset Link"
              )}
            </Button>
          </div>
        </form>
      ) : (
        <div className="text-center">
          <div className="inline-block rounded-full p-4 bg-gradient-to-r from-purple-heart/10 to-royal-blue/10 neumorph-flat mb-6">
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
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h3 className="text-xl font-semibold high-contrast-text mb-2">
            Check your email
          </h3>
          <p className="light-text-muted mb-6">
            We've sent a password reset link to
            <br />
            <strong>{email}</strong>
          </p>

          <p className="text-sm light-text-muted mb-8">
            Didn't receive the email? Check your spam folder or{" "}
            <button
              type="button"
              onClick={handleSubmit}
              className="text-purple-heart hover:text-purple-heart-600"
            >
              try again
            </button>
          </p>

          <Button variant="outline" onClick={() => router.push("/auth/signin")}>
            Back to Sign In
          </Button>
        </div>
      )}
    </AuthLayout>
  );
}
