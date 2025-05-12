"use client";

import { useRef, useEffect } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

export default function Divider() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const controls = useAnimation();
  
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);
  
  return (
    <div ref={ref} className="relative h-24 flex items-center justify-center my-8">
      <motion.div
        className="absolute left-0 w-1/3 h-0.5 bg-gradient-to-r from-transparent to-primary/50"
        variants={{
          hidden: { width: 0, opacity: 0 },
          visible: { 
            width: "33%", 
            opacity: 1, 
            transition: { duration: 0.8, ease: "easeOut" } 
          }
        }}
        initial="hidden"
        animate={controls}
      />
      
      <motion.div
        className="w-10 h-10 rounded-full flex items-center justify-center bg-card neumorph-flat z-10"
        variants={{
          hidden: { scale: 0, rotate: -90 },
          visible: { 
            scale: 1, 
            rotate: 0, 
            transition: { 
              delay: 0.4, 
              type: "spring", 
              stiffness: 200, 
              damping: 10 
            } 
          }
        }}
        initial="hidden"
        animate={controls}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="w-5 h-5 text-primary"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </motion.div>
      
      <motion.div
        className="absolute right-0 w-1/3 h-0.5 bg-gradient-to-l from-transparent to-primary/50"
        variants={{
          hidden: { width: 0, opacity: 0 },
          visible: { 
            width: "33%", 
            opacity: 1, 
            transition: { duration: 0.8, ease: "easeOut" } 
          }
        }}
        initial="hidden"
        animate={controls}
      />
    </div>
  );
}