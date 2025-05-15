"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { UserProfileData, UserProfileFormData } from "../types";
import { FormItem } from "./FormItem";

interface MedicalProfileViewProps {
  profile: UserProfileData | null;
  isUpdating: boolean;
  onUpdate: (data: UserProfileFormData) => Promise<boolean | undefined>;
}

export function MedicalProfileView({
  profile,
  isUpdating,
  onUpdate,
}: MedicalProfileViewProps) {
  const [formData, setFormData] = useState<UserProfileFormData>({
    name: "",
    medicalInformation: {
      bloodType: "unknown",
      allergies: [],
      medications: [],
      chronicConditions: [],
    },
    insurance: {
      provider: "",
      policyNumber: "",
      groupNumber: "",
      primaryInsured: "",
      relationship: "",
    },
  });

  // New form fields for managing array data
  const [newAllergy, setNewAllergy] = useState("");
  const [newMedication, setNewMedication] = useState("");
  const [newCondition, setNewCondition] = useState("");

  // Initialize form with profile data when available
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        medicalInformation: profile.medicalInformation || {
          bloodType: "unknown",
          allergies: [],
          medications: [],
          chronicConditions: [],
        },
        insurance: profile.insurance || {
          provider: "",
          policyNumber: "",
          groupNumber: "",
          primaryInsured: "",
          relationship: "",
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
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handlers for array fields
  const addAllergy = () => {
    if (!newAllergy.trim()) return;

    setFormData((prev) => {
      // Get current allergies array or empty array if undefined
      const currentAllergies = prev.medicalInformation?.allergies || [];

      return {
        ...prev,
        medicalInformation: {
          ...prev.medicalInformation,
          allergies: [...currentAllergies, newAllergy.trim()],
        },
      };
    });
    setNewAllergy("");
  };

  const removeAllergy = (index: number) => {
    setFormData((prev) => {
      const currentAllergies = prev.medicalInformation?.allergies || [];

      return {
        ...prev,
        medicalInformation: {
          ...prev.medicalInformation,
          allergies: currentAllergies.filter((_, i) => i !== index),
        },
      };
    });
  };

  const addMedication = () => {
    if (!newMedication.trim()) return;

    setFormData((prev) => {
      const currentMedications = prev.medicalInformation?.medications || [];

      return {
        ...prev,
        medicalInformation: {
          ...prev.medicalInformation,
          medications: [...currentMedications, newMedication.trim()],
        },
      };
    });
    setNewMedication("");
  };

  const removeMedication = (index: number) => {
    setFormData((prev) => {
      const currentMedications = prev.medicalInformation?.medications || [];

      return {
        ...prev,
        medicalInformation: {
          ...prev.medicalInformation,
          medications: currentMedications.filter((_, i) => i !== index),
        },
      };
    });
  };

  const addCondition = () => {
    if (!newCondition.trim()) return;

    setFormData((prev) => {
      const currentConditions =
        prev.medicalInformation?.chronicConditions || [];

      return {
        ...prev,
        medicalInformation: {
          ...prev.medicalInformation,
          chronicConditions: [...currentConditions, newCondition.trim()],
        },
      };
    });
    setNewCondition("");
  };

  const removeCondition = (index: number) => {
    setFormData((prev) => {
      const currentConditions =
        prev.medicalInformation?.chronicConditions || [];

      return {
        ...prev,
        medicalInformation: {
          ...prev.medicalInformation,
          chronicConditions: currentConditions.filter((_, i) => i !== index),
        },
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onUpdate(formData);

    if (success) {
      toast.success("Medical information updated successfully");
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

  const bloodTypeOptions = [
    { value: "unknown", label: "Unknown" },
    { value: "A+", label: "A+" },
    { value: "A-", label: "A-" },
    { value: "B+", label: "B+" },
    { value: "B-", label: "B-" },
    { value: "AB+", label: "AB+" },
    { value: "AB-", label: "AB-" },
    { value: "O+", label: "O+" },
    { value: "O-", label: "O-" },
  ];

  const relationshipOptions = [
    { value: "", label: "Select relationship" },
    { value: "self", label: "Self" },
    { value: "spouse", label: "Spouse" },
    { value: "dependent", label: "Dependent" },
    { value: "other", label: "Other" },
  ];

  // Chip component for array items
  const Chip = ({
    label,
    onRemove,
  }: {
    label: string;
    onRemove: () => void;
  }) => (
    <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
      <span>{label}</span>
      <button
        type="button"
        onClick={onRemove}
        className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/20 text-primary hover:bg-primary/30"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </div>
  );

  return (
    <motion.form
      onSubmit={handleSubmit}
      variants={containerAnimation}
      initial="hidden"
      animate="visible"
      className="grid gap-8"
    >
      {/* Medical Information Section */}
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
            <path d="M19 9h-5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2Z" />
            <path d="M12 16H9a2 2 0 0 1-2-2V9" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v3" />
          </svg>
          <h2 className="text-xl font-semibold">Medical Information</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-1">
          <FormItem label="Blood Type" htmlFor="medicalInformation.bloodType">
            <select
              id="medicalInformation.bloodType"
              name="medicalInformation.bloodType"
              value={formData.medicalInformation?.bloodType || "unknown"}
              onChange={handleInputChange}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {bloodTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormItem>
        </div>

        {/* Allergies */}
        <div className="space-y-3">
          <FormItem label="Allergies" htmlFor="newAllergy">
            <div className="flex gap-2">
              <input
                id="newAllergy"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                placeholder="Add allergy"
                className="flex-1 rounded-md border border-input bg-transparent px-3 py-2 text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                type="button"
                onClick={addAllergy}
                className="rounded-md bg-primary px-3 py-2 text-primary-foreground hover:bg-primary/90"
              >
                Add
              </button>
            </div>
          </FormItem>

          {/* Display allergies */}
          <div className="flex flex-wrap gap-2">
            {formData.medicalInformation?.allergies?.map((allergy, index) => (
              <Chip
                key={`allergy-${index}`}
                label={allergy}
                onRemove={() => removeAllergy(index)}
              />
            ))}
            {(formData.medicalInformation?.allergies?.length || 0) === 0 && (
              <p className="text-sm text-muted-foreground">
                No allergies listed
              </p>
            )}
          </div>
        </div>

        {/* Medications */}
        <div className="space-y-3">
          <FormItem label="Medications" htmlFor="newMedication">
            <div className="flex gap-2">
              <input
                id="newMedication"
                value={newMedication}
                onChange={(e) => setNewMedication(e.target.value)}
                placeholder="Add medication"
                className="flex-1 rounded-md border border-input bg-transparent px-3 py-2 text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                type="button"
                onClick={addMedication}
                className="rounded-md bg-primary px-3 py-2 text-primary-foreground hover:bg-primary/90"
              >
                Add
              </button>
            </div>
          </FormItem>

          {/* Display medications */}
          <div className="flex flex-wrap gap-2">
            {formData.medicalInformation?.medications?.map(
              (medication, index) => (
                <Chip
                  key={`medication-${index}`}
                  label={medication}
                  onRemove={() => removeMedication(index)}
                />
              )
            )}
            {(formData.medicalInformation?.medications?.length || 0) === 0 && (
              <p className="text-sm text-muted-foreground">
                No medications listed
              </p>
            )}
          </div>
        </div>

        {/* Chronic Conditions */}
        <div className="space-y-3">
          <FormItem label="Chronic Conditions" htmlFor="newCondition">
            <div className="flex gap-2">
              <input
                id="newCondition"
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                placeholder="Add chronic condition"
                className="flex-1 rounded-md border border-input bg-transparent px-3 py-2 text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                type="button"
                onClick={addCondition}
                className="rounded-md bg-primary px-3 py-2 text-primary-foreground hover:bg-primary/90"
              >
                Add
              </button>
            </div>
          </FormItem>

          {/* Display chronic conditions */}
          <div className="flex flex-wrap gap-2">
            {formData.medicalInformation?.chronicConditions?.map(
              (condition, index) => (
                <Chip
                  key={`condition-${index}`}
                  label={condition}
                  onRemove={() => removeCondition(index)}
                />
              )
            )}
            {(formData.medicalInformation?.chronicConditions?.length || 0) ===
              0 && (
              <p className="text-sm text-muted-foreground">
                No chronic conditions listed
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Insurance Information Section */}
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
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
          </svg>
          <h2 className="text-xl font-semibold">Insurance Information</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormItem label="Insurance Provider" htmlFor="insurance.provider">
            <input
              id="insurance.provider"
              name="insurance.provider"
              type="text"
              value={formData.insurance?.provider || ""}
              onChange={handleInputChange}
              placeholder="Enter insurance provider"
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </FormItem>

          <FormItem label="Policy Number" htmlFor="insurance.policyNumber">
            <input
              id="insurance.policyNumber"
              name="insurance.policyNumber"
              type="text"
              value={formData.insurance?.policyNumber || ""}
              onChange={handleInputChange}
              placeholder="Enter policy number"
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </FormItem>

          <FormItem label="Group Number" htmlFor="insurance.groupNumber">
            <input
              id="insurance.groupNumber"
              name="insurance.groupNumber"
              type="text"
              value={formData.insurance?.groupNumber || ""}
              onChange={handleInputChange}
              placeholder="Enter group number"
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </FormItem>

          <FormItem label="Primary Insured" htmlFor="insurance.primaryInsured">
            <input
              id="insurance.primaryInsured"
              name="insurance.primaryInsured"
              type="text"
              value={formData.insurance?.primaryInsured || ""}
              onChange={handleInputChange}
              placeholder="Name of primary insured"
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </FormItem>

          <FormItem
            label="Relationship to Insured"
            htmlFor="insurance.relationship"
          >
            <select
              id="insurance.relationship"
              name="insurance.relationship"
              value={formData.insurance?.relationship || ""}
              onChange={handleInputChange}
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {relationshipOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormItem>
        </div>
      </motion.div>

      {/* Submit Button */}
      <motion.div variants={sectionAnimation} className="flex justify-end pt-6">
        <button
          type="submit"
          disabled={isUpdating}
          className="rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-70"
        >
          {isUpdating ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
              <span>Updating...</span>
            </div>
          ) : (
            "Save Medical Information"
          )}
        </button>
      </motion.div>
    </motion.form>
  );
}
