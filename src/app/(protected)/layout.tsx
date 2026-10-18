"use client";

import { useAuth } from "@/core/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AppLayout from "@/components/common/app-layout";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004499]"></div>
      </div>
    );
  }

  return <AppLayout>{children}</AppLayout>;
}
