import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Import API client for custom authentication
import { loginAdminUser } from "./api/auth-api";
import { UserRole } from "./types/auth-types";

// Helper function to check if credentials are admin-only
function isAdminRole(role?: UserRole): boolean {
  return role === UserRole.ADMIN;
}

// Force Node.js runtime
export const runtime = "nodejs";

export const authConfig: NextAuthConfig = {
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/",
    signOut: "/signout",
    error: "/error",
    verifyRequest: "/auth-required",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      // Public paths - no auth required
      const publicPaths = [
        "/",
        "/error",
        "/reset-password",
        "/auth-required",
        "/api/reset-password",
      ];

      const isPublicPath = publicPaths.some(
        (path) =>
          nextUrl.pathname === path ||
          nextUrl.pathname.startsWith(path + "/") ||
          nextUrl.pathname.startsWith("/api/")
      );

      // If the path doesn't require authentication or user is logged in, allow access
      if (isPublicPath || isLoggedIn) {
        // If logged in and trying to access login page, redirect to dashboard
        if (nextUrl.pathname === "/" && isLoggedIn) {
          return Response.redirect(new URL("/dashboard", nextUrl.origin));
        }
        return true;
      }

      // Otherwise, redirect to login
      const redirectUrl = new URL("/auth-required", nextUrl.origin);
      redirectUrl.searchParams.append("callbackUrl", nextUrl.href);
      return Response.redirect(redirectUrl);
    },
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        // Ensure only admin users can sign in
        if (!isAdminRole(user.role as UserRole)) {
          throw new Error("Access denied. Admin access only.");
        }

        // Store the API access and refresh tokens
        if (account.provider === "credentials") {
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
    // Admin credentials provider (email/password only)
    CredentialsProvider({
      id: "credentials",
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Call our API to validate admin credentials
          const { data, error } = await loginAdminUser({
            email: credentials.email as string,
            password: credentials.password as string,
          });

          if (error || !data) {
            return null;
          }

          // Validate that the user has admin role
          if (!isAdminRole(data.user.role)) {
            console.error("Non-admin user attempted to access admin panel");
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
          console.error("Error in admin authentication:", error);
          return null;
        }
      },
    }),
  ],
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
