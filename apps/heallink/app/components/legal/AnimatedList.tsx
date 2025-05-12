"use client";

import { useRef, useEffect } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

interface AnimatedListProps {
  items: string[];
  delay?: number;
  className?: string;
}

export default function AnimatedList({ 
  items, 
  delay = 0,
  className = "" 
}: AnimatedListProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <ul 
      ref={ref} 
      className={`list-disc pl-6 space-y-2 light-text-contrast ${className}`}
    >
      {items.map((item, index) => (
        <motion.li
          key={index}
          variants={{
            hidden: { opacity: 0, x: -20 },
            visible: { 
              opacity: 1, 
              x: 0, 
              transition: { 
                delay: delay + index * 0.1, 
                duration: 0.5 
              } 
            }
          }}
          initial="hidden"
          animate={controls}
        >
          {item}
        </motion.li>
      ))}
    </ul>
  );
}