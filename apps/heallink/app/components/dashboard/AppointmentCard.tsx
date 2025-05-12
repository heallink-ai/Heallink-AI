"use client";

import Image from "next/image";
import Link from "next/link";

interface AppointmentProps {
  appointment: {
    doctor: string;
    specialty: string;
    date: string;
    time: string;
    isVirtual: boolean;
    avatar: string;
  };
}

export default function AppointmentCard({ appointment }: AppointmentProps) {
  return (
    <div className="p-4 bg-card rounded-xl neumorph-flat relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-heart/10 to-royal-blue/5 rounded-bl-[100px] -z-0" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-semibold">Next Appointment</h2>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              appointment.isVirtual
                ? "bg-purple-heart/10 text-purple-heart"
                : "bg-royal-blue/10 text-royal-blue"
            }`}
          >
            {appointment.isVirtual ? "Virtual Visit" : "In-Person"}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full border-2 border-primary/20 overflow-hidden">
            <Image
              src={appointment.avatar}
              alt={appointment.doctor}
              layout="fill"
              objectFit="cover"
              className="rounded-full"
            />
          </div>

          <div className="flex-1">
            <h3 className="font-medium text-lg">{appointment.doctor}</h3>
            <p className="text-foreground/70 text-sm">
              {appointment.specialty}
            </p>
            <div className="flex gap-1 items-center mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
              <span className="text-sm">
                {appointment.date} at {appointment.time}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Link
            href={
              appointment.isVirtual
                ? "/appointments/join"
                : "/appointments/details"
            }
            className="flex-1 bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-lg text-center transition-colors"
          >
            {appointment.isVirtual ? "Join Call" : "View Details"}
          </Link>

          <Link
            href="/appointments/reschedule"
            className="py-2 px-4 rounded-lg bg-background hover:bg-background/80 border border-primary/20 text-foreground transition-colors"
          >
            Reschedule
          </Link>
        </div>
      </div>
    </div>
  );
}
