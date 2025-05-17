import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { LoggingService } from './modules/logging/logging.service';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as fs from 'fs';

async function bootstrap() {
  // Initialize app with Winston logger and specify Express platform
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // Use resolve for transient scoped service
  const loggingService = await app.resolve(LoggingService);
  loggingService.setContext('Bootstrap');

  // Use custom logger for NestJS
  app.useLogger(loggingService);

  // Log server startup
  loggingService.logSystem('Server starting', {
    nodeEnv: configService.get<string>('nodeEnv') || 'development',
  });

  // Create uploads directories if they don't exist
  const uploadsDir = join(__dirname, '..', 'uploads');
  const avatarsDir = join(uploadsDir, 'avatars');

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    loggingService.log('Created uploads directory');
  }

  if (!fs.existsSync(avatarsDir)) {
    fs.mkdirSync(avatarsDir, { recursive: true });
    loggingService.log('Created avatars directory');
  }

  // Serve static files from the uploads directory
  app.useStaticAssets(uploadsDir, {
    prefix: '/uploads',
  });

  // Enable CORS
  const corsOrigins =
    configService.get<string>('CORS_ORIGIN') || 'http://localhost:3000';
  const originsArray = corsOrigins.split(',').map((origin) => origin.trim());

  loggingService.log(
    `Configuring CORS for origins: ${originsArray.join(', ')}`,
  );

  app.enableCors({
    origin: originsArray,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Set global prefix
  app.setGlobalPrefix('api/v1');

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Setup Swagger Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Heallink API')
    .setDescription('Healthcare platform API documentation')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('admin-auth', 'Admin authentication endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('providers', 'Healthcare provider endpoints')
    .addTag('appointments', 'Appointment management endpoints')
    .addTag('billing', 'Billing and payment endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This is a key to be used in @ApiBearerAuth() decorator
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-api-key',
        in: 'header',
        description: 'API key for external services',
      },
      'api-key',
    )
    .setContact(
      'Heallink Support',
      'https://heallink.example.com/support',
      'support@heallink.example.com',
    )
    .setLicense('Private License', 'https://heallink.example.com/license')
    .setExternalDoc(
      'Additional Documentation',
      'https://heallink.example.com/docs',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    deepScanRoutes: true,
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });

  // Setup the Swagger UI
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      docExpansion: 'none',
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      tryItOutEnabled: true,
    },
    customSiteTitle: 'Heallink API Documentation',
    customCssUrl: '/swagger-theme.css',
    customfavIcon: '/favicon.ico',
  });

  const port = configService.get<number>('port') || 3003;
  await app.listen(port);

  const serverUrl = `http://localhost:${port}`;
  loggingService.logSystem('Server started', {
    port,
    apiUrl: `${serverUrl}/api/v1`,
    docsUrl: `${serverUrl}/api/docs`,
  });

  loggingService.log(`API is running on: ${serverUrl}/api/v1`);
  loggingService.log(`API Documentation available at: ${serverUrl}/api/docs`);
}

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Application specific logging
  process.exit(1);
});

bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
  process.exit(1);
});
