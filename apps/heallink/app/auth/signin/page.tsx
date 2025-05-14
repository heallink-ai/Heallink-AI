"use client";

import { Suspense } from "react";
import SigninContainer from "@/app/features/auth/signin/containers/SigninContainer";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Suspense
        fallback={
          <div className="text-center p-4">Loading sign-in options...</div>
        }
      >
        <SigninContainer />
      </Suspense>
    </div>
  );
}
