import React, { useState } from "react";
import {
  Heart,
  Stethoscope,
  AlertTriangle,
  Plus,
  X,
  Pill,
  Activity,
} from "lucide-react";
import { PatientEditFormData } from "../containers/PatientEditContainer";

interface PatientMedicalFormProps {
  formData: PatientEditFormData;
  formErrors: Record<string, string>;
  onFieldChange: (field: string, value: any) => void;
  onArrayFieldChange: (field: string, values: string[]) => void;
  isDisabled?: boolean;
}

export default function PatientMedicalForm({
  formData,
  formErrors,
  onFieldChange,
  onArrayFieldChange,
  isDisabled = false,
}: PatientMedicalFormProps) {
  const [newAllergy, setNewAllergy] = useState("");
  const [newMedication, setNewMedication] = useState("");
  const [newCondition, setNewCondition] = useState("");

  const addAllergy = () => {
    if (newAllergy.trim()) {
      onArrayFieldChange("allergies", [...formData.medicalInformation.allergies, newAllergy.trim()]);
      setNewAllergy("");
    }
  };

  const removeAllergy = (index: number) => {
    const newAllergies = formData.medicalInformation.allergies.filter((_, i) => i !== index);
    onArrayFieldChange("allergies", newAllergies);
  };

  const addMedication = () => {
    if (newMedication.trim()) {
      onArrayFieldChange("medications", [...formData.medicalInformation.medications, newMedication.trim()]);
      setNewMedication("");
    }
  };

  const removeMedication = (index: number) => {
    const newMedications = formData.medicalInformation.medications.filter((_, i) => i !== index);
    onArrayFieldChange("medications", newMedications);
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      onArrayFieldChange("chronicConditions", [...formData.medicalInformation.chronicConditions, newCondition.trim()]);
      setNewCondition("");
    }
  };

  const removeCondition = (index: number) => {
    const newConditions = formData.medicalInformation.chronicConditions.filter((_, i) => i !== index);
    onArrayFieldChange("chronicConditions", newConditions);
  };

  return (
    <div className="space-y-6">
      {/* Basic Medical Information */}
      <div className="card-admin">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-100 dark:bg-red-950 rounded-lg">
            <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-[color:var(--foreground)]">Basic Medical Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Blood Type */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--foreground)] mb-2">
              Blood Type
            </label>
            <select
              value={formData.medicalInformation.bloodType}
              onChange={(e) => onFieldChange("medicalInformation.bloodType", e.target.value)}
              className={`w-full px-4 py-3 bg-[color:var(--input)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/20 focus:border-[color:var(--primary)] transition-colors ${
                formErrors["medicalInformation.bloodType"] ? "border-red-500" : "border-[color:var(--border)]"
              }`}
              disabled={isDisabled}
            >
              <option value="">Select blood type</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="unknown">Unknown</option>
            </select>
            {formErrors["medicalInformation.bloodType"] && (
              <p className="mt-2 text-sm text-red-500">{formErrors["medicalInformation.bloodType"]}</p>
            )}
          </div>

          {/* Primary Care Physician */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--foreground)] mb-2">
              Primary Care Physician
            </label>
            <div className="relative">
              <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[color:var(--muted-foreground)]" />
              <input
                type="text"
                value={formData.medicalInformation.primaryCarePhysician}
                onChange={(e) => onFieldChange("medicalInformation.primaryCarePhysician", e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-[color:var(--input)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/20 focus:border-[color:var(--primary)] transition-colors ${
                  formErrors["medicalInformation.primaryCarePhysician"] ? "border-red-500" : "border-[color:var(--border)]"
                }`}
                placeholder="Enter physician name"
                disabled={isDisabled}
              />
            </div>
            {formErrors["medicalInformation.primaryCarePhysician"] && (
              <p className="mt-2 text-sm text-red-500">{formErrors["medicalInformation.primaryCarePhysician"]}</p>
            )}
          </div>
        </div>
      </div>

      {/* Allergies */}
      <div className="card-admin">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-yellow-100 dark:bg-yellow-950 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h3 className="text-xl font-semibold text-[color:var(--foreground)]">Allergies</h3>
        </div>

        <div className="space-y-4">
          {/* Add new allergy */}
          <div className="flex gap-3">
            <input
              type="text"
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              className="flex-1 px-4 py-3 bg-[color:var(--input)] border border-[color:var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/20 focus:border-[color:var(--primary)] transition-colors"
              placeholder="Enter allergy (e.g., Penicillin, Peanuts)"
              disabled={isDisabled}
              onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
            />
            <button
              type="button"
              onClick={addAllergy}
              disabled={isDisabled || !newAllergy.trim()}
              className="px-4 py-3 bg-[color:var(--primary)] text-white rounded-lg hover:bg-[color:var(--primary)]/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          {/* Existing allergies */}
          {formData.medicalInformation.allergies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.medicalInformation.allergies.map((allergy, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 rounded-lg text-sm font-medium"
                >
                  {allergy}
                  {!isDisabled && (
                    <button
                      type="button"
                      onClick={() => removeAllergy(index)}
                      className="hover:bg-red-200 dark:hover:bg-red-900 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          )}

          {formData.medicalInformation.allergies.length === 0 && (
            <p className="text-sm text-[color:var(--muted-foreground)] italic">No allergies recorded</p>
          )}
        </div>
      </div>

      {/* Current Medications */}
      <div className="card-admin">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
            <Pill className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-[color:var(--foreground)]">Current Medications</h3>
        </div>

        <div className="space-y-4">
          {/* Add new medication */}
          <div className="flex gap-3">
            <input
              type="text"
              value={newMedication}
              onChange={(e) => setNewMedication(e.target.value)}
              className="flex-1 px-4 py-3 bg-[color:var(--input)] border border-[color:var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/20 focus:border-[color:var(--primary)] transition-colors"
              placeholder="Enter medication (e.g., Lisinopril 10mg daily)"
              disabled={isDisabled}
              onKeyPress={(e) => e.key === 'Enter' && addMedication()}
            />
            <button
              type="button"
              onClick={addMedication}
              disabled={isDisabled || !newMedication.trim()}
              className="px-4 py-3 bg-[color:var(--primary)] text-white rounded-lg hover:bg-[color:var(--primary)]/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          {/* Existing medications */}
          {formData.medicalInformation.medications.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.medicalInformation.medications.map((medication, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 rounded-lg text-sm font-medium"
                >
                  {medication}
                  {!isDisabled && (
                    <button
                      type="button"
                      onClick={() => removeMedication(index)}
                      className="hover:bg-blue-200 dark:hover:bg-blue-900 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          )}

          {formData.medicalInformation.medications.length === 0 && (
            <p className="text-sm text-[color:var(--muted-foreground)] italic">No medications recorded</p>
          )}
        </div>
      </div>

      {/* Chronic Conditions */}
      <div className="card-admin">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 dark:bg-purple-950 rounded-lg">
            <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-[color:var(--foreground)]">Chronic Conditions</h3>
        </div>

        <div className="space-y-4">
          {/* Add new condition */}
          <div className="flex gap-3">
            <input
              type="text"
              value={newCondition}
              onChange={(e) => setNewCondition(e.target.value)}
              className="flex-1 px-4 py-3 bg-[color:var(--input)] border border-[color:var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/20 focus:border-[color:var(--primary)] transition-colors"
              placeholder="Enter chronic condition (e.g., Diabetes Type 2, Hypertension)"
              disabled={isDisabled}
              onKeyPress={(e) => e.key === 'Enter' && addCondition()}
            />
            <button
              type="button"
              onClick={addCondition}
              disabled={isDisabled || !newCondition.trim()}
              className="px-4 py-3 bg-[color:var(--primary)] text-white rounded-lg hover:bg-[color:var(--primary)]/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          {/* Existing conditions */}
          {formData.medicalInformation.chronicConditions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.medicalInformation.chronicConditions.map((condition, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400 rounded-lg text-sm font-medium"
                >
                  {condition}
                  {!isDisabled && (
                    <button
                      type="button"
                      onClick={() => removeCondition(index)}
                      className="hover:bg-orange-200 dark:hover:bg-orange-900 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          )}

          {formData.medicalInformation.chronicConditions.length === 0 && (
            <p className="text-sm text-[color:var(--muted-foreground)] italic">No chronic conditions recorded</p>
          )}
        </div>
      </div>
    </div>
  );
}