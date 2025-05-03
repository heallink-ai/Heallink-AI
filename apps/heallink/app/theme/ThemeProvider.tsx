// src/app/theme/ThemeProvider.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

type Theme = "dark" | "light";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

// Create the context with a default value to avoid the "must be used within Provider" error
const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  setTheme: () => null,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  // Function to apply theme class to document
  const applyTheme = useCallback((newTheme: Theme) => {
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      document.documentElement.style.colorScheme = "dark";
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
    }
  }, []);

  // Handle initial theme setup
  useEffect(() => {
    // Set mounted to true after hydration
    setMounted(true);

    try {
      const savedTheme = localStorage.getItem("theme") as Theme | null;

      if (savedTheme) {
        setTheme(savedTheme);
        applyTheme(savedTheme);
      } else {
        // Default to dark theme as specified
        setTheme("dark");
        applyTheme("dark");
      }
    } catch (error) {
      // Handle any localStorage errors that might occur during SSR
      console.log("Theme storage not available");
      // Ensure dark theme is applied by default
      setTheme("dark");
      applyTheme("dark");
    }
  }, [applyTheme]);

  // Update theme when it changes
  useEffect(() => {
    if (!mounted) return;

    try {
      localStorage.setItem("theme", theme);
      applyTheme(theme);
    } catch (error) {
      // Handle any localStorage errors that might occur
      console.log("Theme storage not available");
    }
  }, [theme, mounted, applyTheme]);

  // Function to toggle theme
  const toggleTheme = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
  }, []);

  // Provide a stable value object to avoid unnecessary re-renders
  const value = {
    theme,
    setTheme: toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
