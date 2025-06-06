"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, Lock } from "lucide-react";
import Link from "next/link";

import { useAuth } from "../hooks/useAuth";
import { loginSchema, type LoginFormData } from "../utils/validation";
import { Button } from "../components/Button";
import { InputField } from "../components/InputField";
import { PhoneInput } from "../components/PhoneInput";
import { SocialButton } from "../components/SocialButton";
import { AuthMode } from "../types/auth.types";

export function LoginContainer() {
  const [authMode, setAuthMode] = useState<AuthMode>("email");
  const { login, socialLogin } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      phone: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login.mutateAsync(data);
      if (!result.success && result.message) {
        setError("root", { message: result.message });
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("root", { message: "An unexpected error occurred" });
    }
  };

  const handleSocialLogin = async (provider: string) => {
    try {
      const result = await socialLogin.mutateAsync(provider);
      if (!result.success && result.message) {
        setError("root", { message: result.message });
      }
    } catch (error) {
      console.error("Social login error:", error);
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

      {/* Error display */}
      {errors.root && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <span className="text-sm">{errors.root.message}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {authMode === "email" ? (
          <InputField
            {...register("email")}
            label="Email Address"
            type="email"
            placeholder="dr.smith@hospital.com"
            required
            error={errors.email?.message}
            icon={<Mail className="w-5 h-5" />}
            autoComplete="email"
          />
        ) : (
          <PhoneInput
            {...register("phone")}
            label="Phone Number"
            placeholder="+1 (555) 123-4567"
            required
            error={errors.phone?.message}
            onValueChange={(value) => setValue("phone", value)}
            value={watch("phone")}
          />
        )}

        <InputField
          {...register("password")}
          label="Password"
          type="password"
          placeholder="Enter your password"
          required
          error={errors.password?.message}
          icon={<Lock className="w-5 h-5" />}
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              {...register("remember")}
              type="checkbox"
              className="h-4 w-4 rounded border-[color:var(--border)] text-purple-heart focus:ring-purple-heart/30"
            />
            <label className="ml-2 block text-sm text-[color:var(--foreground)]">
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
          variant="default"
          size="lg"
          className="w-full"
          loading={isSubmitting}
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
          loading={socialLogin.isPending}
        />
        <SocialButton
          provider="facebook"
          onClick={() => handleSocialLogin("facebook")}
          loading={socialLogin.isPending}
        />
        <SocialButton
          provider="apple"
          onClick={() => handleSocialLogin("apple")}
          loading={socialLogin.isPending}
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
      <div className="mt-6 p-4 rounded-xl neumorph-card bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200/30 dark:border-blue-800/30">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse"></div>
          <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">Demo Access</p>
        </div>
        <div className="text-xs text-blue-600/90 dark:text-blue-400/90 space-y-1 font-mono">
          <p><span className="text-blue-500 font-semibold">Email:</span> dr.demo@heallink.com</p>
          <p><span className="text-blue-500 font-semibold">Phone:</span> +1 (555) 123-4567</p>
          <p><span className="text-blue-500 font-semibold">Password:</span> demo123</p>
        </div>
      </div>
    </div>
  );
}