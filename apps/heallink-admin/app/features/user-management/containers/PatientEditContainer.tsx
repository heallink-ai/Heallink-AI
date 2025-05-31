"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import PatientEditPresentation from "../components/PatientEditPresentation";
import { 
  useGetPatient, 
  useUpdatePatient,
  useChangePatientStatus,
  useResetPatientPassword,
  useUploadPatientAvatar
} from "../hooks/use-patient-queries";
import { Patient, UpdatePatientDto, PatientStatusChangeDto } from "../types/user.types";

export type PatientEditTab = 'personal' | 'contact' | 'medical' | 'security' | 'emergency';

export interface PatientEditFormData {
  // Personal Information
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  
  // Address Information
  address: {
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  
  // Medical Information
  medicalInformation: {
    bloodType: string;
    allergies: string[];
    medications: string[];
    chronicConditions: string[];
    primaryCarePhysician: string;
  };
  
  // Emergency Contact
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
  };
  
  // Communication Preferences
  communicationPreferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  
  // Account Settings
  accountStatus: string;
  subscriptionPlan: string;
}

export interface PatientEditContainerProps {
  patientId?: string;
  defaultTab?: PatientEditTab;
}

export default function PatientEditContainer({ 
  patientId: propPatientId, 
  defaultTab = 'personal' 
}: PatientEditContainerProps) {
  const params = useParams();
  const router = useRouter();
  
  // Get patient ID from props or URL params
  const patientId = propPatientId || (params.id as string);
  
  // State management
  const [activeTab, setActiveTab] = useState<PatientEditTab>(defaultTab);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  // Data fetching
  const { 
    data: patient, 
    isLoading: patientLoading, 
    isError: patientError, 
    error: patientErrorDetails 
  } = useGetPatient(patientId);

  // Mutations
  const updatePatientMutation = useUpdatePatient();
  const changeStatusMutation = useChangePatientStatus();
  const resetPasswordMutation = useResetPatientPassword();
  const uploadAvatarMutation = useUploadPatientAvatar();

  // Form data state
  const [formData, setFormData] = useState<PatientEditFormData>({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: {
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    medicalInformation: {
      bloodType: "",
      allergies: [],
      medications: [],
      chronicConditions: [],
      primaryCarePhysician: "",
    },
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
      email: "",
    },
    communicationPreferences: {
      email: true,
      sms: true,
      push: true,
    },
    accountStatus: "active",
    subscriptionPlan: "basic",
  });

  // Initialize form data when patient data loads
  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name || "",
        email: patient.email || "",
        phone: patient.phone || "",
        dateOfBirth: patient.dateOfBirth || "",
        gender: patient.gender || "",
        address: {
          streetAddress: patient.address?.streetAddress || "",
          city: patient.address?.city || "",
          state: patient.address?.state || "",
          zipCode: patient.address?.zipCode || "",
          country: patient.address?.country || "",
        },
        medicalInformation: {
          bloodType: (patient as any).medicalInformation?.bloodType || "",
          allergies: (patient as any).medicalInformation?.allergies || [],
          medications: (patient as any).medicalInformation?.medications || [],
          chronicConditions: (patient as any).medicalInformation?.chronicConditions || [],
          primaryCarePhysician: (patient as any).medicalInformation?.primaryCarePhysician || "",
        },
        emergencyContact: {
          name: patient.emergencyContact?.name || "",
          relationship: patient.emergencyContact?.relationship || "",
          phone: patient.emergencyContact?.phone || "",
          email: patient.emergencyContact?.email || "",
        },
        communicationPreferences: {
          email: (patient as any).communicationPreferences?.email !== false,
          sms: (patient as any).communicationPreferences?.sms !== false,
          push: (patient as any).communicationPreferences?.push !== false,
        },
        accountStatus: patient.accountStatus || "active",
        subscriptionPlan: patient.subscriptionPlan || "basic",
      });
    }
  }, [patient]);

  // Event handlers
  const handleTabChange = (tab: PatientEditTab) => {
    setActiveTab(tab);
  };

  const handleBackToDetail = () => {
    router.push(`/dashboard/users/${patientId}`);
  };

  const handleBackToList = () => {
    router.push('/dashboard/users');
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => {
      // Handle nested field updates
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          [parent]: {
            ...(prev as any)[parent],
            [child]: value,
          }
        };
      }
      
      return {
        ...prev,
        [field]: value,
      };
    });

    // Clear field error
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleArrayFieldChange = (field: string, values: string[]) => {
    setFormData(prev => ({
      ...prev,
      medicalInformation: {
        ...prev.medicalInformation,
        [field]: values,
      }
    }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Required fields validation
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }

    // Emergency contact validation (if provided)
    if (formData.emergencyContact.name && !formData.emergencyContact.phone) {
      errors["emergencyContact.phone"] = "Phone is required for emergency contact";
    }
    if (formData.emergencyContact.phone && !formData.emergencyContact.name) {
      errors["emergencyContact.name"] = "Name is required for emergency contact";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const updateData: UpdatePatientDto = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender as any,
        address: formData.address,
        medicalInformation: formData.medicalInformation,
        emergencyContact: formData.emergencyContact.name ? formData.emergencyContact : undefined,
        communicationPreferences: formData.communicationPreferences,
        subscriptionPlan: formData.subscriptionPlan as any,
      };

      await updatePatientMutation.mutateAsync({ id: patientId, data: updateData });
      
      setSuccessMessage("Patient information updated successfully!");
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);

    } catch (error) {
      console.error("Failed to update patient:", error);
      setFormErrors({ submit: "Failed to update patient information. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus: string, reason?: string) => {
    try {
      const statusData: PatientStatusChangeDto = {
        accountStatus: newStatus as any,
        reason,
        notifyUser: true,
        sendEmail: true,
      };

      await changeStatusMutation.mutateAsync({ id: patientId, statusData });
      setSuccessMessage(`Patient account status changed to ${newStatus}`);
    } catch (error) {
      console.error("Failed to change status:", error);
      setFormErrors({ submit: "Failed to change account status. Please try again." });
    }
  };

  const handlePasswordReset = async () => {
    try {
      await resetPasswordMutation.mutateAsync({ 
        id: patientId, 
        passwordData: { 
          resetMethod: "admin_initiated",
          notifyUser: true,
          sendEmail: true 
        } 
      });
      setSuccessMessage("Password reset email sent to patient");
    } catch (error) {
      console.error("Failed to reset password:", error);
      setFormErrors({ submit: "Failed to send password reset. Please try again." });
    }
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      await uploadAvatarMutation.mutateAsync({ id: patientId, file });
      setSuccessMessage("Profile picture updated successfully!");
    } catch (error) {
      console.error("Failed to upload avatar:", error);
      setFormErrors({ submit: "Failed to update profile picture. Please try again." });
    }
  };

  // Computed values
  const isLoading = patientLoading;
  const isError = patientError;
  const error = patientErrorDetails || undefined;
  const isSaving = isSubmitting || updatePatientMutation.isPending;

  return (
    <PatientEditPresentation
      patient={patient}
      formData={formData}
      activeTab={activeTab}
      isLoading={isLoading}
      isError={isError}
      error={error}
      isSaving={isSaving}
      formErrors={formErrors}
      successMessage={successMessage}
      onTabChange={handleTabChange}
      onBackToDetail={handleBackToDetail}
      onBackToList={handleBackToList}
      onFieldChange={handleFieldChange}
      onArrayFieldChange={handleArrayFieldChange}
      onSave={handleSave}
      onStatusChange={handleStatusChange}
      onPasswordReset={handlePasswordReset}
      onAvatarUpload={handleAvatarUpload}
    />
  );
}