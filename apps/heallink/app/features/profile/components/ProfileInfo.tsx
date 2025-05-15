"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/app/theme/ThemeProvider";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Heart,
  Check,
  X,
  AlertTriangle,
  Edit,
} from "lucide-react";
import { UserProfileData, UserProfileFormData } from "../types";

interface ProfileInfoProps {
  profile: UserProfileData;
  onUpdate: (data: UserProfileFormData) => Promise<boolean | undefined>;
}

export default function ProfileInfo({ profile, onUpdate }: ProfileInfoProps) {
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email || "",
    phone: profile.phone || "",
    dateOfBirth: profile.dateOfBirth || "",
    gender: profile.gender || "",
    address: {
      streetAddress: profile.address?.streetAddress || "",
      city: profile.address?.city || "",
      state: profile.address?.state || "",
      zipCode: profile.address?.zipCode || "",
      country: profile.address?.country || "",
    },
    emergencyContact: {
      name: profile.emergencyContact?.name || "",
      relationship: profile.emergencyContact?.relationship || "",
      phone: profile.emergencyContact?.phone || "",
    },
  } as UserProfileFormData);

  // Shadow color based on theme
  const shadowColor =
    theme === "dark" ? "rgba(0, 0, 0, 0.35)" : "rgba(0, 0, 0, 0.15)";

  // Card variants for animations
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  // Handle form change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [section, field] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...(prev[section as keyof typeof prev] as Record<string, string>),
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return null;

    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Save profile changes
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const success = await onUpdate(formData);
      if (success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Format address for display
  const formatAddress = () => {
    const addr = profile.address;
    if (!addr) return "Not specified";

    const parts = [
      addr.streetAddress,
      addr.city,
      addr.state,
      addr.zipCode,
      addr.country?.toUpperCase(),
    ].filter(Boolean);

    return parts.join(", ");
  };

  return (
    <div className="space-y-6">
      {/* Profile Actions */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-6 p-4 rounded-xl border border-border bg-background"
          style={{
            boxShadow: `0 8px 16px ${shadowColor}`,
          }}
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertTriangle size={18} className="text-yellow-500" />
            <span>You&apos;re currently editing your profile information</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 rounded-lg border border-border flex items-center gap-1 hover:bg-muted/20 transition-colors"
            >
              <X size={16} />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-3 py-1.5 rounded-lg bg-primary text-white flex items-center gap-1 hover:bg-primary/90 transition-colors disabled:opacity-70"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* Personal Information Card */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="rounded-2xl overflow-hidden"
      >
        <div className="neumorph-card hover:transform-none">
          {/* Card Header */}
          <div className="flex justify-between items-center p-6 border-b border-border">
            <div className="flex items-center gap-2">
              <User className="text-primary" size={20} />
              <h2 className="text-lg font-semibold">Personal Information</h2>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 rounded-lg border border-border flex items-center gap-1 hover:bg-primary/10 transition-colors text-sm"
              >
                <Edit size={14} />
                <span>Edit</span>
              </button>
            )}
          </div>

          {/* Card Content */}
          <div className="p-6">
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-transparent neumorph-input focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-transparent neumorph-input focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-transparent neumorph-input focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-input bg-transparent neumorph-input focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-input bg-transparent neumorph-input focus:outline-none appearance-none"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">
                          Prefer not to say
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="address.streetAddress"
                      value={formData.address.streetAddress}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-transparent neumorph-input focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-input bg-transparent neumorph-input focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-input bg-transparent neumorph-input focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        name="address.zipCode"
                        value={formData.address.zipCode}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-input bg-transparent neumorph-input focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-input bg-transparent neumorph-input focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <ProfileInfoItem
                    icon={<User className="text-primary" size={18} />}
                    label="Full Name"
                    value={profile.name}
                  />

                  <ProfileInfoItem
                    icon={<Mail className="text-primary" size={18} />}
                    label="Email Address"
                    value={profile.email}
                    verified={profile.emailVerified}
                  />

                  <ProfileInfoItem
                    icon={<Phone className="text-primary" size={18} />}
                    label="Phone Number"
                    value={profile.phone}
                    verified={profile.phoneVerified}
                  />

                  <ProfileInfoItem
                    icon={<Calendar className="text-primary" size={18} />}
                    label="Date of Birth"
                    value={
                      profile.dateOfBirth
                        ? `${formatDate(profile.dateOfBirth)} (${calculateAge(profile.dateOfBirth)} years old)`
                        : "Not specified"
                    }
                  />

                  <ProfileInfoItem
                    icon={<Users className="text-primary" size={18} />}
                    label="Gender"
                    value={
                      profile.gender
                        ? profile.gender.charAt(0).toUpperCase() +
                          profile.gender.slice(1)
                        : "Not specified"
                    }
                  />
                </div>

                <div className="space-y-6">
                  <ProfileInfoItem
                    icon={<MapPin className="text-primary" size={18} />}
                    label="Address"
                    value={formatAddress()}
                  />

                  <div className="pt-4 border-t border-border">
                    <h3 className="text-md font-medium mb-4 flex items-center gap-2">
                      <Heart className="text-red-500" size={16} />
                      Emergency Contact
                    </h3>

                    <div className="space-y-4 pl-4">
                      <ProfileInfoItem
                        label="Name"
                        value={
                          profile.emergencyContact?.name || "Not specified"
                        }
                      />

                      <ProfileInfoItem
                        label="Relationship"
                        value={
                          profile.emergencyContact?.relationship ||
                          "Not specified"
                        }
                      />

                      <ProfileInfoItem
                        label="Phone"
                        value={
                          profile.emergencyContact?.phone || "Not specified"
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Helper component for displaying profile information
function ProfileInfoItem({
  icon,
  label,
  value,
  verified,
}: {
  icon?: React.ReactNode;
  label: string;
  value?: string;
  verified?: boolean;
}) {
  return (
    <div className="flex gap-3">
      {icon && <div className="flex-shrink-0 pt-1">{icon}</div>}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">{label}</p>
          {verified !== undefined && (
            <span
              className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs ${
                verified
                  ? "bg-green-500/10 text-green-500"
                  : "bg-yellow-500/10 text-yellow-500"
              }`}
            >
              {verified ? "Verified" : "Unverified"}
            </span>
          )}
        </div>
        <p className="text-foreground font-medium">
          {value || "Not specified"}
        </p>
      </div>
    </div>
  );
}
