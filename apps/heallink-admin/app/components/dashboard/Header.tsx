"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/app/theme/ThemeProvider";
import { signOut, useSession } from "next-auth/react";
import { createPortal } from "react-dom";
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
  X,
  Command,
  Sparkles,
  Plus,
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
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Refs for dropdown positioning
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuTriggerRef = useRef<HTMLButtonElement>(null);
  const notificationTriggerRef = useRef<HTMLButtonElement>(null);

  const [notifications] = useState([
    {
      id: 1,
      title: "System Alert",
      message: "API latency detected with pharmacy partner",
      time: "2 minutes ago",
      read: false,
      type: "warning",
    },
    {
      id: 2,
      title: "Background Job",
      message: "Daily report generation completed",
      time: "10 minutes ago",
      read: false,
      type: "success",
    },
    {
      id: 3,
      title: "New Provider",
      message: "Memorial Hospital onboarding completed",
      time: "1 hour ago",
      read: true,
      type: "info",
    },
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuOpen &&
        userMenuRef.current &&
        userMenuTriggerRef.current &&
        !userMenuRef.current.contains(event.target as Node) &&
        !userMenuTriggerRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
      
      if (
        notificationsOpen &&
        notificationRef.current &&
        notificationTriggerRef.current &&
        !notificationRef.current.contains(event.target as Node) &&
        !notificationTriggerRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen, notificationsOpen]);

  // Close dropdowns on escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setUserMenuOpen(false);
        setNotificationsOpen(false);
        setMobileSearchOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  const getEnvironmentBadge = () => {
    const env = process.env.NEXT_PUBLIC_APP_ENV || "dev";

    const colors = {
      dev: "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg",
      staging: "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg",
      prod: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg",
    };

    return (
      <div className="relative">
        <span
          className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full border-0 ${colors[env as keyof typeof colors]}`}
        >
          <Sparkles size={12} />
          {env.toUpperCase()}
        </span>
      </div>
    );
  };

  const getDropdownPosition = (triggerElement: HTMLElement) => {
    const rect = triggerElement.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    const viewportWidth = window.innerWidth;
    
    const top = rect.bottom + scrollY + 8;
    const left = rect.left + scrollX;
    const right = viewportWidth - rect.right - scrollX;

    return { top, left, right };
  };

  const NotificationIcon = ({ type }: { type: string }) => {
    switch (type) {
      case "warning":
        return <div className="w-2 h-2 bg-amber-500 rounded-full" />;
      case "success":
        return <div className="w-2 h-2 bg-emerald-500 rounded-full" />;
      case "info":
        return <div className="w-2 h-2 bg-blue-500 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full" />;
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full h-16 bg-[color:var(--topbar)]/95 backdrop-blur-lg border-b border-[color:var(--border)]/50 supports-[backdrop-filter]:bg-[color:var(--topbar)]/75">
        <div className="h-full px-4 lg:px-6 flex items-center justify-between">
          {/* Left section */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="p-2.5 rounded-xl hover:bg-[color:var(--accent)] transition-all duration-200 hover:scale-105 lg:hidden xl:block"
              aria-label="Toggle sidebar"
            >
              <Menu size={20} className="text-[color:var(--foreground)]" />
            </button>

            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold text-lg shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                  H
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl" />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Heallink
                </span>
                <div className="text-xs text-[color:var(--muted-foreground)] font-medium">
                  Admin Portal
                </div>
              </div>
            </div>

            {/* Desktop Search */}
            <div className="hidden lg:flex items-center ml-8">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-[color:var(--muted-foreground)] group-focus-within:text-[color:var(--primary)] transition-colors" />
                </div>
                <input
                  type="search"
                  placeholder="Search anything..."
                  className="block w-80 pl-11 pr-12 py-3 rounded-2xl bg-[color:var(--input)] border border-[color:var(--border)] text-[color:var(--foreground)] placeholder-[color:var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/20 focus:border-[color:var(--primary)] transition-all duration-200 hover:border-[color:var(--primary)]/50"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <kbd className="inline-flex items-center gap-1 rounded-lg border border-[color:var(--border)] px-2 py-1 text-xs font-mono text-[color:var(--muted-foreground)]">
                    <Command size={10} />
                    K
                  </kbd>
                </div>
              </div>
            </div>
          </div>

          {/* Center section - Quick Actions */}
          <div className="hidden xl:flex items-center gap-1">
            <button className="group flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-[color:var(--accent)] transition-all duration-200 hover:scale-105">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white group-hover:shadow-lg transition-all duration-200">
                <UserPlus size={14} />
              </div>
              <span className="text-sm font-medium text-[color:var(--foreground)]">Add User</span>
            </button>
            
            <button className="group flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-[color:var(--accent)] transition-all duration-200 hover:scale-105">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white group-hover:shadow-lg transition-all duration-200">
                <UserRoundPlus size={14} />
              </div>
              <span className="text-sm font-medium text-[color:var(--foreground)]">Add Provider</span>
            </button>

            {getEnvironmentBadge()}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setMobileSearchOpen(true)}
              className="lg:hidden p-2.5 rounded-xl hover:bg-[color:var(--accent)] transition-all duration-200 hover:scale-105"
              aria-label="Open search"
            >
              <Search size={18} className="text-[color:var(--foreground)]" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                ref={notificationTriggerRef}
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2.5 rounded-xl hover:bg-[color:var(--accent)] transition-all duration-200 hover:scale-105 group"
                aria-label="Notifications"
              >
                <Bell size={18} className="text-[color:var(--foreground)] group-hover:text-[color:var(--primary)] transition-colors" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-[color:var(--accent)] transition-all duration-200 hover:scale-105 group"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <Sun size={18} className="text-[color:var(--foreground)] group-hover:text-amber-500 transition-colors" />
              ) : (
                <Moon size={18} className="text-[color:var(--foreground)] group-hover:text-blue-500 transition-colors" />
              )}
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                ref={userMenuTriggerRef}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 hover:bg-[color:var(--accent)] p-2 pr-3 rounded-xl transition-all duration-200 hover:scale-105 group"
                aria-label="User menu"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[color:var(--primary)] to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    {session?.user?.name
                      ? session.user.name.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[color:var(--primary)] to-purple-600 opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-sm" />
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-semibold text-[color:var(--foreground)] text-left">
                    {session?.user?.name || "User"}
                  </div>
                  <div className="text-xs text-[color:var(--muted-foreground)] text-left">
                    Administrator
                  </div>
                </div>
                <ChevronDown size={14} className={`text-[color:var(--muted-foreground)] transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="xl:hidden p-2.5 rounded-xl hover:bg-[color:var(--accent)] transition-all duration-200 hover:scale-105"
              aria-label="Open mobile menu"
            >
              <Plus size={18} className="text-[color:var(--foreground)]" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Search Overlay */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileSearchOpen(false)} />
          <div className="absolute top-4 left-4 right-4 bg-[color:var(--card)] rounded-2xl border border-[color:var(--border)] shadow-2xl p-4">
            <div className="flex items-center gap-3">
              <Search size={20} className="text-[color:var(--muted-foreground)]" />
              <input
                type="search"
                placeholder="Search anything..."
                className="flex-1 bg-transparent text-[color:var(--foreground)] placeholder-[color:var(--muted-foreground)] focus:outline-none text-lg"
                autoFocus
              />
              <button
                onClick={() => setMobileSearchOpen(false)}
                className="p-2 rounded-lg hover:bg-[color:var(--accent)] transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Quick Actions Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-20 left-4 right-4 bg-[color:var(--card)] rounded-2xl border border-[color:var(--border)] shadow-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[color:var(--foreground)]">Quick Actions</h3>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-[color:var(--accent)] transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-[color:var(--accent)] transition-colors">
                <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
                  <UserPlus size={16} />
                </div>
                <span className="text-sm font-medium">Add User</span>
              </button>
              <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-[color:var(--accent)] transition-colors">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                  <UserRoundPlus size={16} />
                </div>
                <span className="text-sm font-medium">Add Provider</span>
              </button>
              <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-[color:var(--accent)] transition-colors">
                <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 text-white">
                  <Megaphone size={16} />
                </div>
                <span className="text-sm font-medium">Announce</span>
              </button>
              <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-[color:var(--accent)] transition-colors">
                <div className="p-2 rounded-lg bg-gradient-to-br from-gray-500 to-gray-700 text-white">
                  <RefreshCw size={16} />
                </div>
                <span className="text-sm font-medium">Refresh</span>
              </button>
            </div>
            <div className="mt-4 pt-4 border-t border-[color:var(--border)]">
              {getEnvironmentBadge()}
            </div>
          </div>
        </div>
      )}

      {/* Notification Dropdown Portal */}
      {notificationsOpen && notificationTriggerRef.current && (
        createPortal(
          <div
            ref={notificationRef}
            style={{
              position: "absolute",
              ...getDropdownPosition(notificationTriggerRef.current),
              zIndex: 60000,
              width: "320px",
              maxWidth: "calc(100vw - 32px)",
            }}
            className="bg-[color:var(--card)] border border-[color:var(--border)] rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200"
          >
            <div className="p-4 border-b border-[color:var(--border)] bg-gradient-to-r from-[color:var(--card)] to-[color:var(--accent)]/20">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[color:var(--foreground)]">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <span className="text-xs px-2 py-1 bg-[color:var(--primary)] text-[color:var(--primary-foreground)] rounded-full font-medium">
                      {unreadCount} new
                    </span>
                  )}
                  <button className="text-xs text-[color:var(--primary)] hover:text-[color:var(--primary)]/80 font-medium">
                    Mark all read
                  </button>
                </div>
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-[color:var(--border)] hover:bg-[color:var(--accent)]/50 transition-colors cursor-pointer ${
                    !notification.read ? "bg-[color:var(--accent)]/20" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <NotificationIcon type={notification.type} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-[color:var(--foreground)] truncate">
                          {notification.title}
                        </h4>
                        <span className="text-xs text-[color:var(--muted-foreground)] whitespace-nowrap ml-2">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-sm text-[color:var(--muted-foreground)] mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 bg-[color:var(--accent)]/10">
              <button className="w-full text-center text-sm p-2.5 text-[color:var(--primary)] hover:bg-[color:var(--accent)] rounded-xl transition-colors font-medium">
                View all notifications
              </button>
            </div>
          </div>,
          document.body
        )
      )}

      {/* User Menu Dropdown Portal */}
      {userMenuOpen && userMenuTriggerRef.current && (
        createPortal(
          <div
            ref={userMenuRef}
            style={{
              position: "absolute",
              ...getDropdownPosition(userMenuTriggerRef.current),
              right: getDropdownPosition(userMenuTriggerRef.current).right,
              zIndex: 60000,
              width: "240px",
              maxWidth: "calc(100vw - 32px)",
            }}
            className="bg-[color:var(--card)] border border-[color:var(--border)] rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200"
          >
            <div className="p-4 border-b border-[color:var(--border)] bg-gradient-to-r from-[color:var(--card)] to-[color:var(--accent)]/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[color:var(--primary)] to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                  {session?.user?.name
                    ? session.user.name.charAt(0).toUpperCase()
                    : "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[color:var(--foreground)] truncate">
                    {session?.user?.name || "User"}
                  </div>
                  <div className="text-xs text-[color:var(--muted-foreground)]">
                    {session?.user?.email || "admin@heallink.com"}
                  </div>
                </div>
              </div>
            </div>
            <div className="py-2">
              <a
                href="/dashboard/profile"
                className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-[color:var(--accent)] transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                  <User size={14} />
                </div>
                <span className="font-medium">Profile Settings</span>
              </a>
              <button className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-[color:var(--accent)] transition-colors w-full text-left">
                <div className="p-1.5 rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-950 dark:text-gray-400">
                  <Settings size={14} />
                </div>
                <span className="font-medium">Preferences</span>
              </button>
              <button className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-[color:var(--accent)] transition-colors w-full text-left">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <HelpCircle size={14} />
                </div>
                <span className="font-medium">Help Center</span>
              </button>
              <div className="border-t border-[color:var(--border)] my-2"></div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors w-full text-left"
              >
                <div className="p-1.5 rounded-lg bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
                  <LogOut size={14} />
                </div>
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>,
          document.body
        )
      )}
    </>
  );
}