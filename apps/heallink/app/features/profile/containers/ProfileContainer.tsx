"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";

// Types
import { UserProfileFormData } from "@/app/features/profile/types";

// Hooks
import {
  useCurrentUserProfile,
  useUpdateUserProfile,
  useUploadProfilePicture,
} from "@/app/hooks/useUserApi";

// Presentation components
import ProfilePage from "../components/ProfilePage";

export default function ProfileContainer() {
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

  // Format error message
  const error = profileError
    ? typeof profileError === "object" && profileError.message
      ? profileError.message
      : "Failed to load profile data"
    : null;

  // User data for header - only use available data, no fallbacks
  const userData = {
    name: profile?.name || "",
    avatar: profile?.avatarUrl || "",
    notifications: [
      {
        id: 1,
        type: "appointment" as const,
        message: "Appointment with Dr. Williams tomorrow",
        time: "1 hour ago",
      },
    ],
  };

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

  // Handler for sidebar toggle
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handler for tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <ProfilePage
      profile={profile}
      isLoading={isLoading}
      error={error}
      userData={userData}
      sidebarOpen={sidebarOpen}
      activeTab={activeTab}
      isUploading={isUploading}
      onSidebarToggle={handleSidebarToggle}
      onTabChange={handleTabChange}
      onProfileUpdate={handleProfileUpdate}
      onAvatarUpload={handleAvatarUpload}
      onRefetchProfile={refetchProfile}
    />
  );
}
