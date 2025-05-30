// Types that match the API auth types

export enum UserRole {
  USER = "user",
  PROVIDER = "provider",
  ADMIN = "admin",
}

// Extended admin roles for more granular permissions
export enum AdminRole {
  SUPER_ADMIN = "super_admin", // Can do anything
  SYSTEM_ADMIN = "system_admin", // Can manage system settings
  USER_ADMIN = "user_admin", // Can manage users
  PROVIDER_ADMIN = "provider_admin", // Can manage healthcare providers
  CONTENT_ADMIN = "content_admin", // Can manage content/CMS
  BILLING_ADMIN = "billing_admin", // Can manage billing/payments
  SUPPORT_ADMIN = "support_admin", // Customer support admin
  READONLY_ADMIN = "readonly_admin", // View-only admin access
}

export enum AuthProvider {
  CREDENTIALS = "credentials",
  GOOGLE = "google",
  FACEBOOK = "facebook",
  APPLE = "apple",
  PHONE = "phone",
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  adminRole?: AdminRole;
  permissions?: string[];
  emailVerified?: boolean;
  isActive?: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Permission system for admin actions
export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: "create" | "read" | "update" | "delete" | "manage";
}

// Pre-defined permission sets for different admin roles
export const ADMIN_PERMISSIONS: Record<AdminRole, string[]> = {
  [AdminRole.SUPER_ADMIN]: ["*"], // Wildcard for all permissions
  [AdminRole.SYSTEM_ADMIN]: [
    "settings:read",
    "settings:update",
    "logs:read",
    "system:manage",
  ],
  [AdminRole.USER_ADMIN]: [
    "users:read",
    "users:create",
    "users:update",
    "users:delete",
  ],
  [AdminRole.PROVIDER_ADMIN]: [
    "providers:read",
    "providers:create",
    "providers:update",
    "providers:delete",
  ],
  [AdminRole.CONTENT_ADMIN]: [
    "content:read",
    "content:create",
    "content:update",
    "content:delete",
  ],
  [AdminRole.BILLING_ADMIN]: [
    "billing:read",
    "billing:create",
    "billing:update",
    "payments:manage",
  ],
  [AdminRole.SUPPORT_ADMIN]: ["tickets:read", "tickets:update", "users:read"],
  [AdminRole.READONLY_ADMIN]: [
    "users:read",
    "providers:read",
    "content:read",
    "billing:read",
  ],
};
