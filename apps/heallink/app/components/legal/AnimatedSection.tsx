"use client";

import { useRef, useEffect } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

interface AnimatedSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export default function AnimatedSection({ 
  title, 
  icon, 
  children, 
  delay = 0,
  className = "" 
}: AnimatedSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      className={`rounded-xl bg-card p-6 neumorph-flat ${className}`}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { 
          opacity: 1, 
          y: 0, 
          transition: { 
            type: "spring", 
            damping: 25, 
            stiffness: 100, 
            delay 
          } 
        }
      }}
      initial="hidden"
      animate={controls}
    >
      <div className="flex items-center mb-4 gap-3">
        {icon && (
          <motion.div
            className="text-primary"
            variants={{
              hidden: { opacity: 0, scale: 0.6, rotate: -20 },
              visible: { 
                opacity: 1, 
                scale: 1, 
                rotate: 0,
                transition: { 
                  type: "spring", 
                  damping: 10, 
                  stiffness: 100, 
                  delay: delay + 0.2 
                } 
              }
            }}
            initial="hidden"
            animate={controls}
          >
            {icon}
          </motion.div>
        )}
        <motion.h2 
          className="text-2xl font-semibold gradient-text"
          variants={{
            hidden: { opacity: 0, x: -20 },
            visible: { 
              opacity: 1, 
              x: 0,
              transition: { 
                delay: delay + 0.3, 
                duration: 0.5 
              } 
            }
          }}
          initial="hidden"
          animate={controls}
        >
          {title}
        </motion.h2>
      </div>
      
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: { 
              delay: delay + 0.4, 
              duration: 0.5 
            } 
          }
        }}
        initial="hidden"
        animate={controls}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}