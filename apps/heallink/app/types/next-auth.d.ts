import "next-auth";
import { UserRole } from "./auth-types";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: UserRole;
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
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub: string;
    role?: UserRole;
    provider?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}
