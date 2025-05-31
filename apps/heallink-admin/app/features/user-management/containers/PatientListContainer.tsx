"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import PatientListPresentation from "../components/PatientListPresentation";
import {
  usePatients,
  usePatientStats,
  useBulkPatientAction,
  useExportPatients,
  useImportPatients,
  usePreviewImportFile,
  useSuspendPatient,
  useActivatePatient,
  useDeactivatePatient,
  useResetPatientPassword,
  useImpersonatePatient,
  useTerminatePatientSessions,
} from "../hooks/use-patient-queries";
import {
  PatientQueryDto,
  AccountStatus,
  SubscriptionPlan,
  PatientFilters,
  BulkPatientActionDto,
  BulkPatientImportDto,
} from "../types/user.types";

export default function PatientListContainer() {
  const router = useRouter();

  // ==================== STATE MANAGEMENT ====================

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<PatientFilters>({
    accountStatus: "all",
    subscriptionPlan: "all",
    verificationStatus: "all",
    twoFactorEnabled: "all",
    hasInsurance: "all",
    hasRecentActivity: "all",
    dateRange: {},
    location: {},
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);

  // Selection state
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);

  // UI state
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );
  const [showBulkActionModal, setShowBulkActionModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // ==================== QUERY PARAMETERS ====================

  // Build query parameters for API
  const queryParams: PatientQueryDto = useMemo(() => {
    const params: PatientQueryDto = {
      page: currentPage,
      limit: pageSize,
      sortBy: "createdAt",
      sortOrder: "desc",
    };

    // Add search if provided
    if (searchTerm.trim()) {
      params.search = searchTerm.trim();
      params.searchFields = ["name", "email", "phone"];
    }

    // Add filters
    if (filters.accountStatus !== "all") {
      params.accountStatus = filters.accountStatus as AccountStatus;
    }

    if (filters.subscriptionPlan !== "all") {
      params.subscriptionPlan = filters.subscriptionPlan as SubscriptionPlan;
    }

    if (filters.verificationStatus !== "all") {
      switch (filters.verificationStatus) {
        case "email_verified":
          params.emailVerified = true;
          break;
        case "phone_verified":
          params.phoneVerified = true;
          break;
        case "both_verified":
          params.emailVerified = true;
          params.phoneVerified = true;
          break;
        case "none_verified":
          params.emailVerified = false;
          params.phoneVerified = false;
          break;
      }
    }

    if (filters.twoFactorEnabled !== "all") {
      params.twoFactorEnabled = filters.twoFactorEnabled as boolean;
    }

    if (filters.hasInsurance !== "all") {
      params.hasInsurance = filters.hasInsurance as boolean;
    }

    if (filters.hasRecentActivity !== "all") {
      params.hasRecentActivity = filters.hasRecentActivity as boolean;
    }

    // Date range filters
    if (filters.dateRange.start) {
      params.createdAfter = filters.dateRange.start;
    }
    if (filters.dateRange.end) {
      params.createdBefore = filters.dateRange.end;
    }

    // Location filters
    if (filters.location.country) {
      params.country = filters.location.country;
    }
    if (filters.location.state) {
      params.state = filters.location.state;
    }

    return params;
  }, [currentPage, pageSize, searchTerm, filters]);

  // ==================== DATA FETCHING ====================

  // Fetch patients using our custom hook with pagination
  const {
    data: patientResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = usePatients(queryParams);

  // Fetch patient statistics
  const { data: statsResponse } = usePatientStats();

  // ==================== MUTATION HOOKS ====================

  const suspendPatientMutation = useSuspendPatient();
  const activatePatientMutation = useActivatePatient();
  const deactivatePatientMutation = useDeactivatePatient();
  const resetPasswordMutation = useResetPatientPassword();
  const impersonateMutation = useImpersonatePatient();
  const terminateSessionsMutation = useTerminatePatientSessions();
  const bulkActionMutation = useBulkPatientAction();
  const exportMutation = useExportPatients();
  const importMutation = useImportPatients();
  const previewImportMutation = usePreviewImportFile();

  // ==================== DERIVED DATA ====================

  const patients = patientResponse?.patients || [];
  const totalPatients = patientResponse?.total || 0;
  const totalPages = patientResponse?.totalPages || 1;
  const summary = patientResponse?.summary;

  // ==================== EVENT HANDLERS ====================

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  const handleFilterChange = useCallback((key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleSelectionChange = useCallback((patientIds: string[]) => {
    setSelectedPatients(patientIds);
  }, []);

  const handlePatientView = useCallback((id: string) => {
    setSelectedPatientId(id);
    setShowDetailDrawer(true);
  }, []);

  const handlePatientEdit = useCallback(
    (id: string) => {
      router.push(`/dashboard/users/${id}/edit`);
    },
    [router]
  );

  const handleStatusChange = useCallback(
    async (id: string, status: AccountStatus, reason?: string) => {
      try {
        switch (status) {
          case AccountStatus.SUSPENDED:
            await suspendPatientMutation.mutateAsync(id, reason);
            toast.success("Patient suspended successfully");
            break;
          case AccountStatus.ACTIVE:
            await activatePatientMutation.mutateAsync(id, reason);
            toast.success("Patient activated successfully");
            break;
          case AccountStatus.DEACTIVATED:
            await deactivatePatientMutation.mutateAsync(id, reason);
            toast.success("Patient deactivated successfully");
            break;
          default:
            toast.error("Invalid status change");
        }
      } catch (error) {
        toast.error(
          `Failed to change patient status: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    },
    [suspendPatientMutation, activatePatientMutation, deactivatePatientMutation]
  );

  const handleResetPassword = useCallback(
    async (id: string) => {
      try {
        const result = await resetPasswordMutation.mutateAsync({
          id,
          passwordData: {
            generateRandomPassword: true,
            sendResetEmail: true,
            requirePasswordChange: true,
          },
        });
        toast.success(result.message);
      } catch (error) {
        toast.error(
          `Failed to reset password: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    },
    [resetPasswordMutation]
  );

  const handleImpersonate = useCallback(
    async (id: string) => {
      try {
        const result = await impersonateMutation.mutateAsync(id);
        toast.success("Impersonation session started");

        // Store impersonation token and redirect to patient app
        localStorage.setItem("impersonationToken", result.impersonationToken);
        window.open("/dashboard/impersonate", "_blank");
      } catch (error) {
        toast.error(
          `Failed to start impersonation: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    },
    [impersonateMutation]
  );

  const handleTerminateSessions = useCallback(
    async (id: string) => {
      try {
        const result = await terminateSessionsMutation.mutateAsync(id);
        toast.success(
          `Terminated ${result.terminatedSessions} sessions successfully`
        );
      } catch (error) {
        toast.error(
          `Failed to terminate sessions: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    },
    [terminateSessionsMutation]
  );

  const handleBulkAction = useCallback(
    async (action: string, patientIds: string[], options?: any) => {
      try {
        const data: BulkPatientActionDto = {
          action: action as any,
          patientIds,
          ...options,
        };

        const result = await bulkActionMutation.mutateAsync(data);

        if (result.success) {
          toast.success(
            `${result.message}. Success: ${result.successCount}, Failed: ${result.failureCount}`
          );

          // Clear selection after successful bulk action
          setSelectedPatients([]);

          // Close bulk action modal
          setShowBulkActionModal(false);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error(
          `Bulk action failed: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    },
    [bulkActionMutation]
  );

  const handleExport = useCallback(
    async (format: string, patientIds?: string[]) => {
      try {
        const result = await exportMutation.mutateAsync({
          format: format as "csv" | "json" | "excel",
          fields: [
            "id",
            "name",
            "email",
            "phone",
            "accountStatus",
            "subscriptionPlan",
            "emailVerified",
            "phoneVerified",
            "twoFactorEnabled",
            "lastLogin",
            "createdAt",
            "updatedAt",
          ],
          includePII: false,
          patientIds,
          ...(patientIds?.length ? {} : { filters: queryParams }),
        });

        if (result.downloadUrl) {
          // Trigger download
          const link = document.createElement("a");
          link.href = result.downloadUrl;
          link.download = `patients-export-${new Date().toISOString().split("T")[0]}.${format}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          toast.success("Export completed successfully");
        }
      } catch (error) {
        toast.error(
          `Export failed: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    },
    [exportMutation, queryParams]
  );

  const handleImport = useCallback(
    async (file: File) => {
      try {
        // First, preview the file
        const preview = await previewImportMutation.mutateAsync(file);

        if (preview.errors.length > 0) {
          toast.error(`Import file has errors: ${preview.errors.join(", ")}`);
          return;
        }

        // If preview is good, proceed with import
        const importData: BulkPatientImportDto = {
          patients: preview.patients,
          duplicateHandling: "skip",
          sendWelcomeEmails: true,
          requirePasswordReset: true,
          validateEmails: true,
          validatePhones: true,
        };

        const result = await importMutation.mutateAsync(importData);

        if (result.success) {
          toast.success(
            `Import completed. Imported: ${result.importSummary?.imported}, Skipped: ${result.importSummary?.skipped}, Errors: ${result.importSummary?.errors}`
          );
          setShowImportModal(false);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error(
          `Import failed: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    },
    [previewImportMutation, importMutation]
  );

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // ==================== RENDER ====================

  return (
    <PatientListPresentation
      patients={patients}
      totalPatients={totalPatients}
      currentPage={currentPage}
      totalPages={totalPages}
      isLoading={isLoading}
      isError={isError}
      error={error}
      searchTerm={searchTerm}
      filters={filters}
      selectedPatients={selectedPatients}
      queryParams={queryParams}
      onSearchChange={handleSearchChange}
      onFilterChange={handleFilterChange}
      onPageChange={handlePageChange}
      onSelectionChange={handleSelectionChange}
      onStatusChange={handleStatusChange}
      onBulkAction={handleBulkAction}
      onPatientView={handlePatientView}
      onPatientEdit={handlePatientEdit}
      onResetPassword={handleResetPassword}
      onImpersonate={handleImpersonate}
      onTerminateSessions={handleTerminateSessions}
      onExport={handleExport}
      onImport={handleImport}
      onRefresh={handleRefresh}
    />
  );
}
