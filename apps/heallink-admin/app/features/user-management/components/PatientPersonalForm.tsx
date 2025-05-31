import React from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  IdCard,
  Upload,
  Camera,
} from "lucide-react";
import { Patient } from "../types/user.types";
import { PatientEditFormData } from "../containers/PatientEditContainer";
import { getPatientInitials } from "../utils/patient-utils";

interface PatientPersonalFormProps {
  patient?: Patient;
  formData: PatientEditFormData;
  formErrors: Record<string, string>;
  onFieldChange: (field: string, value: any) => void;
  onAvatarUpload: (file: File) => void;
  isDisabled?: boolean;
}

export default function PatientPersonalForm({
  patient,
  formData,
  formErrors,
  onFieldChange,
  onAvatarUpload,
  isDisabled = false,
}: PatientPersonalFormProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onAvatarUpload(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Picture Section */}
      <div className="card-admin">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[color:var(--primary)]/10 rounded-lg">
            <User className="w-5 h-5 text-[color:var(--primary)]" />
          </div>
          <h3 className="text-xl font-semibold text-[color:var(--foreground)]">Profile Picture</h3>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative">
            {patient?.avatarUrl ? (
              <img
                src={patient.avatarUrl}
                alt={patient.name}
                className="w-24 h-24 rounded-3xl object-cover border-4 border-white shadow-xl"
              />
            ) : (
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[color:var(--primary)]/20 to-[color:var(--primary)]/5 border-4 border-white shadow-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-[color:var(--primary)]">
                  {getPatientInitials(formData.name)}
                </span>
              </div>
            )}
            
            <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-[color:var(--primary)] text-white border-4 border-white rounded-full flex items-center justify-center cursor-pointer hover:bg-[color:var(--primary)]/90 transition-colors">
              <Camera className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isDisabled}
              />
            </label>
          </div>

          <div className="flex-1">
            <h4 className="font-semibold text-[color:var(--foreground)] mb-2">Update Profile Picture</h4>
            <p className="text-sm text-[color:var(--muted-foreground)] mb-4">
              Upload a new profile picture. Recommended size is 400x400px.
            </p>
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-[color:var(--muted)] hover:bg-[color:var(--accent)] rounded-lg transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              Choose File
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isDisabled}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="card-admin">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[color:var(--primary)]/10 rounded-lg">
            <IdCard className="w-5 h-5 text-[color:var(--primary)]" />
          </div>
          <h3 className="text-xl font-semibold text-[color:var(--foreground)]">Basic Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[color:var(--foreground)] mb-2">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[color:var(--muted-foreground)]" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => onFieldChange("name", e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-[color:var(--input)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/20 focus:border-[color:var(--primary)] transition-colors ${
                  formErrors.name ? "border-red-500" : "border-[color:var(--border)]"
                }`}
                placeholder="Enter full name"
                disabled={isDisabled}
              />
            </div>
            {formErrors.name && (
              <p className="mt-2 text-sm text-red-500">{formErrors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--foreground)] mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[color:var(--muted-foreground)]" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => onFieldChange("email", e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-[color:var(--input)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/20 focus:border-[color:var(--primary)] transition-colors ${
                  formErrors.email ? "border-red-500" : "border-[color:var(--border)]"
                }`}
                placeholder="Enter email address"
                disabled={isDisabled}
              />
            </div>
            {formErrors.email && (
              <p className="mt-2 text-sm text-red-500">{formErrors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--foreground)] mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[color:var(--muted-foreground)]" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => onFieldChange("phone", e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-[color:var(--input)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/20 focus:border-[color:var(--primary)] transition-colors ${
                  formErrors.phone ? "border-red-500" : "border-[color:var(--border)]"
                }`}
                placeholder="Enter phone number"
                disabled={isDisabled}
              />
            </div>
            {formErrors.phone && (
              <p className="mt-2 text-sm text-red-500">{formErrors.phone}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--foreground)] mb-2">
              Date of Birth
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[color:var(--muted-foreground)]" />
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => onFieldChange("dateOfBirth", e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-[color:var(--input)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/20 focus:border-[color:var(--primary)] transition-colors ${
                  formErrors.dateOfBirth ? "border-red-500" : "border-[color:var(--border)]"
                }`}
                disabled={isDisabled}
              />
            </div>
            {formErrors.dateOfBirth && (
              <p className="mt-2 text-sm text-red-500">{formErrors.dateOfBirth}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--foreground)] mb-2">
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={(e) => onFieldChange("gender", e.target.value)}
              className={`w-full px-4 py-3 bg-[color:var(--input)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/20 focus:border-[color:var(--primary)] transition-colors ${
                formErrors.gender ? "border-red-500" : "border-[color:var(--border)]"
              }`}
              disabled={isDisabled}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
            {formErrors.gender && (
              <p className="mt-2 text-sm text-red-500">{formErrors.gender}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}