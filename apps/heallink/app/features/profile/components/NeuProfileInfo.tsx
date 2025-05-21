"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@/app/theme/ThemeProvider";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Heart,
  AlertTriangle,
  Edit,
  Check,
  X,
  UserCog,
  Activity,
  Shield,
  ChevronDown,
} from "lucide-react";
import { UserProfileData, UserProfileFormData } from "../types";

interface NeuProfileInfoProps {
  profile: UserProfileData | null | undefined;
  onUpdate: (data: UserProfileFormData) => Promise<boolean | undefined>;
}

export function NeuProfileInfo({ profile, onUpdate }: NeuProfileInfoProps) {
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{
    personal: boolean;
    address: boolean;
    emergency: boolean;
  }>({
    personal: true,
    address: false,
    emergency: false,
  });

  // Initialize form data with default empty values
  const [formData, setFormData] = useState<UserProfileFormData>({
    name: profile?.name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    dateOfBirth: profile?.dateOfBirth || "",
    gender: profile?.gender,
    address: {
      streetAddress: profile?.address?.streetAddress || "",
      city: profile?.address?.city || "",
      state: profile?.address?.state || "",
      zipCode: profile?.address?.zipCode || "",
      country: profile?.address?.country || "",
    },
    emergencyContact: {
      name: profile?.emergencyContact?.name || "",
      relationship: profile?.emergencyContact?.relationship || "",
      phone: profile?.emergencyContact?.phone || "",
    },
  });

  // If profile is not available, show a loading state
  if (!profile) {
    return (
      <div className="space-y-6 pt-20 sm:pt-12 pb-8">
        <div className="neumorph-card p-8 rounded-xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-primary/10 rounded w-1/3"></div>
            <div className="h-4 bg-primary/10 rounded w-2/3"></div>
            <div className="h-32 bg-primary/5 rounded"></div>
            <div className="h-4 bg-primary/10 rounded w-1/2"></div>
            <div className="h-4 bg-primary/10 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

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

  // Toggle section expansion
  const toggleSection = (section: "personal" | "address" | "emergency") => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
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
    const addr = profile?.address;
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
    <div className="space-y-6 pt-20 sm:pt-12 pb-8">
      {/* Notification banner while editing */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex justify-between items-center mb-6 p-4 rounded-xl neumorph-pressed bg-gradient-to-r from-purple-heart/10 to-royal-blue/10"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertTriangle size={18} className="text-yellow-500" />
              <span>
                You&apos;re currently editing your profile information
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 rounded-xl neumorph-flat flex items-center gap-1 transition-all hover:shadow-lg"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-heart to-royal-blue text-white flex items-center gap-1 transition-all disabled:opacity-70"
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
      </AnimatePresence>

      {/* Main content area with tabs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left sidebar with section navigation */}
        <div className="md:col-span-1">
          <div className="neumorph-card p-4 rounded-xl sticky top-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => toggleSection("personal")}
                  className="w-full flex items-center justify-between p-3 rounded-lg transition-all hover:bg-primary/5"
                >
                  <div className="flex items-center gap-3">
                    <User
                      className={
                        expandedSections.personal ? "text-primary" : ""
                      }
                      size={18}
                    />
                    <span
                      className={
                        expandedSections.personal
                          ? "text-primary font-medium"
                          : ""
                      }
                    >
                      Personal Info
                    </span>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${expandedSections.personal ? "rotate-180" : ""}`}
                  />
                </button>
              </li>
              <li>
                <button
                  onClick={() => toggleSection("address")}
                  className="w-full flex items-center justify-between p-3 rounded-lg transition-all hover:bg-primary/5"
                >
                  <div className="flex items-center gap-3">
                    <MapPin
                      className={expandedSections.address ? "text-primary" : ""}
                      size={18}
                    />
                    <span
                      className={
                        expandedSections.address
                          ? "text-primary font-medium"
                          : ""
                      }
                    >
                      Address
                    </span>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${expandedSections.address ? "rotate-180" : ""}`}
                  />
                </button>
              </li>
              <li>
                <button
                  onClick={() => toggleSection("emergency")}
                  className="w-full flex items-center justify-between p-3 rounded-lg transition-all hover:bg-primary/5"
                >
                  <div className="flex items-center gap-3">
                    <Heart
                      className={
                        expandedSections.emergency ? "text-primary" : ""
                      }
                      size={18}
                    />
                    <span
                      className={
                        expandedSections.emergency
                          ? "text-primary font-medium"
                          : ""
                      }
                    >
                      Emergency Contact
                    </span>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${expandedSections.emergency ? "rotate-180" : ""}`}
                  />
                </button>
              </li>
              <li className="pt-2 mt-2 border-t border-border">
                <button className="w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-primary/5">
                  <UserCog size={18} />
                  <span>Preferences</span>
                </button>
              </li>
              <li>
                <button className="w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-primary/5">
                  <Activity size={18} />
                  <span>Medical Info</span>
                </button>
              </li>
              <li>
                <button className="w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-primary/5">
                  <Shield size={18} />
                  <span>Security</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Right content area */}
        <div className="md:col-span-3 space-y-6">
          {/* Personal Information Card */}
          <AnimatePresence>
            {expandedSections.personal && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl overflow-hidden"
              >
                <div className="neumorph-card hover:shadow-lg transition-shadow">
                  {/* Card Header */}
                  <div className="flex justify-between items-center p-6 border-b border-border bg-gradient-to-r from-purple-heart/10 to-royal-blue/10">
                    <div className="flex items-center gap-2">
                      <User className="text-primary" size={20} />
                      <h2 className="text-lg font-semibold">
                        Personal Information
                      </h2>
                    </div>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-3 py-1.5 rounded-xl neumorph-flat flex items-center gap-1 hover:shadow-lg transition-all text-sm"
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
                              className="w-full px-4 py-3 rounded-xl border border-border bg-transparent neumorph-input focus:outline-none focus:ring-2 focus:ring-primary/50"
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
                              className="w-full px-4 py-3 rounded-xl border border-border bg-transparent neumorph-input focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-xl border border-border bg-transparent neumorph-input focus:outline-none focus:ring-2 focus:ring-primary/50"
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
                                className="w-full px-4 py-3 rounded-xl border border-border bg-transparent neumorph-input focus:outline-none focus:ring-2 focus:ring-primary/50"
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
                                className="w-full px-4 py-3 rounded-xl border border-border bg-transparent neumorph-input focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                              >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="prefer-not-to-say">
                                  Prefer not to say
                                </option>
                              </select>
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
                        </div>

                        <div className="space-y-6">
                          <ProfileInfoItem
                            icon={<Phone className="text-primary" size={18} />}
                            label="Phone Number"
                            value={profile.phone}
                            verified={profile.phoneVerified}
                          />

                          <ProfileInfoItem
                            icon={
                              <Calendar className="text-primary" size={18} />
                            }
                            label="Date of Birth"
                            value={
                              profile.dateOfBirth
                                ? `${formatDate(profile.dateOfBirth)} (${calculateAge(profile.dateOfBirth)} years old)`
                                : undefined
                            }
                          />

                          <ProfileInfoItem
                            icon={<Users className="text-primary" size={18} />}
                            label="Gender"
                            value={
                              profile.gender
                                ? profile.gender.charAt(0).toUpperCase() +
                                  profile.gender.slice(1)
                                : undefined
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Address Card */}
          <AnimatePresence>
            {expandedSections.address && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl overflow-hidden"
              >
                <div className="neumorph-card hover:shadow-lg transition-shadow">
                  {/* Card Header */}
                  <div className="flex justify-between items-center p-6 border-b border-border bg-gradient-to-r from-purple-heart/10 to-royal-blue/10">
                    <div className="flex items-center gap-2">
                      <MapPin className="text-primary" size={20} />
                      <h2 className="text-lg font-semibold">
                        Address Information
                      </h2>
                    </div>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-3 py-1.5 rounded-xl neumorph-flat flex items-center gap-1 hover:shadow-lg transition-all text-sm"
                      >
                        <Edit size={14} />
                        <span>Edit</span>
                      </button>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    {isEditing ? (
                      <div className="grid grid-cols-1 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Street Address
                          </label>
                          <input
                            type="text"
                            name="address.streetAddress"
                            value={formData.address?.streetAddress || ""}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-border bg-transparent neumorph-input focus:outline-none focus:ring-2 focus:ring-primary/50"
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
                              value={formData.address?.city || ""}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-xl border border-border bg-transparent neumorph-input focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">
                              State/Province
                            </label>
                            <input
                              type="text"
                              name="address.state"
                              value={formData.address?.state || ""}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-xl border border-border bg-transparent neumorph-input focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              ZIP/Postal Code
                            </label>
                            <input
                              type="text"
                              name="address.zipCode"
                              value={formData.address?.zipCode || ""}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-xl border border-border bg-transparent neumorph-input focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Country
                            </label>
                            <select
                              name="address.country"
                              value={formData.address?.country || ""}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-xl border border-border bg-transparent neumorph-input focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                            >
                              <option value="">Select Country</option>
                              <option value="us">United States</option>
                              <option value="ca">Canada</option>
                              <option value="uk">United Kingdom</option>
                              <option value="au">Australia</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4">
                        <ProfileInfoItem
                          icon={<MapPin className="text-primary" size={18} />}
                          label="Complete Address"
                          value={formatAddress()}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Emergency Contact Card */}
          <AnimatePresence>
            {expandedSections.emergency && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl overflow-hidden"
              >
                <div className="neumorph-card hover:shadow-lg transition-shadow">
                  {/* Card Header */}
                  <div className="flex justify-between items-center p-6 border-b border-border bg-gradient-to-r from-purple-heart/10 to-royal-blue/10">
                    <div className="flex items-center gap-2">
                      <Heart className="text-red-500" size={20} />
                      <h2 className="text-lg font-semibold">
                        Emergency Contact
                      </h2>
                    </div>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-3 py-1.5 rounded-xl neumorph-flat flex items-center gap-1 hover:shadow-lg transition-all text-sm"
                      >
                        <Edit size={14} />
                        <span>Edit</span>
                      </button>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    {isEditing ? (
                      <div className="grid grid-cols-1 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Contact Name
                          </label>
                          <input
                            type="text"
                            name="emergencyContact.name"
                            value={formData.emergencyContact?.name || ""}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-border bg-transparent neumorph-input focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Relationship
                            </label>
                            <select
                              name="emergencyContact.relationship"
                              value={
                                formData.emergencyContact?.relationship || ""
                              }
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-xl border border-border bg-transparent neumorph-input focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                            >
                              <option value="">Select Relationship</option>
                              <option value="spouse">Spouse</option>
                              <option value="parent">Parent</option>
                              <option value="child">Child</option>
                              <option value="sibling">Sibling</option>
                              <option value="friend">Friend</option>
                              <option value="other">Other</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Contact Phone
                            </label>
                            <input
                              type="tel"
                              name="emergencyContact.phone"
                              value={formData.emergencyContact?.phone || ""}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-xl border border-border bg-transparent neumorph-input focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <ProfileInfoItem
                          label="Contact Name"
                          value={profile.emergencyContact?.name || undefined}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <ProfileInfoItem
                            label="Relationship"
                            value={
                              profile.emergencyContact?.relationship
                                ? profile.emergencyContact.relationship
                                    .charAt(0)
                                    .toUpperCase() +
                                  profile.emergencyContact.relationship.slice(1)
                                : undefined
                            }
                          />

                          <ProfileInfoItem
                            label="Phone Number"
                            value={profile.emergencyContact?.phone || undefined}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
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
    <div className="neumorph-flat p-4 rounded-xl">
      <div className="flex gap-3">
        {icon && <div className="flex-shrink-0 pt-1">{icon}</div>}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">{label}</p>
            {verified !== undefined && (
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                  verified
                    ? "bg-green-500/10 text-green-500"
                    : "bg-yellow-500/10 text-yellow-500"
                }`}
              >
                {verified ? "Verified" : "Unverified"}
              </span>
            )}
          </div>
          <p className="text-foreground font-medium mt-1">
            {value || "Not specified"}
          </p>
        </div>
      </div>
    </div>
  );
}
