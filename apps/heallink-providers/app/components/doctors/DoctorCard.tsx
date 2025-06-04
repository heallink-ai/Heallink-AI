"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DoctorData, removeDoctor } from "../../api/doctor-api";
import Button from "../ui/Button";
import { Eye, Edit, Trash2, Phone, Mail, Award, Clock } from "lucide-react";

interface DoctorCardProps {
  doctor: DoctorData;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
}

export default function DoctorCard({ doctor, onView, onEdit }: DoctorCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: removeDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      setIsDeleting(false);
    },
    onError: () => {
      setIsDeleting(false);
    }
  });

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to remove Dr. ${doctor.name}?`)) {
      setIsDeleting(true);
      deleteMutation.mutate(doctor.id);
    }
  };

  return (
    <div className="neumorph-card p-6 hover:shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-heart to-royal-blue rounded-full flex items-center justify-center text-white font-semibold text-lg">
            {doctor.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
            <p className="text-sm text-purple-heart font-medium">{doctor.specialization}</p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          doctor.isActive 
            ? "bg-green-100 text-green-800" 
            : "bg-red-100 text-red-800"
        }`}>
          {doctor.isActive ? "Active" : "Inactive"}
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="w-4 h-4 mr-2" />
          <span className="truncate">{doctor.email}</span>
        </div>
        {doctor.phone && (
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-2" />
            <span>{doctor.phone}</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Award className="w-4 h-4 mr-2" />
          <span>License: {doctor.licenseNumber}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          <span>{doctor.experience} years experience</span>
        </div>
        {doctor.department && (
          <div className="text-sm text-gray-600">
            Department: {doctor.department}
          </div>
        )}
      </div>

      {/* Bio */}
      {doctor.bio && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {doctor.bio}
        </p>
      )}

      {/* Actions */}
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onView(doctor.id)}
          className="flex-1"
        >
          <Eye className="w-4 h-4" />
          View
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onEdit(doctor.id)}
          className="flex-1"
        >
          <Edit className="w-4 h-4" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDelete}
          isLoading={isDeleting}
          className="text-red-600 hover:bg-red-50 border-red-200"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}