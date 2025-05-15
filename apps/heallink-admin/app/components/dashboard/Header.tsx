"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/app/theme/ThemeProvider";
import { signOut, useSession } from "next-auth/react";
import {
  Bell,
  Search,
  UserPlus,
  UserRoundPlus,
  Megaphone,
  RefreshCw,
  Moon,
  Sun,
  LogOut,
  Settings,
  HelpCircle,
  User,
  ChevronDown,
  Menu,
} from "lucide-react";

export default function Header({
  toggleSidebar,
}: {
  toggleSidebar: () => void;
}) {
  const { theme, toggleTheme } = useTheme();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "System Alert",
      message: "API latency detected with pharmacy partner",
      time: "2 minutes ago",
      read: false,
    },
    {
      id: 2,
      title: "Background Job",
      message: "Daily report generation completed",
      time: "10 minutes ago",
      read: false,
    },
    {
      id: 3,
      title: "New Provider",
      message: "Memorial Hospital onboarding completed",
      time: "1 hour ago",
      read: true,
    },
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  const getEnvironmentBadge = () => {
    const env = process.env.NEXT_PUBLIC_APP_ENV || "dev";

    const colors = {
      dev: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900 dark:text-amber-100 dark:border-amber-800",
      staging:
        "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-100 dark:border-purple-800",
      prod: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-800",
    };

    return (
      <span
        className={`text-xs font-medium px-2.5 py-0.5 rounded border ${colors[env as keyof typeof colors]}`}
      >
        {env.toUpperCase()}
      </span>
    );
  };

  if (!mounted) {
    return null;
  }

  return (
    <header className="h-[60px] w-full bg-[color:var(--topbar)] text-[color:var(--topbar-foreground)] border-b border-[color:var(--border)] neumorph-flat">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-[color:var(--navbar-item-hover)] transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-gradient-to-r from-purple-heart to-royal-blue flex items-center justify-center text-white font-bold">
              H
            </div>
            <span className="font-semibold text-lg hidden md:block">
              Heallink
            </span>
          </div>

          <div className="hidden md:flex items-center ml-6">
            <div className="relative">
              <input
                type="search"
                placeholder="Search users, providers..."
                className="pl-9 pr-4 py-1.5 rounded-lg bg-[color:var(--input)] text-[color:var(--foreground)] w-64 text-sm neumorph-pressed focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)]"
              />
              <Search
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[color:var(--muted-foreground)]"
                size={16}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--muted-foreground)] text-xs">
                ⌘K
              </div>
            </div>
          </div>
        </div>

        {/* Center section */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            className="p-2 rounded-lg hover:bg-[color:var(--navbar-item-hover)] transition-colors flex items-center gap-1"
            aria-label="Add User"
          >
            <UserPlus size={18} />
            <span className="text-xs">New User</span>
          </button>
          <button
            className="p-2 rounded-lg hover:bg-[color:var(--navbar-item-hover)] transition-colors flex items-center gap-1"
            aria-label="Add Provider"
          >
            <UserRoundPlus size={18} />
            <span className="text-xs">New Provider</span>
          </button>
          <button
            className="p-2 rounded-lg hover:bg-[color:var(--navbar-item-hover)] transition-colors flex items-center gap-1"
            aria-label="Send Announcement"
          >
            <Megaphone size={18} />
            <span className="text-xs">Announce</span>
          </button>
          <button
            className="p-2 rounded-lg hover:bg-[color:var(--navbar-item-hover)] transition-colors"
            aria-label="Refresh Data"
          >
            <RefreshCw size={18} />
          </button>

          <div className="mx-2">{getEnvironmentBadge()}</div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-lg hover:bg-[color:var(--navbar-item-hover)] transition-colors relative"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[color:var(--error)] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown for notifications */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-[color:var(--card)] z-50 neumorph-flat border border-[color:var(--border)]">
                <div className="p-3 border-b border-[color:var(--border)]">
                  <h3 className="text-sm font-semibold">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b border-[color:var(--border)] ${
                        !notification.read
                          ? "bg-[color:var(--navbar-item-selected)]"
                          : ""
                      }`}
                    >
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium">
                          {notification.title}
                        </h4>
                        <span className="text-xs text-[color:var(--muted-foreground)]">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-xs mt-1 text-[color:var(--muted-foreground)]">
                        {notification.message}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="p-2">
                  <button className="w-full text-center text-xs p-2 text-[color:var(--primary)] hover:bg-[color:var(--navbar-item-hover)] rounded-md transition-colors">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-[color:var(--navbar-item-hover)] transition-colors"
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 hover:bg-[color:var(--navbar-item-hover)] p-1.5 rounded-lg transition-colors"
              aria-label="User menu"
            >
              <div className="w-7 h-7 rounded-full bg-[color:var(--primary)] flex items-center justify-center text-white text-sm">
                {session?.user?.name
                  ? session.user.name.charAt(0).toUpperCase()
                  : "U"}
              </div>
              <div className="hidden md:block mr-1">
                <div className="text-xs font-medium">
                  {session?.user?.name || "User"}
                </div>
                <div className="text-[10px] text-[color:var(--muted-foreground)]">
                  Administrator
                </div>
              </div>
              <ChevronDown size={14} />
            </button>

            {/* User dropdown */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[color:var(--card)] z-50 neumorph-flat border border-[color:var(--border)]">
                <div className="py-1">
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-[color:var(--navbar-item-hover)] flex items-center gap-2">
                    <User size={14} />
                    <span>Profile</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-[color:var(--navbar-item-hover)] flex items-center gap-2">
                    <Settings size={14} />
                    <span>Settings</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-[color:var(--navbar-item-hover)] flex items-center gap-2">
                    <HelpCircle size={14} />
                    <span>Help Center</span>
                  </button>
                  <div className="border-t border-[color:var(--border)] my-1"></div>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-[color:var(--error)] hover:bg-[color:var(--navbar-item-hover)] flex items-center gap-2"
                  >
                    <LogOut size={14} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
