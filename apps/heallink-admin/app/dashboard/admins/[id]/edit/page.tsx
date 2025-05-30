"use client";

import { useSession } from "next-auth/react";
import { redirect, useParams, useRouter } from "next/navigation";
import { AdminFormContainer, useAdmin } from "../../../../features/admin-management";

export default function EditAdminPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const adminId = params.id as string;

  // Fetch admin data for editing
  const { data: admin, isLoading } = useAdmin(adminId);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[color:var(--primary)]"></div>
      </div>
    );
  }

  if (!session?.user) {
    redirect("/");
  }

  // Only admins can access this page
  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  const handleSuccess = () => {
    router.push("/dashboard/admins");
  };

  return (
    <AdminFormContainer 
      admin={admin}
      isEdit={true}
      onSuccess={handleSuccess}
    />
  );
}