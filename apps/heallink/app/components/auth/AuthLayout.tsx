"use client";

import { useTheme } from "@/app/theme/ThemeProvider";
import ScrollReveal from "@/app/components/animations/ScrollReveal";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({
  children,
  title,
  subtitle,
}: AuthLayoutProps) {
  // We need the ThemeProvider's context but don't explicitly use theme here
  useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Determine if we're on signup page
  const isSignUp = pathname.includes("/signup");

  // Select the appropriate illustration
  const illustrationPath = isSignUp
    ? "/illustrations/signup-illustration.svg"
    : "/illustrations/signin-illustration.svg";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Left side with illustration */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-purple-heart/5 to-royal-blue/5 p-8 items-center justify-center relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-heart/20 rounded-full filter blur-3xl opacity-50 animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-royal-blue/20 rounded-full filter blur-3xl opacity-60 animate-pulse-slow"></div>

        <div className="relative z-10 w-full max-w-md">
          <ScrollReveal direction="up" delay={200}>
            <div className="mb-8">
              <Link href="/" className="inline-flex">
                <span className="sr-only">Heallink</span>
                <h1 className="text-4xl font-bold gradient-text">Heallink</h1>
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={300}>
            <div className="mb-8">
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black rounded-2xl p-6 neumorph-flat">
                <div className="neumorph-flat bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-gray-800/50 dark:to-black/50 rounded-xl p-5">
                  <Image
                    src={illustrationPath}
                    alt={isSignUp ? "Create Account" : "Sign In"}
                    width={400}
                    height={300}
                    className="w-full h-auto"
                  />
                </div>

                {/* Floating elements */}
                <div className="absolute -right-4 top-1/4 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-heart to-royal-blue neumorph-flat text-white flex items-center justify-center transform rotate-12 animate-float">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                    />
                  </svg>
                </div>

                <div
                  className="absolute -left-6 bottom-16 w-10 h-10 rounded-xl bg-gradient-to-br from-royal-blue to-havelock-blue neumorph-flat text-white flex items-center justify-center transform -rotate-12 animate-float"
                  style={{ animationDelay: "2s" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={400}>
            <div className="section-description text-center">
              {isSignUp
                ? "Join the intelligent healthcare platform connecting you with the right care, instantly."
                : "The intelligent healthcare platform connecting patients with the right care, instantly."}
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Right side with form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-10 lg:p-16">
        <div className="w-full max-w-md">
          {/* Mobile logo - only visible on small screens */}
          <div className="flex justify-center mb-8 md:hidden">
            <Link href="/" className="inline-flex">
              <span className="sr-only">Heallink</span>
              <h1 className="text-3xl font-bold gradient-text">Heallink</h1>
            </Link>
          </div>

          <ScrollReveal direction="up" delay={100}>
            <h2 className="text-3xl md:text-4xl font-bold mb-3 high-contrast-text">
              {title}
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200}>
            <p className="light-text-muted mb-8">{subtitle}</p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={300}>
            {children}
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
