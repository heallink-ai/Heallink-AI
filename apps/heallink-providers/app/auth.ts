import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";

// Import API client for custom authentication
import { loginProvider, refreshAuthToken, socialLogin } from "./api/auth-api";
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
const authLog = (...args: unknown[]) => {
  if (DEBUG) {
    console.log("[Auth Debug]", ...args);
  }
};

export const authConfig: NextAuthConfig = {
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/signin",
    signOut: "/signout",
    error: "/error",
    verifyRequest: "/verify-request",
    newUser: "/new-user",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected = nextUrl.pathname.startsWith("/dashboard");
      const isHomepage = nextUrl.pathname === "/";
      const isAuthPage =
        nextUrl.pathname.startsWith("/signin") ||
        nextUrl.pathname.startsWith("/signup");

      // Redirect logged-in users away from auth pages to dashboard
      if (isLoggedIn && isAuthPage) {
        return Response.redirect(new URL("/dashboard", nextUrl.origin));
      }

      // Redirect logged-in users from homepage to dashboard
      if (isLoggedIn && isHomepage) {
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
    async jwt({ token, user, account, profile }) {
      // Initial sign in
      if (account && user) {
        authLog("JWT Callback - Initial Sign In:", {
          provider: account.provider,
          tokenType: account?.token_type,
          user: user,
          profile: profile,
        });

        // Store the API access and refresh tokens from custom providers
        if (account.provider === "credentials") {
          token.accessToken = user.accessToken;
          token.refreshToken = user.refreshToken;
          token.role = user.role;
        }

        // Handle Google OAuth token
        if (account.provider === "google" && account.id_token) {
          try {
            authLog("Handling Google token");

            // For Google OAuth, ensure we preserve the profile picture
            if (user.image) {
              token.picture = user.image;
              token.image = user.image; // Set both for compatibility
            }

            const { data, error } = await socialLogin(
              AuthProvider.GOOGLE,
              account.id_token,
              user.email,
              user.name
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

            // Preserve image URLs - prioritize API response but fall back to OAuth
            if (data.user.image) {
              token.image = data.user.image;
            } else if (token.picture) {
              token.image = token.picture;
            }

            authLog("Google authentication successful");
          } catch (error) {
            authLog("Error in Google token processing:", error);
            // Preserve the Google image even if social login fails
            if (user.image) {
              token.image = user.image;
            }
          }
        }

        return {
          ...token,
          ...user,
          provider: account.provider,
        };
      }

      // Handle token refresh - check if access token is about to expire
      if (token.accessToken) {
        try {
          // Check expiration of the token
          const decodedToken = jwtDecode<{ exp: number }>(
            token.accessToken as string
          );
          const currentTime = Math.floor(Date.now() / 1000);
          const timeUntilExpiry = decodedToken.exp - currentTime;

          // If token expires in less than 5 minutes, refresh it
          if (timeUntilExpiry < 300) {
            authLog("Access token expiring soon, attempting refresh");
            const refreshResult = await refreshAuthToken(
              token.refreshToken as string
            );

            if (refreshResult.data) {
              authLog("Token refreshed successfully");
              token.accessToken = refreshResult.data.accessToken;
              token.refreshToken = refreshResult.data.refreshToken;
            } else {
              authLog("Token refresh failed:", refreshResult.error);
            }
          }
        } catch (error) {
          authLog("Error checking/refreshing token:", error);
        }
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

        // Add image if available
        if (token.image) {
          session.user.image = token.image as string;
        }
      }
      return session;
    },
  },
  providers: [
    // Google OAuth provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
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
          const { data, error } = await loginProvider({
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
