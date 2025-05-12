"use client";

import { useState } from "react";

interface SocialButtonsProps {
  className?: string;
}

export default function SocialButtons({ className = "" }: SocialButtonsProps) {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleSocialLogin = (provider: string) => {
    setLoadingProvider(provider);
    // In a real implementation, this would trigger the OAuth flow
    setTimeout(() => setLoadingProvider(null), 2000);
  };

  return (
    <div className={`flex flex-col space-y-4 w-full ${className}`}>
      <button
        onClick={() => handleSocialLogin("google")}
        disabled={loadingProvider !== null}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-transparent neumorph-flat border border-gray-300 dark:border-gray-700 hover:border-purple-heart/50 dark:hover:border-purple-heart/50 transition-all duration-300"
      >
        {loadingProvider === "google" ? (
          <div className="w-5 h-5 border-2 border-purple-heart border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        )}
        <span className="text-sm font-medium light-text-contrast">
          {loadingProvider === "google" ? "Connecting..." : "Continue with Google"}
        </span>
      </button>

      <button
        onClick={() => handleSocialLogin("facebook")}
        disabled={loadingProvider !== null}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-transparent neumorph-flat border border-gray-300 dark:border-gray-700 hover:border-purple-heart/50 dark:hover:border-purple-heart/50 transition-all duration-300"
      >
        {loadingProvider === "facebook" ? (
          <div className="w-5 h-5 border-2 border-purple-heart border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        )}
        <span className="text-sm font-medium light-text-contrast">
          {loadingProvider === "facebook" ? "Connecting..." : "Continue with Facebook"}
        </span>
      </button>

      <button
        onClick={() => handleSocialLogin("apple")}
        disabled={loadingProvider !== null}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-transparent neumorph-flat border border-gray-300 dark:border-gray-700 hover:border-purple-heart/50 dark:hover:border-purple-heart/50 transition-all duration-300"
      >
        {loadingProvider === "apple" ? (
          <div className="w-5 h-5 border-2 border-purple-heart border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.6 13.8c0-3 2.5-4.5 2.6-4.6-1.4-2.1-3.6-2.3-4.4-2.4-1.9-.2-3.6 1.1-4.6 1.1-.9 0-2.4-1.1-4-1-2 0-3.9 1.2-5 3-2.1 3.7-.5 9.1 1.5 12.1 1 1.5 2.2 3.1 3.8 3 1.5-.1 2.1-1 3.9-1s2.4 1 4 1 2.7-1.5 3.7-2.9c1.2-1.7 1.6-3.3 1.7-3.4-.1-.1-3.2-1.3-3.2-4.9zm-3.1-9c.8-1 1.4-2.4 1.2-3.8-1.2 0-2.7.8-3.5 1.8-.8.9-1.5 2.4-1.3 3.7 1.4.1 2.8-.7 3.6-1.7z" />
          </svg>
        )}
        <span className="text-sm font-medium light-text-contrast">
          {loadingProvider === "apple" ? "Connecting..." : "Continue with Apple"}
        </span>
      </button>
    </div>
  );
}