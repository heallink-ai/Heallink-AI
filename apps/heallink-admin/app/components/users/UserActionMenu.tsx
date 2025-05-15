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
}

export default function UserActionMenu({
  userId,
  userStatus,
}: UserActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        className="p-2 rounded-full hover:bg-[color:var(--accent)]/20"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User actions"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[color:var(--card)] border border-[color:var(--border)] z-10">
          <div className="py-1">
            <Link
              href={`/dashboard/users/${userId}`}
              className="flex items-center px-4 py-2 text-sm hover:bg-[color:var(--accent)]/20"
              onClick={() => setIsOpen(false)}
            >
              <User size={14} className="mr-2" />
              View Profile
            </Link>

            <Link
              href={`/dashboard/users/${userId}/edit`}
              className="flex items-center px-4 py-2 text-sm hover:bg-[color:var(--accent)]/20"
              onClick={() => setIsOpen(false)}
            >
              <Edit size={14} className="mr-2" />
              Edit User
            </Link>

            <button
              className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-[color:var(--accent)]/20"
              onClick={() => {
                // Password reset logic would go here
                setIsOpen(false);
              }}
            >
              <Key size={14} className="mr-2" />
              Reset Password
            </button>

            {userStatus === "Active" ? (
              <button
                className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-[color:var(--accent)]/20 text-amber-600 dark:text-amber-400"
                onClick={() => {
                  // Suspend account logic would go here
                  setIsOpen(false);
                }}
              >
                <Ban size={14} className="mr-2" />
                Suspend Account
              </button>
            ) : (
              <button
                className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-[color:var(--accent)]/20 text-green-600 dark:text-green-400"
                onClick={() => {
                  // Activate account logic would go here
                  setIsOpen(false);
                }}
              >
                <Activity size={14} className="mr-2" />
                Activate Account
              </button>
            )}

            <div className="border-t border-[color:var(--border)] my-1"></div>

            <button
              className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-[color:var(--accent)]/20 text-red-600 dark:text-red-400"
              onClick={() => {
                // Delete account logic would go here
                setIsOpen(false);
              }}
            >
              <Trash size={14} className="mr-2" />
              Delete Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
