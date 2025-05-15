"use client";

import React from "react";

interface UserRoleBadgeProps {
  role: "Admin" | "Staff" | "Provider" | "Patient" | string;
}

export default function UserRoleBadge({ role }: UserRoleBadgeProps) {
  // Define styles based on role
  const getRoleStyles = () => {
    switch (role) {
      case "Admin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "Staff":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "Provider":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "Patient":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleStyles()}`}
    >
      {role}
    </span>
  );
}
