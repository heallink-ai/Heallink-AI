"use client";

import { useState } from "react";
import { StaffMemberData, removeStaffMember } from "../../api/staff-api";
import { User, Mail, Phone, Shield, Clock, Trash2, Edit } from "lucide-react";
import Button from "../ui/Button";

interface StaffCardProps {
  staff: StaffMemberData;
  onUpdate: () => void;
}

export default function StaffCard({ staff, onUpdate }: StaffCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to remove ${staff.name} from staff?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await removeStaffMember(staff.id);
      if (result.error) {
        alert(`Error: ${result.error}`);
      } else {
        onUpdate();
      }
    } catch (error) {
      alert("Failed to remove staff member");
    } finally {
      setIsDeleting(false);
    }
  };

  const getRoleColor = (role: string) => {
    const colors = {
      doctor: "bg-blue-100 text-blue-800",
      nurse: "bg-green-100 text-green-800",
      admin: "bg-purple-100 text-purple-800",
      receptionist: "bg-yellow-100 text-yellow-800",
      technician: "bg-orange-100 text-orange-800",
    };
    return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="neumorph-card p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 bg-gradient-to-br from-purple-heart/20 to-royal-blue/20 rounded-xl flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{staff.name}</h3>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(staff.role)}`}>
              {staff.role.charAt(0).toUpperCase() + staff.role.slice(1)}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`h-3 w-3 rounded-full ${staff.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-muted-foreground">
            {staff.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {staff.email && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>{staff.email}</span>
          </div>
        )}
        {staff.phone && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{staff.phone}</span>
          </div>
        )}
        {staff.specialization && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>{staff.specialization}</span>
          </div>
        )}
        {staff.department && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{staff.department}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          Added: {new Date(staff.created).toLocaleDateString()}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDelete}
            isLoading={isDeleting}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}