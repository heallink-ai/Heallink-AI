"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/app/theme/ThemeProvider";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ProfileDropdownProps {
  userName: string;
  avatarUrl: string;
  isOnline?: boolean;
}

export default function ProfileDropdown({
  userName,
  avatarUrl,
  isOnline = true,
}: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const router = useRouter();
  const { data: session } = useSession();

  // Use session data if available
  const displayName = session?.user?.name || userName;
  const displayAvatar = session?.user?.image || avatarUrl;
  const userRole = session?.user?.role || "Patient";

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

  // Handle logout
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoggingOut(true);

    try {
      await signOut({ redirect: false });
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  const menuItems = [
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
        >
          <circle cx="12" cy="8" r="5" />
          <path d="M20 21a8 8 0 1 0-16 0" />
        </svg>
      ),
      label: "My Profile",
      href: "/profile",
      color: "from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700",
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
        >
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
          <line x1="16" x2="16" y1="2" y2="6" />
          <line x1="8" x2="8" y1="2" y2="6" />
          <line x1="3" x2="21" y1="10" y2="10" />
          <path d="M8 14h.01" />
          <path d="M12 14h.01" />
          <path d="M16 14h.01" />
          <path d="M8 18h.01" />
          <path d="M12 18h.01" />
          <path d="M16 18h.01" />
        </svg>
      ),
      label: "Health Records",
      href: "/health",
      color:
        "from-green-400 to-green-600 dark:from-green-500 dark:to-green-700",
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
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
      label: "Settings",
      href: "/settings",
      color: "from-sky-400 to-sky-600 dark:from-sky-500 dark:to-sky-700",
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
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" x2="9" y1="12" y2="12" />
        </svg>
      ),
      label: isLoggingOut ? "Logging out..." : "Logout",
      href: "#",
      color: "from-red-400 to-red-600 dark:from-red-500 dark:to-red-700",
      onClick: handleLogout,
      disabled: isLoggingOut,
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 rounded-full overflow-hidden transition-all duration-300 hover:shadow-md active:scale-95"
        aria-label="Open profile menu"
      >
        <Image
          src={displayAvatar}
          alt={`${displayName}'s avatar`}
          width={40}
          height={40}
          className="rounded-full object-cover"
          unoptimized
        />
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-background rounded-full"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Solid background div that fills the entire dropdown */}
            <div
              className="absolute right-0 mt-3 w-80 rounded-xl z-40 overflow-hidden"
              style={{
                backgroundColor: theme === "dark" ? "#121212" : "#ffffff",
                boxShadow:
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                border:
                  theme === "dark" ? "1px solid #333" : "1px solid #e5e7eb",
              }}
            >
              {/* Content container */}
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="relative z-50 overflow-hidden"
              >
                {/* Header Section with Avatar and User Info */}
                <div className="relative overflow-hidden">
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent"></div>

                  <div className="relative z-10 p-5">
                    <div className="flex items-center gap-4">
                      {/* Avatar with neumorph effect */}
                      <motion.div
                        className="relative neumorph-flat rounded-full p-1"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Image
                          src={displayAvatar}
                          alt={`${displayName}'s avatar`}
                          width={60}
                          height={60}
                          className="rounded-full object-cover"
                          unoptimized
                        />
                        {isOnline && (
                          <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 border-2 border-background dark:border-gray-900 rounded-full"></span>
                        )}
                      </motion.div>

                      <div>
                        <h3 className="font-semibold text-lg">
                          <span className="gradient-text">{displayName}</span>
                        </h3>
                        <div className="flex items-center mt-1 text-sm text-foreground/70">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">
                            <svg
                              className="w-3 h-3 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                            {typeof userRole === "string"
                              ? userRole
                              : "Patient"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Health Stats - Neumorphic Cards */}
                <div className="px-4 py-3">
                  <div className="grid grid-cols-3 gap-3">
                    <motion.div
                      className="neumorph-flat p-3 rounded-xl flex flex-col items-center justify-center"
                      whileHover={{ translateY: -3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-xs text-foreground/60 mb-1">
                        Appointments
                      </span>
                      <span className="text-xl font-semibold gradient-text">
                        12
                      </span>
                    </motion.div>
                    <motion.div
                      className="neumorph-flat p-3 rounded-xl flex flex-col items-center justify-center"
                      whileHover={{ translateY: -3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-xs text-foreground/60 mb-1">
                        Doctors
                      </span>
                      <span className="text-xl font-semibold gradient-text">
                        3
                      </span>
                    </motion.div>
                    <motion.div
                      className="neumorph-flat p-3 rounded-xl flex flex-col items-center justify-center"
                      whileHover={{ translateY: -3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-xs text-foreground/60 mb-1">
                        Health Score
                      </span>
                      <span className="text-xl font-semibold gradient-text">
                        87%
                      </span>
                    </motion.div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-2">
                  {menuItems.map((item, index) => (
                    <div key={index} className="mb-1 last:mb-0">
                      {item.onClick ? (
                        <button
                          onClick={item.onClick}
                          disabled={item.disabled}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-foreground/5 ${
                            item.disabled ? "opacity-70 cursor-not-allowed" : ""
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center bg-gradient-to-br ${item.color} text-white`}
                          >
                            {item.icon}
                          </div>
                          <span>{item.label}</span>
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-foreground/5"
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center bg-gradient-to-br ${item.color} text-white`}
                          >
                            {item.icon}
                          </div>
                          <span>{item.label}</span>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>

                {/* Footer Section */}
                <div className="p-3 border-t border-primary/10">
                  <div className="flex justify-between items-center">
                    <Link
                      href="/profile/preferences"
                      className="text-xs text-foreground/60 hover:text-primary transition-colors"
                    >
                      Preferences
                    </Link>
                    <Link
                      href="/help"
                      className="text-xs text-foreground/60 hover:text-primary transition-colors"
                    >
                      Help Center
                    </Link>
                    <Link
                      href="/privacy"
                      className="text-xs text-foreground/60 hover:text-primary transition-colors"
                    >
                      Privacy
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
