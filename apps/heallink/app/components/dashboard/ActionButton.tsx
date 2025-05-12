"use client";

import Link from "next/link";

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  href: string;
}

export default function ActionButton({ icon, label, href }: ActionButtonProps) {
  return (
    <Link
      href={href}
      className="p-4 bg-card hover:bg-primary/5 rounded-xl flex flex-col items-center justify-center gap-3 transition-all neumorph-flat group"
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-heart to-royal-blue flex items-center justify-center text-white group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}
