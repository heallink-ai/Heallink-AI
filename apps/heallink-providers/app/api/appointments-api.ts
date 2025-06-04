import { getSession } from "next-auth/react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003/api/v1";

// Appointment data structure
export interface AppointmentData {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail?: string;
  patientPhone?: string;
  patientAvatar?: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar?: string;
  appointmentType: "consultation" | "follow-up" | "emergency" | "telehealth" | "procedure";
  status: "scheduled" | "confirmed" | "in-progress" | "completed" | "cancelled" | "no-show";
  priority: "low" | "medium" | "high" | "urgent";
  date: string; // ISO date string
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  duration: number; // in minutes
  isVirtual: boolean;
  meetingLink?: string;
  reason: string;
  notes?: string;
  symptoms?: string[];
  diagnosis?: string;
  prescription?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    groupNumber?: string;
  };
  billing?: {
    amount: number;
    currency: string;
    status: "pending" | "paid" | "overdue" | "cancelled";
    invoiceId?: string;
  };
  reminders: {
    email: boolean;
    sms: boolean;
    push: boolean;
    reminderTimes: number[]; // hours before appointment
  };
  created: string;
  updated: string;
  cancelledBy?: string;
  cancellationReason?: string;
  rescheduledFrom?: string;
}

// API Response type
interface ApiResponse<T> {
  data?: T;
  error?: string;
  statusCode?: number;
}

// Dummy data for appointments
export const DUMMY_APPOINTMENTS: AppointmentData[] = [
  {
    id: "apt-001",
    patientId: "pat-001",
    patientName: "Sarah Johnson",
    patientEmail: "sarah.johnson@email.com",
    patientPhone: "+1-555-0123",
    patientAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    doctorId: "doc-001",
    doctorName: "Dr. Michael Chen",
    doctorSpecialty: "Cardiology",
    doctorAvatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    appointmentType: "consultation",
    status: "scheduled",
    priority: "medium",
    date: "2024-01-15",
    startTime: "09:00",
    endTime: "09:30",
    duration: 30,
    isVirtual: false,
    reason: "Chest pain and shortness of breath",
    symptoms: ["chest pain", "shortness of breath", "fatigue"],
    insuranceInfo: {
      provider: "Blue Cross Blue Shield",
      policyNumber: "BC123456789",
      groupNumber: "GRP001"
    },
    billing: {
      amount: 250.00,
      currency: "USD",
      status: "pending"
    },
    reminders: {
      email: true,
      sms: true,
      push: true,
      reminderTimes: [24, 2] // 24 hours and 2 hours before
    },
    created: "2024-01-10T10:00:00Z",
    updated: "2024-01-10T10:00:00Z"
  },
  {
    id: "apt-002",
    patientId: "pat-002",
    patientName: "Robert Williams",
    patientEmail: "robert.williams@email.com",
    patientPhone: "+1-555-0124",
    patientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    doctorId: "doc-002",
    doctorName: "Dr. Sarah Wilson",
    doctorSpecialty: "Dermatology",
    doctorAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    appointmentType: "telehealth",
    status: "confirmed",
    priority: "low",
    date: "2024-01-15",
    startTime: "10:00",
    endTime: "10:30",
    duration: 30,
    isVirtual: true,
    meetingLink: "https://meet.heallink.com/room/apt-002",
    reason: "Skin rash consultation",
    symptoms: ["skin rash", "itching"],
    billing: {
      amount: 150.00,
      currency: "USD",
      status: "pending"
    },
    reminders: {
      email: true,
      sms: false,
      push: true,
      reminderTimes: [24, 1]
    },
    created: "2024-01-11T14:30:00Z",
    updated: "2024-01-12T09:15:00Z"
  },
  {
    id: "apt-003",
    patientId: "pat-003",
    patientName: "Emily Davis",
    patientEmail: "emily.davis@email.com",
    patientPhone: "+1-555-0125",
    doctorId: "doc-003",
    doctorName: "Dr. James Rodriguez",
    doctorSpecialty: "Pediatrics",
    appointmentType: "follow-up",
    status: "completed",
    priority: "medium",
    date: "2024-01-14",
    startTime: "14:00",
    endTime: "14:45",
    duration: 45,
    isVirtual: false,
    reason: "Follow-up for vaccination",
    diagnosis: "Routine vaccination completed",
    followUpRequired: false,
    billing: {
      amount: 100.00,
      currency: "USD",
      status: "paid",
      invoiceId: "INV-2024-001"
    },
    reminders: {
      email: true,
      sms: true,
      push: false,
      reminderTimes: [24]
    },
    created: "2024-01-08T11:20:00Z",
    updated: "2024-01-14T15:00:00Z"
  },
  {
    id: "apt-004",
    patientId: "pat-004",
    patientName: "Michael Brown",
    patientEmail: "michael.brown@email.com",
    patientPhone: "+1-555-0126",
    doctorId: "doc-001",
    doctorName: "Dr. Michael Chen",
    doctorSpecialty: "Cardiology",
    appointmentType: "emergency",
    status: "cancelled",
    priority: "urgent",
    date: "2024-01-13",
    startTime: "16:00",
    endTime: "17:00",
    duration: 60,
    isVirtual: false,
    reason: "Severe chest pain",
    symptoms: ["severe chest pain", "nausea", "sweating"],
    cancelledBy: "patient",
    cancellationReason: "Patient went to emergency room",
    billing: {
      amount: 300.00,
      currency: "USD",
      status: "cancelled"
    },
    reminders: {
      email: true,
      sms: true,
      push: true,
      reminderTimes: [2, 0.5]
    },
    created: "2024-01-13T15:30:00Z",
    updated: "2024-01-13T15:45:00Z"
  },
  {
    id: "apt-005",
    patientId: "pat-005",
    patientName: "Lisa Anderson",
    patientEmail: "lisa.anderson@email.com",
    patientPhone: "+1-555-0127",
    doctorId: "doc-004",
    doctorName: "Dr. Amanda Thompson",
    doctorSpecialty: "Orthopedics",
    appointmentType: "procedure",
    status: "in-progress",
    priority: "high",
    date: "2024-01-15",
    startTime: "11:00",
    endTime: "12:30",
    duration: 90,
    isVirtual: false,
    reason: "Knee arthroscopy",
    symptoms: ["knee pain", "limited mobility"],
    billing: {
      amount: 1500.00,
      currency: "USD",
      status: "pending"
    },
    reminders: {
      email: true,
      sms: true,
      push: true,
      reminderTimes: [48, 24, 2]
    },
    created: "2024-01-05T09:00:00Z",
    updated: "2024-01-15T11:00:00Z"
  },
  {
    id: "apt-006",
    patientId: "pat-006",
    patientName: "David Wilson",
    patientEmail: "david.wilson@email.com",
    patientPhone: "+1-555-0128",
    doctorId: "doc-002",
    doctorName: "Dr. Sarah Wilson",
    doctorSpecialty: "Dermatology",
    appointmentType: "consultation",
    status: "no-show",
    priority: "low",
    date: "2024-01-12",
    startTime: "15:30",
    endTime: "16:00",
    duration: 30,
    isVirtual: false,
    reason: "Mole examination",
    billing: {
      amount: 200.00,
      currency: "USD",
      status: "overdue"
    },
    reminders: {
      email: true,
      sms: true,
      push: false,
      reminderTimes: [24, 2]
    },
    created: "2024-01-09T13:45:00Z",
    updated: "2024-01-12T16:30:00Z"
  }
];

/**
 * Fetch all appointments for the current provider organization
 */
export async function fetchProviderAppointments(
  page = 1,
  limit = 10,
  status?: string,
  date?: string,
  doctorId?: string
): Promise<ApiResponse<{ appointments: AppointmentData[]; total: number }>> {
  try {
    const session = await getSession();
    let url = `${API_URL}/providers/appointments?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    if (date) url += `&date=${date}`;
    if (doctorId) url += `&doctorId=${doctorId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(session?.accessToken && {
          Authorization: `Bearer ${session.accessToken}`,
        }),
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.message || "Failed to fetch appointments",
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error fetching provider appointments:", error);
    return {
      error: "Network error occurred",
      statusCode: 500,
    };
  }
}

/**
 * Create a new appointment
 */
export async function createAppointment(
  appointmentData: Omit<AppointmentData, "id" | "created" | "updated">
): Promise<ApiResponse<AppointmentData>> {
  try {
    const session = await getSession();
    const response = await fetch(`${API_URL}/providers/appointments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(session?.accessToken && {
          Authorization: `Bearer ${session.accessToken}`,
        }),
      },
      body: JSON.stringify(appointmentData),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.message || "Failed to create appointment",
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error creating appointment:", error);
    return {
      error: "Network error occurred",
      statusCode: 500,
    };
  }
}

/**
 * Update an existing appointment
 */
export async function updateAppointment(
  appointmentId: string,
  updates: Partial<AppointmentData>
): Promise<ApiResponse<AppointmentData>> {
  try {
    const session = await getSession();
    const response = await fetch(`${API_URL}/providers/appointments/${appointmentId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(session?.accessToken && {
          Authorization: `Bearer ${session.accessToken}`,
        }),
      },
      body: JSON.stringify(updates),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.message || "Failed to update appointment",
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error updating appointment:", error);
    return {
      error: "Network error occurred",
      statusCode: 500,
    };
  }
}

/**
 * Cancel an appointment
 */
export async function cancelAppointment(
  appointmentId: string,
  reason: string,
  cancelledBy: string
): Promise<ApiResponse<AppointmentData>> {
  try {
    const session = await getSession();
    const response = await fetch(`${API_URL}/providers/appointments/${appointmentId}/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(session?.accessToken && {
          Authorization: `Bearer ${session.accessToken}`,
        }),
      },
      body: JSON.stringify({ reason, cancelledBy }),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.message || "Failed to cancel appointment",
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    return {
      error: "Network error occurred",
      statusCode: 500,
    };
  }
}

/**
 * Get appointment statistics
 */
export async function getAppointmentStats(
  startDate?: string,
  endDate?: string
): Promise<ApiResponse<{
  total: number;
  scheduled: number;
  completed: number;
  cancelled: number;
  noShow: number;
  revenue: number;
  averageDuration: number;
}>> {
  try {
    const session = await getSession();
    let url = `${API_URL}/providers/appointments/stats`;
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(session?.accessToken && {
          Authorization: `Bearer ${session.accessToken}`,
        }),
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.message || "Failed to fetch appointment statistics",
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error fetching appointment statistics:", error);
    return {
      error: "Network error occurred",
      statusCode: 500,
    };
  }
}