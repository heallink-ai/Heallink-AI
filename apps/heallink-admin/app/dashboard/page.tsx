"use client";

import { useState, useEffect } from "react";
import MetricCard from "../components/dashboard/MetricCard";
import UserStatsChart from "../components/dashboard/UserStatsChart";
import GeospatialMap from "../components/dashboard/GeospatialMap";
import AlertsFeed from "../components/dashboard/AlertsFeed";
import RecentUsersWidget from "../components/users/RecentUsersWidget";
import {
  Users,
  Building2,
  CalendarCheck,
  DollarSign,
  FileText,
  Stethoscope,
  PieChart,
  Activity,
} from "lucide-react";

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-[color:var(--muted-foreground)]">
            Welcome to the Heallink Admin Dashboard
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="text-sm rounded-lg px-3 py-2 bg-[color:var(--input)] border border-[color:var(--border)] focus:outline-none focus:ring-1 focus:ring-[color:var(--ring)]"
            defaultValue="week"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="rounded-lg px-4 py-2 bg-[color:var(--primary)] text-white text-sm font-medium hover:bg-[color:var(--primary-foreground)]/90 transition-colors">
            Export
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value="1,248"
          icon={<Users size={24} />}
          trend={{ value: 12.5, timeframe: "vs. last month", isPositive: true }}
          color="primary"
        />
        <MetricCard
          title="Active Providers"
          value="76"
          icon={<Building2 size={24} />}
          trend={{ value: 8.2, timeframe: "vs. last month", isPositive: true }}
          color="secondary"
        />
        <MetricCard
          title="Appointments Today"
          value="42"
          icon={<CalendarCheck size={24} />}
          trend={{ value: 3.1, timeframe: "vs. yesterday", isPositive: false }}
        />
        <MetricCard
          title="Revenue This Month"
          value="$28,450"
          icon={<DollarSign size={24} />}
          trend={{ value: 15.8, timeframe: "vs. last month", isPositive: true }}
          color="success"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UserStatsChart />
        </div>
        <div className="lg:col-span-1">
          <AlertsFeed />
        </div>
      </div>

      {/* User Management and Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <RecentUsersWidget />
        </div>
        <div className="lg:col-span-2">
          <GeospatialMap />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-[color:var(--card)] rounded-xl p-5 h-full neumorph-flat">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-semibold">Platform Stats</h2>
              <button className="text-xs text-[color:var(--primary)]">
                View All
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-md bg-[color:var(--primary)]/10 flex items-center justify-center">
                    <Stethoscope className="w-4 h-4 text-[color:var(--primary)]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      Healthcare Providers
                    </div>
                    <div className="text-xs text-[color:var(--muted-foreground)]">
                      Total onboarded
                    </div>
                  </div>
                </div>
                <div className="text-sm font-semibold">76</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-md bg-[color:var(--secondary)]/10 flex items-center justify-center">
                    <PieChart className="w-4 h-4 text-[color:var(--secondary)]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">System Uptime</div>
                    <div className="text-xs text-[color:var(--muted-foreground)]">
                      Last 30 days
                    </div>
                  </div>
                </div>
                <div className="text-sm font-semibold">99.98%</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-md bg-[color:var(--success)]/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-[color:var(--success)]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Prescriptions</div>
                    <div className="text-xs text-[color:var(--muted-foreground)]">
                      Process today
                    </div>
                  </div>
                </div>
                <div className="text-sm font-semibold">156</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-md bg-[color:var(--warning)]/10 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-[color:var(--warning)]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">API Response Time</div>
                    <div className="text-xs text-[color:var(--muted-foreground)]">
                      Average
                    </div>
                  </div>
                </div>
                <div className="text-sm font-semibold">186ms</div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[color:var(--border)]">
              <h3 className="text-sm font-medium mb-3">Recent Updates</h3>
              <div className="space-y-3">
                <div className="text-xs">
                  <p className="text-[color:var(--foreground)]">
                    System update completed
                  </p>
                  <p className="text-[color:var(--muted-foreground)]">
                    15 minutes ago
                  </p>
                </div>
                <div className="text-xs">
                  <p className="text-[color:var(--foreground)]">
                    New provider API endpoints deployed
                  </p>
                  <p className="text-[color:var(--muted-foreground)]">
                    3 hours ago
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
