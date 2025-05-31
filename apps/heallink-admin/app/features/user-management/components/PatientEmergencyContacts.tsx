import React from "react";
import {
  AlertCircle,
  Crown,
  User,
  Users,
  Phone,
  Mail,
  Plus,
} from "lucide-react";
import { Patient } from "../types/user.types";

interface PatientEmergencyContactsProps {
  patient: Patient;
  onAddContact?: () => void;
}

export default function PatientEmergencyContacts({ patient, onAddContact }: PatientEmergencyContactsProps) {
  const hasEmergencyContacts = patient.emergencyContact || 
    ((patient as any).emergencyContacts && (patient as any).emergencyContacts.length > 0);

  return (
    <div className="card-admin">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 dark:bg-red-950 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-[color:var(--foreground)]">Emergency Contacts</h3>
        </div>
        {onAddContact && (
          <button 
            onClick={onAddContact}
            className="flex items-center gap-2 px-3 py-2 bg-[color:var(--muted)] hover:bg-[color:var(--accent)] rounded-lg transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Contact
          </button>
        )}
      </div>
      
      {hasEmergencyContacts ? (
        <div className="space-y-4">
          {/* Primary Emergency Contact */}
          {patient.emergencyContact && (
            <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-red-600 dark:text-red-400 flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  Primary Emergency Contact
                </span>
                <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 rounded-full text-xs font-medium">
                  Active
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-red-500" />
                  <div>
                    <p className="text-xs text-red-600 dark:text-red-400">Name</p>
                    <p className="font-semibold text-[color:var(--foreground)]">{patient.emergencyContact.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-red-500" />
                  <div>
                    <p className="text-xs text-red-600 dark:text-red-400">Relationship</p>
                    <p className="font-semibold text-[color:var(--foreground)] capitalize">{patient.emergencyContact.relationship}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-red-500" />
                  <div>
                    <p className="text-xs text-red-600 dark:text-red-400">Phone</p>
                    <p className="font-semibold text-[color:var(--foreground)]">{patient.emergencyContact.phone}</p>
                  </div>
                </div>
                {patient.emergencyContact.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-red-500" />
                    <div>
                      <p className="text-xs text-red-600 dark:text-red-400">Email</p>
                      <p className="font-semibold text-[color:var(--foreground)]">{patient.emergencyContact.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Emergency Contacts */}
          {(patient as any).emergencyContacts && (patient as any).emergencyContacts.length > 0 && (
            <div className="space-y-3">
              {(patient as any).emergencyContacts.map((contact: any, index: number) => (
                <div key={index} className="p-4 bg-[color:var(--muted)]/20 rounded-lg border border-[color:var(--border)]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-[color:var(--foreground)]">
                      Emergency Contact #{index + 1}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      contact.isActive ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400' : 
                      'bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-400'
                    }`}>
                      {contact.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-[color:var(--muted-foreground)]" />
                      <div>
                        <p className="text-xs text-[color:var(--muted-foreground)]">Name</p>
                        <p className="font-medium text-[color:var(--foreground)]">{contact.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-[color:var(--muted-foreground)]" />
                      <div>
                        <p className="text-xs text-[color:var(--muted-foreground)]">Relationship</p>
                        <p className="font-medium text-[color:var(--foreground)] capitalize">{contact.relationship}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-[color:var(--muted-foreground)]" />
                      <div>
                        <p className="text-xs text-[color:var(--muted-foreground)]">Phone</p>
                        <p className="font-medium text-[color:var(--foreground)]">{contact.phone}</p>
                      </div>
                    </div>
                    {contact.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-[color:var(--muted-foreground)]" />
                        <div>
                          <p className="text-xs text-[color:var(--muted-foreground)]">Email</p>
                          <p className="font-medium text-[color:var(--foreground)]">{contact.email}</p>
                        </div>
                      </div>
                    )}
                    {contact.permissions && contact.permissions.length > 0 && (
                      <div className="md:col-span-2">
                        <p className="text-xs text-[color:var(--muted-foreground)] mb-1">Permissions</p>
                        <div className="flex flex-wrap gap-1">
                          {contact.permissions.map((permission: string, idx: number) => (
                            <span key={idx} className="px-2 py-1 bg-[color:var(--muted)]/30 rounded text-xs">
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
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="p-3 bg-red-100 dark:bg-red-950/20 rounded-full w-fit mx-auto mb-3">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h4 className="text-lg font-semibold text-[color:var(--foreground)] mb-1">No Emergency Contacts</h4>
          <p className="text-[color:var(--muted-foreground)] mb-4">It's important to have emergency contacts on file for patient safety.</p>
          {onAddContact && (
            <button 
              onClick={onAddContact}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors mx-auto"
            >
              <Plus className="w-4 h-4" />
              Add Emergency Contact
            </button>
          )}
        </div>
      )}
    </div>
  );
}