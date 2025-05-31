"use client";

import React, { useState } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Shield,
  Heart,
  CreditCard,
  Activity,
  FileText,
  Settings,
  Edit,
  Key,
  UserX,
  UserCheck,
  LogOut,
  UserPlus,
  Clock,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  History,
} from "lucide-react";
import { PatientDetailDrawerProps, AccountStatus, Patient, PatientDetail } from "../types/user.types";

interface PatientDetailDrawerComponentProps extends Omit<PatientDetailDrawerProps, 'patient'> {
  patient: Patient | PatientDetail | null;
}

export default function PatientDetailDrawer({
  patient,
  isOpen,
  onClose,
  onEdit,
  onStatusChange,
  onResetPassword,
  onImpersonate,
  onTerminateSessions,
  onAddNote,
}: PatientDetailDrawerComponentProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'medical' | 'insurance' | 'activity' | 'security'>('profile');

  if (!isOpen || !patient) return null;

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

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'medical', label: 'Medical', icon: Heart },
    { id: 'insurance', label: 'Insurance', icon: CreditCard },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-4xl bg-[color:var(--background)] border-l border-[color:var(--border)] shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex-none border-b border-[color:var(--border)] p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative">
                {patient.avatarUrl ? (
                  <img
                    src={patient.avatarUrl}
                    alt={patient.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-[color:var(--border)]"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[color:var(--primary)]/20 to-[color:var(--primary)]/5 border-2 border-[color:var(--border)] flex items-center justify-center">
                    <User className="w-8 h-8 text-[color:var(--primary)]" />
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
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-[color:var(--foreground)]">
                    {patient.name}
                  </h2>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(patient.accountStatus)}`}>
                    <div className={`w-2 h-2 rounded-full ${
                      patient.accountStatus === 'active' ? 'bg-emerald-500' : 
                      patient.accountStatus === 'pending_verification' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`} />
                    {getStatusLabel(patient.accountStatus)}
                  </span>
                </div>
                
                <div className="flex items-center gap-6 text-sm text-[color:var(--muted-foreground)]">
                  <div className="flex items-center gap-1">
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
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(patient)}
                className="p-2 rounded-lg bg-[color:var(--muted)] hover:bg-[color:var(--accent)] transition-colors"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-[color:var(--muted)] hover:bg-[color:var(--accent)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex-none border-b border-[color:var(--border)] px-6">
          <div className="flex gap-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center gap-2 px-4 py-3 rounded-t-lg font-medium transition-colors ${
                  activeTab === id
                    ? 'bg-[color:var(--card)] text-[color:var(--primary)] border-b-2 border-[color:var(--primary)]'
                    : 'text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="card-admin">
                <h3 className="text-lg font-semibold text-[color:var(--foreground)] mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[color:var(--muted-foreground)]" />
                    <div>
                      <p className="text-sm text-[color:var(--muted-foreground)]">Email</p>
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
                        <p className="text-sm text-[color:var(--muted-foreground)]">Phone</p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {patient.dateOfBirth && (
                    <div>
                      <p className="text-sm text-[color:var(--muted-foreground)]">Date of Birth</p>
                      <p className="font-medium text-[color:var(--foreground)]">{patient.dateOfBirth}</p>
                    </div>
                  )}
                  
                  {patient.gender && (
                    <div>
                      <p className="text-sm text-[color:var(--muted-foreground)]">Gender</p>
                      <p className="font-medium text-[color:var(--foreground)] capitalize">{patient.gender}</p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm text-[color:var(--muted-foreground)]">Subscription Plan</p>
                    <p className="font-medium text-[color:var(--foreground)] capitalize">{patient.subscriptionPlan}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-[color:var(--muted-foreground)]">Two-Factor Auth</p>
                    <p className={`font-medium ${
                      patient.twoFactorEnabled ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {patient.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </p>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-[color:var(--muted-foreground)]">Name</p>
                      <p className="font-medium text-[color:var(--foreground)]">{patient.emergencyContact.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[color:var(--muted-foreground)]">Relationship</p>
                      <p className="font-medium text-[color:var(--foreground)]">{patient.emergencyContact.relationship}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[color:var(--muted-foreground)]">Phone</p>
                      <p className="font-medium text-[color:var(--foreground)]">{patient.emergencyContact.phone}</p>
                    </div>
                    {patient.emergencyContact.email && (
                      <div>
                        <p className="text-sm text-[color:var(--muted-foreground)]">Email</p>
                        <p className="font-medium text-[color:var(--foreground)]">{patient.emergencyContact.email}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'medical' && (
            <div className="space-y-6">
              {patient.medicalInformation ? (
                <>
                  {patient.medicalInformation.bloodType && (
                    <div className="card-admin">
                      <h3 className="text-lg font-semibold text-[color:var(--foreground)] mb-4">Blood Type</h3>
                      <p className="text-2xl font-bold text-[color:var(--primary)]">{patient.medicalInformation.bloodType}</p>
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
            </div>
          )}

          {activeTab === 'insurance' && (
            <div className="space-y-6">
              {patient.insurance ? (
                <div className="card-admin">
                  <h3 className="text-lg font-semibold text-[color:var(--foreground)] mb-4">Insurance Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {patient.insurance.provider && (
                      <div>
                        <p className="text-sm text-[color:var(--muted-foreground)]">Provider</p>
                        <p className="font-medium text-[color:var(--foreground)]">{patient.insurance.provider}</p>
                      </div>
                    )}
                    
                    {patient.insurance.policyNumber && (
                      <div>
                        <p className="text-sm text-[color:var(--muted-foreground)]">Policy Number</p>
                        <p className="font-medium text-[color:var(--foreground)] font-mono">{patient.insurance.policyNumber}</p>
                      </div>
                    )}
                    
                    {patient.insurance.groupNumber && (
                      <div>
                        <p className="text-sm text-[color:var(--muted-foreground)]">Group Number</p>
                        <p className="font-medium text-[color:var(--foreground)] font-mono">{patient.insurance.groupNumber}</p>
                      </div>
                    )}
                    
                    {patient.insurance.primaryInsured && (
                      <div>
                        <p className="text-sm text-[color:var(--muted-foreground)]">Primary Insured</p>
                        <p className="font-medium text-[color:var(--foreground)]">{patient.insurance.primaryInsured}</p>
                      </div>
                    )}
                    
                    {patient.insurance.relationship && (
                      <div>
                        <p className="text-sm text-[color:var(--muted-foreground)]">Relationship</p>
                        <p className="font-medium text-[color:var(--foreground)]">{patient.insurance.relationship}</p>
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
              ) : (
                <div className="card-admin text-center py-12">
                  <CreditCard className="w-16 h-16 text-[color:var(--muted-foreground)] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-[color:var(--foreground)] mb-2">No Insurance Information</h3>
                  <p className="text-[color:var(--muted-foreground)]">Insurance information has not been provided yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-6">
              {(patient as PatientDetail).activityLog && (patient as PatientDetail).activityLog!.length > 0 ? (
                <div className="space-y-4">
                  {(patient as PatientDetail).activityLog!.map((activity: any) => (
                    <div key={activity.id} className="card-admin">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-[color:var(--muted)] rounded-lg">
                          <History className="w-4 h-4 text-[color:var(--muted-foreground)]" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-[color:var(--foreground)]">{activity.action}</h4>
                          <p className="text-sm text-[color:var(--muted-foreground)] mt-1">{activity.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-[color:var(--muted-foreground)]">
                            <span>{formatDate(activity.timestamp)}</span>
                            {activity.ipAddress && (
                              <span>IP: {activity.ipAddress}</span>
                            )}
                            {activity.outcome && (
                              <span className={`px-2 py-1 rounded ${
                                activity.outcome === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
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
                  <Activity className="w-16 h-16 text-[color:var(--muted-foreground)] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-[color:var(--foreground)] mb-2">No Activity Log</h3>
                  <p className="text-[color:var(--muted-foreground)]">No recent activity to display.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="card-admin">
                <h3 className="text-lg font-semibold text-[color:var(--foreground)] mb-4">Security Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => onResetPassword(patient.id)}
                    className="flex items-center gap-3 p-4 border border-[color:var(--border)] rounded-lg hover:bg-[color:var(--accent)] transition-colors"
                  >
                    <Key className="w-5 h-5 text-[color:var(--muted-foreground)]" />
                    <div className="text-left">
                      <p className="font-medium text-[color:var(--foreground)]">Reset Password</p>
                      <p className="text-sm text-[color:var(--muted-foreground)]">Send password reset email</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => onStatusChange(
                      patient.id, 
                      patient.accountStatus === 'active' ? AccountStatus.SUSPENDED : AccountStatus.ACTIVE,
                      'Admin action from detail view'
                    )}
                    className="flex items-center gap-3 p-4 border border-[color:var(--border)] rounded-lg hover:bg-[color:var(--accent)] transition-colors"
                  >
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
                  
                  <button
                    onClick={() => onImpersonate(patient.id)}
                    className="flex items-center gap-3 p-4 border border-[color:var(--border)] rounded-lg hover:bg-[color:var(--accent)] transition-colors"
                  >
                    <UserPlus className="w-5 h-5 text-orange-500" />
                    <div className="text-left">
                      <p className="font-medium text-[color:var(--foreground)]">Impersonate User</p>
                      <p className="text-sm text-[color:var(--muted-foreground)]">Login as this patient</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => onTerminateSessions(patient.id)}
                    className="flex items-center gap-3 p-4 border border-[color:var(--border)] rounded-lg hover:bg-[color:var(--accent)] transition-colors"
                  >
                    <LogOut className="w-5 h-5 text-red-500" />
                    <div className="text-left">
                      <p className="font-medium text-[color:var(--foreground)]">Force Logout</p>
                      <p className="text-sm text-[color:var(--muted-foreground)]">End all active sessions</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Active Sessions */}
              {patient.activeSessions && patient.activeSessions.length > 0 && (
                <div className="card-admin">
                  <h3 className="text-lg font-semibold text-[color:var(--foreground)] mb-4">Active Sessions</h3>
                  <div className="space-y-3">
                    {patient.activeSessions.map((session) => (
                      <div key={session.sessionId} className="flex items-center justify-between p-3 border border-[color:var(--border)] rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-[color:var(--foreground)]">{session.deviceInfo}</p>
                          <p className="text-sm text-[color:var(--muted-foreground)]">IP: {session.ipAddress}</p>
                          <p className="text-xs text-[color:var(--muted-foreground)]">Last active: {formatDate(session.lastActivity)}</p>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${
                          session.isActive ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Account Status History */}
              <div className="card-admin">
                <h3 className="text-lg font-semibold text-[color:var(--foreground)] mb-4">Account Status</h3>
                <div className="space-y-3">
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
            </div>
          )}
        </div>
      </div>
    </>
  );
}