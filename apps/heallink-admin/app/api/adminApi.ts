import { fetchWithAuth } from "./apiClient";

// Type definitions based on backend entities
export enum AdminRole {
  SUPER_ADMIN = "super_admin",
  SYSTEM_ADMIN = "system_admin",
  USER_ADMIN = "user_admin",
  PROVIDER_ADMIN = "provider_admin",
  CONTENT_ADMIN = "content_admin",
  BILLING_ADMIN = "billing_admin",
  SUPPORT_ADMIN = "support_admin",
  READONLY_ADMIN = "readonly_admin",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending",
  LOCKED = "locked",
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  adminRole: AdminRole;
  status: UserStatus;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdminDto {
  email: string;
  name: string;
  adminRole: AdminRole;
}

export interface UpdateAdminDto {
  name?: string;
  adminRole?: AdminRole;
  status?: UserStatus;
}

export interface UpdateAdminRoleDto {
  adminRole: AdminRole;
}

/**
 * Admin API endpoints
 */
export const adminApi = {
  /**
   * Get all admin users
   */
  getAllAdmins: async (): Promise<AdminUser[]> => {
    const response = await fetchWithAuth<{
      admins: AdminUser[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>("/admin");
    return response.admins;
  },

  /**
   * Get a specific admin user by ID
   */
  getAdminById: async (id: string): Promise<AdminUser> => {
    return fetchWithAuth<AdminUser>(`/admin/${id}`);
  },

  /**
   * Create a new admin user
   */
  createAdmin: async (adminData: CreateAdminDto): Promise<AdminUser> => {
    return fetchWithAuth<AdminUser>("/admin", {
      method: "POST",
      data: adminData,
    });
  },

  /**
   * Update an admin user
   */
  updateAdmin: async (
    id: string,
    adminData: UpdateAdminDto
  ): Promise<AdminUser> => {
    return fetchWithAuth<AdminUser>(`/admin/${id}`, {
      method: "PUT",
      data: adminData,
    });
  },

  /**
   * Update admin role
   */
  updateAdminRole: async (
    id: string,
    roleData: UpdateAdminRoleDto
  ): Promise<AdminUser> => {
    return fetchWithAuth<AdminUser>(`/admin/${id}/role`, {
      method: "PUT",
      data: roleData,
    });
  },

  /**
   * Deactivate an admin user
   */
  deactivateAdmin: async (id: string): Promise<AdminUser> => {
    return fetchWithAuth<AdminUser>(`/admin/${id}/toggle-status`, {
      method: "PATCH",
      data: { status: false },
    });
  },

  /**
   * Activate an admin user
   */
  activateAdmin: async (id: string): Promise<AdminUser> => {
    return fetchWithAuth<AdminUser>(`/admin/${id}/toggle-status`, {
      method: "PATCH",
      data: { status: true },
    });
  },

  /**
   * Delete an admin user
   */
  deleteAdmin: async (id: string): Promise<void> => {
    return fetchWithAuth<void>(`/admin/${id}`, {
      method: "DELETE",
    });
  },
};
