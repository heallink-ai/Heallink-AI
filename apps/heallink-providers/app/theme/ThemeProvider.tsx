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
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("heallink-providers-theme") as Theme | null;

      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        // Check for old theme key for backwards compatibility
        const legacyTheme = localStorage.getItem("theme") as Theme | null;
        if (legacyTheme) {
          setTheme(legacyTheme);
          // Migrate to new key
          localStorage.setItem("heallink-providers-theme", legacyTheme);
          localStorage.removeItem("theme");
        } else {
          const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
            .matches
            ? "dark"
            : "light";
          setTheme(systemTheme);
        }
      }
    }
  }, []);

  // Update documentElement class when theme changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(theme);

      // Save to localStorage
      localStorage.setItem("heallink-providers-theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}