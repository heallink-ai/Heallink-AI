"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Shield,
  Heart,
  CreditCard,
  Activity,
  Edit,
  Key,
  UserX,
  UserCheck,
  LogOut,
  UserPlus,
  Clock,
  CheckCircle,
  XCircle,
  History,
  Crown,
  Sparkles,
  AlertTriangle,
  FileText,
  Users,
  Settings,
  Smartphone,
  Globe,
  Bell,
  Download,
  Upload,
  BarChart3,
  TrendingUp,
  MessageSquare,
  Calendar as CalendarIcon,
  Stethoscope,
  AlertCircle,
  ChevronRight,
  Plus,
  ExternalLink,
  Bookmark,
  Eye,
  Search,
  Filter,
} from "lucide-react";
import { useGetPatient, useGetPatientActivityLog } from "../../../features/user-management/hooks/use-patient-queries";
import { AccountStatus } from "../../../features/user-management/types/user.types";

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

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;
  
  const [activeTab, setActiveTab] = useState<'overview' | 'medical' | 'activity' | 'security' | 'documents' | 'family'>('overview');

  // Fetch patient data
  const { data: patient, isLoading, isError, error } = useGetPatient(patientId);
  const { data: activityLog, isLoading: activityLoading } = useGetPatientActivityLog(patientId);

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateShort = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400";
      case 'pending_verification':
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400";
      case 'suspended':
        return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
      case 'deactivated':
        return "bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'pending_verification':
        return 'Pending Verification';
      case 'suspended':
        return 'Suspended';
      case 'deactivated':
        return 'Deactivated';
      default:
        return 'Unknown';
    }
  };

  const getPlanIcon = (plan: string) => {
    if (plan === "premium") return <Crown className="w-5 h-5 text-purple-500" />;
    if (plan === "basic") return <Shield className="w-5 h-5 text-blue-500" />;
    return <User className="w-5 h-5 text-gray-500" />;
  };

  const getPlanStyle = (plan: string) => {
    if (plan === "premium") return "bg-gradient-to-r from-purple-500 to-pink-500 text-white";
    if (plan === "basic") return "bg-gradient-to-r from-blue-500 to-indigo-500 text-white";
    return "bg-gradient-to-r from-gray-400 to-gray-500 text-white";
  };

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
            <Link href="/dashboard/users" className="p-2 rounded-full hover:bg-[color:var(--accent)]/20 transition-colors">
              <ArrowLeft size={20} />
            </Link>
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
            <Link href="/dashboard/users" className="p-2 rounded-full hover:bg-[color:var(--accent)]/20 transition-colors">
              <ArrowLeft size={20} />
            </Link>
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
                  {(error as any)?.message || 'The patient you are looking for does not exist or has been removed.'}
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/dashboard/users" className="p-2 rounded-full hover:bg-[color:var(--accent)]/20 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-[color:var(--foreground)]">Patient Profile</h1>
              <p className="text-[color:var(--muted-foreground)]">Comprehensive patient information and management</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-[color:var(--muted)] hover:bg-[color:var(--accent)] rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
            <Link 
              href={`/dashboard/users/${patientId}/edit`}
              className="flex items-center gap-2 px-6 py-2 bg-[color:var(--primary)] text-[color:var(--primary-foreground)] hover:bg-[color:var(--primary)]/90 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Patient
            </Link>
          </div>
        </div>

        {/* Patient Header Card */}
        <div className="card-admin overflow-hidden">
          <div className="relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--primary)]/5 to-transparent"></div>
            
            <div className="relative p-6">
              <div className="flex items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                  {patient.avatarUrl ? (
                    <img
                      src={patient.avatarUrl}
                      alt={patient.name}
                      className="w-24 h-24 rounded-3xl object-cover border-4 border-white shadow-xl"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[color:var(--primary)]/20 to-[color:var(--primary)]/5 border-4 border-white shadow-xl flex items-center justify-center">
                      <User className="w-12 h-12 text-[color:var(--primary)]" />
                    </div>
                  )}
                  
                  {/* Status indicator */}
                  {patient.accountStatus === 'active' && (
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 border-4 border-white rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
                
                {/* Basic Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <h2 className="text-4xl font-bold text-[color:var(--foreground)]">
                      {patient.name}
                    </h2>
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(patient.accountStatus)}`}>
                      <div className={`w-2 h-2 rounded-full ${
                        patient.accountStatus === 'active' ? 'bg-emerald-500' : 
                        patient.accountStatus === 'pending_verification' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`} />
                      {getStatusLabel(patient.accountStatus)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[color:var(--muted)]/30 rounded-lg">
                        <Calendar className="w-5 h-5 text-[color:var(--muted-foreground)]" />
                      </div>
                      <div>
                        <p className="text-sm text-[color:var(--muted-foreground)]">Patient Since</p>
                        <p className="font-semibold text-[color:var(--foreground)]">{formatDateShort(patient.createdAt)}</p>
                      </div>
                    </div>
                    
                    {patient.lastLogin && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[color:var(--muted)]/30 rounded-lg">
                          <Clock className="w-5 h-5 text-[color:var(--muted-foreground)]" />
                        </div>
                        <div>
                          <p className="text-sm text-[color:var(--muted-foreground)]">Last Active</p>
                          <p className="font-semibold text-[color:var(--foreground)]">{formatDateShort(patient.lastLogin)}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getPlanStyle(patient.subscriptionPlan)}`}>
                        {getPlanIcon(patient.subscriptionPlan)}
                      </div>
                      <div>
                        <p className="text-sm text-[color:var(--muted-foreground)]">Plan</p>
                        <p className="font-semibold text-[color:var(--foreground)] capitalize flex items-center gap-2">
                          {patient.subscriptionPlan}
                          {patient.subscriptionPlan === "premium" && (
                            <Sparkles className="w-4 h-4 text-yellow-500" />
                          )}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[color:var(--muted)]/30 rounded-lg">
                        <Shield className="w-5 h-5 text-[color:var(--muted-foreground)]" />
                      </div>
                      <div>
                        <p className="text-sm text-[color:var(--muted-foreground)]">Security</p>
                        <p className={`font-semibold ${patient.twoFactorEnabled ? 'text-green-600' : 'text-red-600'}`}>
                          2FA {patient.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card-admin">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-950 rounded-xl">
                <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[color:var(--foreground)]">
                  {patient.usageMetrics?.messagesSent || 0}
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
                  {patient.usageMetrics?.appointmentsBooked || 0}
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
                  {patient.usageMetrics?.aiInteractions || 0}
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
                  {patient.usageMetrics?.totalLoginCount || 0}
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
                onClick={() => setActiveTab(id as any)}
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
                {/* Contact Information */}
                <div className="card-admin">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-[color:var(--primary)]/10 rounded-lg">
                      <Mail className="w-5 h-5 text-[color:var(--primary)]" />
                    </div>
                    <h3 className="text-xl font-semibold text-[color:var(--foreground)]">Contact Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-[color:var(--muted)]/20 rounded-lg">
                        <Mail className="w-5 h-5 text-[color:var(--muted-foreground)]" />
                        <div className="flex-1">
                          <p className="text-sm text-[color:var(--muted-foreground)]">Email Address</p>
                          <p className="font-medium text-[color:var(--foreground)] flex items-center gap-2">
                            {patient.email}
                            {patient.emailVerified ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                          </p>
                        </div>
                      </div>
                      
                      {patient.phone && (
                        <div className="flex items-center gap-3 p-4 bg-[color:var(--muted)]/20 rounded-lg">
                          <Phone className="w-5 h-5 text-[color:var(--muted-foreground)]" />
                          <div className="flex-1">
                            <p className="text-sm text-[color:var(--muted-foreground)]">Phone Number</p>
                            <p className="font-medium text-[color:var(--foreground)] flex items-center gap-2">
                              {patient.phone}
                              {patient.phoneVerified ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-500" />
                              )}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      {patient.dateOfBirth && (
                        <div className="flex items-center gap-3 p-4 bg-[color:var(--muted)]/20 rounded-lg">
                          <Calendar className="w-5 h-5 text-[color:var(--muted-foreground)]" />
                          <div>
                            <p className="text-sm text-[color:var(--muted-foreground)]">Date of Birth</p>
                            <p className="font-medium text-[color:var(--foreground)]">{patient.dateOfBirth}</p>
                          </div>
                        </div>
                      )}
                      
                      {patient.gender && (
                        <div className="flex items-center gap-3 p-4 bg-[color:var(--muted)]/20 rounded-lg">
                          <User className="w-5 h-5 text-[color:var(--muted-foreground)]" />
                          <div>
                            <p className="text-sm text-[color:var(--muted-foreground)]">Gender</p>
                            <p className="font-medium text-[color:var(--foreground)] capitalize">{patient.gender}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Address */}
                {patient.address && (
                  <div className="card-admin">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-[color:var(--primary)]/10 rounded-lg">
                        <MapPin className="w-5 h-5 text-[color:var(--primary)]" />
                      </div>
                      <h3 className="text-xl font-semibold text-[color:var(--foreground)]">Address</h3>
                    </div>
                    
                    <div className="p-4 bg-[color:var(--muted)]/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-[color:var(--muted-foreground)] mt-0.5" />
                        <div>
                          {patient.address.streetAddress && (
                            <p className="text-[color:var(--foreground)] font-medium">{patient.address.streetAddress}</p>
                          )}
                          <p className="text-[color:var(--foreground)]">
                            {[patient.address.city, patient.address.state, patient.address.zipCode]
                              .filter(Boolean)
                              .join(', ')}
                          </p>
                          {patient.address.country && (
                            <p className="text-[color:var(--muted-foreground)]">{patient.address.country}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Emergency Contact */}
                {patient.emergencyContact && (
                  <div className="card-admin">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-red-100 dark:bg-red-950 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-[color:var(--foreground)]">Emergency Contact</h3>
                    </div>
                    
                    <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-red-600 dark:text-red-400">Name</p>
                          <p className="font-semibold text-[color:var(--foreground)]">{patient.emergencyContact.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-red-600 dark:text-red-400">Relationship</p>
                          <p className="font-semibold text-[color:var(--foreground)]">{patient.emergencyContact.relationship}</p>
                        </div>
                        <div>
                          <p className="text-sm text-red-600 dark:text-red-400">Phone</p>
                          <p className="font-semibold text-[color:var(--foreground)]">{patient.emergencyContact.phone}</p>
                        </div>
                        {patient.emergencyContact.email && (
                          <div>
                            <p className="text-sm text-red-600 dark:text-red-400">Email</p>
                            <p className="font-semibold text-[color:var(--foreground)]">{patient.emergencyContact.email}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="card-admin">
                  <h3 className="text-lg font-semibold text-[color:var(--foreground)] mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-[color:var(--accent)] rounded-lg transition-colors">
                      <MessageSquare className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-[color:var(--foreground)]">Send Message</p>
                        <p className="text-sm text-[color:var(--muted-foreground)]">Send direct message to patient</p>
                      </div>
                    </button>
                    
                    <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-[color:var(--accent)] rounded-lg transition-colors">
                      <CalendarIcon className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium text-[color:var(--foreground)]">Schedule Appointment</p>
                        <p className="text-sm text-[color:var(--muted-foreground)]">Book new appointment</p>
                      </div>
                    </button>
                    
                    <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-[color:var(--accent)] rounded-lg transition-colors">
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
                    
                    {patient.suspendedAt && (
                      <div className="flex items-center justify-between p-3 bg-[color:var(--muted)]/20 rounded-lg">
                        <span className="text-[color:var(--muted-foreground)]">Suspended</span>
                        <span className="text-sm text-[color:var(--foreground)]">{formatDateShort(patient.suspendedAt)}</span>
                      </div>
                    )}
                    
                    {patient.twoFactorEnabledAt && (
                      <div className="flex items-center justify-between p-3 bg-[color:var(--muted)]/20 rounded-lg">
                        <span className="text-[color:var(--muted-foreground)]">2FA Enabled</span>
                        <span className="text-sm text-[color:var(--foreground)]">{formatDateShort(patient.twoFactorEnabledAt)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Insurance Info */}
                {patient.insurance && (
                  <div className="card-admin">
                    <div className="flex items-center gap-3 mb-4">
                      <CreditCard className="w-5 h-5 text-[color:var(--primary)]" />
                      <h3 className="text-lg font-semibold text-[color:var(--foreground)]">Insurance</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {patient.insurance.provider && (
                        <div>
                          <p className="text-sm text-[color:var(--muted-foreground)]">Provider</p>
                          <p className="font-medium text-[color:var(--foreground)]">{patient.insurance.provider}</p>
                        </div>
                      )}
                      
                      {patient.insurance.status && (
                        <div>
                          <p className="text-sm text-[color:var(--muted-foreground)]">Status</p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            patient.insurance.status === 'verified' ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400' :
                            patient.insurance.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400' :
                            'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
                          }`}>
                            {patient.insurance.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'medical' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {patient.medicalInformation ? (
                <>
                  {/* Blood Type */}
                  {patient.medicalInformation.bloodType && (
                    <div className="card-admin">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-red-100 dark:bg-red-950 rounded-xl">
                          <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-[color:var(--foreground)]">Blood Type</h3>
                          <p className="text-3xl font-bold text-red-600 dark:text-red-400">{patient.medicalInformation.bloodType}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Primary Care Physician */}
                  {patient.medicalInformation.primaryCarePhysician && (
                    <div className="card-admin">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-950 rounded-xl">
                          <Stethoscope className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-[color:var(--foreground)]">Primary Care Physician</h3>
                          <p className="text-[color:var(--foreground)] font-medium">{patient.medicalInformation.primaryCarePhysician}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Allergies */}
                  {patient.medicalInformation.allergies && patient.medicalInformation.allergies.length > 0 && (
                    <div className="card-admin lg:col-span-2">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-yellow-100 dark:bg-yellow-950 rounded-xl">
                          <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-[color:var(--foreground)]">Allergies</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {patient.medicalInformation.allergies.map((allergy, index) => (
                          <span key={index} className="px-3 py-2 bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 rounded-lg text-sm font-medium">
                            {allergy}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Medications */}
                  {patient.medicalInformation.medications && patient.medicalInformation.medications.length > 0 && (
                    <div className="card-admin lg:col-span-2">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-green-100 dark:bg-green-950 rounded-xl">
                          <Heart className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-[color:var(--foreground)]">Current Medications</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {patient.medicalInformation.medications.map((medication, index) => (
                          <span key={index} className="px-3 py-2 bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 rounded-lg text-sm font-medium">
                            {medication}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Chronic Conditions */}
                  {patient.medicalInformation.chronicConditions && patient.medicalInformation.chronicConditions.length > 0 && (
                    <div className="card-admin lg:col-span-2">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-950 rounded-xl">
                          <AlertCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-[color:var(--foreground)]">Chronic Conditions</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {patient.medicalInformation.chronicConditions.map((condition, index) => (
                          <span key={index} className="px-3 py-2 bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400 rounded-lg text-sm font-medium">
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="card-admin lg:col-span-2 text-center py-12">
                  <div className="p-4 bg-[color:var(--muted)]/20 rounded-full w-fit mx-auto mb-4">
                    <Heart className="w-16 h-16 text-[color:var(--muted-foreground)]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[color:var(--foreground)] mb-2">No Medical Information</h3>
                  <p className="text-[color:var(--muted-foreground)]">Medical information has not been provided yet.</p>
                  <button className="mt-4 flex items-center gap-2 px-4 py-2 bg-[color:var(--primary)] text-[color:var(--primary-foreground)] rounded-lg hover:bg-[color:var(--primary)]/90 transition-colors mx-auto">
                    <Plus className="w-4 h-4" />
                    Add Medical Information
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-[color:var(--foreground)]">Activity Timeline</h3>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-3 py-2 bg-[color:var(--muted)] hover:bg-[color:var(--accent)] rounded-lg transition-colors text-sm">
                    <Filter className="w-4 h-4" />
                    Filter
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 bg-[color:var(--muted)] hover:bg-[color:var(--accent)] rounded-lg transition-colors text-sm">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>
              
              {activityLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : activityLog && activityLog.length > 0 ? (
                <div className="space-y-4">
                  {activityLog.map((activity: any, index: number) => (
                    <div key={activity.id || index} className="card-admin">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-[color:var(--primary)]/10 rounded-lg mt-1">
                          <History className="w-5 h-5 text-[color:var(--primary)]" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-[color:var(--foreground)]">{activity.action}</h4>
                            <span className="text-sm text-[color:var(--muted-foreground)]">
                              {formatDate(activity.timestamp)}
                            </span>
                          </div>
                          <p className="text-[color:var(--muted-foreground)] mb-2">{activity.description}</p>
                          <div className="flex items-center gap-4 text-xs text-[color:var(--muted-foreground)]">
                            {activity.ipAddress && (
                              <span className="flex items-center gap-1">
                                <Globe className="w-3 h-3" />
                                {activity.ipAddress}
                              </span>
                            )}
                            {activity.outcome && (
                              <span className={`px-2 py-1 rounded ${
                                activity.outcome === 'success' ? 'bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400' : 
                                'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400'
                              }`}>
                                {activity.outcome}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card-admin text-center py-12">
                  <div className="p-4 bg-[color:var(--muted)]/20 rounded-full w-fit mx-auto mb-4">
                    <Activity className="w-16 h-16 text-[color:var(--muted-foreground)]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[color:var(--foreground)] mb-2">No Activity Yet</h3>
                  <p className="text-[color:var(--muted-foreground)]">Patient activity will appear here as it happens.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Security Actions */}
              <div className="card-admin">
                <h3 className="text-lg font-semibold text-[color:var(--foreground)] mb-6">Security Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-3 p-4 text-left border border-[color:var(--border)] rounded-lg hover:bg-[color:var(--accent)] transition-colors">
                    <Key className="w-5 h-5 text-[color:var(--muted-foreground)]" />
                    <div>
                      <p className="font-medium text-[color:var(--foreground)]">Reset Password</p>
                      <p className="text-sm text-[color:var(--muted-foreground)]">Send password reset email</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[color:var(--muted-foreground)] ml-auto" />
                  </button>
                  
                  <button className="w-full flex items-center gap-3 p-4 text-left border border-[color:var(--border)] rounded-lg hover:bg-[color:var(--accent)] transition-colors">
                    {patient.accountStatus === 'active' ? (
                      <UserX className="w-5 h-5 text-red-500" />
                    ) : (
                      <UserCheck className="w-5 h-5 text-green-500" />
                    )}
                    <div>
                      <p className="font-medium text-[color:var(--foreground)]">
                        {patient.accountStatus === 'active' ? 'Suspend Account' : 'Activate Account'}
                      </p>
                      <p className="text-sm text-[color:var(--muted-foreground)]">
                        {patient.accountStatus === 'active' ? 'Temporarily disable access' : 'Restore account access'}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[color:var(--muted-foreground)] ml-auto" />
                  </button>
                  
                  <button className="w-full flex items-center gap-3 p-4 text-left border border-[color:var(--border)] rounded-lg hover:bg-[color:var(--accent)] transition-colors">
                    <UserPlus className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="font-medium text-[color:var(--foreground)]">Impersonate User</p>
                      <p className="text-sm text-[color:var(--muted-foreground)]">Login as this patient</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[color:var(--muted-foreground)] ml-auto" />
                  </button>
                  
                  <button className="w-full flex items-center gap-3 p-4 text-left border border-[color:var(--border)] rounded-lg hover:bg-[color:var(--accent)] transition-colors">
                    <LogOut className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="font-medium text-[color:var(--foreground)]">Force Logout</p>
                      <p className="text-sm text-[color:var(--muted-foreground)]">End all active sessions</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[color:var(--muted-foreground)] ml-auto" />
                  </button>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="card-admin">
                <h3 className="text-lg font-semibold text-[color:var(--foreground)] mb-6">Active Sessions</h3>
                {patient.activeSessions && patient.activeSessions.length > 0 ? (
                  <div className="space-y-3">
                    {patient.activeSessions.map((session, index) => (
                      <div key={session.sessionId || index} className="flex items-center justify-between p-3 border border-[color:var(--border)] rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[color:var(--muted)]/20 rounded-lg">
                            <Smartphone className="w-4 h-4 text-[color:var(--muted-foreground)]" />
                          </div>
                          <div>
                            <p className="font-medium text-[color:var(--foreground)]">{session.deviceInfo}</p>
                            <p className="text-sm text-[color:var(--muted-foreground)]">IP: {session.ipAddress}</p>
                            <p className="text-xs text-[color:var(--muted-foreground)]">
                              Last active: {formatDate(session.lastActivity)}
                            </p>
                          </div>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${
                          session.isActive ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="p-3 bg-[color:var(--muted)]/20 rounded-full w-fit mx-auto mb-3">
                      <Smartphone className="w-8 h-8 text-[color:var(--muted-foreground)]" />
                    </div>
                    <p className="text-[color:var(--muted-foreground)]">No active sessions</p>
                  </div>
                )}
              </div>

              {/* Security Info */}
              <div className="card-admin lg:col-span-2">
                <h3 className="text-lg font-semibold text-[color:var(--foreground)] mb-6">Security Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-[color:var(--muted)]/20 rounded-lg">
                    <div className={`p-3 rounded-full w-fit mx-auto mb-3 ${
                      patient.twoFactorEnabled ? 'bg-green-100 dark:bg-green-950' : 'bg-red-100 dark:bg-red-950'
                    }`}>
                      <Shield className={`w-6 h-6 ${
                        patient.twoFactorEnabled ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`} />
                    </div>
                    <p className="font-semibold text-[color:var(--foreground)]">Two-Factor Auth</p>
                    <p className={`text-sm ${patient.twoFactorEnabled ? 'text-green-600' : 'text-red-600'}`}>
                      {patient.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-[color:var(--muted)]/20 rounded-lg">
                    <div className={`p-3 rounded-full w-fit mx-auto mb-3 ${
                      patient.emailVerified ? 'bg-green-100 dark:bg-green-950' : 'bg-red-100 dark:bg-red-950'
                    }`}>
                      <Mail className={`w-6 h-6 ${
                        patient.emailVerified ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`} />
                    </div>
                    <p className="font-semibold text-[color:var(--foreground)]">Email Verified</p>
                    <p className={`text-sm ${patient.emailVerified ? 'text-green-600' : 'text-red-600'}`}>
                      {patient.emailVerified ? 'Verified' : 'Unverified'}
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-[color:var(--muted)]/20 rounded-lg">
                    <div className={`p-3 rounded-full w-fit mx-auto mb-3 ${
                      patient.phoneVerified ? 'bg-green-100 dark:bg-green-950' : 'bg-red-100 dark:bg-red-950'
                    }`}>
                      <Phone className={`w-6 h-6 ${
                        patient.phoneVerified ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`} />
                    </div>
                    <p className="font-semibold text-[color:var(--foreground)]">Phone Verified</p>
                    <p className={`text-sm ${patient.phoneVerified ? 'text-green-600' : 'text-red-600'}`}>
                      {patient.phoneVerified ? 'Verified' : 'Unverified'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="card-admin text-center py-12">
              <div className="p-4 bg-[color:var(--muted)]/20 rounded-full w-fit mx-auto mb-4">
                <FileText className="w-16 h-16 text-[color:var(--muted-foreground)]" />
              </div>
              <h3 className="text-xl font-semibold text-[color:var(--foreground)] mb-2">Document Management</h3>
              <p className="text-[color:var(--muted-foreground)] mb-6">Patient documents and file management coming soon.</p>
              <div className="flex items-center justify-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-[color:var(--primary)] text-[color:var(--primary-foreground)] rounded-lg hover:bg-[color:var(--primary)]/90 transition-colors">
                  <Upload className="w-4 h-4" />
                  Upload Document
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-[color:var(--muted)] hover:bg-[color:var(--accent)] rounded-lg transition-colors">
                  <Search className="w-4 h-4" />
                  Search Files
                </button>
              </div>
            </div>
          )}

          {activeTab === 'family' && (
            <div className="space-y-6">
              {/* Emergency Contacts */}
              {patient.emergencyContacts && patient.emergencyContacts.length > 0 && (
                <div className="card-admin">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-[color:var(--foreground)]">Emergency Contacts</h3>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[color:var(--primary)] text-[color:var(--primary-foreground)] rounded-lg hover:bg-[color:var(--primary)]/90 transition-colors">
                      <Plus className="w-4 h-4" />
                      Add Contact
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {patient.emergencyContacts.map((contact, index) => (
                      <div key={index} className="p-4 border border-[color:var(--border)] rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-[color:var(--foreground)]">{contact.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            contact.isActive ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400' : 
                            'bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-400'
                          }`}>
                            {contact.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-[color:var(--muted-foreground)]">Relationship:</span> {contact.relationship}</p>
                          <p><span className="text-[color:var(--muted-foreground)]">Phone:</span> {contact.phone}</p>
                          {contact.email && (
                            <p><span className="text-[color:var(--muted-foreground)]">Email:</span> {contact.email}</p>
                          )}
                          {contact.permissions && contact.permissions.length > 0 && (
                            <div>
                              <p className="text-[color:var(--muted-foreground)]">Permissions:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {contact.permissions.map((permission, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-[color:var(--muted)]/20 rounded text-xs">
                                    {permission}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Care Team - Placeholder */}
              <div className="card-admin text-center py-12">
                <div className="p-4 bg-[color:var(--muted)]/20 rounded-full w-fit mx-auto mb-4">
                  <Users className="w-16 h-16 text-[color:var(--muted-foreground)]" />
                </div>
                <h3 className="text-xl font-semibold text-[color:var(--foreground)] mb-2">Care Team Management</h3>
                <p className="text-[color:var(--muted-foreground)] mb-6">Manage healthcare providers and family member access.</p>
                <div className="flex items-center justify-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-[color:var(--primary)] text-[color:var(--primary-foreground)] rounded-lg hover:bg-[color:var(--primary)]/90 transition-colors">
                    <Plus className="w-4 h-4" />
                    Add Provider
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[color:var(--muted)] hover:bg-[color:var(--accent)] rounded-lg transition-colors">
                    <Users className="w-4 h-4" />
                    Manage Access
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}