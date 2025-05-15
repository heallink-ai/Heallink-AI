"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, ChevronDown, ChevronUp } from "lucide-react";
import UserStatusBadge from "./UserStatusBadge";
import UserRoleBadge from "./UserRoleBadge";
import UserActionMenu from "./UserActionMenu";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string | null;
  created: string;
}

interface UserTableProps {
  users: UserData[];
  title?: string;
  showPagination?: boolean;
}

export default function UserTable({
  users,
  title,
  showPagination = true,
}: UserTableProps) {
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // Sort users based on current state
  const sortedUsers = [...users].sort((a, b) => {
    const aVal = a[sortBy as keyof typeof a];
    const bVal = b[sortBy as keyof typeof b];

    if (aVal === null) return 1;
    if (bVal === null) return -1;

    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortOrder === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return sortOrder === "asc"
      ? (aVal as any) - (bVal as any)
      : (bVal as any) - (aVal as any);
  });

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="bg-[color:var(--card)] rounded-xl overflow-hidden neumorph-flat">
      {title && (
        <div className="px-6 py-4 border-b border-[color:var(--border)]">
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse">
          <thead>
            <tr className="border-b border-[color:var(--border)]">
              <th className="p-4 text-left">
                <div
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <span>Name</span>
                  {sortBy === "name" && (
                    <span className="text-[color:var(--primary)]">
                      {sortOrder === "asc" ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th className="p-4 text-left">
                <div
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => handleSort("email")}
                >
                  <span>Email</span>
                  {sortBy === "email" && (
                    <span className="text-[color:var(--primary)]">
                      {sortOrder === "asc" ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th className="p-4 text-left">
                <div
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => handleSort("role")}
                >
                  <span>Role</span>
                  {sortBy === "role" && (
                    <span className="text-[color:var(--primary)]">
                      {sortOrder === "asc" ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th className="p-4 text-left">
                <div
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  <span>Status</span>
                  {sortBy === "status" && (
                    <span className="text-[color:var(--primary)]">
                      {sortOrder === "asc" ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th className="p-4 text-left">
                <div
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => handleSort("lastLogin")}
                >
                  <span>Last Login</span>
                  {sortBy === "lastLogin" && (
                    <span className="text-[color:var(--primary)]">
                      {sortOrder === "asc" ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.length > 0 ? (
              sortedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-[color:var(--border)] hover:bg-[color:var(--accent)]/5"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 bg-[color:var(--primary)] text-white rounded-full flex items-center justify-center">
                        <User size={16} />
                      </div>
                      <div>
                        <Link
                          href={`/dashboard/users/${user.id}`}
                          className="font-medium hover:text-[color:var(--primary)]"
                        >
                          {user.name}
                        </Link>
                        <div className="text-xs text-[color:var(--muted-foreground)]">
                          Since {formatDate(user.created)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    <UserRoleBadge role={user.role} />
                  </td>
                  <td className="p-4">
                    <UserStatusBadge status={user.status} />
                  </td>
                  <td className="p-4 text-sm">{formatDate(user.lastLogin)}</td>
                  <td className="p-4 text-center">
                    <UserActionMenu userId={user.id} userStatus={user.status} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <div className="p-4 flex justify-between items-center border-t border-[color:var(--border)]">
          <div className="text-sm text-[color:var(--muted-foreground)]">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">{sortedUsers.length}</span> of{" "}
            <span className="font-medium">{sortedUsers.length}</span> results
          </div>
          <div className="flex gap-1">
            <button
              disabled
              className="px-3 py-1 rounded-md bg-[color:var(--input)] border border-[color:var(--border)] text-[color:var(--muted-foreground)] cursor-not-allowed"
            >
              Previous
            </button>
            <button className="px-3 py-1 rounded-md bg-[color:var(--primary)] text-white">
              1
            </button>
            <button
              disabled
              className="px-3 py-1 rounded-md bg-[color:var(--input)] border border-[color:var(--border)] text-[color:var(--muted-foreground)] cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
