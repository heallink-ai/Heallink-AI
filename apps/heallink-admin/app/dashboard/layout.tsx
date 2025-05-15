"use client";

import React, { useState } from "react";
import Header from "../components/dashboard/Header";
import Sidebar from "../components/dashboard/Sidebar";
import Breadcrumbs from "../components/dashboard/Breadcrumbs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { status } = useSession();
  const router = useRouter();

  // Redirect to login if user is not authenticated
  if (status === "loading") {
    // Show loading state
    return (
      <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[color:var(--primary)] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-[color:var(--muted-foreground)]">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full z-20 transition-all duration-300 ${
            sidebarCollapsed ? "w-[64px]" : "w-[240px]"
          }`}
        >
          <Sidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
        </div>

        {/* Main content */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            sidebarCollapsed ? "ml-[64px]" : "ml-[240px]"
          }`}
        >
          {/* Header */}
          <Header toggleSidebar={toggleSidebar} />

          {/* Main content wrapper */}
          <div className="flex-1 overflow-auto">
            {/* Breadcrumbs */}
            <Breadcrumbs />

            {/* Page content */}
            <main className="px-6 py-4">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}
