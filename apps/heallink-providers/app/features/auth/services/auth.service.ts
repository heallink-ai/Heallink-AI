import { LoginFormData, SignupFormData, AuthResponse, OTPVerificationData, Provider } from '../types/auth.types';

class AuthService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';

  async login(data: LoginFormData): Promise<AuthResponse> {
    try {
      // TODO: Replace with actual API call
      console.log("Login attempt:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, accept any credentials
      const credential = data.email || data.phone;
      if (credential && data.password) {
        const provider: Provider = {
          id: '1',
          email: data.email || `${data.phone}@provider.com`,
          name: 'Dr. Provider',
          type: 'provider',
          verified: true
        };
        
        // Store in localStorage for demo
        localStorage.setItem('provider', JSON.stringify(provider));
        
        return {
          success: true,
          provider,
          redirectUrl: '/dashboard'
        };
      } else {
        return {
          success: false,
          message: "Invalid credentials. Please try again."
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: "An error occurred during authentication. Please try again."
      };
    }
  }

  async signup(data: SignupFormData): Promise<AuthResponse> {
    try {
      // TODO: Replace with actual API call
      console.log("Signup attempt:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const credential = data.email || data.phone;
      
      return {
        success: true,
        message: "Account created successfully. Please verify your email/phone.",
        redirectUrl: `/verify-otp?${data.email ? 'email' : 'phone'}=${encodeURIComponent(credential)}&type=signup`
      };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        message: "An error occurred during registration. Please try again."
      };
    }
  }

  async verifyOTP(data: OTPVerificationData): Promise<AuthResponse> {
    try {
      // TODO: Replace with actual API call
      console.log("OTP verification:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, accept any 6-digit code
      if (data.code.length === 6) {
        if (data.type === "signup") {
          const provider: Provider = {
            id: '1',
            email: data.credential.includes('@') ? data.credential : `${data.credential}@provider.com`,
            name: 'Dr. Provider',
            type: 'provider',
            verified: true
          };
          
          localStorage.setItem('provider', JSON.stringify(provider));
          
          return {
            success: true,
            provider,
            redirectUrl: '/dashboard'
          };
        } else {
          return {
            success: true,
            redirectUrl: '/reset-password'
          };
        }
      } else {
        return {
          success: false,
          message: "Invalid verification code. Please try again."
        };
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      return {
        success: false,
        message: "Invalid verification code. Please try again."
      };
    }
  }

  async socialLogin(provider: string): Promise<AuthResponse> {
    try {
      console.log(`Social login with ${provider}`);
      // TODO: Implement social authentication
      return {
        success: false,
        message: "Social login will be implemented soon."
      };
    } catch (error) {
      console.error(`${provider} login error:`, error);
      return {
        success: false,
        message: `Failed to login with ${provider}. Please try again.`
      };
    }
  }

  async resendOTP(credential: string): Promise<AuthResponse> {
    try {
      console.log("Resending OTP to:", credential);
      // TODO: Implement resend OTP logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: "Verification code sent successfully."
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to resend code. Please try again."
      };
    }
  }

  logout(): void {
    localStorage.removeItem('provider');
  }

  getCurrentProvider(): Provider | null {
    try {
      const provider = localStorage.getItem('provider');
      return provider ? JSON.parse(provider) : null;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return this.getCurrentProvider() !== null;
  }
}

export const authService = new AuthService();