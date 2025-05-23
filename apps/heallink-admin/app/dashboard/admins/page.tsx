"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  UserPlus,
  Download,
  Upload,
  ShieldCheck,
  AlertCircle,
  Loader,
} from "lucide-react";
import UserTable from "../../components/users/UserTable";
import ErrorDisplay from "../../components/common/ErrorDisplay";
import {
  useAdmins,
  useDeactivateAdmin,
  useActivateAdmin,
} from "../../hooks/useAdminHooks";

export default function AdminsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Fetch admins using our custom hook
  const { data: admins = [], isLoading, isError, error } = useAdmins();

  // Mutation hooks for activating/deactivating admins
  const { mutate: deactivateAdmin } = useDeactivateAdmin();
  const { mutate: activateAdmin } = useActivateAdmin();

  // Filter admins based on current state
  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch =
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === "All" ||
      admin.adminRole.includes(roleFilter.toLowerCase());

    // Handle status filtering based on API's isActive property
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Active" && admin.status === "active") ||
      (statusFilter === "Inactive" && admin.status === "inactive");

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Transform admin data to match UserTable format
  const transformedAdmins = filteredAdmins.map((admin) => ({
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.adminRole
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    status: admin.status,
    lastLogin: admin.lastLogin || null,
    created: admin.createdAt,
  }));

  return (
    <div className="bg-[color:var(--background)] h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div className="flex items-center">
          <ShieldCheck size={24} className="mr-2 text-[color:var(--primary)]" />
          <h1 className="text-2xl font-semibold">Admin Management</h1>
        </div>
        <Link
          href="/dashboard/admins/invite"
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[color:var(--primary)] text-white hover:bg-[color:var(--primary-dark)] transition-colors w-full md:w-auto"
        >
          <UserPlus size={16} />
          <span>Invite Admin</span>
        </Link>
      </div>

      {/* Search and filters */}
      <div className="bg-[color:var(--card)] rounded-xl p-4 mb-6 neumorph-flat">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Search */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search
                size={18}
                className="text-[color:var(--muted-foreground)]"
              />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 w-full rounded-lg bg-[color:var(--input)] border border-[color:var(--border)] focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)] text-sm"
              placeholder="Search administrators by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 justify-between">
            <div className="flex items-center">
              <Filter
                size={16}
                className="mr-2 text-[color:var(--muted-foreground)]"
              />
              <span className="text-sm text-[color:var(--muted-foreground)] mr-2">
                Role:
              </span>
              <select
                className="px-3 py-2 rounded-lg bg-[color:var(--input)] border border-[color:var(--border)] focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)] text-sm"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="All">All Roles</option>
                <option value="Super">Super Admin</option>
                <option value="System">System Admin</option>
                <option value="User">User Admin</option>
                <option value="Provider">Provider Admin</option>
                <option value="Content">Content Admin</option>
                <option value="Billing">Billing Admin</option>
                <option value="Support">Support Admin</option>
                <option value="Readonly">Readonly Admin</option>
              </select>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-[color:var(--muted-foreground)] mr-2">
                Status:
              </span>
              <select
                className="px-3 py-2 rounded-lg bg-[color:var(--input)] border border-[color:var(--border)] focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)] text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
                <option value="Locked">Locked</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action buttons */}
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
              `Showing ${filteredAdmins.length} administrators`
            )}
          </div>
          <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
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
      <div className="flex-grow flex">
        {isLoading ? (
          <div className="bg-[color:var(--card)] rounded-xl p-8 flex justify-center items-center w-full">
            <Loader
              size={24}
              className="animate-spin mr-3 text-[color:var(--primary)]"
            />
            <span>Loading administrators...</span>
          </div>
        ) : isError ? (
          <div className="bg-[color:var(--card)] rounded-xl p-8 w-full">
            <ErrorDisplay
              message="Failed to load administrators"
              details={
                error instanceof Error
                  ? error.message
                  : "An unknown error occurred"
              }
            />
          </div>
        ) : (
          <div className="w-full">
            <UserTable
              users={transformedAdmins}
              onStatusChange={(id: string, status: string) => {
                if (status.toLowerCase() === "active") {
                  deactivateAdmin(id);
                } else {
                  activateAdmin(id);
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
