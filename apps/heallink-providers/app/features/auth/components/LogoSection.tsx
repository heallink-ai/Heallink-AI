"use client";

import { Heart } from "lucide-react";

interface LogoSectionProps {
  isProviderPortal?: boolean;
}

export function LogoSection({ isProviderPortal = true }: LogoSectionProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-heart to-royal-blue shadow-lg">
        <Heart className="w-7 h-7 text-white fill-white" />
      </div>
      <div>
        <h1 className="text-2xl font-bold gradient-text">Heallink</h1>
        {isProviderPortal && (
          <p className="text-sm text-[color:var(--muted-foreground)]">
            Provider Portal
          </p>
        )}
      </div>
    </div>
  );
}