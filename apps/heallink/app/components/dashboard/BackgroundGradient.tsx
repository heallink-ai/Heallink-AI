"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/app/theme/ThemeProvider";

export default function BackgroundGradient() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Set mounted to true once component is mounted (to avoid hydration issues)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with no opacity to avoid hydration mismatch
    return <div className="fixed inset-0 opacity-0" />;
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Top gradient */}
      <div
        className="absolute top-0 left-0 right-0 h-[50vh] bg-gradient-to-b opacity-20"
        style={{
          backgroundImage:
            theme === "dark"
              ? "linear-gradient(to bottom, rgba(90, 45, 207, 0.2), transparent)"
              : "linear-gradient(to bottom, rgba(90, 45, 207, 0.15), transparent)",
        }}
      />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-[10%] left-[20%] w-[300px] h-[300px] rounded-full opacity-20 blur-[80px]"
        style={{
          background:
            theme === "dark"
              ? "radial-gradient(circle, rgba(90, 45, 207, 0.5), rgba(32, 102, 228, 0.3))"
              : "radial-gradient(circle, rgba(90, 45, 207, 0.4), rgba(32, 102, 228, 0.2))",
        }}
        animate={{
          x: [0, 30, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      <motion.div
        className="absolute bottom-[20%] right-[10%] w-[250px] h-[250px] rounded-full opacity-20 blur-[80px]"
        style={{
          background:
            theme === "dark"
              ? "radial-gradient(circle, rgba(32, 102, 228, 0.5), rgba(90, 45, 207, 0.3))"
              : "radial-gradient(circle, rgba(32, 102, 228, 0.4), rgba(90, 45, 207, 0.2))",
        }}
        animate={{
          x: [0, -20, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* Bottom gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[30vh] bg-gradient-to-t opacity-20"
        style={{
          backgroundImage:
            theme === "dark"
              ? "linear-gradient(to top, rgba(32, 102, 228, 0.2), transparent)"
              : "linear-gradient(to top, rgba(32, 102, 228, 0.15), transparent)",
        }}
      />
    </div>
  );
}
