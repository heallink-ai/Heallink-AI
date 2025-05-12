"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function AuthRequired() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [callbackUrl, setCallbackUrl] = useState("/dashboard");

  useEffect(() => {
    // Get the URL that the user was trying to access
    const callback = searchParams.get("callbackUrl");
    if (callback) {
      setCallbackUrl(callback);
    }
  }, [searchParams]);

  const handleLogin = () => {
    router.push(`/?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[color:var(--background)] p-4">
      <div className="card-admin p-8 max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 bg-[color:var(--warning)]/10 rounded-full flex items-center justify-center text-[color:var(--warning)]">
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
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-xl font-semibold text-center mb-3 text-[color:var(--foreground)]">
          Authentication Required
        </h1>

        <p className="text-center mb-6 text-[color:var(--muted-foreground)]">
          You need to be signed in to access this page. Please sign in to
          continue.
        </p>

        <div className="flex justify-center">
          <button
            onClick={handleLogin}
            className="px-4 py-2 rounded-md bg-[color:var(--primary)] text-white hover:bg-[color:var(--primary)]/90 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
