"use client";

import Link from "next/link";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="w-full max-w-md mx-auto p-6">
      {/* Logo */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-block">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl neumorph-flat bg-gradient-to-br from-purple-heart to-royal-blue flex items-center justify-center">
            <span className="text-2xl font-bold text-white">H</span>
          </div>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600 text-sm">{subtitle}</p>
      </div>

      {/* Auth Form */}
      <div className="neumorph-flat rounded-2xl p-6">
        {children}
      </div>

      {/* Footer */}
      <div className="text-center mt-6 text-sm text-gray-500">
        <p>
          By continuing, you agree to our{" "}
          <Link href="/legal/terms" className="text-purple-heart hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/legal/privacy" className="text-purple-heart hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}