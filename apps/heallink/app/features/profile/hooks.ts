import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  UserProfileData,
  UserProfileFormData,
  ProfileUpdateStatus,
} from "./types";
import {
  fetchUserProfile,
  updateUserProfile,
  uploadProfilePicture,
} from "./api";
import { mockUserProfile } from "./mockData";

export function useUserProfile() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateStatus, setUpdateStatus] = useState<ProfileUpdateStatus>("idle");
  const [uploadStatus, setUploadStatus] = useState<ProfileUpdateStatus>("idle");

  // Fetch user profile data
  const loadProfile = useCallback(async () => {
    if (!userId) {
      // Use mock data if no user ID is available
      setProfile(mockUserProfile);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // COMMENT THIS OUT FOR DEMO AND USE MOCK DATA INSTEAD
    // try {
    //   const response = await fetchUserProfile(userId);

    //   if (response.error) {
    //     setError(response.error);
    //   } else if (response.data) {
    //     setProfile(response.data);
    //   }
    // } catch (err) {
    //   setError("Failed to load profile data");
    //   console.error(err);
    // } finally {
    //   setLoading(false);
    // }

    // Use mock data for demo
    setTimeout(() => {
      setProfile(mockUserProfile);
      setLoading(false);
    }, 1000); // Add a delay to simulate loading
  }, [userId]);

  // Update user profile
  const updateProfile = useCallback(async (formData: UserProfileFormData) => {
    // Simulate profile update with mock data
    setUpdateStatus("loading");

    // Simulate API call with delay
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        // Update the profile with the form data
        setProfile((prev) => {
          if (!prev) return mockUserProfile;

          // Ensure proper typing for communicationPreferences
          // by providing default values for all required boolean fields
          const updatedProfile: UserProfileData = {
            ...prev,
            ...formData,
            // Preserve nested objects by merging them
            address: { ...prev.address, ...formData.address },
            emergencyContact: {
              ...prev.emergencyContact,
              ...formData.emergencyContact,
            },
            insurance: { ...prev.insurance, ...formData.insurance },
            communicationPreferences: {
              // Default values ensure properties are never undefined
              email: true,
              sms: true,
              push: true,
              // Merge with existing preferences
              ...(prev.communicationPreferences || {}),
              // Override with form values if provided
              ...(formData.communicationPreferences || {}),
            },
          };

          return updatedProfile;
        });

        setUpdateStatus("success");
        resolve(true);
      }, 1500); // Simulate network delay
    });
  }, []);

  // Upload profile picture
  const uploadAvatar = useCallback(async (file: File) => {
    setUploadStatus("loading");

    // Simulate file upload with delay
    return new Promise<string | null>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;

        // Simulate network delay
        setTimeout(() => {
          // Update profile with the new avatar URL (in this case, the Data URL)
          setProfile((prev) => (prev ? { ...prev, avatarUrl: dataUrl } : null));
          setUploadStatus("success");
          resolve(dataUrl);
        }, 1500);
      };

      reader.onerror = () => {
        setUploadStatus("error");
        setError("Failed to upload profile picture");
        resolve(null);
      };

      reader.readAsDataURL(file);
    });
  }, []);

  // Reset status states
  const resetStatus = useCallback(() => {
    setUpdateStatus("idle");
    setUploadStatus("idle");
    setError(null);
  }, []);

  // Load profile on initial mount and when userId changes
  useEffect(() => {
    // Always load profile, even without userId (will use mock data)
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    loading,
    error,
    updateStatus,
    uploadStatus,
    updateProfile,
    uploadAvatar,
    loadProfile,
    resetStatus,
  };
}
