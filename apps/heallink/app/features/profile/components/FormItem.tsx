"use client";

import React, { ReactNode } from "react";

interface FormItemProps {
  label: string;
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
  description?: string;
}

export function FormItem({
  label,
  htmlFor,
  children,
  required = false,
  description,
}: FormItemProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={htmlFor} className="text-sm font-medium">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      </div>

      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      {children}
    </div>
  );
}
