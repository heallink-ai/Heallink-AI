"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignOutPage() {
  const router = useRouter();

  useEffect(() => {
    // Sign out and redirect to home page
    const handleSignOut = async () => {
      await signOut({ redirect: false });
      router.push("/");
    };

    handleSignOut();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-4">Signing out...</div>
    </div>
  );
}
