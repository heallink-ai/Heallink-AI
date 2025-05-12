"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>(
    "Authentication error"
  );

  useEffect(() => {
    // Get error details from URL
    const error = searchParams.get("error");

    // Map error codes to user-friendly messages
    if (error === "AccessDenied") {
      setErrorMessage(
        "Access denied. You don't have permission to access this area."
      );
    } else if (error === "Configuration") {
      setErrorMessage(
        "There is a problem with the authentication configuration."
      );
    } else if (error === "Verification") {
      setErrorMessage(
        "The verification link has expired or has already been used."
      );
    } else if (error) {
      setErrorMessage(`Authentication error: ${error}`);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[color:var(--background)] p-4">
      <div className="card-admin p-8 max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 bg-[color:var(--error)]/10 rounded-full flex items-center justify-center text-[color:var(--error)]">
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
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-xl font-semibold text-center mb-3 text-[color:var(--foreground)]">
          Authentication Error
        </h1>

        <p className="text-center mb-6 text-[color:var(--muted-foreground)]">
          {errorMessage}
        </p>

        <div className="flex justify-center">
          <Link
            href="/"
            className="px-4 py-2 rounded-md bg-[color:var(--primary)] text-white hover:bg-[color:var(--primary)]/90 transition-colors"
          >
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
