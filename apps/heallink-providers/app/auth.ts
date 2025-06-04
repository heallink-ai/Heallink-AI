import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Import API client for custom authentication
import { loginUser } from "./api/auth-api";

// Force Node.js runtime
export const runtime = "nodejs";

// Enable console debugging in development
const DEBUG = process.env.NODE_ENV === "development";

// Log helper for debugging
const authLog = (...args: unknown[]) => {
  if (DEBUG) {
    console.log("[Auth Debug]", ...args);
  }
};

export const authConfig: NextAuthConfig = {
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/signin",
    // Remove or comment out the signOut page since we don't have one
    // signOut: "/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/new-user",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected = nextUrl.pathname.startsWith("/dashboard");
      const isHomepage = nextUrl.pathname === "/";
      const isAuthPage = nextUrl.pathname.startsWith("/signin") || nextUrl.pathname.startsWith("/signup");
      const isSignOutPage = nextUrl.pathname === "/signout";

      // Allow access to sign-out page without redirect
      if (isSignOutPage) {
        return true;
      }

      // Redirect logged-in users away from auth pages to dashboard
      if (isLoggedIn && isAuthPage) {
        return Response.redirect(new URL("/dashboard", nextUrl.origin));
      }

      // Only redirect logged-in users from homepage to dashboard if they're not signing out
      if (isLoggedIn && isHomepage && !nextUrl.searchParams.has('signout')) {
        return Response.redirect(new URL("/dashboard", nextUrl.origin));
      }

      // Redirect unauthenticated users from protected routes
      if (isProtected && !isLoggedIn) {
        const redirectUrl = new URL("/signin", nextUrl.origin);
        redirectUrl.searchParams.append("callbackUrl", nextUrl.href);
        return Response.redirect(redirectUrl);
      }

      return true;
    },
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        authLog("JWT Callback - Initial Sign In:", {
          provider: account.provider,
          user: user,
        });

        // Store the API access and refresh tokens from custom providers
        if (account.provider === "credentials") {
          token.accessToken = user.accessToken;
          token.refreshToken = user.refreshToken;
          token.role = user.role;
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

        // Ensure the role is included
        if (token.role) {
          session.user.role = token.role as string;
        }

        // Add API tokens to session
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
      }
      return session;
    },
  },
  providers: [
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
          // For development, use dummy data
          if (process.env.NODE_ENV === "development") {
            // Demo credentials for testing
            if (
              credentials.email === "provider@heallink.com" &&
              credentials.password === "provider123"
            ) {
              return {
                id: "1",
                email: "provider@heallink.com",
                name: "Dr. Sarah Johnson",
                role: "PROVIDER",
                accessToken: "dummy-access-token",
                refreshToken: "dummy-refresh-token",
              };
            }
            
            if (
              credentials.email === "admin@heallink.com" &&
              credentials.password === "admin123"
            ) {
              return {
                id: "2",
                email: "admin@heallink.com",
                name: "Dr. Michael Chen",
                role: "ADMIN",
                accessToken: "dummy-access-token-admin",
                refreshToken: "dummy-refresh-token-admin",
              };
            }
            
            return null;
          }

          // Call our API to validate credentials (for production)
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
  ],
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);