"use client";

import { Menu, Bell, Search, Sun, Moon } from "lucide-react";
import { useTheme } from "../../theme/ThemeProvider";
import Button from "../ui/Button";

interface HeaderProps {
  onMenuClick: () => void;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function Header({ onMenuClick, user }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 neumorph-flat bg-card/50 backdrop-blur-xl border-b border-border/50 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
      {/* Left side */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
        >
          <Menu className="h-5 w-5 text-muted-foreground" />
        </button>
        
        {/* Search */}
        <div className="hidden md:flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search patients, appointments..."
              className="pl-10 pr-4 py-2 w-80 bg-muted/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all backdrop-blur-sm"
            />
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-3">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-muted/50 transition-all duration-200 group"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-muted-foreground group-hover:text-yellow-500 group-hover:rotate-180 transition-all duration-300" />
          ) : (
            <Moon className="h-5 w-5 text-muted-foreground group-hover:text-blue-500 group-hover:rotate-180 transition-all duration-300" />
          )}
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors relative group">
          <Bell className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
        </button>

        {/* User profile */}
        <div className="flex items-center space-x-3 pl-3 border-l border-border/50">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-foreground">{user?.name || "Provider"}</p>
            <p className="text-xs text-muted-foreground truncate max-w-32">{user?.email || "provider@heallink.com"}</p>
          </div>
          <div className="h-9 w-9 bg-gradient-to-br from-purple-heart to-royal-blue rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-sm font-medium text-white">
              {user?.name?.charAt(0) || "P"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}