"use client";

import {
  Activity,
  Calendar,
  CheckCircle,
  CreditCard,
  Crown,
  Edit,
  Eye,
  FileText,
  History,
  Key,
  LogOut,
  Mail,
  MoreVertical,
  Phone,
  Settings,
  Shield,
  Sparkles,
  UserCheck,
  UserPlus,
  Users,
  UserX,
  XCircle,
} from "lucide-react";
import DropdownMenu from "../../../components/ui/DropdownMenu";
import {
  AccountStatus,
  PatientListPresentationProps,
} from "../types/user.types";

export default function PatientTable(props: PatientListPresentationProps) {
  const formatDate = (dateString: string | Date) => {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400";
      case "pending_verification":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400";
      case "suspended":
        return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
      case "deactivated":
        return "bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-400";
    }
  };

  const getInsuranceStatusColor = (status?: string) => {
    switch (status) {
      case "verified":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400";
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400";
      case "rejected":
      case "expired":
        return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
      case "not_provided":
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-400";
    }
  };

  const getPlanIcon = (plan: string) => {
    if (plan === "premium")
      return <Crown className="w-4 h-4 text-purple-500" />;
    if (plan === "basic") return <Shield className="w-4 h-4 text-blue-500" />;
    return <Users className="w-4 h-4 text-gray-500" />;
  };

  const getPlanBadgeStyle = (plan: string) => {
    if (plan === "premium")
      return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400";
    if (plan === "basic")
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    return "bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-400";
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "pending_verification":
        return "Pending";
      case "suspended":
        return "Suspended";
      case "deactivated":
        return "Deactivated";
      default:
        return "Unknown";
    }
  };

  const getInsuranceStatusLabel = (status?: string) => {
    switch (status) {
      case "verified":
        return "Verified";
      case "pending":
        return "Pending";
      case "rejected":
        return "Rejected";
      case "expired":
        return "Expired";
      case "not_provided":
      default:
        return "Not Provided";
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
          label: "View Activity Log",
          icon: <History size={16} />,
          onClick: () => {
            console.log("View activity log for:", patient.id);
            // TODO: Implement activity log view
          },
          closeOnClick: true,
        },
        {
          label: "Medical Records",
          icon: <FileText size={16} />,
          onClick: () => {
            console.log("View medical records for:", patient.id);
            // TODO: Implement medical records view
          },
          closeOnClick: true,
        },
      ],
    },
    {
      items: [
        {
          label: "Reset Password",
          icon: <Key size={16} />,
          onClick: () => {
            console.log("Reset password for:", patient.id);
            if (
              window.confirm(
                `Reset password for ${patient.name}? A new temporary password will be sent to ${patient.email}.`
              )
            ) {
              props.onPasswordReset(patient.id);
            }
          },
          closeOnClick: true,
        },
        {
          label: "Manage Insurance",
          icon: <CreditCard size={16} />,
          onClick: () => {
            console.log("Manage insurance for:", patient.id);
            // TODO: Implement insurance management
          },
          closeOnClick: true,
        },
        {
          label: "Account Settings",
          icon: <Settings size={16} />,
          onClick: () => {
            console.log("Account settings for:", patient.id);
            // TODO: Implement account settings
          },
          closeOnClick: true,
        },
      ],
    },
    {
      items: [
        {
          label:
            patient.accountStatus === "active"
              ? "Suspend Patient"
              : "Activate Patient",
          icon:
            patient.accountStatus === "active" ? (
              <UserX size={16} />
            ) : (
              <UserCheck size={16} />
            ),
          onClick: () => {
            console.log("Toggle status for:", patient.id);
            const newStatus =
              patient.accountStatus === "active" ? "suspended" : "active";
            props.onStatusChange(
              patient.id,
              newStatus as AccountStatus,
              "Admin action"
            );
          },
          variant:
            patient.accountStatus === "active"
              ? ("warning" as const)
              : ("default" as const),
          closeOnClick: true,
        },
        {
          label: "Impersonate Patient",
          icon: <UserPlus size={16} />,
          onClick: () => {
            console.log("Impersonate patient:", patient.id);
            if (
              window.confirm(
                `Impersonate ${patient.name}? This will log you in as this patient.`
              )
            ) {
              props.onImpersonate(patient.id);
            }
          },
          variant: "warning" as const,
          closeOnClick: true,
        },
        {
          label: "Force Logout",
          icon: <LogOut size={16} />,
          onClick: () => {
            console.log("Terminate sessions for:", patient.id);
            if (
              window.confirm(`Force logout all sessions for ${patient.name}?`)
            ) {
              props.onTerminateSessions(patient.id);
            }
          },
          variant: "destructive" as const,
          closeOnClick: true,
        },
      ],
    },
  ];

  if (props.isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-[color:var(--card)] border border-[color:var(--border)] rounded-2xl p-6 animate-pulse"
          >
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
        <Users
          size={48}
          className="mx-auto mb-4 text-[color:var(--muted-foreground)]"
        />
        <h3 className="text-lg font-semibold text-[color:var(--foreground)] mb-2">
          No patients found
        </h3>
        <p className="text-[color:var(--muted-foreground)] mb-6">
          Get started by creating your first patient.
        </p>
        <button className="px-4 py-2 bg-[color:var(--primary)] text-[color:var(--primary-foreground)] rounded-lg hover:bg-[color:var(--primary)]/90 transition-colors">
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
            {/* User ID & Avatar */}
            <div className="flex items-center gap-4 min-w-0">
              <div className="text-xs font-mono text-[color:var(--muted-foreground)] min-w-16">
                #{patient.id.slice(-8).toUpperCase()}
              </div>
              <div className="relative">
                {patient.avatarUrl ? (
                  <img
                    src={patient.avatarUrl}
                    alt={patient.name}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-[color:var(--border)] group-hover:border-[color:var(--primary)]/30 transition-colors"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[color:var(--primary)]/20 to-[color:var(--primary)]/5 border-2 border-[color:var(--border)] flex items-center justify-center group-hover:border-[color:var(--primary)]/30 transition-colors">
                    <Users className="w-5 h-5 text-[color:var(--primary)]" />
                  </div>
                )}

                {/* Online indicator for active patients */}
                {patient.accountStatus === "active" && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[color:var(--card)] rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  </div>
                )}
              </div>
            </div>

            {/* Basic Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-semibold text-[color:var(--foreground)] truncate group-hover:text-[color:var(--primary)] transition-colors">
                  {patient.name || "Unknown Patient"}
                </h3>
                {getPlanIcon(patient.subscriptionPlan || "free")}
                {patient.subscriptionPlan === "premium" && (
                  <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-[color:var(--muted-foreground)]">
                <div className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  <span className="truncate max-w-48">
                    {patient.email || "No email"}
                  </span>
                  {patient.emailVerified && (
                    <CheckCircle className="w-3 h-3 text-green-500" />
                  )}
                </div>
                {patient.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>{patient.phone}</span>
                    {patient.phoneVerified && (
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Account Status */}
            <div className="flex flex-col items-center gap-1 min-w-24">
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.accountStatus)}`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    patient.accountStatus === "active"
                      ? "bg-emerald-500"
                      : patient.accountStatus === "pending_verification"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                />
                {getStatusLabel(patient.accountStatus)}
              </span>
            </div>

            {/* Insurance Status */}
            <div className="flex flex-col items-center gap-1 min-w-20">
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${getInsuranceStatusColor(patient.insurance?.status)}`}
              >
                <CreditCard className="w-3 h-3" />
                {getInsuranceStatusLabel(patient.insurance?.status)}
              </span>
            </div>

            {/* Two-Factor Auth */}
            <div className="flex flex-col items-center gap-1 min-w-16">
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                  patient.twoFactorEnabled
                    ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-400"
                }`}
              >
                {patient.twoFactorEnabled ? (
                  <>
                    <Shield className="w-3 h-3" />
                    Enabled
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3" />
                    Disabled
                  </>
                )}
              </span>
            </div>

            {/* Join Date */}
            <div className="hidden lg:flex flex-col items-center gap-1 min-w-20">
              <div className="flex items-center gap-1 text-xs text-[color:var(--muted-foreground)]">
                <Calendar className="w-3 h-3" />
                <span>Joined</span>
              </div>
              <span className="text-sm font-medium text-[color:var(--foreground)]">
                {formatDate(patient.createdAt)}
              </span>
            </div>

            {/* Last Login */}
            <div className="hidden xl:flex flex-col items-center gap-1 min-w-24">
              <div className="flex items-center gap-1 text-xs text-[color:var(--muted-foreground)]">
                <Activity className="w-3 h-3" />
                <span>Last Active</span>
              </div>
              <span className="text-sm font-medium text-[color:var(--foreground)]">
                {patient.lastLogin ? formatDate(patient.lastLogin) : "Never"}
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
          <div className="lg:hidden mt-4 pt-4 border-t border-[color:var(--border)] grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-[color:var(--muted-foreground)]">ID: </span>
              <span className="font-mono">
                #{patient.id.slice(-8).toUpperCase()}
              </span>
            </div>
            <div>
              <span className="text-[color:var(--muted-foreground)]">
                2FA:{" "}
              </span>
              <span
                className={
                  patient.twoFactorEnabled ? "text-green-600" : "text-red-600"
                }
              >
                {patient.twoFactorEnabled ? "Enabled" : "Disabled"}
              </span>
            </div>
            <div>
              <span className="text-[color:var(--muted-foreground)]">
                Insurance:{" "}
              </span>
              <span>{getInsuranceStatusLabel(patient.insurance?.status)}</span>
            </div>
            <div>
              <span className="text-[color:var(--muted-foreground)]">
                Last Active:{" "}
              </span>
              <span>
                {patient.lastLogin ? formatDate(patient.lastLogin) : "Never"}
              </span>
            </div>
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
