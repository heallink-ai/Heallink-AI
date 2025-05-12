// src/components/layout/Footer.tsx
"use client";

import Link from "next/link";
import { useTheme } from "@/app/theme/ThemeProvider";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { theme } = useTheme();

  const socialLinks = [
    {
      name: "Facebook",
      href: "https://facebook.com/heallinkapp",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
        </svg>
      ),
      hoverColor: "hover:text-blue-600",
    },
    {
      name: "X (Twitter)",
      href: "https://x.com/heallinkapp",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
        </svg>
      ),
      hoverColor: "hover:text-sky-500",
    },
    {
      name: "Instagram",
      href: "https://instagram.com/heallinkapp",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      ),
      hoverColor: "hover:text-pink-500",
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/company/heallink",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
          <rect x="2" y="9" width="4" height="12"></rect>
          <circle cx="4" cy="4" r="2"></circle>
        </svg>
      ),
      hoverColor: "hover:text-blue-700",
    },
    {
      name: "GitHub",
      href: "https://github.com/heallink",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
        </svg>
      ),
      hoverColor: "hover:text-gray-800 dark:hover:text-gray-300",
    },
  ];

  const contactInfo = {
    phone: "+353 874831977",
    email: "hello@heallink.io",
    location: "Accra, Ghana",
  };

  return (
    <footer
      className={`bg-background border-t border-primary/10 py-8 md:py-12 mt-16 md:mt-24 pb-28 md:pb-8 ${theme === "dark" ? "dark-footer" : "light-footer"}`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.7 }}
                className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-heart to-royal-blue flex items-center justify-center"
              >
                <span className="text-white font-bold text-sm">H</span>
              </motion.div>
              <span className="text-xl font-bold gradient-text">HealLink</span>
            </div>
            <p className="text-sm text-foreground/70 mb-4 max-w-xs">
              HealLink connects you with the right healthcare providers through
              our AI-driven health routing platform. No more waiting, no more
              confusion — just immediate, intelligent care.
            </p>
            <div className="flex gap-3 mb-5">
              {socialLinks.map((link) => (
                <motion.div
                  key={link.name}
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Link
                    href={link.href}
                    className={`flex items-center justify-center w-8 h-8 rounded-full bg-primary/5 text-foreground/70 ${link.hoverColor} transition-colors`}
                    aria-label={link.name}
                  >
                    {link.icon}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm text-foreground/70">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="mr-2 text-primary"
                  strokeWidth="2"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                {contactInfo.phone}
              </div>
              <div className="flex items-center text-sm text-foreground/70">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="mr-2 text-primary"
                  strokeWidth="2"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                {contactInfo.email}
              </div>
              <div className="flex items-center text-sm text-foreground/70">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="mr-2 text-primary"
                  strokeWidth="2"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                {contactInfo.location}
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4 gradient-text">For Patients</h3>
            <ul className="space-y-2 text-sm">
              <motion.li
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  href="#"
                  className="text-foreground/70 hover:text-primary transition-colors"
                >
                  Find a Doctor
                </Link>
              </motion.li>
              <motion.li
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  href="#"
                  className="text-foreground/70 hover:text-primary transition-colors"
                >
                  Virtual Visits
                </Link>
              </motion.li>
              <motion.li
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  href="#"
                  className="text-foreground/70 hover:text-primary transition-colors"
                >
                  Health Records
                </Link>
              </motion.li>
              <motion.li
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  href="#"
                  className="text-foreground/70 hover:text-primary transition-colors"
                >
                  Insurance
                </Link>
              </motion.li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4 gradient-text">For Providers</h3>
            <ul className="space-y-2 text-sm">
              <motion.li
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  href="#"
                  className="text-foreground/70 hover:text-primary transition-colors"
                >
                  Join Network
                </Link>
              </motion.li>
              <motion.li
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  href="#"
                  className="text-foreground/70 hover:text-primary transition-colors"
                >
                  Provider Portal
                </Link>
              </motion.li>
              <motion.li
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  href="#"
                  className="text-foreground/70 hover:text-primary transition-colors"
                >
                  Resources
                </Link>
              </motion.li>
              <motion.li
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  href="#"
                  className="text-foreground/70 hover:text-primary transition-colors"
                >
                  Training
                </Link>
              </motion.li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4 gradient-text">Company</h3>
            <ul className="space-y-2 text-sm">
              <motion.li
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  href="#"
                  className="text-foreground/70 hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </motion.li>
              <motion.li
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  href="#"
                  className="text-foreground/70 hover:text-primary transition-colors"
                >
                  Careers
                </Link>
              </motion.li>
              <motion.li
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  href="#"
                  className="text-foreground/70 hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </motion.li>
              <motion.li
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  href="#"
                  className="text-foreground/70 hover:text-primary transition-colors"
                >
                  Blog
                </Link>
              </motion.li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-foreground/60">
            © {currentYear} HealLink. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <motion.div whileHover={{ y: -2 }}>
              <Link
                href="/legal/privacy"
                className="text-sm text-foreground/60 hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }}>
              <Link
                href="/legal/terms"
                className="text-sm text-foreground/60 hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }}>
              <Link
                href="/legal/cookies"
                className="text-sm text-foreground/60 hover:text-primary transition-colors"
              >
                Cookie Policy
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}
