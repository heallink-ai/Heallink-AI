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
import NeuProfilePage from "../components/NeuProfilePage";

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

  // Handle profile update
  const handleProfileUpdate = async (data: Partial<UserProfileFormData>) => {
    try {
      // Filter out any empty fields before sending to the API
      const filteredData: Partial<UserProfileFormData> = { ...data };

      // Handle empty strings at root level
      Object.keys(filteredData).forEach((key) => {
        const value = filteredData[key as keyof UserProfileFormData];
        if (value === "" || value === null || value === undefined) {
          delete filteredData[key as keyof UserProfileFormData];
        }
      });

      // Handle empty address fields
      if (filteredData.address) {
        const address = { ...filteredData.address };
        let hasValidAddressField = false;

        Object.keys(address).forEach((key) => {
          const value = address[key as keyof typeof address];
          if (value === "" || value === null || value === undefined) {
            delete address[key as keyof typeof address];
          } else {
            hasValidAddressField = true;
          }
        });

        if (!hasValidAddressField) {
          delete filteredData.address;
        } else {
          filteredData.address = address;
        }
      }

      // Handle empty emergency contact fields
      if (filteredData.emergencyContact) {
        const emergencyContact = { ...filteredData.emergencyContact };
        let hasValidEmergencyField = false;

        Object.keys(emergencyContact).forEach((key) => {
          const value = emergencyContact[key as keyof typeof emergencyContact];
          if (value === "" || value === null || value === undefined) {
            delete emergencyContact[key as keyof typeof emergencyContact];
          } else {
            hasValidEmergencyField = true;
          }
        });

        if (!hasValidEmergencyField) {
          delete filteredData.emergencyContact;
        } else {
          filteredData.emergencyContact = emergencyContact;
        }
      }

      // Only make the API call if we have data to update
      if (Object.keys(filteredData).length > 0) {
        updateProfile(filteredData, {
          onSuccess: () => {
            toast.success("Profile updated successfully");
            return true;
          },
          onError: (error: unknown) => {
            console.error("Error updating profile:", error);
            const errorMessage =
              error && typeof error === "object" && "message" in error
                ? String(error.message)
                : "Failed to update profile";
            toast.error(errorMessage);
            return false;
          },
        });
      } else {
        toast.success("No changes to save");
        return false;
      }

      return true;
    } catch (error: unknown) {
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
        onError: (error: unknown) => {
          console.error("Failed to upload avatar:", error);
          toast.error("Failed to upload profile picture");
        },
        onSettled: () => {
          setIsUploading(false);
        },
      });
    } catch (error: unknown) {
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
    <NeuProfilePage
      profile={profile}
      isLoading={isLoading}
      error={error}
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
