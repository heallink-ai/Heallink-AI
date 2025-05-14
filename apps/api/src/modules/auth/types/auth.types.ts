import { AuthProvider } from '../../users/schemas/user.schema';

/**
 * Represents a user payload after successful authentication,
 * with sensitive data (like password, refresh token) removed
 */
export interface UserPayload {
  _id: string;
  email?: string;
  phone?: string;
  name?: string;
  role: string;
  emailVerified?: boolean;
  [key: string]: any;
}

/**
 * Data structure for provider information during social login
 */
export interface ProviderData {
  provider: AuthProvider;
  providerId: string;
  email?: string;
  name?: string;
  phone?: string;
}
