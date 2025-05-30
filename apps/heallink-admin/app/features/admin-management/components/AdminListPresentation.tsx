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
  Edit,
  Eye,
  Key,
  UserX,
  UserCheck,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AdminListPresentationProps, AdminUser } from "../types/admin.types";
import ActionMenu from "../../../components/common/ActionMenu";

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "provider":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusBadgeColor = (isActive: boolean) => {
    return isActive
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  };

  const handleViewProfile = (admin: AdminUser) => {
    router.push(`/dashboard/admins/${admin.id}`);
  };

  const handleEditAdmin = (admin: AdminUser) => {
    router.push(`/dashboard/admins/${admin.id}/edit`);
  };

  const handleResetPassword = (admin: AdminUser) => {
    if (window.confirm(`Reset password for ${admin.name}? A new temporary password will be sent to ${admin.email}.`)) {
      onResetPassword(admin.id);
    }
  };

  const handleSuspendAdmin = (admin: AdminUser) => {
    onStatusToggle(admin.id, admin.isActive ? "active" : "inactive");
  };

  const buildActionGroups = (admin: AdminUser) => [
    {
      items: [
        {
          label: "View Profile",
          icon: <Eye size={14} />,
          onClick: () => handleViewProfile(admin),
        },
        {
          label: "Edit Admin",
          icon: <Edit size={14} />,
          onClick: () => handleEditAdmin(admin),
        },
        {
          label: "Reset Password",
          icon: <Key size={14} />,
          onClick: () => handleResetPassword(admin),
        },
      ],
    },
    {
      items: [
        {
          label: admin.isActive ? "Suspend Admin" : "Activate Admin",
          icon: admin.isActive ? <UserX size={14} /> : <UserCheck size={14} />,
          onClick: () => handleSuspendAdmin(admin),
          color: admin.isActive 
            ? "text-amber-600 dark:text-amber-400" 
            : "text-green-600 dark:text-green-400",
        },
      ],
      showDivider: true,
    },
  ];

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

      {/* Admins table */}
      <div className="flex-grow flex flex-col">
        {isLoading ? (
          <div className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <Loader size={32} className="animate-spin mx-auto mb-4 text-[color:var(--primary)]" />
              <p className="text-[color:var(--muted-foreground)]">Loading administrators...</p>
            </div>
          </div>
        ) : isError ? (
          <div className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <AlertCircle size={32} className="mx-auto mb-4 text-red-500" />
              <p className="text-red-500">Failed to load administrators</p>
              <p className="text-[color:var(--muted-foreground)] text-sm mt-1">
                {error instanceof Error ? error.message : "Unknown error"}
              </p>
              <button
                onClick={onRefresh}
                className="mt-4 px-4 py-2 bg-[color:var(--primary)] text-[color:var(--primary-foreground)] rounded-lg hover:bg-[color:var(--primary)]/90"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : admins.length === 0 ? (
          <div className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <Users size={32} className="mx-auto mb-4 text-[color:var(--muted-foreground)]" />
              <p className="text-[color:var(--muted-foreground)]">No administrators found</p>
              <p className="text-[color:var(--muted-foreground)] text-sm mt-1">
                {searchTerm || roleFilter !== "All" || statusFilter !== "All"
                  ? "Try adjusting your search or filters"
                  : "Get started by inviting your first admin"}
              </p>
              {!searchTerm && roleFilter === "All" && statusFilter === "All" && (
                <button
                  onClick={() => router.push("/dashboard/admins/invite")}
                  className="mt-4 px-4 py-2 bg-[color:var(--primary)] text-[color:var(--primary-foreground)] rounded-lg hover:bg-[color:var(--primary)]/90"
                >
                  Invite Admin
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="flex-grow overflow-auto">
              <table className="w-full">
                <thead className="bg-[color:var(--muted)]/20 border-b border-[color:var(--border)] sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--muted-foreground)] uppercase tracking-wider">
                      Admin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--muted-foreground)] uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--muted-foreground)] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--muted-foreground)] uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--muted-foreground)] uppercase tracking-wider">
                      Last Active
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-[color:var(--muted-foreground)] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[color:var(--background)] divide-y divide-[color:var(--border)]">
                  {admins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-[color:var(--muted)]/10">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {admin.avatarUrl ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={admin.avatarUrl}
                              alt={admin.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-[color:var(--muted)] flex items-center justify-center">
                              <Users className="h-5 w-5 text-[color:var(--muted-foreground)]" />
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-[color:var(--foreground)]">
                              {admin.name}
                            </div>
                            <div className="text-sm text-[color:var(--muted-foreground)]">
                              {admin.email}
                            </div>
                            {admin.phone && (
                              <div className="text-xs text-[color:var(--muted-foreground)]">
                                {admin.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(admin.role)}`}>
                            {admin.role}
                          </span>
                          {admin.adminRole && (
                            <span className="text-xs text-[color:var(--muted-foreground)]">
                              {admin.adminRole.replace('_', ' ')}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(admin.isActive)}`}>
                          {admin.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[color:var(--muted-foreground)]">
                        {formatDate(admin.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[color:var(--muted-foreground)]">
                        {admin.lastLogin ? formatDate(admin.lastLogin) : "Never"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <ActionMenu
                          groups={buildActionGroups(admin)}
                          triggerIcon={<MoreVertical size={16} />}
                          triggerLabel={`Actions for ${admin.name}`}
                          id={`admin-action-menu-${admin.id}`}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex-none px-6 py-4 border-t border-[color:var(--border)] bg-[color:var(--background)]">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-[color:var(--muted-foreground)]">
                    Page {currentPage} of {totalPages} ({totalAdmins} total)
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onPageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className="px-3 py-1.5 rounded-lg border border-[color:var(--border)] hover:bg-[color:var(--accent)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      <ChevronLeft size={14} />
                      Previous
                    </button>
                    <button
                      onClick={() => onPageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="px-3 py-1.5 rounded-lg border border-[color:var(--border)] hover:bg-[color:var(--accent)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    >
                      Next
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}