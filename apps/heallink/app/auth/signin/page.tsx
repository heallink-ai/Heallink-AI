"use client";

import * as React from "react";
import SigninContainer from "@/app/features/auth/signin/containers/SigninContainer";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <React.Suspense
        fallback={
          <div className="text-center p-4">Loading sign-in options...</div>
        }
      >
        <SigninContainer />
      </React.Suspense>
    </div>
  );
}
