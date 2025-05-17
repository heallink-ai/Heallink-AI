"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/app/theme/ThemeProvider";
import {
  HeartPulse,
  Pill,
  Droplets,
  AlertTriangle,
  Shield,
  FileText,
  Plus,
  X,
  Edit,
  Trash2,
  Check,
  User,
  Activity,
} from "lucide-react";
import { UserProfileData, UserProfileFormData } from "../types";

interface ProfileMedicalProps {
  profile: UserProfileData;
  onUpdate: (data: UserProfileFormData) => Promise<boolean | undefined>;
}

export default function ProfileMedical({
  profile,
  onUpdate,
}: ProfileMedicalProps) {
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name,
    medicalInformation: {
      bloodType: profile.medicalInformation?.bloodType || "unknown",
      allergies: profile.medicalInformation?.allergies || [],
      medications: profile.medicalInformation?.medications || [],
      chronicConditions: profile.medicalInformation?.chronicConditions || [],
      insuranceProvider: profile.medicalInformation?.insuranceProvider || "",
      insurancePolicyNumber:
        profile.medicalInformation?.insurancePolicyNumber || "",
      primaryCarePhysician:
        profile.medicalInformation?.primaryCarePhysician || "",
    },
  });

  // New item state
  const [newAllergy, setNewAllergy] = useState("");
  const [newMedication, setNewMedication] = useState("");
  const [newCondition, setNewCondition] = useState("");

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

  // Item variants for staggered animations
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  // Handle form change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // Handle nested medicalInformation fields
    setFormData((prev) => ({
      ...prev,
      medicalInformation: {
        ...prev.medicalInformation,
        [name]: value,
      },
    }));
  };

  // Add new item to array fields
  const addItem = (
    field: "allergies" | "medications" | "chronicConditions",
    value: string
  ) => {
    if (!value.trim()) return;

    setFormData((prev) => ({
      ...prev,
      medicalInformation: {
        ...prev.medicalInformation,
        [field]: [...prev.medicalInformation[field], value.trim()],
      },
    }));

    // Reset input field
    switch (field) {
      case "allergies":
        setNewAllergy("");
        break;
      case "medications":
        setNewMedication("");
        break;
      case "chronicConditions":
        setNewCondition("");
        break;
    }
  };

  // Remove item from array fields
  const removeItem = (
    field: "allergies" | "medications" | "chronicConditions",
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      medicalInformation: {
        ...prev.medicalInformation,
        [field]: prev.medicalInformation[field].filter((_, i) => i !== index),
      },
    }));
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
      console.error("Error saving medical information:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
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
            <span>You&apos;re currently editing your medical information</span>
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
              className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground flex items-center gap-1 hover:bg-primary/90 transition-colors disabled:opacity-70"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Medical Information Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="md:col-span-2 rounded-2xl overflow-hidden"
        >
          <div className="neumorph-card hover:transform-none">
            {/* Card Header */}
            <div className="flex justify-between items-center p-6 border-b border-border">
              <div className="flex items-center gap-2">
                <HeartPulse className="text-red-500" size={20} />
                <h2 className="text-lg font-semibold">Medical Information</h2>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Blood Type */}
                <div className="space-y-2">
                  {isEditing ? (
                    <>
                      <label className="block text-sm font-medium">
                        Blood Type
                      </label>
                      <select
                        name="bloodType"
                        value={formData.medicalInformation.bloodType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-input bg-transparent neumorph-input focus:outline-none appearance-none"
                      >
                        <option value="unknown">Unknown</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </>
                  ) : (
                    <>
                      <div className="text-sm text-muted-foreground">
                        Blood Type
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                          <Droplets className="text-red-500" size={20} />
                        </div>
                        <span className="text-xl font-semibold">
                          {profile.medicalInformation?.bloodType === "unknown"
                            ? "Unknown"
                            : profile.medicalInformation?.bloodType}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Insurance Provider */}
                <div className="space-y-2">
                  {isEditing ? (
                    <>
                      <label className="block text-sm font-medium">
                        Insurance Provider
                      </label>
                      <input
                        type="text"
                        name="insuranceProvider"
                        value={formData.medicalInformation.insuranceProvider}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-input bg-transparent neumorph-input focus:outline-none"
                        placeholder="Your insurance provider"
                      />
                    </>
                  ) : (
                    <>
                      <div className="text-sm text-muted-foreground">
                        Insurance Provider
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                          <Shield className="text-blue-500" size={20} />
                        </div>
                        <span className="text-md font-medium">
                          {profile.medicalInformation?.insuranceProvider ||
                            "Not specified"}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Policy Number */}
                <div className="space-y-2">
                  {isEditing ? (
                    <>
                      <label className="block text-sm font-medium">
                        Policy Number
                      </label>
                      <input
                        type="text"
                        name="insurancePolicyNumber"
                        value={
                          formData.medicalInformation.insurancePolicyNumber
                        }
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-input bg-transparent neumorph-input focus:outline-none"
                        placeholder="Your policy number"
                      />
                    </>
                  ) : (
                    <>
                      <div className="text-sm text-muted-foreground">
                        Policy Number
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          <FileText className="text-purple-500" size={20} />
                        </div>
                        <span className="text-md font-medium">
                          {profile.medicalInformation?.insurancePolicyNumber ||
                            "Not specified"}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Primary Care Physician */}
                <div className="space-y-2">
                  {isEditing ? (
                    <>
                      <label className="block text-sm font-medium">
                        Primary Care Physician
                      </label>
                      <input
                        type="text"
                        name="primaryCarePhysician"
                        value={formData.medicalInformation.primaryCarePhysician}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-input bg-transparent neumorph-input focus:outline-none"
                        placeholder="Your doctor's name"
                      />
                    </>
                  ) : (
                    <>
                      <div className="text-sm text-muted-foreground">
                        Primary Care Physician
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                          <User className="text-green-500" size={20} />
                        </div>
                        <span className="text-md font-medium">
                          {profile.medicalInformation?.primaryCarePhysician ||
                            "Not specified"}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Allergies Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="rounded-2xl overflow-hidden"
        >
          <div className="neumorph-card hover:transform-none h-full">
            {/* Card Header */}
            <div className="flex items-center gap-2 p-6 border-b border-border">
              <AlertTriangle className="text-yellow-500" size={20} />
              <h2 className="text-lg font-semibold">Allergies</h2>
            </div>

            {/* Card Content */}
            <div className="p-6">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newAllergy}
                      onChange={(e) => setNewAllergy(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-input bg-transparent neumorph-input focus:outline-none"
                      placeholder="Add new allergy"
                    />
                    <button
                      onClick={() => addItem("allergies", newAllergy)}
                      className="px-3 py-2 rounded-lg bg-primary text-white flex items-center gap-1 hover:bg-primary/90 transition-colors"
                    >
                      <Plus size={16} />
                      <span>Add</span>
                    </button>
                  </div>

                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {formData.medicalInformation.allergies.length === 0 ? (
                      <p className="text-muted-foreground text-sm italic">
                        No allergies recorded
                      </p>
                    ) : (
                      formData.medicalInformation.allergies.map(
                        (allergy, index) => (
                          <motion.div
                            key={`allergy-${index}`}
                            variants={itemVariants}
                            className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50"
                          >
                            <span>{allergy}</span>
                            <button
                              onClick={() => removeItem("allergies", index)}
                              className="p-1 rounded-full hover:bg-red-500/10 text-red-500"
                            >
                              <Trash2 size={16} />
                            </button>
                          </motion.div>
                        )
                      )
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {!profile.medicalInformation?.allergies?.length ? (
                    <div className="py-8 flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center mb-3">
                        <AlertTriangle className="text-yellow-500" size={20} />
                      </div>
                      <p className="text-foreground font-medium">
                        No allergies recorded
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Any allergies you add will appear here
                      </p>
                    </div>
                  ) : (
                    profile.medicalInformation?.allergies?.map(
                      (allergy, index) => (
                        <motion.div
                          key={`allergy-${index}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center p-3 rounded-lg bg-yellow-500/10"
                        >
                          <AlertTriangle
                            className="text-yellow-500 mr-2"
                            size={16}
                          />
                          <span>{allergy}</span>
                        </motion.div>
                      )
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Medications Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="rounded-2xl overflow-hidden"
        >
          <div className="neumorph-card hover:transform-none h-full">
            {/* Card Header */}
            <div className="flex items-center gap-2 p-6 border-b border-border">
              <Pill className="text-blue-500" size={20} />
              <h2 className="text-lg font-semibold">Medications</h2>
            </div>

            {/* Card Content */}
            <div className="p-6">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMedication}
                      onChange={(e) => setNewMedication(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-input bg-transparent neumorph-input focus:outline-none"
                      placeholder="Add new medication"
                    />
                    <button
                      onClick={() => addItem("medications", newMedication)}
                      className="px-3 py-2 rounded-lg bg-primary text-white flex items-center gap-1 hover:bg-primary/90 transition-colors"
                    >
                      <Plus size={16} />
                      <span>Add</span>
                    </button>
                  </div>

                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {formData.medicalInformation.medications.length === 0 ? (
                      <p className="text-muted-foreground text-sm italic">
                        No medications recorded
                      </p>
                    ) : (
                      formData.medicalInformation.medications.map(
                        (medication, index) => (
                          <motion.div
                            key={`medication-${index}`}
                            variants={itemVariants}
                            className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50"
                          >
                            <span>{medication}</span>
                            <button
                              onClick={() => removeItem("medications", index)}
                              className="p-1 rounded-full hover:bg-red-500/10 text-red-500"
                            >
                              <Trash2 size={16} />
                            </button>
                          </motion.div>
                        )
                      )
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {!profile.medicalInformation?.medications?.length ? (
                    <div className="py-8 flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-3">
                        <Pill className="text-blue-500" size={20} />
                      </div>
                      <p className="text-foreground font-medium">
                        No medications recorded
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Your current medications will appear here
                      </p>
                    </div>
                  ) : (
                    profile.medicalInformation?.medications?.map(
                      (medication, index) => (
                        <motion.div
                          key={`medication-${index}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center p-3 rounded-lg bg-blue-500/10"
                        >
                          <Pill className="text-blue-500 mr-2" size={16} />
                          <span>{medication}</span>
                        </motion.div>
                      )
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Chronic Conditions Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="md:col-span-2 rounded-2xl overflow-hidden"
        >
          <div className="neumorph-card hover:transform-none">
            {/* Card Header */}
            <div className="flex items-center gap-2 p-6 border-b border-border">
              <Activity className="text-green-500" size={20} />
              <h2 className="text-lg font-semibold">Chronic Conditions</h2>
            </div>

            {/* Card Content */}
            <div className="p-6">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCondition}
                      onChange={(e) => setNewCondition(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-input bg-transparent neumorph-input focus:outline-none"
                      placeholder="Add new condition"
                    />
                    <button
                      onClick={() => addItem("chronicConditions", newCondition)}
                      className="px-3 py-2 rounded-lg bg-primary text-white flex items-center gap-1 hover:bg-primary/90 transition-colors"
                    >
                      <Plus size={16} />
                      <span>Add</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                    {formData.medicalInformation.chronicConditions.length ===
                    0 ? (
                      <p className="text-muted-foreground text-sm italic md:col-span-2 lg:col-span-3">
                        No chronic conditions recorded
                      </p>
                    ) : (
                      formData.medicalInformation.chronicConditions.map(
                        (condition, index) => (
                          <motion.div
                            key={`condition-${index}`}
                            variants={itemVariants}
                            className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50"
                          >
                            <span>{condition}</span>
                            <button
                              onClick={() =>
                                removeItem("chronicConditions", index)
                              }
                              className="p-1 rounded-full hover:bg-red-500/10 text-red-500"
                            >
                              <Trash2 size={16} />
                            </button>
                          </motion.div>
                        )
                      )
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  {!profile.medicalInformation?.chronicConditions?.length ? (
                    <div className="py-8 flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
                        <Activity className="text-green-500" size={20} />
                      </div>
                      <p className="text-foreground font-medium">
                        No chronic conditions recorded
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Any chronic conditions you add will appear here
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {profile.medicalInformation?.chronicConditions?.map(
                        (condition, index) => (
                          <motion.div
                            key={`condition-${index}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center p-3 rounded-lg bg-green-500/10"
                          >
                            <Activity
                              className="text-green-500 mr-2"
                              size={16}
                            />
                            <span>{condition}</span>
                          </motion.div>
                        )
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
