// Enums
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

export enum AuthProvider {
  LOCAL = "local",
  GOOGLE = "google",
  FACEBOOK = "facebook",
  APPLE = "apple",
}

// Core Types
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
  providers: AuthProvider[];
  accounts?: Array<{
    provider: AuthProvider;
    providerId: string;
  }>;
  createdAt: string;
  updatedAt: string;
  status: UserStatus; // Computed from isActive
}

// API Request/Response Types
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

export interface AdminQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
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
  errors?: string[];
}

export interface AvatarUploadResponse {
  avatarUrl: string;
}

// Form Types
export interface AdminFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  adminRole: AdminRole;
  isActive: boolean;
  permissions: string[];
  accessRights: {
    systemConfiguration: boolean;
    userManagement: boolean;
    adminManagement: boolean;
    providerManagement: boolean;
    billingManagement: boolean;
    securitySettings: boolean;
    auditLogs: boolean;
    apiAccess: boolean;
  };
}

// Component Props Types
export interface AdminTableProps {
  admins: AdminUser[];
  isLoading: boolean;
  onStatusChange: (id: string, status: string) => void;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

export interface AdminFormProps {
  admin?: AdminUser;
  onSubmit: (data: CreateAdminDto | UpdateAdminDto) => void;
  onCancel: () => void;
  isLoading: boolean;
  isEdit?: boolean;
}

export interface AdminListPresentationProps {
  admins: AdminUser[];
  totalAdmins: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  searchTerm: string;
  roleFilter: string;
  statusFilter: string;
  queryParams?: AdminQueryParams;
  onSearchChange: (value: string) => void;
  onRoleFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onStatusToggle: (id: string, currentStatus: string) => void;
  onResetPassword: (id: string) => void;
  onRefresh: () => void;
}
