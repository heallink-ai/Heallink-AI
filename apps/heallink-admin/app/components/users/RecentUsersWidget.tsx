"use client";

import React from "react";
import Link from "next/link";
import { User, ArrowRight } from "lucide-react";
import UserRoleBadge from "./UserRoleBadge";
import UserStatusBadge from "./UserStatusBadge";

// Mock recent users data
const RECENT_USERS = [
  {
    id: "u5",
    name: "Robert Kim",
    email: "r.kim@example.com",
    role: "Provider",
    status: "Pending",
    lastLogin: null,
    created: "2025-05-05T11:45:00",
  },
  {
    id: "u6",
    name: "Elena Rodriguez",
    email: "e.rodriguez@example.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2025-05-15T08:20:00",
    created: "2025-03-12T16:40:00",
  },
  {
    id: "u4",
    name: "Aisha Patel",
    email: "aisha.p@example.com",
    role: "Staff",
    status: "Active",
    lastLogin: "2025-05-13T09:10:00",
    created: "2025-02-18T08:30:00",
  },
];

export default function RecentUsersWidget() {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(date);
    }
  };

  return (
    <div className="bg-[color:var(--card)] rounded-xl p-5 neumorph-flat">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold">Recent Users</h2>
        <Link
          href="/dashboard/users"
          className="text-xs text-[color:var(--primary)] hover:underline flex items-center gap-1"
        >
          View All
          <ArrowRight size={12} />
        </Link>
      </div>

      <div className="space-y-4">
        {RECENT_USERS.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between border-b border-[color:var(--border)] last:border-b-0 pb-3 last:pb-0"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-[color:var(--primary)] text-white rounded-full flex items-center justify-center">
                <User size={14} />
              </div>
              <div>
                <Link
                  href={`/dashboard/users/${user.id}`}
                  className="font-medium text-sm hover:text-[color:var(--primary)]"
                >
                  {user.name}
                </Link>
                <div className="text-xs text-[color:var(--muted-foreground)]">
                  {user.email}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <div className="mb-1">
                <UserRoleBadge role={user.role} />
              </div>
              <div className="text-xs text-[color:var(--muted-foreground)]">
                Added {formatDate(user.created)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
