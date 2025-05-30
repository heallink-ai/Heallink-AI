"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  Edit,
  Key,
  UserX,
  UserCheck,
  MoreVertical,
  Users,
  Crown,
  Shield,
  Clock,
  Mail,
  Phone,
  Sparkles,
} from "lucide-react";
import DropdownMenu from "./DropdownMenu";
import { AdminUser } from "../../features/admin-management/types/admin.types";

interface AdminTableProps {
  admins: AdminUser[];
  isLoading: boolean;
  onResetPassword: (id: string) => void;
  onStatusToggle: (id: string, currentStatus: string) => void;
}

export default function AdminTable({
  admins,
  isLoading,
  onResetPassword,
  onStatusToggle,
}: AdminTableProps) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
      : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
  };

  const getRoleIcon = (role: string, adminRole?: string) => {
    if (adminRole === "super_admin") return <Crown className="w-4 h-4 text-purple-500" />;
    if (adminRole === "system_admin") return <Shield className="w-4 h-4 text-blue-500" />;
    if (role === "admin") return <Users className="w-4 h-4 text-indigo-500" />;
    return <Users className="w-4 h-4 text-gray-500" />;
  };

  const getRoleBadgeStyle = (role: string, adminRole?: string) => {
    if (adminRole === "super_admin") return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400";
    if (adminRole === "system_admin") return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    if (role === "admin") return "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400";
    return "bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-400";
  };

  const buildDropdownGroups = (admin: AdminUser) => [
    {
      items: [
        {
          label: "View Profile",
          icon: <Eye size={16} />,
          onClick: () => {
            console.log("Navigating to view profile for:", admin.id);
            router.push(`/dashboard/admins/${admin.id}`);
          },
          closeOnClick: true,
        },
        {
          label: "Edit Admin",
          icon: <Edit size={16} />,
          onClick: () => {
            console.log("Navigating to edit admin for:", admin.id);
            router.push(`/dashboard/admins/${admin.id}/edit`);
          },
          closeOnClick: true,
        },
        {
          label: "Reset Password",
          icon: <Key size={16} />,
          onClick: () => {
            console.log("Reset password for:", admin.id);
            if (window.confirm(`Reset password for ${admin.name}? A new temporary password will be sent to ${admin.email}.`)) {
              onResetPassword(admin.id);
            }
          },
          closeOnClick: true,
        },
      ],
    },
    {
      items: [
        {
          label: admin.isActive ? "Suspend Admin" : "Activate Admin",
          icon: admin.isActive ? <UserX size={16} /> : <UserCheck size={16} />,
          onClick: () => {
            console.log("Toggle status for:", admin.id);
            onStatusToggle(admin.id, admin.isActive ? "active" : "inactive");
          },
          variant: admin.isActive ? ("warning" as const) : ("default" as const),
          closeOnClick: true,
        },
      ],
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-[color:var(--card)] border border-[color:var(--border)] rounded-2xl p-6 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[color:var(--muted)] rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-[color:var(--muted)] rounded w-1/3" />
                <div className="h-3 bg-[color:var(--muted)] rounded w-1/2" />
              </div>
              <div className="h-6 bg-[color:var(--muted)] rounded w-20" />
              <div className="h-8 w-8 bg-[color:var(--muted)] rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (admins.length === 0) {
    return (
      <div className="text-center py-16">
        <Users size={48} className="mx-auto mb-4 text-[color:var(--muted-foreground)]" />
        <h3 className="text-lg font-semibold text-[color:var(--foreground)] mb-2">No administrators found</h3>
        <p className="text-[color:var(--muted-foreground)] mb-6">Get started by inviting your first admin user.</p>
        <button 
          onClick={() => router.push("/dashboard/admins/invite")}
          className="px-4 py-2 bg-[color:var(--primary)] text-[color:var(--primary-foreground)] rounded-lg hover:bg-[color:var(--primary)]/90 transition-colors"
        >
          Invite Admin
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {admins.map((admin, index) => (
        <div
          key={admin.id}
          className="group bg-[color:var(--card)] border border-[color:var(--border)] rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-[color:var(--primary)]/5 hover:border-[color:var(--primary)]/20 hover:-translate-y-1"
          style={{
            animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
          }}
        >
          <div className="flex items-center gap-6">
            {/* Avatar & Basic Info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="relative">
                {admin.avatarUrl ? (
                  <img
                    src={admin.avatarUrl}
                    alt={admin.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-[color:var(--border)] group-hover:border-[color:var(--primary)]/30 transition-colors"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[color:var(--primary)]/20 to-[color:var(--primary)]/5 border-2 border-[color:var(--border)] flex items-center justify-center group-hover:border-[color:var(--primary)]/30 transition-colors">
                    <Users className="w-6 h-6 text-[color:var(--primary)]" />
                  </div>
                )}
                
                {/* Online indicator for active admins */}
                {admin.isActive && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-[color:var(--card)] rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-[color:var(--foreground)] truncate group-hover:text-[color:var(--primary)] transition-colors">
                    {admin.name}
                  </h3>
                  {getRoleIcon(admin.role, admin.adminRole)}
                  {admin.adminRole === "super_admin" && (
                    <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-[color:var(--muted-foreground)]">
                  <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    <span className="truncate max-w-48">{admin.email}</span>
                  </div>
                  {admin.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      <span>{admin.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Role Badge */}
            <div className="flex flex-col items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getRoleBadgeStyle(admin.role, admin.adminRole)}`}>
                {getRoleIcon(admin.role, admin.adminRole)}
                {admin.adminRole?.replace('_', ' ') || admin.role}
              </span>
            </div>

            {/* Status Badge */}
            <div className="flex flex-col items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(admin.isActive)}`}>
                <div className={`w-2 h-2 rounded-full ${admin.isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                {admin.isActive ? "Active" : "Suspended"}
              </span>
            </div>

            {/* Last Login */}
            <div className="hidden lg:flex flex-col items-center gap-1 min-w-32">
              <div className="flex items-center gap-1.5 text-xs text-[color:var(--muted-foreground)]">
                <Clock className="w-3 h-3" />
                <span>Last Login</span>
              </div>
              <span className="text-sm font-medium text-[color:var(--foreground)]">
                {admin.lastLogin ? formatDate(admin.lastLogin) : "Never"}
              </span>
            </div>

            {/* Actions */}
            <div className="flex-shrink-0">
              <DropdownMenu
                trigger={
                  <div className="p-2 rounded-xl hover:bg-[color:var(--accent)] transition-colors cursor-pointer group">
                    <MoreVertical className="w-5 h-5 text-[color:var(--muted-foreground)] group-hover:text-[color:var(--foreground)] transition-colors" />
                  </div>
                }
                groups={buildDropdownGroups(admin)}
                align="end"
              />
            </div>
          </div>

          {/* Mobile Last Login */}
          <div className="lg:hidden mt-4 pt-4 border-t border-[color:var(--border)] flex justify-between text-sm">
            <span className="text-[color:var(--muted-foreground)]">Created: {formatDate(admin.createdAt)}</span>
            <span className="text-[color:var(--muted-foreground)]">
              Last Login: {admin.lastLogin ? formatDate(admin.lastLogin) : "Never"}
            </span>
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}