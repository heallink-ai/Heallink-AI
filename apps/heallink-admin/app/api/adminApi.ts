import { fetchApi } from "./apiClient";

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
    return fetchApi<AdminUser[]>("/auth/admin/users");
  },

  /**
   * Get a specific admin user by ID
   */
  getAdminById: async (id: string): Promise<AdminUser> => {
    return fetchApi<AdminUser>(`/auth/admin/users/${id}`);
  },

  /**
   * Create a new admin user
   */
  createAdmin: async (adminData: CreateAdminDto): Promise<AdminUser> => {
    return fetchApi<AdminUser>("/auth/admin/register", {
      method: "POST",
      body: JSON.stringify(adminData),
    });
  },

  /**
   * Update an admin user
   */
  updateAdmin: async (
    id: string,
    adminData: UpdateAdminDto
  ): Promise<AdminUser> => {
    return fetchApi<AdminUser>(`/auth/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(adminData),
    });
  },

  /**
   * Update admin role
   */
  updateAdminRole: async (
    id: string,
    roleData: UpdateAdminRoleDto
  ): Promise<AdminUser> => {
    return fetchApi<AdminUser>(`/auth/admin/users/${id}/role`, {
      method: "PUT",
      body: JSON.stringify(roleData),
    });
  },

  /**
   * Deactivate an admin user
   */
  deactivateAdmin: async (id: string): Promise<AdminUser> => {
    return fetchApi<AdminUser>(`/auth/admin/users/${id}/deactivate`, {
      method: "PUT",
    });
  },

  /**
   * Activate an admin user
   */
  activateAdmin: async (id: string): Promise<AdminUser> => {
    return fetchApi<AdminUser>(`/auth/admin/users/${id}/activate`, {
      method: "PUT",
    });
  },

  /**
   * Delete an admin user
   */
  deleteAdmin: async (id: string): Promise<void> => {
    return fetchApi<void>(`/auth/admin/users/${id}`, {
      method: "DELETE",
    });
  },
};
