# Heallink API

NestJS backend API for the Heallink platform.

## Description

This API provides authentication, user management, and other services for the Heallink platform.

## Installation

```bash
$ npm install
```

## Configuration

Create a `.env` file in the root of the project with the following variables:

```
# Node environment
NODE_ENV=development
PORT=3003

# Database
DATABASE_URL=mongodb://localhost:27018/heallink

# JWT
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-jwt-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001,http://localhost:3002

# Social providers configuration (if needed)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
APPLE_ID=your-apple-id
APPLE_SECRET=your-apple-secret
```

> **Note**: The Facebook OAuth variables were previously named `FACEBOOK_APP_ID` and `FACEBOOK_APP_SECRET`. They have been renamed to `FACEBOOK_CLIENT_ID` and `FACEBOOK_CLIENT_SECRET`.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API Documentation

Once the application is running, you can access the Swagger API documentation at:

```
http://localhost:3003/api/v1/docs
```

## Authentication Endpoints

### Register a new user

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourpassword",
  "name": "User Name"
}
```

Or register with phone:

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "phone": "+1234567890",
  "password": "yourpassword",
  "name": "User Name"
}
```

### Login with email/password

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

Or login with phone:

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "phone": "+1234567890",
  "password": "yourpassword"
}
```

### Social login

```http
POST /api/v1/auth/social-login
Content-Type: application/json

{
  "provider": "google", // or "facebook", "apple"
  "token": "token-from-social-provider"
}
```

### Phone OTP Authentication

Send OTP:

```http
POST /api/v1/auth/send-otp
Content-Type: application/json

{
  "phone": "+1234567890"
}
```

Verify OTP:

```http
POST /api/v1/auth/verify-otp
Content-Type: application/json

{
  "phone": "+1234567890",
  "otp": "123456"
}
```

### Refresh Token

```http
POST /api/v1/auth/refresh-token
Authorization: Bearer your-refresh-token
```

### Logout

```http
POST /api/v1/auth/logout
Authorization: Bearer your-access-token
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Docker

The API can be run in Docker using the provided Dockerfile and Docker Compose configuration.

```bash
# Development
docker-compose up api

# Production
docker build -t heallink-api:prod -f Dockerfile .
docker run -p 3003:3003 heallink-api:prod
```
