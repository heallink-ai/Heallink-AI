"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// Component imports
import BackgroundGradient from "@/app/components/dashboard/BackgroundGradient";
import NeumorphicHeader from "@/app/components/dashboard/NeumorphicHeader";
import MobileSidebar from "@/app/components/dashboard/MobileSidebar";
import Footer from "@/app/components/layout/Footer";
import BottomNavigation from "@/app/components/dashboard/BottomNavigation";
import ProfileInfo from "@/app/features/profile/components/ProfileInfo";
import ProfileSettings from "@/app/features/profile/components/ProfileSettings";
import ProfileMedical from "@/app/features/profile/components/ProfileMedical";
import ProfileSecurity from "@/app/features/profile/components/ProfileSecurity";
import { ProfileAvatarUpload } from "@/app/features/profile/components/ProfileAvatarUpload";

// Types
import {
  UserProfileData,
  UserProfileFormData,
} from "@/app/features/profile/types";

// Utility to create skeleton elements
const Skeleton = ({ className }: { className?: string }) => (
  <span
    className={`inline-block animate-pulse bg-primary/10 rounded-lg ${className}`}
  ></span>
);

// Types for the ProfilePage component
interface ProfilePageProps {
  profile?: UserProfileData;
  isLoading: boolean;
  error: string | null;
  userData: {
    name: string;
    avatar: string;
    notifications: Array<{
      id: number;
      type: "appointment" | "message" | "payment";
      message: string;
      time: string;
    }>;
  };
  sidebarOpen: boolean;
  activeTab: string;
  isUploading: boolean;
  onSidebarToggle: () => void;
  onTabChange: (tab: string) => void;
  onProfileUpdate: (data: Partial<UserProfileFormData>) => Promise<boolean>;
  onAvatarUpload: (file: File) => Promise<void>;
  onRefetchProfile: () => void;
}

export default function ProfilePage({
  profile,
  isLoading,
  error,
  userData,
  sidebarOpen,
  activeTab,
  isUploading,
  onSidebarToggle,
  onTabChange,
  onProfileUpdate,
  onAvatarUpload,
  onRefetchProfile,
}: ProfilePageProps) {
  // Skeleton avatar upload component for loading state
  const SkeletonAvatarUpload = () => (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="h-28 w-28 rounded-full overflow-hidden shadow-lg">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
      <Skeleton className="mt-3 h-5 w-32" />
    </div>
  );

  // Skeleton tab content
  const SkeletonTabContent = () => (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-5 w-64" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-12 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-12 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
  );

  return (
    <main className="min-h-screen bg-background text-foreground pb-0 relative">
      <BackgroundGradient />

      {/* Header */}
      <NeumorphicHeader
        userData={userData}
        onMenuToggle={onSidebarToggle}
        loading={isLoading}
      />

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && <MobileSidebar onClose={onSidebarToggle} />}
      </AnimatePresence>

      {/* Main content */}
      <div className="pt-28 pb-24 md:pb-0 px-4 max-w-7xl mx-auto relative z-10">
        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 rounded-xl neumorph-pressed bg-red-500/10 text-red-500">
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

        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Avatar Upload Section */}
            <div className="order-1 md:order-none">
              {isLoading ? (
                <SkeletonAvatarUpload />
              ) : profile ? (
                <ProfileAvatarUpload
                  avatarUrl={profile.avatarUrl}
                  name={profile.name}
                  onAvatarChange={onAvatarUpload}
                  isUploading={isUploading}
                />
              ) : (
                <SkeletonAvatarUpload />
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center md:text-left">
                {isLoading ? (
                  <Skeleton className="w-40 h-8" />
                ) : (
                  <>
                    <span className="gradient-text">My Profile</span>
                  </>
                )}
              </h1>
              <div className="text-foreground/60 text-center md:text-left">
                {isLoading ? (
                  <Skeleton className="w-64 h-5" />
                ) : (
                  "Manage your account settings and preferences"
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group flex items-center gap-2 py-2 px-4 rounded-xl neumorph-button bg-primary/5 hover:bg-primary/10 text-foreground transition-all duration-300"
                onClick={onRefetchProfile}
                disabled={isLoading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`${isLoading ? "animate-spin" : ""}`}
                >
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                  <path d="M16 21h5v-5" />
                </svg>
                <span>Refresh</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left Sidebar - Navigation */}
          <div className="md:col-span-1">
            <div className="neumorph-card p-4 rounded-xl">
              <ul className="space-y-1">
                {isLoading ? (
                  <>
                    <li>
                      <Skeleton className="w-full h-12" />
                    </li>
                    <li>
                      <Skeleton className="w-full h-12" />
                    </li>
                    <li>
                      <Skeleton className="w-full h-12" />
                    </li>
                    <li>
                      <Skeleton className="w-full h-12" />
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <button
                        onClick={() => onTabChange("personal")}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          activeTab === "personal"
                            ? "neumorph-pressed bg-primary/5 text-primary"
                            : "hover:bg-primary/5"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        <span>Personal Info</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => onTabChange("medical")}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          activeTab === "medical"
                            ? "neumorph-pressed bg-primary/5 text-primary"
                            : "hover:bg-primary/5"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                          <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
                        </svg>
                        <span>Medical Info</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => onTabChange("settings")}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          activeTab === "settings"
                            ? "neumorph-pressed bg-primary/5 text-primary"
                            : "hover:bg-primary/5"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        <span>Preferences</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => onTabChange("security")}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          activeTab === "security"
                            ? "neumorph-pressed bg-primary/5 text-primary"
                            : "hover:bg-primary/5"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            width="18"
                            height="11"
                            x="3"
                            y="11"
                            rx="2"
                            ry="2"
                          />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <span>Security</span>
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="md:col-span-3">
            <div className="neumorph-card p-6 rounded-xl">
              {isLoading || !profile ? (
                <SkeletonTabContent />
              ) : (
                (() => {
                  switch (activeTab) {
                    case "personal":
                      return (
                        <ProfileInfo
                          profile={profile}
                          onUpdate={onProfileUpdate}
                        />
                      );
                    case "medical":
                      return (
                        <ProfileMedical
                          profile={profile}
                          onUpdate={onProfileUpdate}
                        />
                      );
                    case "settings":
                      return (
                        <ProfileSettings
                          profile={profile}
                          onUpdate={onProfileUpdate}
                        />
                      );
                    case "security":
                      return (
                        <ProfileSecurity
                          profile={profile}
                          onUpdate={onProfileUpdate}
                        />
                      );
                    default:
                      return (
                        <ProfileInfo
                          profile={profile}
                          onUpdate={onProfileUpdate}
                        />
                      );
                  }
                })()
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer for desktop */}
      <div className="hidden md:block">
        <Footer />
      </div>

      {/* Bottom Navigation for mobile */}
      <div className="block md:hidden">
        <BottomNavigation unreadMessages={3} />
      </div>
    </main>
  );
}
