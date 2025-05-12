"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/app/theme/ThemeProvider";
import { motion } from "framer-motion";

interface BottomNavigationProps {
  unreadMessages?: number;
}

export default function BottomNavigation({
  unreadMessages = 1,
}: BottomNavigationProps) {
  const pathname = usePathname();
  const { theme } = useTheme();

  const navigationItems = [
    {
      label: "Home",
      icon: (active: boolean) => (
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
          className={active ? "fill-primary/20" : ""}
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      href: "/dashboard",
      badge: 0,
    },
    {
      label: "Appointments",
      icon: (active: boolean) => (
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
          className={active ? "fill-primary/20" : ""}
        >
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
          <line x1="16" x2="16" y1="2" y2="6" />
          <line x1="8" x2="8" y1="2" y2="6" />
          <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
      ),
      href: "/appointments",
      badge: 0,
    },
    {
      label: "Messages",
      icon: (active: boolean) => (
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
          className={active ? "fill-primary/20" : ""}
        >
          <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
          <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
        </svg>
      ),
      href: "/messages",
      badge: unreadMessages,
    },
    {
      label: "Health",
      icon: (active: boolean) => (
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
          className={active ? "fill-primary/20" : ""}
        >
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
      href: "/health",
      badge: 0,
    },
    {
      label: "Profile",
      icon: (active: boolean) => (
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
          className={active ? "fill-primary/20" : ""}
        >
          <circle cx="12" cy="8" r="5" />
          <path d="M20 21a8 8 0 1 0-16 0" />
        </svg>
      ),
      href: "/profile",
      badge: 0,
    },
  ];

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`md:hidden fixed bottom-0 left-0 right-0 z-40 ${
        theme === "dark"
          ? "border-t border-gray-800/50"
          : "border-t border-gray-200/70"
      } bg-card/90 backdrop-blur-md shadow-lg`}
    >
      <div className="grid grid-cols-5 gap-1 px-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="relative flex flex-col items-center pt-3 pb-2"
            >
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  y: isActive ? -2 : 0,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`relative mb-1 ${
                  isActive ? "text-primary" : "text-foreground/60"
                }`}
              >
                {item.icon(isActive)}
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-purple-heart text-white text-xs rounded-full">
                    {item.badge}
                  </span>
                )}
              </motion.div>

              <span
                className={`text-xs font-medium ${
                  isActive ? "text-primary" : "text-foreground/60"
                }`}
              >
                {item.label}
              </span>

              {isActive && (
                <motion.span
                  layoutId="activeTab"
                  className="absolute -bottom-1 w-12 h-1 rounded-t-full bg-primary"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
      <div className="h-safe-area-bottom w-full bg-inherit"></div>
    </motion.div>
  );
}
