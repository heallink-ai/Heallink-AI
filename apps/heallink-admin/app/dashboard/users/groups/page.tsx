"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Plus, MoreHorizontal, Pencil, Trash, Users } from "lucide-react";

// Mock user groups data
const MOCK_USER_GROUPS = [
  {
    id: "g1",
    name: "Active Patients",
    description: "Regular patients actively using the platform",
    membersCount: 1245,
    createdAt: "2025-01-15T10:00:00",
  },
  {
    id: "g2",
    name: "Provider Staff",
    description: "Staff members from healthcare providers",
    membersCount: 87,
    createdAt: "2025-01-20T14:30:00",
  },
  {
    id: "g3",
    name: "Family Caregivers",
    description: "Family members with caregiving responsibilities",
    membersCount: 342,
    createdAt: "2025-02-05T09:15:00",
  },
  {
    id: "g4",
    name: "Premium Users",
    description: "Users with premium subscription plans",
    membersCount: 568,
    createdAt: "2025-02-10T16:45:00",
  },
  {
    id: "g5",
    name: "New Users (May 2025)",
    description: "Users who joined in May 2025",
    membersCount: 103,
    createdAt: "2025-05-01T08:30:00",
  },
];

export default function UserGroupsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const filteredGroups = MOCK_USER_GROUPS.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const toggleDropdown = (groupId: string) => {
    if (activeDropdown === groupId) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(groupId);
    }
  };

  return (
    <div className="bg-[color:var(--background)]">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Users size={24} className="mr-2 text-[color:var(--primary)]" />
          <h1 className="text-2xl font-semibold">User Groups</h1>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[color:var(--primary)] text-white hover:bg-[color:var(--primary-dark)] transition-colors">
          <Plus size={16} />
          <span>Create Group</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-[color:var(--card)] rounded-xl p-4 mb-6 neumorph-flat">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search
              size={18}
              className="text-[color:var(--muted-foreground)]"
            />
          </div>
          <input
            type="text"
            className="pl-10 pr-4 py-2 w-full rounded-lg bg-[color:var(--input)] border border-[color:var(--border)] focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)] text-sm"
            placeholder="Search user groups by name or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* User Groups list */}
      <div className="bg-[color:var(--card)] rounded-xl neumorph-flat overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[color:var(--border)] bg-[color:var(--secondary-background)]">
                <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--muted-foreground)] uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--muted-foreground)] uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--muted-foreground)] uppercase tracking-wider">
                  Members
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--muted-foreground)] uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[color:var(--muted-foreground)] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--border)]">
              {filteredGroups.length > 0 ? (
                filteredGroups.map((group) => (
                  <tr 
                    key={group.id} 
                    className="hover:bg-[color:var(--accent)]/5 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{group.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-[color:var(--foreground)]">
                        {group.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users size={16} className="mr-2 text-[color:var(--muted-foreground)]" />
                        <span className="text-sm">{group.membersCount.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[color:var(--foreground)]">
                      {formatDate(group.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                      <button
                        onClick={() => toggleDropdown(group.id)}
                        className="p-1.5 rounded-lg hover:bg-[color:var(--accent)]/10"
                        aria-label="Actions"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      
                      {activeDropdown === group.id && (
                        <div className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-[color:var(--card)] z-10 neumorph-flat border border-[color:var(--border)]">
                          <div className="py-1">
                            <Link
                              href={`/dashboard/users/groups/${group.id}/view`}
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-[color:var(--navbar-item-hover)] flex items-center gap-2"
                            >
                              <Users size={14} />
                              <span>View Members</span>
                            </Link>
                            <Link
                              href={`/dashboard/users/groups/${group.id}/edit`}
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-[color:var(--navbar-item-hover)] flex items-center gap-2"
                            >
                              <Pencil size={14} />
                              <span>Edit Group</span>
                            </Link>
                            <button
                              className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-[color:var(--navbar-item-hover)] flex items-center gap-2"
                            >
                              <Trash size={14} />
                              <span>Delete Group</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-[color:var(--muted-foreground)]">
                    No user groups found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
