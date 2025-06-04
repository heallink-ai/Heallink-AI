"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { addDoctor, DoctorData } from "@/app/api/doctor-api";
import DoctorForm from "@/app/components/doctors/DoctorForm";
import { ArrowLeft } from "lucide-react";
import Button from "@/app/components/ui/Button";

export default function NewDoctorPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const addMutation = useMutation({
    mutationFn: addDoctor,
    onSuccess: (response) => {
      if (response.success) {
        router.push("/dashboard/doctors");
      } else {
        setSubmitError(response.error || "Failed to add doctor");
      }
    },
    onError: (error) => {
      setSubmitError("An unexpected error occurred");
    },
  });

  const handleSubmit = (doctorData: Omit<DoctorData, "id" | "joinedDate" | "lastActive" | "rating" | "totalPatients" | "totalConsultations">) => {
    setSubmitError(null);
    addMutation.mutate(doctorData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Add New Doctor
          </h1>
          <p className="text-gray-600 mt-1">
            Add a new doctor to your medical staff
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <DoctorForm
          onSubmit={handleSubmit}
          isLoading={addMutation.isPending}
          error={submitError}
          submitButtonText="Add Doctor"
        />
      </div>
    </div>
  );
}