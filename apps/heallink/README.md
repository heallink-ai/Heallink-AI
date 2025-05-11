# Heallink User Application

The main Heallink application for patients to access healthcare services.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Authentication Setup

This application uses Auth.js (formerly NextAuth.js) for authentication with multiple providers:

- Email authentication
- Phone authentication (OTP)
- Social authentication (Google, Facebook, Apple)

### Configuration

1. Copy the `.env.local.example` file to `.env.local`:

```bash
cp .env.local.example .env.local
```

2. Fill in the environment variables with your credentials:

- `NEXTAUTH_SECRET`: A random string used to hash tokens, sign cookies and generate cryptographic keys. You can generate one using `openssl rand -base64 32`
- `NEXTAUTH_URL`: The canonical URL of your site

### OAuth Providers Setup

#### Google

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Go to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Set the application type to "Web application"
6. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google` (and your production URL)
7. Copy Client ID and Client Secret to your `.env.local` file

#### Facebook

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add the Facebook Login product
4. Configure the OAuth settings with redirect URI: `http://localhost:3000/api/auth/callback/facebook` (and your production URL)
5. Copy App ID and App Secret to your `.env.local` file

#### Apple

1. Go to the [Apple Developer Portal](https://developer.apple.com/)
2. Navigate to "Certificates, IDs & Profiles"
3. Register a new App ID with "Sign In with Apple" capability
4. Create a Services ID for web authentication
5. Configure the domain and return URL (redirect URL): `http://localhost:3000/api/auth/callback/apple` (and your production URL)
6. Copy Client ID and Client Secret Key to your `.env.local` file

### Email Provider Setup

For email authentication, you'll need an SMTP server or email delivery service. We recommend using [Resend](https://resend.com/) for reliable email delivery.

1. Sign up for a Resend account
2. Create an API key
3. Add the API key to your `.env.local` file as `RESEND_API_KEY`

### Phone Authentication

The phone authentication uses a custom credentials provider with OTP verification. In a production environment, you'll need to implement the actual OTP sending and verification logic, potentially using a service like Twilio or Firebase Authentication.

## Authentication Pages

The following authentication pages are included:

- Sign In: `/auth/signin`
- Sign Out: `/auth/signout`
- Error: `/auth/error`
- Verify Request: `/auth/verify-request` (for email verification)
- New User: `/auth/new-user` (for new user profile completion)

## Protected Routes

Routes that require authentication should be placed inside the `/dashboard` directory. The authentication middleware will automatically redirect unauthenticated users to the sign-in page.