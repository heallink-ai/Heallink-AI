"use client";

import React, { useState, useEffect } from "react";
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
  const [isMobileView, setIsMobileView] = useState(false);
  const { status } = useSession();
  const router = useRouter();

  // Monitor screen size for mobile vs desktop view
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 768);
      // Auto-collapse sidebar on small screens
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Handle authentication redirects using useEffect
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Show loading state while checking authentication
  if (status === "loading") {
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

  // Return null early (blank page) while redirecting
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[color:var(--primary)] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-[color:var(--muted-foreground)]">
            Redirecting...
          </p>
        </div>
      </div>
    );
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="flex flex-col md:flex-row min-h-screen w-full relative">
        {/* Sidebar - mobile: fixed with overlay, desktop: part of the flex layout */}
        <div
          className={`${
            isMobileView
              ? `fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${
                  sidebarCollapsed ? "-translate-x-full" : "translate-x-0"
                }`
              : "sticky top-0 h-screen overflow-y-auto flex-shrink-0"
          } ${sidebarCollapsed && !isMobileView ? "w-[64px]" : "w-[240px]"}`}
        >
          <Sidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
        </div>

        {/* Overlay for mobile sidebar */}
        {isMobileView && !sidebarCollapsed && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={toggleSidebar}
          />
        )}

        {/* Main content - flex-grow to take remaining space */}
        <div className="flex-1 flex flex-col min-w-0 w-full">
          {/* Header */}
          <Header toggleSidebar={toggleSidebar} />

          {/* Main content wrapper */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {/* Breadcrumbs */}
            <Breadcrumbs />

            {/* Page content - ensure scrolling */}
            <main className="flex-1 overflow-auto p-4 sm:px-6 sm:py-4 min-w-0 w-full">
              <div className="max-w-full">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
