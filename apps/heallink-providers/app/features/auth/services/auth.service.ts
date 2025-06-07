import { signIn, signOut, getSession } from "next-auth/react";
import {
  LoginFormData,
  SignupFormData,
  AuthResponse,
  OTPVerificationData,
  Provider,
} from "../types/auth.types";

class AuthService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003";

  async login(data: LoginFormData): Promise<AuthResponse> {
    try {
      if (data.email) {
        // Email login
        const result = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (result?.error) {
          return {
            success: false,
            message:
              result.error || "Login failed. Please check your credentials.",
          };
        }

        return {
          success: true,
          redirectUrl: "/dashboard",
        };
      } else if (data.phone) {
        // Phone login - redirect to OTP verification
        return {
          success: true,
          message: "Please verify your phone number",
          redirectUrl: `/verify-otp?phone=${encodeURIComponent(data.phone)}&type=login`,
        };
      }

      return {
        success: false,
        message: "Either email or phone is required.",
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An error occurred during authentication. Please try again.",
      };
    }
  }

  async signup(data: SignupFormData): Promise<AuthResponse> {
    try {
      // For email signup, we'll call our API directly
      // This will be handled by NextAuth callbacks for actual authentication

      // For phone signup, redirect to OTP verification
      if (data.phone && !data.email) {
        return {
          success: true,
          message: "Please verify your phone number",
          redirectUrl: `/verify-otp?phone=${encodeURIComponent(data.phone)}&type=signup`,
        };
      }

      // Redirect to sign in after signup
      return {
        success: true,
        message: "Account created successfully. Please sign in.",
        redirectUrl: `/signin?registered=true`,
      };
    } catch (error) {
      console.error("Signup error:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An error occurred during registration. Please try again.",
      };
    }
  }

  async verifyOTP(data: OTPVerificationData): Promise<AuthResponse> {
    try {
      // We'll implement phone-based verification later
      // For now, just simulate success

      if (data.code.length === 6) {
        if (data.type === "signup") {
          return {
            success: true,
            message: "Phone verified successfully",
            redirectUrl: "/signin?registered=true",
          };
        } else {
          return {
            success: true,
            redirectUrl: "/dashboard",
          };
        }
      } else {
        return {
          success: false,
          message: "Invalid verification code. Please try again.",
        };
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      return {
        success: false,
        message: "Invalid verification code. Please try again.",
      };
    }
  }

  async socialLogin(provider: string): Promise<AuthResponse> {
    try {
      // NextAuth will handle the redirect to the provider
      await signIn(provider, { callbackUrl: "/dashboard" });

      // This will not be reached due to the redirect
      return {
        success: true,
        redirectUrl: "/dashboard",
      };
    } catch (error) {
      console.error(`${provider} login error:`, error);
      return {
        success: false,
        message: `Failed to login with ${provider}. Please try again.`,
      };
    }
  }

  async resendOTP(credential: string): Promise<AuthResponse> {
    try {
      console.log("Resending OTP to:", credential);
      // TODO: Implement resend OTP logic

      return {
        success: true,
        message: "Verification code sent successfully.",
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to resend code. Please try again.",
      };
    }
  }

  async logout(): Promise<void> {
    await signOut({ redirect: false });
  }

  async getCurrentProvider(): Promise<Provider | null> {
    try {
      const session = await getSession();

      if (session?.user) {
        const email = session.user.email || "";

        return {
          id: session.user.id,
          email: email,
          name: session.user.name || "",
          type: "provider",
        };
      }

      return null;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    // Since this is async, we'll just return a placeholder
    // The actual check will be done by NextAuth middleware
    return false;
  }
}

export const authService = new AuthService();
