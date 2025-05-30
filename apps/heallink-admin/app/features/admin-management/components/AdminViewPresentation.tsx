"use client";

import React from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Edit, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Calendar,
  CheckCircle,
  XCircle,
  User,
  Loader,
  Shield
} from "lucide-react";
import ErrorDisplay from "../../../components/common/ErrorDisplay";
import { AdminUser } from "../types/admin.types";

interface AdminViewPresentationProps {
  admin: AdminUser | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  adminId: string;
}

export default function AdminViewPresentation({
  admin,
  isLoading,
  isError,
  error,
  adminId,
}: AdminViewPresentationProps) {
  const formatAdminRole = (role: string) => {
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center">
          <Loader size={24} className="animate-spin mr-3 text-[color:var(--primary)]" />
          <span>Loading admin details...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[color:var(--background)]">
        <div className="flex items-center gap-2 mb-6">
          <Link
            href="/dashboard/admins"
            className="p-2 rounded-full hover:bg-[color:var(--accent)]/20 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center">
            <ShieldCheck size={24} className="mr-2 text-[color:var(--primary)]" />
            <h1 className="text-2xl font-semibold">Administrator Details</h1>
          </div>
        </div>
        <div className="bg-[color:var(--card)] rounded-xl p-6 neumorph-flat">
          <ErrorDisplay 
            message="Failed to load admin details"
            details={error instanceof Error ? error.message : "An unknown error occurred"}
          />
        </div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="bg-[color:var(--background)]">
        <div className="flex items-center gap-2 mb-6">
          <Link
            href="/dashboard/admins"
            className="p-2 rounded-full hover:bg-[color:var(--accent)]/20 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center">
            <ShieldCheck size={24} className="mr-2 text-[color:var(--primary)]" />
            <h1 className="text-2xl font-semibold">Administrator Details</h1>
          </div>
        </div>
        <div className="bg-[color:var(--card)] rounded-xl p-6 neumorph-flat">
          <p>Admin not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[color:var(--background)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/admins"
            className="p-2 rounded-full hover:bg-[color:var(--accent)]/20 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center">
            <ShieldCheck size={24} className="mr-2 text-[color:var(--primary)]" />
            <h1 className="text-2xl font-semibold">Administrator Details</h1>
          </div>
        </div>
        <Link
          href={`/dashboard/admins/${adminId}/edit`}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[color:var(--primary)] text-white hover:bg-[color:var(--primary-dark)] transition-colors w-full md:w-auto"
        >
          <Edit size={16} />
          <span>Edit Admin</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information Card */}
          <div className="bg-[color:var(--card)] rounded-xl p-6 neumorph-flat">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <User size={20} className="mr-2" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[color:var(--muted-foreground)] mb-1">
                  Full Name
                </label>
                <div className="flex items-center">
                  <User size={16} className="mr-2 text-[color:var(--muted-foreground)]" />
                  <span className="text-[color:var(--foreground)]">{admin.name}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[color:var(--muted-foreground)] mb-1">
                  Email Address
                </label>
                <div className="flex items-center">
                  <Mail size={16} className="mr-2 text-[color:var(--muted-foreground)]" />
                  <span className="text-[color:var(--foreground)]">{admin.email}</span>
                </div>
              </div>

              {admin.phone && (
                <div>
                  <label className="block text-sm font-medium text-[color:var(--muted-foreground)] mb-1">
                    Phone Number
                  </label>
                  <div className="flex items-center">
                    <Phone size={16} className="mr-2 text-[color:var(--muted-foreground)]" />
                    <span className="text-[color:var(--foreground)]">{admin.phone}</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[color:var(--muted-foreground)] mb-1">
                  Account Status
                </label>
                <div className="flex items-center">
                  {admin.isActive ? (
                    <>
                      <CheckCircle size={16} className="mr-2 text-green-500" />
                      <span className="text-green-600 dark:text-green-400">Active</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={16} className="mr-2 text-red-500" />
                      <span className="text-red-600 dark:text-red-400">Inactive</span>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[color:var(--muted-foreground)] mb-1">
                  Email Verified
                </label>
                <div className="flex items-center">
                  {admin.emailVerified ? (
                    <>
                      <CheckCircle size={16} className="mr-2 text-green-500" />
                      <span className="text-green-600 dark:text-green-400">Verified</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={16} className="mr-2 text-red-500" />
                      <span className="text-red-600 dark:text-red-400">Not Verified</span>
                    </>
                  )}
                </div>
              </div>

              {admin.lastLogin && (
                <div>
                  <label className="block text-sm font-medium text-[color:var(--muted-foreground)] mb-1">
                    Last Login
                  </label>
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2 text-[color:var(--muted-foreground)]" />
                    <span className="text-[color:var(--foreground)]">{formatDate(admin.lastLogin)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Permissions Card */}
          {admin.permissions && admin.permissions.length > 0 && (
            <div className="bg-[color:var(--card)] rounded-xl p-6 neumorph-flat">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Shield size={20} className="mr-2" />
                Permissions
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {admin.permissions.map((permission) => (
                  <div key={permission} className="flex items-center p-3 bg-[color:var(--accent)]/10 rounded-lg">
                    <CheckCircle size={16} className="mr-2 text-green-500" />
                    <span className="text-sm">
                      {permission
                        .split("_")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Information */}
        <div className="space-y-6">
          {/* Role Information */}
          <div className="bg-[color:var(--card)] rounded-xl p-6 neumorph-flat">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <ShieldCheck size={20} className="mr-2" />
              Role Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[color:var(--muted-foreground)] mb-1">
                  User Role
                </label>
                <div className="p-3 bg-[color:var(--accent)]/10 rounded-lg">
                  <span className="font-medium text-[color:var(--primary)]">
                    {admin.role.charAt(0).toUpperCase() + admin.role.slice(1)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[color:var(--muted-foreground)] mb-1">
                  Admin Role
                </label>
                <div className="p-3 bg-[color:var(--accent)]/10 rounded-lg">
                  <span className="font-medium text-[color:var(--primary)]">
                    {formatAdminRole(admin.adminRole)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Dates */}
          <div className="bg-[color:var(--card)] rounded-xl p-6 neumorph-flat">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar size={20} className="mr-2" />
              Account Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[color:var(--muted-foreground)] mb-1">
                  Created
                </label>
                <p className="text-sm text-[color:var(--foreground)]">
                  {formatDate(admin.createdAt)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[color:var(--muted-foreground)] mb-1">
                  Last Updated
                </label>
                <p className="text-sm text-[color:var(--foreground)]">
                  {formatDate(admin.updatedAt)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[color:var(--muted-foreground)] mb-1">
                  Admin ID
                </label>
                <p className="text-xs font-mono bg-[color:var(--accent)]/10 p-2 rounded text-[color:var(--foreground)]">
                  {admin.id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}