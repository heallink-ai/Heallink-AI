import { useMutation, useQuery } from "@tanstack/react-query";
import { UserProfileData } from "@/app/features/profile/types";
import { fetchApi } from "@/app/api/apiClient";

// Define a type for the backend user data format
interface BackendUserData {
  _id: string;
  name?: string;
  email: string;
  phone?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  avatarUrl?: string;
  role: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other" | "prefer-not-to-say";
  createdAt: string;
  updatedAt: string;
  address?: {
    streetAddress?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phone?: string;
  };
  medicalInformation?: {
    bloodType?:
      | "A+"
      | "A-"
      | "B+"
      | "B-"
      | "AB+"
      | "AB-"
      | "O+"
      | "O-"
      | "unknown";
    allergies?: string[];
    medications?: string[];
    chronicConditions?: string[];
    insuranceProvider?: string;
    insurancePolicyNumber?: string;
    primaryCarePhysician?: string;
  };
  insurance?: {
    provider?: string;
    policyNumber?: string;
    groupNumber?: string;
    primaryInsured?: string;
    relationship?: string;
  };
  communicationPreferences?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

/**
 * Hook to fetch the current user's profile
 */
export function useCurrentUserProfile() {
  return useQuery({
    queryKey: ["currentUserProfile"],
    queryFn: async (): Promise<UserProfileData> => {
      try {
        const userData = await fetchApi<BackendUserData>("/users/profile");

        // Transform the backend user data to match our frontend UserProfileData structure
        return {
          id: userData._id,
          name: userData.name || "",
          email: userData.email,
          phone: userData.phone,
          emailVerified: userData.emailVerified || false,
          phoneVerified: userData.phoneVerified || false,
          avatarUrl: userData.avatarUrl,
          role: userData.role,
          dateOfBirth: userData.dateOfBirth,
          gender: userData.gender,
          created: userData.createdAt,
          lastActive: userData.updatedAt,
          address: userData.address,
          emergencyContact: userData.emergencyContact,
          medicalInformation: userData.medicalInformation,
          insurance: userData.insurance,
          communicationPreferences: userData.communicationPreferences,
        };
      } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
      }
    },
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to update the current user's profile
 */
export function useUpdateUserProfile() {
  return useMutation({
    mutationFn: async (
      profileData: Partial<UserProfileData>
    ): Promise<UserProfileData> => {
      try {
        const userData = await fetchApi<BackendUserData>("/users/profile", {
          method: "PATCH",
          body: JSON.stringify(profileData),
        });

        // Transform the backend user data to match our frontend UserProfileData structure
        return {
          id: userData._id,
          name: userData.name || "",
          email: userData.email,
          phone: userData.phone,
          emailVerified: userData.emailVerified || false,
          phoneVerified: userData.phoneVerified || false,
          avatarUrl: userData.avatarUrl,
          role: userData.role,
          dateOfBirth: userData.dateOfBirth,
          gender: userData.gender,
          created: userData.createdAt,
          lastActive: userData.updatedAt,
          address: userData.address,
          emergencyContact: userData.emergencyContact,
          medicalInformation: userData.medicalInformation,
          insurance: userData.insurance,
          communicationPreferences: userData.communicationPreferences,
        };
      } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
      }
    },
  });
}

/**
 * Hook to upload a profile picture
 */
export function useUploadProfilePicture() {
  return useMutation({
    mutationFn: async (file: File): Promise<{ avatarUrl: string }> => {
      try {
        const formData = new FormData();
        formData.append("avatar", file);

        // Get the current session for the token (manual approach for FormData)
        const session = await import("next-auth/react").then((mod) =>
          mod.getSession()
        );
        const accessToken = session?.accessToken;

        // For FormData we need to handle this specially and not use JSON content type
        const headers = new Headers();
        if (accessToken) {
          headers.set("Authorization", `Bearer ${accessToken}`);
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003/api/v1"}/users/profile/avatar`,
          {
            method: "POST",
            body: formData,
            headers,
            credentials: "include",
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw {
            message:
              errorData.message ||
              `Error: ${response.status} ${response.statusText}`,
            statusCode: response.status,
            details: errorData,
          };
        }

        return response.json();
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        throw error;
      }
    },
  });
}
