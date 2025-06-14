"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import InputField from "./InputField";
import Button from "./Button";
import Modal from "./Modal";
import ForgotPasswordForm from "./ForgotPasswordForm";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log("Attempting login with:", email);
      console.log("Remember me:", remember);

      // Call Next.js SignIn function with our credentials
      const result = await signIn("credentials", {
        redirect: false,
        callbackUrl: "/dashboard",
        email,
        password,
        rememberMe: remember ? "true" : "false", // Ensure it's passed as string
      });

      console.log("SignIn result:", result);

      if (!result) {
        throw new Error("No response from authentication server");
      }

      if (result.error) {
        setError("Invalid email or password. Please try again.");
        setIsLoading(false);
        return;
      }

      // Successful login
      if (result.url) {
        // Redirect to the URL provided by Next.js (should be the dashboard)
        router.push(result.url);
        router.refresh(); // Refresh to ensure session is updated
      } else {
        // Fallback in case no URL is provided
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      // Log the error in development
      console.error("Login error:", err);
      setError("An error occurred during authentication. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 mb-4 text-sm rounded-lg bg-[color:var(--error)]/10 text-[color:var(--error)]">
            <div className="flex items-center gap-2">
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
              <span>{error}</span>
            </div>
          </div>
        )}

        <InputField
          id="email"
          label="Email Address"
          type="email"
          placeholder="admin@heallink.com"
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
              className="h-4 w-4 rounded border-[color:var(--border)] text-[color:var(--primary)] focus:ring-[color:var(--ring)]"
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

          <button
            type="button"
            className="text-sm font-medium text-[color:var(--primary)] hover:underline"
            onClick={() => setIsModalOpen(true)}
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
        >
          Sign in
        </Button>

        <div className="text-center text-sm text-[color:var(--muted-foreground)]">
          <p>Protected access for Heallink administrators only.</p>
          <p>Unauthorized access attempts will be logged.</p>
          <p className="text-xs mt-1">
            API URL: {process.env.NEXT_PUBLIC_API_URL || "Not configured"}
          </p>
        </div>
      </form>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ForgotPasswordForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
}
