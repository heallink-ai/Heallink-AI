import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// Import API client for custom authentication
import { loginUser, socialLogin, verifyOtp } from "./api/auth-api";
import { AuthProvider, UserRole } from "./types/auth-types";

// Force Node.js runtime
export const runtime = "nodejs";

// Helper function to check if provider credentials are configured
function isProviderConfigured(...credentials: (string | undefined)[]) {
  return credentials.every(
    (cred) => typeof cred === "string" && cred.length > 0
  );
}

// Enable console debugging in development
const DEBUG = process.env.NODE_ENV === "development";

// Log helper for debugging
const authLog = (...args: any[]) => {
  if (DEBUG) {
    console.log("[Auth Debug]", ...args);
  }
};

export const authConfig: NextAuthConfig = {
  debug: process.env.NODE_ENV === "development",
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
        const redirectUrl = new URL("/auth-required", nextUrl.origin);
        redirectUrl.searchParams.append("callbackUrl", nextUrl.href);
        return Response.redirect(redirectUrl);
      }

      return true;
    },
    async jwt({ token, user, account, profile }) {
      // Initial sign in
      if (account && user) {
        authLog("JWT Callback - Initial Sign In:", {
          provider: account.provider,
          tokenType: account.token_type,
        });

        // Store the API access and refresh tokens from custom providers
        if (account.provider === "credentials") {
          token.accessToken = user.accessToken;
          token.refreshToken = user.refreshToken;
        }

        // Handle Google OAuth token
        if (account.provider === "google" && account.id_token) {
          try {
            authLog("Handling Google token");
            const { data, error } = await socialLogin(
              AuthProvider.GOOGLE,
              account.id_token
            );

            if (error || !data) {
              authLog("Error in Google social login:", error);
              throw new Error(error || "Failed to authenticate with Google");
            }

            // Add API tokens to session
            token.accessToken = data.accessToken;
            token.refreshToken = data.refreshToken;
            token.role = data.user.role;
            token.sub = data.user.id;

            authLog("Google authentication successful");
          } catch (error) {
            authLog("Error in Google token processing:", error);
          }
        }

        // Add more provider-specific logic as needed

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

        // Ensure the role is of type UserRole
        if (token.role) {
          session.user.role = token.role as UserRole;
        }

        // Add API tokens to session
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
      }
      return session;
    },
  },
  providers: [
    // Email/Password credentials provider - always enabled
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
            email: credentials.email as string,
            password: credentials.password as string,
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
          console.error("Error in credentials authentication:", error);
          return null;
        }
      },
    }),

    // Phone authentication with credentials - always enabled
    CredentialsProvider({
      id: "phone",
      name: "Phone",
      credentials: {
        phone: {
          label: "Phone Number",
          type: "tel",
          placeholder: "+1234567890",
        },
        otp: { label: "OTP", type: "text", placeholder: "123456" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.otp) {
          return null;
        }

        try {
          // Call our API to validate OTP
          const { data, error } = await verifyOtp(
            credentials.phone as string,
            credentials.otp as string
          );

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
          console.error("Error in phone authentication:", error);
          return null;
        }
      },
    }),

    // Social providers added conditionally
    ...(isProviderConfigured(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    )
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true, // Allows linking to an existing account with the same email
          }),
        ]
      : []),
  ],
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
