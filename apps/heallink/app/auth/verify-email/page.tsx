"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// Get the correct API URL based on whether we're on server or client
const API_URL =
  typeof window === "undefined"
    ? process.env.API_URL || "http://api:3003/api/v1" // Server-side (in Docker network)
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003/api/v1"; // Client-side (browser)

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function verifyEmail() {
      if (!token) {
        setStatus("error");
        setMessage(
          "No verification token provided. Please check your email link and try again."
        );
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/auth/verify-email?token=${token}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(
            data.message || "Your email has been successfully verified!"
          );
        } else {
          setStatus("error");
          setMessage(
            data.message ||
              "Failed to verify your email. The link may be invalid or expired."
          );
        }
      } catch (error) {
        console.error("Error verifying email:", error);
        setStatus("error");
        setMessage("An unexpected error occurred. Please try again later.");
      }
    }

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full p-8 neumorph-flat bg-white dark:bg-gray-800 rounded-2xl">
        <div className="text-center">
          {status === "loading" && (
            <>
              <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-purple-heart border-r-transparent mb-6"></div>
              <h1 className="text-2xl font-bold high-contrast-text mb-4">
                Verifying your email...
              </h1>
              <p className="light-text-muted">
                Please wait while we verify your email address.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-heart to-royal-blue text-white mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold high-contrast-text mb-4">
                Email Verified!
              </h1>
              <p className="light-text-muted mb-6">{message}</p>
              <div className="flex flex-col gap-4">
                <Link
                  href="/dashboard"
                  className="block w-full py-3 px-4 text-center bg-gradient-to-r from-purple-heart to-royal-blue text-white rounded-xl font-medium neumorph-flat hover:opacity-90 transition-all"
                >
                  Go to Dashboard
                </Link>
                <Link
                  href="/auth/signin"
                  className="block w-full py-3 px-4 text-center border-2 border-purple-heart light-text-contrast rounded-xl font-medium neumorph-flat hover:opacity-90 transition-all"
                >
                  Sign In
                </Link>
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-red-500 text-white mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold high-contrast-text mb-4">
                Verification Failed
              </h1>
              <p className="light-text-muted mb-6">{message}</p>
              <div className="flex flex-col gap-4">
                <Link
                  href="/auth/signin"
                  className="block w-full py-3 px-4 text-center bg-gradient-to-r from-purple-heart to-royal-blue text-white rounded-xl font-medium neumorph-flat hover:opacity-90 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/"
                  className="block w-full py-3 px-4 text-center border-2 border-purple-heart light-text-contrast rounded-xl font-medium neumorph-flat hover:opacity-90 transition-all"
                >
                  Go to Homepage
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
