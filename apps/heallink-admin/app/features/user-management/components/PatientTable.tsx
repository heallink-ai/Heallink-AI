"use client";

import React from "react";
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
  Calendar,
  Activity,
} from "lucide-react";
import DropdownMenu from "../../../components/ui/DropdownMenu";
import { PatientListPresentationProps, AccountStatus } from "../types/user.types";

export default function PatientTable(props: PatientListPresentationProps) {
  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400";
      case 'pending_verification':
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400";
      case 'suspended':
        return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
      case 'deactivated':
        return "bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-400";
    }
  };

  const getPlanIcon = (plan: string) => {
    if (plan === "premium") return <Crown className="w-4 h-4 text-purple-500" />;
    if (plan === "basic") return <Shield className="w-4 h-4 text-blue-500" />;
    return <Users className="w-4 h-4 text-gray-500" />;
  };

  const getPlanBadgeStyle = (plan: string) => {
    if (plan === "premium") return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400";
    if (plan === "basic") return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    return "bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-400";
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'pending_verification':
        return 'Pending';
      case 'suspended':
        return 'Suspended';
      case 'deactivated':
        return 'Deactivated';
      default:
        return 'Unknown';
    }
  };

  const buildDropdownGroups = (patient: any) => [
    {
      items: [
        {
          label: "View Profile",
          icon: <Eye size={16} />,
          onClick: () => {
            console.log("Navigating to view profile for:", patient.id);
            props.onPatientView(patient.id);
          },
          closeOnClick: true,
        },
        {
          label: "Edit Patient",
          icon: <Edit size={16} />,
          onClick: () => {
            console.log("Navigating to edit patient for:", patient.id);
            props.onPatientEdit(patient.id);
          },
          closeOnClick: true,
        },
        {
          label: "Reset Password",
          icon: <Key size={16} />,
          onClick: () => {
            console.log("Reset password for:", patient.id);
            if (window.confirm(`Reset password for ${patient.name}? A new temporary password will be sent to ${patient.email}.`)) {
              props.onPasswordReset(patient.id);
            }
          },
          closeOnClick: true,
        },
      ],
    },
    {
      items: [
        {
          label: patient.accountStatus === 'active' ? "Suspend Patient" : "Activate Patient",
          icon: patient.accountStatus === 'active' ? <UserX size={16} /> : <UserCheck size={16} />,
          onClick: () => {
            console.log("Toggle status for:", patient.id);
            const newStatus = patient.accountStatus === 'active' ? 'suspended' : 'active';
            props.onStatusChange(patient.id, newStatus as AccountStatus, 'Admin action');
          },
          variant: patient.accountStatus === 'active' ? ("warning" as const) : ("default" as const),
          closeOnClick: true,
        },
      ],
    },
  ];

  if (props.isLoading) {
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

  if (!props.patients || props.patients.length === 0) {
    return (
      <div className="text-center py-16">
        <Users size={48} className="mx-auto mb-4 text-[color:var(--muted-foreground)]" />
        <h3 className="text-lg font-semibold text-[color:var(--foreground)] mb-2">No patients found</h3>
        <p className="text-[color:var(--muted-foreground)] mb-6">Get started by creating your first patient.</p>
        <button 
          className="px-4 py-2 bg-[color:var(--primary)] text-[color:var(--primary-foreground)] rounded-lg hover:bg-[color:var(--primary)]/90 transition-colors"
        >
          Add Patient
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {props.patients.map((patient, index) => (
        <div
          key={patient.id}
          className="group bg-[color:var(--card)] border border-[color:var(--border)] rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-[color:var(--primary)]/5 hover:border-[color:var(--primary)]/20 hover:-translate-y-1"
          style={{
            animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
          }}
        >
          <div className="flex items-center gap-6">
            {/* Avatar & Basic Info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="relative">
                {patient.avatarUrl ? (
                  <img
                    src={patient.avatarUrl}
                    alt={patient.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-[color:var(--border)] group-hover:border-[color:var(--primary)]/30 transition-colors"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[color:var(--primary)]/20 to-[color:var(--primary)]/5 border-2 border-[color:var(--border)] flex items-center justify-center group-hover:border-[color:var(--primary)]/30 transition-colors">
                    <Users className="w-6 h-6 text-[color:var(--primary)]" />
                  </div>
                )}
                
                {/* Online indicator for active patients */}
                {patient.accountStatus === 'active' && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-[color:var(--card)] rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-[color:var(--foreground)] truncate group-hover:text-[color:var(--primary)] transition-colors">
                    {patient.name || 'Unknown Patient'}
                  </h3>
                  {getPlanIcon(patient.subscriptionPlan || 'free')}
                  {patient.subscriptionPlan === "premium" && (
                    <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
                  )}
                  {patient.twoFactorEnabled && (
                    <Shield className="w-4 h-4 text-green-500" />
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-[color:var(--muted-foreground)]">
                  <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    <span className="truncate max-w-48">{patient.email || 'No email'}</span>
                  </div>
                  {patient.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      <span>{patient.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Subscription Plan */}
            <div className="flex flex-col items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getPlanBadgeStyle(patient.subscriptionPlan || 'free')}`}>
                {getPlanIcon(patient.subscriptionPlan || 'free')}
                {(patient.subscriptionPlan || 'free').charAt(0).toUpperCase() + (patient.subscriptionPlan || 'free').slice(1)}
              </span>
            </div>

            {/* Status Badge */}
            <div className="flex flex-col items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(patient.accountStatus)}`}>
                <div className={`w-2 h-2 rounded-full ${
                  patient.accountStatus === 'active' ? 'bg-emerald-500' : 
                  patient.accountStatus === 'pending_verification' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`} />
                {getStatusLabel(patient.accountStatus)}
              </span>
              {/* Email verification indicator */}
              <div className="flex items-center gap-1 text-xs">
                {patient.emailVerified ? (
                  <span className="text-emerald-600">✓ Verified</span>
                ) : (
                  <span className="text-red-600">✗ Unverified</span>
                )}
              </div>
            </div>

            {/* Activity Info */}
            <div className="hidden lg:flex flex-col items-center gap-1 min-w-32">
              <div className="flex items-center gap-1.5 text-xs text-[color:var(--muted-foreground)]">
                <Activity className="w-3 h-3" />
                <span>Last Active</span>
              </div>
              <span className="text-sm font-medium text-[color:var(--foreground)]">
                {patient.lastLogin ? formatDate(patient.lastLogin) : "Never"}
              </span>
              {patient.usageMetrics && (
                <div className="text-xs text-[color:var(--muted-foreground)]">
                  {patient.usageMetrics.appointmentsBooked || 0} appointments
                </div>
              )}
            </div>

            {/* Join Date */}
            <div className="hidden xl:flex flex-col items-center gap-1 min-w-24">
              <div className="flex items-center gap-1.5 text-xs text-[color:var(--muted-foreground)]">
                <Calendar className="w-3 h-3" />
                <span>Joined</span>
              </div>
              <span className="text-sm font-medium text-[color:var(--foreground)]">
                {formatDate(patient.createdAt)}
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
                groups={buildDropdownGroups(patient)}
                align="end"
              />
            </div>
          </div>

          {/* Mobile Info */}
          <div className="lg:hidden mt-4 pt-4 border-t border-[color:var(--border)] flex justify-between text-sm">
            <span className="text-[color:var(--muted-foreground)]">Created: {formatDate(patient.createdAt)}</span>
            <span className="text-[color:var(--muted-foreground)]">
              Last Active: {patient.lastLogin ? formatDate(patient.lastLogin) : "Never"}
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