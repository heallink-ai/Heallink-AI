import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminRole } from '../../users/schemas/user.schema';

export const ADMIN_PERMISSIONS_KEY = 'adminPermissions';

export interface AdminPermissionConfig {
  roles?: AdminRole[];
  permissions?: string[];
  requireAll?: boolean; // If true, user must have ALL permissions, if false, just one
}

@Injectable()
export class AdminPermissionsGuard implements CanActivate {
  private readonly logger = new Logger(AdminPermissionsGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permissionConfig = this.reflector.getAllAndOverride<AdminPermissionConfig>(
      ADMIN_PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no permissions specified, allow access
    if (!permissionConfig) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      this.logger.warn('No user found in request');
      return false;
    }

    // Check admin roles
    if (permissionConfig.roles && permissionConfig.roles.length > 0) {
      if (!user.adminRole || !permissionConfig.roles.includes(user.adminRole)) {
        this.logger.warn(
          `Access denied: User role ${user.adminRole} not in required roles ${JSON.stringify(permissionConfig.roles)}`,
        );
        throw new ForbiddenException(
          'Insufficient permissions to access this resource',
        );
      }
    }

    // Super admins have access to everything
    if (user.adminRole === AdminRole.SUPER_ADMIN) {
      return true;
    }

    // Check specific permissions
    if (permissionConfig.permissions && permissionConfig.permissions.length > 0) {
      const userPermissions = user.permissions || [];
      
      // Check if user has wildcard permission
      if (userPermissions.includes('*')) {
        return true;
      }

      const hasRequiredPermissions = permissionConfig.requireAll
        ? permissionConfig.permissions.every(perm => userPermissions.includes(perm))
        : permissionConfig.permissions.some(perm => userPermissions.includes(perm));

      if (!hasRequiredPermissions) {
        this.logger.warn(
          `Access denied: User permissions ${JSON.stringify(userPermissions)} do not match required ${JSON.stringify(permissionConfig.permissions)}`,
        );
        throw new ForbiddenException(
          'Insufficient permissions to access this resource',
        );
      }
    }

    return true;
  }
}

// Decorator to set admin permissions
export const AdminPermissions = (config: AdminPermissionConfig) =>
  (target: any, propertyKey?: string | symbol, descriptor?: PropertyDescriptor) => {
    Reflect.defineMetadata(ADMIN_PERMISSIONS_KEY, config, descriptor?.value || target);
  };