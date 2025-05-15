import { Types } from 'mongoose';
import { AuthProvider, UserRole } from '../../users/schemas/user.schema';

/**
 * Represents a user payload after successful authentication,
 * with sensitive data (like password, refresh token) removed
 */
export interface UserPayload {
  _id: Types.ObjectId | string;
  email?: string;
  phone?: string;
  name?: string;
  role: UserRole;
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
  phone?: string;
  name?: string;
  picture?: string; // Profile image URL
}

/**
 * Google OAuth2 token verification response
 */
export interface GoogleTokenVerificationResponse {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  aud: string;
  exp: number;
}

/**
 * Facebook Graph API user response
 */
export interface FacebookUserResponse {
  id: string;
  name?: string;
  email: string;
  picture?: {
    data: {
      url: string;
    };
  };
}

/**
 * Facebook Debug Token API response
 */
export interface FacebookDebugTokenResponse {
  data: {
    is_valid: boolean;
    app_id: string;
    user_id: string;
    expires_at: number;
  };
}

/**
 * Apple ID token payload
 */
export interface AppleTokenPayload {
  sub: string;
  email: string;
  email_verified?: boolean;
  name?: string;
  aud: string;
  iss: string;
  exp: number;
}

/**
 * Apple public key structure
 */
export interface AppleKey {
  kid: string;
  alg: string;
  kty: string;
  use: string;
  n: string;
  e: string;
}

/**
 * Apple public keys response
 */
export interface AppleKeysResponse {
  keys: AppleKey[];
}
