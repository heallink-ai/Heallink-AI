"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if provider is logged in
    const provider = localStorage.getItem('provider');
    if (provider) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-heart/5 to-royal-blue/5 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl neumorph-flat bg-gradient-to-br from-purple-heart to-royal-blue flex items-center justify-center">
            <span className="text-3xl font-bold text-white">H</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Heallink Providers</h1>
          <p className="text-gray-600">Healthcare provider dashboard and patient management</p>
        </div>

        <div className="neumorph-flat rounded-2xl p-6 space-y-4">
          <Link
            href="/auth/signin"
            className="block w-full py-3 px-6 rounded-xl neumorph-button bg-gradient-to-r from-purple-heart to-royal-blue text-white text-center font-medium hover:shadow-lg transition-all duration-200"
          >
            Sign In
          </Link>
          
          <Link
            href="/auth/signup"
            className="block w-full py-3 px-6 rounded-xl neumorph-flat text-gray-700 text-center font-medium hover:bg-gray-50 transition-all duration-200"
          >
            Create Provider Account
          </Link>
        </div>

        <div className="mt-6 p-4 rounded-xl neumorph-flat bg-blue-500/5 text-blue-600 text-sm">
          <p className="font-medium mb-2">Demo Access:</p>
          <p>Email: dr.smith@example.com</p>
          <p>Password: password123</p>
        </div>
      </div>
    </div>
  );
}
