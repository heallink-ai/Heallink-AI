"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// Component imports
import MobileSidebar from "@/app/components/dashboard/MobileSidebar";
import Footer from "@/app/components/layout/Footer";
import BottomNavigation from "@/app/components/dashboard/BottomNavigation";
import NeumorphicHeader from "@/app/components/dashboard/NeumorphicHeader";
import BackgroundGradient from "@/app/components/dashboard/BackgroundGradient";
import { NeuProfileHeader } from "@/app/features/profile/components/NeuProfileHeader";
import { NeuProfileInfo } from "@/app/features/profile/components/NeuProfileInfo";
import ProfileMedical from "@/app/features/profile/components/ProfileMedical";
import ProfileSecurity from "@/app/features/profile/components/ProfileSecurity";
import ProfileSettings from "@/app/features/profile/components/ProfileSettings";

// Types
import {
  UserProfileData,
  UserProfileFormData,
} from "@/app/features/profile/types";

// Types for the NeuProfilePage component
interface NeuProfilePageProps {
  profile?: UserProfileData;
  isLoading: boolean;
  error: string | null;
  sidebarOpen: boolean;
  activeTab: string;
  isUploading?: boolean; // Optional now
  onSidebarToggle: () => void;
  onTabChange: (tab: string) => void;
  onProfileUpdate: (data: Partial<UserProfileFormData>) => Promise<boolean>;
  onAvatarUpload?: (file: File) => Promise<void>; // Optional now
  onRefetchProfile: () => void;
}

export default function NeuProfilePage({
  profile,
  isLoading,
  error,
  sidebarOpen,
  activeTab,
  isUploading,
  onSidebarToggle,
  onTabChange,
  onProfileUpdate,
  onAvatarUpload,
  onRefetchProfile,
}: NeuProfilePageProps) {
  // Tab animation variants
  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <main className="min-h-screen bg-background text-foreground pb-0 relative">
      <BackgroundGradient />

      {/* New Neumorphic Header */}
      <NeumorphicHeader
        userData={{
          name: profile?.name || "User",
          avatar: profile?.avatarUrl || "",
          notifications: [],
        }}
        onMenuToggle={onSidebarToggle}
        loading={isLoading}
      />

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && <MobileSidebar onClose={onSidebarToggle} />}
      </AnimatePresence>

      {/* Main content */}
      <div className="pt-24 px-4 max-w-7xl mx-auto relative z-10">
        {/* Profile Header with Avatar Upload */}
        <NeuProfileHeader
          profile={profile || null}
          uploadAvatar={(file: File) => {
            if (onAvatarUpload) {
              onAvatarUpload(file);
            }
            return Promise.resolve(null);
          }}
          isUploading={isUploading || false}
        />
        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 rounded-xl neumorph-pressed bg-red-500/10 text-red-500 mt-6">
            <p className="font-medium">Error loading profile data</p>
            <p className="text-sm">{error}</p>
            <button
              onClick={onRefetchProfile}
              className="mt-2 px-3 py-1 text-xs rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-2 my-8 py-1 px-2 neumorph-card bg-background/30 backdrop-blur-md rounded-xl">
          {["personal", "medical", "security", "settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab
                  ? "bg-gradient-to-r from-purple-heart to-royal-blue text-white shadow-lg"
                  : "text-foreground/70 hover:text-foreground hover:bg-white/5"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={tabVariants}
            className="mb-16"
          >
            {activeTab === "personal" && (
              <NeuProfileInfo profile={profile} onUpdate={onProfileUpdate} />
            )}
            {activeTab === "medical" && (
              <ProfileMedical
                profile={profile}
                onUpdate={onProfileUpdate}
                isLoading={isLoading}
              />
            )}
            {activeTab === "security" && profile ? (
              <ProfileSecurity profile={profile} onUpdate={onProfileUpdate} />
            ) : activeTab === "security" ? (
              <div className="space-y-6 pt-20 sm:pt-12 pb-8">
                <div className="neumorph-card p-8 rounded-xl">
                  <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-primary/10 rounded w-1/3"></div>
                    <div className="h-4 bg-primary/10 rounded w-2/3"></div>
                    <div className="h-32 bg-primary/5 rounded"></div>
                  </div>
                </div>
              </div>
            ) : null}
            {activeTab === "settings" && profile ? (
              <ProfileSettings profile={profile} onUpdate={onProfileUpdate} />
            ) : activeTab === "settings" ? (
              <div className="space-y-6 pt-20 sm:pt-12 pb-8">
                <div className="neumorph-card p-8 rounded-xl">
                  <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-primary/10 rounded w-1/3"></div>
                    <div className="h-4 bg-primary/10 rounded w-2/3"></div>
                    <div className="h-32 bg-primary/5 rounded"></div>
                  </div>
                </div>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
      <Footer />

      {/* Mobile Bottom Navigation */}
      <div className="block md:hidden">
        <BottomNavigation />
      </div>
    </main>
  );
}
