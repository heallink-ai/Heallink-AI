export enum UserRole {
  USER = "user",
  PROVIDER = "provider",
  ADMIN = "admin",
}

export enum AuthProvider {
  LOCAL = "local",
  GOOGLE = "google",
  FACEBOOK = "facebook",
  APPLE = "apple",
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface Session {
  user: User;
  accessToken?: string;
  refreshToken?: string;
}

declare module "next-auth" {
  interface User {
    role?: string;
    accessToken?: string;
    refreshToken?: string;
  }

  interface Session {
    user: User;
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    accessToken?: string;
    refreshToken?: string;
    provider?: string;
  }
}
