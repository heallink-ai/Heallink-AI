"use client";

interface AuthDividerProps {
  text?: string;
}

export default function AuthDivider({ text = "or" }: AuthDividerProps) {
  return (
    <div className="flex items-center my-6">
      <div className="flex-grow h-px bg-border"></div>
      {text && <span className="px-4 text-sm text-muted-foreground">{text}</span>}
      <div className="flex-grow h-px bg-border"></div>
    </div>
  );
}