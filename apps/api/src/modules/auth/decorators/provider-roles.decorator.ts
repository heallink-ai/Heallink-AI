import { SetMetadata } from '@nestjs/common';

export enum ProviderRole {
  PROVIDER = 'provider',
  PRACTICE_ADMIN = 'practice_admin',
  PRACTICE_STAFF = 'practice_staff',
}

export const PROVIDER_ROLES_KEY = 'providerRoles';
export const ProviderRoles = (...roles: ProviderRole[]) => SetMetadata(PROVIDER_ROLES_KEY, roles);