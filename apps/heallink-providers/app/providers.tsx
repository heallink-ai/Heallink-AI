"use client";

import { SessionProvider } from "next-auth/react";
import { QueryProvider } from "./providers/QueryProvider";

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <QueryProvider>
        {children}
      </QueryProvider>
    </SessionProvider>
  );
}