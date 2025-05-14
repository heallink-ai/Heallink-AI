"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/app/theme/ThemeProvider";

export default function QuickActions() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const actionItems = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-blue-500"
        >
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
          <line x1="16" x2="16" y1="2" y2="6" />
          <line x1="8" x2="8" y1="2" y2="6" />
          <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
      ),
      label: "Book Appointment",
      description: "Schedule a visit with your doctor",
      href: "/appointments/book",
      color: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-green-500"
        >
          <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
          <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
        </svg>
      ),
      label: "Message Doctor",
      description: "Contact your healthcare provider",
      href: "/messages/new",
      color: "bg-green-50 dark:bg-green-900/20",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-amber-500"
        >
          <path d="m19 14-5-5-9 9" />
          <path d="m19 14-5-5-9 9" />
          <path d="M18 11h-6a2 2 0 0 1-2-2V3" />
        </svg>
      ),
      label: "Log Vitals",
      description: "Update your health measurements",
      href: "/health/log",
      color: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-purple-500"
        >
          <path d="m9 12 2 2 4-4" />
          <path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z" />
          <path d="M22 19H2" />
        </svg>
      ),
      label: "Medication Reminder",
      description: "View and manage your prescriptions",
      href: "/medications",
      color: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-red-500"
        >
          <path d="M16 18a4 4 0 0 1-8 0" />
          <path d="M12 2a8 8 0 0 0-8 8 4.5 4.5 0 0 0 4.5 4.5h7a4.5 4.5 0 0 0 4.5-4.5 8 8 0 0 0-8-8z" />
          <path d="M12 6v4" />
          <path d="M12 12h.01" />
        </svg>
      ),
      label: "Emergency Info",
      description: "Access important health information",
      href: "/emergency",
      color: "bg-red-50 dark:bg-red-900/20",
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 hover:bg-primary/10 active:scale-95 ${
          isOpen
            ? "border-primary bg-primary/10"
            : theme === "dark"
              ? "border-gray-700"
              : "border-gray-200"
        }`}
        aria-label="Quick actions"
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
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
            className={isOpen ? "text-primary" : "text-foreground"}
          >
            <line x1="12" x2="12" y1="5" y2="19" />
            <line x1="5" x2="19" y1="12" y2="12" />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute right-0 mt-2 w-72 rounded-xl overflow-hidden shadow-xl border z-50 ${
              theme === "dark"
                ? "bg-card border-gray-800"
                : "bg-white border-gray-200"
            }`}
          >
            {/* Header Section */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="font-semibold text-foreground">Quick Actions</h3>
              <p className="text-xs text-foreground/60 mt-1">
                Access common tasks and actions
              </p>
            </div>

            {/* Actions Grid */}
            <div className="p-3">
              <div className="grid grid-cols-1 gap-2">
                {actionItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="flex items-center p-3 rounded-lg hover:bg-primary/5 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <div
                      className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center mr-3 flex-shrink-0`}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {item.label}
                      </p>
                      <span className="text-xs text-foreground/60">
                        {item.description}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
