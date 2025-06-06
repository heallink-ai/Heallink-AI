"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--ring)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-[#5a2dcf] to-[#2066e4] text-white font-semibold shadow-lg hover:shadow-xl hover:from-[#5a2dcf]/90 hover:to-[#2066e4]/90 active:scale-95",
        secondary: "bg-[color:var(--secondary)] text-white hover:bg-[color:var(--secondary)]/90",
        outline: "border border-gray-300 dark:border-gray-600 bg-transparent text-[color:var(--foreground)] hover:bg-[color:var(--muted)] neumorph-flat",
        ghost: "bg-transparent text-[color:var(--foreground)] hover:bg-[color:var(--muted)]",
        destructive: "bg-red-500 text-white hover:bg-red-600",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  className,
  variant,
  size,
  loading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      className={cn(
        buttonVariants({ variant, size, className }),
        isPressed && "scale-95",
        variant === "default" && "neumorph-button"
      )}
      disabled={disabled || loading}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}