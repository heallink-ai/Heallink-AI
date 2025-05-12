import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable CORS
  app.enableCors({
    origin: (configService.get<string>('cors.origin') || '*').split(','),
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
  console.log(`API is running on: http://localhost:${port}/api/v1`);
  console.log(
    `API Documentation available at: http://localhost:${port}/api/docs`,
  );
}
bootstrap();
