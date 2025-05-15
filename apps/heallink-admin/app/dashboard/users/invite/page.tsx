"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Plus, Minus, Check } from "lucide-react";

export default function InviteUserPage() {
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    sendEmailInvite: true,
    accessRights: {
      viewUsers: false,
      editUsers: false,
      deleteUsers: false,
      viewProviders: false,
      editProviders: false,
      viewReports: false,
      viewBilling: false,
      editBilling: false,
    },
  });

  // Additional emails to invite
  const [additionalEmails, setAdditionalEmails] = useState<string[]>([""]);

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

  const handleAdditionalEmailChange = (index: number, value: string) => {
    const newEmails = [...additionalEmails];
    newEmails[index] = value;
    setAdditionalEmails(newEmails);
  };

  const addEmailField = () => {
    setAdditionalEmails([...additionalEmails, ""]);
  };

  const removeEmailField = (index: number) => {
    if (additionalEmails.length > 1) {
      const newEmails = additionalEmails.filter((_, i) => i !== index);
      setAdditionalEmails(newEmails);
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
      newErrors.role = "Please select a role";
    }

    // Validate additional emails
    additionalEmails.forEach((email, index) => {
      if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors[`additionalEmail${index}`] = "Please enter a valid email";
      }
    });

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
              viewUsers: false,
              editUsers: false,
              deleteUsers: false,
              viewProviders: false,
              editProviders: false,
              viewReports: false,
              viewBilling: false,
              editBilling: false,
            },
          });
          setAdditionalEmails([""]);
        }, 3000);
      }, 1500);
    }
  };

  return (
    <div className="bg-[color:var(--background)]">
      <div className="flex items-center gap-2 mb-6">
        <Link
          href="/dashboard/users"
          className="p-2 rounded-full hover:bg-[color:var(--accent)]/20 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-semibold">Invite New User</h1>
      </div>

      <div className="bg-[color:var(--card)] rounded-xl p-6 neumorph-flat">
        {submitSuccess ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
              <Check size={24} className="text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-medium mb-2">
              Invitation Sent Successfully
            </h2>
            <p className="text-[color:var(--muted-foreground)] text-center max-w-md mb-6">
              An email has been sent to the user(s) with instructions to join
              the Heallink platform.
            </p>
            <div className="flex gap-4">
              <Link
                href="/dashboard/users"
                className="px-4 py-2 rounded-lg bg-[color:var(--secondary-background)] border border-[color:var(--border)] hover:bg-[color:var(--accent)]/20 transition-colors"
              >
                Return to User List
              </Link>
              <button
                onClick={() => setSubmitSuccess(false)}
                className="px-4 py-2 rounded-lg bg-[color:var(--primary)] text-white hover:bg-[color:var(--primary-dark)] transition-colors"
              >
                Invite Another User
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
                  First Name*
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
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="lastName"
                >
                  Last Name*
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
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="email"
                >
                  Email Address*
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
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="role"
                >
                  Role*
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
                  <option value="">Select a role</option>
                  <option value="Admin">Admin</option>
                  <option value="Staff">Staff</option>
                  <option value="Provider">Provider</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-500">{errors.role}</p>
                )}
              </div>
            </div>

            {/* Additional email invites */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-3">Additional Invites</h3>
              <p className="text-sm text-[color:var(--muted-foreground)] mb-4">
                You can invite multiple users with the same role and permissions
              </p>

              {additionalEmails.map((email, index) => (
                <div key={index} className="flex items-center gap-2 mb-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      handleAdditionalEmailChange(index, e.target.value)
                    }
                    className={`flex-grow px-3 py-2 rounded-lg bg-[color:var(--input)] border ${
                      errors[`additionalEmail${index}`]
                        ? "border-red-500"
                        : "border-[color:var(--border)]"
                    } focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)]`}
                    placeholder="Enter email address"
                  />
                  {index === additionalEmails.length - 1 ? (
                    <button
                      type="button"
                      onClick={addEmailField}
                      className="p-2 rounded-full hover:bg-[color:var(--accent)]/20"
                    >
                      <Plus size={20} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => removeEmailField(index)}
                      className="p-2 rounded-full hover:bg-[color:var(--accent)]/20"
                    >
                      <Minus size={20} />
                    </button>
                  )}
                </div>
              ))}
              {additionalEmails.map(
                (_, index) =>
                  errors[`additionalEmail${index}`] && (
                    <p
                      key={`error-${index}`}
                      className="mt-1 text-sm text-red-500"
                    >
                      {errors[`additionalEmail${index}`]}
                    </p>
                  )
              )}
            </div>

            {/* Access Rights */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-3">Access Rights</h3>
              <p className="text-sm text-[color:var(--muted-foreground)] mb-4">
                Select which permissions to grant to this user
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-[color:var(--border)] rounded-lg bg-[color:var(--secondary-background)]">
                <div>
                  <h4 className="font-medium mb-2">Users & Accounts</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="viewUsers"
                        name="viewUsers"
                        checked={formState.accessRights.viewUsers}
                        onChange={handleCheckboxChange}
                        className="rounded border-[color:var(--border)] text-[color:var(--primary)] focus:ring-[color:var(--primary)]"
                      />
                      <label htmlFor="viewUsers" className="ml-2 text-sm">
                        View Users
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="editUsers"
                        name="editUsers"
                        checked={formState.accessRights.editUsers}
                        onChange={handleCheckboxChange}
                        className="rounded border-[color:var(--border)] text-[color:var(--primary)] focus:ring-[color:var(--primary)]"
                      />
                      <label htmlFor="editUsers" className="ml-2 text-sm">
                        Edit Users
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="deleteUsers"
                        name="deleteUsers"
                        checked={formState.accessRights.deleteUsers}
                        onChange={handleCheckboxChange}
                        className="rounded border-[color:var(--border)] text-[color:var(--primary)] focus:ring-[color:var(--primary)]"
                      />
                      <label htmlFor="deleteUsers" className="ml-2 text-sm">
                        Delete Users
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Providers</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="viewProviders"
                        name="viewProviders"
                        checked={formState.accessRights.viewProviders}
                        onChange={handleCheckboxChange}
                        className="rounded border-[color:var(--border)] text-[color:var(--primary)] focus:ring-[color:var(--primary)]"
                      />
                      <label htmlFor="viewProviders" className="ml-2 text-sm">
                        View Providers
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="editProviders"
                        name="editProviders"
                        checked={formState.accessRights.editProviders}
                        onChange={handleCheckboxChange}
                        className="rounded border-[color:var(--border)] text-[color:var(--primary)] focus:ring-[color:var(--primary)]"
                      />
                      <label htmlFor="editProviders" className="ml-2 text-sm">
                        Edit Providers
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Reports & Analytics</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="viewReports"
                        name="viewReports"
                        checked={formState.accessRights.viewReports}
                        onChange={handleCheckboxChange}
                        className="rounded border-[color:var(--border)] text-[color:var(--primary)] focus:ring-[color:var(--primary)]"
                      />
                      <label htmlFor="viewReports" className="ml-2 text-sm">
                        View Reports & Analytics
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Billing & Payments</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="viewBilling"
                        name="viewBilling"
                        checked={formState.accessRights.viewBilling}
                        onChange={handleCheckboxChange}
                        className="rounded border-[color:var(--border)] text-[color:var(--primary)] focus:ring-[color:var(--primary)]"
                      />
                      <label htmlFor="viewBilling" className="ml-2 text-sm">
                        View Billing
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="editBilling"
                        name="editBilling"
                        checked={formState.accessRights.editBilling}
                        onChange={handleCheckboxChange}
                        className="rounded border-[color:var(--border)] text-[color:var(--primary)] focus:ring-[color:var(--primary)]"
                      />
                      <label htmlFor="editBilling" className="ml-2 text-sm">
                        Manage Billing & Payments
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Send email option */}
            <div className="mb-8">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sendEmailInvite"
                  name="sendEmailInvite"
                  checked={formState.sendEmailInvite}
                  onChange={handleCheckboxChange}
                  className="rounded border-[color:var(--border)] text-[color:var(--primary)] focus:ring-[color:var(--primary)]"
                />
                <label htmlFor="sendEmailInvite" className="ml-2 text-sm">
                  Send email invitation with account setup instructions
                </label>
              </div>
            </div>

            {/* Form actions */}
            <div className="flex justify-end gap-3">
              <Link
                href="/dashboard/users"
                className="px-4 py-2 rounded-lg bg-[color:var(--secondary-background)] border border-[color:var(--border)] hover:bg-[color:var(--accent)]/20 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg bg-[color:var(--primary)] text-white hover:bg-[color:var(--primary-dark)] transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Sending...</span>
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
