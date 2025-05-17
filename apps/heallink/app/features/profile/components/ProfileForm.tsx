"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FormField } from "./FormField";
import { SelectField } from "./SelectField";
import { ToggleField } from "./ToggleField";
import { FormSection } from "./FormSection";
import { ProfileAvatarUpload } from "./ProfileAvatarUpload";
import { UserProfileData, UserProfileFormData } from "../types";

interface ProfileFormProps {
  profile: UserProfileData | null;
  isLoading: boolean;
  isUpdating: boolean;
  isUploading: boolean;
  onSubmit: (data: UserProfileFormData) => Promise<void>;
  onAvatarUpload: (file: File) => Promise<void>;
}

export const ProfileForm = ({
  profile,
  isLoading,
  isUpdating,
  isUploading,
  onSubmit,
  onAvatarUpload,
}: ProfileFormProps) => {
  // Form state
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
    insurance: {
      provider: "",
      policyNumber: "",
      groupNumber: "",
      primaryInsured: "",
      relationship: "",
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
        insurance: profile.insurance || {
          provider: "",
          policyNumber: "",
          groupNumber: "",
          primaryInsured: "",
          relationship: "",
        },
        communicationPreferences: profile.communicationPreferences || {
          email: true,
          sms: true,
          push: true,
        },
      });
    }
  }, [profile]);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Handle nested fields
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
      } else if (section === "insurance") {
        setFormData((prev) => ({
          ...prev,
          insurance: {
            ...(prev.insurance || {}),
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

  // Handle toggle changes
  const handleToggleChange = (field: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      communicationPreferences: {
        ...prev.communicationPreferences,
        [field]: value,
      },
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  // Gender options
  const genderOptions = [
    { value: "", label: "Select gender" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
    { value: "prefer-not-to-say", label: "Prefer not to say" },
  ];

  // Country options (simplified list)
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
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-8">
        <ProfileAvatarUpload
          avatarUrl={profile?.avatarUrl}
          name={profile?.name || ""}
          onAvatarChange={onAvatarUpload}
          isUploading={isUploading}
        />

        <div className="w-full text-center md:text-left">
          <h1 className="mb-2 text-2xl font-bold">
            {profile?.name || "Your Profile"}
          </h1>
          <p className="text-muted-foreground">
            Manage your personal information and preferences
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div className="grid gap-6">
        {/* Personal Information */}
        <FormSection
          title="Personal Information"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="8" r="5" />
              <path d="M20 21a8 8 0 1 0-16 0" />
            </svg>
          }
        >
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              label="Full Name"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="John Doe"
              required
            />
            <FormField
              label="Email"
              id="email"
              name="email"
              type="email"
              value={formData.email || ""}
              onChange={handleInputChange}
              placeholder="john.doe@example.com"
              isVerified={profile?.emailVerified}
              readOnly={!!profile?.email} // Email is readonly if already set
            />
            <FormField
              label="Phone Number"
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone || ""}
              onChange={handleInputChange}
              placeholder="(123) 456-7890"
              isVerified={profile?.phoneVerified}
              readOnly={!!profile?.phone} // Phone is readonly if already set
            />
            <FormField
              label="Date of Birth"
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth || ""}
              onChange={handleInputChange}
            />
            <SelectField
              label="Gender"
              id="gender"
              name="gender"
              value={formData.gender || ""}
              onChange={handleInputChange}
              options={genderOptions}
            />
          </div>
        </FormSection>

        {/* Address Information */}
        <FormSection
          title="Address"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          }
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <FormField
                label="Street Address"
                id="address.streetAddress"
                name="address.streetAddress"
                value={formData.address?.streetAddress || ""}
                onChange={handleInputChange}
                placeholder="123 Main St"
              />
            </div>
            <FormField
              label="City"
              id="address.city"
              name="address.city"
              value={formData.address?.city || ""}
              onChange={handleInputChange}
              placeholder="New York"
            />
            <FormField
              label="State/Province"
              id="address.state"
              name="address.state"
              value={formData.address?.state || ""}
              onChange={handleInputChange}
              placeholder="NY"
            />
            <FormField
              label="Zip/Postal Code"
              id="address.zipCode"
              name="address.zipCode"
              value={formData.address?.zipCode || ""}
              onChange={handleInputChange}
              placeholder="10001"
            />
            <SelectField
              label="Country"
              id="address.country"
              name="address.country"
              value={formData.address?.country || ""}
              onChange={handleInputChange}
              options={countryOptions}
            />
          </div>
        </FormSection>

        {/* Emergency Contact */}
        <FormSection
          title="Emergency Contact"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 2v4" />
              <path d="M16 2v4" />
              <rect width="18" height="18" x="3" y="4" rx="2" />
              <path d="M12 4v16" />
              <path d="M3 13h18" />
            </svg>
          }
        >
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              label="Name"
              id="emergencyContact.name"
              name="emergencyContact.name"
              value={formData.emergencyContact?.name || ""}
              onChange={handleInputChange}
              placeholder="Jane Doe"
            />
            <SelectField
              label="Relationship"
              id="emergencyContact.relationship"
              name="emergencyContact.relationship"
              value={formData.emergencyContact?.relationship || ""}
              onChange={handleInputChange}
              options={relationshipOptions}
            />
            <FormField
              label="Phone Number"
              id="emergencyContact.phone"
              name="emergencyContact.phone"
              type="tel"
              value={formData.emergencyContact?.phone || ""}
              onChange={handleInputChange}
              placeholder="(123) 456-7890"
            />
          </div>
        </FormSection>

        {/* Insurance Information */}
        <FormSection
          title="Insurance Information"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <line x1="2" x2="22" y1="10" y2="10" />
            </svg>
          }
        >
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              label="Insurance Provider"
              id="insurance.provider"
              name="insurance.provider"
              value={formData.insurance?.provider || ""}
              onChange={handleInputChange}
              placeholder="Blue Cross Blue Shield"
            />
            <FormField
              label="Policy Number"
              id="insurance.policyNumber"
              name="insurance.policyNumber"
              value={formData.insurance?.policyNumber || ""}
              onChange={handleInputChange}
              placeholder="12345678"
            />
            <FormField
              label="Group Number"
              id="insurance.groupNumber"
              name="insurance.groupNumber"
              value={formData.insurance?.groupNumber || ""}
              onChange={handleInputChange}
              placeholder="G-12345"
            />
            <FormField
              label="Primary Insured"
              id="insurance.primaryInsured"
              name="insurance.primaryInsured"
              value={formData.insurance?.primaryInsured || ""}
              onChange={handleInputChange}
              placeholder="John Doe"
            />
            <SelectField
              label="Relationship to Insured"
              id="insurance.relationship"
              name="insurance.relationship"
              value={formData.insurance?.relationship || ""}
              onChange={handleInputChange}
              options={relationshipOptions}
            />
          </div>
        </FormSection>

        {/* Communication Preferences */}
        <FormSection
          title="Communication Preferences"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4.5" />
              <path d="M14 14H4" />
              <path d="M4 10h8" />
              <path d="M18 15l3 3l3-3" />
              <path d="M21 18V8" />
            </svg>
          }
        >
          <div className="space-y-4">
            <ToggleField
              label="Email Notifications"
              id="communicationPreferences.email"
              checked={formData.communicationPreferences?.email || false}
              onChange={(checked) => handleToggleChange("email", checked)}
            />
            <ToggleField
              label="SMS/Text Notifications"
              id="communicationPreferences.sms"
              checked={formData.communicationPreferences?.sms || false}
              onChange={(checked) => handleToggleChange("sms", checked)}
            />
            <ToggleField
              label="Push Notifications"
              id="communicationPreferences.push"
              checked={formData.communicationPreferences?.push || false}
              onChange={(checked) => handleToggleChange("push", checked)}
            />
          </div>
        </FormSection>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <motion.button
          type="submit"
          className="rounded-lg bg-primary px-6 py-3 font-medium text-white shadow-lg transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isUpdating || isLoading}
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
              Saving...
            </span>
          ) : (
            "Save Changes"
          )}
        </motion.button>
      </div>
    </form>
  );
};
