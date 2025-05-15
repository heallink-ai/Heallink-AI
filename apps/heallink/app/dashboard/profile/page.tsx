"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { useTheme } from "@/app/theme/ThemeProvider";
import { useUserProfile } from "@/app/features/profile/hooks";
import { MedicalProfileView } from "@/app/features/profile/components/MedicalProfileView";
import { PersonalProfileView } from "@/app/features/profile/components/PersonalProfileView";
import { ProfileHeader } from "@/app/features/profile/components/ProfileHeader";
import { ProfileSkeleton } from "@/app/features/profile/components/ProfileSkeleton";

export default function ProfilePage() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<"personal" | "medical">("personal");
  const { 
    profile, 
    loading, 
    error, 
    updateStatus, 
    uploadStatus, 
    updateProfile, 
    uploadAvatar 
  } = useUserProfile();

  const shadowColor = theme === "dark" 
    ? "rgba(0, 0, 0, 0.3)" 
    : "rgba(0, 0, 0, 0.1)";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  if (error && !loading) {
    return (
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center rounded-2xl bg-red-50 p-8 text-center dark:bg-red-900/20 border border-red-200 dark:border-red-800 max-w-3xl mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-4 text-red-500"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h3 className="mb-2 text-xl font-semibold text-red-700 dark:text-red-400">
            Failed to load profile
          </h3>
          <p className="mb-4 text-red-600 dark:text-red-300">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto pb-12 pt-6">
      <motion.div 
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold">
            <span className="gradient-text">My Health Profile</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your personal and medical information for better healthcare
          </p>
        </motion.div>

        {loading ? (
          <ProfileSkeleton />
        ) : (
          <>
            <motion.div
              variants={itemVariants}
              className="rounded-2xl overflow-hidden"
              style={{
                boxShadow: `0 15px 30px ${shadowColor}`
              }}
            >
              <ProfileHeader 
                profile={profile}
                uploadAvatar={uploadAvatar}
                isUploading={uploadStatus === "loading"}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6">
              <div className="flex border-b border-border">
                <button
                  onClick={() => setActiveTab("personal")}
                  className={`relative px-6 py-3 transition-colors ${
                    activeTab === "personal"
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>Personal Information</span>
                  {activeTab === "personal" && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      initial={false}
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("medical")}
                  className={`relative px-6 py-3 transition-colors ${
                    activeTab === "medical"
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>Medical Information</span>
                  {activeTab === "medical" && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      initial={false}
                    />
                  )}
                </button>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="rounded-2xl p-6 sm:p-8 bg-background"
              style={{
                boxShadow: `0 10px 25px ${shadowColor}`,
              }}
            >
              <AnimatedTabContent activeTab={activeTab}>
                {activeTab === "personal" ? (
                  <PersonalProfileView 
                    profile={profile}
                    isUpdating={updateStatus === "loading"}
                    onUpdate={updateProfile}
                  />
                ) : (
                  <MedicalProfileView 
                    profile={profile}
                    isUpdating={updateStatus === "loading"}
                    onUpdate={updateProfile}
                  />
                )}
              </AnimatedTabContent>
            </motion.div>
          </>
        )}
      </motion.div>
      
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 5000,
          style: {
            borderRadius: '10px',
            background: 'var(--card)',
            color: 'var(--card-foreground)',
            boxShadow: `0 4px 12px ${shadowColor}`,
            border: '1px solid var(--border)',
          },
        }}
      />
    </div>
  );
}

function AnimatedTabContent({ 
  activeTab, 
  children 
}: { 
  activeTab: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      key={activeTab}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}