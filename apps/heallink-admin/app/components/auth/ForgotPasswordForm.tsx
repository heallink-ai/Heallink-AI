"use client";

import { useState } from "react";
import InputField from "./InputField";
import Button from "./Button";
import { requestPasswordReset } from "../../api/auth-api";

interface ForgotPasswordFormProps {
  onClose: () => void;
}

export default function ForgotPasswordForm({
  onClose,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Call the API to request password reset
      const { error: resetError } = await requestPasswordReset(email);

      if (resetError) {
        setError(resetError);
        return;
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error("Password reset error:", err);
      setError("Unable to process your request. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-6 py-6 bg-[color:var(--card)] rounded-lg shadow-lg max-w-md w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Reset Password</h3>
        <button
          onClick={onClose}
          className="text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {isSubmitted ? (
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
          <h4 className="text-lg font-medium mb-2">Password Reset Link Sent</h4>
          <p className="text-[color:var(--muted-foreground)] mb-6">
            If an account exists with the email you provided, you&apos;ll
            receive password reset instructions shortly.
          </p>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <p className="text-[color:var(--muted-foreground)] mb-6">
            Enter your email address and we&apos;ll send you instructions to
            reset your password.
          </p>

          <InputField
            id="reset-email"
            label="Email Address"
            type="email"
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

          {error && (
            <div className="mb-4 p-3 bg-[color:var(--error)]/10 text-[color:var(--error)] rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              className="flex-1"
            >
              Reset Password
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
