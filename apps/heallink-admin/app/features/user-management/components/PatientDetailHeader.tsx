import React from "react";
import {
  ArrowLeft,
  User,
  Calendar,
  Clock,
  Crown,
  Shield,
  Sparkles,
  CheckCircle,
  Edit,
  Download,
} from "lucide-react";
import { Patient } from "../types/user.types";
import { 
  formatDateShort, 
  getStatusColor, 
  getStatusLabel, 
  getPlanStyle,
  getPatientInitials
} from "../utils/patient-utils";

interface PatientDetailHeaderProps {
  patient: Patient;
  onBackToList: () => void;
  onEditPatient: () => void;
  onExportData: () => void;
}

export default function PatientDetailHeader({
  patient,
  onBackToList,
  onEditPatient,
  onExportData,
}: PatientDetailHeaderProps) {
  const getPlanIcon = (plan: string) => {
    if (plan === "premium") return <Crown className="w-5 h-5 text-purple-500" />;
    if (plan === "basic") return <Shield className="w-5 h-5 text-blue-500" />;
    return <User className="w-5 h-5 text-gray-500" />;
  };

  return (
    <>
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            onClick={onBackToList}
            className="p-2 rounded-full hover:bg-[color:var(--accent)]/20 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-[color:var(--foreground)]">Patient Profile</h1>
            <p className="text-[color:var(--muted-foreground)]">Comprehensive patient information and management</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={onExportData}
            className="flex items-center gap-2 px-4 py-2 bg-[color:var(--muted)] hover:bg-[color:var(--accent)] rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button 
            onClick={onEditPatient}
            className="flex items-center gap-2 px-6 py-2 bg-[color:var(--primary)] text-[color:var(--primary-foreground)] hover:bg-[color:var(--primary)]/90 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit Patient
          </button>
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
                    <span className="text-2xl font-bold text-[color:var(--primary)]">
                      {getPatientInitials(patient.name)}
                    </span>
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
                      <p className={`font-semibold flex items-center gap-1 ${patient.twoFactorEnabled ? 'text-green-600' : 'text-red-600'}`}>
                        <CheckCircle className="w-4 h-4" />
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
    </>
  );
}