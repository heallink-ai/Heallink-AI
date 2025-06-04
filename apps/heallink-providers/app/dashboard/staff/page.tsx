"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { StaffMemberData } from "../../api/staff-api";
import StaffCard from "../../components/staff/StaffCard";
import SearchBar from "../../components/staff/SearchBar";
import Button from "../../components/ui/Button";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { Plus, Users, Filter } from "lucide-react";

// Dummy data for staff members
const DUMMY_STAFF: StaffMemberData[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@heallink.com",
    role: "doctor",
    specialization: "Cardiology",
    licenseNumber: "MD-12345",
    isActive: true,
    workingHours: {
      monday: { start: "09:00", end: "17:00" },
      tuesday: { start: "09:00", end: "17:00" },
      wednesday: { start: "09:00", end: "17:00" },
      thursday: { start: "09:00", end: "17:00" },
      friday: { start: "09:00", end: "15:00" }
    },
    permissions: {
      canViewPatients: true,
      canEditPatients: true,
      canDeletePatients: false,
      canManageAppointments: true,
      canAccessReports: true
    }
  },
  {
    id: "2",
    name: "Nurse Emily Davis",
    email: "emily.davis@heallink.com",
    role: "nurse",
    specialization: "Emergency Care",
    licenseNumber: "RN-67890",
    isActive: true,
    workingHours: {
      monday: { start: "08:00", end: "16:00" },
      tuesday: { start: "08:00", end: "16:00" },
      wednesday: { start: "08:00", end: "16:00" },
      thursday: { start: "08:00", end: "16:00" },
      friday: { start: "08:00", end: "16:00" }
    },
    permissions: {
      canViewPatients: true,
      canEditPatients: true,
      canDeletePatients: false,
      canManageAppointments: true,
      canAccessReports: false
    }
  },
  {
    id: "3",
    name: "Dr. Michael Chen",
    email: "michael.chen@heallink.com",
    role: "doctor",
    specialization: "Pediatrics",
    licenseNumber: "MD-54321",
    isActive: true,
    workingHours: {
      monday: { start: "10:00", end: "18:00" },
      tuesday: { start: "10:00", end: "18:00" },
      wednesday: { start: "10:00", end: "18:00" },
      thursday: { start: "10:00", end: "18:00" },
      friday: { start: "10:00", end: "16:00" }
    },
    permissions: {
      canViewPatients: true,
      canEditPatients: true,
      canDeletePatients: false,
      canManageAppointments: true,
      canAccessReports: true
    }
  },
  {
    id: "4",
    name: "Lisa Rodriguez",
    email: "lisa.rodriguez@heallink.com",
    role: "admin",
    specialization: "Healthcare Administration",
    licenseNumber: "HA-11111",
    isActive: true,
    workingHours: {
      monday: { start: "09:00", end: "17:00" },
      tuesday: { start: "09:00", end: "17:00" },
      wednesday: { start: "09:00", end: "17:00" },
      thursday: { start: "09:00", end: "17:00" },
      friday: { start: "09:00", end: "17:00" }
    },
    permissions: {
      canViewPatients: true,
      canEditPatients: true,
      canDeletePatients: true,
      canManageAppointments: true,
      canAccessReports: true
    }
  },
  {
    id: "5",
    name: "Nurse James Wilson",
    email: "james.wilson@heallink.com",
    role: "nurse",
    specialization: "Surgical Care",
    licenseNumber: "RN-22222",
    isActive: true,
    workingHours: {
      monday: { start: "07:00", end: "15:00" },
      tuesday: { start: "07:00", end: "15:00" },
      wednesday: { start: "07:00", end: "15:00" },
      thursday: { start: "07:00", end: "15:00" },
      friday: { start: "07:00", end: "15:00" }
    },
    permissions: {
      canViewPatients: true,
      canEditPatients: true,
      canDeletePatients: false,
      canManageAppointments: true,
      canAccessReports: false
    }
  },
  {
    id: "6",
    name: "Maria Garcia",
    email: "maria.garcia@heallink.com",
    role: "receptionist",
    specialization: "Patient Services",
    licenseNumber: "PS-33333",
    isActive: true,
    workingHours: {
      monday: { start: "08:00", end: "16:00" },
      tuesday: { start: "08:00", end: "16:00" },
      wednesday: { start: "08:00", end: "16:00" },
      thursday: { start: "08:00", end: "16:00" },
      friday: { start: "08:00", end: "16:00" }
    },
    permissions: {
      canViewPatients: true,
      canEditPatients: false,
      canDeletePatients: false,
      canManageAppointments: true,
      canAccessReports: false
    }
  },
  {
    id: "7",
    name: "Dr. Amanda Thompson",
    email: "amanda.thompson@heallink.com",
    role: "doctor",
    specialization: "Dermatology",
    licenseNumber: "MD-98765",
    isActive: false,
    workingHours: {
      monday: { start: "09:00", end: "17:00" },
      tuesday: { start: "09:00", end: "17:00" },
      wednesday: { start: "09:00", end: "17:00" },
      thursday: { start: "09:00", end: "17:00" },
      friday: { start: "09:00", end: "17:00" }
    },
    permissions: {
      canViewPatients: true,
      canEditPatients: true,
      canDeletePatients: false,
      canManageAppointments: true,
      canAccessReports: true
    }
  },
  {
    id: "8",
    name: "Robert Kim",
    email: "robert.kim@heallink.com",
    role: "technician",
    specialization: "Medical Technology",
    licenseNumber: "MT-44444",
    isActive: true,
    workingHours: {
      monday: { start: "08:00", end: "16:00" },
      tuesday: { start: "08:00", end: "16:00" },
      wednesday: { start: "08:00", end: "16:00" },
      thursday: { start: "08:00", end: "16:00" },
      friday: { start: "08:00", end: "16:00" }
    },
    permissions: {
      canViewPatients: true,
      canEditPatients: false,
      canDeletePatients: false,
      canManageAppointments: false,
      canAccessReports: false
    }
  }
];

export default function StaffPage() {
  const router = useRouter();
  const [staff, setStaff] = useState<StaffMemberData[]>(DUMMY_STAFF);
  const [filteredStaff, setFilteredStaff] = useState<StaffMemberData[]>(DUMMY_STAFF);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filter staff based on role filter
  const roleFilteredStaff = roleFilter 
    ? staff.filter(member => member.role === roleFilter)
    : staff;

  const totalStaff = roleFilteredStaff.length;

  const loadStaff = useCallback(() => {
    // Simulate loading with dummy data
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    // Apply role filter first, then search filter
    let filtered = roleFilter 
      ? staff.filter(member => member.role === roleFilter)
      : staff;

    if (searchQuery) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredStaff(filtered);
  }, [staff, searchQuery, roleFilter]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Paginate the filtered staff
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedStaff = filteredStaff.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [roleFilter, searchQuery]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="neumorph-card p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadStaff}>Try Again</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Staff Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage your healthcare team members
            </p>
          </div>
          <Button onClick={() => router.push('/dashboard/staff/new')}>
            <Plus className="h-4 w-4" />
            Add New Staff
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="neumorph-card p-4">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Staff</p>
                <p className="text-2xl font-bold">{staff.length}</p>
              </div>
            </div>
          </div>
          <div className="neumorph-card p-4">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{staff.filter(s => s.isActive).length}</p>
              </div>
            </div>
          </div>
          <div className="neumorph-card p-4">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Doctors</p>
                <p className="text-2xl font-bold">{staff.filter(s => s.role === 'doctor').length}</p>
              </div>
            </div>
          </div>
          <div className="neumorph-card p-4">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Nurses</p>
                <p className="text-2xl font-bold">{staff.filter(s => s.role === 'nurse').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} placeholder="Search staff by name, email, role, or specialization..." />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="neumorph-flat bg-background border border-border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Roles</option>
              <option value="doctor">Doctors</option>
              <option value="nurse">Nurses</option>
              <option value="admin">Administrators</option>
              <option value="receptionist">Receptionists</option>
              <option value="technician">Technicians</option>
            </select>
          </div>
        </div>

        {/* Staff Grid */}
        {paginatedStaff.length === 0 ? (
          <div className="neumorph-card p-12 text-center">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Staff Members Found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || roleFilter ? "No staff members match your search criteria." : "Get started by adding your first staff member."}
            </p>
            <Button onClick={() => router.push('/dashboard/staff/new')}>
              <Plus className="h-4 w-4" />
              Add First Staff Member
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedStaff.map((member) => (
              <StaffCard
                key={member.id}
                staff={member}
                onUpdate={loadStaff}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}