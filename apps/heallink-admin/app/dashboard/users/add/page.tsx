"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Check, User } from "lucide-react";

export default function AddUserPage() {
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    dateOfBirth: "",
    gender: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US",
    },
    sendWelcomeEmail: true,
    notes: "",
  });

  // Validation state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // Handle nested address fields
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormState((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormState((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

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
    setFormState((prev) => ({
      ...prev,
      [name]: checked,
    }));
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
            phone: "",
            role: "",
            dateOfBirth: "",
            gender: "",
            address: {
              street: "",
              city: "",
              state: "",
              zipCode: "",
              country: "US",
            },
            sendWelcomeEmail: true,
            notes: "",
          });
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
        <div className="flex items-center">
          <User size={24} className="mr-2 text-[color:var(--primary)]" />
          <h1 className="text-2xl font-semibold">Add New User</h1>
        </div>
      </div>

      <div className="bg-[color:var(--card)] rounded-xl p-6 neumorph-flat">
        {submitSuccess ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
              <Check size={24} className="text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-medium mb-2">
              User Added Successfully
            </h2>
            <p className="text-[color:var(--muted-foreground)] text-center max-w-md mb-6">
              The user has been added to the system.
              {formState.sendWelcomeEmail &&
                " A welcome email has been sent to the user."}
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
                Add Another User
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="firstName"
                  >
                    First Name <span className="text-red-500">*</span>
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
                    <p className="mt-1 text-xs text-red-500">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="lastName"
                  >
                    Last Name <span className="text-red-500">*</span>
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
                    <p className="mt-1 text-xs text-red-500">
                      {errors.lastName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="email"
                  >
                    Email Address <span className="text-red-500">*</span>
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
                    htmlFor="phone"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formState.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg bg-[color:var(--input)] border border-[color:var(--border)] focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)]"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="role"
                  >
                    User Role <span className="text-red-500">*</span>
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
                    <option value="">Select Role</option>
                    <option value="Patient">Patient</option>
                    <option value="Provider Staff">Provider Staff</option>
                    <option value="Family Member">Family Member</option>
                  </select>
                  {errors.role && (
                    <p className="mt-1 text-xs text-red-500">{errors.role}</p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="dateOfBirth"
                  >
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formState.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg bg-[color:var(--input)] border border-[color:var(--border)] focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)]"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="gender"
                  >
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formState.gender}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg bg-[color:var(--input)] border border-[color:var(--border)] focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)]"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Address Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="address.street"
                  >
                    Street Address
                  </label>
                  <input
                    type="text"
                    id="address.street"
                    name="address.street"
                    value={formState.address.street}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg bg-[color:var(--input)] border border-[color:var(--border)] focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)]"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="address.city"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="address.city"
                    name="address.city"
                    value={formState.address.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg bg-[color:var(--input)] border border-[color:var(--border)] focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)]"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="address.state"
                  >
                    State / Province
                  </label>
                  <input
                    type="text"
                    id="address.state"
                    name="address.state"
                    value={formState.address.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg bg-[color:var(--input)] border border-[color:var(--border)] focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)]"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="address.zipCode"
                  >
                    ZIP / Postal Code
                  </label>
                  <input
                    type="text"
                    id="address.zipCode"
                    name="address.zipCode"
                    value={formState.address.zipCode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg bg-[color:var(--input)] border border-[color:var(--border)] focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)]"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="address.country"
                  >
                    Country
                  </label>
                  <select
                    id="address.country"
                    name="address.country"
                    value={formState.address.country}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg bg-[color:var(--input)] border border-[color:var(--border)] focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)]"
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="MX">Mexico</option>
                    <option value="UK">United Kingdom</option>
                    {/* Add more options as needed */}
                  </select>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-1" htmlFor="notes">
                Notes / Additional Information
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                value={formState.notes}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-[color:var(--input)] border border-[color:var(--border)] focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)]"
              />
            </div>

            <div className="mb-8">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="sendWelcomeEmail"
                  name="sendWelcomeEmail"
                  checked={formState.sendWelcomeEmail}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded border-[color:var(--border)] bg-[color:var(--input)] text-[color:var(--primary)] focus:ring-[color:var(--ring)]"
                />
                <label
                  htmlFor="sendWelcomeEmail"
                  className="ml-2 text-sm font-medium"
                >
                  Send welcome email to user
                </label>
              </div>
              {formState.sendWelcomeEmail && (
                <div className="pl-6 border-l-2 border-[color:var(--border)] text-sm text-[color:var(--muted-foreground)]">
                  <p>
                    A welcome email will be sent to the user with instructions
                    to set up their account password and access the platform.
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
                    <span>Adding User...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Add User</span>
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
