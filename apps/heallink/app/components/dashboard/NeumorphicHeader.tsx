"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/app/theme/ThemeProvider";
import { useSession } from "next-auth/react";

// Component imports
import NotificationBell from "./NotificationBell";
import QuickActions from "./QuickActions";
import ProfileDropdown from "./ProfileDropdown";

// Types
type NotificationType = "appointment" | "message" | "payment";

interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  time: string;
}

interface NeumorphicHeaderProps {
  userData: {
    name: string;
    avatar: string;
    notifications: Notification[];
  };
  onMenuToggle: () => void;
  loading?: boolean;
}

export default function NeumorphicHeader({
  userData,
  onMenuToggle,
  loading = false,
}: NeumorphicHeaderProps) {
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();

  console.log({ session });

  // Debug session data for profile image issue
  useEffect(() => {
    if (session?.user) {
      console.log("Session user data:", {
        name: session.user.name,
        image: session.user.image,
        provider: session.user.provider,
      });
    }
  }, [session]);

  // Use session data if available
  const userProfile = {
    name: session?.user?.name || userData.name,
    avatar: session?.user?.image || userData.avatar || "/vercel.svg",
    notifications: userData.notifications,
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Skeleton loaders for UI elements when loading
  const Skeleton = ({ className }: { className?: string }) => (
    <span
      className={`animate-pulse bg-primary/10 rounded-lg inline-block ${className}`}
    ></span>
  );

  // Light gray border color for buttons
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";

  return (
    <header
      className={`w-full z-20 fixed top-0 backdrop-blur-lg transition-all duration-300 ${
        scrolled ? "py-2 border-b border-primary/10" : "py-4"
      }`}
    >
      <div
        className={`mx-auto px-4 max-w-7xl transition-all duration-300 ${
          scrolled ? "neumorph-card bg-background/70" : "bg-transparent"
        }`}
      >
        <div className="flex justify-between items-center">
          {/* Left section with menu button and logo */}
          <div className="flex items-center gap-3">
            <motion.button
              onClick={onMenuToggle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2.5 rounded-xl transition-all duration-300 ${
                scrolled
                  ? "neumorph-button"
                  : `hover:bg-primary/10 border ${borderColor}`
              }`}
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </motion.button>

            <motion.div
              className="text-xl font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <span className="gradient-text">HealLink</span>
            </motion.div>
          </div>

          {/* Search bar - center section (visible only on larger screens) */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <div
              className={`relative transition-all duration-300 ${
                scrolled
                  ? "neumorph-input"
                  : "bg-primary/5 rounded-full overflow-hidden"
              }`}
            >
              <input
                type="text"
                placeholder="Search..."
                className="w-full py-2 pl-4 pr-10 bg-transparent border-none focus:outline-none focus:ring-0"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
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
                  className="text-muted-foreground"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </span>
            </div>
          </div>

          {/* Right section with actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                scrolled
                  ? "neumorph-button neumorph-accent-primary"
                  : `hover:bg-primary/10 border ${borderColor}`
              }`}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? (
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
                  className="text-amber-300"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="M4.93 4.93l1.41 1.41" />
                  <path d="M17.66 17.66l1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="M6.34 17.66l-1.41 1.41" />
                  <path d="M19.07 4.93l-1.41 1.41" />
                </svg>
              ) : (
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
                  className="text-purple-heart"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              )}
            </motion.button>

            {/* Quick Actions */}
            {!loading && (
              <div
                className={`${scrolled ? "scale-95" : "scale-100"} transition-all duration-300`}
              >
                <QuickActions />
              </div>
            )}

            {/* Notification Bell */}
            {!loading && (
              <div
                className={`${scrolled ? "scale-95" : "scale-100"} transition-all duration-300`}
              >
                <NotificationBell notifications={userProfile.notifications} />
              </div>
            )}

            {/* Profile Dropdown */}
            {loading ? (
              <div
                className={`relative w-10 h-10 rounded-xl overflow-hidden ${
                  scrolled ? "neumorph-flat" : ""
                }`}
              >
                <Skeleton className="w-full h-full" />
              </div>
            ) : (
              <div
                className={`${scrolled ? "scale-95" : "scale-100"} transition-all duration-300`}
              >
                <ProfileDropdown
                  userName={userProfile.name}
                  avatarUrl={userProfile.avatar}
                  isOnline={true}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
