import React from "react";
import {
  Home,
  MapPin,
  Globe,
  MessageCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { PatientEditFormData } from "../containers/PatientEditContainer";

interface PatientContactFormProps {
  formData: PatientEditFormData;
  formErrors: Record<string, string>;
  onFieldChange: (field: string, value: any) => void;
  isDisabled?: boolean;
}

export default function PatientContactForm({
  formData,
  formErrors,
  onFieldChange,
  isDisabled = false,
}: PatientContactFormProps) {
  return (
    <div className="space-y-6">
      {/* Address Information */}
      <div className="card-admin">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[color:var(--primary)]/10 rounded-lg">
            <Home className="w-5 h-5 text-[color:var(--primary)]" />
          </div>
          <h3 className="text-xl font-semibold text-[color:var(--foreground)]">Address Information</h3>
        </div>

        <div className="space-y-4">
          {/* Street Address */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--foreground)] mb-2">
              Street Address
            </label>
            <div className="relative">
              <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[color:var(--muted-foreground)]" />
              <input
                type="text"
                value={formData.address.streetAddress}
                onChange={(e) => onFieldChange("address.streetAddress", e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-[color:var(--input)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/20 focus:border-[color:var(--primary)] transition-colors ${
                  formErrors["address.streetAddress"] ? "border-red-500" : "border-[color:var(--border)]"
                }`}
                placeholder="Enter street address"
                disabled={isDisabled}
              />
            </div>
            {formErrors["address.streetAddress"] && (
              <p className="mt-2 text-sm text-red-500">{formErrors["address.streetAddress"]}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* City */}
            <div>
              <label className="block text-sm font-medium text-[color:var(--foreground)] mb-2">
                City
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[color:var(--muted-foreground)]" />
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) => onFieldChange("address.city", e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-[color:var(--input)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/20 focus:border-[color:var(--primary)] transition-colors ${
                    formErrors["address.city"] ? "border-red-500" : "border-[color:var(--border)]"
                  }`}
                  placeholder="Enter city"
                  disabled={isDisabled}
                />
              </div>
              {formErrors["address.city"] && (
                <p className="mt-2 text-sm text-red-500">{formErrors["address.city"]}</p>
              )}
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-[color:var(--foreground)] mb-2">
                State/Province
              </label>
              <input
                type="text"
                value={formData.address.state}
                onChange={(e) => onFieldChange("address.state", e.target.value)}
                className={`w-full px-4 py-3 bg-[color:var(--input)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/20 focus:border-[color:var(--primary)] transition-colors ${
                  formErrors["address.state"] ? "border-red-500" : "border-[color:var(--border)]"
                }`}
                placeholder="Enter state or province"
                disabled={isDisabled}
              />
              {formErrors["address.state"] && (
                <p className="mt-2 text-sm text-red-500">{formErrors["address.state"]}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ZIP Code */}
            <div>
              <label className="block text-sm font-medium text-[color:var(--foreground)] mb-2">
                ZIP/Postal Code
              </label>
              <input
                type="text"
                value={formData.address.zipCode}
                onChange={(e) => onFieldChange("address.zipCode", e.target.value)}
                className={`w-full px-4 py-3 bg-[color:var(--input)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/20 focus:border-[color:var(--primary)] transition-colors ${
                  formErrors["address.zipCode"] ? "border-red-500" : "border-[color:var(--border)]"
                }`}
                placeholder="Enter ZIP or postal code"
                disabled={isDisabled}
              />
              {formErrors["address.zipCode"] && (
                <p className="mt-2 text-sm text-red-500">{formErrors["address.zipCode"]}</p>
              )}
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-[color:var(--foreground)] mb-2">
                Country
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[color:var(--muted-foreground)]" />
                <select
                  value={formData.address.country}
                  onChange={(e) => onFieldChange("address.country", e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-[color:var(--input)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/20 focus:border-[color:var(--primary)] transition-colors ${
                    formErrors["address.country"] ? "border-red-500" : "border-[color:var(--border)]"
                  }`}
                  disabled={isDisabled}
                >
                  <option value="">Select country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="JP">Japan</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {formErrors["address.country"] && (
                <p className="mt-2 text-sm text-red-500">{formErrors["address.country"]}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Communication Preferences */}
      <div className="card-admin">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[color:var(--primary)]/10 rounded-lg">
            <MessageCircle className="w-5 h-5 text-[color:var(--primary)]" />
          </div>
          <h3 className="text-xl font-semibold text-[color:var(--foreground)]">Communication Preferences</h3>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-[color:var(--muted-foreground)] mb-4">
            Choose how you'd like to receive notifications and updates from our platform.
          </p>

          {/* Email Notifications */}
          <div className="flex items-center justify-between p-4 bg-[color:var(--muted)]/20 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
                <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-[color:var(--foreground)]">Email Notifications</h4>
                <p className="text-sm text-[color:var(--muted-foreground)]">Receive updates and notifications via email</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onFieldChange("communicationPreferences.email", !formData.communicationPreferences.email)}
              disabled={isDisabled}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)] focus:ring-offset-2 ${
                formData.communicationPreferences.email ? "bg-[color:var(--primary)]" : "bg-gray-200 dark:bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.communicationPreferences.email ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* SMS Notifications */}
          <div className="flex items-center justify-between p-4 bg-[color:var(--muted)]/20 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-950 rounded-lg">
                <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-medium text-[color:var(--foreground)]">SMS Notifications</h4>
                <p className="text-sm text-[color:var(--muted-foreground)]">Receive important alerts via text message</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onFieldChange("communicationPreferences.sms", !formData.communicationPreferences.sms)}
              disabled={isDisabled}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)] focus:ring-offset-2 ${
                formData.communicationPreferences.sms ? "bg-[color:var(--primary)]" : "bg-gray-200 dark:bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.communicationPreferences.sms ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Push Notifications */}
          <div className="flex items-center justify-between p-4 bg-[color:var(--muted)]/20 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-950 rounded-lg">
                <MessageCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="font-medium text-[color:var(--foreground)]">Push Notifications</h4>
                <p className="text-sm text-[color:var(--muted-foreground)]">Receive real-time notifications in your browser</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onFieldChange("communicationPreferences.push", !formData.communicationPreferences.push)}
              disabled={isDisabled}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)] focus:ring-offset-2 ${
                formData.communicationPreferences.push ? "bg-[color:var(--primary)]" : "bg-gray-200 dark:bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.communicationPreferences.push ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}