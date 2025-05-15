import { UserProfileData, UserProfileFormData } from "./types";
import { ApiResponse } from "@/app/api-types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003/api/v1";

/**
 * Fetch the current user's profile
 */
export async function fetchUserProfile(
  userId: string
): Promise<ApiResponse<UserProfileData>> {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
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

    const data = await response.json();
    return { data };
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
export async function updateUserProfile(
  userId: string,
  profileData: UserProfileFormData
): Promise<ApiResponse<UserProfileData>> {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
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

    const data = await response.json();
    return { data };
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
  userId: string,
  file: File
): Promise<ApiResponse<{ avatarUrl: string }>> {
  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await fetch(`${API_URL}/users/${userId}/avatar`, {
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
