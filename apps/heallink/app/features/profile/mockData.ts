import { UserProfileData } from "./types";

export const mockUserProfile: UserProfileData = {
  id: "usr-12345",
  name: "Sarah Johnson",
  email: "sarah.johnson@example.com",
  phone: "+1 (555) 123-4567",
  emailVerified: true,
  phoneVerified: false,
  avatarUrl:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop",
  role: "patient",
  dateOfBirth: "1992-05-15",
  gender: "female",
  created: "2022-07-15T08:30:00",
  lastActive: "2023-06-30T14:45:00",
  address: {
    streetAddress: "123 Health Street",
    city: "San Francisco",
    state: "CA",
    zipCode: "94107",
    country: "us",
  },
  emergencyContact: {
    name: "Michael Johnson",
    relationship: "spouse",
    phone: "+1 (555) 987-6543",
  },
  medicalInformation: {
    bloodType: "O+",
    allergies: ["Penicillin", "Peanuts", "Shellfish"],
    medications: ["Lisinopril 10mg", "Vitamin D3", "Multivitamin"],
    chronicConditions: ["Asthma", "Hypertension"],
    insuranceProvider: "Blue Shield",
    insurancePolicyNumber: "BSP-987654321",
    primaryCarePhysician: "Dr. Robert Chen",
  },
  insurance: {
    provider: "Blue Cross Blue Shield",
    policyNumber: "BCBS-12345678",
    groupNumber: "GRP-987654",
    primaryInsured: "Sarah Johnson",
    relationship: "self",
  },
  communicationPreferences: {
    email: true,
    sms: true,
    push: false,
  },
};
