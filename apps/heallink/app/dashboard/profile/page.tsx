"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

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

// Icons
import { User, Settings, Shield, HeartPulse } from "lucide-react";

// API & Types
import { UserProfileFormData } from "@/app/features/profile/types";
import {
  useCurrentUserProfile,
  useUpdateUserProfile,
  useUploadProfilePicture,
} from "@/app/hooks/useUserApi";

// Mock data for fallback
import { mockUserProfile } from "@/app/features/profile/mockData";

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [isUploading, setIsUploading] = useState(false);

  // React Query hooks for profile data
  const {
    data: profile,
    isLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useCurrentUserProfile();

  const { mutate: updateProfile } = useUpdateUserProfile();

  const { mutate: uploadAvatar } = useUploadProfilePicture();

  // Use profile data or fallback to mock data
  const profileData = profile || mockUserProfile;

  // Format error message
  const error = profileError
    ? typeof profileError === "object" && profileError.message
      ? profileError.message
      : "Failed to load profile data"
    : null;

  // Mock user data for header
  const userData = {
    name: profileData.name,
    avatar: profileData.avatarUrl || "",
    notifications: [
      {
        id: 1,
        type: "appointment" as const,
        message: "Appointment with Dr. Williams tomorrow",
        time: "1 hour ago",
      },
    ],
  };

  // Skeleton loader
  const Skeleton = ({ className }: { className?: string }) => (
    <span
      className={`inline-block animate-pulse bg-primary/10 rounded-lg ${className}`}
    ></span>
  );

  // Handle profile update
  const handleProfileUpdate = async (data: Partial<UserProfileFormData>) => {
    try {
      updateProfile(data, {
        onSuccess: () => {
          toast.success("Profile updated successfully");
          return true;
        },
        onError: (error) => {
          console.error("Error updating profile:", error);
          toast.error("Failed to update profile");
          return false;
        },
      });
      return true;
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
      return false;
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (file: File) => {
    setIsUploading(true);
    try {
      uploadAvatar(file, {
        onSuccess: () => {
          toast.success("Profile picture updated successfully");
          refetchProfile(); // Refresh profile data
        },
        onError: (error) => {
          console.error("Failed to upload avatar:", error);
          toast.error("Failed to upload profile picture");
        },
        onSettled: () => {
          setIsUploading(false);
        },
      });
    } catch (error) {
      console.error("Failed to upload avatar:", error);
      toast.error("Failed to upload profile picture");
      setIsUploading(false);
    }
  };

  // Tab content mapping
  const tabContent = {
    personal: (
      <ProfileInfo profile={profileData} onUpdate={handleProfileUpdate} />
    ),
    medical: (
      <ProfileMedical profile={profileData} onUpdate={handleProfileUpdate} />
    ),
    settings: (
      <ProfileSettings profile={profileData} onUpdate={handleProfileUpdate} />
    ),
    security: (
      <ProfileSecurity profile={profileData} onUpdate={handleProfileUpdate} />
    ),
  };

  return (
    <main className="min-h-screen bg-background text-foreground pb-0 relative">
      <BackgroundGradient />

      {/* Header */}
      <NeumorphicHeader
        userData={userData}
        onMenuToggle={() => setSidebarOpen(true)}
        loading={isLoading}
      />

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && <MobileSidebar onClose={() => setSidebarOpen(false)} />}
      </AnimatePresence>

      {/* Main content */}
      <div className="pt-28 pb-24 md:pb-0 px-4 max-w-7xl mx-auto relative z-10">
        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 rounded-xl neumorph-pressed bg-red-500/10 text-red-500">
            <p className="font-medium">Error loading profile data</p>
            <p className="text-sm">{error}</p>
            <button
              onClick={() => refetchProfile()}
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
              <ProfileAvatarUpload
                avatarUrl={profileData.avatarUrl}
                name={profileData.name}
                onAvatarChange={handleAvatarUpload}
                isUploading={isUploading}
              />
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
                onClick={() => {
                  refetchProfile();
                  toast.success("Profile refreshed");
                }}
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
                <li>
                  <button
                    onClick={() => setActiveTab("personal")}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      activeTab === "personal"
                        ? "neumorph-pressed bg-primary/5 text-primary"
                        : "hover:bg-primary/5"
                    }`}
                  >
                    <User size={18} />
                    <span>Personal Info</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("medical")}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      activeTab === "medical"
                        ? "neumorph-pressed bg-primary/5 text-primary"
                        : "hover:bg-primary/5"
                    }`}
                  >
                    <HeartPulse size={18} />
                    <span>Medical Info</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      activeTab === "settings"
                        ? "neumorph-pressed bg-primary/5 text-primary"
                        : "hover:bg-primary/5"
                    }`}
                  >
                    <Settings size={18} />
                    <span>Preferences</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("security")}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      activeTab === "security"
                        ? "neumorph-pressed bg-primary/5 text-primary"
                        : "hover:bg-primary/5"
                    }`}
                  >
                    <Shield size={18} />
                    <span>Security</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="md:col-span-3">
            <div className="neumorph-card p-6 rounded-xl">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="w-full h-8" />
                  <Skeleton className="w-3/4 h-6" />
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="w-full h-12" />
                    <Skeleton className="w-full h-12" />
                  </div>
                  <Skeleton className="w-full h-12" />
                  <Skeleton className="w-full h-32" />
                </div>
              ) : (
                tabContent[activeTab as keyof typeof tabContent]
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
