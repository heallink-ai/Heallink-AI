import React from "react";
import {
  Shield,
  Key,
  UserX,
  UserCheck,
  Crown,
  CreditCard,
  Settings,
  AlertTriangle,
} from "lucide-react";
import { PatientEditFormData } from "../containers/PatientEditContainer";
import { getStatusColor, getStatusLabel } from "../utils/patient-utils";

interface PatientSecurityFormProps {
  formData: PatientEditFormData;
  formErrors: Record<string, string>;
  onFieldChange: (field: string, value: any) => void;
  onStatusChange: (newStatus: string, reason?: string) => void;
  onPasswordReset: () => void;
  isDisabled?: boolean;
}

export default function PatientSecurityForm({
  formData,
  formErrors,
  onFieldChange,
  onStatusChange,
  onPasswordReset,
  isDisabled = false,
}: PatientSecurityFormProps) {
  const handleStatusChange = (newStatus: string) => {
    if (newStatus === "suspended" || newStatus === "deactivated") {
      const reason = prompt(`Please provide a reason for ${newStatus === "suspended" ? "suspending" : "deactivating"} this account:`);
      if (reason) {
        onStatusChange(newStatus, reason);
      }
    } else {
      onStatusChange(newStatus);
    }
  };

  return (
    <div className="space-y-6">
      {/* Account Status */}
      <div className="card-admin">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[color:var(--primary)]/10 rounded-lg">
            <Settings className="w-5 h-5 text-[color:var(--primary)]" />
          </div>
          <h3 className="text-xl font-semibold text-[color:var(--foreground)]">Account Settings</h3>
        </div>

        <div className="space-y-6">
          {/* Current Status */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--foreground)] mb-2">
              Account Status
            </label>
            <div className="flex items-center gap-4 mb-4">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(formData.accountStatus)}`}>
                <div className={`w-2 h-2 rounded-full ${
                  formData.accountStatus === 'active' ? 'bg-emerald-500' : 
                  formData.accountStatus === 'pending_verification' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`} />
                {getStatusLabel(formData.accountStatus)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleStatusChange("active")}
                disabled={isDisabled || formData.accountStatus === "active"}
                className="flex items-center gap-3 p-4 text-left border border-[color:var(--border)] rounded-lg hover:bg-[color:var(--accent)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UserCheck className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium text-[color:var(--foreground)]">Activate Account</p>
                  <p className="text-sm text-[color:var(--muted-foreground)]">Enable full account access</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange("suspended")}
                disabled={isDisabled || formData.accountStatus === "suspended"}
                className="flex items-center gap-3 p-4 text-left border border-[color:var(--border)] rounded-lg hover:bg-[color:var(--accent)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UserX className="w-5 h-5 text-red-500" />
                <div>
                  <p className="font-medium text-[color:var(--foreground)]">Suspend Account</p>
                  <p className="text-sm text-[color:var(--muted-foreground)]">Temporarily disable access</p>
                </div>
              </button>
            </div>
          </div>

          {/* Subscription Plan */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--foreground)] mb-2">
              Subscription Plan
            </label>
            <select
              value={formData.subscriptionPlan}
              onChange={(e) => onFieldChange("subscriptionPlan", e.target.value)}
              className={`w-full px-4 py-3 bg-[color:var(--input)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/20 focus:border-[color:var(--primary)] transition-colors ${
                formErrors.subscriptionPlan ? "border-red-500" : "border-[color:var(--border)]"
              }`}
              disabled={isDisabled}
            >
              <option value="free">Free Plan</option>
              <option value="basic">Basic Plan</option>
              <option value="premium">Premium Plan</option>
              <option value="family">Family Plan</option>
            </select>
            {formErrors.subscriptionPlan && (
              <p className="mt-2 text-sm text-red-500">{formErrors.subscriptionPlan}</p>
            )}
          </div>
        </div>
      </div>

      {/* Security Actions */}
      <div className="card-admin">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-100 dark:bg-red-950 rounded-lg">
            <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-[color:var(--foreground)]">Security Actions</h3>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={onPasswordReset}
            disabled={isDisabled}
            className="w-full flex items-center gap-3 p-4 text-left border border-[color:var(--border)] rounded-lg hover:bg-[color:var(--accent)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
              <Key className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-medium text-[color:var(--foreground)]">Reset Password</p>
              <p className="text-sm text-[color:var(--muted-foreground)]">Send password reset email to patient</p>
            </div>
          </button>

          <div className="w-full flex items-center gap-3 p-4 text-left border border-[color:var(--border)] rounded-lg bg-[color:var(--muted)]/10">
            <div className="p-2 bg-green-100 dark:bg-green-950 rounded-lg">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-medium text-[color:var(--foreground)]">Two-Factor Authentication</p>
              <p className="text-sm text-[color:var(--muted-foreground)]">Patient must manage 2FA from their account</p>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card-admin border-red-200 dark:border-red-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-100 dark:bg-red-950 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-red-600 dark:text-red-400">Danger Zone</h3>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
            <h4 className="font-medium text-red-800 dark:text-red-400 mb-2">Deactivate Account</h4>
            <p className="text-sm text-red-700 dark:text-red-300 mb-4">
              This will permanently deactivate the patient's account. This action can be reversed by reactivating the account.
            </p>
            <button
              type="button"
              onClick={() => handleStatusChange("deactivated")}
              disabled={isDisabled || formData.accountStatus === "deactivated"}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Deactivate Account
            </button>
          </div>

          <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
            <h4 className="font-medium text-red-800 dark:text-red-400 mb-2">Delete Account</h4>
            <p className="text-sm text-red-700 dark:text-red-300 mb-4">
              <strong>Warning:</strong> This action cannot be undone. This will permanently delete the patient's account and all associated data.
            </p>
            <button
              type="button"
              disabled={true}
              className="px-4 py-2 bg-red-800 text-white rounded-lg opacity-50 cursor-not-allowed"
              title="Account deletion requires additional authorization"
            >
              Delete Account (Restricted)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}