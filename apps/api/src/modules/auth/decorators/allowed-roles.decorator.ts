import { SetMetadata } from '@nestjs/common';
import { AdminRole } from '../../users/entities/admin-user.entity';

export const ROLES_KEY = 'roles';
export const AllowedRoles = (...roles: AdminRole[]) =>
  SetMetadata(ROLES_KEY, roles);
