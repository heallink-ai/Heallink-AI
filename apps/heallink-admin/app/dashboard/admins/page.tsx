"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Filter, UserPlus, Download, Upload, Shield, ShieldCheck } from "lucide-react";
import UserTable from "../../components/users/UserTable";

// Mock admin data - in a real app, this would come from an API
const MOCK_ADMINS = [
  {
    id: "a1",
    name: "John Smith",
    email: "john.smith@heallink.com",
    role: "System Admin",
    status: "Active",
    lastLogin: "2025-05-10T14:30:00",
    created: "2024-11-05T09:00:00",
  },
  {
    id: "a2",
    name: "Elena Rodriguez",
    email: "e.rodriguez@heallink.com",
    role: "Super Admin",
    status: "Active",
    lastLogin: "2025-05-15T08:20:00",
    created: "2025-03-12T16:40:00",
  },
  {
    id: "a3",
    name: "David Wilson",
    email: "d.wilson@heallink.com",
    role: "IT Admin",
    status: "Active",
    lastLogin: "2025-05-12T11:45:00",
    created: "2024-10-20T13:30:00",
  },
  {
    id: "a4",
    name: "Lisa Chen",
    email: "l.chen@heallink.com",
    role: "Security Admin",
    status: "Inactive",
    lastLogin: "2025-04-05T09:20:00",
    created: "2025-01-15T10:00:00",
  },
  {
    id: "a5",
    name: "Marcus Johnson",
    email: "m.johnson@heallink.com",
    role: "Support Admin",
    status: "Pending",
    lastLogin: null,
    created: "2025-05-01T08:45:00",
  }
];

export default function AdminsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Filter admins based on current state
  const filteredAdmins = MOCK_ADMINS.filter((admin) => {
    const matchesSearch =
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "All" || admin.role.includes(roleFilter);
    const matchesStatus =
      statusFilter === "All" || admin.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="bg-[color:var(--background)]">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <ShieldCheck size={24} className="mr-2 text-[color:var(--primary)]" />
          <h1 className="text-2xl font-semibold">Admin Management</h1>
        </div>
        <Link
          href="/dashboard/admins/invite"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[color:var(--primary)] text-white hover:bg-[color:var(--primary-dark)] transition-colors"
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
          <div className="flex flex-wrap gap-2">
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
                <option value="System">System Admin</option>
                <option value="Super">Super Admin</option>
                <option value="IT">IT Admin</option>
                <option value="Security">Security Admin</option>
                <option value="Support">Support Admin</option>
              </select>
            </div>
            <div className="flex items-center ml-0 md:ml-2">
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
              </select>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap justify-between items-center">
          <div className="text-sm text-[color:var(--muted-foreground)]">
            Showing {filteredAdmins.length} administrators
          </div>
          <div className="flex gap-2">
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
      <UserTable users={filteredAdmins} />
    </div>
  );
}
