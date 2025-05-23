"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import AdminManagementContainer from "../../features/admin-management/containers/AdminManagementContainer";
import { UserRole } from "../../features/admin-management/types/admin.types";

export default function AdminManagementPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[color:var(--primary)]"></div>
      </div>
    );
  }

  if (!session?.user) {
    redirect("/");
  }

  // Type-safe user session handling
  const currentUser = {
    id: session.user.id || "",
    role: (session.user.role as UserRole) || UserRole.USER,
    name: session.user.name || "",
  };

  // Only admins can access this page
  if (currentUser.role !== UserRole.ADMIN) {
    redirect("/dashboard");
  }

  return <AdminManagementContainer currentUser={currentUser} />;
}
