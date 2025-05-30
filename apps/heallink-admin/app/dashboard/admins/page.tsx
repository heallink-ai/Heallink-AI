"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { AdminListContainer } from "../../features/admin-management";

export default function AdminsPage() {
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

  // Only admins can access this page
  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return <AdminListContainer />;
}
