import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { LoggingModule } from './modules/logging/logging.module';
import { EmailModule } from './modules/emails/email.module';
import { AwsModule } from './modules/aws';
import { LivekitModule } from './modules/livekit/livekit.module';
import * as Joi from 'joi';
import { ProvidersModule } from './modules/providers/providers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3003),
        // Database
        DATABASE_URL: Joi.string().required(),
        // JWT
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().default('15m'),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
        // Frontend URL for links in emails
        FRONTEND_URL: Joi.string().required(),
        // Email
        EMAIL_FROM: Joi.string().required(),
        EMAIL_FROM_NAME: Joi.string().optional().allow(''),
        // LiveKit
        LIVEKIT_URL: Joi.string().required(),
        LIVEKIT_API_KEY: Joi.string().required(),
        LIVEKIT_API_SECRET: Joi.string().required(),
        // AI Engine
        AI_ENGINE_URL: Joi.string().default('http://ai-engine:8000'),
        // OAuth providers
        GOOGLE_CLIENT_ID: Joi.string().optional().allow(''),
        GOOGLE_CLIENT_SECRET: Joi.string().optional().allow(''),
        FACEBOOK_CLIENT_ID: Joi.string().optional().allow(''),
        FACEBOOK_CLIENT_SECRET: Joi.string().optional().allow(''),
        APPLE_CLIENT_ID: Joi.string().optional().allow(''),
        APPLE_TEAM_ID: Joi.string().optional().allow(''),
        APPLE_KEY_ID: Joi.string().optional().allow(''),
        APPLE_PRIVATE_KEY: Joi.string().optional().allow(''),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
      load: [
        () => ({
          jwtConfig: {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRES_IN,
            refreshSecret: process.env.JWT_REFRESH_SECRET,
            refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
          },
          database: {
            uri: process.env.DATABASE_URL,
          },
          frontend: {
            url: process.env.FRONTEND_URL,
            adminUrl: process.env.ADMIN_FRONTEND_URL,
          },
          livekit: {
            url: process.env.LIVEKIT_URL,
            apiKey: process.env.LIVEKIT_API_KEY,
            apiSecret: process.env.LIVEKIT_API_SECRET,
          },
          aiEngine: {
            url: process.env.AI_ENGINE_URL || 'http://ai-engine:8000',
          },
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
          facebook: {
            appId: process.env.FACEBOOK_CLIENT_ID,
            appSecret: process.env.FACEBOOK_CLIENT_SECRET,
          },
          apple: {
            clientId: process.env.APPLE_CLIENT_ID,
            teamId: process.env.APPLE_TEAM_ID,
            keyId: process.env.APPLE_KEY_ID,
            privateKey: process.env.APPLE_PRIVATE_KEY,
          },
        }),
      ],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'src', 'public'),
      serveRoot: '/',
      exclude: ['/api*'],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): ThrottlerModuleOptions => {
        const ttl = configService.get<number>('rate_limit.ttl') || 60;
        const limit = configService.get<number>('rate_limit.limit') || 100;

        // Return in the format expected by ThrottlerModule
        return {
          throttlers: [
            {
              ttl,
              limit,
            },
          ],
        };
      },
    }),
    LoggingModule,
    UsersModule,
    AuthModule,
    AdminModule,
    EmailModule,
    AwsModule,
    LivekitModule,
    ProvidersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
