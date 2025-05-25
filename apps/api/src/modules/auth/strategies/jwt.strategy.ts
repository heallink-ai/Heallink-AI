import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  adminRole?: string;
  permissions?: string[];
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    // Get the JWT secret directly from environment
    const jwtSecret =
      configService.get<string>('jwt.secret') || 'dev-jwt-secret';

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });

    console.log({ jwtSecret });

    this.logger.log(
      `JWT Strategy initialized with secret: ${jwtSecret ? '[SECRET CONFIGURED]' : 'fallback secret'}`,
    );
    this.logger.debug(`Direct env JWT_SECRET value exists: ${!!jwtSecret}`);
  }

  async validate(payload: JwtPayload) {
    this.logger.debug(
      `Validating JWT payload: ${JSON.stringify({
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
        adminRole: payload.adminRole,
      })}`,
    );

    if (!payload || !payload.sub) {
      this.logger.error('Invalid JWT payload structure');
      throw new UnauthorizedException('Invalid token structure');
    }

    try {
      const user = await this.usersService.findOne(payload.sub);

      if (!user) {
        this.logger.warn(`User not found for sub: ${payload.sub}`);
        throw new UnauthorizedException('User not found');
      }

      this.logger.debug(`User found: ${user.email}, role: ${user.role}`);

      // Return user without sensitive data
      return {
        id: user._id,
        email: user.email,
        phone: user.phone,
        name: user.name,
        role: user.role,
        adminRole: user.adminRole,
        permissions: user.permissions,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const stack = error instanceof Error ? error.stack : undefined;

      this.logger.error(`Error validating token: ${message}`, stack);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
