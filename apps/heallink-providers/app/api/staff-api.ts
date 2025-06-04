import { ApiResponse } from "../api-types";
import { getSession } from "next-auth/react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003/api/v1";

// Staff member data structure
export interface StaffMemberData {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: "doctor" | "nurse" | "admin" | "receptionist" | "technician";
  specialization?: string;
  licenseNumber?: string;
  department?: string;
  isActive: boolean;
  permissions: {
    canViewPatients: boolean;
    canEditPatients: boolean;
    canManageSchedule: boolean;
    canAccessBilling: boolean;
    canManageStaff: boolean;
  };
  workingHours?: {
    monday?: { start: string; end: string }[];
    tuesday?: { start: string; end: string }[];
    wednesday?: { start: string; end: string }[];
    thursday?: { start: string; end: string }[];
    friday?: { start: string; end: string }[];
    saturday?: { start: string; end: string }[];
    sunday?: { start: string; end: string }[];
  };
  created: string;
  lastActive?: string;
}

/**
 * Fetch all staff members for the current provider organization
 */
export async function fetchProviderStaff(
  page = 1,
  limit = 10,
  role?: string
): Promise<ApiResponse<{ staff: StaffMemberData[]; total: number }>> {
  try {
    const session = await getSession();
    let url = `${API_URL}/providers/staff?page=${page}&limit=${limit}`;
    if (role) {
      url += `&role=${role}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(session?.accessToken && {
          Authorization: `Bearer ${session.accessToken}`,
        }),
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.message || "Failed to fetch staff",
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error fetching provider staff:", error);
    return {
      error: "Network error occurred",
      statusCode: 500,
    };
  }
}

/**
 * Add a new staff member to the provider organization
 */
export async function addStaffMember(
  staffData: Omit<StaffMemberData, "id" | "created" | "lastActive">
): Promise<ApiResponse<StaffMemberData>> {
  try {
    const response = await fetch(`${API_URL}/providers/staff`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(staffData),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.message || "Failed to add staff member",
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error adding staff member:", error);
    return {
      error: "An unexpected error occurred while adding staff member",
    };
  }
}

/**
 * Update a staff member's information
 */
export async function updateStaffMember(
  staffId: string,
  staffData: Partial<StaffMemberData>
): Promise<ApiResponse<StaffMemberData>> {
  try {
    const response = await fetch(`${API_URL}/providers/staff/${staffId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(staffData),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.message || "Failed to update staff member",
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error updating staff member:", error);
    return {
      error: "An unexpected error occurred while updating staff member",
    };
  }
}

/**
 * Remove a staff member from the provider organization
 */
export async function removeStaffMember(
  staffId: string
): Promise<ApiResponse<{ success: boolean }>> {
  try {
    const response = await fetch(`${API_URL}/providers/staff/${staffId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.message || "Failed to remove staff member",
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error removing staff member:", error);
    return {
      error: "An unexpected error occurred while removing staff member",
    };
  }
}