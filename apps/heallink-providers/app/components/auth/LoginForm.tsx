"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import InputField from "./InputField";
import Button from "./Button";
import SocialButton from "./SocialButton";
import PhoneInput from "./PhoneInput";

type AuthMode = "email" | "phone";

export default function LoginForm() {
  const router = useRouter();
  
  const [authMode, setAuthMode] = useState<AuthMode>("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const credential = authMode === "email" ? email : phone;
    
    if (!credential || !password) {
      setError(`Please enter both ${authMode} and password`);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // TODO: Implement actual authentication logic
      console.log("Login attempt:", { authMode, credential, password, remember });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, accept any credentials
      if (credential && password) {
        localStorage.setItem('provider', JSON.stringify({
          id: '1',
          email: authMode === "email" ? email : `${phone}@provider.com`,
          name: 'Dr. Provider',
          type: 'provider'
        }));
        
        router.push('/dashboard');
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during authentication. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    try {
      console.log(`Social login with ${provider}`);
      // TODO: Implement social authentication
      setError("Social login will be implemented soon.");
    } catch (err) {
      console.error(`${provider} login error:`, err);
      setError(`Failed to login with ${provider}. Please try again.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Auth mode toggle */}
      <div className="neumorph-flat rounded-xl p-1 flex">
        <button
          type="button"
          onClick={() => setAuthMode("email")}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            authMode === "email"
              ? "bg-gradient-to-r from-purple-heart to-royal-blue text-white shadow-lg"
              : "text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]"
          }`}
        >
          Email
        </button>
        <button
          type="button"
          onClick={() => setAuthMode("phone")}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            authMode === "phone"
              ? "bg-gradient-to-r from-purple-heart to-royal-blue text-white shadow-lg"
              : "text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]"
          }`}
        >
          Phone
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {authMode === "email" ? (
          <InputField
            id="email"
            label="Email Address"
            type="email"
            placeholder="dr.smith@hospital.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            }
          />
        ) : (
          <PhoneInput
            id="phone"
            label="Phone Number"
            placeholder="+1 (555) 123-4567"
            required
            value={phone}
            onChange={setPhone}
          />
        )}

        <InputField
          id="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          }
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-[color:var(--border)] text-purple-heart focus:ring-purple-heart/30"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-[color:var(--foreground)]"
            >
              Remember me
            </label>
          </div>

          <Link
            href="/forgot-password"
            className="text-sm font-medium text-purple-heart hover:text-purple-heart/80 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
        >
          Sign In
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[color:var(--border)]" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-[color:var(--background)] text-[color:var(--muted-foreground)]">
            Or continue with
          </span>
        </div>
      </div>

      {/* Social login buttons */}
      <div className="grid grid-cols-1 gap-3">
        <SocialButton
          provider="google"
          onClick={() => handleSocialLogin("google")}
        />
        <SocialButton
          provider="facebook"
          onClick={() => handleSocialLogin("facebook")}
        />
        <SocialButton
          provider="apple"
          onClick={() => handleSocialLogin("apple")}
        />
      </div>

      {/* Sign up link */}
      <div className="text-center">
        <p className="text-sm text-[color:var(--muted-foreground)]">
          New to Heallink?{" "}
          <Link
            href="/signup"
            className="font-medium text-purple-heart hover:text-purple-heart/80 transition-colors"
          >
            Create your provider account
          </Link>
        </p>
      </div>

      {/* Demo credentials */}
      <div className="mt-6 p-4 rounded-xl neumorph-card bg-blue-50/50 dark:bg-blue-950/20">
        <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2">Demo Access:</p>
        <div className="text-xs text-blue-600/80 dark:text-blue-400/80 space-y-1">
          <p>Email: dr.demo@heallink.com</p>
          <p>Phone: +1 (555) 123-4567</p>
          <p>Password: demo123</p>
        </div>
      </div>
    </div>
  );
}