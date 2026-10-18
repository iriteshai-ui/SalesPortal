"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CheckCircle2,
  User,
  GraduationCap,
  Clock,
  Sparkles,
  Sliders,
  Zap,
} from "lucide-react";
import { cn } from "@/utils";
import ITBrandingIntro from "@/components/common/it-branding-intro";
import PFLStageLoader from "@/components/ui/pfl-stage-loader";

// Stage components
import Stage3BasicDetails from "./components/stage3-basic-details";
import Stage4Consent from "./components/stage4-consent";
import StageSimulationScreen from "./components/stage-simulation";
import Stage6InitialOffer from "./components/stage6-initial-offer";
import Stage7BankingVerification from "./components/stage7-banking-verification";
import Stage8FinalOffer from "./components/stage8-final-offer";
import Stage5EmploymentVerification from "./components/stage5-employment-verification";
import Stage9CustomerTimeline from "./components/stage9-customer-timeline";
import Stage10Disbursement from "./components/stage10-disbursement";

import {
  DEMO_PROFILES,
  DemoProfile,
  MOCK_EXISTING_EL_LEADS,
} from "./constants/el-mock-data";

export type StageKey =
  | "details"
  | "consent"
  | "simulation"
  | "bureau_offer"
  | "banking_verify"
  | "banking_offer"
  | "employment_verify"
  | "timeline"
  | "disbursement";

export interface StageDef {
  key: StageKey;
  title: string;
  stepNumber: number;
}

export default function ElLeadJourneyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initial stage check from URL params (e.g. ?resumeStage=3&ref=EL-84920)
  const initialStageParam = searchParams.get("resumeStage");
  const initialRefParam = searchParams.get("ref");
  const initialMobileParam = searchParams.get("mobile");
  const initialCaseParam = searchParams.get("case");
  const initialFlowParam = searchParams.get("offerFlow");
  const initialEmpParam = searchParams.get("empVerify");

  // ── Simulation State (Controls Active Routing & Stepper) ──
  const [offerFlow, setOfferFlow] = useState<"bureau" | "banking">(() => {
    if (initialFlowParam === "banking") return "banking";
    if (initialStageParam === "5" || initialStageParam === "6" || initialStageParam === "banking_verify" || initialStageParam === "banking_offer") {
      return "banking";
    }
    return "bureau";
  });

  const [employmentRequired, setEmploymentRequired] = useState<boolean>(() => {
    if (initialEmpParam === "no" || initialEmpParam === "false") return false;
    return true;
  });

  // ── Dynamic Stepper Calculation ──
  // Skips unselected stages so they are NOT rendered in the progress indicator
  const activeStages = useMemo<StageDef[]>(() => {
    const list: { key: StageKey; title: string }[] = [
      { key: "details", title: "Customer Details" },
      { key: "consent", title: "Digital Consent" },
    ];

    if (offerFlow === "bureau") {
      // Case 1: Bureau-Based Offer (Skips Bank Verification & Banking Offer)
      list.push({ key: "bureau_offer", title: "Bureau-Based Offer" });
      if (employmentRequired) {
        list.push({ key: "employment_verify", title: "Employment Verify" });
      }
    } else {
      // Case 2: Banking Offer (Skips Bureau-Based Offer screen)
      list.push({ key: "banking_verify", title: "Banking Verify" });
      list.push({ key: "banking_offer", title: "Banking Offer" });
      if (employmentRequired) {
        list.push({ key: "employment_verify", title: "Employment Verify" });
      }
    }

    list.push({ key: "timeline", title: "Timeline" });
    list.push({ key: "disbursement", title: "Disbursement" });

    return list.map((item, index) => ({
      ...item,
      stepNumber: index + 1,
    }));
  }, [offerFlow, employmentRequired]);

  // Current Active Stage
  const [currentStage, setCurrentStage] = useState<StageKey>(() => {
    if (initialStageParam) {
      if (initialStageParam === "simulation") return "simulation";
      if (initialStageParam === "1") return "details";
      if (initialStageParam === "2") return "consent";
      if (initialStageParam === "3") {
        return initialFlowParam === "banking" ? "banking_verify" : "bureau_offer";
      }
      if (initialStageParam === "4") return "employment_verify";
      if (initialStageParam === "5") return "banking_verify";
      if (initialStageParam === "6") return "banking_offer";
      if (initialStageParam === "7") return "timeline";
      if (initialStageParam === "8") return "disbursement";

      // Direct string matching
      const validKeys: StageKey[] = [
        "details",
        "consent",
        "simulation",
        "bureau_offer",
        "banking_verify",
        "banking_offer",
        "employment_verify",
        "timeline",
        "disbursement",
      ];
      if (validKeys.includes(initialStageParam as StageKey)) {
        return initialStageParam as StageKey;
      }
    }
    return "details"; // Starts at Customer Details
  });

  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [pendingNextStep, setPendingNextStep] = useState<StageKey | null>(null);

  // Application Reference & Customer Data
  const appId = useMemo(
    () => initialRefParam || `EL-${Math.floor(Math.random() * 90000) + 10000}`,
    [initialRefParam]
  );
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

  // Stepper calculations
  const activeIdx = activeStages.findIndex((s) => s.key === currentStage);
  const currentStepNumber = activeIdx >= 0 ? activeStages[activeIdx].stepNumber : 1;
  const progressPct =
    currentStage === "simulation"
      ? Math.round((2 / activeStages.length) * 100)
      : activeIdx >= 0
      ? Math.round(((activeIdx + 1) / activeStages.length) * 100)
      : 0;

  // Stage navigation
  const goTo = (stage: StageKey) => {
    setPendingNextStep(stage);
  };

  const completeLoadingTransition = () => {
    if (pendingNextStep !== null) {
      setCurrentStage(pendingNextStep);
      setPendingNextStep(null);
      setIsSimulatingLoader(false);
    }
  };

  // ── Stage Handlers ──
  const handleStage1Complete = (data: DemoProfile) => {
    setCustomerData(data);
    goTo("consent");
  };

  // When Consent is approved -> Proceed immediately to Simulation Screen!
  const handleStage2Complete = () => {
    goTo("simulation");
  };

  // Simulation Screen Proceed Handler
  const handleSimulationProceed = () => {
    if (offerFlow === "bureau") {
      goTo("bureau_offer");
    } else {
      goTo("banking_verify");
    }
  };

  // Bureau-Based Offer: Continue with ₹5 Lakh
  const handleBureauOfferContinueWithOffer = (offerData?: any) => {
    if (offerData) {
      setCustomerData((prev) => ({
        ...prev,
        loanAmount: offerData.amount,
        loanTenure: offerData.tenure,
      }));
    }
    if (employmentRequired) {
      goTo("employment_verify");
    } else {
      goTo("timeline");
    }
  };

  // Bureau-Based Offer: Switch track to Banking Offer (₹15 Lakh)
  const handleBureauOfferContinueForBanking = (offerData?: any) => {
    if (offerData) {
      setCustomerData((prev) => ({
        ...prev,
        loanAmount: offerData.amount,
        loanTenure: offerData.tenure,
      }));
    }
    setOfferFlow("banking");
    goTo("banking_verify");
  };

  const handleBureauOfferContinue = () => {
    if (employmentRequired) {
      goTo("employment_verify");
    } else {
      goTo("timeline");
    }
  };

  const handleEditDetails = () => {
    goTo("details");
  };

  // Bank Verification Complete -> Display Banking Offer
  const handleBankingVerifyComplete = () => {
    goTo("banking_offer");
  };

  // Banking Offer: Accept Banking Offer
  const handleBankingOfferContinue = () => {
    if (employmentRequired) {
      goTo("employment_verify");
    } else {
      goTo("timeline");
    }
  };

  // Employment Verification: Skip or Complete
  const handleEmploymentSkip = () => {
    goTo("timeline");
  };

  const handleEmploymentComplete = () => {
    goTo("timeline");
  };

  const handleEmploymentBack = () => {
    if (offerFlow === "bureau") {
      goTo("bureau_offer");
    } else {
      goTo("banking_offer");
    }
  };

  const handleTimelineComplete = () => {
    goTo("disbursement");
  };

  const handleFinishJourney = () => {
    router.push("/dashboard");
  };

  // Resume Existing Lead handler from duplicate check
  const handleResumeLead = (leadAppId: string) => {
    const found = MOCK_EXISTING_EL_LEADS.find((l) => l.appId === leadAppId);
    if (found) {
      if (found.stageId === 2) goTo("consent");
      else if (found.stageId === 3) goTo("bureau_offer");
      else if (found.stageId === 7) goTo("timeline");
      else goTo("bureau_offer");
    } else {
      goTo("bureau_offer");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* ── Header ── */}
      <div className="mb-6">
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
            {/* Simulation Route Badge & Interactive Switcher */}
            <button
              type="button"
              onClick={() => goTo("simulation")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50/80 hover:bg-blue-100 text-xs text-[#004499] font-bold transition-all shadow-2xs cursor-pointer group"
              title="Click to configure journey path and verification rules"
            >
              <Sliders className="h-3.5 w-3.5 text-[#004499] group-hover:rotate-45 transition-transform" />
              <span>
                {offerFlow === "bureau" ? "Bureau Offer" : "Banking Offer"} • Emp:{" "}
                {employmentRequired ? "Yes" : "No"}
              </span>
              <span className="text-[10px] uppercase font-semibold text-blue-500 underline ml-0.5">
                (Change)
              </span>
            </button>

            {/* Agent Badge */}
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

        {/* ── Progress bar + Dynamic Stepper (Skipped stages are completely excluded) ── */}
        <div className="relative py-6 px-2">
          <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-100 -translate-y-1/2 rounded-full" />
          <div
            className="absolute top-1/2 left-0 h-1.5 bg-emerald-500 -translate-y-1/2 transition-all duration-700 ease-in-out rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"
            style={{ width: `${progressPct}%` }}
          />

          <div className="relative flex justify-between items-center">
            {activeStages.map((s, idx) => {
              const isSimulation = currentStage === "simulation";
              const done = isSimulation ? idx < 2 : activeIdx > idx;
              const active = isSimulation ? false : activeIdx === idx;

              return (
                <div key={s.key} className="flex flex-col items-center group cursor-default">
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
                    {done ? <CheckCircle2 className="h-4 w-4" strokeWidth={3} /> : s.stepNumber}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity z-20">
                      {s.title} • {done ? "Done" : active ? "Active" : "Upcoming"}
                    </div>
                  </div>
                  <span
                    className={cn(
                      "mt-3 text-[9px] font-bold uppercase tracking-tighter transition-colors duration-300 max-w-[70px] text-center leading-tight",
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

      {/* ── Content Card Container ── */}
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
            {/* Stage 1: Customer Details */}
            {currentStage === "details" && (
              <Stage3BasicDetails
                initialMobile={customerData.mobile}
                initialCase={initialCaseParam}
                initialData={customerData}
                onComplete={handleStage1Complete}
                onResumeExistingLead={handleResumeLead}
              />
            )}

            {/* Stage 2: Digital Consent */}
            {currentStage === "consent" && (
              <Stage4Consent
                customerMobile={customerData.mobile}
                customerName={customerData.fullName}
                onComplete={handleStage2Complete}
              />
            )}

            {/* Simulation Screen (Immediately After Consent Screen) */}
            {currentStage === "simulation" && (
              <StageSimulationScreen
                customerData={customerData}
                appId={appId}
                offerFlow={offerFlow}
                setOfferFlow={setOfferFlow}
                employmentRequired={employmentRequired}
                setEmploymentRequired={setEmploymentRequired}
                onProceed={handleSimulationProceed}
                onBack={() => goTo("consent")}
              />
            )}

            {/* Bureau-Based Offer (Renamed from Initial Offer) */}
            {currentStage === "bureau_offer" && (
              <Stage6InitialOffer
                customerData={customerData}
                appId={appId}
                stageNumber={currentStepNumber}
                onContinueWithOffer={handleBureauOfferContinueWithOffer}
                onContinueForBanking={handleBureauOfferContinueForBanking}
                onContinue={handleBureauOfferContinue}
                onEditDetails={handleEditDetails}
                onBackToSimulation={() => goTo("simulation")}
              />
            )}

            {/* Banking Verification Stage */}
            {currentStage === "banking_verify" && (
              <Stage7BankingVerification
                customerMobile={customerData.mobile}
                customerName={customerData.fullName}
                stageNumber={currentStepNumber}
                onComplete={handleBankingVerifyComplete}
                onBack={() => goTo("simulation")}
              />
            )}

            {/* Banking Offer Screen */}
            {currentStage === "banking_offer" && (
              <Stage8FinalOffer
                customerData={customerData}
                appId={appId}
                stageNumber={currentStepNumber}
                employmentRequired={employmentRequired}
                onContinue={handleBankingOfferContinue}
                onBackToSimulation={() => goTo("simulation")}
                isSimulatingLoader={isSimulatingLoader}
                setIsSimulatingLoader={setIsSimulatingLoader}
              />
            )}

            {/* Employment Verification Stage */}
            {currentStage === "employment_verify" && (
              <Stage5EmploymentVerification
                customerData={customerData}
                appId={appId}
                stageNumber={currentStepNumber}
                onSkip={handleEmploymentSkip}
                onComplete={handleEmploymentComplete}
                onBack={handleEmploymentBack}
              />
            )}

            {/* Customer Timeline Stage */}
            {currentStage === "timeline" && (
              <Stage9CustomerTimeline
                customerMobile={customerData.mobile}
                customerName={customerData.fullName}
                onComplete={handleTimelineComplete}
              />
            )}

            {/* Final Disbursement Stage */}
            {currentStage === "disbursement" && (
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
