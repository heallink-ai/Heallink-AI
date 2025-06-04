"use client";

import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Doctor data structure
export interface DoctorData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  licenseNumber: string;
  yearsExperience: number;
  education: string;
  certifications: string[];
  languages: string[];
  availability: {
    monday: { start: string; end: string; available: boolean };
    tuesday: { start: string; end: string; available: boolean };
    wednesday: { start: string; end: string; available: boolean };
    thursday: { start: string; end: string; available: boolean };
    friday: { start: string; end: string; available: boolean };
    saturday: { start: string; end: string; available: boolean };
    sunday: { start: string; end: string; available: boolean };
  };
  isActive: boolean;
  joinedDate: string;
  lastActive: string;
  profileImage?: string;
  bio?: string;
  consultationFee: number;
  rating: number;
  totalPatients: number;
  totalConsultations: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Dummy doctors data
const DUMMY_DOCTORS: DoctorData[] = [
  {
    id: "doc_001",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "dr.sarah.johnson@heallink.com",
    phone: "+1-555-0101",
    specialization: "Cardiology",
    licenseNumber: "MD123456",
    yearsExperience: 12,
    education: "Harvard Medical School",
    certifications: ["Board Certified Cardiologist", "ACLS Certified"],
    languages: ["English", "Spanish"],
    availability: {
      monday: { start: "09:00", end: "17:00", available: true },
      tuesday: { start: "09:00", end: "17:00", available: true },
      wednesday: { start: "09:00", end: "17:00", available: true },
      thursday: { start: "09:00", end: "17:00", available: true },
      friday: { start: "09:00", end: "15:00", available: true },
      saturday: { start: "10:00", end: "14:00", available: false },
      sunday: { start: "10:00", end: "14:00", available: false }
    },
    isActive: true,
    joinedDate: "2022-01-15",
    lastActive: "2024-01-20T10:30:00Z",
    profileImage: "/images/doctors/dr-johnson.jpg",
    bio: "Experienced cardiologist specializing in preventive cardiology and heart disease management.",
    consultationFee: 200,
    rating: 4.8,
    totalPatients: 450,
    totalConsultations: 1200
  },
  {
    id: "doc_002",
    firstName: "Michael",
    lastName: "Chen",
    email: "dr.michael.chen@heallink.com",
    phone: "+1-555-0102",
    specialization: "Pediatrics",
    licenseNumber: "MD789012",
    yearsExperience: 8,
    education: "Johns Hopkins University",
    certifications: ["Board Certified Pediatrician", "PALS Certified"],
    languages: ["English", "Mandarin"],
    availability: {
      monday: { start: "08:00", end: "16:00", available: true },
      tuesday: { start: "08:00", end: "16:00", available: true },
      wednesday: { start: "08:00", end: "16:00", available: true },
      thursday: { start: "08:00", end: "16:00", available: true },
      friday: { start: "08:00", end: "16:00", available: true },
      saturday: { start: "09:00", end: "13:00", available: true },
      sunday: { start: "09:00", end: "13:00", available: false }
    },
    isActive: true,
    joinedDate: "2023-03-10",
    lastActive: "2024-01-20T14:15:00Z",
    profileImage: "/images/doctors/dr-chen.jpg",
    bio: "Dedicated pediatrician with expertise in child development and preventive care.",
    consultationFee: 150,
    rating: 4.9,
    totalPatients: 320,
    totalConsultations: 890
  },
  {
    id: "doc_003",
    firstName: "Emily",
    lastName: "Rodriguez",
    email: "dr.emily.rodriguez@heallink.com",
    phone: "+1-555-0103",
    specialization: "Dermatology",
    licenseNumber: "MD345678",
    yearsExperience: 15,
    education: "Stanford University School of Medicine",
    certifications: ["Board Certified Dermatologist", "Mohs Surgery Certified"],
    languages: ["English", "Spanish", "Portuguese"],
    availability: {
      monday: { start: "10:00", end: "18:00", available: true },
      tuesday: { start: "10:00", end: "18:00", available: true },
      wednesday: { start: "10:00", end: "18:00", available: true },
      thursday: { start: "10:00", end: "18:00", available: true },
      friday: { start: "10:00", end: "16:00", available: true },
      saturday: { start: "09:00", end: "13:00", available: false },
      sunday: { start: "09:00", end: "13:00", available: false }
    },
    isActive: true,
    joinedDate: "2021-06-20",
    lastActive: "2024-01-20T16:45:00Z",
    profileImage: "/images/doctors/dr-rodriguez.jpg",
    bio: "Expert dermatologist specializing in skin cancer detection and cosmetic procedures.",
    consultationFee: 180,
    rating: 4.7,
    totalPatients: 380,
    totalConsultations: 950
  }
];

/**
 * Fetch all doctors for the current provider organization
 */
export async function fetchDoctors(
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<ApiResponse<{ doctors: DoctorData[]; total: number }>> {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredDoctors = [...DUMMY_DOCTORS];
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredDoctors = filteredDoctors.filter(doctor => 
        doctor.firstName.toLowerCase().includes(searchLower) ||
        doctor.lastName.toLowerCase().includes(searchLower) ||
        doctor.email.toLowerCase().includes(searchLower) ||
        doctor.specialization.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDoctors = filteredDoctors.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: {
        doctors: paginatedDoctors,
        total: filteredDoctors.length
      }
    };
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return {
      success: false,
      error: "An unexpected error occurred while fetching doctors"
    };
  }
}

/**
 * Fetch a single doctor by ID
 */
export async function fetchDoctorById(
  doctorId: string
): Promise<ApiResponse<DoctorData>> {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const doctor = DUMMY_DOCTORS.find(d => d.id === doctorId);
    
    if (!doctor) {
      return {
        success: false,
        error: "Doctor not found"
      };
    }
    
    return {
      success: true,
      data: doctor
    };
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return {
      success: false,
      error: "An unexpected error occurred while fetching doctor"
    };
  }
}

/**
 * Add a new doctor to the provider organization
 */
export async function addDoctor(
  doctorData: Omit<DoctorData, "id" | "joinedDate" | "lastActive" | "rating" | "totalPatients" | "totalConsultations">
): Promise<ApiResponse<DoctorData>> {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if email already exists
    const existingDoctor = DUMMY_DOCTORS.find(d => d.email === doctorData.email);
    if (existingDoctor) {
      return {
        success: false,
        error: "A doctor with this email already exists"
      };
    }
    
    // Create new doctor
    const newDoctor: DoctorData = {
      ...doctorData,
      id: `doc_${Math.random().toString(36).substr(2, 9)}`,
      joinedDate: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString(),
      rating: 0,
      totalPatients: 0,
      totalConsultations: 0
    };
    
    // Add to dummy data (in real app, this would be sent to API)
    DUMMY_DOCTORS.push(newDoctor);
    
    return {
      success: true,
      data: newDoctor
    };
  } catch (error) {
    console.error("Error adding doctor:", error);
    return {
      success: false,
      error: "An unexpected error occurred while adding doctor"
    };
  }
}

/**
 * Update a doctor's information
 */
export async function updateDoctor(
  doctorId: string,
  doctorData: Partial<DoctorData>
): Promise<ApiResponse<DoctorData>> {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const doctorIndex = DUMMY_DOCTORS.findIndex(d => d.id === doctorId);
    
    if (doctorIndex === -1) {
      return {
        success: false,
        error: "Doctor not found"
      };
    }
    
    // Check if email is being changed and already exists
    if (doctorData.email && doctorData.email !== DUMMY_DOCTORS[doctorIndex].email) {
      const existingDoctor = DUMMY_DOCTORS.find(d => d.email === doctorData.email && d.id !== doctorId);
      if (existingDoctor) {
        return {
          success: false,
          error: "A doctor with this email already exists"
        };
      }
    }
    
    // Update doctor
    const updatedDoctor = {
      ...DUMMY_DOCTORS[doctorIndex],
      ...doctorData,
      lastActive: new Date().toISOString()
    };
    
    DUMMY_DOCTORS[doctorIndex] = updatedDoctor;
    
    return {
      success: true,
      data: updatedDoctor
    };
  } catch (error) {
    console.error("Error updating doctor:", error);
    return {
      success: false,
      error: "An unexpected error occurred while updating doctor"
    };
  }
}

/**
 * Remove a doctor from the provider organization
 */
export async function removeDoctor(
  doctorId: string
): Promise<ApiResponse<void>> {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const doctorIndex = DUMMY_DOCTORS.findIndex(d => d.id === doctorId);
    
    if (doctorIndex === -1) {
      return {
        success: false,
        error: "Doctor not found"
      };
    }
    
    // Remove doctor
    DUMMY_DOCTORS.splice(doctorIndex, 1);
    
    return {
      success: true
    };
  } catch (error) {
    console.error("Error removing doctor:", error);
    return {
      success: false,
      error: "An unexpected error occurred while removing doctor"
    };
  }
}