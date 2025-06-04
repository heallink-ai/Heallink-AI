"use client";

import Link from "next/link";
import Button from "@/app/components/ui/Button";
import AuthLayout from "@/app/components/auth/AuthLayout";

interface VerificationNoticeProps {
  email: string;
}

export default function VerificationNotice({ email }: VerificationNoticeProps) {
  return (
    <AuthLayout
      title="Check Your Email"
      subtitle="We've sent you a verification link"
    >
      <div className="text-center space-y-6">
        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-heart to-royal-blue rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <p className="text-gray-600">
            We've sent a verification email to:
          </p>
          <p className="font-semibold text-purple-heart">{email}</p>
        </div>

        <div className="p-4 rounded-xl neumorph-flat bg-blue-500/5 text-blue-600 text-sm">
          <p className="font-semibold mb-2">Demo Mode:</p>
          <p>In demo mode, email verification is simulated. You can proceed to sign in directly.</p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Click the verification link in your email to activate your provider account.
            If you don't see the email, check your spam folder.
          </p>

          <Link href="/auth/signin">
            <Button variant="primary" size="lg" className="w-full">
              Continue to Sign In
            </Button>
          </Link>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Didn't receive the email?{" "}
            <button className="text-purple-heart hover:text-purple-heart/80 font-medium transition-colors">
              Resend verification
            </button>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}