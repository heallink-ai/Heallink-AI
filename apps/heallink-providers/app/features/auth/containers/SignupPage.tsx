"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Zap, Settings, Plus } from "lucide-react";

import { SignupFormContainer } from "./SignupFormContainer";
import { LogoSection } from "../components/LogoSection";
import { ThemeToggle } from "../components/ThemeToggle";

export function SignupPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration errors
  useEffect(() => {
    setMounted(true);
    
    // Check if provider is logged in
    const provider = localStorage.getItem('provider');
    if (provider) {
      router.push('/dashboard');
    }
  }, [router]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[color:var(--background)] relative">
      {/* Theme Toggle */}
      <ThemeToggle />
      
      {/* Left panel (decorative) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-heart/5 to-royal-blue/5 p-8 relative overflow-hidden">
        {/* Animated background elements */}
        <motion.div 
          className="absolute -top-40 -left-40 w-96 h-96 bg-purple-heart/20 rounded-full filter blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-royal-blue/20 rounded-full filter blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        />
        <motion.div 
          className="absolute top-20 right-20 w-32 h-32 bg-biloba-flower/30 rounded-full filter blur-2xl"
          animate={{ 
            x: [0, 20, 0],
            y: [0, -15, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        <div className="relative z-10 flex flex-col justify-between w-full h-full">
          {/* Logo and branding */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <LogoSection />
          </motion.div>

          {/* Main illustration area */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <motion.div 
              className="max-w-lg w-full text-center mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-4xl font-bold text-[color:var(--foreground)] mb-4">
                Join the Future of
                <span className="gradient-text block">Healthcare Delivery</span>
              </h2>
              <p className="text-lg text-[color:var(--muted-foreground)] leading-relaxed">
                Transform your practice with cutting-edge tools, seamless patient management, and intelligent insights.
              </p>
            </motion.div>

            {/* Feature illustration */}
            <motion.div 
              className="relative w-80 h-80 neumorph-card rounded-3xl p-8 mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <motion.div
                  animate={{ 
                    rotateY: [0, 180, 360],
                  }}
                  transition={{ 
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Plus className="w-32 h-32 text-purple-heart opacity-80" />
                </motion.div>
              </div>
              <motion.div 
                className="absolute -top-2 -right-2 w-6 h-6 bg-purple-heart rounded-full"
                animate={{ 
                  scale: [1, 1.4, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div 
                className="absolute -bottom-2 -left-2 w-4 h-4 bg-royal-blue rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [360, 180, 0]
                }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              />
            </motion.div>
          </div>

          {/* Provider benefits */}
          <motion.div 
            className="grid grid-cols-3 gap-3"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.div 
              className="neumorph-card p-3 rounded-xl text-center"
              whileHover={{ scale: 1.1, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex justify-center mb-2">
                <Shield className="w-6 h-6 text-purple-heart" />
              </div>
              <h3 className="font-medium text-xs text-[color:var(--foreground)]">Secure</h3>
              <p className="text-xs text-[color:var(--muted-foreground)] mt-1">HIPAA Compliant</p>
            </motion.div>

            <motion.div 
              className="neumorph-card p-3 rounded-xl text-center"
              whileHover={{ scale: 1.1, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex justify-center mb-2">
                <Zap className="w-6 h-6 text-royal-blue" />
              </div>
              <h3 className="font-medium text-xs text-[color:var(--foreground)]">Fast</h3>
              <p className="text-xs text-[color:var(--muted-foreground)] mt-1">AI-Powered</p>
            </motion.div>

            <motion.div 
              className="neumorph-card p-3 rounded-xl text-center"
              whileHover={{ scale: 1.1, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex justify-center mb-2">
                <Settings className="w-6 h-6 text-havelock-blue" />
              </div>
              <h3 className="font-medium text-xs text-[color:var(--foreground)]">Simple</h3>
              <p className="text-xs text-[color:var(--muted-foreground)] mt-1">Easy Setup</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Right panel (signup form) */}
      <div className="w-full lg:w-1/2 flex flex-col p-6 md:p-10 lg:p-16">
        <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
          {/* Mobile only logo */}
          <div className="flex lg:hidden justify-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <LogoSection />
            </motion.div>
          </div>

          <div className="my-auto">
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-3xl font-bold mb-3 text-[color:var(--foreground)]">
                Create Your Provider Account
              </h1>
              <p className="text-[color:var(--muted-foreground)]">
                Join thousands of healthcare providers using Heallink to deliver exceptional patient care
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <SignupFormContainer />
            </motion.div>
          </div>

          <motion.div 
            className="mt-8 pt-6 border-t border-[color:var(--border)] text-xs text-center text-[color:var(--muted-foreground)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <p>
              &copy; {new Date().getFullYear()} Heallink Healthcare. All rights reserved.
            </p>
            <div className="flex justify-center gap-4 mt-2">
              <a
                href="/legal/privacy"
                className="hover:text-[color:var(--foreground)] transition-colors"
              >
                Privacy
              </a>
              <a
                href="/legal/terms"
                className="hover:text-[color:var(--foreground)] transition-colors"
              >
                Terms
              </a>
              <a
                href="/contact"
                className="hover:text-[color:var(--foreground)] transition-colors"
              >
                Contact
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}