"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Building,
  Edit,
} from "lucide-react";
import UserRoleBadge from "../../../components/users/UserRoleBadge";
import UserStatusBadge from "../../../components/users/UserStatusBadge";

// Mock user data - in a real app, this would be fetched based on the id param
const MOCK_USER = {
  id: "u1",
  name: "John Smith",
  email: "john.smith@example.com",
  phone: "+1 (555) 123-4567",
  role: "Admin",
  status: "Active",
  lastLogin: "2025-05-10T14:30:00",
  created: "2024-11-05T09:00:00",
  address: "123 Medical Drive, San Francisco, CA 94107",
  organization: "Heallink Central Hospital",
  department: "Administration",
  bio: "Healthcare administrator with over 10 years of experience in hospital management systems.",
  profileImage: null, // In a real app, this would be an image URL
};

// Format date for display
const formatDate = (dateString: string | null) => {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export default function UserPage({ params }: { params: { id: string } }) {
  const userId = params.id;

  // In a real app, you'd fetch user data based on the ID
  const user = MOCK_USER; // Pretend we fetched the user with this ID

  return (
    <div className="bg-[color:var(--background)]">
      {/* Header with back button */}
      <div className="flex items-center gap-2 mb-6">
        <Link
          href="/dashboard/users"
          className="p-2 rounded-full hover:bg-[color:var(--accent)]/20 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-semibold">User Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User profile card */}
        <div className="lg:col-span-1">
          <div className="bg-[color:var(--card)] rounded-xl p-6 neumorph-flat">
            <div className="flex flex-col items-center text-center mb-6">
              {/* Profile image */}
              <div className="h-24 w-24 bg-[color:var(--primary)] text-white rounded-full flex items-center justify-center mb-4 text-4xl">
                {user.name.charAt(0)}
              </div>

              <h2 className="text-xl font-semibold">{user.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <UserRoleBadge role={user.role} />
                <UserStatusBadge status={user.status} />
              </div>

              <p className="text-sm text-[color:var(--muted-foreground)] mt-2">
                Member since {formatDate(user.created).split(",")[0]}
              </p>
            </div>

            <div className="space-y-4 border-t border-[color:var(--border)] pt-4">
              <div className="flex items-center gap-3">
                <Mail
                  size={18}
                  className="text-[color:var(--muted-foreground)]"
                />
                <span>{user.email}</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone
                  size={18}
                  className="text-[color:var(--muted-foreground)]"
                />
                <span>{user.phone}</span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin
                  size={18}
                  className="text-[color:var(--muted-foreground)]"
                />
                <span>{user.address}</span>
              </div>

              <div className="flex items-center gap-3">
                <Building
                  size={18}
                  className="text-[color:var(--muted-foreground)]"
                />
                <div>
                  <div>{user.organization}</div>
                  <div className="text-sm text-[color:var(--muted-foreground)]">
                    {user.department}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href={`/dashboard/users/${userId}/edit`}
                className="w-full px-4 py-2 rounded-lg flex items-center justify-center gap-2 bg-[color:var(--secondary-background)] border border-[color:var(--border)] hover:bg-[color:var(--accent)]/20 transition-colors"
              >
                <Edit size={16} />
                <span>Edit Profile</span>
              </Link>
            </div>
          </div>
        </div>

        {/* User details column */}
        <div className="lg:col-span-2 space-y-6">
          {/* About section */}
          <div className="bg-[color:var(--card)] rounded-xl p-6 neumorph-flat">
            <h3 className="text-lg font-medium mb-4">About</h3>
            <p className="text-[color:var(--foreground)]">{user.bio}</p>
          </div>

          {/* Activity section */}
          <div className="bg-[color:var(--card)] rounded-xl p-6 neumorph-flat">
            <h3 className="text-lg font-medium mb-4">Recent Activity</h3>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Calendar
                    size={16}
                    className="text-blue-600 dark:text-blue-400"
                  />
                </div>
                <div>
                  <p className="font-medium">Last login</p>
                  <p className="text-sm text-[color:var(--muted-foreground)]">
                    {formatDate(user.lastLogin)}
                  </p>
                </div>
              </div>

              {/* In a real app, you would have more activity items here */}
              <div className="text-sm text-[color:var(--muted-foreground)] italic">
                No additional activity recorded
              </div>
            </div>
          </div>

          {/* Permissions section */}
          <div className="bg-[color:var(--card)] rounded-xl p-6 neumorph-flat">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Permissions & Access</h3>
              <button className="text-sm text-[color:var(--primary)]">
                Edit Permissions
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">User Management</h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <svg
                      className="h-4 w-4 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    View Users
                  </li>
                  <li className="flex items-center text-sm">
                    <svg
                      className="h-4 w-4 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Edit Users
                  </li>
                  <li className="flex items-center text-sm">
                    <svg
                      className="h-4 w-4 text-red-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Delete Users
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Provider Management</h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <svg
                      className="h-4 w-4 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    View Providers
                  </li>
                  <li className="flex items-center text-sm">
                    <svg
                      className="h-4 w-4 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Edit Providers
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Analytics & Reports</h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <svg
                      className="h-4 w-4 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    View Reports
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Settings & Configuration</h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <svg
                      className="h-4 w-4 text-red-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Modify System Settings
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
