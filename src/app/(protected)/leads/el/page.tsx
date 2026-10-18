"use client";
import React, { Suspense } from "react";
import ElLeadJourneyPage from "@/features/el-journey/ELJourneyPage";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004499]"></div>
        </div>
      }
    >
      <ElLeadJourneyPage />
    </Suspense>
  );
}
