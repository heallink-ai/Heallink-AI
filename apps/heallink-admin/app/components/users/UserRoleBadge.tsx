"use client";

import React from "react";

interface UserRoleBadgeProps {
  role: string;
}

export default function UserRoleBadge({ role }: UserRoleBadgeProps) {
  // Normalize role for consistent display
  const getNormalizedRole = () => {
    if (!role || typeof role !== "string") {
      return "Unknown";
    }

    // Capitalize first letter for display
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  };

  const normalizedRole = getNormalizedRole();

  // Define styles based on role
  const getRoleStyles = () => {
    // Handle both full role names and role types
    const lowerRole = (role || "").toLowerCase();

    if (lowerRole.includes("admin") || lowerRole.includes("super")) {
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
    } else if (lowerRole.includes("staff") || lowerRole.includes("system")) {
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    } else if (lowerRole.includes("provider")) {
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    } else if (lowerRole.includes("patient") || lowerRole.includes("user")) {
      return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300";
    } else if (lowerRole.includes("billing")) {
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
    } else if (lowerRole.includes("content")) {
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300";
    } else if (lowerRole.includes("support")) {
      return "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300";
    } else if (lowerRole.includes("readonly")) {
      return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300";
    } else {
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  return (
    <span
      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getRoleStyles()}`}
    >
      {normalizedRole}
    </span>
  );
}
