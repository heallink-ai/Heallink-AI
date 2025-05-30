"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import AdminListPresentation from "../components/AdminListPresentation";
import { useAdmins, useDeactivateAdmin, useActivateAdmin, useResetAdminPassword } from "../hooks/use-admin-queries";
import { AdminQueryParams, UserRole } from "../types/admin.types";

export default function AdminListContainer() {
  const router = useRouter();
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Build query parameters
  const queryParams: AdminQueryParams = useMemo(() => {
    const params: AdminQueryParams = {
      page: currentPage,
      limit: pageSize,
      sortBy: "createdAt",
      sortOrder: "desc",
    };

    // Add search if provided
    if (searchTerm.trim()) {
      params.search = searchTerm.trim();
    }

    // Add role filter if not "All"
    if (roleFilter !== "All" && roleFilter === "Admin") {
      params.role = UserRole.ADMIN;
    }

    return params;
  }, [currentPage, pageSize, searchTerm, roleFilter]);

  // Fetch admins using our custom hook with pagination
  const { data: adminResponse, isLoading, isError, error, refetch } = useAdmins(queryParams);
  
  // Mutation hooks for activating/deactivating admins
  const deactivateAdminMutation = useDeactivateAdmin();
  const activateAdminMutation = useActivateAdmin();
  const resetPasswordMutation = useResetAdminPassword();

  // Get admins from response
  const admins = adminResponse?.admins || [];
  const totalAdmins = adminResponse?.total || 0;
  const totalPages = adminResponse?.totalPages || 1;

  // Filter admins based on status (client-side for now since API doesn't have status filter yet)
  const filteredAdmins = useMemo(() => {
    return admins.filter((admin) => {
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" && admin.status === "active") ||
        (statusFilter === "Inactive" && admin.status === "inactive");

      return matchesStatus;
    });
  }, [admins, statusFilter]);

  // Event handlers
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusToggle = (id: string, currentStatus: string) => {
    if (currentStatus.toLowerCase() === "active") {
      deactivateAdminMutation.mutate(id, {
        onError: (error) => {
          console.error("Failed to deactivate admin:", error);
          // You could show a toast notification here
        },
      });
    } else {
      activateAdminMutation.mutate(id, {
        onError: (error) => {
          console.error("Failed to activate admin:", error);
          // You could show a toast notification here
        },
      });
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleResetPassword = (id: string) => {
    resetPasswordMutation.mutate(id, {
      onSuccess: (response) => {
        alert(response.message || 'Password reset email sent successfully!');
      },
      onError: (error) => {
        console.error("Failed to reset password:", error);
        alert('Failed to reset password. Please try again.');
      },
    });
  };

  return (
    <AdminListPresentation
      admins={filteredAdmins}
      totalAdmins={totalAdmins}
      currentPage={currentPage}
      totalPages={totalPages}
      isLoading={isLoading}
      isError={isError}
      error={error}
      searchTerm={searchTerm}
      roleFilter={roleFilter}
      statusFilter={statusFilter}
      queryParams={queryParams}
      onSearchChange={handleSearchChange}
      onRoleFilterChange={handleRoleFilterChange}
      onStatusFilterChange={handleStatusFilterChange}
      onPageChange={handlePageChange}
      onStatusToggle={handleStatusToggle}
      onResetPassword={handleResetPassword}
      onRefresh={handleRefresh}
    />
  );
}