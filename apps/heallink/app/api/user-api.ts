import { UserProfileData } from "../features/profile/types";
import { ApiResponse } from "../api-types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003/api/v1";

/**
 * Fetch the current user's profile
 */
export async function fetchCurrentUserProfile(): Promise<
  ApiResponse<UserProfileData>
> {
  try {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.message || "Failed to fetch user profile",
        statusCode: response.status,
      };
    }

    const userData = await response.json();

    // Transform the backend user data to match our frontend UserProfileData structure
    const profileData: UserProfileData = {
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

    return { data: profileData };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return {
      error: "An unexpected error occurred while fetching profile",
    };
  }
}

/**
 * Update the current user's profile
 */
export async function updateCurrentUserProfile(
  profileData: Partial<UserProfileData>
): Promise<ApiResponse<UserProfileData>> {
  try {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.message || "Failed to update user profile",
        statusCode: response.status,
      };
    }

    const userData = await response.json();

    // Transform the backend user data to match our frontend UserProfileData structure
    const updatedProfileData: UserProfileData = {
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

    return { data: updatedProfileData };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return {
      error: "An unexpected error occurred while updating profile",
    };
  }
}

/**
 * Upload profile picture
 */
export async function uploadProfilePicture(
  file: File
): Promise<ApiResponse<{ avatarUrl: string }>> {
  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await fetch(`${API_URL}/users/profile/avatar`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.message || "Failed to upload profile picture",
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    return {
      error: "An unexpected error occurred while uploading profile picture",
    };
  }
}
