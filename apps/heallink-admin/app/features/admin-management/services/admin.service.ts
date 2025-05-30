import apiClient from '../../../api/apiClient';
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
  AvatarUploadResponse
} from '../types/admin.types';

/**
 * Admin service for managing admin users
 */
class AdminService {
  private baseUrl = '/admin';

  /**
   * Get list of admin users with pagination and filtering
   */
  async getAllAdmins(params?: AdminQueryParams): Promise<AdminListResponse> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const url = `${this.baseUrl}?${searchParams.toString()}`;
    const response = await apiClient.get<AdminListResponse>(url);
    return response.data;
  }

  /**
   * Get a specific admin user by ID
   */
  async getAdminById(id: string): Promise<AdminUser> {
    const response = await apiClient.get<AdminUser>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Create a new admin user
   */
  async createAdmin(data: CreateAdminDto): Promise<AdminUser> {
    const response = await apiClient.post<AdminUser>(this.baseUrl, data);
    return response.data;
  }

  /**
   * Update an existing admin user
   */
  async updateAdmin(id: string, data: UpdateAdminDto): Promise<AdminUser> {
    const response = await apiClient.patch<AdminUser>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  /**
   * Update an admin user's role and permissions
   */
  async updateAdminRole(id: string, roleData: UpdateAdminRoleDto): Promise<AdminUser> {
    const response = await apiClient.patch<AdminUser>(`${this.baseUrl}/${id}/role`, roleData);
    return response.data;
  }

  /**
   * Toggle admin user status (activate/deactivate)
   */
  async toggleAdminStatus(id: string, status: boolean): Promise<AdminUser> {
    const response = await apiClient.patch<AdminUser>(`${this.baseUrl}/${id}/toggle-status`, { status });
    return response.data;
  }

  /**
   * Delete an admin user
   */
  async deleteAdmin(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Reset admin password and send email with new temporary password
   */
  async resetAdminPassword(id: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(`${this.baseUrl}/${id}/reset-password`);
    return response.data;
  }

  /**
   * Get admin statistics
   */
  async getAdminStats(): Promise<AdminStatsResponse> {
    const response = await apiClient.get<AdminStatsResponse>(`${this.baseUrl}/stats`);
    return response.data;
  }

  /**
   * Upload admin avatar
   */
  async uploadAdminAvatar(id: string, file: File): Promise<AvatarUploadResponse> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.post<AvatarUploadResponse>(
      `${this.baseUrl}/${id}/avatar`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  /**
   * Perform bulk actions on multiple admin users
   */
  async bulkAction(data: BulkActionRequest): Promise<BulkActionResponse> {
    const response = await apiClient.post<BulkActionResponse>(`${this.baseUrl}/bulk-action`, data);
    return response.data;
  }
}

// Export singleton instance
export const adminService = new AdminService();
export default adminService;