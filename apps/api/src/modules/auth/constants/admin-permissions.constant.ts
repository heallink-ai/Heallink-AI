import { AdminRole } from '../../users/entities/admin-user.entity';

/**
 * Pre-defined permission sets for different admin roles
 */
export const ADMIN_PERMISSIONS: Record<AdminRole, string[]> = {
  [AdminRole.SUPER_ADMIN]: ['*'], // Wildcard for all permissions
  [AdminRole.SYSTEM_ADMIN]: [
    'settings:read',
    'settings:update',
    'logs:read',
    'system:manage',
  ],
  [AdminRole.USER_ADMIN]: [
    'users:read',
    'users:create',
    'users:update',
    'users:delete',
  ],
  [AdminRole.PROVIDER_ADMIN]: [
    'providers:read',
    'providers:create',
    'providers:update',
    'providers:delete',
  ],
  [AdminRole.CONTENT_ADMIN]: [
    'content:read',
    'content:create',
    'content:update',
    'content:delete',
  ],
  [AdminRole.BILLING_ADMIN]: [
    'billing:read',
    'billing:create',
    'billing:update',
    'payments:manage',
  ],
  [AdminRole.SUPPORT_ADMIN]: ['tickets:read', 'tickets:update', 'users:read'],
  [AdminRole.READONLY_ADMIN]: [
    'users:read',
    'providers:read',
    'content:read',
    'billing:read',
  ],
};
