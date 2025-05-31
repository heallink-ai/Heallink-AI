"use client";

import React from "react";
import {
  User,
  Heart,
  Activity,
  Shield,
  FileText,
  Users,
  MessageSquare,
  Calendar as CalendarIcon,
  BarChart3,
  TrendingUp,
  History,
  Filter,
  Download,
  Plus,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Globe,
  Smartphone,
  Key,
  UserX,
  UserCheck,
  UserPlus,
  LogOut,
  ChevronRight,
  Mail,
  Phone,
  Search,
  Upload,
  ExternalLink,
  Stethoscope,
  AlertCircle,
  Crown,
  Sparkles,
} from "lucide-react";
import { Patient, PatientActivityLog } from "../types/user.types";
import { PatientDetailTab } from "../containers/PatientDetailContainer";
import PatientDetailHeader from "./PatientDetailHeader";
import PatientContactInfo from "./PatientContactInfo";
import PatientAddressInfo from "./PatientAddressInfo";
import PatientEmergencyContacts from "./PatientEmergencyContacts";
import { formatDate, formatDateShort, getStatusColor, getStatusLabel } from "../utils/patient-utils";

// Loading skeleton components
const SkeletonCard = ({ className = "" }: { className?: string }) => (
  <div className={`card-admin animate-pulse ${className}`}>
    <div className="space-y-4">
      <div className="h-4 bg-[color:var(--muted)]/20 rounded w-1/3"></div>
      <div className="space-y-2">
        <div className="h-3 bg-[color:var(--muted)]/20 rounded"></div>
        <div className="h-3 bg-[color:var(--muted)]/20 rounded w-2/3"></div>
      </div>
    </div>
  </div>
);

const SkeletonHeader = () => (
  <div className="card-admin animate-pulse">
    <div className="flex items-center gap-6">
      <div className="w-20 h-20 bg-[color:var(--muted)]/20 rounded-2xl"></div>
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-8 bg-[color:var(--muted)]/20 rounded w-48"></div>
          <div className="h-6 bg-[color:var(--muted)]/20 rounded w-20"></div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 bg-[color:var(--muted)]/20 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

interface PatientDetailPresentationProps {
  patient?: Patient;
  activityLog?: PatientActivityLog[];
  activeTab: PatientDetailTab;
  isLoading: boolean;
  isError: boolean;
  error?: Error;
  activityLoading: boolean;
  onTabChange: (tab: PatientDetailTab) => void;
  onBackToList: () => void;
  onEditPatient: () => void;
  onExportData: () => void;
  onQuickAction: (action: string, data?: unknown) => void;
  onSecurityAction: (action: string, data?: unknown) => void;
}

export default function PatientDetailPresentation({
  patient,
  activityLog,
  activeTab,
  isLoading,
  isError,
  error,
  activityLoading,
  onTabChange,
  onBackToList,
  onEditPatient,
  onExportData,
  onQuickAction,
  onSecurityAction,
}: PatientDetailPresentationProps) {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'medical', label: 'Medical', icon: Heart },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'family', label: 'Family & Care', icon: Users },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[color:var(--background)] to-[color:var(--muted)]/20 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <button 
              onClick={onBackToList}
              className="p-2 rounded-full hover:bg-[color:var(--accent)]/20 transition-colors"
            >
              <User size={20} />
            </button>
            <h1 className="text-2xl font-semibold">Patient Details</h1>
          </div>
          
          {/* Loading Skeletons */}
          <SkeletonHeader />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
            <div className="space-y-6">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[color:var(--background)] to-[color:var(--muted)]/20 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <button 
              onClick={onBackToList}
              className="p-2 rounded-full hover:bg-[color:var(--accent)]/20 transition-colors"
            >
              <User size={20} />
            </button>
            <h1 className="text-2xl font-semibold">Patient Details</h1>
          </div>
          
          <div className="card-admin">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[color:var(--error)]/10 rounded-full">
                <AlertTriangle className="w-6 h-6 text-[color:var(--error)]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[color:var(--foreground)]">Patient not found</h3>
                <p className="text-[color:var(--muted-foreground)] mt-1">
                  {error?.message || 'The patient you are looking for does not exist or has been removed.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[color:var(--background)] to-[color:var(--muted)]/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <PatientDetailHeader
          patient={patient}
          onBackToList={onBackToList}
          onEditPatient={onEditPatient}
          onExportData={onExportData}
        />

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card-admin">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-950 rounded-xl">
                <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[color:var(--foreground)]">
                  {(patient as any).usageMetrics?.messagesSent || 0}
                </p>
                <p className="text-sm text-[color:var(--muted-foreground)]">Messages Sent</p>
              </div>
            </div>
          </div>
          
          <div className="card-admin">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-950 rounded-xl">
                <CalendarIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[color:var(--foreground)]">
                  {(patient as any).usageMetrics?.appointmentsBooked || 0}
                </p>
                <p className="text-sm text-[color:var(--muted-foreground)]">Appointments</p>
              </div>
            </div>
          </div>
          
          <div className="card-admin">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-950 rounded-xl">
                <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[color:var(--foreground)]">
                  {(patient as any).usageMetrics?.aiInteractions || 0}
                </p>
                <p className="text-sm text-[color:var(--muted-foreground)]">AI Interactions</p>
              </div>
            </div>
          </div>
          
          <div className="card-admin">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-950 rounded-xl">
                <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[color:var(--foreground)]">
                  {(patient as any).usageMetrics?.totalLoginCount || 0}
                </p>
                <p className="text-sm text-[color:var(--muted-foreground)]">Total Logins</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card-admin">
          <div className="flex gap-1 border-b border-[color:var(--border)] -mb-6 -mx-6 px-6 overflow-x-auto">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onTabChange(id as PatientDetailTab)}
                className={`flex items-center gap-2 px-6 py-4 rounded-t-lg font-medium transition-colors whitespace-nowrap ${
                  activeTab === id
                    ? 'bg-[color:var(--primary)] text-[color:var(--primary-foreground)] -mb-px'
                    : 'text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] hover:bg-[color:var(--muted)]/30'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Main Info */}
              <div className="lg:col-span-2 space-y-6">
                <PatientContactInfo patient={patient} />
                <PatientAddressInfo 
                  patient={patient} 
                  onAddAddress={() => onQuickAction('add_address')}
                />
                <PatientEmergencyContacts 
                  patient={patient}
                  onAddContact={() => onQuickAction('add_emergency_contact')}
                />
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="card-admin">
                  <h3 className="text-lg font-semibold text-[color:var(--foreground)] mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => onQuickAction('send_message')}
                      className="w-full flex items-center gap-3 p-3 text-left hover:bg-[color:var(--accent)] rounded-lg transition-colors"
                    >
                      <MessageSquare className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-[color:var(--foreground)]">Send Message</p>
                        <p className="text-sm text-[color:var(--muted-foreground)]">Send direct message to patient</p>
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => onQuickAction('schedule_appointment')}
                      className="w-full flex items-center gap-3 p-3 text-left hover:bg-[color:var(--accent)] rounded-lg transition-colors"
                    >
                      <CalendarIcon className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium text-[color:var(--foreground)]">Schedule Appointment</p>
                        <p className="text-sm text-[color:var(--muted-foreground)]">Book new appointment</p>
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => onQuickAction('view_records')}
                      className="w-full flex items-center gap-3 p-3 text-left hover:bg-[color:var(--accent)] rounded-lg transition-colors"
                    >
                      <FileText className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="font-medium text-[color:var(--foreground)]">View Records</p>
                        <p className="text-sm text-[color:var(--muted-foreground)]">Access medical records</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Account Status */}
                <div className="card-admin">
                  <h3 className="text-lg font-semibold text-[color:var(--foreground)] mb-4">Account Status</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-[color:var(--muted)]/20 rounded-lg">
                      <span className="text-[color:var(--muted-foreground)]">Current Status</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(patient.accountStatus)}`}>
                        {getStatusLabel(patient.accountStatus)}
                      </span>
                    </div>
                    
                    {(patient as any).suspendedAt && (
                      <div className="flex items-center justify-between p-3 bg-[color:var(--muted)]/20 rounded-lg">
                        <span className="text-[color:var(--muted-foreground)]">Suspended</span>
                        <span className="text-sm text-[color:var(--foreground)]">{formatDateShort((patient as any).suspendedAt)}</span>
                      </div>
                    )}
                    
                    {(patient as any).twoFactorEnabledAt && (
                      <div className="flex items-center justify-between p-3 bg-[color:var(--muted)]/20 rounded-lg">
                        <span className="text-[color:var(--muted-foreground)]">2FA Enabled</span>
                        <span className="text-sm text-[color:var(--foreground)]">{formatDateShort((patient as any).twoFactorEnabledAt)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Insurance Info */}
                {(patient as any).insurance && (
                  <div className="card-admin">
                    <div className="flex items-center gap-3 mb-4">
                      <Shield className="w-5 h-5 text-[color:var(--primary)]" />
                      <h3 className="text-lg font-semibold text-[color:var(--foreground)]">Insurance</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {(patient as any).insurance.provider && (
                        <div>
                          <p className="text-sm text-[color:var(--muted-foreground)]">Provider</p>
                          <p className="font-medium text-[color:var(--foreground)]">{(patient as any).insurance.provider}</p>
                        </div>
                      )}
                      
                      {(patient as any).insurance.status && (
                        <div>
                          <p className="text-sm text-[color:var(--muted-foreground)]">Status</p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            (patient as any).insurance.status === 'verified' ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400' :
                            (patient as any).insurance.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400' :
                            'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
                          }`}>
                            {(patient as any).insurance.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Other tab content would go here - keeping existing structure for now */}
          {activeTab !== 'overview' && (
            <div className="card-admin text-center py-12">
              <div className="p-4 bg-[color:var(--muted)]/20 rounded-full w-fit mx-auto mb-4">
                <FileText className="w-16 h-16 text-[color:var(--muted-foreground)]" />
              </div>
              <h3 className="text-xl font-semibold text-[color:var(--foreground)] mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Tab
              </h3>
              <p className="text-[color:var(--muted-foreground)]">
                This tab content is under development.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}