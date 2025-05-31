import React from "react";
import {
  Phone,
  User,
  Mail,
  Users,
  AlertCircle,
} from "lucide-react";
import { PatientEditFormData } from "../containers/PatientEditContainer";

interface PatientEmergencyFormProps {
  formData: PatientEditFormData;
  formErrors: Record<string, string>;
  onFieldChange: (field: string, value: any) => void;
  isDisabled?: boolean;
}

export default function PatientEmergencyForm({
  formData,
  formErrors,
  onFieldChange,
  isDisabled = false,
}: PatientEmergencyFormProps) {
  return (
    <div className="space-y-6">
      {/* Emergency Contact Information */}
      <div className="card-admin">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-100 dark:bg-red-950 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-[color:var(--foreground)]">Emergency Contact</h3>
        </div>

        <div className="space-y-6">
          <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-red-800 dark:text-red-400 mb-1">
                  Important Information
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300">
                  This contact will be notified in case of medical emergencies. Please ensure all information is accurate and up-to-date.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Emergency Contact Name */}
            <div>
              <label className="block text-sm font-medium text-[color:var(--foreground)] mb-2">
                Contact Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[color:var(--muted-foreground)]" />
                <input
                  type="text"
                  value={formData.emergencyContact.name}
                  onChange={(e) => onFieldChange("emergencyContact.name", e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-[color:var(--input)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/20 focus:border-[color:var(--primary)] transition-colors ${
                    formErrors["emergencyContact.name"] ? "border-red-500" : "border-[color:var(--border)]"
                  }`}
                  placeholder="Enter contact name"
                  disabled={isDisabled}
                />
              </div>
              {formErrors["emergencyContact.name"] && (
                <p className="mt-2 text-sm text-red-500">{formErrors["emergencyContact.name"]}</p>
              )}
            </div>

            {/* Relationship */}
            <div>
              <label className="block text-sm font-medium text-[color:var(--foreground)] mb-2">
                Relationship
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[color:var(--muted-foreground)]" />
                <select
                  value={formData.emergencyContact.relationship}
                  onChange={(e) => onFieldChange("emergencyContact.relationship", e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-[color:var(--input)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/20 focus:border-[color:var(--primary)] transition-colors ${
                    formErrors["emergencyContact.relationship"] ? "border-red-500" : "border-[color:var(--border)]"
                  }`}
                  disabled={isDisabled}
                >
                  <option value="">Select relationship</option>
                  <option value="spouse">Spouse</option>
                  <option value="parent">Parent</option>
                  <option value="child">Child</option>
                  <option value="sibling">Sibling</option>
                  <option value="guardian">Guardian</option>
                  <option value="friend">Friend</option>
                  <option value="caregiver">Caregiver</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {formErrors["emergencyContact.relationship"] && (
                <p className="mt-2 text-sm text-red-500">{formErrors["emergencyContact.relationship"]}</p>
              )}
            </div>

            {/* Emergency Contact Phone */}
            <div>
              <label className="block text-sm font-medium text-[color:var(--foreground)] mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[color:var(--muted-foreground)]" />
                <input
                  type="tel"
                  value={formData.emergencyContact.phone}
                  onChange={(e) => onFieldChange("emergencyContact.phone", e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-[color:var(--input)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/20 focus:border-[color:var(--primary)] transition-colors ${
                    formErrors["emergencyContact.phone"] ? "border-red-500" : "border-[color:var(--border)]"
                  }`}
                  placeholder="Enter phone number"
                  disabled={isDisabled}
                />
              </div>
              {formErrors["emergencyContact.phone"] && (
                <p className="mt-2 text-sm text-red-500">{formErrors["emergencyContact.phone"]}</p>
              )}
            </div>

            {/* Emergency Contact Email */}
            <div>
              <label className="block text-sm font-medium text-[color:var(--foreground)] mb-2">
                Email Address <span className="text-[color:var(--muted-foreground)]">(Optional)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[color:var(--muted-foreground)]" />
                <input
                  type="email"
                  value={formData.emergencyContact.email}
                  onChange={(e) => onFieldChange("emergencyContact.email", e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-[color:var(--input)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/20 focus:border-[color:var(--primary)] transition-colors ${
                    formErrors["emergencyContact.email"] ? "border-red-500" : "border-[color:var(--border)]"
                  }`}
                  placeholder="Enter email address"
                  disabled={isDisabled}
                />
              </div>
              {formErrors["emergencyContact.email"] && (
                <p className="mt-2 text-sm text-red-500">{formErrors["emergencyContact.email"]}</p>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-[color:var(--muted)]/20 rounded-lg p-4">
            <h4 className="font-medium text-[color:var(--foreground)] mb-2">Guidelines</h4>
            <ul className="text-sm text-[color:var(--muted-foreground)] space-y-1">
              <li>• Choose someone who is easily reachable and familiar with the patient's medical history</li>
              <li>• Ensure the contact person is aware of their designation as an emergency contact</li>
              <li>• Update this information whenever contact details change</li>
              <li>• Consider providing a backup contact if the primary contact is often unavailable</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}