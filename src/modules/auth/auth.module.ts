import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "../users/users.module";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { JwtRefreshStrategy } from "./strategies/jwt-refresh.strategy";
import { AdminAuthService } from "./admin-auth.service";
import { AdminAuthController } from "./admin-auth.controller";
import {
  AdminUser,
  AdminUserSchema,
} from "../users/entities/admin-user.entity";
import { LoggingModule } from "../logging/logging.module";
import { EmailModule } from "../emails/email.module";

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("jwt.secret") || "dev-jwt-secret",
        signOptions: {
          expiresIn: configService.get<string>("jwt.expiresIn") || "15m",
        },
      }),
    }),
    UsersModule,
    LoggingModule,
    EmailModule,
    MongooseModule.forFeature([
      { name: AdminUser.name, schema: AdminUserSchema },
    ]),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    AdminAuthService,
  ],
  controllers: [AuthController, AdminAuthController],
  exports: [AuthService, AdminAuthService],
})
export class AuthModule {}
