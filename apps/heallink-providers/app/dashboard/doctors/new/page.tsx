"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { addDoctor, DoctorData, getSpecializations } from "../../../api/doctor-api";
import Button from "../../../components/ui/Button";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { ArrowLeft, Save } from "lucide-react";

type DoctorFormData = Omit<DoctorData, "id" | "created" | "lastActive">;

export default function NewDoctorPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<DoctorFormData>({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    licenseNumber: "",
    department: "",
    experience: 0,
    education: "",
    certifications: [],
    languages: [],
    isActive: true,
    consultationFee: 0,
    bio: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const specializations = getSpecializations();

  const addMutation = useMutation({
    mutationFn: addDoctor,
    onSuccess: () => {
      router.push("/dashboard/doctors");
    },
    onError: (error: any) => {
      console.error("Failed to add doctor:", error);
    }
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.specialization) newErrors.specialization = "Specialization is required";
    if (!formData.licenseNumber.trim()) newErrors.licenseNumber = "License number is required";
    if (!formData.education.trim()) newErrors.education = "Education is required";
    if (formData.experience < 0) newErrors.experience = "Experience must be positive";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      addMutation.mutate(formData);
    }
  };

  const handleInputChange = (field: keyof DoctorFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleArrayInputChange = (field: "certifications" | "languages", value: string) => {
    const items = value.split(",").map(item => item.trim()).filter(item => item);
    handleInputChange(field, items);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Doctor</h1>
            <p className="text-gray-600">Fill in the doctor's information</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="neumorph-card p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`neumorph-input w-full ${errors.name ? "border-red-300" : ""}`}
                  placeholder="Dr. John Doe"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`neumorph-input w-full ${errors.email ? "border-red-300" : ""}`}
                  placeholder="doctor@heallink.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="neumorph-input w-full"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialization *
                </label>
                <select
                  value={formData.specialization}
                  onChange={(e) => handleInputChange("specialization", e.target.value)}
                  className={`neumorph-input w-full ${errors.specialization ? "border-red-300" : ""}`}
                >
                  <option value="">Select Specialization</option>
                  {specializations.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
                {errors.specialization && <p className="text-red-500 text-sm mt-1">{errors.specialization}</p>}
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Number *
                </label>
                <input
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                  className={`neumorph-input w-full ${errors.licenseNumber ? "border-red-300" : ""}`}
                  placeholder="MD123456"
                />
                {errors.licenseNumber && <p className="text-red-500 text-sm mt-1">{errors.licenseNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department || ""}
                  onChange={(e) => handleInputChange("department", e.target.value)}
                  className="neumorph-input w-full"
                  placeholder="Cardiology Department"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years of Experience *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.experience}
                  onChange={(e) => handleInputChange("experience", parseInt(e.target.value) || 0)}
                  className={`neumorph-input w-full ${errors.experience ? "border-red-300" : ""}`}
                  placeholder="5"
                />
                {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Consultation Fee ($)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.consultationFee || ""}
                  onChange={(e) => handleInputChange("consultationFee", parseInt(e.target.value) || 0)}
                  className="neumorph-input w-full"
                  placeholder="200"
                />
              </div>
            </div>
          </div>

          {/* Education & Qualifications */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Education & Qualifications</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Education *
                </label>
                <input
                  type="text"
                  value={formData.education}
                  onChange={(e) => handleInputChange("education", e.target.value)}
                  className={`neumorph-input w-full ${errors.education ? "border-red-300" : ""}`}
                  placeholder="Harvard Medical School"
                />
                {errors.education && <p className="text-red-500 text-sm mt-1">{errors.education}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certifications (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.certifications?.join(", ") || ""}
                  onChange={(e) => handleArrayInputChange("certifications", e.target.value)}
                  className="neumorph-input w-full"
                  placeholder="Board Certified Cardiologist, ACLS Certified"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Languages (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.languages?.join(", ") || ""}
                  onChange={(e) => handleArrayInputChange("languages", e.target.value)}
                  className="neumorph-input w-full"
                  placeholder="English, Spanish, French"
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              value={formData.bio || ""}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              rows={4}
              className="neumorph-input w-full"
              placeholder="Brief description about the doctor's expertise and background..."
            />
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleInputChange("isActive", e.target.checked)}
                className="rounded border-gray-300 text-purple-heart focus:ring-purple-heart"
              />
              <span className="text-sm font-medium text-gray-700">Active Status</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={addMutation.isPending}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Add Doctor
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}