"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Upload,
  Download,
  Loader,
  AlertCircle,
  Users,
  ChevronLeft,
  ChevronRight,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Shield,
  Key,
  LogOut,
  UserX,
  UserCheck,
  UserMinus,
  FileDown,
  Settings,
} from "lucide-react";
import {
  PatientListPresentationProps,
  Patient,
  AccountStatus,
} from "../types/user.types";

export default function PatientListPresentation({
  patients,
  totalPatients,
  currentPage,
  totalPages,
  isLoading,
  isError,
  error,
  searchTerm,
  filters,
  selectedPatients,
  onSearchChange,
  onFilterChange,
  onPageChange,
  onSelectionChange,
  onStatusChange,
  onBulkAction,
  onPatientView,
  onPatientEdit,
  onResetPassword,
  onImpersonate,
  onTerminateSessions,
  onExport,
  onImport,
  onRefresh,
}: PatientListPresentationProps) {
  const router = useRouter();

  // Local state for UI
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>("");

  // Handle patient selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(patients.map((p) => p.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectPatient = (patientId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedPatients, patientId]);
    } else {
      onSelectionChange(selectedPatients.filter((id) => id !== patientId));
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: AccountStatus }) => {
    const getStatusStyle = (status: AccountStatus) => {
      switch (status) {
        case AccountStatus.ACTIVE:
          return "bg-green-100 text-green-800 border-green-200";
        case AccountStatus.SUSPENDED:
          return "bg-red-100 text-red-800 border-red-200";
        case AccountStatus.DEACTIVATED:
          return "bg-gray-100 text-gray-800 border-gray-200";
        case AccountStatus.PENDING_VERIFICATION:
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case AccountStatus.PENDING_SIGNUP:
          return "bg-blue-100 text-blue-800 border-blue-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    };

    return (
      <span
        className={`px-2 py-1 text-xs rounded-full border ${getStatusStyle(status)}`}
      >
        {status.replace("_", " ").toUpperCase()}
      </span>
    );
  };

  // Patient action menu
  const PatientActionMenu = ({ patient }: { patient: Patient }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded-lg hover:bg-[color:var(--accent)] transition-colors"
        >
          <MoreHorizontal size={16} />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 mt-1 w-48 bg-[color:var(--popover)] border border-[color:var(--border)] rounded-lg shadow-lg z-20">
              <div className="py-1">
                <button
                  onClick={() => {
                    onPatientView(patient.id);
                    setIsOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-[color:var(--accent)] flex items-center gap-2"
                >
                  <Eye size={14} />
                  View Details
                </button>

                <button
                  onClick={() => {
                    onPatientEdit(patient.id);
                    setIsOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-[color:var(--accent)] flex items-center gap-2"
                >
                  <Edit size={14} />
                  Edit Patient
                </button>

                <div className="border-t border-[color:var(--border)] my-1" />

                {patient.accountStatus === AccountStatus.ACTIVE ? (
                  <button
                    onClick={() => {
                      onStatusChange(patient.id, AccountStatus.SUSPENDED);
                      setIsOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-[color:var(--accent)] flex items-center gap-2 text-red-600"
                  >
                    <UserX size={14} />
                    Suspend
                  </button>
                ) : patient.accountStatus === AccountStatus.SUSPENDED ? (
                  <button
                    onClick={() => {
                      onStatusChange(patient.id, AccountStatus.ACTIVE);
                      setIsOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-[color:var(--accent)] flex items-center gap-2 text-green-600"
                  >
                    <UserCheck size={14} />
                    Activate
                  </button>
                ) : null}

                <button
                  onClick={() => {
                    onResetPassword(patient.id);
                    setIsOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-[color:var(--accent)] flex items-center gap-2"
                >
                  <Key size={14} />
                  Reset Password
                </button>

                <button
                  onClick={() => {
                    onTerminateSessions(patient.id);
                    setIsOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-[color:var(--accent)] flex items-center gap-2"
                >
                  <LogOut size={14} />
                  End Sessions
                </button>

                <div className="border-t border-[color:var(--border)] my-1" />

                <button
                  onClick={() => {
                    onImpersonate(patient.id);
                    setIsOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-[color:var(--accent)] flex items-center gap-2 text-orange-600"
                >
                  <Shield size={14} />
                  Impersonate
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-none space-y-4 p-6 border-b border-[color:var(--border)]">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-[color:var(--foreground)]">
              Patient Management
            </h1>
            <p className="text-sm text-[color:var(--muted-foreground)] mt-1">
              Manage patient accounts, health records, and access permissions
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard/users/add")}
            className="px-4 py-2 bg-[color:var(--primary)] text-[color:var(--primary-foreground)] rounded-lg hover:bg-[color:var(--primary)]/90 flex items-center gap-2"
          >
            <Plus size={16} />
            Add Patient
          </button>
        </div>

        {/* Search and Quick Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[color:var(--muted-foreground)]"
            />
            <input
              type="text"
              placeholder="Search by name, email, phone, or patient ID..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[color:var(--border)] rounded-lg bg-[color:var(--background)] text-[color:var(--foreground)] placeholder-[color:var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)]"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 border rounded-lg transition-colors ${
                showFilters
                  ? "bg-[color:var(--primary)] text-[color:var(--primary-foreground)] border-[color:var(--primary)]"
                  : "bg-[color:var(--background)] border-[color:var(--border)] hover:bg-[color:var(--accent)]"
              }`}
            >
              <Filter size={16} />
              Filters
            </button>

            <select
              value={filters.accountStatus}
              onChange={(e) => onFilterChange("accountStatus", e.target.value)}
              className="px-3 py-2 border border-[color:var(--border)] rounded-lg bg-[color:var(--background)] text-[color:var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="deactivated">Deactivated</option>
              <option value="pending_verification">Pending Verification</option>
              <option value="pending_signup">Pending Signup</option>
            </select>

            <select
              value={filters.subscriptionPlan}
              onChange={(e) =>
                onFilterChange("subscriptionPlan", e.target.value)
              }
              className="px-3 py-2 border border-[color:var(--border)] rounded-lg bg-[color:var(--background)] text-[color:var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)]"
            >
              <option value="all">All Plans</option>
              <option value="free">Free</option>
              <option value="basic">Basic</option>
              <option value="premium">Premium</option>
              <option value="family">Family</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
        </div>

        {/* Extended Filters */}
        {showFilters && (
          <div className="bg-[color:var(--card)] border border-[color:var(--border)] rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-[color:var(--foreground)] mb-1">
                  Verification Status
                </label>
                <select
                  value={filters.verificationStatus}
                  onChange={(e) =>
                    onFilterChange("verificationStatus", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-[color:var(--border)] rounded-lg bg-[color:var(--background)] text-[color:var(--foreground)] text-sm"
                >
                  <option value="all">All</option>
                  <option value="email_verified">Email Verified</option>
                  <option value="phone_verified">Phone Verified</option>
                  <option value="both_verified">Both Verified</option>
                  <option value="none_verified">None Verified</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[color:var(--foreground)] mb-1">
                  Two-Factor Auth
                </label>
                <select
                  value={
                    filters.twoFactorEnabled === "all"
                      ? "all"
                      : filters.twoFactorEnabled
                        ? "enabled"
                        : "disabled"
                  }
                  onChange={(e) =>
                    onFilterChange(
                      "twoFactorEnabled",
                      e.target.value === "all"
                        ? "all"
                        : e.target.value === "enabled"
                    )
                  }
                  className="w-full px-3 py-2 border border-[color:var(--border)] rounded-lg bg-[color:var(--background)] text-[color:var(--foreground)] text-sm"
                >
                  <option value="all">All</option>
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[color:var(--foreground)] mb-1">
                  Insurance Status
                </label>
                <select
                  value={
                    filters.hasInsurance === "all"
                      ? "all"
                      : filters.hasInsurance
                        ? "has_insurance"
                        : "no_insurance"
                  }
                  onChange={(e) =>
                    onFilterChange(
                      "hasInsurance",
                      e.target.value === "all"
                        ? "all"
                        : e.target.value === "has_insurance"
                    )
                  }
                  className="w-full px-3 py-2 border border-[color:var(--border)] rounded-lg bg-[color:var(--background)] text-[color:var(--foreground)] text-sm"
                >
                  <option value="all">All</option>
                  <option value="has_insurance">Has Insurance</option>
                  <option value="no_insurance">No Insurance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[color:var(--foreground)] mb-1">
                  Recent Activity
                </label>
                <select
                  value={
                    filters.hasRecentActivity === "all"
                      ? "all"
                      : filters.hasRecentActivity
                        ? "active"
                        : "inactive"
                  }
                  onChange={(e) =>
                    onFilterChange(
                      "hasRecentActivity",
                      e.target.value === "all"
                        ? "all"
                        : e.target.value === "active"
                    )
                  }
                  className="w-full px-3 py-2 border border-[color:var(--border)] rounded-lg bg-[color:var(--background)] text-[color:var(--foreground)] text-sm"
                >
                  <option value="all">All</option>
                  <option value="active">Recently Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Action buttons and status */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-sm text-[color:var(--muted-foreground)] w-full sm:w-auto text-center sm:text-left">
            {isLoading ? (
              <span className="flex items-center justify-center sm:justify-start">
                <Loader size={14} className="animate-spin mr-2" />
                Loading patients...
              </span>
            ) : isError ? (
              <span className="flex items-center justify-center sm:justify-start text-red-500">
                <AlertCircle size={14} className="mr-2" />
                Error loading patients:{" "}
                {error instanceof Error ? error.message : "Unknown error"}
              </span>
            ) : (
              <div className="flex items-center gap-4">
                <span>
                  Showing {patients.length} of {totalPatients} patients
                </span>
                {selectedPatients.length > 0 && (
                  <span className="text-[color:var(--primary)] font-medium">
                    {selectedPatients.length} selected
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
            {selectedPatients.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowBulkActions(!showBulkActions)}
                  className="px-3 py-1.5 rounded-lg bg-[color:var(--primary)] text-[color:var(--primary-foreground)] text-sm flex items-center gap-1.5"
                >
                  <Settings size={14} />
                  Bulk Actions
                </button>

                <button
                  onClick={() => onExport("csv", selectedPatients)}
                  className="px-3 py-1.5 rounded-lg bg-[color:var(--secondary-background)] border border-[color:var(--border)] hover:bg-[color:var(--accent)] text-sm flex items-center gap-1.5"
                >
                  <FileDown size={14} />
                  Export Selected
                </button>
              </div>
            )}

            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-lg bg-[color:var(--secondary-background)] border border-[color:var(--border)] hover:bg-[color:var(--accent)] text-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              Refresh
            </button>

            <label className="px-3 py-1.5 rounded-lg bg-[color:var(--secondary-background)] border border-[color:var(--border)] hover:bg-[color:var(--accent)] text-sm flex items-center gap-1.5 cursor-pointer">
              <Upload size={14} />
              <span>Import</span>
              <input
                type="file"
                accept=".csv,.xlsx,.json"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onImport(file);
                  }
                }}
                className="hidden"
              />
            </label>

            <button
              onClick={() => onExport("csv")}
              className="px-3 py-1.5 rounded-lg bg-[color:var(--secondary-background)] border border-[color:var(--border)] hover:bg-[color:var(--accent)] text-sm flex items-center gap-1.5"
            >
              <Download size={14} />
              <span>Export All</span>
            </button>
          </div>
        </div>

        {/* Bulk Actions Menu */}
        {showBulkActions && selectedPatients.length > 0 && (
          <div className="bg-[color:var(--card)] border border-[color:var(--border)] rounded-lg p-4">
            <h3 className="text-sm font-medium text-[color:var(--foreground)] mb-3">
              Bulk Actions ({selectedPatients.length} patients selected)
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onBulkAction("activate", selectedPatients)}
                className="px-3 py-1.5 rounded-lg bg-green-100 text-green-800 border border-green-200 hover:bg-green-200 text-sm flex items-center gap-1.5"
              >
                <UserCheck size={14} />
                Activate
              </button>

              <button
                onClick={() => onBulkAction("suspend", selectedPatients)}
                className="px-3 py-1.5 rounded-lg bg-red-100 text-red-800 border border-red-200 hover:bg-red-200 text-sm flex items-center gap-1.5"
              >
                <UserX size={14} />
                Suspend
              </button>

              <button
                onClick={() => onBulkAction("deactivate", selectedPatients)}
                className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200 text-sm flex items-center gap-1.5"
              >
                <UserMinus size={14} />
                Deactivate
              </button>

              <button
                onClick={() => onBulkAction("verify_email", selectedPatients)}
                className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200 text-sm"
              >
                Verify Email
              </button>

              <button
                onClick={() => onBulkAction("enable_2fa", selectedPatients)}
                className="px-3 py-1.5 rounded-lg bg-purple-100 text-purple-800 border border-purple-200 hover:bg-purple-200 text-sm"
              >
                Enable 2FA
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Patient Table */}
      <div className="flex-grow px-6 pb-6 overflow-auto">
        {isError ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <AlertCircle size={32} className="mx-auto mb-4 text-red-500" />
              <p className="text-red-500 font-medium">
                Failed to load patients
              </p>
              <p className="text-[color:var(--muted-foreground)] text-sm mt-1">
                {error instanceof Error ? error.message : "Unknown error"}
              </p>
              <button
                onClick={onRefresh}
                className="mt-4 px-4 py-2 bg-[color:var(--primary)] text-[color:var(--primary-foreground)] rounded-lg hover:bg-[color:var(--primary)]/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[color:var(--card)] border border-[color:var(--border)] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[color:var(--muted)]/50 border-b border-[color:var(--border)]">
                  <tr>
                    <th className="w-12 p-3">
                      <input
                        type="checkbox"
                        checked={
                          selectedPatients.length === patients.length &&
                          patients.length > 0
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-[color:var(--border)]"
                      />
                    </th>
                    <th className="text-left p-3 text-sm font-medium text-[color:var(--foreground)]">
                      Patient
                    </th>
                    <th className="text-left p-3 text-sm font-medium text-[color:var(--foreground)]">
                      Contact
                    </th>
                    <th className="text-left p-3 text-sm font-medium text-[color:var(--foreground)]">
                      Status
                    </th>
                    <th className="text-left p-3 text-sm font-medium text-[color:var(--foreground)]">
                      Plan
                    </th>
                    <th className="text-left p-3 text-sm font-medium text-[color:var(--foreground)]">
                      Verification
                    </th>
                    <th className="text-left p-3 text-sm font-medium text-[color:var(--foreground)]">
                      Last Login
                    </th>
                    <th className="text-left p-3 text-sm font-medium text-[color:var(--foreground)]">
                      Created
                    </th>
                    <th className="w-12 p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center">
                        <Loader
                          size={24}
                          className="animate-spin mx-auto mb-2"
                        />
                        <p className="text-[color:var(--muted-foreground)]">
                          Loading patients...
                        </p>
                      </td>
                    </tr>
                  ) : patients.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center">
                        <Users
                          size={24}
                          className="mx-auto mb-2 text-[color:var(--muted-foreground)]"
                        />
                        <p className="text-[color:var(--muted-foreground)]">
                          No patients found
                        </p>
                      </td>
                    </tr>
                  ) : (
                    patients.map((patient) => (
                      <tr
                        key={patient.id}
                        className="border-b border-[color:var(--border)] hover:bg-[color:var(--muted)]/30"
                      >
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={selectedPatients.includes(patient.id)}
                            onChange={(e) =>
                              handleSelectPatient(patient.id, e.target.checked)
                            }
                            className="rounded border-[color:var(--border)]"
                          />
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[color:var(--muted)] flex items-center justify-center">
                              {patient.avatarUrl ? (
                                <img
                                  src={patient.avatarUrl}
                                  alt={patient.name}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-sm font-medium text-[color:var(--muted-foreground)]">
                                  {patient.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-[color:var(--foreground)]">
                                {patient.name}
                              </div>
                              <div className="text-xs text-[color:var(--muted-foreground)]">
                                ID: {patient.id.slice(-8)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="text-sm">
                            <div className="text-[color:var(--foreground)]">
                              {patient.email}
                            </div>
                            {patient.phone && (
                              <div className="text-[color:var(--muted-foreground)]">
                                {patient.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <StatusBadge status={patient.accountStatus} />
                        </td>
                        <td className="p-3">
                          <span className="text-sm text-[color:var(--foreground)] capitalize">
                            {patient.subscriptionPlan}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            <span
                              className={`w-2 h-2 rounded-full ${patient.emailVerified ? "bg-green-500" : "bg-gray-300"}`}
                              title={`Email ${patient.emailVerified ? "verified" : "not verified"}`}
                            />
                            <span
                              className={`w-2 h-2 rounded-full ${patient.phoneVerified ? "bg-green-500" : "bg-gray-300"}`}
                              title={`Phone ${patient.phoneVerified ? "verified" : "not verified"}`}
                            />
                            <span
                              className={`w-2 h-2 rounded-full ${patient.twoFactorEnabled ? "bg-blue-500" : "bg-gray-300"}`}
                              title={`2FA ${patient.twoFactorEnabled ? "enabled" : "disabled"}`}
                            />
                          </div>
                        </td>
                        <td className="p-3 text-sm text-[color:var(--muted-foreground)]">
                          {patient.lastLogin
                            ? new Date(patient.lastLogin).toLocaleDateString()
                            : "Never"}
                        </td>
                        <td className="p-3 text-sm text-[color:var(--muted-foreground)]">
                          {new Date(patient.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          <PatientActionMenu patient={patient} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !isError && totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-3 bg-[color:var(--card)] border border-[color:var(--border)] rounded-xl px-4 py-3 shadow-sm">
              <span className="text-sm text-[color:var(--muted-foreground)]">
                Page {currentPage} of {totalPages} ({totalPatients} total)
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="p-2 rounded-lg border border-[color:var(--border)] hover:bg-[color:var(--accent)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="p-2 rounded-lg border border-[color:var(--border)] hover:bg-[color:var(--accent)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
