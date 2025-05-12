"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function BackgroundAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = clientX / window.innerWidth;
      const y = clientY / window.innerHeight;
      
      const blobs = container.querySelectorAll('.blob');
      blobs.forEach((blob, index) => {
        const el = blob as HTMLElement;
        const speed = index % 2 === 0 ? 20 : -20;
        const offsetX = (x - 0.5) * speed;
        const offsetY = (y - 0.5) * speed;
        
        el.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        className="blob absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 dark:opacity-10 bg-purple-heart top-[-300px] left-[-200px] z-0"
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
        className="blob absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-15 dark:opacity-10 bg-royal-blue bottom-[-200px] right-[-100px] z-0"
        animate={{
          x: [0, -40, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      
      <motion.div
        className="blob absolute w-[400px] h-[400px] rounded-full blur-[80px] opacity-10 dark:opacity-5 bg-biloba-flower top-[40%] right-[20%] z-0"
        animate={{
          x: [0, 50, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </div>
  );
}