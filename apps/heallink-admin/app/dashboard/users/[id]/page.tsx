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
} from "lucide-react";
import { useGetPatient } from "../../../features/user-management/hooks/use-patient-queries";
import { AccountStatus } from "../../../features/user-management/types/user.types";

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;
  
  const [activeTab, setActiveTab] = useState<'profile' | 'medical' | 'insurance' | 'activity' | 'security'>('profile');

  // Fetch patient data
  const { data: patient, isLoading, isError, error } = useGetPatient(patientId);

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

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'medical', label: 'Medical', icon: Heart },
    { id: 'insurance', label: 'Insurance', icon: CreditCard },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[color:var(--background)] p-6">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/dashboard/users" className="p-2 rounded-full hover:bg-[color:var(--accent)]/20 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-semibold">Patient Details</h1>
        </div>
        
        <div className="card-admin">
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <div className="w-8 h-8 rounded-full border-2 border-[color:var(--muted)] animate-spin border-t-[color:var(--primary)]"></div>
            <p className="text-[color:var(--muted-foreground)] font-medium">Loading patient details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !patient) {
    return (
      <div className="min-h-screen bg-[color:var(--background)] p-6">
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
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--background)] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/users" className="p-2 rounded-full hover:bg-[color:var(--accent)]/20 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-semibold">Patient Details</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Link 
            href={`/dashboard/users/${patientId}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-[color:var(--muted)] hover:bg-[color:var(--accent)] rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit Patient
          </Link>
        </div>
      </div>

      {/* Patient Header Card */}
      <div className="card-admin mb-6">
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            {patient.avatarUrl ? (
              <img
                src={patient.avatarUrl}
                alt={patient.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-[color:var(--border)]"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[color:var(--primary)]/20 to-[color:var(--primary)]/5 border-2 border-[color:var(--border)] flex items-center justify-center">
                <User className="w-10 h-10 text-[color:var(--primary)]" />
              </div>
            )}
            
            {/* Status indicator */}
            {patient.accountStatus === 'active' && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-2 border-[color:var(--background)] rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            )}
          </div>
          
          {/* Basic Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-3xl font-bold text-[color:var(--foreground)]">
                {patient.name}
              </h2>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(patient.accountStatus)}`}>
                <div className={`w-2 h-2 rounded-full ${
                  patient.accountStatus === 'active' ? 'bg-emerald-500' : 
                  patient.accountStatus === 'pending_verification' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`} />
                {getStatusLabel(patient.accountStatus)}
              </span>
              {getPlanIcon(patient.subscriptionPlan)}
              {patient.subscriptionPlan === "premium" && (
                <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-[color:var(--muted-foreground)]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs">
                  ID: #{patient.id.slice(-8).toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Joined {formatDate(patient.createdAt)}</span>
              </div>
              {patient.lastLogin && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Last active {formatDate(patient.lastLogin)}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                <span className={patient.twoFactorEnabled ? 'text-green-600' : 'text-red-600'}>
                  2FA {patient.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card-admin mb-6">
        <div className="flex gap-1 border-b border-[color:var(--border)] -mb-6 -mx-6 px-6">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 px-4 py-3 rounded-t-lg font-medium transition-colors ${
                activeTab === id
                  ? 'bg-[color:var(--card)] text-[color:var(--primary)] border-b-2 border-[color:var(--primary)] -mb-px'
                  : 'text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]'
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
        {activeTab === 'profile' && (
          <>
            {/* Contact Information */}
            <div className="card-admin">
              <h3 className="text-lg font-semibold text-[color:var(--foreground)] mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[color:var(--muted-foreground)]" />
                  <div>
                    <p className="text-sm text-[color:var(--muted-foreground)]\">Email</p>
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
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[color:var(--muted-foreground)]" />
                    <div>
                      <p className="text-sm text-[color:var(--muted-foreground)]\">Phone</p>
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
            </div>

            {/* Personal Information */}
            <div className="card-admin">
              <h3 className="text-lg font-semibold text-[color:var(--foreground)] mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {patient.dateOfBirth && (
                  <div>
                    <p className="text-sm text-[color:var(--muted-foreground)]\">Date of Birth</p>
                    <p className="font-medium text-[color:var(--foreground)]">{patient.dateOfBirth}</p>
                  </div>
                )}
                
                {patient.gender && (
                  <div>
                    <p className="text-sm text-[color:var(--muted-foreground)]\">Gender</p>
                    <p className="font-medium text-[color:var(--foreground)] capitalize">{patient.gender}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-[color:var(--muted-foreground)]\">Subscription Plan</p>
                  <div className="flex items-center gap-2">
                    {getPlanIcon(patient.subscriptionPlan)}
                    <p className="font-medium text-[color:var(--foreground)] capitalize">{patient.subscriptionPlan}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            {patient.address && (
              <div className="card-admin">
                <h3 className="text-lg font-semibold text-[color:var(--foreground)] mb-4">Address</h3>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[color:var(--muted-foreground)] mt-0.5" />
                  <div>
                    {patient.address.streetAddress && (
                      <p className="text-[color:var(--foreground)]">{patient.address.streetAddress}</p>
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
            )}

            {/* Emergency Contact */}
            {patient.emergencyContact && (
              <div className="card-admin">
                <h3 className="text-lg font-semibold text-[color:var(--foreground)] mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-[color:var(--muted-foreground)]\">Name</p>
                    <p className="font-medium text-[color:var(--foreground)]">{patient.emergencyContact.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[color:var(--muted-foreground)]\">Relationship</p>
                    <p className="font-medium text-[color:var(--foreground)]">{patient.emergencyContact.relationship}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[color:var(--muted-foreground)]\">Phone</p>
                    <p className="font-medium text-[color:var(--foreground)]">{patient.emergencyContact.phone}</p>
                  </div>
                  {patient.emergencyContact.email && (
                    <div>
                      <p className="text-sm text-[color:var(--muted-foreground)]\">Email</p>
                      <p className="font-medium text-[color:var(--foreground)]">{patient.emergencyContact.email}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'medical' && (
          <>
            {patient.medicalInformation ? (
              <>
                {patient.medicalInformation.bloodType && (
                  <div className="card-admin">
                    <h3 className="text-lg font-semibold text-[color:var(--foreground)] mb-4">Blood Type</h3>
                    <p className="text-3xl font-bold text-[color:var(--primary)]">{patient.medicalInformation.bloodType}</p>
                  </div>
                )}
                
                {patient.medicalInformation.allergies && patient.medicalInformation.allergies.length > 0 && (
                  <div className="card-admin">
                    <h3 className="text-lg font-semibold text-[color:var(--foreground)] mb-4">Allergies</h3>
                    <div className="flex flex-wrap gap-2">
                      {patient.medicalInformation.allergies.map((allergy, index) => (
                        <span key={index} className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 rounded-full text-sm">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {patient.medicalInformation.medications && patient.medicalInformation.medications.length > 0 && (
                  <div className="card-admin">
                    <h3 className="text-lg font-semibold text-[color:var(--foreground)] mb-4">Current Medications</h3>
                    <div className="flex flex-wrap gap-2">
                      {patient.medicalInformation.medications.map((medication, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 rounded-full text-sm">
                          {medication}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {patient.medicalInformation.chronicConditions && patient.medicalInformation.chronicConditions.length > 0 && (
                  <div className="card-admin">
                    <h3 className="text-lg font-semibold text-[color:var(--foreground)] mb-4">Chronic Conditions</h3>
                    <div className="flex flex-wrap gap-2">
                      {patient.medicalInformation.chronicConditions.map((condition, index) => (
                        <span key={index} className="px-3 py-1 bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400 rounded-full text-sm">
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {patient.medicalInformation.primaryCarePhysician && (
                  <div className="card-admin">
                    <h3 className="text-lg font-semibold text-[color:var(--foreground)] mb-4">Primary Care Physician</h3>
                    <p className="text-[color:var(--foreground)]">{patient.medicalInformation.primaryCarePhysician}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="card-admin text-center py-12">
                <Heart className="w-16 h-16 text-[color:var(--muted-foreground)] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[color:var(--foreground)] mb-2">No Medical Information</h3>
                <p className="text-[color:var(--muted-foreground)]">Medical information has not been provided yet.</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'insurance' && (
          <>
            {patient.insurance ? (
              <div className="card-admin">
                <h3 className="text-lg font-semibold text-[color:var(--foreground)] mb-4">Insurance Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {patient.insurance.provider && (
                    <div>
                      <p className="text-sm text-[color:var(--muted-foreground)]\">Provider</p>
                      <p className="font-medium text-[color:var(--foreground)]">{patient.insurance.provider}</p>
                    </div>
                  )}
                  
                  {patient.insurance.policyNumber && (
                    <div>
                      <p className="text-sm text-[color:var(--muted-foreground)]\">Policy Number</p>
                      <p className="font-medium text-[color:var(--foreground)] font-mono">{patient.insurance.policyNumber}</p>
                    </div>
                  )}
                  
                  {patient.insurance.groupNumber && (
                    <div>
                      <p className="text-sm text-[color:var(--muted-foreground)]\">Group Number</p>
                      <p className="font-medium text-[color:var(--foreground)] font-mono">{patient.insurance.groupNumber}</p>
                    </div>
                  )}
                  
                  {patient.insurance.primaryInsured && (
                    <div>
                      <p className="text-sm text-[color:var(--muted-foreground)]\">Primary Insured</p>
                      <p className="font-medium text-[color:var(--foreground)]">{patient.insurance.primaryInsured}</p>
                    </div>
                  )}
                  
                  {patient.insurance.relationship && (
                    <div>
                      <p className="text-sm text-[color:var(--muted-foreground)]\">Relationship</p>
                      <p className="font-medium text-[color:var(--foreground)]">{patient.insurance.relationship}</p>
                    </div>
                  )}
                  
                  {patient.insurance.status && (
                    <div>
                      <p className="text-sm text-[color:var(--muted-foreground)]\">Status</p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
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
            ) : (
              <div className="card-admin text-center py-12">
                <CreditCard className="w-16 h-16 text-[color:var(--muted-foreground)] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[color:var(--foreground)] mb-2">No Insurance Information</h3>
                <p className="text-[color:var(--muted-foreground)]">Insurance information has not been provided yet.</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'activity' && (
          <div className="card-admin text-center py-12">
            <Activity className="w-16 h-16 text-[color:var(--muted-foreground)] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[color:var(--foreground)] mb-2">Activity Log</h3>
            <p className="text-[color:var(--muted-foreground)]">Activity logging is coming soon.</p>
          </div>
        )}

        {activeTab === 'security' && (
          <>
            {/* Quick Actions */}
            <div className="card-admin">
              <h3 className="text-lg font-semibold text-[color:var(--foreground)] mb-4">Security Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="flex items-center gap-3 p-4 border border-[color:var(--border)] rounded-lg hover:bg-[color:var(--accent)] transition-colors">
                  <Key className="w-5 h-5 text-[color:var(--muted-foreground)]" />
                  <div className="text-left">
                    <p className="font-medium text-[color:var(--foreground)]">Reset Password</p>
                    <p className="text-sm text-[color:var(--muted-foreground)]">Send password reset email</p>
                  </div>
                </button>
                
                <button className="flex items-center gap-3 p-4 border border-[color:var(--border)] rounded-lg hover:bg-[color:var(--accent)] transition-colors">
                  {patient.accountStatus === 'active' ? (
                    <UserX className="w-5 h-5 text-red-500" />
                  ) : (
                    <UserCheck className="w-5 h-5 text-green-500" />
                  )}
                  <div className="text-left">
                    <p className="font-medium text-[color:var(--foreground)]">
                      {patient.accountStatus === 'active' ? 'Suspend Account' : 'Activate Account'}
                    </p>
                    <p className="text-sm text-[color:var(--muted-foreground)]">
                      {patient.accountStatus === 'active' ? 'Temporarily disable access' : 'Restore account access'}
                    </p>
                  </div>
                </button>
                
                <button className="flex items-center gap-3 p-4 border border-[color:var(--border)] rounded-lg hover:bg-[color:var(--accent)] transition-colors">
                  <UserPlus className="w-5 h-5 text-orange-500" />
                  <div className="text-left">
                    <p className="font-medium text-[color:var(--foreground)]">Impersonate User</p>
                    <p className="text-sm text-[color:var(--muted-foreground)]">Login as this patient</p>
                  </div>
                </button>
                
                <button className="flex items-center gap-3 p-4 border border-[color:var(--border)] rounded-lg hover:bg-[color:var(--accent)] transition-colors">
                  <LogOut className="w-5 h-5 text-red-500" />
                  <div className="text-left">
                    <p className="font-medium text-[color:var(--foreground)]">Force Logout</p>
                    <p className="text-sm text-[color:var(--muted-foreground)]">End all active sessions</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Account Status */}
            <div className="card-admin">
              <h3 className="text-lg font-semibold text-[color:var(--foreground)] mb-4">Account Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[color:var(--muted-foreground)]">Current Status</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(patient.accountStatus)}`}>
                    {getStatusLabel(patient.accountStatus)}
                  </span>
                </div>
                
                {patient.suspendedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-[color:var(--muted-foreground)]">Suspended</span>
                    <span className="text-sm text-[color:var(--foreground)]">{formatDate(patient.suspendedAt)}</span>
                  </div>
                )}
                
                {patient.suspensionReason && (
                  <div className="flex items-center justify-between">
                    <span className="text-[color:var(--muted-foreground)]">Suspension Reason</span>
                    <span className="text-sm text-[color:var(--foreground)]">{patient.suspensionReason}</span>
                  </div>
                )}
                
                {patient.twoFactorEnabledAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-[color:var(--muted-foreground)]">2FA Enabled</span>
                    <span className="text-sm text-[color:var(--foreground)]">{formatDate(patient.twoFactorEnabledAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}