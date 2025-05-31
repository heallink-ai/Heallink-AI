import React from "react";
import {
  ArrowLeft,
  Save,
  User,
  Check,
  X,
  Loader2,
  AlertTriangle,
  Home,
  Heart,
  Phone,
  Shield,
} from "lucide-react";
import { Patient } from "../types/user.types";
import { PatientEditFormData, PatientEditTab } from "../containers/PatientEditContainer";
import PatientPersonalForm from "./PatientPersonalForm";
import PatientContactForm from "./PatientContactForm";
import PatientMedicalForm from "./PatientMedicalForm";
import PatientEmergencyForm from "./PatientEmergencyForm";
import PatientSecurityForm from "./PatientSecurityForm";
import { getStatusColor, getStatusLabel } from "../utils/patient-utils";

interface PatientEditPresentationProps {
  patient?: Patient;
  formData: PatientEditFormData;
  activeTab: PatientEditTab;
  isLoading: boolean;
  isError: boolean;
  error?: any;
  isSaving: boolean;
  formErrors: Record<string, string>;
  successMessage: string;
  onTabChange: (tab: PatientEditTab) => void;
  onBackToDetail: () => void;
  onBackToList: () => void;
  onFieldChange: (field: string, value: any) => void;
  onArrayFieldChange: (field: string, values: string[]) => void;
  onSave: () => void;
  onStatusChange: (newStatus: string, reason?: string) => void;
  onPasswordReset: () => void;
  onAvatarUpload: (file: File) => void;
}

const tabs: { id: PatientEditTab; label: string; icon: any }[] = [
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'contact', label: 'Contact', icon: Home },
  { id: 'medical', label: 'Medical', icon: Heart },
  { id: 'emergency', label: 'Emergency', icon: Phone },
  { id: 'security', label: 'Security', icon: Shield },
];

export default function PatientEditPresentation({
  patient,
  formData,
  activeTab,
  isLoading,
  isError,
  error,
  isSaving,
  formErrors,
  successMessage,
  onTabChange,
  onBackToDetail,
  onBackToList,
  onFieldChange,
  onArrayFieldChange,
  onSave,
  onStatusChange,
  onPasswordReset,
  onAvatarUpload,
}: PatientEditPresentationProps) {
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[color:var(--background)] p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3 text-[color:var(--muted-foreground)]">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading patient information...</span>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[color:var(--background)] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="card-admin">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Error Loading Patient</h2>
            </div>
            <p className="text-[color:var(--muted-foreground)] mt-4">
              {error?.message || "Failed to load patient information. Please try again."}
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={onBackToList}
                className="px-4 py-2 bg-[color:var(--muted)] hover:bg-[color:var(--accent)] rounded-lg transition-colors"
              >
                Back to Users
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--background)]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[color:var(--background)] border-b border-[color:var(--border)] px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBackToDetail}
                className="p-2 hover:bg-[color:var(--accent)] rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div>
                <h1 className="text-2xl font-bold text-[color:var(--foreground)]">
                  Edit Patient
                </h1>
                {patient && (
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-[color:var(--muted-foreground)]">
                      {patient.name}
                    </p>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.accountStatus)}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        patient.accountStatus === 'active' ? 'bg-emerald-500' : 
                        patient.accountStatus === 'pending_verification' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`} />
                      {getStatusLabel(patient.accountStatus)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-[color:var(--primary)] text-white rounded-lg hover:bg-[color:var(--primary)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-2 text-green-800 dark:text-green-400">
                <Check className="w-5 h-5" />
                <span className="font-medium">{successMessage}</span>
              </div>
            </div>
          )}

          {formErrors.submit && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-2 text-red-800 dark:text-red-400">
                <X className="w-5 h-5" />
                <span className="font-medium">{formErrors.submit}</span>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="mt-6">
            <nav className="flex space-x-1">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-[color:var(--primary)] text-white"
                        : "text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] hover:bg-[color:var(--accent)]"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="max-w-4xl">
          {activeTab === 'personal' && (
            <PatientPersonalForm
              patient={patient}
              formData={formData}
              formErrors={formErrors}
              onFieldChange={onFieldChange}
              onAvatarUpload={onAvatarUpload}
              isDisabled={isSaving}
            />
          )}

          {activeTab === 'contact' && (
            <PatientContactForm
              formData={formData}
              formErrors={formErrors}
              onFieldChange={onFieldChange}
              isDisabled={isSaving}
            />
          )}

          {activeTab === 'medical' && (
            <PatientMedicalForm
              formData={formData}
              formErrors={formErrors}
              onFieldChange={onFieldChange}
              onArrayFieldChange={onArrayFieldChange}
              isDisabled={isSaving}
            />
          )}

          {activeTab === 'emergency' && (
            <PatientEmergencyForm
              formData={formData}
              formErrors={formErrors}
              onFieldChange={onFieldChange}
              isDisabled={isSaving}
            />
          )}

          {activeTab === 'security' && (
            <PatientSecurityForm
              formData={formData}
              formErrors={formErrors}
              onFieldChange={onFieldChange}
              onStatusChange={onStatusChange}
              onPasswordReset={onPasswordReset}
              isDisabled={isSaving}
            />
          )}
        </div>
      </div>

      {/* Floating Save Button */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-[color:var(--primary)] text-white rounded-full shadow-lg hover:bg-[color:var(--primary)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}