"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { UserProfileData, UserProfileFormData } from "../types";
import { FormItem } from "./FormItem";

interface PersonalProfileViewProps {
  profile: UserProfileData | null;
  isUpdating: boolean;
  onUpdate: (data: UserProfileFormData) => Promise<boolean | undefined>;
}

interface BadgeFormItemProps {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
  description?: string;
  badge?: string;
  badgeColor?: "success" | "warning" | "error" | "info";
}

// Custom form item with badge support
function BadgeFormItem({
  label,
  htmlFor,
  children,
  required = false,
  description,
  badge,
  badgeColor = "info",
}: BadgeFormItemProps) {
  // Map color classes
  const colorClasses = {
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={htmlFor} className="text-sm font-medium">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
        {badge && (
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${colorClasses[badgeColor]}`}
          >
            {badge}
          </span>
        )}
      </div>

      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      {children}
    </div>
  );
}

export function PersonalProfileView({
  profile,
  isUpdating,
  onUpdate,
}: PersonalProfileViewProps) {
  const [formData, setFormData] = useState<UserProfileFormData>({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: undefined,
    address: {
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
    communicationPreferences: {
      email: true,
      sms: true,
      push: true,
    },
  });

  // Initialize form with profile data when available
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        dateOfBirth: profile.dateOfBirth || "",
        gender: profile.gender || undefined,
        address: profile.address || {
          streetAddress: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
        },
        emergencyContact: profile.emergencyContact || {
          name: "",
          relationship: "",
          phone: "",
        },
        communicationPreferences: profile.communicationPreferences || {
          email: true,
          sms: true,
          push: true,
        },
      });
    }
  }, [profile]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [section, field] = name.split(".");

      if (section === "address") {
        setFormData((prev) => ({
          ...prev,
          address: {
            ...(prev.address || {}),
            [field]: value,
          },
        }));
      } else if (section === "emergencyContact") {
        setFormData((prev) => ({
          ...prev,
          emergencyContact: {
            ...(prev.emergencyContact || {}),
            [field]: value,
          },
        }));
      } else if (section === "communicationPreferences") {
        setFormData((prev) => ({
          ...prev,
          communicationPreferences: {
            ...(prev.communicationPreferences || {
              email: true,
              sms: true,
              push: true,
            }),
            [field]: value === "true",
          },
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleToggleChange = (field: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      communicationPreferences: {
        ...prev.communicationPreferences!,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onUpdate(formData);

    if (success) {
      toast.success("Personal information updated successfully");
    }
  };

  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.1,
      },
    },
  };

  const sectionAnimation = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  // Gender options
  const genderOptions = [
    { value: "", label: "Select gender" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
    { value: "prefer-not-to-say", label: "Prefer not to say" },
  ];

  // Country options
  const countryOptions = [
    { value: "", label: "Select country" },
    { value: "us", label: "United States" },
    { value: "ca", label: "Canada" },
    { value: "uk", label: "United Kingdom" },
    { value: "au", label: "Australia" },
    { value: "other", label: "Other" },
  ];

  // Relationship options
  const relationshipOptions = [
    { value: "", label: "Select relationship" },
    { value: "spouse", label: "Spouse" },
    { value: "parent", label: "Parent" },
    { value: "child", label: "Child" },
    { value: "sibling", label: "Sibling" },
    { value: "friend", label: "Friend" },
    { value: "other", label: "Other" },
  ];

  return (
    <motion.form
      onSubmit={handleSubmit}
      variants={containerAnimation}
      initial="hidden"
      animate="visible"
      className="grid gap-8"
    >
      {/* Basic Information Section */}
      <motion.div variants={sectionAnimation} className="space-y-5">
        <div className="flex items-center gap-2 mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <h2 className="text-xl font-semibold">Basic Information</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormItem label="Full Name" htmlFor="name" required>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </FormItem>

          <FormItem label="Date of Birth" htmlFor="dateOfBirth">
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </FormItem>

          <BadgeFormItem
            label="Email Address"
            htmlFor="email"
            badge={profile?.emailVerified ? "Verified" : "Not Verified"}
            badgeColor={profile?.emailVerified ? "success" : "warning"}
          >
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@email.com"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </BadgeFormItem>

          <BadgeFormItem
            label="Phone Number"
            htmlFor="phone"
            badge={profile?.phoneVerified ? "Verified" : "Not Verified"}
            badgeColor={profile?.phoneVerified ? "success" : "warning"}
          >
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+1 (123) 456-7890"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </BadgeFormItem>

          <FormItem label="Gender" htmlFor="gender">
            <select
              id="gender"
              name="gender"
              value={formData.gender || ""}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {genderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormItem>
        </div>
      </motion.div>

      {/* Address Section */}
      <motion.div variants={sectionAnimation} className="space-y-5">
        <div className="flex items-center gap-2 mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <h2 className="text-xl font-semibold">Address Information</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <FormItem label="Street Address" htmlFor="address.streetAddress">
              <input
                id="address.streetAddress"
                name="address.streetAddress"
                type="text"
                value={formData.address?.streetAddress || ""}
                onChange={handleInputChange}
                placeholder="123 Main St"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </FormItem>
          </div>

          <FormItem label="City" htmlFor="address.city">
            <input
              id="address.city"
              name="address.city"
              type="text"
              value={formData.address?.city || ""}
              onChange={handleInputChange}
              placeholder="New York"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </FormItem>

          <FormItem label="State/Province" htmlFor="address.state">
            <input
              id="address.state"
              name="address.state"
              type="text"
              value={formData.address?.state || ""}
              onChange={handleInputChange}
              placeholder="NY"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </FormItem>

          <FormItem label="ZIP/Postal Code" htmlFor="address.zipCode">
            <input
              id="address.zipCode"
              name="address.zipCode"
              type="text"
              value={formData.address?.zipCode || ""}
              onChange={handleInputChange}
              placeholder="10001"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </FormItem>

          <FormItem label="Country" htmlFor="address.country">
            <select
              id="address.country"
              name="address.country"
              value={formData.address?.country || ""}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {countryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormItem>
        </div>
      </motion.div>

      {/* Emergency Contact Section */}
      <motion.div variants={sectionAnimation} className="space-y-5">
        <div className="flex items-center gap-2 mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          >
            <path d="m18 16 4-4-4-4" />
            <path d="m6 8-4 4 4 4" />
            <path d="m14.5 4-5 16" />
          </svg>
          <h2 className="text-xl font-semibold">Emergency Contact</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormItem label="Contact Name" htmlFor="emergencyContact.name">
            <input
              id="emergencyContact.name"
              name="emergencyContact.name"
              type="text"
              value={formData.emergencyContact?.name || ""}
              onChange={handleInputChange}
              placeholder="Jane Doe"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </FormItem>

          <FormItem
            label="Relationship"
            htmlFor="emergencyContact.relationship"
          >
            <select
              id="emergencyContact.relationship"
              name="emergencyContact.relationship"
              value={formData.emergencyContact?.relationship || ""}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {relationshipOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormItem>

          <FormItem label="Contact Phone" htmlFor="emergencyContact.phone">
            <input
              id="emergencyContact.phone"
              name="emergencyContact.phone"
              type="tel"
              value={formData.emergencyContact?.phone || ""}
              onChange={handleInputChange}
              placeholder="(123) 456-7890"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </FormItem>
        </div>
      </motion.div>

      {/* Communication Preferences Section */}
      <motion.div variants={sectionAnimation} className="space-y-5">
        <div className="flex items-center gap-2 mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <h2 className="text-xl font-semibold">Communication Preferences</h2>
        </div>

        <div className="grid gap-4">
          <div className="flex items-center">
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={formData.communicationPreferences?.email || false}
                onChange={(e) => handleToggleChange("email", e.target.checked)}
              />
              <div className="h-6 w-11 rounded-full bg-muted peer-checked:bg-primary after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"></div>
              <span className="ml-3">Email Notifications</span>
            </label>
          </div>

          <div className="flex items-center">
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={formData.communicationPreferences?.sms || false}
                onChange={(e) => handleToggleChange("sms", e.target.checked)}
              />
              <div className="h-6 w-11 rounded-full bg-muted peer-checked:bg-primary after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"></div>
              <span className="ml-3">SMS Notifications</span>
            </label>
          </div>

          <div className="flex items-center">
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={formData.communicationPreferences?.push || false}
                onChange={(e) => handleToggleChange("push", e.target.checked)}
              />
              <div className="h-6 w-11 rounded-full bg-muted peer-checked:bg-primary after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"></div>
              <span className="ml-3">Push Notifications</span>
            </label>
          </div>
        </div>
      </motion.div>

      {/* Submit Button */}
      <motion.div variants={sectionAnimation} className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isUpdating}
          className="rounded-lg bg-primary px-6 py-3 font-medium text-white shadow-lg transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUpdating ? (
            <span className="flex items-center gap-2">
              <svg
                className="h-5 w-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving Changes...
            </span>
          ) : (
            "Save Changes"
          )}
        </button>
      </motion.div>
    </motion.form>
  );
}
