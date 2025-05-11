// Types that match the API auth types

export enum UserRole {
  USER = 'user',
  PROVIDER = 'provider',
  ADMIN = 'admin',
}

export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  APPLE = 'apple',
}

export interface User {
  id: string;
  email?: string;
  phone?: string;
  name?: string;
  role: UserRole;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  providers?: AuthProvider[];
  accounts?: Array<{ provider: AuthProvider; providerId: string }>;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}