export enum UserRole {
  USER = "user",
  PROVIDER = "provider",
  ADMIN = "admin",
}

export enum AuthProvider {
  LOCAL = "local",
  GOOGLE = "google",
  FACEBOOK = "facebook",
  APPLE = "apple",
}

export interface AdminUser {
  _id: string;
  email: string;
  phone?: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  providers: AuthProvider[];
  accounts?: Array<{
    provider: AuthProvider;
    providerId: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdminRequest {
  email: string;
  phone?: string;
  name: string;
  password?: string;
  role: UserRole;
  providers?: AuthProvider[];
  avatarUrl?: string;
}

export interface UpdateAdminRequest {
  email?: string;
  phone?: string;
  name?: string;
  role?: UserRole;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  avatarUrl?: string;
}

export interface AdminQueryParams {
  page?: number;
  limit?: number;
  role?: UserRole;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
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

export interface BulkActionRequest {
  action: "delete" | "toggle-status";
  adminIds: string[];
  status?: boolean;
}

export interface BulkActionResponse {
  message: string;
  success: number;
  failed: number;
}

export interface AvatarUploadResponse {
  avatarUrl: string;
}
