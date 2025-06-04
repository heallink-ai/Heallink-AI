"use client";

import { useQuery } from "@tanstack/react-query";
import { Users, UserCheck, Calendar, TrendingUp, AlertCircle } from "lucide-react";
import { fetchProviderStaff } from "../../api/staff-api";
import StatsCard from "./StatsCard";
import RecentActivity from "./RecentActivity";
import QuickActions from "./QuickActions";
import LoadingSpinner from "../ui/LoadingSpinner";

// Import chart components
import RevenueChart from "./charts/RevenueChart";
import PatientDemographicsChart from "./charts/PatientDemographicsChart";
import PerformanceRadarChart from "./charts/PerformanceRadarChart";
import AppointmentTrendsChart from "./charts/AppointmentTrendsChart";
import StaffHeatmapChart from "./charts/StaffHeatmapChart";

export default function DashboardOverview() {
  const { data: staffData, isLoading, error } = useQuery({
    queryKey: ["provider-staff"],
    queryFn: () => fetchProviderStaff(1, 100),
    retry: 3,
    retryDelay: 1000,
  });

  const totalStaff = staffData?.data?.total || 0;
  const doctors = staffData?.data?.staff?.filter(s => s.role === "doctor").length || 0;
  const activeStaff = staffData?.data?.staff?.filter(s => s.isActive).length || 0;

  const stats = [
    {
      title: "Total Staff",
      value: totalStaff.toString(),
      icon: Users,
      change: "+2.5%",
      changeType: "positive" as const,
    },
    {
      title: "Active Doctors",
      value: doctors.toString(),
      icon: UserCheck,
      change: "+1.2%",
      changeType: "positive" as const,
    },
    {
      title: "Today's Appointments",
      value: "24",
      icon: Calendar,
      change: "+5.4%",
      changeType: "positive" as const,
    },
    {
      title: "Monthly Revenue",
      value: "$12,450",
      icon: TrendingUp,
      change: "+8.2%",
      changeType: "positive" as const,
    },
  ];

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h3 className="text-lg font-semibold text-foreground">Unable to load dashboard data</h3>
          <p className="text-muted-foreground">Please check your connection and try again.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold gradient-text">Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          Welcome back! Here's what's happening with your practice today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} isLoading={isLoading} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="space-y-8">
        {/* Revenue and Demographics Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <RevenueChart />
          </div>
          <div className="xl:col-span-1">
            <PatientDemographicsChart />
          </div>
        </div>

        {/* Performance and Trends Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <PerformanceRadarChart />
          <AppointmentTrendsChart />
        </div>

        {/* Staff Performance Heatmap */}
        <div className="grid grid-cols-1 gap-8">
          <StaffHeatmapChart />
        </div>
      </div>

      {/* Original content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Quick actions */}
        <div className="xl:col-span-1 space-y-6">
          <QuickActions />
        </div>
        
        {/* Recent activity */}
        <div className="xl:col-span-2">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}