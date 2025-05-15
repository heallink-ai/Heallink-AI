"use client";

import React, { useState } from "react";
import { Save, User, Camera, Key } from "lucide-react";

export default function ProfilePage() {
  // Mock admin user data
  const [userData, setUserData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@heallink.com",
    phone: "+1 (555) 123-4567",
    role: "Administrator",
    department: "IT Operations",
    bio: "Senior system administrator with 5+ years of experience in healthcare technology platforms. Responsible for maintaining the Heallink platform and ensuring optimal performance and security.",
    profileImageUrl: null,
  });

  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  // Password change form
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Form errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateProfileForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!userData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!userData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!userData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateProfileForm()) {
      setIsSubmitting(true);

      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setSuccessMessage("Profile updated successfully");

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      }, 1000);
    }
  };

  const handleSubmitPassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (validatePasswordForm()) {
      setIsSubmitting(true);

      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setSuccessMessage("Password changed successfully");

        // Reset form
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      }, 1000);
    }
  };

  return (
    <div className="pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-sm text-[color:var(--muted-foreground)] mt-1">
          Manage your personal information, contact details, and account
          settings
        </p>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-[color:var(--card)] rounded-xl p-5 neumorph-flat">
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-3">
                {userData.profileImageUrl ? (
                  <img
                    src={userData.profileImageUrl}
                    alt={`${userData.firstName} ${userData.lastName}`}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-24 w-24 bg-[color:var(--primary)] rounded-full flex items-center justify-center text-white text-3xl">
                    {userData.firstName.charAt(0)}
                  </div>
                )}
                <button
                  className="absolute bottom-0 right-0 bg-[color:var(--card)] p-1.5 rounded-full border border-[color:var(--border)] hover:bg-[color:var(--accent)]/20"
                  title="Change profile picture"
                >
                  <Camera size={14} />
                </button>
              </div>

              <h3 className="font-medium text-lg">
                {userData.firstName} {userData.lastName}
              </h3>
              <p className="text-sm text-[color:var(--muted-foreground)]">
                {userData.role}
              </p>
            </div>

            {/* Navigation tabs */}
            <nav className="space-y-1">
              <button
                className={`w-full flex items-center px-3 py-2 rounded-lg text-sm ${
                  activeTab === "profile"
                    ? "bg-[color:var(--primary)] text-white font-medium"
                    : "hover:bg-[color:var(--accent)]/20"
                }`}
                onClick={() => setActiveTab("profile")}
              >
                <User size={16} className="mr-2" />
                Profile Information
              </button>
              <button
                className={`w-full flex items-center px-3 py-2 rounded-lg text-sm ${
                  activeTab === "security"
                    ? "bg-[color:var(--primary)] text-white font-medium"
                    : "hover:bg-[color:var(--accent)]/20"
                }`}
                onClick={() => setActiveTab("security")}
              >
                <Key size={16} className="mr-2" />
                Password & Security
              </button>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3">
          {activeTab === "profile" ? (
            <div className="bg-[color:var(--card)] rounded-xl p-6 neumorph-flat">
              <h2 className="text-lg font-medium mb-6">Profile Information</h2>

              <form onSubmit={handleSubmitProfile}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label
                      className="block text-sm font-medium mb-1.5"
                      htmlFor="firstName"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={userData.firstName}
                      onChange={handleProfileChange}
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
                      className="block text-sm font-medium mb-1.5"
                      htmlFor="lastName"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={userData.lastName}
                      onChange={handleProfileChange}
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
                      className="block text-sm font-medium mb-1.5"
                      htmlFor="email"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={userData.email}
                      onChange={handleProfileChange}
                      className={`w-full px-3 py-2 rounded-lg bg-[color:var(--input)] border ${
                        errors.email
                          ? "border-red-500"
                          : "border-[color:var(--border)]"
                      } focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)]`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-1.5"
                      htmlFor="phone"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={userData.phone}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 rounded-lg bg-[color:var(--input)] border border-[color:var(--border)] focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)]"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-1.5"
                      htmlFor="department"
                    >
                      Department
                    </label>
                    <input
                      type="text"
                      id="department"
                      name="department"
                      value={userData.department}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 rounded-lg bg-[color:var(--input)] border border-[color:var(--border)] focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)]"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-1.5"
                      htmlFor="role"
                    >
                      Role
                    </label>
                    <input
                      type="text"
                      id="role"
                      name="role"
                      value={userData.role}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 rounded-lg bg-[color:var(--input)] border border-[color:var(--border)] focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)]"
                      disabled
                    />
                    <p className="mt-1 text-xs text-[color:var(--muted-foreground)]">
                      Your role cannot be changed here. Contact a system
                      administrator.
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    className="block text-sm font-medium mb-1.5"
                    htmlFor="bio"
                  >
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={userData.bio}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 rounded-lg bg-[color:var(--input)] border border-[color:var(--border)] focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)] min-h-[120px] resize-none"
                  ></textarea>
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
          ) : (
            <div className="bg-[color:var(--card)] rounded-xl p-6 neumorph-flat">
              <h2 className="text-lg font-medium mb-6">Password & Security</h2>

              <form onSubmit={handleSubmitPassword}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label
                      className="block text-sm font-medium mb-1.5"
                      htmlFor="currentPassword"
                    >
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className={`w-full px-3 py-2 rounded-lg bg-[color:var(--input)] border ${
                        errors.currentPassword
                          ? "border-red-500"
                          : "border-[color:var(--border)]"
                      } focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)]`}
                    />
                    {errors.currentPassword && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.currentPassword}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-1.5"
                      htmlFor="newPassword"
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className={`w-full px-3 py-2 rounded-lg bg-[color:var(--input)] border ${
                        errors.newPassword
                          ? "border-red-500"
                          : "border-[color:var(--border)]"
                      } focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)]`}
                    />
                    {errors.newPassword ? (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.newPassword}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-[color:var(--muted-foreground)]">
                        Password must be at least 8 characters
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-1.5"
                      htmlFor="confirmPassword"
                    >
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className={`w-full px-3 py-2 rounded-lg bg-[color:var(--input)] border ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-[color:var(--border)]"
                      } focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)]`}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
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
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Key size={16} />
                        <span>Update Password</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
