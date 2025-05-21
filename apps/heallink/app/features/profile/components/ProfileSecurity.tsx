"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/app/theme/ThemeProvider";
import {
  Lock,
  Shield,
  KeyRound,
  Smartphone,
  Eye,
  EyeOff,
  ChevronRight,
  CircleAlert,
  CheckCircle,
  XCircle,
  HelpCircle,
  Activity,
  LogOut,
  Facebook,
  Mail,
  Languages,
} from "lucide-react";
import { UserProfileData, UserProfileFormData } from "../types";

interface ProfileSecurityProps {
  profile: UserProfileData;
  onUpdate: (
    data: Partial<UserProfileFormData>
  ) => Promise<boolean | undefined>;
}

export default function ProfileSecurity({
  profile,
  onUpdate,
}: ProfileSecurityProps) {
  const { theme } = useTheme();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Shadow color based on theme
  const shadowColor =
    theme === "dark" ? "rgba(0, 0, 0, 0.35)" : "rgba(0, 0, 0, 0.15)";

  // Card variants for animations
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  // Handle form change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Password validation
  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar,
      isValid:
        hasMinLength &&
        hasUppercase &&
        hasLowercase &&
        hasNumber &&
        hasSpecialChar,
    };
  };

  // Password strength
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, text: "Empty" };

    const validation = validatePassword(password);
    const validCount = Object.values(validation).filter(Boolean).length - 1; // Subtract isValid

    if (validCount <= 1) return { strength: 1, text: "Very Weak" };
    if (validCount === 2) return { strength: 2, text: "Weak" };
    if (validCount === 3) return { strength: 3, text: "Moderate" };
    if (validCount === 4) return { strength: 4, text: "Strong" };
    return { strength: 5, text: "Very Strong" };
  };

  // Save new password
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      alert("New password and confirmation do not match");
      return;
    }

    const validation = validatePassword(formData.newPassword);
    if (!validation.isValid) {
      alert("Password does not meet requirements");
      return;
    }

    setIsSaving(true);
    try {
      // This would normally call an API endpoint to update the password
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Reset form after successful update
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      alert("Password updated successfully");
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Failed to update password. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Password validation check component
  const PasswordValidationCheck = ({
    isValid,
    text,
  }: {
    isValid: boolean;
    text: string;
  }) => {
    return (
      <div className="flex items-center gap-2">
        {isValid ? (
          <CheckCircle size={16} className="text-green-500" />
        ) : (
          <XCircle size={16} className="text-red-500" />
        )}
        <span className={isValid ? "text-green-500" : "text-muted-foreground"}>
          {text}
        </span>
      </div>
    );
  };

  // Password strength
  const strength = getPasswordStrength(formData.newPassword);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Password Change Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2 rounded-2xl overflow-hidden"
        >
          <div className="neumorph-card hover:transform-none">
            {/* Card Header */}
            <div className="flex items-center gap-2 p-6 border-b border-border">
              <Lock className="text-primary" size={20} />
              <h2 className="text-lg font-semibold">Password Management</h2>
            </div>

            {/* Card Content */}
            <div className="p-6">
              <form onSubmit={handleSavePassword} className="space-y-6">
                {/* Current Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2 pr-10 rounded-lg border border-input bg-transparent neumorph-input focus:outline-none"
                      placeholder="Enter your current password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      {showCurrentPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-2 pr-10 rounded-lg border border-input bg-transparent neumorph-input focus:outline-none"
                      placeholder="Enter your new password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  {/* Password Strength Meter */}
                  {formData.newPassword && (
                    <div className="mt-3 space-y-3">
                      <div className="space-y-1">
                        <div className="text-sm flex justify-between">
                          <span className="text-muted-foreground">
                            Password Strength
                          </span>
                          <span
                            className={
                              strength.strength <= 2
                                ? "text-red-500"
                                : strength.strength === 3
                                  ? "text-yellow-500"
                                  : "text-green-500"
                            }
                          >
                            {strength.text}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              strength.strength <= 2
                                ? "bg-red-500"
                                : strength.strength === 3
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                            }`}
                            style={{
                              width: `${(strength.strength / 5) * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <PasswordValidationCheck
                          isValid={
                            validatePassword(formData.newPassword).hasMinLength
                          }
                          text="At least 8 characters"
                        />
                        <PasswordValidationCheck
                          isValid={
                            validatePassword(formData.newPassword).hasUppercase
                          }
                          text="Contains uppercase letter"
                        />
                        <PasswordValidationCheck
                          isValid={
                            validatePassword(formData.newPassword).hasLowercase
                          }
                          text="Contains lowercase letter"
                        />
                        <PasswordValidationCheck
                          isValid={
                            validatePassword(formData.newPassword).hasNumber
                          }
                          text="Contains number"
                        />
                        <PasswordValidationCheck
                          isValid={
                            validatePassword(formData.newPassword)
                              .hasSpecialChar
                          }
                          text="Contains special character"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 pr-10 rounded-lg border bg-transparent neumorph-input focus:outline-none ${
                        formData.confirmPassword &&
                        formData.newPassword !== formData.confirmPassword
                          ? "border-red-500"
                          : "border-input"
                      }`}
                      placeholder="Confirm your new password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {formData.confirmPassword &&
                    formData.newPassword !== formData.confirmPassword && (
                      <p className="text-sm text-red-500 mt-1">
                        Passwords do not match
                      </p>
                    )}
                </div>

                {/* Save Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={
                      isSaving ||
                      formData.newPassword !== formData.confirmPassword
                    }
                    className="w-full px-4 py-3 rounded-xl font-medium disabled:opacity-50 transition-all bg-gradient-to-r from-purple-heart to-royal-blue text-white border border-purple-heart/50 hover:shadow-lg hover:shadow-purple-heart/20"
                  >
                    {isSaving ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
                        <span>Updating Password...</span>
                      </div>
                    ) : (
                      "Update Password"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Security Features Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="rounded-2xl overflow-hidden"
        >
          <div className="neumorph-card hover:transform-none h-full">
            {/* Card Header */}
            <div className="flex items-center gap-2 p-6 border-b border-border">
              <Shield className="text-secondary" size={20} />
              <h2 className="text-lg font-semibold">Security Features</h2>
            </div>

            {/* Card Content */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Two-Factor Authentication */}
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-10 w-10 rounded-lg bg-purple-heart/20 flex items-center justify-center">
                        <Smartphone className="text-purple-heart" size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          Two-Factor Authentication
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                        <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500">
                          Not Enabled
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-muted-foreground" />
                  </div>
                </div>

                {/* Login Activity */}
                <div className="p-4 rounded-xl border border-border bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Activity className="text-blue-500" size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium">Login Activity</h3>
                        <p className="text-sm text-muted-foreground">
                          Review recent login sessions
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-muted-foreground" />
                  </div>
                </div>

                {/* Connected Accounts */}
                <div>
                  <h3 className="font-medium mb-3">Connected Accounts</h3>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg border border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                            <Mail className="text-white" size={16} />
                          </div>
                          <div>
                            <div className="font-medium text-sm">
                              {profile.email}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Primary Email
                            </div>
                          </div>
                        </div>
                        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                          Verified
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-[#1877F2] flex items-center justify-center">
                            <Facebook className="text-white" size={16} />
                          </div>
                          <div>
                            <div className="font-medium text-sm">Facebook</div>
                            <div className="text-xs text-muted-foreground">
                              Not Connected
                            </div>
                          </div>
                        </div>
                        <button className="px-2 py-1 rounded text-xs border border-primary text-primary hover:bg-primary/10 transition-colors">
                          Connect
                        </button>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg border border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-[#DB4437] flex items-center justify-center">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="text-white"
                            >
                              <path
                                d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z"
                                fill="currentColor"
                              />
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium text-sm">Google</div>
                            <div className="text-xs text-muted-foreground">
                              Not Connected
                            </div>
                          </div>
                        </div>
                        <button className="px-2 py-1 rounded text-xs border border-primary text-primary hover:bg-primary/10 transition-colors">
                          Connect
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Deletion */}
                <div className="pt-4 border-t border-border">
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-500/10 transition-colors">
                    <LogOut size={16} />
                    <span>Delete Account</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
