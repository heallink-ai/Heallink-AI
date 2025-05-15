"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  UserPlus,
  Download,
  Upload,
  Users,
} from "lucide-react";
import UserTable from "../../components/users/UserTable";

// Mock user data - in a real app, this would come from an API
const MOCK_USERS = [
  {
    id: "u1",
    name: "James Wilson",
    email: "james.w@heallink.com",
    role: "Patient",
    status: "Active",
    lastLogin: "2025-05-14T10:45:00",
    created: "2024-12-15T11:20:00",
  },
  {
    id: "u2",
    name: "Sophia Garcia",
    email: "s.garcia@gmail.com",
    role: "Patient",
    status: "Active",
    lastLogin: "2025-05-10T14:30:00",
    created: "2024-11-05T09:00:00",
  },
  {
    id: "u3",
    name: "Michael Chen",
    email: "m.chen@example.com",
    role: "Provider Staff",
    status: "Inactive",
    lastLogin: "2025-04-30T16:15:00",
    created: "2025-01-07T14:10:00",
  },
  {
    id: "u4",
    name: "Aisha Patel",
    email: "aisha.p@example.com",
    role: "Patient",
    status: "Active",
    lastLogin: "2025-05-13T09:10:00",
    created: "2025-02-18T08:30:00",
  },
  {
    id: "u5",
    name: "Robert Kim",
    email: "r.kim@example.com",
    role: "Provider Staff",
    status: "Pending",
    lastLogin: null,
    created: "2025-05-05T11:45:00",
  },
  {
    id: "u6",
    name: "Emma Thompson",
    email: "emma.t@example.com",
    role: "Patient",
    status: "Active",
    lastLogin: "2025-05-15T08:20:00",
    created: "2025-03-12T16:40:00",
  },
  {
    id: "u7",
    name: "David Rodriguez",
    email: "david.r@example.com",
    role: "Patient",
    status: "Inactive",
    lastLogin: "2025-03-20T14:15:00",
    created: "2025-01-10T13:25:00",
  },
  {
    id: "u8",
    name: "Sarah Miller",
    email: "sarah.m@hospitalgroup.org",
    role: "Provider Staff",
    status: "Active",
    lastLogin: "2025-05-12T09:30:00",
    created: "2024-10-22T08:45:00",
  },
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Filter users based on current state
  const filteredUsers = MOCK_USERS.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "All" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "All" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="bg-[color:var(--background)]">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Users size={24} className="mr-2 text-[color:var(--primary)]" />
          <h1 className="text-2xl font-semibold">User Management</h1>
        </div>
        <Link
          href="/dashboard/users/add"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[color:var(--primary)] text-white hover:bg-[color:var(--primary-dark)] transition-colors"
        >
          <UserPlus size={16} />
          <span>Add New User</span>
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
              placeholder="Search users by name or email"
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
                <option value="Patient">Patient</option>
                <option value="Provider Staff">Provider Staff</option>
                <option value="Family Member">Family Member</option>
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
            Showing {filteredUsers.length} users
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

      {/* Users table */}
      <UserTable users={filteredUsers} />
    </div>
  );
}
