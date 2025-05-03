// src/components/animations/ScrollReveal.tsx
"use client";

import { useEffect, useRef, useState } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  className?: string;
}

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 400,
  distance = 30,
  once = true,
  className = "",
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!once || !hasAnimated)) {
          setIsVisible(true);
          setHasAnimated(true);
        } else if (!entry.isIntersecting && !once) {
          setIsVisible(false);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    const currentRef = ref.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [once, hasAnimated]);

  // Initial styles based on direction
  const getInitialStyles = () => {
    switch (direction) {
      case "up":
        return { transform: `translateY(${distance}px)` };
      case "down":
        return { transform: `translateY(-${distance}px)` };
      case "left":
        return { transform: `translateX(${distance}px)` };
      case "right":
        return { transform: `translateX(-${distance}px)` };
      case "none":
        return { opacity: 0 };
      default:
        return { transform: `translateY(${distance}px)` };
    }
  };

  // Animated styles
  const animatedStyles = {
    opacity: 1,
    transform: "translate(0, 0)",
  };

  const getStyleObject = () => {
    return {
      opacity: 0,
      transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`,
      ...(isVisible ? animatedStyles : getInitialStyles()),
    };
  };

  return (
    <div ref={ref} style={getStyleObject()} className={className}>
      {children}
    </div>
  );
}
