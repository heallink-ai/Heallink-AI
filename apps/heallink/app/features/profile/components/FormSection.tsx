"use client";

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/app/theme/ThemeProvider';

interface FormSectionProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  initiallyExpanded?: boolean;
}

export const FormSection = ({
  title,
  children,
  icon,
  initiallyExpanded = true,
}: FormSectionProps) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = React.useState(initiallyExpanded);
  
  // Determine neumorphic style based on theme
  const neumorphicStyle = theme === 'dark' 
    ? 'shadow-[6px_6px_12px_#101010,_-6px_-6px_12px_#303030]' 
    : 'shadow-[6px_6px_12px_#cacaca,_-6px_-6px_12px_#ffffff]';

  const expandVariants = {
    expanded: { 
      height: 'auto', 
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    collapsed: { 
      height: 0, 
      opacity: 0,
      transition: { duration: 0.3, ease: 'easeIn' }
    }
  };

  return (
    <div className={`overflow-hidden rounded-xl bg-transparent ${neumorphicStyle}`}>
      <div 
        className="flex cursor-pointer items-center justify-between gap-3 p-5"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-primary">{icon}</span>}
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
        <motion.div
          initial={{ rotate: initiallyExpanded ? 180 : 0 }}
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
          >
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </motion.div>
      </div>
      
      <motion.div
        variants={expandVariants}
        initial={initiallyExpanded ? "expanded" : "collapsed"}
        animate={isExpanded ? "expanded" : "collapsed"}
        className="overflow-hidden"
      >
        <div className="p-5 pt-0">
          {children}
        </div>
      </motion.div>
    </div>
  );
};