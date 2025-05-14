"use client";

import Link from "next/link";

interface VerificationNoticeProps {
  email: string;
}

export default function VerificationNotice({ email }: VerificationNoticeProps) {
  return (
    <div className="neumorph-flat bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full">
      <div className="text-center">
        <div className="bg-gradient-to-r from-purple-heart/10 to-royal-blue/10 neumorph-flat rounded-full p-4 inline-flex mx-auto mb-6">
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

        <h2 className="text-2xl font-bold high-contrast-text mb-4">
          Check Your Email
        </h2>

        <p className="light-text-muted mb-2">
          We've sent a verification link to:
        </p>
        <p className="font-medium text-purple-heart mb-6">{email}</p>

        <p className="light-text-muted mb-6">
          Please check your inbox and click the verification link to activate
          your account. If you don't see the email, please check your spam
          folder.
        </p>

        <div className="mb-8 p-4 rounded-xl neumorph-pressed bg-gradient-to-r from-purple-heart/5 to-royal-blue/5">
          <h3 className="font-medium high-contrast-text mb-2">What's next?</h3>
          <p className="text-sm light-text-muted">
            After verifying your email, you can log in to access all features of
            Heallink. Verification helps us ensure the security of your account.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Link
            href="/auth/signin"
            className="py-3 px-6 rounded-xl neumorph-flat bg-gradient-to-r from-purple-heart to-royal-blue text-white font-medium"
          >
            Go to Sign In
          </Link>
          <Link
            href="/"
            className="py-3 px-6 rounded-xl neumorph-flat border-2 border-purple-heart light-text-contrast font-medium"
          >
            Back to Home
          </Link>
        </div>

        <p className="mt-8 text-sm light-text-muted">
          Didn't receive the email?{" "}
          <button className="text-purple-heart hover:underline">
            Resend verification email
          </button>
        </p>
      </div>
    </div>
  );
}
