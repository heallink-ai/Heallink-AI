"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "./theme/ThemeProvider";
import LoginForm from "./components/auth/LoginForm";
import LogoSection from "./components/auth/LogoSection";

export default function Home() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[color:var(--background)]">
      {/* Left panel (decorative) */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[color:var(--primary)]/5 to-[color:var(--secondary)]/5 p-8 relative overflow-hidden">
        {/* Decorative blur elements */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[color:var(--primary)]/20 rounded-full filter blur-3xl opacity-50 animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[color:var(--secondary)]/20 rounded-full filter blur-3xl opacity-60 animate-pulse-slow"></div>

        <div className="relative z-10 flex flex-col justify-between w-full h-full">
          {/* Logo and branding */}
          <LogoSection />

          {/* Illustration */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative max-w-md w-full aspect-square">
              <Image
                src={
                  theme === "dark"
                    ? "/admin-illustration-dark.svg"
                    : "/admin-illustration-light.svg"
                }
                alt="Admin Dashboard"
                width={500}
                height={500}
                className="w-full h-auto"
                // Fallback to default Next.js logo if custom illustration is not available
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/next.svg";
                  target.className = "w-full h-auto dark:invert";
                }}
              />
            </div>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card-admin p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-[color:var(--primary)]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="font-medium">User Management</h3>
              </div>
              <p className="text-sm text-[color:var(--muted-foreground)]">
                Manage patients, providers and staff with ease
              </p>
            </div>

            <div className="card-admin p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-[color:var(--primary)]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                  />
                </svg>
                <h3 className="font-medium">Analytics</h3>
              </div>
              <p className="text-sm text-[color:var(--muted-foreground)]">
                Track platform performance and user metrics
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel (login form) */}
      <div className="w-full md:w-1/2 flex flex-col p-6 md:p-10 lg:p-16">
        <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
          {/* Mobile only logo */}
          <div className="flex md:hidden justify-center mb-10">
            <LogoSection />
          </div>

          <div className="my-auto">
            <div className="mb-10">
              <h1 className="text-3xl font-bold mb-3 text-[color:var(--foreground)]">
                Welcome Back
              </h1>
              <p className="text-[color:var(--muted-foreground)]">
                Sign in to your admin account to manage the Heallink healthcare
                platform
              </p>
            </div>

            <LoginForm />
          </div>

          <div className="mt-10 pt-6 border-t border-[color:var(--border)] text-xs text-center text-[color:var(--muted-foreground)]">
            <p>
              &copy; {new Date().getFullYear()} Heallink Healthcare. All rights
              reserved.
            </p>
            <div className="flex justify-center gap-4 mt-2">
              <a
                href="#"
                className="hover:text-[color:var(--foreground)] transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="hover:text-[color:var(--foreground)] transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
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
