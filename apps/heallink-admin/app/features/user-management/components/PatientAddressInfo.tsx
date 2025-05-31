import React from "react";
import {
  Home,
  MapPin,
  Globe,
  Plus,
} from "lucide-react";
import { Patient } from "../types/user.types";

interface PatientAddressInfoProps {
  patient: Patient;
  onAddAddress?: () => void;
}

export default function PatientAddressInfo({ patient, onAddAddress }: PatientAddressInfoProps) {
  return (
    <div className="card-admin">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[color:var(--primary)]/10 rounded-lg">
          <Home className="w-5 h-5 text-[color:var(--primary)]" />
        </div>
        <h3 className="text-xl font-semibold text-[color:var(--foreground)]">Address Information</h3>
      </div>
      
      {patient.address ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Street Address */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-[color:var(--muted)]/20 rounded-lg">
              <Home className="w-5 h-5 text-[color:var(--muted-foreground)]" />
              <div className="flex-1">
                <p className="text-sm text-[color:var(--muted-foreground)]">Street Address</p>
                <p className="font-medium text-[color:var(--foreground)]">
                  {patient.address.streetAddress || 'Not provided'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-[color:var(--muted)]/20 rounded-lg">
              <MapPin className="w-5 h-5 text-[color:var(--muted-foreground)]" />
              <div className="flex-1">
                <p className="text-sm text-[color:var(--muted-foreground)]">City</p>
                <p className="font-medium text-[color:var(--foreground)]">
                  {patient.address.city || 'Not provided'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-[color:var(--muted)]/20 rounded-lg">
              <MapPin className="w-5 h-5 text-[color:var(--muted-foreground)]" />
              <div className="flex-1">
                <p className="text-sm text-[color:var(--muted-foreground)]">State/Province</p>
                <p className="font-medium text-[color:var(--foreground)]">
                  {patient.address.state || 'Not provided'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-[color:var(--muted)]/20 rounded-lg">
              <Globe className="w-5 h-5 text-[color:var(--muted-foreground)]" />
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-[color:var(--muted-foreground)]">ZIP/Postal Code</p>
                    <p className="font-medium text-[color:var(--foreground)]">
                      {patient.address.zipCode || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[color:var(--muted-foreground)]">Country</p>
                    <p className="font-medium text-[color:var(--foreground)]">
                      {patient.address.country || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="p-3 bg-[color:var(--muted)]/20 rounded-full w-fit mx-auto mb-3">
            <Home className="w-8 h-8 text-[color:var(--muted-foreground)]" />
          </div>
          <p className="text-[color:var(--muted-foreground)]">No address information provided</p>
          {onAddAddress && (
            <button 
              onClick={onAddAddress}
              className="mt-3 flex items-center gap-2 px-4 py-2 bg-[color:var(--primary)] text-[color:var(--primary-foreground)] rounded-lg hover:bg-[color:var(--primary)]/90 transition-colors mx-auto"
            >
              <Plus className="w-4 h-4" />
              Add Address
            </button>
          )}
        </div>
      )}
    </div>
  );
}