import React from "react";
import {
  User,
  Mail,
  Phone,
  Baby,
  IdCard,
  MessageCircle,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Patient } from "../types/user.types";
import { formatDateShort, formatGender } from "../utils/patient-utils";

interface PatientContactInfoProps {
  patient: Patient;
}

export default function PatientContactInfo({ patient }: PatientContactInfoProps) {
  return (
    <div className="card-admin">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[color:var(--primary)]/10 rounded-lg">
          <User className="w-5 h-5 text-[color:var(--primary)]" />
        </div>
        <h3 className="text-xl font-semibold text-[color:var(--foreground)]">Personal & Contact Information</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Column 1 - Basic Contact */}
        <div className="space-y-4">
          {/* Full Name */}
          <div className="flex items-center gap-3 p-4 bg-[color:var(--muted)]/20 rounded-lg">
            <User className="w-5 h-5 text-[color:var(--muted-foreground)]" />
            <div className="flex-1">
              <p className="text-sm text-[color:var(--muted-foreground)]">Full Name</p>
              <p className="font-medium text-[color:var(--foreground)]">
                {patient.name || 'Not provided'}
              </p>
            </div>
          </div>

          {/* Email */}
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
          
          {/* Phone */}
          <div className="flex items-center gap-3 p-4 bg-[color:var(--muted)]/20 rounded-lg">
            <Phone className="w-5 h-5 text-[color:var(--muted-foreground)]" />
            <div className="flex-1">
              <p className="text-sm text-[color:var(--muted-foreground)]">Phone Number</p>
              <p className="font-medium text-[color:var(--foreground)] flex items-center gap-2">
                {patient.phone || 'Not provided'}
                {patient.phone && (patient.phoneVerified ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                ))}
              </p>
            </div>
          </div>
        </div>
        
        {/* Column 2 - Demographics */}
        <div className="space-y-4">
          {/* Date of Birth */}
          <div className="flex items-center gap-3 p-4 bg-[color:var(--muted)]/20 rounded-lg">
            <Baby className="w-5 h-5 text-[color:var(--muted-foreground)]" />
            <div>
              <p className="text-sm text-[color:var(--muted-foreground)]">Date of Birth</p>
              <p className="font-medium text-[color:var(--foreground)]">
                {patient.dateOfBirth ? formatDateShort(patient.dateOfBirth) : 'Not provided'}
              </p>
            </div>
          </div>
          
          {/* Gender */}
          <div className="flex items-center gap-3 p-4 bg-[color:var(--muted)]/20 rounded-lg">
            <User className="w-5 h-5 text-[color:var(--muted-foreground)]" />
            <div>
              <p className="text-sm text-[color:var(--muted-foreground)]">Gender</p>
              <p className="font-medium text-[color:var(--foreground)] capitalize">
                {formatGender(patient.gender)}
              </p>
            </div>
          </div>

          {/* Patient ID */}
          <div className="flex items-center gap-3 p-4 bg-[color:var(--muted)]/20 rounded-lg">
            <IdCard className="w-5 h-5 text-[color:var(--muted-foreground)]" />
            <div>
              <p className="text-sm text-[color:var(--muted-foreground)]">Patient ID</p>
              <p className="font-medium text-[color:var(--foreground)] font-mono text-sm">
                {patient.id}
              </p>
            </div>
          </div>
        </div>

        {/* Column 3 - Communication Preferences */}
        <div className="space-y-4">
          {/* Communication Preferences */}
          <div className="p-4 bg-[color:var(--muted)]/20 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <MessageCircle className="w-5 h-5 text-[color:var(--muted-foreground)]" />
              <p className="text-sm text-[color:var(--muted-foreground)]">Communication Preferences</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[color:var(--foreground)]">Email Notifications</span>
                <div className="flex items-center gap-1">
                  {(patient as any).communicationPreferences?.email !== false ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-xs text-[color:var(--muted-foreground)]">
                    {(patient as any).communicationPreferences?.email !== false ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[color:var(--foreground)]">SMS Notifications</span>
                <div className="flex items-center gap-1">
                  {(patient as any).communicationPreferences?.sms !== false ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-xs text-[color:var(--muted-foreground)]">
                    {(patient as any).communicationPreferences?.sms !== false ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[color:var(--foreground)]">Push Notifications</span>
                <div className="flex items-center gap-1">
                  {(patient as any).communicationPreferences?.push !== false ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-xs text-[color:var(--muted-foreground)]">
                    {(patient as any).communicationPreferences?.push !== false ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Created */}
          <div className="flex items-center gap-3 p-4 bg-[color:var(--muted)]/20 rounded-lg">
            <Calendar className="w-5 h-5 text-[color:var(--muted-foreground)]" />
            <div>
              <p className="text-sm text-[color:var(--muted-foreground)]">Member Since</p>
              <p className="font-medium text-[color:var(--foreground)]">
                {formatDateShort(patient.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}