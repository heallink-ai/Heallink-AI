"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/app/theme/ThemeProvider";
import { useSession } from "next-auth/react";
import Link from "next/link";

// Component imports
import NotificationBell from "./NotificationBell";
import QuickActions from "./QuickActions";
import ProfileDropdown from "./ProfileDropdown";

// API imports
import { useCurrentUserProfile } from "@/app/hooks/useUserApi";

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

  // Use React Query to fetch user profile
  const {
    data: profileData,
    isLoading: isLoadingProfile,
    error: profileError,
    isError: hasProfileError,
    refetch: refetchProfile,
  } = useCurrentUserProfile();

  // Log errors if they occur
  useEffect(() => {
    if (hasProfileError && profileError) {
      console.error("Error fetching profile:", profileError);
    }
  }, [hasProfileError, profileError]);

  // Retry fetching profile on error after a delay
  useEffect(() => {
    let retryTimeout: NodeJS.Timeout;

    if (hasProfileError) {
      retryTimeout = setTimeout(() => {
        refetchProfile();
      }, 30000); // Retry after 30 seconds
    }

    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [hasProfileError, refetchProfile]);

  // Use profile data or session data if available, or fall back to the provided userData
  const userProfile = {
    name: profileData?.name || session?.user?.name || userData.name,
    avatar:
      profileData?.avatarUrl || session?.user?.image || userData.avatar || "",
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

  // Determine if the header is in a loading state
  const isHeaderLoading = loading || isLoadingProfile;

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
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" y1="12" y2="12" x2="20" />
                <line x1="4" y1="6" y2="6" x2="20" />
                <line x1="4" y1="18" y2="18" x2="20" />
              </svg>
            </motion.button>

            <div className="flex items-center">
              <h1 className="text-xl font-semibold">
                {isHeaderLoading ? (
                  <Skeleton className="w-32 h-8" />
                ) : (
                  <Link href="/dashboard">
                    <span className="gradient-text inline-block">HealLink</span>
                    <span className="opacity-60">+</span>
                  </Link>
                )}
              </h1>
            </div>
          </div>

          {/* Right section with actions and profile */}
          <div className="flex items-center gap-2">
            {/* Theme toggle button */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2.5 rounded-xl transition-all duration-300 ${
                scrolled
                  ? "neumorph-button"
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
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
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
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              )}
            </motion.button>

            {/* Quick Actions */}
            {!isHeaderLoading && (
              <div
                className={`${scrolled ? "scale-95" : "scale-100"} transition-all duration-300`}
              >
                <QuickActions />
              </div>
            )}

            {/* Notification Bell */}
            {!isHeaderLoading && (
              <div
                className={`${scrolled ? "scale-95" : "scale-100"} transition-all duration-300`}
              >
                <NotificationBell notifications={userProfile.notifications} />
              </div>
            )}

            {/* Profile Dropdown */}
            {isHeaderLoading ? (
              <div className="h-10 w-10">
                <Skeleton className="h-full w-full rounded-full" />
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
