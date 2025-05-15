"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/app/theme/ThemeProvider";
import Link from "next/link";
import Image from "next/image";

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

// Icons
import {
  User,
  Settings,
  Shield,
  HeartPulse,
  Calendar,
  History,
  Bell,
  FileEdit,
  Lock,
  Camera,
  Upload,
  ChevronUp,
  ChevronDown,
  Trash,
} from "lucide-react";

// Mock data
import { mockUserProfile } from "@/app/features/profile/mockData";

export default function ProfilePage() {
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal");
  const [isUploadMenuOpen, setIsUploadMenuOpen] = useState(false);
  const [profile, setProfile] = useState(mockUserProfile);

  // Shadow color based on theme
  const shadowColor =
    theme === "dark" ? "rgba(0, 0, 0, 0.35)" : "rgba(0, 0, 0, 0.15)";

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Tabs configuration
  const tabs = [
    { id: "personal", label: "Personal Info", icon: <User size={18} /> },
    {
      id: "medical",
      label: "Medical Information",
      icon: <HeartPulse size={18} />,
    },
    { id: "settings", label: "Account Settings", icon: <Settings size={18} /> },
    { id: "security", label: "Security", icon: <Shield size={18} /> },
  ];

  // Mock user data for header
  const userData = {
    name: profile.name,
    avatar: profile.avatarUrl || "",
    notifications: [
      {
        id: 1,
        type: "appointment",
        message: "Appointment with Dr. Williams tomorrow",
        time: "1 hour ago",
      },
    ],
  };

  // Skeleton loader
  const Skeleton = ({ className }: { className?: string }) => (
    <div
      className={`animate-pulse bg-primary/10 rounded-lg ${className}`}
    ></div>
  );

  // Handle profile update
  const handleProfileUpdate = async (data: any) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setProfile((prev) => ({ ...prev, ...data }));
    return true;
  };

  // Tab content mapping
  const tabContent = {
    personal: <ProfileInfo profile={profile} onUpdate={handleProfileUpdate} />,
    medical: (
      <ProfileMedical profile={profile} onUpdate={handleProfileUpdate} />
    ),
    settings: (
      <ProfileSettings profile={profile} onUpdate={handleProfileUpdate} />
    ),
    security: (
      <ProfileSecurity profile={profile} onUpdate={handleProfileUpdate} />
    ),
  };

  return (
    <main className="min-h-screen bg-background text-foreground pb-0 relative">
      <BackgroundGradient />

      {/* Header */}
      <NeumorphicHeader
        userData={userData}
        onMenuToggle={() => setSidebarOpen(true)}
        loading={loading}
      />

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && <MobileSidebar onClose={() => setSidebarOpen(false)} />}
      </AnimatePresence>

      {/* Main content */}
      <div className="pt-28 pb-24 md:pb-0 px-4 max-w-7xl mx-auto relative z-10">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          {loading ? (
            <Skeleton className="h-64 w-full rounded-3xl" />
          ) : (
            <div
              className="rounded-3xl overflow-hidden relative neumorph-card hover:transform-none"
              style={{
                boxShadow: `0 20px 40px ${shadowColor}`,
              }}
            >
              {/* Cover Photo with Gradient Overlay */}
              <div className="h-40 md:h-64 w-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-[url('/images/profile-cover.jpg')] bg-center bg-cover"></div>
              </div>

              {/* Profile Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20">
                <div className="flex flex-col md:flex-row items-center md:items-end gap-4">
                  {/* Avatar Section */}
                  <div className="relative">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden border-4 border-card shadow-lg relative neumorph-flat">
                      {profile.avatarUrl ? (
                        <Image
                          src={profile.avatarUrl}
                          alt={profile.name}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                          <User size={40} className="text-primary" />
                        </div>
                      )}

                      {/* Camera Upload Button */}
                      <div className="absolute bottom-2 right-2">
                        <div className="relative">
                          <button
                            onClick={() =>
                              setIsUploadMenuOpen(!isUploadMenuOpen)
                            }
                            className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
                          >
                            <Camera size={14} />
                          </button>

                          {/* Upload Menu Dropdown */}
                          <AnimatePresence>
                            {isUploadMenuOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                className="absolute bottom-full right-0 mb-2 bg-card border border-border rounded-lg shadow-lg p-2 w-48"
                                style={{
                                  boxShadow: `0 10px 15px ${shadowColor}`,
                                }}
                              >
                                <div className="flex flex-col gap-1">
                                  <button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary/10 text-sm">
                                    <Upload size={14} />
                                    <span>Upload Photo</span>
                                  </button>
                                  <button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary/10 text-sm">
                                    <Camera size={14} />
                                    <span>Take Photo</span>
                                  </button>
                                  <button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-red-500/10 text-red-500 text-sm">
                                    <Trash size={14} />
                                    <span>Remove Photo</span>
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* User Details */}
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                      {profile.name}
                    </h1>
                    <div className="text-muted-foreground">
                      <div className="mb-1">
                        {profile.email} • {profile.phone}
                      </div>
                      <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          <User size={12} />
                          {profile.role}
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">
                          <Shield size={12} />
                          Account Verified
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-medium">
                          <Calendar size={12} />
                          Member since {new Date(profile.created).getFullYear()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm flex items-center gap-2 shadow-lg hover:bg-primary/90 transition-colors"
                    >
                      <FileEdit size={16} />
                      <span>Edit Profile</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Tabs Navigation */}
        <div className="overflow-x-auto md:overflow-visible">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex space-x-1 md:space-x-2 mb-6 pb-2 md:pb-0 min-w-max"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all relative
                  ${
                    activeTab === tab.id
                      ? "text-foreground neumorph-button"
                      : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                  }`}
                style={
                  activeTab === tab.id
                    ? {
                        boxShadow: `0 8px 16px ${shadowColor}`,
                      }
                    : {}
                }
              >
                {tab.icon}
                <span>{tab.label}</span>

                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-primary to-secondary rounded-t-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-10"
        >
          {loading ? (
            <div className="space-y-6">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
              >
                {tabContent[activeTab as keyof typeof tabContent]}
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <BottomNavigation />

      {/* Footer */}
      <Footer />
    </main>
  );
}
