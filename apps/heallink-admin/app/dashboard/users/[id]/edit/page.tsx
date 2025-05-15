"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Trash, User } from "lucide-react";

// Mock user data - in a real app, this would be fetched based on the id param
const MOCK_USER = {
  id: "u1",
  name: "John Smith",
  firstName: "John",
  lastName: "Smith",
  email: "john.smith@example.com",
  phone: "+1 (555) 123-4567",
  role: "Admin",
  status: "Active",
  lastLogin: "2025-05-10T14:30:00",
  created: "2024-11-05T09:00:00",
  address: "123 Medical Drive, San Francisco, CA 94107",
  organization: "Heallink Central Hospital",
  department: "Administration",
  bio: "Healthcare administrator with over 10 years of experience in hospital management systems.",
  profileImage: null, // In a real app, this would be an image URL
};

export default function EditUserPage({ params }: { params: { id: string } }) {
  const userId = params.id;

  // In a real app, you'd fetch user data based on the ID
  const user = MOCK_USER; // Pretend we fetched the user with this ID

  // Form state
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    address: user.address,
    organization: user.organization,
    department: user.department,
    bio: user.bio,
  });

  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
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

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Validation rules
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
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
        setSuccessMessage("User profile updated successfully");

        // Clear success message after a few seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
      }, 1500);
    }
  };

  return (
    <div className="bg-[color:var(--background)]">
      {/* Header with back button */}
      <div className="flex items-center gap-2 mb-6">
        <Link
          href={`/dashboard/users/${userId}`}
          className="p-2 rounded-full hover:bg-[color:var(--accent)]/20 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-semibold">Edit User</h1>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="mb-6 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-4 rounded-lg">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile image and basic info */}
          <div className="lg:col-span-1">
            <div className="bg-[color:var(--card)] rounded-xl p-6 neumorph-flat">
              <div className="flex flex-col items-center text-center mb-6">
                {/* Profile image */}
                <div className="relative mb-4">
                  <div className="h-24 w-24 bg-[color:var(--primary)] text-white rounded-full flex items-center justify-center text-4xl">
                    {user.firstName.charAt(0)}
                  </div>
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 bg-[color:var(--background)] rounded-full p-2 border border-[color:var(--border)] hover:bg-[color:var(--accent)]/20"
                  >
                    <User size={14} />
                  </button>
                </div>

                <h2 className="text-xl font-semibold">
                  {formData.firstName} {formData.lastName}
                </h2>
                <p className="text-sm text-[color:var(--muted-foreground)]">
                  {formData.email}
                </p>
              </div>

              <div className="space-y-4 border-t border-[color:var(--border)] pt-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="role"
                  >
                    User Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    className="w-full px-3 py-2 rounded-lg bg-[color:var(--input)] border border-[color:var(--border)] focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)]"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Staff">Staff</option>
                    <option value="Provider">Provider</option>
                  </select>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="status"
                  >
                    Account Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="w-full px-3 py-2 rounded-lg bg-[color:var(--input)] border border-[color:var(--border)] focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)]"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  className="w-full px-4 py-2 rounded-lg flex items-center justify-center gap-2 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                  <Trash size={16} />
                  <span>Delete User</span>
                </button>
              </div>
            </div>
          </div>

          {/* User details form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[color:var(--card)] rounded-xl p-6 neumorph-flat">
              <h3 className="text-lg font-medium mb-4">Personal Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                    className={`w-full px-3 py-2 rounded-lg bg-[color:var(--input)] border ${
                      errors.firstName
                        ? "border-red-500"
                        : "border-[color:var(--border)]"
                    } focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)]`}
                    value={formData.firstName}
                    onChange={handleChange}
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
                    className={`w-full px-3 py-2 rounded-lg bg-[color:var(--input)] border ${
                      errors.lastName
                        ? "border-red-500"
                        : "border-[color:var(--border)]"
                    } focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)]`}
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.lastName}
                    </p>
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
                    className={`w-full px-3 py-2 rounded-lg bg-[color:var(--input)] border ${
                      errors.email
                        ? "border-red-500"
                        : "border-[color:var(--border)]"
                    } focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)]`}
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="phone"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-3 py-2 rounded-lg bg-[color:var(--input)] border border-[color:var(--border)] focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)]"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="address"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="w-full px-3 py-2 rounded-lg bg-[color:var(--input)] border border-[color:var(--border)] focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)]"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="organization"
                  >
                    Organization
                  </label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    className="w-full px-3 py-2 rounded-lg bg-[color:var(--input)] border border-[color:var(--border)] focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)]"
                    value={formData.organization}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="department"
                  >
                    Department
                  </label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    className="w-full px-3 py-2 rounded-lg bg-[color:var(--input)] border border-[color:var(--border)] focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)]"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="bg-[color:var(--card)] rounded-xl p-6 neumorph-flat">
              <h3 className="text-lg font-medium mb-4">About</h3>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="bio">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg bg-[color:var(--input)] border border-[color:var(--border)] focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)] resize-none"
                  value={formData.bio}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Link
            href={`/dashboard/users/${userId}`}
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
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
