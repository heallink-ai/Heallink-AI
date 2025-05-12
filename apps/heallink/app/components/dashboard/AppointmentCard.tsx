"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/app/theme/ThemeProvider";

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
  const { theme } = useTheme();

  // CSS styles directly using the color hex values from globals.css
  const buttonStyle = {
    backgroundColor: theme === "light" ? "#5a2dcf" : "var(--primary)", // Use the darker purple-heart color in light mode
    color: "white",
  };

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
          <div className="relative w-16 h-16 rounded-full border border-primary/10 overflow-hidden">
            <Image
              src={appointment.avatar}
              alt={appointment.doctor}
              width={64}
              height={64}
              className="rounded-full object-cover"
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

        <div className="flex items-center justify-center gap-3 mt-4">
          {appointment.isVirtual ? (
            <>
              <Link
                href="/appointments/join"
                style={buttonStyle}
                className="py-2 px-4 rounded-lg text-center transition-colors font-medium cursor-pointer hover:opacity-90"
              >
                Join Call
              </Link>

              <Link
                href="/appointments/details"
                className="py-2 px-4 rounded-lg bg-background hover:bg-background/80 border border-primary/20 text-foreground transition-colors text-center cursor-pointer"
              >
                Details
              </Link>
            </>
          ) : (
            <Link
              href="/appointments/details"
              style={buttonStyle}
              className="py-2 px-4 rounded-lg text-center transition-colors font-medium cursor-pointer hover:opacity-90"
            >
              View Details
            </Link>
          )}

          <Link
            href="/appointments/reschedule"
            className="py-2 px-4 rounded-lg bg-background hover:bg-background/80 border border-primary/20 text-foreground transition-colors text-center cursor-pointer"
          >
            Reschedule
          </Link>
        </div>
      </div>
    </div>
  );
}
