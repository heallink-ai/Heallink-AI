import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import AppleProvider from "next-auth/providers/apple";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { Resend } from 'resend';

// Import API client for custom authentication
import { loginUser, socialLogin, verifyOtp } from './api/auth-api';
import { AuthProvider } from './types/auth-types';

// Initialize Resend for email delivery
const resend = new Resend(process.env.RESEND_API_KEY);

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/new-user",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected = nextUrl.pathname.startsWith("/dashboard");
      
      if (isProtected && !isLoggedIn) {
        const redirectUrl = new URL("/auth/signin", nextUrl.origin);
        redirectUrl.searchParams.append("callbackUrl", nextUrl.href);
        return Response.redirect(redirectUrl);
      }
      
      return true;
    },
    async jwt({ token, user, account, trigger }) {
      // Initial sign in
      if (account && user) {
        // Store the API access and refresh tokens from custom providers
        if (account.provider === 'credentials') {
          token.accessToken = user.accessToken;
          token.refreshToken = user.refreshToken;
        }

        return {
          ...token,
          ...user,
          provider: account.provider,
        };
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
        session.user.provider = token.provider as string;
        session.user.role = token.role as string;
        
        // Add API tokens to session
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
      }
      return session;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Custom profile callback to integrate with our backend
      profile: async (profile, tokens) => {
        // Call our API to handle social login and get our internal tokens
        const { data, error } = await socialLogin(
          AuthProvider.GOOGLE,
          tokens.id_token as string
        );

        if (error || !data) {
          throw new Error(error || 'Failed to authenticate with Google');
        }

        return {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          image: profile.picture,
          role: data.user.role,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        };
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      // Custom profile callback to integrate with our backend
      profile: async (profile, tokens) => {
        // Call our API to handle social login and get our internal tokens
        const { data, error } = await socialLogin(
          AuthProvider.FACEBOOK,
          tokens.access_token as string
        );

        if (error || !data) {
          throw new Error(error || 'Failed to authenticate with Facebook');
        }

        return {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          image: profile.picture.data.url,
          role: data.user.role,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        };
      },
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID!,
      clientSecret: process.env.APPLE_SECRET!,
      // Custom profile callback to integrate with our backend
      profile: async (profile, tokens) => {
        // Call our API to handle social login and get our internal tokens
        const { data, error } = await socialLogin(
          AuthProvider.APPLE,
          tokens.id_token as string
        );

        if (error || !data) {
          throw new Error(error || 'Failed to authenticate with Apple');
        }

        return {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        };
      },
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      // Custom email verification handler using Resend
      async sendVerificationRequest({
        identifier: email,
        url,
        provider,
      }) {
        try {
          const { data, error } = await resend.emails.send({
            from: 'onboarding@heallink.com',
            to: email,
            subject: 'Sign in to Heallink',
            html: `
              <body>
                <h1>Welcome to Heallink</h1>
                <p>Click the link below to sign in:</p>
                <a href="${url}">Sign in</a>
              </body>
            `,
          });

          if (error) {
            throw new Error(`Email could not be sent: ${error.message}`);
          }
        } catch (error) {
          console.error('Error sending verification email', error);
          throw new Error('SEND_VERIFICATION_EMAIL_ERROR');
        }
      },
    }),
    // Email/Password credentials provider
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Call our API to validate credentials
          const { data, error } = await loginUser({
            email: credentials.email,
            password: credentials.password,
          });

          if (error || !data) {
            return null;
          }

          // Return user with tokens for JWT callback
          return {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          };
        } catch (error) {
          return null;
        }
      },
    }),
    // Phone authentication with credentials
    CredentialsProvider({
      id: "phone",
      name: "Phone",
      credentials: {
        phone: { label: "Phone Number", type: "tel", placeholder: "+1234567890" },
        otp: { label: "OTP", type: "text", placeholder: "123456" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.otp) {
          return null;
        }

        try {
          // Call our API to validate OTP
          const { data, error } = await verifyOtp(credentials.phone, credentials.otp);

          if (error || !data) {
            return null;
          }

          // Return user with tokens for JWT callback
          return {
            id: data.user.id,
            name: data.user.name,
            phone: data.user.phone,
            email: data.user.email,
            role: data.user.role,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);