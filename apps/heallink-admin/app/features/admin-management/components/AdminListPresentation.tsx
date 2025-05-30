"use client";

import React from "react";
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
} from "lucide-react";
import { AdminListPresentationProps, AdminUser } from "../types/admin.types";
import AdminTable from "../../../components/ui/AdminTable";

export default function AdminListPresentation({
  admins,
  totalAdmins,
  currentPage,
  totalPages,
  isLoading,
  isError,
  error,
  searchTerm,
  roleFilter,
  statusFilter,
  onSearchChange,
  onRoleFilterChange,
  onStatusFilterChange,
  onPageChange,
  onStatusToggle,
  onResetPassword,
  onRefresh,
}: AdminListPresentationProps) {
  const router = useRouter();



  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-none space-y-4 p-6 border-b border-[color:var(--border)]">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-[color:var(--foreground)]">
              Administrator Management
            </h1>
            <p className="text-sm text-[color:var(--muted-foreground)] mt-1">
              Manage admin users, their roles, and permissions
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard/admins/invite")}
            className="px-4 py-2 bg-[color:var(--primary)] text-[color:var(--primary-foreground)] rounded-lg hover:bg-[color:var(--primary)]/90 flex items-center gap-2"
          >
            <Users size={16} />
            Invite Admin
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[color:var(--muted-foreground)]"
            />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[color:var(--border)] rounded-lg bg-[color:var(--background)] text-[color:var(--foreground)] placeholder-[color:var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)]"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-[color:var(--muted-foreground)]" />
              <select
                value={roleFilter}
                onChange={(e) => onRoleFilterChange(e.target.value)}
                className="px-3 py-2 border border-[color:var(--border)] rounded-lg bg-[color:var(--background)] text-[color:var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)]"
              >
                <option value="All">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Provider">Provider</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value)}
                className="px-3 py-2 border border-[color:var(--border)] rounded-lg bg-[color:var(--background)] text-[color:var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)]"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action buttons and status */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-sm text-[color:var(--muted-foreground)] w-full sm:w-auto text-center sm:text-left">
            {isLoading ? (
              <span className="flex items-center justify-center sm:justify-start">
                <Loader size={14} className="animate-spin mr-2" />
                Loading administrators...
              </span>
            ) : isError ? (
              <span className="flex items-center justify-center sm:justify-start text-red-500">
                <AlertCircle size={14} className="mr-2" />
                Error loading administrators:{" "}
                {error instanceof Error ? error.message : "Unknown error"}
              </span>
            ) : (
              `Showing ${admins.length} of ${totalAdmins} administrators`
            )}
          </div>
          <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
            <button 
              onClick={onRefresh}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-lg bg-[color:var(--secondary-background)] border border-[color:var(--border)] hover:bg-[color:var(--accent)] text-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              Refresh
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-[color:var(--secondary-background)] border border-[color:var(--border)] hover:bg-[color:var(--accent)] text-sm flex items-center gap-1.5">
              <Upload size={14} />
              <span>Import</span>
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-[color:var(--secondary-background)] border border-[color:var(--border)] hover:bg-[color:var(--accent)] text-sm flex items-center gap-1.5">
              <Download size={14} />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Admin Table */}
      <div className="flex-grow px-6 pb-6">
        <AdminTable
          admins={admins}
          isLoading={isLoading}
          onResetPassword={onResetPassword}
          onStatusToggle={onStatusToggle}
        />

        {/* Error State */}
        {isError && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <AlertCircle size={32} className="mx-auto mb-4 text-red-500" />
              <p className="text-red-500 font-medium">Failed to load administrators</p>
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
        )}

        {/* Pagination */}
        {!isLoading && !isError && totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-3 bg-[color:var(--card)] border border-[color:var(--border)] rounded-xl px-4 py-3 shadow-sm">
              <span className="text-sm text-[color:var(--muted-foreground)]">
                Page {currentPage} of {totalPages} ({totalAdmins} total)
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