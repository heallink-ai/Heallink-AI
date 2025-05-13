// src/components/layout/Footer.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import AppStoreButtonCompact from "../ui/AppStoreButtonCompact";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Footer navigation sections
  const footerSections = [
    {
      title: "Platform",
      links: [
        { name: "For Patients", href: "#for-patients" },
        { name: "For Providers", href: "#for-providers" },
        { name: "Features", href: "#features" },
        { name: "How It Works", href: "#how-it-works" },
        { name: "Pricing", href: "#pricing" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#about" },
        { name: "Team", href: "#team" },
        { name: "Careers", href: "#careers" },
        { name: "Blog", href: "#blog" },
        { name: "Press", href: "#press" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Help Center", href: "#help" },
        { name: "Community", href: "#community" },
        { name: "Developer API", href: "#api" },
        { name: "Partners", href: "#partners" },
        { name: "Status", href: "#status" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Terms of Service", href: "#terms" },
        { name: "Privacy Policy", href: "#privacy" },
        { name: "Cookie Policy", href: "#cookie" },
        { name: "GDPR", href: "#gdpr" },
        { name: "HIPAA Compliance", href: "#hipaa" },
      ],
    },
  ];

  // Social media links
  const socialLinks = [
    {
      name: "Twitter",
      href: "https://twitter.com/heallink",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      href: "https://facebook.com/heallink",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/company/heallink",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://instagram.com/heallink",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      name: "GitHub",
      href: "https://github.com/heallink",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* Top gradient line */}
      <div className="h-[2px] bg-gradient-to-r from-purple-heart/20 via-purple-heart to-royal-blue/20"></div>

      {/* Main footer */}
      <div className="bg-gray-50 dark:bg-gray-900">
        {/* Top wave decoration */}
        <div className="absolute inset-x-0 top-0 h-16 w-full overflow-hidden -translate-y-1/2 text-gray-50 dark:text-gray-900 z-10 pointer-events-none">
          <svg
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
            viewBox="0 0 1200 120"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
          >
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>

        <div className="container mx-auto px-6 pt-16 pb-12">
          {/* Top section with brand and newsletter */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-16">
            {/* Brand section */}
            <div className="lg:col-span-2">
              <motion.div
                className="flex items-center mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-10 h-10 rounded-xl mr-3 bg-gradient-to-br from-purple-heart to-royal-blue flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">H</span>
                </div>
                <span className="text-2xl font-bold gradient-text">
                  HealLink
                </span>
              </motion.div>

              <motion.p
                className="text-gray-600 dark:text-gray-400 text-sm mb-6 max-w-md"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                AI-powered healthcare routing platform connecting patients with
                the right providers instantly. Experience a new standard in
                healthcare accessibility.
              </motion.p>

              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <AppStoreButtonCompact className="max-w-[220px]" />
              </motion.div>

              <motion.div
                className="flex space-x-3 mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                {socialLinks.map((link, i) => (
                  <motion.a
                    key={i}
                    href={link.href}
                    className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:border-purple-heart dark:hover:border-purple-heart hover:text-purple-heart dark:hover:text-purple-heart transition-colors duration-200 shadow-sm"
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                    aria-label={link.name}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.icon}
                  </motion.a>
                ))}
              </motion.div>
            </div>

            {/* Newsletter section */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {footerSections.map((section, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                  >
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 ">
                      {section.title}
                    </h3>
                    <ul className="space-y-2 text-sm">
                      {section.links.map((link, j) => (
                        <motion.li
                          key={j}
                          whileHover={{ x: 2 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        >
                          <Link
                            href={link.href}
                            className="text-gray-500 hover:text-purple-heart dark:text-gray-400 dark:hover:text-purple-heart transition-colors duration-200"
                          >
                            {link.name}
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact information */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 border-t border-gray-200 dark:border-gray-800 text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <a
              href="tel:+353874831977"
              className="flex items-center text-gray-500 dark:text-gray-400 hover:text-purple-heart dark:hover:text-purple-heart transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 mr-2"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              +353 874831977
            </a>
            <a
              href="mailto:hello@heallink.io"
              className="flex items-center text-gray-500 dark:text-gray-400 hover:text-purple-heart dark:hover:text-purple-heart transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 mr-2"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              hello@heallink.io
            </a>
            <a
              href="https://maps.google.com/?q=Accra,Ghana"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-500 dark:text-gray-400 hover:text-purple-heart dark:hover:text-purple-heart transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 mr-2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Accra, Ghana
            </a>
          </motion.div>

          {/* Bottom section */}
          <motion.div
            className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <p className="text-gray-500 dark:text-gray-400">
              © {currentYear} HealLink. All rights reserved.
            </p>
            <div className="mt-4 sm:mt-0 flex space-x-6">
              <Link
                href="#"
                className="text-gray-500 dark:text-gray-400 hover:text-purple-heart dark:hover:text-purple-heart transition-colors duration-200"
              >
                Terms
              </Link>
              <Link
                href="#"
                className="text-gray-500 dark:text-gray-400 hover:text-purple-heart dark:hover:text-purple-heart transition-colors duration-200"
              >
                Privacy
              </Link>
              <Link
                href="#"
                className="text-gray-500 dark:text-gray-400 hover:text-purple-heart dark:hover:text-purple-heart transition-colors duration-200"
              >
                Cookies
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
