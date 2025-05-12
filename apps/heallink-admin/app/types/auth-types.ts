// Types that match the API auth types

export enum UserRole {
  USER = "user",
  PROVIDER = "provider",
  ADMIN = "admin",
}

export enum AuthProvider {
  CREDENTIALS = "credentials",
  GOOGLE = "google",
  FACEBOOK = "facebook",
  APPLE = "apple",
  PHONE = "phone",
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  emailVerified?: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
