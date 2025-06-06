"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LogoSection from "../components/auth/LogoSection";
import SignupForm from "../components/auth/SignupForm";

export default function SignupPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration errors
  useEffect(() => {
    setMounted(true);
    
    // Check if provider is logged in
    const provider = localStorage.getItem('provider');
    if (provider) {
      router.push('/dashboard');
    }
  }, [router]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[color:var(--background)]">
      {/* Left panel (decorative) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-heart/5 to-royal-blue/5 p-8 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-heart/20 rounded-full filter blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-royal-blue/20 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-biloba-flower/30 rounded-full filter blur-2xl opacity-40 animate-pulse"></div>

        <div className="relative z-10 flex flex-col justify-between w-full h-full">
          {/* Logo and branding */}
          <LogoSection />

          {/* Main illustration area */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="max-w-lg w-full text-center mb-8">
              <h2 className="text-4xl font-bold text-[color:var(--foreground)] mb-4">
                Join the Future of
                <span className="gradient-text block">Healthcare Delivery</span>
              </h2>
              <p className="text-lg text-[color:var(--muted-foreground)] leading-relaxed">
                Transform your practice with cutting-edge tools, seamless patient management, and intelligent insights.
              </p>
            </div>

            {/* Feature illustration */}
            <div className="relative w-80 h-80 neumorph-card rounded-3xl p-8 mb-8">
              <div className="w-full h-full flex items-center justify-center">
                <svg
                  className="w-32 h-32 text-purple-heart opacity-80"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 6v12m6-6H6"
                  />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-heart rounded-full animate-pulse"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-royal-blue rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Provider benefits */}
          <div className="grid grid-cols-3 gap-3">
            <div className="neumorph-card p-3 rounded-xl text-center">
              <div className="flex justify-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-purple-heart"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h16.5c1.035 0 1.875-.84 1.875-1.875v-9.75c0-1.036-.84-1.875-1.875-1.875H3.75c-1.036 0-1.875.84-1.875 1.875v9.75c0 1.035.84 1.875 1.875 1.875z"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-xs text-[color:var(--foreground)]">Secure</h3>
              <p className="text-xs text-[color:var(--muted-foreground)] mt-1">HIPAA Compliant</p>
            </div>

            <div className="neumorph-card p-3 rounded-xl text-center">
              <div className="flex justify-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-royal-blue"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-xs text-[color:var(--foreground)]">Fast</h3>
              <p className="text-xs text-[color:var(--muted-foreground)] mt-1">AI-Powered</p>
            </div>

            <div className="neumorph-card p-3 rounded-xl text-center">
              <div className="flex justify-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-havelock-blue"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-xs text-[color:var(--foreground)]">Simple</h3>
              <p className="text-xs text-[color:var(--muted-foreground)] mt-1">Easy Setup</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel (signup form) */}
      <div className="w-full lg:w-1/2 flex flex-col p-6 md:p-10 lg:p-16">
        <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
          {/* Mobile only logo */}
          <div className="flex lg:hidden justify-center mb-8">
            <LogoSection />
          </div>

          <div className="my-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-3 text-[color:var(--foreground)]">
                Create Your Provider Account
              </h1>
              <p className="text-[color:var(--muted-foreground)]">
                Join thousands of healthcare providers using Heallink to deliver exceptional patient care
              </p>
            </div>

            <SignupForm />
          </div>

          <div className="mt-8 pt-6 border-t border-[color:var(--border)] text-xs text-center text-[color:var(--muted-foreground)]">
            <p>
              &copy; {new Date().getFullYear()} Heallink Healthcare. All rights reserved.
            </p>
            <div className="flex justify-center gap-4 mt-2">
              <a
                href="/legal/privacy"
                className="hover:text-[color:var(--foreground)] transition-colors"
              >
                Privacy
              </a>
              <a
                href="/legal/terms"
                className="hover:text-[color:var(--foreground)] transition-colors"
              >
                Terms
              </a>
              <a
                href="/contact"
                className="hover:text-[color:var(--foreground)] transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}