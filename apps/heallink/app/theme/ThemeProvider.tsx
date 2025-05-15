// src/app/theme/ThemeProvider.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  setTheme: () => {},
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>("dark");

  // Initialize theme from localStorage (client-side only)
  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("heallink-theme") as Theme | null;

      // Use saved theme if available, otherwise detect system preference
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        // Check system preference
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
        setTheme(systemTheme);
      }
    }
  }, []);

  // Update documentElement class when theme changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = document.documentElement;

      // Remove previous theme class
      root.classList.remove("light", "dark");

      // Add new theme class
      root.classList.add(theme);

      // Set color-scheme
      root.style.colorScheme = theme;

      // Save to localStorage
      localStorage.setItem("heallink-theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
