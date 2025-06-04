import { getSession } from "next-auth/react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003/api/v1";

// Report data structures
export interface ReportData {
  id: string;
  title: string;
  description: string;
  type: "financial" | "clinical" | "operational" | "patient" | "staff" | "appointment" | "custom";
  category: "revenue" | "expenses" | "patient-outcomes" | "staff-performance" | "appointment-analytics" | "compliance" | "quality-metrics";
  status: "draft" | "generating" | "completed" | "failed" | "scheduled";
  format: "pdf" | "excel" | "csv" | "json";
  dateRange: {
    startDate: string;
    endDate: string;
  };
  filters?: {
    departments?: string[];
    doctors?: string[];
    appointmentTypes?: string[];
    patientDemographics?: {
      ageRange?: { min: number; max: number };
      gender?: string[];
      insuranceProviders?: string[];
    };
  };
  metrics: {
    totalRecords: number;
    dataPoints: number;
    accuracy: number; // percentage
  };
  schedule?: {
    frequency: "once" | "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
    nextRun?: string;
    recipients: string[];
  };
  downloadUrl?: string;
  fileSize?: number; // in bytes
  generatedBy: string;
  generatedAt?: string;
  created: string;
  updated: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: ReportData['type'];
  category: ReportData['category'];
  defaultFilters: ReportData['filters'];
  requiredFields: string[];
  isCustomizable: boolean;
  estimatedGenerationTime: number; // in minutes
}

export interface ReportMetrics {
  totalReports: number;
  completedReports: number;
  failedReports: number;
  scheduledReports: number;
  averageGenerationTime: number;
  totalDataProcessed: number;
  popularReportTypes: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
}

// API Response type
interface ApiResponse<T> {
  data?: T;
  error?: string;
  statusCode?: number;
}

// Dummy data for reports
export const DUMMY_REPORTS: ReportData[] = [
  {
    id: "rpt-001",
    title: "Monthly Revenue Report",
    description: "Comprehensive revenue analysis for the current month including appointment fees, procedure costs, and insurance reimbursements",
    type: "financial",
    category: "revenue",
    status: "completed",
    format: "pdf",
    dateRange: {
      startDate: "2024-01-01",
      endDate: "2024-01-31"
    },
    filters: {
      departments: ["cardiology", "dermatology", "pediatrics"],
      appointmentTypes: ["consultation", "procedure", "follow-up"]
    },
    metrics: {
      totalRecords: 1250,
      dataPoints: 15000,
      accuracy: 98.5
    },
    schedule: {
      frequency: "monthly",
      nextRun: "2024-02-01T09:00:00Z",
      recipients: ["admin@heallink.com", "finance@heallink.com"]
    },
    downloadUrl: "/api/reports/rpt-001/download",
    fileSize: 2048576, // 2MB
    generatedBy: "System",
    generatedAt: "2024-01-31T23:59:00Z",
    created: "2024-01-01T00:00:00Z",
    updated: "2024-01-31T23:59:00Z"
  },
  {
    id: "rpt-002",
    title: "Patient Outcomes Analysis",
    description: "Clinical outcomes tracking including treatment success rates, patient satisfaction scores, and follow-up compliance",
    type: "clinical",
    category: "patient-outcomes",
    status: "completed",
    format: "excel",
    dateRange: {
      startDate: "2024-01-01",
      endDate: "2024-01-31"
    },
    filters: {
      doctors: ["doc-001", "doc-002", "doc-003"],
      patientDemographics: {
        ageRange: { min: 18, max: 65 },
        insuranceProviders: ["Blue Cross", "Aetna", "Cigna"]
      }
    },
    metrics: {
      totalRecords: 850,
      dataPoints: 8500,
      accuracy: 96.2
    },
    downloadUrl: "/api/reports/rpt-002/download",
    fileSize: 1536000, // 1.5MB
    generatedBy: "Dr. Sarah Wilson",
    generatedAt: "2024-01-30T14:30:00Z",
    created: "2024-01-25T10:00:00Z",
    updated: "2024-01-30T14:30:00Z"
  },
  {
    id: "rpt-003",
    title: "Staff Performance Dashboard",
    description: "Comprehensive staff performance metrics including appointment completion rates, patient satisfaction, and productivity indicators",
    type: "staff",
    category: "staff-performance",
    status: "generating",
    format: "pdf",
    dateRange: {
      startDate: "2024-01-01",
      endDate: "2024-01-31"
    },
    filters: {
      departments: ["all"]
    },
    metrics: {
      totalRecords: 0,
      dataPoints: 0,
      accuracy: 0
    },
    schedule: {
      frequency: "weekly",
      nextRun: "2024-02-05T09:00:00Z",
      recipients: ["hr@heallink.com", "admin@heallink.com"]
    },
    generatedBy: "HR Manager",
    created: "2024-01-31T08:00:00Z",
    updated: "2024-01-31T08:00:00Z"
  },
  {
    id: "rpt-004",
    title: "Appointment Analytics",
    description: "Detailed analysis of appointment patterns, no