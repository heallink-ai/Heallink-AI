"use client";

import { useRef, useEffect } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

interface AnimatedTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function AnimatedTitle({ 
  title, 
  subtitle, 
  className = "" 
}: AnimatedTitleProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const mainControls = useAnimation();
  const slideControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
      slideControls.start("visible");
    }
  }, [isInView, mainControls, slideControls]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Title with staggered letter animation */}
      <motion.h1
        className="text-4xl md:text-5xl xl:text-6xl font-bold gradient-text"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.03 } }
        }}
        initial="hidden"
        animate={mainControls}
      >
        {Array.from(title).map((char, index) => (
          <motion.span
            key={index}
            variants={{
              hidden: { 
                opacity: 0, 
                y: 20 
              },
              visible: { 
                opacity: 1, 
                y: 0, 
                transition: { 
                  type: "spring", 
                  damping: 12, 
                  stiffness: 100 
                } 
              }
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.h1>

      {/* Optional subtitle */}
      {subtitle && (
        <motion.p
          className="light-text-contrast text-lg mt-4"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0, 
              transition: { 
                delay: title.length * 0.03, 
                duration: 0.5 
              } 
            }
          }}
          initial="hidden"
          animate={mainControls}
        >
          {subtitle}
        </motion.p>
      )}

      {/* Animated underline */}
      <motion.div
        className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-purple-heart to-royal-blue"
        variants={{
          hidden: { scaleX: 0, originX: 0 },
          visible: { 
            scaleX: 1, 
            transition: { 
              delay: title.length * 0.03 + 0.2, 
              duration: 0.8, 
              ease: "circOut" 
            } 
          }
        }}
        initial="hidden"
        animate={slideControls}
      />
    </div>
  );
}