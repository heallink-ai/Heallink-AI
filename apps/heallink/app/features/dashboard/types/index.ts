export type NotificationType = "appointment" | "message" | "payment";

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  time: string;
}

export interface Message {
  id: number;
  sender: string;
  message: string;
  time: string;
  unread: boolean;
  avatar: string;
}

export interface Appointment {
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  isVirtual: boolean;
  avatar: string;
}

export interface HealthSnapshot {
  bloodPressure: string;
  glucose: string;
  weight: string;
  lastUpdated: string;
  trends: {
    bloodPressure: number[];
    glucose: number[];
    weight: number[];
  };
}

export interface Billing {
  outstanding: string;
  nextDue: string;
  invoiceId: string;
}

export interface UserData {
  name: string;
  avatar: string;
  nextAppointment: Appointment;
  notifications: Notification[];
  messages: Message[];
  healthSnapshot: HealthSnapshot;
  billing: Billing;
}

export interface ToastProps {
  message: string;
  isVisible: boolean;
  type?: "info" | "success" | "error";
}

export interface FloatingButtonPosition {
  x: number;
  y: number;
}
