import api from "../../../lib/api";
import {
  AdminUser,
  CreateAdminRequest,
  UpdateAdminRequest,
  AdminQueryParams,
  AdminListResponse,
  AdminStatsResponse,
  BulkActionRequest,
  BulkActionResponse,
  AvatarUploadResponse,
} from "../types/admin.types";

class AdminService {
  async createAdmin(data: CreateAdminRequest): Promise<AdminUser> {
    const response = await api.post("/admin", data);
    return response.data;
  }

  async getAdmins(params: AdminQueryParams = {}): Promise<AdminListResponse> {
    const response = await api.get("/admin", { params });
    return response.data;
  }

  async getAdminById(id: string): Promise<AdminUser> {
    const response = await api.get(`/admin/${id}`);
    return response.data;
  }

  async updateAdmin(id: string, data: UpdateAdminRequest): Promise<AdminUser> {
    const response = await api.patch(`/admin/${id}`, data);
    return response.data;
  }

  async deleteAdmin(id: string): Promise<void> {
    await api.delete(`/admin/${id}`);
  }

  async getAdminStats(): Promise<AdminStatsResponse> {
    const response = await api.get("/admin/stats");
    return response.data;
  }

  async toggleAdminStatus(id: string, status: boolean): Promise<AdminUser> {
    const response = await api.patch(`/admin/${id}/toggle-status`, {
      status,
    });
    return response.data;
  }

  async uploadAdminAvatar(
    id: string,
    file: File
  ): Promise<AvatarUploadResponse> {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await api.post(`/admin/${id}/avatar`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  async bulkAction(data: BulkActionRequest): Promise<BulkActionResponse> {
    const response = await api.post("/admin/bulk-action", data);
    return response.data;
  }

  async testAuth(): Promise<any> {
    const response = await api.get("/admin/auth-test");
    return response.data;
  }
}

export const adminService = new AdminService();
