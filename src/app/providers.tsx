"use client";

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/core/contexts/auth-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <AuthProvider>
         {children}
         <Toaster />
      </AuthProvider>
    </TooltipProvider>
  );
}
