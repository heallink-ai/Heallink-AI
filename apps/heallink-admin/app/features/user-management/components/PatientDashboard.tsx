"use client";

import React, { useState, useMemo } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Upload,
  Users,
  Activity,
  Calendar,
  TrendingUp,
  ChevronDown,
  Sparkles,
  BarChart3,
  PieChart,
  Clock,
  MapPin,
  Star,
  AlertCircle
} from "lucide-react";
import { PatientListPresentationProps } from "../types/user.types";
import PatientStatsGrid from "./PatientStatsGrid";
import PatientTable from "./PatientTable";
import PatientFilters from "./PatientFilters";
import PatientSearch from "./PatientSearch";
import PatientQuickActions from "./PatientQuickActions";

export default function PatientDashboard(props: PatientListPresentationProps) {
  const [viewMode, setViewMode] = useState<'table' | 'grid' | 'analytics'>('table');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const statsData = useMemo(() => {
    const total = props.totalPatients || 0;
    const active = props.patients?.filter(p => p.accountStatus === 'active').length || 0;
    const pending = props.patients?.filter(p => p.accountStatus === 'pending_verification').length || 0;
    const suspended = props.patients?.filter(p => p.accountStatus === 'suspended').length || 0;
    
    return [
      {
        title: "Total Patients",
        value: total.toLocaleString(),
        change: "+12.5%",
        trend: "up" as const,
        icon: Users,
        color: "blue" as const,
        description: "Active patient base"
      },
      {
        title: "Active Patients",
        value: active.toLocaleString(),
        change: "+8.2%",
        trend: "up" as const, 
        icon: Activity,
        color: "green" as const,
        description: "Currently active"
      },
      {
        title: "New This Month",
        value: "156",
        change: "+23.1%",
        trend: "up" as const,
        icon: TrendingUp,
        color: "purple" as const,
        description: "New registrations"
      },
      {
        title: "Appointments Today",
        value: "24",
        change: "+5.3%",
        trend: "up" as const,
        icon: Calendar,
        color: "orange" as const,
        description: "Scheduled visits"
      }
    ];
  }, [props.patients, props.totalPatients]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="card-admin">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[color:var(--foreground)]">Patient Management</h1>
            <p className="text-[color:var(--muted-foreground)] mt-1">Manage and monitor your patient database</p>
          </div>
          <div className="flex items-center gap-2 bg-[color:var(--muted)] rounded-lg p-1">
            {[
              { mode: 'table', icon: BarChart3, label: 'Table' },
              { mode: 'grid', icon: PieChart, label: 'Grid' },
              { mode: 'analytics', icon: Activity, label: 'Analytics' }
            ].map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === mode
                    ? "bg-[color:var(--primary)] text-[color:var(--primary-foreground)]"
                    : "text-[color:var(--muted-foreground)] hover:bg-[color:var(--navbar-item-hover)] hover:text-[color:var(--foreground)]"
                }`}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <PatientStatsGrid stats={statsData} />
      </div>

      {/* Control Bar */}
      <div className="card-admin">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <PatientSearch 
              value={props.searchTerm}
              onChange={props.onSearchChange}
              placeholder="Search patients by name, email, or ID..."
            />
            
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className={`px-4 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors ${
                isFiltersOpen 
                  ? 'bg-[color:var(--primary)] text-[color:var(--primary-foreground)]' 
                  : 'bg-[color:var(--muted)] text-[color:var(--foreground)] hover:bg-[color:var(--navbar-item-hover)]'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>

          {/* Quick Actions */}
          <PatientQuickActions onImport={() => props.onImport?.()} onExport={() => props.onExport?.()} />
        </div>

        {/* Advanced Filters Panel */}
        {isFiltersOpen && (
          <div className="mt-6 pt-6 border-t border-[color:var(--border)]">
            <PatientFilters 
              filters={props.filters}
              onChange={(filters) => {
                Object.entries(filters).forEach(([key, value]) => {
                  props.onFilterChange(key, value);
                });
              }}
            />
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="space-y-4">
        {/* Loading State */}
        {props.isLoading && (
          <div className="card-admin">
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <div className="w-8 h-8 rounded-full border-2 border-[color:var(--muted)] animate-spin border-t-[color:var(--primary)]"></div>
              <p className="text-[color:var(--muted-foreground)] font-medium">Loading patient data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {props.isError && (
          <div className="card-admin">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[color:var(--error)]/10 rounded-full">
                <AlertCircle className="w-6 h-6 text-[color:var(--error)]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[color:var(--foreground)]">Unable to load patients</h3>
                <p className="text-[color:var(--muted-foreground)] mt-1">{(props.error as any)?.message || 'Please try again later.'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Patient Table */}
        {!props.isLoading && !props.isError && viewMode === 'table' && (
          <PatientTable {...props} />
        )}

        {/* Grid View Placeholder */}
        {!props.isLoading && !props.isError && viewMode === 'grid' && (
          <div className="card-admin">
            <div className="text-center py-12">
              <PieChart className="w-16 h-16 text-[color:var(--muted-foreground)] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[color:var(--foreground)] mb-2">Grid View</h3>
              <p className="text-[color:var(--muted-foreground)]">Grid view coming soon with enhanced patient cards</p>
            </div>
          </div>
        )}

        {/* Analytics View Placeholder */}
        {!props.isLoading && !props.isError && viewMode === 'analytics' && (
          <div className="card-admin">
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-[color:var(--muted-foreground)] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[color:var(--foreground)] mb-2">Analytics Dashboard</h3>
              <p className="text-[color:var(--muted-foreground)]">Advanced analytics and insights coming soon</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}