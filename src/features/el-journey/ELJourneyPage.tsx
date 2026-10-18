"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CheckCircle2,
  User,
  GraduationCap,
  Clock,
  Sparkles,
} from "lucide-react";
import { cn } from "@/utils";
import ITBrandingIntro from "@/components/common/it-branding-intro";
import PFLStageLoader from "@/components/ui/pfl-stage-loader";

// Stage components
import Stage3BasicDetails from "./components/stage3-basic-details";
import Stage4Consent from "./components/stage4-consent";
import Stage5EmploymentVerification from "./components/stage5-employment-verification";
import Stage6InitialOffer from "./components/stage6-initial-offer";
import Stage7BankingVerification from "./components/stage7-banking-verification";
import Stage8FinalOffer from "./components/stage8-final-offer";
import Stage9CustomerTimeline from "./components/stage9-customer-timeline";
import Stage10Disbursement from "./components/stage10-disbursement";

import {
  DEMO_PROFILES,
  DemoProfile,
  MOCK_EXISTING_EL_LEADS,
} from "./constants/el-mock-data";

export const EL_STAGES = [
  { id: 1, title: "Customer Details" },
  { id: 2, title: "Digital Consent" },
  { id: 3, title: "Employment Verify" },
  { id: 4, title: "Initial Offer" },
  { id: 5, title: "Banking Verify" },
  { id: 6, title: "Banking Offer" },
  { id: 7, title: "Timeline" },
  { id: 8, title: "Disbursement" },
];

export default function ElLeadJourneyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initial stage check from URL params (e.g. ?resumeStage=3&ref=EL-84920)
  const initialStageParam = searchParams.get("resumeStage");
  const initialRefParam = searchParams.get("ref");
  const initialMobileParam = searchParams.get("mobile");
  const initialCaseParam = searchParams.get("case");

  const [currentStep, setCurrentStep] = useState<number>(() => {
    if (initialStageParam) {
      const parsed = parseInt(initialStageParam, 10);
      if (parsed >= 1 && parsed <= 8) return parsed;
    }
    return 1; // Starts at Stage 1: Customer Details
  });

  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [pendingNextStep, setPendingNextStep] = useState<number | null>(null);

  // Application Reference & Customer Data
  const appId = useMemo(() => initialRefParam || `EL-${Math.floor(Math.random() * 90000) + 10000}`, [initialRefParam]);
  const MOCK_AGENT = { name: "Priya Sharma", code: "AG-DEL-1049" };

  const [customerData, setCustomerData] = useState<DemoProfile>(() => {
    const base = DEMO_PROFILES[0];
    if (initialMobileParam) {
      return { ...base, mobile: initialMobileParam };
    }
    return base;
  });

  // Loader state
  const [isSimulatingLoader, setIsSimulatingLoader] = useState<boolean>(false);

  // Stepper Calculation
  const currentIdx = EL_STAGES.findIndex((s) => s.id === currentStep);
  const progressPct =
    currentIdx >= 0 ? Math.round(((currentIdx + 1) / EL_STAGES.length) * 100) : 0;

  // Stage navigation
  const goTo = (step: number) => {
    setPendingNextStep(step);
  };

  const completeLoadingTransition = () => {
    if (pendingNextStep !== null) {
      setCurrentStep(pendingNextStep);
      setPendingNextStep(null);
      setIsSimulatingLoader(false);
    }
  };

  // Stage Handlers
  const handleStage1Complete = (data: DemoProfile) => {
    setCustomerData(data);
    goTo(2);
  };

  const handleStage2Complete = () => {
    goTo(3); // To Stage 3: Employment Verification
  };

  const handleStage3Skip = () => {
    goTo(4); // Skip Stage 3 -> directly to Stage 4: Initial Offer
  };

  const handleStage3Complete = () => {
    goTo(4); // Complete Stage 3 -> to Stage 4: Initial Offer
  };

  const handleStage4ContinueWithOffer = (offerData?: any) => {
    if (offerData) {
      setCustomerData((prev) => ({
        ...prev,
        loanAmount: offerData.amount,
        loanTenure: offerData.tenure,
      }));
    }
    goTo(6); // Continue with this offer -> skips directly to Final Sanction (Stage 6)
  };

  const handleStage4ContinueForBanking = (offerData?: any) => {
    if (offerData) {
      setCustomerData((prev) => ({
        ...prev,
        loanAmount: offerData.amount,
        loanTenure: offerData.tenure,
      }));
    }
    goTo(5); // Continue for Banking Offer -> proceeds to Banking Verify (Stage 5)
  };

  const handleStage4Edit = () => {
    goTo(1); // Back to Customer Details
  };

  const handleStage5Complete = () => {
    goTo(6); // To Final Sanction (Stage 6)
  };

  const handleStage6Complete = () => {
    goTo(7); // To Timeline (Stage 7)
  };

  const handleStage7Complete = () => {
    goTo(8); // To Disbursement (Stage 8)
  };

  const handleFinishJourney = () => {
    router.push("/dashboard");
  };

  // Resume Existing Lead handler from duplicate check
  const handleResumeLead = (leadAppId: string) => {
    const found = MOCK_EXISTING_EL_LEADS.find((l) => l.appId === leadAppId);
    if (found) {
      goTo(found.stageId);
    } else {
      goTo(4);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* ── Header (Exact Business Loan Layout) ── */}
      <div className="mb-8">
        <Link href="/dashboard">
          <Button
            variant="ghost"
            className="mb-4 pl-0 hover:bg-transparent hover:text-[#004499] text-sm font-medium text-slate-600"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-200">
                <GraduationCap className="h-5 w-5" />
              </span>
              <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
                Pulse EL Lead Journey
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Domestic Agent-Assisted Education Loan Management
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Agent Badge (Exact BL Style) */}
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
              <div className="w-7 h-7 rounded-full bg-[#004499]/10 flex items-center justify-center shrink-0">
                <User className="h-4 w-4 text-[#004499]" />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                  Agent
                </p>
                <p className="text-sm font-bold text-slate-800 leading-tight">{MOCK_AGENT.name}</p>
                <p className="text-[10px] font-mono text-[#004499] leading-none">{MOCK_AGENT.code}</p>
              </div>
            </div>

            {/* Progress Counter */}
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                Progress
              </p>
              <p className="text-sm font-bold text-[#004499] leading-tight mt-0.5">
                {progressPct}% Complete
              </p>
            </div>

            {/* Application ID Tag */}
            <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-mono">
              #{appId}
            </span>
          </div>
        </div>

        {/* ── Progress bar + Stepper (Exact BL Stepper Style) ── */}
        <div className="relative py-6 px-2">
          <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-100 -translate-y-1/2 rounded-full" />
          <div
            className="absolute top-1/2 left-0 h-1.5 bg-emerald-500 -translate-y-1/2 transition-all duration-700 ease-in-out rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"
            style={{ width: `${progressPct}%` }}
          />

          <div className="relative flex justify-between items-center">
            {EL_STAGES.map((s) => {
              const done = currentStep > s.id;
              const active = currentStep === s.id;

              return (
                <div key={s.id} className="flex flex-col items-center group cursor-default">
                  <div
                    className={cn(
                      "relative w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-500 z-10",
                      done
                        ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100"
                        : active
                        ? "bg-white border-[#004499] text-[#004499] ring-4 ring-blue-50 scale-110 shadow-md"
                        : "bg-white border-slate-200 text-slate-300 scale-90"
                    )}
                  >
                    {done ? <CheckCircle2 className="h-4 w-4" strokeWidth={3} /> : s.id}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity z-20">
                      {s.title} • {done ? "Done" : active ? "Active" : "Upcoming"}
                    </div>
                  </div>
                  <span
                    className={cn(
                      "mt-3 text-[9px] font-bold uppercase tracking-tighter transition-colors duration-300 max-w-[65px] text-center leading-tight",
                      active ? "text-[#004499]" : done ? "text-emerald-600" : "text-slate-400"
                    )}
                  >
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Content Card (Exact BL Single Full-Width Container) ── */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 min-h-[500px]">
        {showIntro ? (
          <ITBrandingIntro
            productName="Pulse Education Loan Agent Assist"
            onFinish={() => setShowIntro(false)}
          />
        ) : pendingNextStep !== null ? (
          <PFLStageLoader onComplete={completeLoadingTransition} />
        ) : (
          <>
            {currentStep === 1 && (
              <Stage3BasicDetails
                initialMobile={customerData.mobile}
                initialCase={initialCaseParam}
                initialData={customerData}
                onComplete={handleStage1Complete}
                onResumeExistingLead={handleResumeLead}
              />
            )}

            {currentStep === 2 && (
              <Stage4Consent
                customerMobile={customerData.mobile}
                customerName={customerData.fullName}
                onComplete={handleStage2Complete}
              />
            )}

            {currentStep === 3 && (
              <Stage5EmploymentVerification
                customerData={customerData}
                appId={appId}
                onSkip={handleStage3Skip}
                onComplete={handleStage3Complete}
                onBack={() => goTo(2)}
              />
            )}

            {currentStep === 4 && (
              <Stage6InitialOffer
                customerData={customerData}
                appId={appId}
                onContinueWithOffer={handleStage4ContinueWithOffer}
                onContinueForBanking={handleStage4ContinueForBanking}
                onContinue={() => goTo(5)}
                onEditDetails={handleStage4Edit}
              />
            )}

            {currentStep === 5 && (
              <Stage7BankingVerification
                customerMobile={customerData.mobile}
                customerName={customerData.fullName}
                onComplete={handleStage5Complete}
              />
            )}

            {currentStep === 6 && (
              <Stage8FinalOffer
                customerData={customerData}
                appId={appId}
                onContinue={handleStage6Complete}
                isSimulatingLoader={isSimulatingLoader}
                setIsSimulatingLoader={setIsSimulatingLoader}
              />
            )}

            {currentStep === 7 && (
              <Stage9CustomerTimeline
                customerMobile={customerData.mobile}
                customerName={customerData.fullName}
                onComplete={handleStage7Complete}
              />
            )}

            {currentStep === 8 && (
              <Stage10Disbursement
                appId={appId}
                customerData={customerData}
                onFinishJourney={handleFinishJourney}
                isSimulatingLoader={isSimulatingLoader}
                setIsSimulatingLoader={setIsSimulatingLoader}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
