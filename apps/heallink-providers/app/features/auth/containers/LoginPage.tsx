"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, UserCheck, Activity } from "lucide-react";

import { LoginFormContainer } from "./LoginFormContainer";
import { LogoSection } from "../components/LogoSection";
import { ThemeToggle } from "../components/ThemeToggle";

export function LoginPage() {
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
            duration: 8,
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
            duration: 6,
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

          {/* Main content */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <motion.div 
              className="max-w-md w-full text-center mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-4xl font-bold text-[color:var(--foreground)] mb-4">
                Welcome Back to
                <span className="gradient-text block">Heallink Providers</span>
              </h2>
              <p className="text-lg text-[color:var(--muted-foreground)]">
                Your trusted platform for managing patient care and practice operations
              </p>
            </motion.div>

            {/* Feature highlights */}
            <motion.div 
              className="grid grid-cols-1 gap-4 w-full max-w-md"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.div 
                className="neumorph-card p-4 rounded-xl flex items-center gap-4"
                whileHover={{ scale: 1.02, x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="p-3 rounded-lg bg-gradient-to-br from-purple-heart/10 to-royal-blue/10">
                  <Shield className="w-6 h-6 text-purple-heart" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-[color:var(--foreground)]">HIPAA Compliant</h3>
                  <p className="text-sm text-[color:var(--muted-foreground)]">Your data is secure and protected</p>
                </div>
              </motion.div>

              <motion.div 
                className="neumorph-card p-4 rounded-xl flex items-center gap-4"
                whileHover={{ scale: 1.02, x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="p-3 rounded-lg bg-gradient-to-br from-royal-blue/10 to-havelock-blue/10">
                  <UserCheck className="w-6 h-6 text-royal-blue" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-[color:var(--foreground)]">Patient Management</h3>
                  <p className="text-sm text-[color:var(--muted-foreground)]">Streamline your practice workflow</p>
                </div>
              </motion.div>

              <motion.div 
                className="neumorph-card p-4 rounded-xl flex items-center gap-4"
                whileHover={{ scale: 1.02, x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="p-3 rounded-lg bg-gradient-to-br from-havelock-blue/10 to-portage/10">
                  <Activity className="w-6 h-6 text-havelock-blue" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-[color:var(--foreground)]">Real-time Analytics</h3>
                  <p className="text-sm text-[color:var(--muted-foreground)]">Track your practice performance</p>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.div 
            className="text-center text-sm text-[color:var(--muted-foreground)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p>Trusted by thousands of healthcare providers nationwide</p>
          </motion.div>
        </div>
      </div>

      {/* Right panel (login form) */}
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
                Sign in to your account
              </h1>
              <p className="text-[color:var(--muted-foreground)]">
                Access your provider dashboard and manage your practice
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <LoginFormContainer />
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