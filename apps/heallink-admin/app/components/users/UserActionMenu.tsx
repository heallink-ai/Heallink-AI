"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  User,
  Key,
  Trash,
  Edit,
  Ban,
  Activity,
} from "lucide-react";
import Link from "next/link";

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
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = `user-action-menu-${userId}`;

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      buttonRef.current?.focus();
    }
  };

  // Calculate menu position
  const getMenuPosition = () => {
    if (!menuRef.current || !buttonRef.current) return {};

    const windowWidth = window.innerWidth;
    const menuWidth = 192; // 48rem = 192px (w-48)
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const rightSpace = windowWidth - buttonRect.right;

    // If there's not enough space on the right, position left
    if (rightSpace < menuWidth && buttonRect.left > menuWidth) {
      return {
        right: "0px",
        left: "auto",
      };
    }

    // Default positioning
    return {
      right: "0px",
      left: "auto",
    };
  };

  // Close menu when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close menu on window resize to prevent positioning issues
  useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen]);

  // Normalize status for consistent comparison
  const normalizedStatus =
    typeof userStatus === "string" ? userStatus.toLowerCase() : "";

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        ref={buttonRef}
        className="p-2 rounded-full hover:bg-[color:var(--accent)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)] focus:ring-opacity-50"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User actions"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-haspopup="menu"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div
          id={menuId}
          role="menu"
          className="absolute top-full mt-1 right-0 w-48 rounded-md shadow-lg bg-[color:var(--card)] border border-[color:var(--border)] z-50"
          style={{
            maxWidth: "calc(100vw - 20px)",
            ...getMenuPosition(),
          }}
          onKeyDown={handleKeyDown}
        >
          <div className="py-1" role="none">
            <Link
              href={`/dashboard/users/${userId}`}
              className="flex items-center px-4 py-2 text-sm hover:bg-[color:var(--accent)]/20 focus:bg-[color:var(--accent)]/30 focus:outline-none"
              onClick={() => setIsOpen(false)}
              role="menuitem"
              tabIndex={0}
            >
              <User size={14} className="mr-2 flex-shrink-0" />
              <span className="truncate">View Profile</span>
            </Link>

            <Link
              href={`/dashboard/users/${userId}/edit`}
              className="flex items-center px-4 py-2 text-sm hover:bg-[color:var(--accent)]/20 focus:bg-[color:var(--accent)]/30 focus:outline-none"
              onClick={() => setIsOpen(false)}
              role="menuitem"
              tabIndex={0}
            >
              <Edit size={14} className="mr-2 flex-shrink-0" />
              <span className="truncate">Edit User</span>
            </Link>

            <button
              className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-[color:var(--accent)]/20 focus:bg-[color:var(--accent)]/30 focus:outline-none"
              onClick={() => {
                // Password reset logic would go here
                setIsOpen(false);
              }}
              role="menuitem"
            >
              <Key size={14} className="mr-2 flex-shrink-0" />
              <span className="truncate">Reset Password</span>
            </button>

            {normalizedStatus === "active" ? (
              <button
                className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-[color:var(--accent)]/20 focus:bg-[color:var(--accent)]/30 focus:outline-none text-amber-600 dark:text-amber-400"
                onClick={() => {
                  if (onStatusChange) {
                    onStatusChange(userId, userStatus);
                  }
                  setIsOpen(false);
                }}
                role="menuitem"
              >
                <Ban size={14} className="mr-2 flex-shrink-0" />
                <span className="truncate">Suspend Account</span>
              </button>
            ) : (
              <button
                className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-[color:var(--accent)]/20 focus:bg-[color:var(--accent)]/30 focus:outline-none text-green-600 dark:text-green-400"
                onClick={() => {
                  if (onStatusChange) {
                    onStatusChange(userId, userStatus);
                  }
                  setIsOpen(false);
                }}
                role="menuitem"
              >
                <Activity size={14} className="mr-2 flex-shrink-0" />
                <span className="truncate">Activate Account</span>
              </button>
            )}

            <div
              className="border-t border-[color:var(--border)] my-1"
              role="separator"
            ></div>

            <button
              className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-[color:var(--accent)]/20 focus:bg-[color:var(--accent)]/30 focus:outline-none text-red-600 dark:text-red-400"
              onClick={() => {
                // Delete account logic would go here
                setIsOpen(false);
              }}
              role="menuitem"
            >
              <Trash size={14} className="mr-2 flex-shrink-0" />
              <span className="truncate">Delete Account</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
