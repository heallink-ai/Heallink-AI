"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import { loginSchema, type LoginFormData } from "../utils/validation";
import { Button } from "./Button";
import { InputField } from "./InputField";
import { PhoneInput } from "./PhoneInput";
import { SocialButton } from "./SocialButton";
import { AuthMode } from "../types/auth.types";

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  onSocialLogin: (provider: string) => Promise<void>;
  isLoading?: boolean;
  isSocialLoading?: boolean;
  error?: string;
}

export function LoginForm({ 
  onSubmit, 
  onSocialLogin, 
  isLoading = false, 
  isSocialLoading = false,
  error 
}: LoginFormProps) {
  const [authMode, setAuthMode] = useState<AuthMode>("email");
  
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

  const handleFormSubmit = async (data: LoginFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Login error:", error);
      setError("root", { message: "An unexpected error occurred" });
    }
  };

  const handleSocialClick = async (provider: string) => {
    try {
      await onSocialLogin(provider);
    } catch (error) {
      console.error("Social login error:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Auth mode toggle */}
      <motion.div 
        className="neumorph-flat rounded-xl p-1 flex"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <button
          type="button"
          onClick={() => setAuthMode("email")}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
            authMode === "email"
              ? "bg-gradient-to-r from-purple-heart to-royal-blue text-white shadow-lg transform scale-[0.98]"
              : "text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] hover:bg-purple-heart/5"
          }`}
        >
          <Mail className="w-4 h-4 mx-auto mb-1" />
          Email
        </button>
        <button
          type="button"
          onClick={() => setAuthMode("phone")}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
            authMode === "phone"
              ? "bg-gradient-to-r from-purple-heart to-royal-blue text-white shadow-lg transform scale-[0.98]"
              : "text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] hover:bg-purple-heart/5"
          }`}
        >
          <Phone className="w-4 h-4 mx-auto mb-1" />
          Phone
        </button>
      </motion.div>

      {/* Error display */}
      {(errors.root || error) && (
        <motion.div 
          className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <span className="text-sm">{errors.root?.message || error}</span>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
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
        </motion.div>

        {/* Only show password for email authentication */}
        {authMode === "email" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
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
          </motion.div>
        )}

        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
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

          {authMode === "email" && (
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-purple-heart hover:text-purple-heart/80 transition-colors"
            >
              Forgot password?
            </Link>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            type="submit"
            variant="default"
            size="lg"
            className="w-full group"
            loading={isSubmitting || isLoading}
          >
            {authMode === "phone" ? "Send OTP" : "Sign In"}
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </form>

      {/* Divider */}
      <motion.div 
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[color:var(--border)]" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-[color:var(--background)] text-[color:var(--muted-foreground)]">
            Or continue with
          </span>
        </div>
      </motion.div>

      {/* Social login buttons */}
      <motion.div 
        className="grid grid-cols-1 gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <SocialButton
          provider="google"
          onClick={() => handleSocialClick("google")}
          loading={isSocialLoading}
        />
        <SocialButton
          provider="facebook"
          onClick={() => handleSocialClick("facebook")}
          loading={isSocialLoading}
        />
        <SocialButton
          provider="apple"
          onClick={() => handleSocialClick("apple")}
          loading={isSocialLoading}
        />
      </motion.div>

      {/* Sign up link */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-sm text-[color:var(--muted-foreground)]">
          New to Heallink?{" "}
          <Link
            href="/signup"
            className="font-medium text-purple-heart hover:text-purple-heart/80 transition-colors"
          >
            Create your provider account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}