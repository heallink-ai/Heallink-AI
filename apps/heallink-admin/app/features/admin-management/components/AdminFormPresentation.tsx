"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Send, Save, Loader, Check, ShieldCheck } from "lucide-react";
import ErrorDisplay from "../../../components/common/ErrorDisplay";
import { AdminFormData, AdminRole } from "../types/admin.types";

interface AdminFormPresentationProps {
  // Form state
  formState: AdminFormData;
  errors: Record<string, string>;
  isEdit: boolean;
  activeTab?: "basic" | "permissions";

  // Loading states
  isSubmitting: boolean;
  submitSuccess: boolean;
  submitError: Error | null;

  // Event handlers
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onTabChange?: (tab: "basic" | "permissions") => void;
  onCancel: () => void;

  // Optional props
  title?: string;
  backUrl?: string;
}

export default function AdminFormPresentation({
  formState,
  errors,
  isEdit,
  activeTab = "basic",
  isSubmitting,
  submitSuccess,
  submitError,
  onFormChange,
  onCheckboxChange,
  onSubmit,
  onTabChange,
  onCancel,
  title,
  backUrl = "/dashboard/admins",
}: AdminFormPresentationProps) {
  const defaultTitle = isEdit ? "Edit Administrator" : "Invite Administrator";

  if (submitSuccess) {
    return (
      <div className="bg-[color:var(--background)]">
        <div className="flex items-center gap-2 mb-6">
          <Link
            href={backUrl}
            className="p-2 rounded-full hover:bg-[color:var(--accent)]/20 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center">
            <ShieldCheck size={24} className="mr-2 text-[color:var(--primary)]" />
            <h1 className="text-2xl font-semibold">{title || defaultTitle}</h1>
          </div>
        </div>

        <div className="bg-[color:var(--card)] rounded-xl p-6 neumorph-flat">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
              <Check size={24} className="text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-medium mb-2">
              Admin {isEdit ? "Updated" : "Invitation Sent"} Successfully
            </h2>
            <p className="text-[color:var(--muted-foreground)] text-center max-w-md mb-6">
              {isEdit
                ? "The administrator's information has been updated successfully."
                : "An email has been sent to the administrator with instructions to join the Heallink platform with administrative privileges."}
            </p>
            <div className="flex gap-4">
              <Link
                href={backUrl}
                className="px-4 py-2 rounded-lg bg-[color:var(--secondary-background)] border border-[color:var(--border)] hover:bg-[color:var(--accent)]/20 transition-colors"
              >
                Return to Admin List
              </Link>
              {!isEdit && (
                <button
                  onClick={onCancel}
                  className="px-4 py-2 rounded-lg bg-[color:var(--primary)] text-white hover:bg-[color:var(--primary-dark)] transition-colors"
                >
                  Invite Another Admin
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[color:var(--background)]">
      <div className="flex items-center gap-2 mb-6">
        <Link
          href={backUrl}
          className="p-2 rounded-full hover:bg-[color:var(--accent)]/20 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex items-center">
          <ShieldCheck size={24} className="mr-2 text-[color:var(--primary)]" />
          <h1 className="text-2xl font-semibold">{title || defaultTitle}</h1>
        </div>
      </div>

      <div className="bg-[color:var(--card)] rounded-xl neumorph-flat overflow-hidden">
        {/* Tab Navigation (for edit mode) */}
        {isEdit && onTabChange && (
          <div className="flex border-b border-[color:var(--border)]">
            <button
              onClick={() => onTabChange("basic")}
              className={`px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === "basic"
                  ? "border-b-2 border-[color:var(--primary)] text-[color:var(--primary)]"
                  : "text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]"
              }`}
            >
              Basic Information
            </button>
            <button
              onClick={() => onTabChange("permissions")}
              className={`px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === "permissions"
                  ? "border-b-2 border-[color:var(--primary)] text-[color:var(--primary)]"
                  : "text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]"
              }`}
            >
              Role & Permissions
            </button>
          </div>
        )}

        <form onSubmit={onSubmit} className="p-6">
          {/* Basic Information */}
          {(!isEdit || activeTab === "basic") && (
            <div>
              {isEdit && <h3 className="text-lg font-medium mb-4">Basic Information</h3>}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formState.firstName}
                    onChange={onFormChange}
                    className={`w-full px-3 py-2 rounded-lg bg-[color:var(--input)] border ${
                      errors.firstName
                        ? "border-red-500"
                        : "border-[color:var(--border)]"
                    } focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)]`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formState.lastName}
                    onChange={onFormChange}
                    className={`w-full px-3 py-2 rounded-lg bg-[color:var(--input)] border ${
                      errors.lastName
                        ? "border-red-500"
                        : "border-[color:var(--border)]"
                    } focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)]`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={onFormChange}
                    className={`w-full px-3 py-2 rounded-lg bg-[color:var(--input)] border ${
                      errors.email
                        ? "border-red-500"
                        : "border-[color:var(--border)]"
                    } focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)]`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="phone">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formState.phone}
                    onChange={onFormChange}
                    className="w-full px-3 py-2 rounded-lg bg-[color:var(--input)] border border-[color:var(--border)] focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)]"
                  />
                </div>
              </div>

              {isEdit && (
                <div className="mb-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formState.isActive}
                      onChange={onCheckboxChange}
                      className="h-4 w-4 rounded border-[color:var(--border)] bg-[color:var(--input)] text-[color:var(--primary)] focus:ring-[color:var(--ring)]"
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm font-medium">
                      Active Account
                    </label>
                  </div>
                  <p className="mt-1 text-xs text-[color:var(--muted-foreground)]">
                    Uncheck to deactivate this administrator account
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Role & Permissions */}
          {(!isEdit || activeTab === "permissions") && (
            <div>
              {isEdit && <h3 className="text-lg font-medium mb-4">Role & Permissions</h3>}
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1" htmlFor="adminRole">
                  Admin Role
                </label>
                <select
                  id="adminRole"
                  name="adminRole"
                  value={formState.adminRole}
                  onChange={onFormChange}
                  className={`w-full px-3 py-2 rounded-lg bg-[color:var(--input)] border ${
                    errors.adminRole
                      ? "border-red-500"
                      : "border-[color:var(--border)]"
                  } focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)]`}
                >
                  <option value="">Select Admin Role</option>
                  <option value={AdminRole.SUPER_ADMIN}>Super Admin</option>
                  <option value={AdminRole.SYSTEM_ADMIN}>System Admin</option>
                  <option value={AdminRole.USER_ADMIN}>User Admin</option>
                  <option value={AdminRole.PROVIDER_ADMIN}>Provider Admin</option>
                  <option value={AdminRole.CONTENT_ADMIN}>Content Admin</option>
                  <option value={AdminRole.BILLING_ADMIN}>Billing Admin</option>
                  <option value={AdminRole.SUPPORT_ADMIN}>Support Admin</option>
                  <option value={AdminRole.READONLY_ADMIN}>Readonly Admin</option>
                </select>
                {errors.adminRole && (
                  <p className="mt-1 text-xs text-red-500">{errors.adminRole}</p>
                )}
              </div>

              <div className="mb-6">
                <h4 className="text-md font-medium mb-4">Admin Permissions</h4>
                <p className="text-sm text-[color:var(--muted-foreground)] mb-4">
                  Select the permissions for this administrator
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(formState.accessRights).map(([key, value]) => (
                    <div key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        id={key}
                        name={key}
                        checked={value}
                        onChange={onCheckboxChange}
                        className="h-4 w-4 rounded border-[color:var(--border)] bg-[color:var(--input)] text-[color:var(--primary)] focus:ring-[color:var(--ring)]"
                      />
                      <label htmlFor={key} className="ml-2 text-sm font-medium">
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {!isEdit && (
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="sendEmailInvite"
                      name="sendEmailInvite"
                      checked={true}
                      readOnly
                      className="h-4 w-4 rounded border-[color:var(--border)] bg-[color:var(--input)] text-[color:var(--primary)] focus:ring-[color:var(--ring)]"
                    />
                    <label htmlFor="sendEmailInvite" className="ml-2 text-sm font-medium">
                      Send email invitation
                    </label>
                  </div>
                  <div className="pl-6 border-l-2 border-[color:var(--border)] text-sm text-[color:var(--muted-foreground)]">
                    <p>
                      An email will be sent to the administrator with instructions
                      to set up their account. They will have 7 days to accept the
                      invitation before it expires.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error Display */}
          {submitError && (
            <div className="mb-6">
              <ErrorDisplay 
                message={isEdit ? "Failed to update admin" : "Failed to send invitation"} 
                details={submitError instanceof Error ? submitError.message : "An unknown error occurred"} 
              />
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-[color:var(--primary)] text-white hover:bg-[color:var(--primary-dark)] transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  <span>{isEdit ? "Saving..." : "Sending Invitation..."}</span>
                </>
              ) : (
                <>
                  {isEdit ? <Save size={16} /> : <Send size={16} />}
                  <span>{isEdit ? "Save Changes" : "Send Invitation"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}