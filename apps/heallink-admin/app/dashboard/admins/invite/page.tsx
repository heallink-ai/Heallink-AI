"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Plus, Minus, Check, ShieldCheck } from "lucide-react";

export default function InviteAdminPage() {
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    sendEmailInvite: true,
    accessRights: {
      systemConfiguration: false,
      userManagement: false,
      adminManagement: false,
      providerManagement: false,
      billingManagement: false,
      securitySettings: false,
      auditLogs: false,
      apiAccess: false,
    },
  });

  // Validation state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (name === "sendEmailInvite") {
      setFormState((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormState((prev) => ({
        ...prev,
        accessRights: {
          ...prev.accessRights,
          [name]: checked,
        },
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Required field validation
    if (!formState.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formState.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formState.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formState.role) {
      newErrors.role = "Please select an admin role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);

        // Reset form after successful submission
        setTimeout(() => {
          setSubmitSuccess(false);
          setFormState({
            firstName: "",
            lastName: "",
            email: "",
            role: "",
            sendEmailInvite: true,
            accessRights: {
              systemConfiguration: false,
              userManagement: false,
              adminManagement: false,
              providerManagement: false,
              billingManagement: false,
              securitySettings: false,
              auditLogs: false,
              apiAccess: false,
            },
          });
        }, 3000);
      }, 1500);
    }
  };

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
          <h1 className="text-2xl font-semibold">Invite Administrator</h1>
        </div>
      </div>

      <div className="bg-[color:var(--card)] rounded-xl p-6 neumorph-flat">
        {submitSuccess ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
              <Check size={24} className="text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-medium mb-2">
              Admin Invitation Sent Successfully
            </h2>
            <p className="text-[color:var(--muted-foreground)] text-center max-w-md mb-6">
              An email has been sent to the administrator with instructions to join
              the Heallink platform with administrative privileges.
            </p>
            <div className="flex gap-4">
              <Link
                href="/dashboard/admins"
                className="px-4 py-2 rounded-lg bg-[color:var(--secondary-background)] border border-[color:var(--border)] hover:bg-[color:var(--accent)]/20 transition-colors"
              >
                Return to Admin List
              </Link>
              <button
                onClick={() => setSubmitSuccess(false)}
                className="px-4 py-2 rounded-lg bg-[color:var(--primary)] text-white hover:bg-[color:var(--primary-dark)] transition-colors"
              >
                Invite Another Admin
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="firstName"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formState.firstName}
                  onChange={handleChange}
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
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="lastName"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formState.lastName}
                  onChange={handleChange}
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
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
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
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="role"
                >
                  Admin Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formState.role}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-lg bg-[color:var(--input)] border ${
                    errors.role
                      ? "border-red-500"
                      : "border-[color:var(--border)]"
                  } focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)]`}
                >
                  <option value="">Select Admin Role</option>
                  <option value="System Admin">System Admin</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="IT Admin">IT Admin</option>
                  <option value="Security Admin">Security Admin</option>
                  <option value="Support Admin">Support Admin</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-xs text-red-500">{errors.role}</p>
                )}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Admin Permissions</h3>
              <p className="text-sm text-[color:var(--muted-foreground)] mb-4">
                Select the permissions for this administrator
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="systemConfiguration"
                    name="systemConfiguration"
                    checked={formState.accessRights.systemConfiguration}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 rounded border-[color:var(--border)] bg-[color:var(--input)] text-[color:var(--primary)] focus:ring-[color:var(--ring)]"
                  />
                  <label
                    htmlFor="systemConfiguration"
                    className="ml-2 text-sm font-medium"
                  >
                    System Configuration
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="userManagement"
                    name="userManagement"
                    checked={formState.accessRights.userManagement}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 rounded border-[color:var(--border)] bg-[color:var(--input)] text-[color:var(--primary)] focus:ring-[color:var(--ring)]"
                  />
                  <label
                    htmlFor="userManagement"
                    className="ml-2 text-sm font-medium"
                  >
                    User Management
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="adminManagement"
                    name="adminManagement"
                    checked={formState.accessRights.adminManagement}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 rounded border-[color:var(--border)] bg-[color:var(--input)] text-[color:var(--primary)] focus:ring-[color:var(--ring)]"
                  />
                  <label
                    htmlFor="adminManagement"
                    className="ml-2 text-sm font-medium"
                  >
                    Admin Management
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="providerManagement"
                    name="providerManagement"
                    checked={formState.accessRights.providerManagement}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 rounded border-[color:var(--border)] bg-[color:var(--input)] text-[color:var(--primary)] focus:ring-[color:var(--ring)]"
                  />
                  <label
                    htmlFor="providerManagement"
                    className="ml-2 text-sm font-medium"
                  >
                    Provider Management
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="billingManagement"
                    name="billingManagement"
                    checked={formState.accessRights.billingManagement}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 rounded border-[color:var(--border)] bg-[color:var(--input)] text-[color:var(--primary)] focus:ring-[color:var(--ring)]"
                  />
                  <label
                    htmlFor="billingManagement"
                    className="ml-2 text-sm font-medium"
                  >
                    Billing Management
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="securitySettings"
                    name="securitySettings"
                    checked={formState.accessRights.securitySettings}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 rounded border-[color:var(--border)] bg-[color:var(--input)] text-[color:var(--primary)] focus:ring-[color:var(--ring)]"
                  />
                  <label
                    htmlFor="securitySettings"
                    className="ml-2 text-sm font-medium"
                  >
                    Security Settings
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="auditLogs"
                    name="auditLogs"
                    checked={formState.accessRights.auditLogs}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 rounded border-[color:var(--border)] bg-[color:var(--input)] text-[color:var(--primary)] focus:ring-[color:var(--ring)]"
                  />
                  <label
                    htmlFor="auditLogs"
                    className="ml-2 text-sm font-medium"
                  >
                    Audit Logs
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="apiAccess"
                    name="apiAccess"
                    checked={formState.accessRights.apiAccess}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 rounded border-[color:var(--border)] bg-[color:var(--input)] text-[color:var(--primary)] focus:ring-[color:var(--ring)]"
                  />
                  <label
                    htmlFor="apiAccess"
                    className="ml-2 text-sm font-medium"
                  >
                    API Access
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="sendEmailInvite"
                  name="sendEmailInvite"
                  checked={formState.sendEmailInvite}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded border-[color:var(--border)] bg-[color:var(--input)] text-[color:var(--primary)] focus:ring-[color:var(--ring)]"
                />
                <label
                  htmlFor="sendEmailInvite"
                  className="ml-2 text-sm font-medium"
                >
                  Send email invitation
                </label>
              </div>
              {formState.sendEmailInvite && (
                <div className="pl-6 border-l-2 border-[color:var(--border)] text-sm text-[color:var(--muted-foreground)]">
                  <p>
                    An email will be sent to the administrator with instructions to set up their
                    account. They will have 7 days to accept the invitation before it expires.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg bg-[color:var(--primary)] text-white hover:bg-[color:var(--primary-dark)] transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Sending Invitation...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Send Invitation</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
