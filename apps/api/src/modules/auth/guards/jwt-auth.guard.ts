import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor() {
    super();
  }

  canActivate(context: ExecutionContext) {
    this.logger.debug('JwtAuthGuard.canActivate called');
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    console.log('token', token);
    this.logger.debug(`Token present: ${!!token}`);

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log({ user, err, info });

    if (err || !user) {
      const errorMessage = err?.message || info?.message || 'Unauthorized';
      this.logger.error(`JWT validation failed: ${errorMessage}`, {
        path: request.url,
        method: request.method,
        error: err?.name || info?.name || 'Unknown',
      });

      throw new UnauthorizedException(errorMessage);
    }

    this.logger.debug(`JWT validation succeeded for user: ${user.email}`);
    return user;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
