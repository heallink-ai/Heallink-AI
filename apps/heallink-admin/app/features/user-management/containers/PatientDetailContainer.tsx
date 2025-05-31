"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PatientDetailPresentation from "../components/PatientDetailPresentation";
import { useGetPatient, useGetPatientActivityLog } from "../hooks/use-patient-queries";

export type PatientDetailTab = 'overview' | 'medical' | 'activity' | 'security' | 'documents' | 'family';

export interface PatientDetailContainerProps {
  // Optional props for when used in different contexts
  patientId?: string;
  defaultTab?: PatientDetailTab;
}

export default function PatientDetailContainer({ 
  patientId: propPatientId, 
  defaultTab = 'overview' 
}: PatientDetailContainerProps) {
  const params = useParams();
  const router = useRouter();
  
  // Get patient ID from props or URL params
  const patientId = propPatientId || (params.id as string);
  
  // State management
  const [activeTab, setActiveTab] = useState<PatientDetailTab>(defaultTab);

  // Data fetching
  const { 
    data: patient, 
    isLoading: patientLoading, 
    isError: patientError, 
    error: patientErrorDetails 
  } = useGetPatient(patientId);
  
  const { 
    data: activityLog, 
    isLoading: activityLoading 
  } = useGetPatientActivityLog(patientId);

  // Event handlers
  const handleTabChange = (tab: PatientDetailTab) => {
    setActiveTab(tab);
  };

  const handleBackToList = () => {
    router.push('/dashboard/users');
  };

  const handleEditPatient = () => {
    router.push(`/dashboard/users/${patientId}/edit`);
  };

  const handleExportData = () => {
    // TODO: Implement export functionality
    console.log('Export patient data:', patientId);
  };

  const handleQuickAction = (action: string, data?: unknown) => {
    // TODO: Implement quick actions (send message, schedule appointment, etc.)
    console.log('Quick action:', action, data);
  };

  const handleSecurityAction = (action: string, data?: unknown) => {
    // TODO: Implement security actions (reset password, suspend account, etc.)
    console.log('Security action:', action, data);
  };

  // Computed values
  const isLoading = patientLoading;
  const isError = patientError;
  const error = patientErrorDetails || undefined;

  return (
    <PatientDetailPresentation
      patient={patient}
      activityLog={activityLog}
      activeTab={activeTab}
      isLoading={isLoading}
      isError={isError}
      error={error}
      activityLoading={activityLoading}
      onTabChange={handleTabChange}
      onBackToList={handleBackToList}
      onEditPatient={handleEditPatient}
      onExportData={handleExportData}
      onQuickAction={handleQuickAction}
      onSecurityAction={handleSecurityAction}
    />
  );
}