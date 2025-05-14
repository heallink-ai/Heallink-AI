"use client";

import { Suspense } from "react";
import SigninContainer from "@/app/features/auth/signin/containers/SigninContainer";

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center p-4">Loading sign-in options...</div>
      }
    >
      <SigninContainer />
    </Suspense>
  );
}
