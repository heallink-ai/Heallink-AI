import "next-auth";
import { UserRole, AdminRole } from "./auth-types";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: UserRole;
      adminRole?: AdminRole;
      permissions?: string[];
      provider?: string;
    };
    accessToken?: string;
    refreshToken?: string;
  }

  interface User {
    id: string;
    name?: string;
    email?: string;
    image?: string;
    role?: UserRole;
    adminRole?: AdminRole;
    permissions?: string[];
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub: string;
    role?: UserRole;
    adminRole?: AdminRole;
    permissions?: string[];
    provider?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}
