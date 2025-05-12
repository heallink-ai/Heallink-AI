"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface AppointmentData {
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  isVirtual: boolean;
  avatar: string;
}

interface AppointmentCardProps {
  appointment: AppointmentData;
}

export default function AppointmentCard({ appointment }: AppointmentCardProps) {
  return (
    <motion.div
      className="p-4 rounded-xl bg-card neumorph-flat relative overflow-hidden"
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* Background decoration */}
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-primary/5 blur-2xl"></div>
      <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-primary/5 blur-2xl"></div>

      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold">Next Appointment</h3>
        <span className="inline-flex items-center py-1 px-2 rounded-lg bg-primary/10 text-primary text-xs">
          {appointment.date}, {appointment.time}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden">
          <Image
            src={appointment.avatar}
            alt={appointment.doctor}
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        </div>

        <div className="flex-1">
          <h4 className="font-medium text-lg">{appointment.doctor}</h4>
          <p className="text-foreground/70 text-sm">{appointment.specialty}</p>

          <div className="flex items-center gap-2 mt-2">
            {appointment.isVirtual ? (
              <span className="inline-flex items-center gap-1 text-xs py-1 px-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14v-4z" />
                  <rect width="15" height="14" x="3" y="5" rx="2" ry="2" />
                </svg>
                Virtual Visit
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs py-1 px-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                  <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
                  <path d="M12 20v-8" />
                  <path d="M8 12h8" />
                </svg>
                In-Person
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:self-end w-full sm:w-auto">
          {appointment.isVirtual ? (
            <motion.button
              className="py-2 px-4 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors text-sm flex justify-center items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
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
              >
                <path d="M12 2c1.7 0 3 1.3 3 3v6c0 1.7-1.3 3-3 3s-3-1.3-3-3V5c0-1.7 1.3-3 3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <path d="M12 18v4" />
                <path d="M8 22h8" />
              </svg>
              Join Call
            </motion.button>
          ) : (
            <motion.button
              className="py-2 px-4 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors text-sm flex justify-center items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
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
              >
                <path d="M8 7V5c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v2" />
                <path d="M16 21H8a2 2 0 0 1-2-2V7h12v12a2 2 0 0 1-2 2z" />
                <path d="M12 11v4" />
                <path d="M10 13h4" />
              </svg>
              Check In
            </motion.button>
          )}

          <Link
            href="/appointments/upcoming"
            className="py-2 px-4 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm text-center"
          >
            Reschedule
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
