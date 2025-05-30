"use client";

import React from "react";
import AdminViewPresentation from "../components/AdminViewPresentation";
import { useAdmin } from "../hooks/use-admin-queries";

interface AdminViewContainerProps {
  adminId: string;
}

export default function AdminViewContainer({ adminId }: AdminViewContainerProps) {
  // Fetch admin data
  const { data: admin, isLoading, isError, error } = useAdmin(adminId);

  return (
    <AdminViewPresentation
      admin={admin || null}
      isLoading={isLoading}
      isError={isError}
      error={error}
      adminId={adminId}
    />
  );
}