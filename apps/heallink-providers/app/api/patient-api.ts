import { ApiResponse } from "../api-types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003/api/v1";

// Patient data structure
export interface PatientData {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: {
    streetAddress?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  medicalInformation?: {
    allergies: string[];
    medications: string[];
    conditions: string[];
    bloodType?: string;
    height?: number;
    weight?: number;
  };
  insurance?: {
    provider: string;
    policyNumber: string;
    groupNumber?: string;
    expiryDate?: string;
  };
  registrationDate: string;
  lastVisit?: string;
}

// Medical note data structure
export interface MedicalNoteData {
  id: string;
  patientId: string;
  providerId: string;
  title: string;
  content: string;
  type: "diagnosis" | "treatment" | "prescription" | "followUp" | "general";
  tags?: string[];
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
  }[];
  created: string;
  updated: string;
}

/**
 * Fetch patients for the provider
 */
export async function fetchPatients(
  page = 1,
  limit = 10,
  searchQuery?: string
): Promise<ApiResponse<{ patients: PatientData[]; total: number }>> {
  try {
    let url = `${API_URL}/providers/patients?page=${page}&limit=${limit}`;
    if (searchQuery) {
      url += `&search=${encodeURIComponent(searchQuery)}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.message || "Failed to fetch patients",
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error fetching patients:", error);
    return {
      error: "An unexpected error occurred while fetching patients",
    };
  }
}

/**
 * Fetch a specific patient's details
 */
export async function fetchPatientDetails(
  patientId: string
): Promise<ApiResponse<PatientData>> {
  try {
    const response = await fetch(`${API_URL}/providers/patients/${patientId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.message || "Failed to fetch patient details",
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error fetching patient details:", error);
    return {
      error: "An unexpected error occurred while fetching patient details",
    };
  }
}

/**
 * Update a patient's information
 */
export async function updatePatient(
  patientId: string,
  patientData: Partial<PatientData>
): Promise<ApiResponse<PatientData>> {
  try {
    const response = await fetch(`${API_URL}/providers/patients/${patientId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patientData),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.message || "Failed to update patient",
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error updating patient:", error);
    return {
      error: "An unexpected error occurred while updating patient",
    };
  }
}

/**
 * Fetch medical notes for a patient
 */
export async function fetchPatientNotes(
  patientId: string,
  page = 1,
  limit = 10,
  type?: string
): Promise<ApiResponse<{ notes: MedicalNoteData[]; total: number }>> {
  try {
    let url = `${API_URL}/providers/patients/${patientId}/notes?page=${page}&limit=${limit}`;
    if (type) {
      url += `&type=${type}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.message || "Failed to fetch patient notes",
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error fetching patient notes:", error);
    return {
      error: "An unexpected error occurred while fetching patient notes",
    };
  }
}

/**
 * Create a new medical note for a patient
 */
export async function createPatientNote(
  patientId: string,
  noteData: Omit<MedicalNoteData, "id" | "patientId" | "providerId" | "created" | "updated">
): Promise<ApiResponse<MedicalNoteData>> {
  try {
    const response = await fetch(`${API_URL}/providers/patients/${patientId}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(noteData),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.message || "Failed to create patient note",
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error creating patient note:", error);
    return {
      error: "An unexpected error occurred while creating patient note",
    };
  }
}

/**
 * Update a medical note
 */
export async function updatePatientNote(
  patientId: string,
  noteId: string,
  noteData: Partial<MedicalNoteData>
): Promise<ApiResponse<MedicalNoteData>> {
  try {
    const response = await fetch(`${API_URL}/providers/patients/${patientId}/notes/${noteId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(noteData),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.message || "Failed to update patient note",
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error updating patient note:", error);
    return {
      error: "An unexpected error occurred while updating patient note",
    };
  }
}

/**
 * Delete a medical note
 */
export async function deletePatientNote(
  patientId: string,
  noteId: string
): Promise<ApiResponse<{ success: boolean }>> {
  try {
    const response = await fetch(`${API_URL}/providers/patients/${patientId}/notes/${noteId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.message || "Failed to delete patient note",
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error deleting patient note:", error);
    return {
      error: "An unexpected error occurred while deleting patient note",
    };
  }
}