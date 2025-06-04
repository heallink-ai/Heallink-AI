"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addStaffMember, StaffMemberData } from "../../../api/staff-api";
import Button from "../../../components/ui/Button";
import { ArrowLeft, User, Mail, Phone, Shield, Building, Clock } from "lucide-react";

type StaffFormData = Omit<StaffMemberData, "id" | "created" | "lastActive">;

export default function NewStaffPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<StaffFormData>({
    name: "",
    email: "",
    phone: "",
    role: "nurse",
    specialization: "",
    licenseNumber: "",
    department: "",
    isActive: true,
    permissions: {
      canViewPatients: false,
      canEditPatients: false,
      canManageSchedule: false,
      canAccessBilling: false,
      canManageStaff: false,
    },
    workingHours: {},
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await addStaffMember(formData);
      if (result.error) {
        alert(`Error: ${result.error}`);
      } else {
        router.push('/dashboard/staff');
      }
    } catch (error) {
      alert("Failed to add staff member");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof StaffFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePermissionChange = (permission: keyof StaffFormData['permissions'], value: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: value,
      },
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Add New Staff Member</h1>
          <p className="text-muted-foreground mt-1">
            Add a new team member to your healthcare practice
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="neumorph-card p-6 space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            <User className="h-5 w-5 mr-2" />
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full neumorph-flat bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter full name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Role *
              </label>
              <select
                required
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value as StaffFormData['role'])}
                className="w-full neumorph-flat bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                <option value="admin">Administrator</option>
                <option value="receptionist">Receptionist</option>
                <option value="technician">Technician</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Mail className="h-4 w-4 inline mr-1" />
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full neumorph-flat bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter email address"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Phone className="h-4 w-4 inline mr-1" />
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full neumorph-flat bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter phone number"
              />
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Professional Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Specialization
              </label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) => handleInputChange('specialization', e.target.value)}
                className="w-full neumorph-flat bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Cardiology, Pediatrics"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                License Number
              </label>
              <input
                type="text"
                value={formData.licenseNumber}
                onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                className="w-full neumorph-flat bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter license number"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <Building className="h-4 w-4 inline mr-1" />
              Department
            </label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              className="w-full neumorph-flat bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Emergency, Surgery, Outpatient"
            />
          </div>
        </div>

        {/* Permissions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Permissions
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(formData.permissions).map(([key, value]) => (
              <label key={key} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handlePermissionChange(key as keyof StaffFormData['permissions'], e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                />
                <span className="text-sm text-foreground">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Status
          </h3>
          
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => handleInputChange('isActive', e.target.checked)}
              className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
            />
            <span className="text-sm text-foreground">Active Staff Member</span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
          >
            Add Staff Member
          </Button>
        </div>
      </form>
    </div>
  );
}