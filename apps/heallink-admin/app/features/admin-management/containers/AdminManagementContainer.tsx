"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Users,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import { AdminUser, UserRole, AdminQueryParams } from "../types/admin.types";
import {
  useAdmins,
  useAdminStats,
  useCreateAdmin,
  useUpdateAdmin,
  useDeleteAdmin,
  useToggleAdminStatus,
  useBulkAdminAction,
} from "../hooks/use-admin-queries";
import AdminTable from "../components/AdminTable";
import AdminForm from "../components/AdminForm";

interface AdminManagementContainerProps {
  currentUser?: {
    id: string;
    role: UserRole;
    name: string;
  };
}

export default function AdminManagementContainer({
  currentUser,
}: AdminManagementContainerProps) {
  const [queryParams, setQueryParams] = useState<AdminQueryParams>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<UserRole | "">("");
  const [showForm, setShowForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<AdminUser | null>(
    null
  );
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Queries
  const {
    data: adminListData,
    isLoading,
    error,
    refetch,
  } = useAdmins(queryParams);
  const { data: stats } = useAdminStats();

  // Mutations
  const createAdminMutation = useCreateAdmin();
  const updateAdminMutation = useUpdateAdmin();
  const deleteAdminMutation = useDeleteAdmin();
  const toggleStatusMutation = useToggleAdminStatus();
  const bulkActionMutation = useBulkAdminAction();

  // Auto-clear notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Apply search and filter
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      setQueryParams((prev) => ({
        ...prev,
        search: searchTerm || undefined,
        role: filterRole || undefined,
        page: 1, // Reset to first page when searching
      }));
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, filterRole]);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
  };

  const handleCreateAdmin = async (data: any) => {
    try {
      await createAdminMutation.mutateAsync(data);
      setShowForm(false);
      showNotification("success", "Admin created successfully");
    } catch (error: any) {
      showNotification(
        "error",
        error.response?.data?.message || "Failed to create admin"
      );
    }
  };

  const handleUpdateAdmin = async (data: any) => {
    if (!editingAdmin) return;

    try {
      await updateAdminMutation.mutateAsync({ id: editingAdmin._id, data });
      setShowForm(false);
      setEditingAdmin(null);
      showNotification("success", "Admin updated successfully");
    } catch (error: any) {
      showNotification(
        "error",
        error.response?.data?.message || "Failed to update admin"
      );
    }
  };

  const handleDeleteAdmin = async (admin: AdminUser) => {
    try {
      await deleteAdminMutation.mutateAsync(admin._id);
      setShowDeleteConfirm(null);
      showNotification("success", "Admin deleted successfully");
    } catch (error: any) {
      showNotification(
        "error",
        error.response?.data?.message || "Failed to delete admin"
      );
    }
  };

  const handleToggleStatus = async (admin: AdminUser, status: boolean) => {
    try {
      await toggleStatusMutation.mutateAsync({ id: admin._id, status });
      showNotification(
        "success",
        `Admin ${status ? "activated" : "suspended"} successfully`
      );
    } catch (error: any) {
      showNotification(
        "error",
        error.response?.data?.message || "Failed to update admin status"
      );
    }
  };

  const handleBulkDelete = async () => {
    if (selectedAdmins.length === 0) return;

    try {
      const result = await bulkActionMutation.mutateAsync({
        action: "delete",
        adminIds: selectedAdmins,
      });
      setSelectedAdmins([]);
      showNotification(
        "success",
        `Deleted ${result.success} admin(s) successfully`
      );
    } catch (error: any) {
      showNotification("error", "Failed to delete selected admins");
    }
  };

  const handleSort = (sortBy: string) => {
    setQueryParams((prev) => ({
      ...prev,
      sortBy,
      sortOrder:
        prev.sortBy === sortBy && prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  const handleSelectAdmin = (adminId: string) => {
    setSelectedAdmins((prev) =>
      prev.includes(adminId)
        ? prev.filter((id) => id !== adminId)
        : [...prev, adminId]
    );
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedAdmins(adminListData?.admins.map((admin) => admin._id) || []);
    } else {
      setSelectedAdmins([]);
    }
  };

  const handlePageChange = (page: number) => {
    setQueryParams((prev) => ({ ...prev, page }));
  };

  const canCreateAdmin = currentUser?.role === UserRole.ADMIN;
  const admins = adminListData?.admins || [];
  const total = adminListData?.total || 0;
  const totalPages = adminListData?.totalPages || 0;

  if (error) {
    return (
      <div className="card-admin text-center py-12">
        <AlertCircle className="w-12 h-12 text-[color:var(--error)] mx-auto mb-4" />
        <h3 className="text-lg font-medium text-[color:var(--foreground)] mb-2">
          Failed to load admin data
        </h3>
        <p className="text-[color:var(--muted-foreground)] mb-4">
          There was an error loading the admin management interface.
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-[color:var(--primary)] text-white rounded-lg hover:bg-[color:var(--primary)]/90 transition-colors"
        >
          <RotateCcw className="w-4 h-4 inline-block mr-2" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[color:var(--foreground)]">
            Admin Management
          </h1>
          <p className="text-[color:var(--muted-foreground)]">
            Manage admin users and their permissions
          </p>
        </div>

        {canCreateAdmin && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-[color:var(--primary)] text-white rounded-lg hover:bg-[color:var(--primary)]/90 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Admin
          </button>
        )}
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card-admin">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[color:var(--primary)]/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-[color:var(--primary)]" />
              </div>
              <div>
                <p className="text-sm text-[color:var(--muted-foreground)]">
                  Total Admins
                </p>
                <p className="text-xl font-semibold text-[color:var(--foreground)]">
                  {stats.totalAdmins}
                </p>
              </div>
            </div>
          </div>

          <div className="card-admin">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[color:var(--success)]/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-[color:var(--success)]" />
              </div>
              <div>
                <p className="text-sm text-[color:var(--muted-foreground)]">
                  Active This Month
                </p>
                <p className="text-xl font-semibold text-[color:var(--foreground)]">
                  {stats.activeAdmins}
                </p>
              </div>
            </div>
          </div>

          <div className="card-admin">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[color:var(--secondary)]/10 flex items-center justify-center">
                <Plus className="w-5 h-5 text-[color:var(--secondary)]" />
              </div>
              <div>
                <p className="text-sm text-[color:var(--muted-foreground)]">
                  Recently Created
                </p>
                <p className="text-xl font-semibold text-[color:var(--foreground)]">
                  {stats.recentlyCreated}
                </p>
              </div>
            </div>
          </div>

          <div className="card-admin">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[color:var(--warning)]/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-[color:var(--warning)]" />
              </div>
              <div>
                <p className="text-sm text-[color:var(--muted-foreground)]">
                  System Admins
                </p>
                <p className="text-xl font-semibold text-[color:var(--foreground)]">
                  {stats.roleDistribution[UserRole.ADMIN] || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="card-admin">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[color:var(--muted-foreground)]" />
            <input
              type="text"
              placeholder="Search admins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[color:var(--border)] rounded-lg bg-[color:var(--input)] focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)]"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[color:var(--muted-foreground)]" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as UserRole | "")}
              className="pl-10 pr-8 py-2 border border-[color:var(--border)] rounded-lg bg-[color:var(--input)] focus:outline-none focus:ring-2 focus:ring-[color:var(--ring)]"
            >
              <option value="">All Roles</option>
              <option value={UserRole.ADMIN}>Admin</option>
              <option value={UserRole.PROVIDER}>Provider</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedAdmins.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={handleBulkDelete}
                disabled={bulkActionMutation.isPending}
                className="px-4 py-2 bg-[color:var(--error)] text-white rounded-lg hover:bg-[color:var(--error)]/90 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                Delete ({selectedAdmins.length})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Admin Table */}
      <AdminTable
        admins={admins}
        loading={isLoading}
        onEdit={(admin) => {
          setEditingAdmin(admin);
          setShowForm(true);
        }}
        onDelete={(admin) => setShowDeleteConfirm(admin)}
        onToggleStatus={handleToggleStatus}
        onSort={handleSort}
        sortBy={queryParams.sortBy}
        sortOrder={queryParams.sortOrder}
        selectedAdmins={selectedAdmins}
        onSelectAdmin={handleSelectAdmin}
        onSelectAll={handleSelectAll}
        currentUserRole={currentUser?.role}
        currentUserId={currentUser?.id}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => handlePageChange(queryParams.page! - 1)}
            disabled={queryParams.page === 1}
            className="px-3 py-2 border border-[color:var(--border)] rounded-lg bg-[color:var(--card)] hover:bg-[color:var(--navbar-item-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-2 border rounded-lg transition-colors ${
                queryParams.page === page
                  ? "bg-[color:var(--primary)] text-white border-[color:var(--primary)]"
                  : "border-[color:var(--border)] bg-[color:var(--card)] hover:bg-[color:var(--navbar-item-hover)]"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(queryParams.page! + 1)}
            disabled={queryParams.page === totalPages}
            className="px-3 py-2 border border-[color:var(--border)] rounded-lg bg-[color:var(--card)] hover:bg-[color:var(--navbar-item-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Forms and Modals */}
      {showForm && (
        <AdminForm
          admin={editingAdmin || undefined}
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingAdmin(null);
          }}
          onSubmit={editingAdmin ? handleUpdateAdmin : handleCreateAdmin}
          loading={
            createAdminMutation.isPending || updateAdminMutation.isPending
          }
          mode={editingAdmin ? "edit" : "create"}
        />
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[color:var(--card)] rounded-xl shadow-lg w-full max-w-md mx-4">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-[color:var(--foreground)] mb-4">
                Confirm Delete
              </h2>
              <p className="text-[color:var(--muted-foreground)] mb-6">
                Are you sure you want to delete admin "{showDeleteConfirm.name}
                "? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 border border-[color:var(--border)] rounded-lg text-[color:var(--foreground)] hover:bg-[color:var(--navbar-item-hover)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteAdmin(showDeleteConfirm)}
                  disabled={deleteAdminMutation.isPending}
                  className="px-4 py-2 bg-[color:var(--error)] text-white rounded-lg hover:bg-[color:var(--error)]/90 transition-colors disabled:opacity-50"
                >
                  {deleteAdminMutation.isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`px-6 py-4 rounded-lg shadow-lg ${
              notification.type === "success"
                ? "bg-[color:var(--success)] text-white"
                : "bg-[color:var(--error)] text-white"
            }`}
          >
            <p>{notification.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
