"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignOut() {
  const router = useRouter();

  useEffect(() => {
    const performSignOut = async () => {
      try {
        await signOut({ callbackUrl: "/" });
      } catch (error) {
        console.error("Error signing out:", error);
        // Redirect to home as fallback
        router.push("/");
      }
    };

    performSignOut();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[color:var(--background)]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[color:var(--primary)] mx-auto mb-4"></div>
        <h1 className="text-xl font-medium text-[color:var(--foreground)]">
          Signing out...
        </h1>
      </div>
    </div>
  );
}
