import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminRole } from '../../users/entities/admin-user.entity';
import { LoggingService } from '../../logging/logging.service';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private loggingService: LoggingService,
  ) {
    this.loggingService.setContext('AdminRoleGuard');
  }

  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.get<AdminRole[]>(
      'roles',
      context.getHandler(),
    );

    // If no roles specified, allow access
    if (!allowedRoles || allowedRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      this.loggingService.warn(
        'No user found in request - this guard should be used after JwtAuthGuard',
      );
      return false;
    }

    if (!user.adminRole) {
      this.loggingService.logAuth(user.sub, 'role-guard', false, {
        requiredRoles: allowedRoles,
        userRole: 'none',
      });
      throw new ForbiddenException(
        'You do not have sufficient permissions to access this resource',
      );
    }

    const hasRole = allowedRoles.includes(user.adminRole);

    if (!hasRole) {
      this.loggingService.logAuth(user.sub, 'role-guard', false, {
        requiredRoles: allowedRoles,
        userRole: user.adminRole,
      });
      throw new ForbiddenException(
        'You do not have sufficient permissions to access this resource',
      );
    }

    // Log successful access
    this.loggingService.logAuth(user.sub, 'role-guard', true, {
      adminRole: user.adminRole,
    });

    return true;
  }
}
