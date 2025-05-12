"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ActionButtonProps {
  icon: ReactNode;
  label: string;
  href: string;
}

export default function ActionButton({ icon, label, href }: ActionButtonProps) {
  return (
    <Link href={href}>
      <motion.div
        className="flex flex-col items-center justify-center h-full p-4 rounded-xl bg-card neumorph-flat text-center gap-3"
        whileHover={{ y: -5, backgroundColor: "rgba(var(--primary), 0.05)" }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        <span className="text-sm font-medium">{label}</span>
      </motion.div>
    </Link>
  );
}
