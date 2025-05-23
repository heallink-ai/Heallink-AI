"use client";

import React from "react";

interface UserStatusBadgeProps {
  status:
    | "Active"
    | "Inactive"
    | "Pending"
    | "Suspended"
    | "active"
    | "inactive"
    | "pending"
    | "suspended"
    | boolean
    | string;
}

export default function UserStatusBadge({ status }: UserStatusBadgeProps) {
  // Normalize status for consistent display
  const getNormalizedStatus = () => {
    // Handle boolean values (isActive can be a boolean in some APIs)
    if (typeof status === "boolean") {
      return status ? "Active" : "Inactive";
    }

    // Handle string values
    if (typeof status === "string") {
      const lowerStatus = status.toLowerCase();

      if (lowerStatus === "true" || lowerStatus === "active") {
        return "Active";
      }

      if (lowerStatus === "false" || lowerStatus === "inactive") {
        return "Inactive";
      }

      // For other values, just capitalize the first letter
      return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    }

    return "Unknown";
  };

  const normalizedStatus = getNormalizedStatus();

  // Define styles based on status
  const getStatusStyles = () => {
    const lowerStatus = normalizedStatus.toLowerCase();

    switch (lowerStatus) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "suspended":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    }
  };

  return (
    <span
      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusStyles()}`}
    >
      {normalizedStatus}
    </span>
  );
}
