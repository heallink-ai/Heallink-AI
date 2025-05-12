"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Button from "../components/ui/Button";

// Component that uses useSearchParams
function AuthRequiredContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(
            "/auth/signin?callbackUrl=" + encodeURIComponent(callbackUrl)
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, callbackUrl]);

  return (
    <div className="max-w-md w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black rounded-2xl neumorph-flat p-8">
      <div className="w-20 h-20 mx-auto rounded-xl bg-gradient-to-br from-purple-heart to-royal-blue neumorph-flat text-white flex items-center justify-center mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-10 h-10"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
          />
        </svg>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-center mb-4 high-contrast-text">
        Authentication Required
      </h1>

      <p className="text-center mb-6 light-text-muted">
        You need to be signed in to access this page. You will be redirected to
        the login page in {countdown} seconds.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          href={`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          className="w-full"
        >
          Sign In
        </Button>
        <Button
          href={`/auth/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          variant="outline"
          className="w-full"
        >
          Create Account
        </Button>
      </div>

      <div className="mt-6 text-center">
        <Button href="/" variant="ghost" className="text-sm">
          Return to Home
        </Button>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function AuthRequiredPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Suspense
        fallback={
          <div className="text-center p-8">
            Loading authentication screen...
          </div>
        }
      >
        <AuthRequiredContent />
      </Suspense>
    </div>
  );
}
