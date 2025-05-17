"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-red-500/10 flex items-center justify-center mb-6">
          <span className="text-4xl text-red-500">!</span>
        </div>

        <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>

        <p className="text-muted-foreground mb-8">
          We&apos;re sorry, but an error occurred while trying to display this
          page.
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center py-2 px-4 rounded-lg border border-border hover:bg-muted/20 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
