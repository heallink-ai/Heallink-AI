"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/app/theme/ThemeProvider";

// Types
interface Notification {
  id: number;
  type: "appointment" | "message" | "payment";
  message: string;
  time: string;
}

interface NotificationBellProps {
  notifications: Notification[];
}

export default function NotificationBell({
  notifications,
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const unreadCount = notifications.length;

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

  // Icon mapping based on notification type
  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "appointment":
        return (
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
        );
      case "message":
        return (
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
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        );
      case "payment":
        return (
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
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Background color mapping based on notification type
  const getBgColor = (type: Notification["type"]) => {
    switch (type) {
      case "appointment":
        return "bg-blue-50 dark:bg-blue-900/20";
      case "message":
        return "bg-green-50 dark:bg-green-900/20";
      case "payment":
        return "bg-purple-50 dark:bg-purple-900/20";
      default:
        return "bg-gray-50 dark:bg-gray-800";
    }
  };

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
        aria-label="View notifications"
      >
        <motion.div initial={{ scale: 1 }} whileTap={{ scale: 0.9 }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={isOpen ? "text-primary" : "text-foreground"}
          >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
        </motion.div>

        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
            className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs text-white bg-green-500 rounded-full"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute right-0 mt-2 w-80 rounded-xl overflow-hidden shadow-xl border z-50 ${
              theme === "dark"
                ? "bg-card border-gray-800"
                : "bg-white border-gray-200"
            }`}
          >
            {/* Header Section */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
              <h3 className="font-semibold text-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  className="text-xs text-primary hover:underline"
                  onClick={() => {
                    /* Mark all as read logic */
                  }}
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                    </svg>
                  </div>
                  <p className="text-foreground/70 text-sm">
                    No notifications yet
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <Link
                    key={notification.id}
                    href={`/notifications/${notification.id}`}
                    className="block p-4 hover:bg-primary/5 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex">
                      <div
                        className={`w-10 h-10 rounded-full ${getBgColor(notification.type)} flex items-center justify-center mr-3 flex-shrink-0`}
                      >
                        {getIcon(notification.type)}
                      </div>
                      <div>
                        <p className="text-sm text-foreground leading-normal">
                          {notification.message}
                        </p>
                        <span className="text-xs text-foreground/60 mt-1 block">
                          {notification.time}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-800 text-center">
              <Link
                href="/notifications"
                className="text-sm text-primary hover:underline"
                onClick={() => setIsOpen(false)}
              >
                View all notifications
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
