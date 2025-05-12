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
  toggleTheme: () => void;
};

// Create the context with a default value
const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  setTheme: () => null,
  toggleTheme: () => null,
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
    setMounted(true);

    try {
      const savedTheme = localStorage.getItem("admin-theme") as Theme | null;

      if (savedTheme) {
        setTheme(savedTheme);
        applyTheme(savedTheme);
      } else {
        // Default to dark theme
        setTheme("dark");
        applyTheme("dark");
      }
    } catch {
      console.log("Theme storage not available");
      setTheme("dark");
      applyTheme("dark");
    }
  }, [applyTheme]);

  // Update theme when it changes
  useEffect(() => {
    if (!mounted) return;

    try {
      localStorage.setItem("admin-theme", theme);
      applyTheme(theme);
    } catch {
      console.log("Theme storage not available");
    }
  }, [theme, mounted, applyTheme]);

  // Function to set theme directly
  const changeTheme = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
  }, []);

  // Function to toggle theme
  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  }, []);

  // Provide a stable value object
  const value = {
    theme,
    setTheme: changeTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
