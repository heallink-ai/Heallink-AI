"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  let errorMessage = "An error occurred during authentication";
  let errorDescription =
    "Please try again or contact support if the problem persists.";

  // Handle specific error types
  switch (error) {
    case "AccessDenied":
      errorMessage = "Access Denied";
      errorDescription = "You do not have permission to access this resource.";
      break;
    case "CredentialsSignin":
      errorMessage = "Invalid Credentials";
      errorDescription = "The email or password you entered is incorrect.";
      break;
    case "OAuthSignin":
    case "OAuthCallback":
    case "OAuthCreateAccount":
    case "OAuthAccountNotLinked":
      errorMessage = "Social Login Error";
      errorDescription =
        "There was a problem with your social login. Please try again or use email/password.";
      break;
    case "SessionRequired":
      errorMessage = "Authentication Required";
      errorDescription = "You need to be signed in to access this page.";
      break;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            {errorMessage}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {errorDescription}
          </p>
          <div className="flex flex-col space-y-3">
            <Link
              href="/signin"
              className="px-4 py-2 bg-gradient-to-r from-purple-heart to-royal-blue text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Back to Sign In
            </Link>
            <Link
              href="/"
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
