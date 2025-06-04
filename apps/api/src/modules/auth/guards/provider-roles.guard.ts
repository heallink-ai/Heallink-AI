import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PROVIDER_ROLES_KEY, ProviderRole } from '../decorators/provider-roles.decorator';
import { ProvidersService } from '../../providers/providers.service';

@Injectable()
export class ProviderRolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private providersService: ProvidersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<ProviderRole[]>(
      PROVIDER_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    // Check if user is a provider
    const provider = await this.providersService.findProviderByUserId(user.id);
    if (!provider) {
      return false;
    }

    // For now, all verified providers have provider role
    // This can be extended to include practice-specific roles
    const userProviderRoles = [ProviderRole.PROVIDER];
    
    return requiredRoles.some((role) => userProviderRoles.includes(role));
  }
}