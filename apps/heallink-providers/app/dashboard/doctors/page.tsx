"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchDoctors, getSpecializations } from "../../api/doctor-api";
import DoctorCard from "../../components/doctors/DoctorCard";
import SearchBar from "../../components/ui/SearchBar";
import Button from "../../components/ui/Button";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { Plus, Users, Filter } from "lucide-react";

export default function DoctorsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 9;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["doctors", currentPage, searchTerm, selectedSpecialization],
    queryFn: () => fetchDoctors(currentPage, itemsPerPage, searchTerm, selectedSpecialization),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const doctors = data?.data?.doctors || [];
  const totalDoctors = data?.data?.total || 0;
  const totalPages = Math.ceil(totalDoctors / itemsPerPage);
  const specializations = getSpecializations();

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleSpecializationFilter = (specialization: string) => {
    setSelectedSpecialization(specialization);
    setCurrentPage(1);
  };

  const handleAddDoctor = () => {
    router.push("/dashboard/doctors/new");
  };

  const handleViewDoctor = (id: string) => {
    router.push(`/dashboard/doctors/${id}`);
  };

  const handleEditDoctor = (id: string) => {
    router.push(`/dashboard/doctors/${id}/edit`);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">Error loading doctors</div>
          <Button onClick={() => refetch()} variant="outline">
            Try Again
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-heart" />
              Doctors Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your medical staff and their information
            </p>
          </div>
          <Button onClick={handleAddDoctor} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New Doctor
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Search doctors by name, email, or specialization..."
                onSearch={handleSearch}
                value={searchTerm}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="neumorph-card p-4">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleSpecializationFilter("")}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedSpecialization === ""
                      ? "bg-purple-heart text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All Specializations
                </button>
                {specializations.map((spec) => (
                  <button
                    key={spec}
                    onClick={() => handleSpecializationFilter(spec)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedSpecialization === spec
                        ? "bg-purple-heart text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="bg-blue-50 px-3 py-1 rounded-full">
              Total: {totalDoctors} doctors
            </span>
            <span className="bg-green-50 px-3 py-1 rounded-full">
              Active: {doctors.filter(d => d.isActive).length}
            </span>
            {selectedSpecialization && (
              <span className="bg-purple-50 px-3 py-1 rounded-full">
                {selectedSpecialization}: {doctors.length}
              </span>
            )}
          </div>
        </div>

        {/* Doctors Grid */}
        {doctors.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || selectedSpecialization ? "No doctors found" : "No doctors yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedSpecialization
                ? "Try adjusting your search criteria or filters"
                : "Get started by adding your first doctor"}
            </p>
            {!searchTerm && !selectedSpecialization && (
              <Button onClick={handleAddDoctor}>
                Add Your First Doctor
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  onView={handleViewDoctor}
                  onEdit={handleEditDoctor}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded text-sm ${
                        currentPage === page
                          ? "bg-purple-heart text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
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
          </>
        )}
      </div>
    </DashboardLayout>
  );
}