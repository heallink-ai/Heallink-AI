"use client";

import { useState, useRef } from "react";
import { X, User, Mail, Phone, Lock, Camera } from "lucide-react";
import {
  AdminUser,
  UserRole,
  CreateAdminRequest,
  UpdateAdminRequest,
} from "../types/admin.types";

interface AdminFormProps {
  admin?: AdminUser;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAdminRequest | UpdateAdminRequest) => void;
  loading?: boolean;
  mode: "create" | "edit";
}

export default function AdminForm({
  admin,
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  mode,
}: AdminFormProps) {
  const [formData, setFormData] = useState({
    name: admin?.name || "",
    email: admin?.email || "",
    phone: admin?.phone || "",
    role: admin?.role || UserRole.ADMIN,
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    admin?.avatarUrl || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (mode === "create" && !formData.password) {
      newErrors.password = "Password is required for new users";
    }

    if (formData.password && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || undefined,
      role: formData.role,
      ...(formData.password && { password: formData.password }),
    };

    onSubmit(submitData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, avatar: "File size must be less than 5MB" });
        return;
      }

      if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/)) {
        setErrors({ ...errors, avatar: "Only image files are allowed" });
        return;
      }

      // Store file for future upload functionality

      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      setErrors({ ...errors, avatar: "" });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-[color:var(--card)] rounded-xl shadow-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[color:var(--border)]">
          <h2 className="text-lg font-semibold text-[color:var(--foreground)]">
            {mode === "create" ? "Create New Admin" : "Edit Admin"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-[color:var(--navbar-item-hover)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Avatar Upload */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-[color:var(--muted)] flex items-center justify-center">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-[color:var(--muted-foreground)]" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 p-2 rounded-full bg-[color:var(--primary)] text-white hover:bg-[color:var(--primary)]/90 transition-colors"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
          {errors.avatar && (
            <p className="text-sm text-[color:var(--error)] text-center">
              {errors.avatar}
            </p>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--foreground)] mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[color:var(--muted-foreground)]" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg bg-[color:var(--input)] focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)] ${
                  errors.name
                    ? "border-[color:var(--error)]"
                    : "border-[color:var(--border)]"
                }`}
                placeholder="Enter full name"
              />
            </div>
            {errors.name && (
              <p className="text-sm text-[color:var(--error)] mt-1">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--foreground)] mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[color:var(--muted-foreground)]" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg bg-[color:var(--input)] focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)] ${
                  errors.email
                    ? "border-[color:var(--error)]"
                    : "border-[color:var(--border)]"
                }`}
                placeholder="Enter email address"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-[color:var(--error)] mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--foreground)] mb-2">
              Phone Number (Optional)
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[color:var(--muted-foreground)]" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg bg-[color:var(--input)] focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)] ${
                  errors.phone
                    ? "border-[color:var(--error)]"
                    : "border-[color:var(--border)]"
                }`}
                placeholder="Enter phone number"
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-[color:var(--error)] mt-1">
                {errors.phone}
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--foreground)] mb-2">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                handleInputChange("role", e.target.value as UserRole)
              }
              className="w-full px-4 py-2 border border-[color:var(--border)] rounded-lg bg-[color:var(--input)] focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)]"
            >
              <option value={UserRole.ADMIN}>
                👑 Admin - Full system access
              </option>
              <option value={UserRole.PROVIDER}>
                🩺 Provider - Healthcare provider access
              </option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--foreground)] mb-2">
              {mode === "create" ? "Password" : "New Password (Optional)"}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[color:var(--muted-foreground)]" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg bg-[color:var(--input)] focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)] ${
                  errors.password
                    ? "border-[color:var(--error)]"
                    : "border-[color:var(--border)]"
                }`}
                placeholder={
                  mode === "create"
                    ? "Enter password"
                    : "Leave blank to keep current"
                }
              />
            </div>
            {errors.password && (
              <p className="text-sm text-[color:var(--error)] mt-1">
                {errors.password}
              </p>
            )}
            {mode === "create" && (
              <p className="text-sm text-[color:var(--muted-foreground)] mt-1">
                Password must be at least 8 characters long
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[color:var(--border)] rounded-lg text-[color:var(--foreground)] hover:bg-[color:var(--navbar-item-hover)] transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[color:var(--primary)] text-white rounded-lg hover:bg-[color:var(--primary)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : mode === "create"
                  ? "Create Admin"
                  : "Update Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
