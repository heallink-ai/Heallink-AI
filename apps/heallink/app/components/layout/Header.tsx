// src/components/layout/Header.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "../ui/Button";
import { useTheme } from "@/app/theme/ThemeProvider";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme } = useTheme();

  // Detect scroll position to add shadow and background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: "Home", href: "#" },
    { name: "For Patients", href: "#for-patients" },
    { name: "For Providers", href: "#for-providers" },
    { name: "Features", href: "#features" },
    { name: "FAQ", href: "#faq" },
  ];

  // Special background style for buttons before scrolling in light mode
  const headerBtnStyle =
    theme === "light" && !scrolled
      ? "header-phone-button backdrop-blur-sm"
      : "";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 dark:bg-black/90 backdrop-blur-sm shadow-md"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-10">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-xl mr-2 bg-gradient-to-br from-purple-heart to-royal-blue flex items-center justify-center neumorph-flat">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <span className="text-2xl font-bold gradient-text">HealLink</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[color:var(--nav-text)] hover:text-[color:var(--nav-text-hover)] transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              href="/auth/signin"
              variant="outline"
              size="sm"
              className={headerBtnStyle}
            >
              Sign In
            </Button>
            <Button
              href="/auth/signup"
              size="sm"
              className={
                theme === "light" && !scrolled
                  ? "bg-purple-heart text-white"
                  : ""
              }
            >
              Create Account
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden neumorph-flat rounded-xl p-2 text-[color:var(--nav-text)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
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
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu - Completely separate from the header */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 animate-fadeIn"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
            style={{ top: 0 }}
          />

          {/* Menu Panel */}
          <div
            className="fixed inset-x-0 top-0 z-50 animate-fadeIn"
            style={{
              top: "72px",
              bottom: 0,
              background: theme === "dark" ? "#121212" : "#ffffff",
            }}
          >
            <div
              className="p-6 pt-8 h-full overflow-y-auto"
              style={{ background: theme === "dark" ? "#121212" : "#ffffff" }}
            >
              <nav className="flex flex-col gap-4 mb-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-lg text-[color:var(--nav-text)] hover:text-[color:var(--nav-text-hover)] py-3 px-4 rounded-lg neumorph-flat font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              <div className="flex flex-col gap-4">
                <Button
                  href="/auth/signin"
                  variant="outline"
                  className="w-full justify-center py-3 text-base"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Button>
                <Button
                  href="/auth/signup"
                  className="w-full justify-center py-3 text-base bg-purple-heart text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
