"use client";

import React from "react";
import {
  MoreVertical,
  Eye,
  Edit,
  Shield,
  Key,
  UserX,
  UserCheck,
  UserMinus,
  LogOut
} from "lucide-react";
import { Patient, AccountStatus } from "../types/user.types";
import ActionMenu from "../../../components/common/ActionMenu";

interface PatientActionMenuProps {
  patient: Patient;
  onView: () => void;
  onEdit: () => void;
  onStatusChange: (id: string, status: AccountStatus, reason?: string) => void;
  onPasswordReset: () => void;
  onImpersonate: () => void;
  onTerminateSessions: () => void;
}

export default function PatientActionMenu({
  patient,
  onView,
  onEdit,
  onStatusChange,
  onPasswordReset,
  onImpersonate,
  onTerminateSessions
}: PatientActionMenuProps) {
  const canModifyPatient = (patient: Patient) => {
    // Add permission logic here if needed
    return true;
  };

  const canDeletePatient = (patient: Patient) => {
    // Add permission logic here if needed
    return patient.accountStatus !== 'active';
  };

  return (
    <div className="relative">
      <ActionMenu
        disabled={!canModifyPatient(patient)}
        groups={[
          {
            items: [
              {
                label: "View Patient",
                icon: <Eye className="w-4 h-4" />,
                onClick: onView,
              },
              {
                label: "Edit Patient",
                icon: <Edit className="w-4 h-4" />,
                onClick: onEdit,
              },
              {
                label: patient.accountStatus === 'active' ? "Suspend" : "Activate",
                icon: patient.accountStatus === 'active' ? (
                  <UserMinus className="w-4 h-4" />
                ) : (
                  <UserCheck className="w-4 h-4" />
                ),
                onClick: () =>
                  onStatusChange(
                    patient.id, 
                    (patient.accountStatus === 'active' ? 'suspended' : 'active') as AccountStatus,
                    'Admin action'
                  ),
              },
              {
                label: "Reset Password",
                icon: <Key className="w-4 h-4" />,
                onClick: onPasswordReset,
              },
            ],
          },
          {
            items: [
              {
                label: "Impersonate Patient",
                icon: <Shield className="w-4 h-4" />,
                onClick: onImpersonate,
                isDestructive: false,
              },
              {
                label: "Terminate Sessions",
                icon: <LogOut className="w-4 h-4" />,
                onClick: onTerminateSessions,
                isDestructive: true,
              },
            ],
            showDivider: true,
          },
          canDeletePatient(patient)
            ? {
                items: [
                  {
                    label: "Deactivate Patient",
                    icon: <UserX className="w-4 h-4" />,
                    onClick: () => onStatusChange(patient.id, 'deactivated' as AccountStatus, 'Admin deactivation'),
                    isDestructive: true,
                  },
                ],
                showDivider: true,
              }
            : { items: [] },
        ]}
        triggerIcon={<MoreVertical className="w-4 h-4" />}
        triggerClassName="p-1 rounded-md hover:bg-[color:var(--navbar-item-hover)] transition-colors"
        id={`patient-action-menu-${patient.id}`}
      />
    </div>
  );
}