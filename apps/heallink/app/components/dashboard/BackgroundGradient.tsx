"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function BackgroundGradient() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Background base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/95"></div>

      {/* Animated orbs */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary/10 to-primary/5 blur-3xl"
        animate={{
          x: [0, 50, -50, 0],
          y: [0, 30, -30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          top: "10%",
          left: "5%",
        }}
      />

      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-br from-primary/5 to-primary/10 blur-3xl"
        animate={{
          x: [0, -30, 30, 0],
          y: [0, 50, -50, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        style={{
          bottom: "15%",
          right: "10%",
        }}
      />

      {/* Mouse follower subtle highlight */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full bg-primary/5 blur-3xl"
        animate={{
          x: mousePosition.x - 150,
          y: mousePosition.y - 150,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 50,
          mass: 0.5,
        }}
      />
    </div>
  );
}
