import { ApiResponse } from "../api-types";
import { getSession } from "next-auth/react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003/api/v1";

// Doctor data structure
export interface DoctorData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  specialization: string;
  licenseNumber: string;
  department?: string;
  experience: number; // years of experience
  education: string;
  certifications?: string[];
  languages?: string[];
  isActive: boolean;
  workingHours?: {
    monday?: { start: string; end: string }[];
    tuesday?: { start: string; end: string }[];
    wednesday?: { start: string; end: string }[];
    thursday?: { start: string; end: string }[];
    friday?: { start: string; end: string }[];
    saturday?: { start: string; end: string }[];
    sunday?: { start: string; end: string }[];
  };
  consultationFee?: number;
  bio?: string;
  profileImage?: string;
  created: string;
  lastActive?: string;
}

// Dummy data for development
const dummyDoctors: DoctorData[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@heallink.com",
    phone: "+1 (555) 123-4567",
    specialization: "Cardiology",
    licenseNumber: "MD123456",
    department: "Cardiology",
    experience: 12,
    education: "Harvard Medical School",
    certifications: ["Board Certified Cardiologist", "ACLS Certified"],
    languages: ["English", "Spanish"],
    isActive: true,
    consultationFee: 250,
    bio: "Dr. Johnson is a highly experienced cardiologist with over 12 years of practice.",
    created: "2023-01-15T10:00:00Z",
    lastActive: "2024-01-15T14:30:00Z"
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    email: "michael.chen@heallink.com",
    phone: "+1 (555) 234-5678",
    specialization: "Neurology",
    licenseNumber: "MD234567",
    department: "Neurology",
    experience: 8,
    education: "Johns Hopkins University",
    certifications: ["Board Certified Neurologist"],
    languages: ["English", "Mandarin"],
    isActive: true,
    consultationFee: 300,
    bio: "Specializing in neurological disorders and brain health.",
    created: "2023-02-20T09:00:00Z",
    lastActive: "2024-01-14T16:45:00Z"
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@heallink.com",
    phone: "+1 (555) 345-6789",
    specialization: "Pediatrics",
    licenseNumber: "MD345678",
    department: "Pediatrics",
    experience: 6,
    education: "Stanford Medical School",
    certifications: ["Board Certified Pediatrician", "PALS Certified"],
    languages: ["English", "Spanish"],
    isActive: true,
    consultationFee: 200,
    bio: "Dedicated to providing comprehensive care for children and adolescents.",
    created: "2023-03-10T11:00:00Z",
    lastActive: "2024-01-15T10:20:00Z"
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    email: "james.wilson@heallink.com",
    phone: "+1 (555) 456-7890",
    specialization: "Orthopedics",
    licenseNumber: "MD456789",
    department: "Orthopedics",
    experience: 15,
    education: "Mayo Clinic College of Medicine",
    certifications: ["Board Certified Orthopedic Surgeon"],
    languages: ["English"],
    isActive: false,
    consultationFee: 350,
    bio: "Expert in joint replacement and sports medicine.",
    created: "2022-11-05T08:00:00Z",
    lastActive: "2024-01-10T12:00:00Z"
  }
];

/**
 * Fetch all doctors for the current provider organization
 */
export async function fetchDoctors(
  page = 1,
  limit = 10,
  searchTerm?: string,
  specialization?: string
): Promise<ApiResponse<{ doctors: DoctorData[]; total: number }>> {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredDoctors = [...dummyDoctors];
    
    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filteredDoctors = filteredDoctors.filter(
        doctor =>
          doctor.name.toLowerCase().includes(search) ||
          doctor.email.toLowerCase().includes(search) ||
          doctor.specialization.toLowerCase().includes(search) ||
          doctor.department?.toLowerCase().includes(search)
      );
    }
    
    // Apply specialization filter
    if (specialization) {
      filteredDoctors = filteredDoctors.filter(
        doctor => doctor.specialization === specialization
      );
    }
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDoctors = filteredDoctors.slice(startIndex, endIndex);
    
    return {
      data: {
        doctors: paginatedDoctors,
        total: filteredDoctors.length
      }
    };
  } catch (error) {
    return {
      error: "Failed to fetch doctors",
      statusCode: 500
    };
  }
}

/**
 * Fetch a single doctor by ID
 */
export async function fetchDoctorById(id: string): Promise<ApiResponse<DoctorData>> {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const doctor = dummyDoctors.find(d => d.id === id);
    
    if (!doctor) {
      return {
        error: "Doctor not found",
        statusCode: 404
      };
    }
    
    return { data: doctor };
  } catch (error) {
    return {
      error: "Failed to fetch doctor",
      statusCode: 500
    };
  }
}

/**
 * Add a new doctor
 */
export async function addDoctor(
  doctorData: Omit<DoctorData, "id" | "created" | "lastActive">
): Promise<ApiResponse<DoctorData>> {
  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newDoctor: DoctorData = {
      ...doctorData,
      id: (dummyDoctors.length + 1).toString(),
      created: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };
    
    dummyDoctors.push(newDoctor);
    
    return { data: newDoctor };
  } catch (error) {
    return {
      error: "Failed to add doctor",
      statusCode: 500
    };
  }
}

/**
 * Update an existing doctor
 */
export async function updateDoctor(
  id: string,
  updates: Partial<Omit<DoctorData, "id" | "created">>
): Promise<ApiResponse<DoctorData>> {
  try {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const doctorIndex = dummyDoctors.findIndex(d => d.id === id);
    
    if (doctorIndex === -1) {
      return {
        error: "Doctor not found",
        statusCode: 404
      };
    }
    
    dummyDoctors[doctorIndex] = {
      ...dummyDoctors[doctorIndex],
      ...updates,
      lastActive: new Date().toISOString()
    };
    
    return { data: dummyDoctors[doctorIndex] };
  } catch (error) {
    return {
      error: "Failed to update doctor",
      statusCode: 500
    };
  }
}

/**
 * Remove a doctor
 */
export async function removeDoctor(id: string): Promise<ApiResponse<{ message: string }>> {
  try {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const doctorIndex = dummyDoctors.findIndex(d => d.id === id);
    
    if (doctorIndex === -1) {
      return {
        error: "Doctor not found",
        statusCode: 404
      };
    }
    
    dummyDoctors.splice(doctorIndex, 1);
    
    return {
      data: { message: "Doctor removed successfully" }
    };
  } catch (error) {
    return {
      error: "Failed to remove doctor",
      statusCode: 500
    };
  }
}

/**
 * Get available specializations
 */
export function getSpecializations(): string[] {
  return [
    "Cardiology",
    "Neurology",
    "Pediatrics",
    "Orthopedics",
    "Dermatology",
    "Psychiatry",
    "Oncology",
    "Gastroenterology",
    "Endocrinology",
    "Pulmonology"
  ];
}