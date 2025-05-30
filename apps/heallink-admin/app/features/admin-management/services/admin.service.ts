import { fetchWithAuth } from "../../../api/apiClient";
import {
  AdminUser,
  CreateAdminDto,
  UpdateAdminDto,
  UpdateAdminRoleDto,
  AdminQueryParams,
  AdminListResponse,
  AdminStatsResponse,
  BulkActionRequest,
  BulkActionResponse,
  AvatarUploadResponse,
  UserStatus,
} from "../types/admin.types";

class AdminService {
  /**
   * Get all admin users with pagination and filtering
   */
  async getAllAdmins(params: AdminQueryParams = {}): Promise<AdminListResponse> {
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
  }

  /**
   * Get admin statistics
   */
  async getAdminStats(): Promise<AdminStatsResponse> {
    return fetchWithAuth<AdminStatsResponse>("/admin/stats");
  }

  /**
   * Get a specific admin user by ID
   */
  async getAdminById(id: string): Promise<AdminUser> {
    const admin = await fetchWithAuth<AdminUser>(`/admin/${id}`);
    return {
      ...admin,
      id: admin._id || admin.id,
      status: admin.isActive ? UserStatus.ACTIVE : UserStatus.INACTIVE,
    };
  }

  /**
   * Create a new admin user
   */
  async createAdmin(adminData: CreateAdminDto): Promise<AdminUser> {
    const admin = await fetchWithAuth<AdminUser>("/admin", {
      method: "POST",
      data: adminData,
    });
    return {
      ...admin,
      id: admin._id || admin.id,
      status: admin.isActive ? UserStatus.ACTIVE : UserStatus.INACTIVE,
    };
  }

  /**
   * Update an admin user
   */
  async updateAdmin(id: string, adminData: UpdateAdminDto): Promise<AdminUser> {
    const admin = await fetchWithAuth<AdminUser>(`/admin/${id}`, {
      method: "PATCH",
      data: adminData,
    });
    return {
      ...admin,
      id: admin._id || admin.id,
      status: admin.isActive ? UserStatus.ACTIVE : UserStatus.INACTIVE,
    };
  }

  /**
   * Update admin role and permissions
   */
  async updateAdminRole(id: string, roleData: UpdateAdminRoleDto): Promise<AdminUser> {
    const admin = await fetchWithAuth<AdminUser>(`/admin/${id}/role`, {
      method: "PATCH",
      data: roleData,
    });
    return {
      ...admin,
      id: admin._id || admin.id,
      status: admin.isActive ? UserStatus.ACTIVE : UserStatus.INACTIVE,
    };
  }

  /**
   * Toggle admin status (activate/deactivate)
   */
  async toggleAdminStatus(id: string, status: boolean): Promise<AdminUser> {
    const admin = await fetchWithAuth<AdminUser>(`/admin/${id}/toggle-status`, {
      method: "PATCH",
      data: { status },
    });
    return {
      ...admin,
      id: admin._id || admin.id,
      status: status ? UserStatus.ACTIVE : UserStatus.INACTIVE,
    };
  }

  /**
   * Delete an admin user
   */
  async deleteAdmin(id: string): Promise<void> {
    return fetchWithAuth<void>(`/admin/${id}`, {
      method: "DELETE",
    });
  }

  /**
   * Upload admin avatar
   */
  async uploadAdminAvatar(id: string, file: File): Promise<AvatarUploadResponse> {
    const formData = new FormData();
    formData.append("avatar", file);

    return fetchWithAuth<AvatarUploadResponse>(`/admin/${id}/avatar`, {
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  /**
   * Perform bulk actions on multiple admins
   */
  async bulkAction(data: BulkActionRequest): Promise<BulkActionResponse> {
    return fetchWithAuth<BulkActionResponse>("/admin/bulk-action", {
      method: "POST",
      data,
    });
  }

  /**
   * Test authentication
   */
  async testAuth(): Promise<any> {
    return fetchWithAuth<any>("/admin/auth-test");
  }
}

export const adminService = new AdminService();
