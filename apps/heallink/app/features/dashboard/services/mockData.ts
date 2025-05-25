import { UserData } from "../types";

// Mock data - in production would come from API
export const getUserData = (): UserData => {
  return {
    name: "Alex Johnson",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    nextAppointment: {
      doctor: "Dr. Sarah Williams",
      specialty: "Cardiologist",
      date: "Today",
      time: "3:30 PM",
      isVirtual: true,
      avatar:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    },
    notifications: [
      {
        id: 1,
        type: "appointment",
        message:
          "Reminder: Appointment with Dr. Sarah Williams tomorrow at 3:30 PM",
        time: "1 hour ago",
      },
      {
        id: 2,
        type: "message",
        message: "Dr. Williams sent you lab results",
        time: "Yesterday",
      },
      {
        id: 3,
        type: "payment",
        message: "Invoice #HEA-1023 payment successful",
        time: "2 days ago",
      },
    ],
    messages: [
      {
        id: 1,
        sender: "Dr. Sarah Williams",
        message:
          "Your latest test results look good. Let's discuss in our appointment.",
        time: "1 hour ago",
        unread: true,
        avatar:
          "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
      },
      {
        id: 2,
        sender: "Dr. Robert Chen",
        message: "Please remember to take your medication as prescribed.",
        time: "Yesterday",
        unread: false,
        avatar:
          "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
      },
    ],
    healthSnapshot: {
      bloodPressure: "120/80",
      glucose: "95 mg/dL",
      weight: "170 lbs",
      lastUpdated: "Today, 9:30 AM",
      trends: {
        bloodPressure: [118, 122, 125, 119, 120],
        glucose: [100, 98, 97, 96, 95],
        weight: [172, 171, 170, 170, 170],
      },
    },
    billing: {
      outstanding: "$125.00",
      nextDue: "Oct 15, 2023",
      invoiceId: "HEA-1089",
    },
  };
};