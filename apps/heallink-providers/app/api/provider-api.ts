import { ApiResponse } from "../api-types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003/api/v1";

// Provider profile data structure
export interface ProviderProfileData {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  avatarUrl?: string;
  role: string;
  specialization: string;
  licenseNumber: string;
  education?: {
    degree: string;
    institution: string;
    year: number;
  }[];
  experience?: {
    position: string;
    organization: string;
    startYear: number;
    endYear?: number;
    current: boolean;
  }[];
  certifications?: {
    name: string;
    issuedBy: string;
    year: number;
    expiryYear?: number;
  }[];
  workingHours?: {
    monday?: { start: string; end: string }[];
    tuesday?: { start: string; end: string }[];
    wednesday?: { start: string; end: string }[];
    thursday?: { start: string; end: string }[];
    friday?: { start: string; end: string }[];
    saturday?: { start: string; end: string }[];
    sunday?: { start: string; end: string }[];
  };
  address?: {
    streetAddress?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  bio?: string;
  languages?: string[];
  created: string;
  lastActive: string;
}

/**
 * Fetch the current provider's profile
 */
export async function fetchCurrentProviderProfile(): Promise<
  ApiResponse<ProviderProfileData>
> {
  try {
    const response = await fetch(`${API_URL}/providers/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.message || "Failed to fetch provider profile",
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error fetching provider profile:", error);
    return {
      error: "An unexpected error occurred while fetching profile",
    };
  }
}

/**
 * Update the current provider's profile
 */
export async function updateCurrentProviderProfile(
  profileData: Partial<ProviderProfileData>
): Promise<ApiResponse<ProviderProfileData>> {
  try {
    const response = await fetch(`${API_URL}/providers/profile`, {
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
        error: errorData.message || "Failed to update provider profile",
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error updating provider profile:", error);
    return {
      error: "An unexpected error occurred while updating profile",
    };
  }
}

/**
 * Upload provider profile picture
 */
export async function uploadProviderProfilePicture(
  file: File
): Promise<ApiResponse<{ avatarUrl: string }>> {
  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await fetch(`${API_URL}/providers/profile/avatar`, {
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

/**
 * Fetch provider's schedule
 */
export async function fetchProviderSchedule(
  startDate: string,
  endDate: string
): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(
      `${API_URL}/providers/schedule?startDate=${startDate}&endDate=${endDate}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.message || "Failed to fetch schedule",
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error fetching provider schedule:", error);
    return {
      error: "An unexpected error occurred while fetching schedule",
    };
  }
}

/**
 * Update provider's availability
 */
export async function updateProviderAvailability(
  availabilityData: any
): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/providers/availability`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(availabilityData),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.message || "Failed to update availability",
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error updating provider availability:", error);
    return {
      error: "An unexpected error occurred while updating availability",
    };
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api/v1';

export interface ProviderRegistrationData {
  firstName: string;
  lastName: string;
  title: string;
  licenseNumber: string;
  licenseState: string;
  licenseExpiryDate: string;
  boardCertifications?: string[];
  specializations: string[];
  bio?: string;
  languages?: string[];
  yearsOfExperience?: number;
  education?: string[];
  awards?: string[];
  publications?: string[];
  acceptsNewPatients?: boolean;
  teleheathEnabled?: boolean;
  insuranceAccepted?: string[];
}

export const providerApi = {
  register: async (data: ProviderRegistrationData, token: string) => {
    const response = await fetch(`${API_URL}/providers/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  },

  getProfile: async (token: string) => {
    const response = await fetch(`${API_URL}/providers/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch provider profile');
    }

    return response.json();
  },

  getSpecializations: async () => {
    const response = await fetch(`${API_URL}/providers/specializations`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch specializations');
    }

    return response.json();
  },
};