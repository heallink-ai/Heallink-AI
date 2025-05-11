"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [authMethod, setAuthMethod] = useState<"email" | "phone" | "social">("email");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("email", {
        email,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError("Failed to sign in. Please try again.");
      } else {
        router.push("/auth/verify-request");
      }
    } catch (error) {
      setError("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Here you would implement sending OTP logic
      // For demo purposes, we'll just simulate it
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setOtpSent(true);
    } catch (error) {
      setError("Failed to send OTP. Please try again.");
    }

    setIsLoading(false);
  };

  const handlePhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("phone", {
        phone,
        otp,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError("Invalid OTP. Please try again.");
      } else {
        router.push(callbackUrl);
      }
    } catch (error) {
      setError("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Sign in to Heallink</h1>
          <p className="mt-2 text-gray-600">
            Your health companion
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md">
            {error}
          </div>
        )}

        <div className="flex justify-center space-x-4 my-6">
          <button
            type="button"
            className={`px-4 py-2 rounded-md ${
              authMethod === "email" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setAuthMethod("email")}
          >
            Email
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-md ${
              authMethod === "phone" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setAuthMethod("phone")}
          >
            Phone
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-md ${
              authMethod === "social" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setAuthMethod("social")}
          >
            Social
          </button>
        </div>

        {authMethod === "email" && (
          <form onSubmit={handleEmailSignIn} className="mt-8 space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLoading ? "Signing in..." : "Sign in with Email"}
              </button>
            </div>
          </form>
        )}

        {authMethod === "phone" && (
          <div className="mt-8 space-y-6">
            {!otpSent ? (
              <form onSubmit={handleSendOtp}>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="+1234567890"
                  />
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {isLoading ? "Sending..." : "Send OTP"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handlePhoneSignIn}>
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                    Enter OTP sent to {phone}
                  </label>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="123456"
                  />
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {isLoading ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>

                <div className="mt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    Change phone number
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {authMethod === "social" && (
          <div className="mt-8 space-y-4">
            <button
              onClick={() => signIn("google", { callbackUrl })}
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {/* Google icon */}
                <svg className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.545 12.151L12.545 12.151L12.545 12.151L12.545 12.151L12.545 12.151L12.545 12.151L12.545 12.151L12.545 12.151M12.545 10.126L12.545 10.126L9.218 10.126L9.218 12.151L12.545 12.151C12.302 13.255 11.293 14.082 10.071 14.082C8.654 14.082 7.5 12.928 7.5 11.51C7.5 10.093 8.654 8.939 10.071 8.939C10.699 8.939 11.275 9.166 11.71 9.545L13.255 8.001C12.383 7.211 11.283 6.735 10.071 6.735C7.439 6.735 5.295 8.878 5.295 11.51C5.295 14.143 7.439 16.286 10.071 16.286C12.703 16.286 14.847 14.143 14.847 11.51C14.847 11.042 14.765 10.593 14.613 10.173L12.545 10.126Z" />
                </svg>
              </span>
              Sign in with Google
            </button>

            <button
              onClick={() => signIn("facebook", { callbackUrl })}
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {/* Facebook icon */}
                <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.099 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.79-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97H15.83c-1.491 0-1.956.93-1.956 1.886v2.266h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.099 24 12.073z" />
                </svg>
              </span>
              Sign in with Facebook
            </button>

            <button
              onClick={() => signIn("apple", { callbackUrl })}
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {/* Apple icon */}
                <svg className="h-5 w-5 text-gray-900" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.94 5.19A4.38 4.38 0 0 0 16 2.5a4.38 4.38 0 0 0-3.1 1.49 4.59 4.59 0 0 0-1.08 2.81 3.23 3.23 0 0 0 3.12-1.61z" />
                  <path d="M18.56 15.47c0-2.94 2.48-4.43 2.53-4.46A5.4 5.4 0 0 0 19 7c-1.43-.14-2.74.78-3.44.78-.72 0-1.81-.76-3-.74A5.48 5.48 0 0 0 8.21 9.5c-1.98 3.36-.52 8.28 1.37 11 .96 1.34 2.07 2.85 3.52 2.8 1.41-.06 1.95-.89 3.65-.89s2.18.89 3.67.84c1.53-.02 2.5-1.34 3.41-2.7a11.3 11.3 0 0 0 1.56-3.18 5.04 5.04 0 0 1-3.12-4.55 5.35 5.35 0 0 1 2.58-4.47 5.57 5.57 0 0 0-4.29-2.28c-1.67-.17-3.28.96-4.3.96-.95 0-2.45-.93-4.02-.92A5.81 5.81 0 0 0 3.77 9.7c-1.43 2.47-.37 6.1 1 8.14.7 1 1.5 2.05 2.55 2 1.03-.02 1.41-.65 2.65-.65 1.21 0 1.57.65 2.63.63 1.09-.01 1.77-.97 2.43-1.93a8.35 8.35 0 0 0 1.11-2.26 4.94 4.94 0 0 1-2.33-4.24c-.03-2.78 2.33-4.04 2.4-4.13A5.12 5.12 0 0 0 11.96 4a5.41 5.41 0 0 0-1.34 3.15c.87.66 2.28 1.13 3.74 1.13 1.44 0 2.89-.47 3.78-1.13a5.95 5.95 0 0 0-1.25-3.1c-.75-.91-1.77-1.46-2.9-1.56a4.94 4.94 0 0 0-2.9 1.35 4.8 4.8 0 0 0-1.5 3.14A4.45 4.45 0 0 0 11 9.5c.65.14 1.32.22 2 .22a9.08 9.08 0 0 0 2-.22 5.2 5.2 0 0 0 1.5-3.14c0-1.2-.37-2.36-1.06-3.17z" />
                </svg>
              </span>
              Sign in with Apple
            </button>
          </div>
        )}
      </div>
    </div>
  );
}