// Types
export * from "./types/user.types";

// Services
export { patientService } from "./services/patient.service";

// Hooks
export * from "./hooks/use-patient-queries";

// Presentation Components
export { default as PatientDashboard } from "./components/PatientDashboard";
export { default as PatientListPresentation } from "./components/PatientListPresentation";
export { default as PatientTable } from "./components/PatientTable";
export { default as PatientStatsGrid } from "./components/PatientStatsGrid";
export { default as PatientSearch } from "./components/PatientSearch";
export { default as PatientFilters } from "./components/PatientFilters";
export { default as PatientQuickActions } from "./components/PatientQuickActions";
export { default as PatientActionMenu } from "./components/PatientActionMenu";
export { default as PatientStatusBadge } from "./components/PatientStatusBadge";

// Container Components
export { default as PatientListContainer } from "./containers/PatientListContainer";
export { default as PatientDetailContainer } from "./containers/PatientDetailContainer";
export { default as PatientEditContainer } from "./containers/PatientEditContainer";

// Patient Detail Components
export { default as PatientDetailPresentation } from "./components/PatientDetailPresentation";
export { default as PatientDetailHeader } from "./components/PatientDetailHeader";
export { default as PatientContactInfo } from "./components/PatientContactInfo";
export { default as PatientAddressInfo } from "./components/PatientAddressInfo";
export { default as PatientEmergencyContacts } from "./components/PatientEmergencyContacts";

// Patient Edit Components
export { default as PatientEditPresentation } from "./components/PatientEditPresentation";
export { default as PatientPersonalForm } from "./components/PatientPersonalForm";
export { default as PatientContactForm } from "./components/PatientContactForm";
export { default as PatientMedicalForm } from "./components/PatientMedicalForm";
export { default as PatientEmergencyForm } from "./components/PatientEmergencyForm";
export { default as PatientSecurityForm } from "./components/PatientSecurityForm";

// Export container types
export type { PatientDetailTab } from "./containers/PatientDetailContainer";
export type { PatientEditTab, PatientEditFormData } from "./containers/PatientEditContainer";

// Utils
export * from "./utils/patient-utils";