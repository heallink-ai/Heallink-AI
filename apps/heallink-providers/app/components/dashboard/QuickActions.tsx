"use client";

import Link from "next/link";
import { Plus, UserPlus, Calendar, FileText } from "lucide-react";
import Button from "../ui/Button";

const actions = [
  {
    title: "Add New Doctor",
    description: "Register a new doctor to your practice",
    href: "/dashboard/doctors/new",
    icon: UserPlus,
    color: "bg-blue-500",
  },
  {
    title: "Add Staff Member",
    description: "Add a new staff member",
    href: "/dashboard/staff/new",
    icon: Plus,
    color: "bg-green-500",
  },
  {
    title: "Schedule Appointment",
    description: "Book a new appointment",
    href: "/dashboard/appointments/new",
    icon: Calendar,
    color: "bg-purple-500",
  },
  {
    title: "Generate Report",
    description: "Create practice reports",
    href: "/dashboard/reports/new",
    icon: FileText,
    color: "bg-orange-500",
  },
];

export default function QuickActions() {
  return (
    <div className="neumorph-flat p-6 bg-card">
      <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <Link key={index} href={action.href}>
            <div className="flex items-center p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
              <div className={`h-10 w-10 ${action.color} rounded-lg flex items-center justify-center mr-3`}>
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{action.title}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}