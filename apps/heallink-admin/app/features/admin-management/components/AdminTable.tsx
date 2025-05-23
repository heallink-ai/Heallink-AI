"use client";

import { useState } from "react";
import {
  Users,
  MoreVertical,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  ChevronUp,
  ChevronDown,
  Crown,
  Stethoscope,
} from "lucide-react";
import { AdminUser, UserRole } from "../types/admin.types";

interface AdminTableProps {
  admins: AdminUser[];
  loading?: boolean;
  onEdit: (admin: AdminUser) => void;
  onDelete: (admin: AdminUser) => void;
  onToggleStatus: (admin: AdminUser, status: boolean) => void;
  onSort: (sortBy: string) => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  selectedAdmins: string[];
  onSelectAdmin: (adminId: string) => void;
  onSelectAll: (selected: boolean) => void;
  currentUserRole?: UserRole;
  currentUserId?: string;
}

const getRoleIcon = (role: UserRole) => {
  switch (role) {
    case UserRole.ADMIN:
      return <Crown className="w-4 h-4 text-[color:var(--primary)]" />;
    case UserRole.PROVIDER:
      return <Stethoscope className="w-4 h-4 text-[color:var(--secondary)]" />;
    default:
      return <Users className="w-4 h-4 text-[color:var(--muted-foreground)]" />;
  }
};

const getRoleBadgeColor = (role: UserRole) => {
  switch (role) {
    case UserRole.ADMIN:
      return "bg-[color:var(--primary)]/10 text-[color:var(--primary)]";
    case UserRole.PROVIDER:
      return "bg-[color:var(--secondary)]/10 text-[color:var(--secondary)]";
    default:
      return "bg-[color:var(--muted)]/10 text-[color:var(--muted-foreground)]";
  }
};

export default function AdminTable({
  admins,
  loading = false,
  onEdit,
  onDelete,
  onToggleStatus,
  onSort,
  sortBy,
  sortOrder,
  selectedAdmins,
  onSelectAdmin,
  onSelectAll,
  currentUserRole,
  currentUserId,
}: AdminTableProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const canModifyAdmin = (admin: AdminUser) => {
    if (currentUserRole !== UserRole.ADMIN) return false;
    if (admin._id === currentUserId) return false; // Can't modify self
    return true;
  };

  const canDeleteAdmin = (admin: AdminUser) => {
    if (!canModifyAdmin(admin)) return false;
    if (
      admin.role === UserRole.ADMIN &&
      admins.filter((a) => a.role === UserRole.ADMIN).length <= 1
    ) {
      return false; // Can't delete last admin
    }
    return true;
  };

  const handleSort = (field: string) => {
    onSort(field);
  };

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleSelectAdmin = (adminId: string) => {
    onSelectAdmin(adminId);
  };

  const handleSelectAll = () => {
    const allSelected = selectedAdmins.length === admins.length;
    onSelectAll(!allSelected);
  };

  if (loading) {
    return (
      <div className="card-admin">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-[color:var(--muted)] rounded"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-[color:var(--muted)] rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card-admin overflow-hidden">
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="w-12">
                <input
                  type="checkbox"
                  checked={
                    selectedAdmins.length === admins.length && admins.length > 0
                  }
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-[color:var(--border)] text-[color:var(--primary)] focus:ring-[color:var(--ring)]"
                />
              </th>
              <th
                className="cursor-pointer hover:bg-[color:var(--navbar-item-hover)] transition-colors"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-2">
                  <span>Admin</span>
                  {renderSortIcon("name")}
                </div>
              </th>
              <th
                className="cursor-pointer hover:bg-[color:var(--navbar-item-hover)] transition-colors"
                onClick={() => handleSort("role")}
              >
                <div className="flex items-center gap-2">
                  <span>Role</span>
                  {renderSortIcon("role")}
                </div>
              </th>
              <th>Status</th>
              <th
                className="cursor-pointer hover:bg-[color:var(--navbar-item-hover)] transition-colors"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center gap-2">
                  <span>Created</span>
                  {renderSortIcon("createdAt")}
                </div>
              </th>
              <th
                className="cursor-pointer hover:bg-[color:var(--navbar-item-hover)] transition-colors"
                onClick={() => handleSort("updatedAt")}
              >
                <div className="flex items-center gap-2">
                  <span>Last Active</span>
                  {renderSortIcon("updatedAt")}
                </div>
              </th>
              <th className="w-12">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedAdmins.includes(admin._id)}
                    onChange={() => handleSelectAdmin(admin._id)}
                    className="w-4 h-4 rounded border-[color:var(--border)] text-[color:var(--primary)] focus:ring-[color:var(--ring)]"
                  />
                </td>
                <td>
                  <div className="flex items-center gap-3">
                    {admin.avatarUrl ? (
                      <img
                        src={admin.avatarUrl}
                        alt={admin.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[color:var(--muted)] flex items-center justify-center">
                        <Users className="w-4 h-4 text-[color:var(--muted-foreground)]" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-[color:var(--foreground)]">
                        {admin.name}
                      </div>
                      <div className="text-sm text-[color:var(--muted-foreground)]">
                        {admin.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    {getRoleIcon(admin.role)}
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(
                        admin.role
                      )}`}
                    >
                      {admin.role.charAt(0).toUpperCase() + admin.role.slice(1)}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    {admin.isActive ? (
                      <UserCheck className="w-4 h-4 text-[color:var(--success)]" />
                    ) : (
                      <UserX className="w-4 h-4 text-[color:var(--error)]" />
                    )}
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        admin.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                      }`}
                    >
                      {admin.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </td>
                <td className="text-sm text-[color:var(--muted-foreground)]">
                  {formatDate(admin.createdAt)}
                </td>
                <td className="text-sm text-[color:var(--muted-foreground)]">
                  {formatDate(admin.updatedAt)}
                </td>
                <td>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === admin._id ? null : admin._id
                        )
                      }
                      className="p-1 rounded-md hover:bg-[color:var(--navbar-item-hover)] transition-colors"
                      disabled={!canModifyAdmin(admin)}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeDropdown === admin._id && canModifyAdmin(admin) && (
                      <div className="absolute right-0 top-8 z-10 w-48 bg-[color:var(--card)] rounded-lg shadow-lg border border-[color:var(--border)] py-1">
                        <button
                          onClick={() => {
                            onEdit(admin);
                            setActiveDropdown(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-[color:var(--navbar-item-hover)] flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Edit Admin
                        </button>

                        <button
                          onClick={() => {
                            onToggleStatus(admin, !admin.isActive);
                            setActiveDropdown(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-[color:var(--navbar-item-hover)] flex items-center gap-2"
                        >
                          {admin.isActive ? (
                            <>
                              <UserX className="w-4 h-4" />
                              Suspend
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-4 h-4" />
                              Activate
                            </>
                          )}
                        </button>

                        {canDeleteAdmin(admin) && (
                          <>
                            <div className="h-px bg-[color:var(--border)] my-1"></div>
                            <button
                              onClick={() => {
                                onDelete(admin);
                                setActiveDropdown(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-[color:var(--navbar-item-hover)] flex items-center gap-2 text-[color:var(--error)]"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete Admin
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {admins.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-[color:var(--muted-foreground)] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[color:var(--foreground)] mb-2">
              No admins found
            </h3>
            <p className="text-[color:var(--muted-foreground)]">
              Get started by creating your first admin user.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
