"use client";

import React, { useState } from "react";
import { Plus, Upload, Download, MoreHorizontal, FileUp, FileDown, UserPlus, Calendar, Mail, Bell } from "lucide-react";

interface PatientQuickActionsProps {
  onImport?: () => void;
  onExport?: () => void;
}

export default function PatientQuickActions({ onImport, onExport }: PatientQuickActionsProps) {
  const [showMore, setShowMore] = useState(false);

  const primaryActions = [
    {
      label: "Add Patient",
      icon: Plus,
      onClick: () => console.log("Add patient"),
      variant: "primary" as const,
      description: "Create new patient record"
    },
    {
      label: "Import",
      icon: Upload, 
      onClick: onImport,
      variant: "secondary" as const,
      description: "Import from CSV/Excel"
    },
    {
      label: "Export",
      icon: Download,
      onClick: onExport, 
      variant: "secondary" as const,
      description: "Export patient data"
    }
  ];

  const moreActions = [
    {
      label: "Bulk Upload",
      icon: FileUp,
      onClick: () => console.log("Bulk upload"),
      description: "Upload multiple patient files"
    },
    {
      label: "Generate Report",
      icon: FileDown,
      onClick: () => console.log("Generate report"),
      description: "Create detailed analytics report"
    },
    {
      label: "Invite Patients",
      icon: UserPlus,
      onClick: () => console.log("Invite patients"),
      description: "Send registration invitations"
    },
    {
      label: "Schedule Bulk",
      icon: Calendar,
      onClick: () => console.log("Schedule bulk"),
      description: "Mass appointment scheduling"
    },
    {
      label: "Send Notifications",
      icon: Bell,
      onClick: () => console.log("Send notifications"),
      description: "Broadcast important updates"
    },
    {
      label: "Email Campaign",
      icon: Mail,
      onClick: () => console.log("Email campaign"),
      description: "Send targeted email campaigns"
    }
  ];

  return (
    <div className="flex items-center gap-2">
      {/* Primary Actions */}
      {primaryActions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          className={`group relative px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors ${
            action.variant === 'primary'
              ? 'bg-[color:var(--primary)] text-[color:var(--primary-foreground)] hover:bg-[color:var(--primary)]/90'
              : 'bg-[color:var(--muted)] text-[color:var(--foreground)] hover:bg-[color:var(--navbar-item-hover)]'
          }`}
        >
          <action.icon className="w-4 h-4" />
          <span className="hidden lg:inline">{action.label}</span>
        </button>
      ))}

      {/* More Actions Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowMore(!showMore)}
          className={`p-2.5 rounded-lg border border-[color:var(--border)] transition-colors ${
            showMore 
              ? 'bg-[color:var(--navbar-item-selected)]' 
              : 'bg-[color:var(--muted)] hover:bg-[color:var(--navbar-item-hover)]'
          }`}
        >
          <MoreHorizontal className="w-4 h-4 text-[color:var(--foreground)]" />
        </button>

        {/* Dropdown Menu */}
        {showMore && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowMore(false)}
            />
            
            {/* Dropdown Content */}
            <div className="absolute top-full right-0 mt-2 w-72 bg-[color:var(--card)] rounded-lg border border-[color:var(--border)] shadow-lg z-50 overflow-hidden">
              <div className="p-2">
                <div className="text-xs font-medium text-[color:var(--muted-foreground)] uppercase tracking-wide px-3 py-2">
                  More Actions
                </div>
                
                <div className="grid grid-cols-2 gap-1">
                  {moreActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        action.onClick();
                        setShowMore(false);
                      }}
                      className="group flex flex-col items-center gap-2 p-3 rounded-md hover:bg-[color:var(--navbar-item-hover)] transition-colors text-center"
                    >
                      <div className="p-2 bg-[color:var(--muted)] group-hover:bg-[color:var(--primary)]/10 rounded-md transition-colors">
                        <action.icon className="w-4 h-4 text-[color:var(--muted-foreground)] group-hover:text-[color:var(--primary)]" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[color:var(--foreground)]">{action.label}</div>
                        <div className="text-xs text-[color:var(--muted-foreground)] leading-tight">{action.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}