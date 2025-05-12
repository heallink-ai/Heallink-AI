"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

// Component that uses useSearchParams
function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errors = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have access to this resource.",
    Verification: "The token has expired or has already been used.",
    OAuthSignin: "Error in the OAuth sign-in process.",
    OAuthCallback: "Error in the OAuth callback process.",
    OAuthCreateAccount: "Could not create OAuth provider user in the database.",
    EmailCreateAccount: "Could not create email provider user in the database.",
    Callback: "Error in the OAuth callback handler.",
    OAuthAccountNotLinked: "Email already exists with a different provider.",
    EmailSignin: "Error sending the email.",
    CredentialsSignin: "The credentials you provided were invalid.",
    SessionRequired: "You must be signed in to access this page.",
    Default: "An unexpected error occurred.",
  };

  const errorMessage =
    error && (errors[error as keyof typeof errors] || errors.Default);

  return (
    <div className="text-center">
      <svg
        className="mx-auto h-12 w-12 text-red-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <h1 className="mt-4 text-3xl font-bold">Authentication Error</h1>
      <p className="mt-2 text-gray-600">{errorMessage}</p>
      <div className="mt-6">
        <Link
          href="/auth/signin"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <Suspense
          fallback={<div className="text-center">Loading error details...</div>}
        >
          <ErrorContent />
        </Suspense>
      </div>
    </div>
  );
}
