import { fetchWithAuth } from "./apiClient";

// Type definitions matching backend schema
export enum UserRole {
  USER = "user",
  PROVIDER = "provider",
  ADMIN = "admin",
}

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
  _id: string;
  id: string; // For compatibility
  email: string;
  phone?: string;
  name: string;
  role: UserRole;
  adminRole: AdminRole;
  permissions?: string[];
  avatarUrl?: string;
  emailVerified: boolean;
  phoneVerified?: boolean;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  status: UserStatus; // Computed from isActive
}

export interface CreateAdminDto {
  email: string;
  phone?: string;
  name: string;
  password?: string;
  role: UserRole;
  adminRole: AdminRole;
  permissions?: string[];
  avatarUrl?: string;
}

export interface UpdateAdminDto {
  email?: string;
  phone?: string;
  name?: string;
  password?: string;
  role?: UserRole;
  adminRole?: AdminRole;
  permissions?: string[];
  avatarUrl?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  isActive?: boolean;
  lastLogin?: Date;
}

export interface UpdateAdminRoleDto {
  adminRole: AdminRole;
  permissions?: string[];
}

export interface AdminListResponse {
  admins: AdminUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminStatsResponse {
  totalAdmins: number;
  activeAdmins: number;
  recentlyCreated: number;
  roleDistribution: Record<string, number>;
}

/**
 * Admin API endpoints
 */
export const adminApi = {
  /**
   * Get all admin users with pagination
   */
  getAllAdmins: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: UserRole;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<AdminListResponse> => {
    const response = await fetchWithAuth<AdminListResponse>("/admin", {
      method: "GET",
      params,
    });
    
    // Transform the response to ensure compatibility
    const transformedAdmins = response.admins.map(admin => ({
      ...admin,
      id: admin._id || admin.id,
      status: admin.isActive ? UserStatus.ACTIVE : UserStatus.INACTIVE,
    }));
    
    return {
      ...response,
      admins: transformedAdmins,
    };
  },

  /**
   * Get admin statistics
   */
  getAdminStats: async (): Promise<AdminStatsResponse> => {
    return fetchWithAuth<AdminStatsResponse>("/admin/stats");
  },

  /**
   * Get a specific admin user by ID
   */
  getAdminById: async (id: string): Promise<AdminUser> => {
    const admin = await fetchWithAuth<AdminUser>(`/admin/${id}`);
    return {
      ...admin,
      id: admin._id || admin.id,
      status: admin.isActive ? UserStatus.ACTIVE : UserStatus.INACTIVE,
    };
  },

  /**
   * Create a new admin user
   */
  createAdmin: async (adminData: CreateAdminDto): Promise<AdminUser> => {
    const admin = await fetchWithAuth<AdminUser>("/admin", {
      method: "POST",
      data: {
        ...adminData,
        role: adminData.role || UserRole.ADMIN,
      },
    });
    return {
      ...admin,
      id: admin._id || admin.id,
      status: admin.isActive ? UserStatus.ACTIVE : UserStatus.INACTIVE,
    };
  },

  /**
   * Update an admin user
   */
  updateAdmin: async (
    id: string,
    adminData: UpdateAdminDto
  ): Promise<AdminUser> => {
    const admin = await fetchWithAuth<AdminUser>(`/admin/${id}`, {
      method: "PATCH",
      data: adminData,
    });
    return {
      ...admin,
      id: admin._id || admin.id,
      status: admin.isActive ? UserStatus.ACTIVE : UserStatus.INACTIVE,
    };
  },

  /**
   * Update admin role
   */
  updateAdminRole: async (
    id: string,
    roleData: UpdateAdminRoleDto
  ): Promise<AdminUser> => {
    const admin = await fetchWithAuth<AdminUser>(`/admin/${id}/role`, {
      method: "PATCH",
      data: roleData,
    });
    return {
      ...admin,
      id: admin._id || admin.id,
      status: admin.isActive ? UserStatus.ACTIVE : UserStatus.INACTIVE,
    };
  },

  /**
   * Deactivate an admin user
   */
  deactivateAdmin: async (id: string): Promise<AdminUser> => {
    const admin = await fetchWithAuth<AdminUser>(`/admin/${id}/toggle-status`, {
      method: "PATCH",
      data: { status: false },
    });
    return {
      ...admin,
      id: admin._id || admin.id,
      status: UserStatus.INACTIVE,
    };
  },

  /**
   * Activate an admin user
   */
  activateAdmin: async (id: string): Promise<AdminUser> => {
    const admin = await fetchWithAuth<AdminUser>(`/admin/${id}/toggle-status`, {
      method: "PATCH",
      data: { status: true },
    });
    return {
      ...admin,
      id: admin._id || admin.id,
      status: UserStatus.ACTIVE,
    };
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
