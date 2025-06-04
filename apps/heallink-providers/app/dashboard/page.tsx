"use client";

import { Suspense } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import DashboardOverview from "../components/dashboard/DashboardOverview";
import LoadingSpinner from "../components/ui/LoadingSpinner";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      }>
        <DashboardOverview />
      </Suspense>
    </DashboardLayout>
  );
}