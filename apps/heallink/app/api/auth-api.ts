/**
 * API client for interacting with the NestJS authentication API.
 * This bridges the Auth.js frontend authentication with the NestJS backend.
 */

import { AuthProvider } from '@/app/types/auth-types';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api/v1';

/**
 * Register a new user with email/phone and password
 */
export async function registerUser(userData: {
  email?: string;
  phone?: string;
  name?: string;
  password: string;
}): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { error: data.message || 'Registration failed' };
    }
    
    return { data };
  } catch (error) {
    return { error: 'Network error' };
  }
}

/**
 * Login with email/phone and password
 */
export async function loginUser(credentials: {
  email?: string;
  phone?: string;
  password: string;
}): Promise<ApiResponse<{ accessToken: string; refreshToken: string; user: any }>> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { error: data.message || 'Login failed' };
    }
    
    return { data };
  } catch (error) {
    return { error: 'Network error' };
  }
}

/**
 * Social login with token from provider
 */
export async function socialLogin(provider: AuthProvider, token: string): Promise<ApiResponse<{ accessToken: string; refreshToken: string; user: any }>> {
  try {
    const response = await fetch(`${API_URL}/auth/social-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ provider, token }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { error: data.message || 'Social login failed' };
    }
    
    return { data };
  } catch (error) {
    return { error: 'Network error' };
  }
}

/**
 * Send OTP to phone number
 */
export async function sendOtp(phone: string): Promise<ApiResponse<{ success: boolean }>> {
  try {
    const response = await fetch(`${API_URL}/auth/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { error: data.message || 'Failed to send OTP' };
    }
    
    return { data };
  } catch (error) {
    return { error: 'Network error' };
  }
}

/**
 * Verify OTP and login/register user
 */
export async function verifyOtp(phone: string, otp: string): Promise<ApiResponse<{ accessToken: string; refreshToken: string; user: any }>> {
  try {
    const response = await fetch(`${API_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, otp }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { error: data.message || 'Invalid OTP' };
    }
    
    return { data };
  } catch (error) {
    return { error: 'Network error' };
  }
}

/**
 * Refresh access token
 */
export async function refreshToken(refreshToken: string): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> {
  try {
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshToken}`,
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { error: data.message || 'Failed to refresh token' };
    }
    
    return { data };
  } catch (error) {
    return { error: 'Network error' };
  }
}

/**
 * Logout user
 */
export async function logoutUser(accessToken: string): Promise<ApiResponse<{ message: string }>> {
  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { error: data.message || 'Logout failed' };
    }
    
    return { data };
  } catch (error) {
    return { error: 'Network error' };
  }
}