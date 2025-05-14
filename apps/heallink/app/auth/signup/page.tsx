"use client";

import { Suspense } from "react";
import SignupContainer from "@/app/features/auth/signup/containers/SignupContainer";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Suspense
        fallback={<div className="text-center p-4">Loading signup form...</div>}
      >
        <SignupContainer />
      </Suspense>
    </div>
  );
}
