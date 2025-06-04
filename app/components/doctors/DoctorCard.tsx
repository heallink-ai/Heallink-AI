"use client";

import { useState } from "react";
import { DoctorData } from "@/app/api/doctor-api";
import { 
  User, 
  Mail, 
  Phone, 
  Star, 
  Users, 
  Calendar,
  Edit,
  Eye,
  MoreVertical,
  Trash2
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeDoctor } from "@/app/api/doctor-api";
import Button from "@/app/components/ui/Button";

interface DoctorCardProps {
  doctor: DoctorData;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
}

export default function DoctorCard({ doctor, onEdit, onView }: DoctorCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: removeDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      setShowDeleteConfirm(false);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(doctor.id);
  };

  return (
    <div className="neumorph-flat rounded-2xl p-6 hover:shadow-lg transition-all duration-300 relative">
      {/* Menu Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <MoreVertical className="w-4 h-4 text-gray-500" />
        </button>
        
        {showMenu && (
          <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border py-1 z-10 min-w-[120px]">
            <button
              onClick={() => {
                onView(doctor.id);
                setShowMenu(false);
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
            >
              <Eye className="w-3 h-3" />
              View
            </button>
            <button
              onClick={() => {
                onEdit(doctor.id);
                setShowMenu(false);
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
            >
              <Edit className="w-3 h-3" />
              Edit
            </button>
            <button
              onClick={() => {
                setShowDeleteConfirm(true);
                setShowMenu(false);
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Doctor Info */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-heart to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
          {doctor.profileImage ? (
            <img
              src={doctor.profileImage}
              alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
              className="w-full h-full rounded-2xl object-cover"
            />
          ) : (
            `${doctor.firstName[0]}${doctor.lastName[0]}`
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            Dr. {doctor.firstName} {doctor.lastName}
          </h3>
          <p className="text-purple-heart text-sm font-medium">
            {doctor.specialization}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-xs text-gray-600">
              {doctor.rating > 0 ? doctor.rating.toFixed(1) : "New"}
            </span>
          </div>
        </div>
        
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          doctor.isActive 
            ? "bg-green-100 text-green-800" 
            : "bg-gray-100 text-gray-600"
        }`}>
          {doctor.isActive ? "Active" : "Inactive"}
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail className="w-3 h-3" />
          <span className="truncate">{doctor.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="w-3 h-3" />
          <span>{doctor.phone}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {doctor.totalPatients}
          </div>
          <div className="text-xs text-gray-600">Patients</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {doctor.yearsExperience}y
          </div>
          <div className="text-xs text-gray-600">Experience</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onView(doctor.id)}
          className="flex-1"
        >
          <Eye className="w-3 h-3 mr-1" />
          View
        </Button>
        <Button
          size="sm"
          onClick={() => onEdit(doctor.id)}
          className="flex-1"
        >
          <Edit className="w-3 h-3 mr-1" />
          Edit
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Doctor
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete Dr. {doctor.firstName} {doctor.lastName}? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1"
                disabled={deleteMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                className="flex-1"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}