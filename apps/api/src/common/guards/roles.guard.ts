import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../modules/users/schemas/user.schema';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    this.logger.debug(`Required roles: ${JSON.stringify(requiredRoles)}`);

    if (!requiredRoles) {
      this.logger.debug('No roles required, access granted');
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      this.logger.warn('No user found in request, access denied');
      return false;
    }

    this.logger.debug(
      `User role: ${user.role}, required roles: ${JSON.stringify(requiredRoles)}`,
    );

    const hasRole = requiredRoles.some((role) => user.role === role);

    if (!hasRole) {
      this.logger.warn(
        `Access denied: User role ${user.role} not in required roles ${JSON.stringify(requiredRoles)}`,
      );
    } else {
      this.logger.debug(
        `Access granted: User role ${user.role} matches required roles`,
      );
    }

    return hasRole;
  }
}
