"use client";

import React from "react";
import {
  User,
  Key,
  Trash,
  Edit,
  Ban,
  Activity,
  MoreVertical,
} from "lucide-react";
import ActionMenu, { ActionGroup } from "../common/ActionMenu";

interface UserActionMenuProps {
  userId: string;
  userStatus: string;
  onStatusChange?: (id: string, status: string) => void;
}

export default function UserActionMenu({
  userId,
  userStatus,
  onStatusChange,
}: UserActionMenuProps) {
  // Normalize status for consistent comparison
  const normalizedStatus =
    typeof userStatus === "string" ? userStatus.toLowerCase() : "";

  // Create groups for the action menu
  const buildActionGroups = (): ActionGroup[] => {
    const linkItems = [
      {
        label: "View Profile",
        icon: <User size={14} />,
        onClick: () => {
          window.location.href = `/dashboard/users/${userId}`;
        },
      },
      {
        label: "Edit User",
        icon: <Edit size={14} />,
        onClick: () => {
          window.location.href = `/dashboard/users/${userId}/edit`;
        },
      },
      {
        label: "Reset Password",
        icon: <Key size={14} />,
        onClick: () => {
          // Password reset logic would go here
          console.log("Reset password for", userId);
        },
      },
    ];

    const statusItem =
      normalizedStatus === "active"
        ? {
            label: "Suspend Account",
            icon: <Ban size={14} />,
            onClick: () => {
              if (onStatusChange) {
                onStatusChange(userId, userStatus);
              }
            },
            color: "text-amber-600 dark:text-amber-400",
          }
        : {
            label: "Activate Account",
            icon: <Activity size={14} />,
            onClick: () => {
              if (onStatusChange) {
                onStatusChange(userId, userStatus);
              }
            },
            color: "text-green-600 dark:text-green-400",
          };

    const deleteItem = {
      label: "Delete Account",
      icon: <Trash size={14} />,
      onClick: () => {
        // Delete account logic would go here
        console.log("Delete user", userId);
      },
      isDestructive: true,
    };

    return [
      { items: [...linkItems, statusItem] },
      { items: [deleteItem], showDivider: true },
    ];
  };

  return (
    <ActionMenu
      groups={buildActionGroups()}
      triggerIcon={<MoreVertical size={16} />}
      triggerLabel="User actions"
      id={`user-action-menu-${userId}`}
    />
  );
}
