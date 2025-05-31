"use client";

import React from "react";
import { CheckCircle, Clock, AlertCircle, XCircle, Shield } from "lucide-react";
import { AccountStatus } from "../types/user.types";

interface PatientStatusBadgeProps {
  status: AccountStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export default function PatientStatusBadge({ 
  status, 
  size = 'md', 
  showIcon = true 
}: PatientStatusBadgeProps) {
  const getStatusConfig = (status: AccountStatus) => {
    switch (status) {
      case 'active':
        return {
          label: 'Active',
          icon: CheckCircle,
          colors: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
          iconColor: 'text-[color:var(--success)]'
        };
      case 'pending_verification':
        return {
          label: 'Pending',
          icon: Clock,
          colors: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
          iconColor: 'text-[color:var(--warning)]'
        };
      case 'suspended':
        return {
          label: 'Suspended',
          icon: AlertCircle,
          colors: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
          iconColor: 'text-[color:var(--error)]'
        };
      case 'deactivated':
        return {
          label: 'Deactivated',
          icon: XCircle,
          colors: 'bg-[color:var(--muted)]/10 text-[color:var(--muted-foreground)]',
          iconColor: 'text-[color:var(--muted-foreground)]'
        };
      default:
        return {
          label: 'Unknown',
          icon: Shield,
          colors: 'bg-[color:var(--muted)]/10 text-[color:var(--muted-foreground)]',
          iconColor: 'text-[color:var(--muted-foreground)]'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3 h-3', 
    lg: 'w-4 h-4'
  };

  return (
    <div className={`
      inline-flex items-center gap-1.5 rounded-full font-medium
      ${config.colors} 
      ${sizeClasses[size]}
      transition-colors
    `}>
      {showIcon && (
        <Icon className={`${iconSizes[size]} ${config.iconColor}`} />
      )}
      <span>{config.label}</span>
    </div>
  );
}