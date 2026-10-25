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
  Check,
  ShieldCheck,
  Briefcase,
  Building2,
  Award,
  Send,
  Banknote,
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

export interface StageMetadata {
  title: string;
  shortTitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  bgLight: string;
  textLight: string;
  borderLight: string;
}

export const STAGE_CONFIG: Record<StageKey, StageMetadata> = {
  details: {
    title: "Customer Details",
    shortTitle: "Details",
    description: "Applicant KYC, mobile & personal information",
    icon: User,
    accentColor: "#004499",
    bgLight: "bg-blue-50",
    textLight: "text-blue-600",
    borderLight: "border-blue-200",
  },
  consent: {
    title: "Digital Consent",
    shortTitle: "Consent",
    description: "Customer OTP consent for CIBIL & CKYC fetch",
    icon: ShieldCheck,
    accentColor: "#4f46e5",
    bgLight: "bg-indigo-50",
    textLight: "text-indigo-600",
    borderLight: "border-indigo-200",
  },
  employment_verify: {
    title: "Employment Verify",
    shortTitle: "Employment",
    description: "Employer verification & salary validation",
    icon: Briefcase,
    accentColor: "#d97706",
    bgLight: "bg-amber-50",
    textLight: "text-amber-600",
    borderLight: "border-amber-200",
  },
  banking_verify: {
    title: "Banking Verify",
    shortTitle: "Banking",
    description: "Net banking statement fetch & salary records",
    icon: Building2,
    accentColor: "#0284c7",
    bgLight: "bg-sky-50",
    textLight: "text-sky-600",
    borderLight: "border-sky-200",
  },
  bureau_offer: {
    title: "Final Offer",
    shortTitle: "Offer",
    description: "Pre-approved loan sanction cap & tenure selection",
    icon: Award,
    accentColor: "#059669",
    bgLight: "bg-emerald-50",
    textLight: "text-emerald-600",
    borderLight: "border-emerald-200",
  },
  banking_offer: {
    title: "Final Offer",
    shortTitle: "Offer",
    description: "Sanctioned loan offer, interest rate & EMI schedule",
    icon: Award,
    accentColor: "#059669",
    bgLight: "bg-emerald-50",
    textLight: "text-emerald-600",
    borderLight: "border-emerald-200",
  },
  timeline: {
    title: "Timeline",
    shortTitle: "DIY Link",
    description: "Send DIY Journey link & track onboarding stages",
    icon: Send,
    accentColor: "#7c3aed",
    bgLight: "bg-violet-50",
    textLight: "text-violet-600",
    borderLight: "border-violet-200",
  },
  disbursement: {
    title: "Disbursement",
    shortTitle: "Payout",
    description: "Loan agreement sign-off and fund disbursement",
    icon: Banknote,
    accentColor: "#0d9488",
    bgLight: "bg-teal-50",
    textLight: "text-teal-600",
    borderLight: "border-teal-200",
  },
  simulation: {
    title: "Route Simulator",
    shortTitle: "Simulator",
    description: "Configure journey parameters and underwriting flow",
    icon: Sliders,
    accentColor: "#64748b",
    bgLight: "bg-slate-50",
    textLight: "text-slate-600",
    borderLight: "border-slate-200",
  },
};

export const ALL_JOURNEY_STAGES = [
  {
    key: "details" as StageKey,
    stepNumber: 1,
    title: "Customer Details",
    shortTitle: "Details",
    description: "Applicant KYC, mobile & personal information",
    icon: User,
  },
  {
    key: "consent" as StageKey,
    stepNumber: 2,
    title: "Digital Consent",
    shortTitle: "Consent",
    description: "Customer OTP consent for CIBIL & CKYC fetch",
    icon: ShieldCheck,
  },
  {
    key: "employment_verify" as StageKey,
    stepNumber: 3,
    title: "Employment Verify",
    shortTitle: "Employment",
    description: "Employer verification & salary validation",
    icon: Briefcase,
  },
  {
    key: "banking_verify" as StageKey,
    stepNumber: 4,
    title: "Banking Verify",
    shortTitle: "Banking",
    description: "Net banking statement fetch & salary records",
    icon: Building2,
  },
  {
    key: "bureau_offer" as StageKey,
    stepNumber: 5,
    title: "Final Offer",
    shortTitle: "Final Offer",
    description: "Sanctioned loan offer, interest rate & EMI schedule",
    icon: Award,
  },
  {
    key: "timeline" as StageKey,
    stepNumber: 6,
    title: "Timeline",
    shortTitle: "Timeline",
    description: "Send DIY Journey link & track onboarding stages",
    icon: Send,
  },
  {
    key: "disbursement" as StageKey,
    stepNumber: 7,
    title: "Disbursement",
    shortTitle: "Disbursement",
    description: "Loan agreement sign-off and fund disbursement",
    icon: Banknote,
  },
];

const getStageIcon = (key: StageKey, className: string = "h-4 w-4") => {
  const IconComp = STAGE_CONFIG[key]?.icon || Sparkles;
  return <IconComp className={className} />;
};

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

  // ── Fixed 7-Stage Journey Definition (Always all 7 stages visible) ──
  // Sequence matches official standard: Details -> Consent -> Employment -> Banking -> Final Offer -> Timeline -> Disbursement

  // Current Active Stage
  const [currentStage, setCurrentStage] = useState<StageKey>(() => {
    if (initialStageParam) {
      if (initialStageParam === "simulation") return "simulation";
      if (initialStageParam === "1") return "details";
      if (initialStageParam === "2") return "consent";
      if (initialStageParam === "3") return "employment_verify";
      if (initialStageParam === "4") {
        return initialFlowParam === "banking" ? "banking_verify" : "bureau_offer";
      }
      if (initialStageParam === "5") {
        return initialFlowParam === "banking" ? "banking_offer" : "timeline";
      }
      if (initialStageParam === "6") return "timeline";
      if (initialStageParam === "7") return "disbursement";

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

  // ── Track Genuinely Completed Stages (Never marks skipped stages as completed) ──
  const [completedStages, setCompletedStages] = useState<Set<string>>(() => {
    const initialSet = new Set<string>();
    if (initialStageParam) {
      if (initialStageParam === "2") {
        initialSet.add("details");
      } else if (initialStageParam === "3" || initialStageParam === "simulation") {
        initialSet.add("details");
        initialSet.add("consent");
      } else if (initialStageParam === "4") {
        initialSet.add("details");
        initialSet.add("consent");
        if (initialEmpParam !== "no" && initialEmpParam !== "false") {
          initialSet.add("employment_verify");
        }
      } else if (initialStageParam === "5" || initialStageParam === "6" || initialStageParam === "banking_verify" || initialStageParam === "banking_offer") {
        initialSet.add("details");
        initialSet.add("consent");
        if (initialEmpParam !== "no" && initialEmpParam !== "false") {
          initialSet.add("employment_verify");
        }
        if (initialFlowParam === "banking" && initialStageParam !== "banking_verify") {
          initialSet.add("banking_verify");
        }
      } else if (initialStageParam === "7" || initialStageParam === "timeline") {
        initialSet.add("details");
        initialSet.add("consent");
        if (initialEmpParam !== "no" && initialEmpParam !== "false") {
          initialSet.add("employment_verify");
        }
        if (initialFlowParam === "banking") {
          initialSet.add("banking_verify");
        }
        initialSet.add("final_offer");
        initialSet.add("timeline");
      }
    }
    return initialSet;
  });

  // Stepper calculations across the fixed 7 stages
  const getActiveStepIndex = (stage: StageKey): number => {
    if (stage === "details") return 0;
    if (stage === "consent") return 1;
    if (stage === "simulation") return 1;
    if (stage === "employment_verify") return 2;
    if (stage === "banking_verify") return 3;
    if (stage === "bureau_offer" || stage === "banking_offer") return 4;
    if (stage === "timeline") return 5;
    if (stage === "disbursement") return 6;
    return 0;
  };

  const activeStepIdx = getActiveStepIndex(currentStage);
  const isSimulation = currentStage === "simulation";
  const currentStepNumber = isSimulation ? 2 : activeStepIdx + 1;
  const progressPct = isSimulation
    ? Math.round((2 / 7) * 100)
    : Math.round((currentStepNumber / 7) * 100);

  const isStageCompleted = (key: StageKey, idx: number): boolean => {
    if (isSimulation) return idx < 2;
    if (activeStepIdx === idx) return false;
    if (key === "bureau_offer" || key === "banking_offer") {
      return (
        completedStages.has("final_offer") ||
        completedStages.has("bureau_offer") ||
        completedStages.has("banking_offer")
      );
    }
    return completedStages.has(key);
  };

  const isStageActive = (key: StageKey, idx: number): boolean => {
    if (isSimulation) return false;
    return activeStepIdx === idx;
  };

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
    setCompletedStages((prev) => new Set(prev).add("details"));
    goTo("consent");
  };

  // When Consent is approved -> Proceed immediately to Simulation Screen!
  const handleStage2Complete = () => {
    setCompletedStages((prev) => new Set(prev).add("details").add("consent"));
    goTo("simulation");
  };

  // Simulation Screen Proceed Handler
  const handleSimulationProceed = () => {
    if (employmentRequired) {
      goTo("employment_verify");
    } else {
      if (offerFlow === "bureau") {
        goTo("bureau_offer");
      } else {
        goTo("banking_verify");
      }
    }
  };

  // Final Offer (Bureau Track): Continue with ₹5 Lakh -> proceeds directly to Timeline
  const handleBureauOfferContinueWithOffer = (offerData?: any) => {
    if (offerData) {
      setCustomerData((prev) => ({
        ...prev,
        loanAmount: offerData.amount,
        loanTenure: offerData.tenure,
      }));
    }
    setCompletedStages((prev) =>
      new Set(prev).add("final_offer").add("bureau_offer").add("banking_offer")
    );
    goTo("timeline");
  };

  // Final Offer (Bureau Track): Switch track to Banking Offer (₹15 Lakh)
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
    setCompletedStages((prev) =>
      new Set(prev).add("final_offer").add("bureau_offer").add("banking_offer")
    );
    goTo("timeline");
  };

  const handleEditDetails = () => {
    goTo("details");
  };

  // Bank Verification Complete -> Display Final Offer
  const handleBankingVerifyComplete = () => {
    setCompletedStages((prev) => new Set(prev).add("banking_verify"));
    goTo("banking_offer");
  };

  // Final Offer (Banking Track): Accept Banking Offer -> proceeds directly to Timeline
  const handleBankingOfferContinue = () => {
    setCompletedStages((prev) =>
      new Set(prev).add("final_offer").add("bureau_offer").add("banking_offer")
    );
    goTo("timeline");
  };

  // Employment Verification (Stage 3): Skip or Complete -> proceed to Offer track
  const handleEmploymentSkip = () => {
    // Skipped! Do NOT add employment_verify to completedStages
    if (offerFlow === "bureau") {
      goTo("bureau_offer");
    } else {
      goTo("banking_verify");
    }
  };

  const handleEmploymentComplete = () => {
    setCompletedStages((prev) => new Set(prev).add("employment_verify"));
    if (offerFlow === "bureau") {
      goTo("bureau_offer");
    } else {
      goTo("banking_verify");
    }
  };

  const handleEmploymentBack = () => {
    goTo("simulation");
  };

  const handleTimelineComplete = () => {
    setCompletedStages((prev) => new Set(prev).add("timeline"));
    goTo("disbursement");
  };

  const handleFinishJourney = () => {
    router.push("/dashboard");
  };

  // Resume Existing Lead handler from duplicate check
  const handleResumeLead = (leadAppId: string) => {
    const found = MOCK_EXISTING_EL_LEADS.find((l) => l.appId === leadAppId);
    if (found) {
      if (found.stageId === 2) {
        setCompletedStages(new Set(["details"]));
        goTo("consent");
      } else if (found.stageId === 3) {
        setCompletedStages(new Set(["details", "consent"]));
        goTo("employment_verify");
      } else if (found.stageId === 4) {
        setCompletedStages(new Set(["details", "consent", "employment_verify"]));
        goTo(offerFlow === "banking" ? "banking_verify" : "bureau_offer");
      } else if (found.stageId === 7) {
        setCompletedStages(new Set(["details", "consent", "employment_verify", "banking_verify", "final_offer", "bureau_offer", "banking_offer", "timeline"]));
        goTo("timeline");
      } else {
        setCompletedStages(new Set(["details", "consent"]));
        goTo("employment_verify");
      }
    } else {
      setCompletedStages(new Set(["details", "consent"]));
      goTo("employment_verify");
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
                {offerFlow === "bureau" ? "Final Offer (₹5L)" : "Final Offer (₹15L)"} • Emp:{" "}
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

        {/* ── Progress bar + Dynamic Stepper (Interactive with Stage Icons & Tooltips) ── */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 mb-6 relative z-30 overflow-visible transition-all duration-300 hover:shadow-md">
          {/* Ambient top border gradient */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 rounded-t-2xl" />

          {/* Stepper Header Summary Bar */}
          <div className="flex items-center justify-between pb-3.5 mb-2 border-b border-slate-100 flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#004499] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#004499]"></span>
              </span>
              <span className="font-bold text-slate-800 text-xs sm:text-sm">
                Stage {currentStepNumber} of 7:
              </span>
              <span className="inline-flex items-center gap-1.5 font-bold text-[#004499] bg-blue-50 px-3 py-1 rounded-xl border border-blue-200/80 shadow-2xs">
                {getStageIcon(currentStage === "simulation" ? "consent" : currentStage, "h-3.5 w-3.5 text-[#004499]")}
                <span>
                  {currentStage === "simulation"
                    ? "Digital Consent"
                    : STAGE_CONFIG[currentStage]?.title || "Current Stage"}
                </span>
              </span>
              <span className="hidden sm:inline text-slate-300 font-bold">•</span>
              <span className="hidden md:inline text-slate-500 font-medium text-[11px] sm:text-xs">
                {currentStage === "simulation"
                  ? STAGE_CONFIG["consent"]?.description
                  : STAGE_CONFIG[currentStage]?.description}
              </span>
            </div>

            <div className="flex items-center gap-2.5 ml-auto text-[11px] sm:text-xs">
              <span className="text-slate-400 hidden lg:inline flex items-center gap-1">
                💡 Click completed stage to review
              </span>
              <div className="flex items-center gap-1.5 bg-slate-100/90 text-slate-700 px-3 py-1 rounded-full font-mono text-[11px] sm:text-xs font-bold border border-slate-200/80 shadow-2xs">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>{progressPct}% Completed</span>
              </div>
            </div>
          </div>

          <div className="relative pt-10 pb-2 px-2 sm:px-6">
            {/* Background connecting track perfectly centered through icon nodes */}
            <div className="absolute top-[64px] sm:top-[68px] left-[32px] sm:left-[52px] right-[32px] sm:right-[52px] h-2 -translate-y-1/2 pointer-events-none">
              {/* Base grey line */}
              <div className="absolute inset-0 bg-slate-100 rounded-full border border-slate-200/70" />

              {/* 6 Interval Segments */}
              <div className="absolute inset-0 flex overflow-hidden rounded-full">
                {[0, 1, 2, 3, 4, 5].map((segIdx) => {
                  const leftStage = ALL_JOURNEY_STAGES[segIdx];
                  const rightStage = ALL_JOURNEY_STAGES[segIdx + 1];

                  const leftDone = isStageCompleted(leftStage.key, segIdx);
                  const rightDone = isStageCompleted(rightStage.key, segIdx + 1);
                  const rightActive = isStageActive(rightStage.key, segIdx + 1);
                  const leftActive = isStageActive(leftStage.key, segIdx);

                  const isGreen = leftDone && (rightDone || rightActive);
                  const isBlueProtrusion = leftActive;

                  return (
                    <div key={segIdx} className="relative flex-1 h-full">
                      {isGreen && (
                        <div className="w-full h-full bg-emerald-500 transition-all duration-500" />
                      )}
                      {!isGreen && isBlueProtrusion && (
                        <div className="w-1/2 h-full bg-[#004499] rounded-r-full shadow-xs transition-all duration-500" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative flex justify-between items-start">
              {ALL_JOURNEY_STAGES.map((s, idx) => {
                const done = isStageCompleted(s.key, idx);
                const active = isStageActive(s.key, idx);
                const meta = STAGE_CONFIG[s.key];

                return (
                  <div
                    key={s.key}
                    onClick={() => {
                      if (done) {
                        if (s.key === "bureau_offer") {
                          goTo(offerFlow === "banking" ? "banking_offer" : "bureau_offer");
                        } else {
                          goTo(s.key);
                        }
                      }
                    }}
                    className={cn(
                      "flex flex-col items-center group relative select-none transition-all duration-300",
                      done ? "cursor-pointer" : "cursor-default"
                    )}
                  >
                    {/* Floating Interactive Tooltip positioned cleanly in the upper clear zone */}
                    <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-md text-white py-1.5 px-3 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 pointer-events-none transition-all duration-200 z-50 border border-slate-700/60 flex flex-col items-center gap-0.5 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1.5 w-full">
                        <span className="font-bold text-xs flex items-center gap-1 text-blue-200">
                          {getStageIcon(s.key, "h-3 w-3 text-blue-300")}
                          <span>Stage {s.stepNumber}: {s.title}</span>
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-500" />
                        {done ? (
                          <span className="text-[9px] font-bold text-emerald-300 bg-emerald-950/80 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                            <Check className="h-2 w-2 stroke-[3]" /> Completed
                          </span>
                        ) : active ? (
                          <span className="text-[9px] font-bold text-blue-300 bg-blue-950/80 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" /> Active
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
                            {idx < activeStepIdx ? "Skipped / Inactive" : "Upcoming"}
                          </span>
                        )}
                      </div>
                      <p className="text-[9.5px] text-slate-300 font-normal leading-tight">
                        {meta?.description}
                      </p>
                      {done && (
                        <span className="text-[8.5px] text-emerald-400 font-medium">
                          👉 Click to jump back to this stage
                        </span>
                      )}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 border-r border-b border-slate-700/60" />
                    </div>

                    {/* Stage Icon Node */}
                    <div
                      className={cn(
                        "relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-300 z-10",
                        done
                          ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/25 border-2 border-emerald-400 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-emerald-500/35"
                          : active
                          ? "bg-white border-2 border-[#004499] text-[#004499] ring-4 ring-blue-500/20 shadow-lg shadow-blue-500/25 scale-105"
                          : "bg-white border-2 border-slate-200 text-slate-400 shadow-2xs"
                      )}
                    >
                      {/* Main Stage Icon */}
                      {getStageIcon(
                        s.key,
                        cn(
                          "transition-transform duration-300",
                          active
                            ? "h-5 w-5 sm:h-6 sm:w-6 text-[#004499]"
                            : done
                            ? "h-5 w-5 sm:h-6 sm:w-6 text-white"
                            : "h-5 w-5 sm:h-6 sm:w-6 text-slate-400"
                        )
                      )}

                      {/* Active State Floating Stage Pill */}
                      {active && (
                        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#004499] text-white text-[9.5px] font-bold px-2.5 py-0.5 rounded-full shadow-md whitespace-nowrap tracking-wider font-mono">
                          STAGE {s.stepNumber}
                        </span>
                      )}

                      {/* Completed State Checkmark Badge */}
                      {done && (
                        <span className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-emerald-600 text-white border-2 border-white flex items-center justify-center shadow-xs">
                          <Check className="h-2.5 w-2.5 stroke-[3]" />
                        </span>
                      )}

                      {/* Inactive / Upcoming / Skipped State Number Badge */}
                      {!done && !active && (
                        <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full bg-slate-100 text-slate-400 border border-slate-200 text-[9px] font-bold font-mono flex items-center justify-center">
                          {s.stepNumber}
                        </span>
                      )}
                    </div>

                    {/* Stage Title & Number Labels */}
                    <div className="mt-2.5 flex flex-col items-center space-y-0.5">
                      <span
                        className={cn(
                          "text-[10.5px] sm:text-[12px] font-bold text-center leading-tight transition-colors duration-200 max-w-[75px] sm:max-w-[95px]",
                          active
                            ? "text-[#004499] font-black"
                            : done
                            ? "text-slate-800 font-bold"
                            : "text-slate-500 font-semibold"
                        )}
                      >
                        {s.title}
                      </span>
                      <span
                        className={cn(
                          "text-[9.5px] sm:text-[10px] font-mono flex items-center gap-1",
                          active
                            ? "text-[#004499] font-bold"
                            : done
                            ? "text-emerald-600 font-bold"
                            : "text-slate-400 font-medium"
                        )}
                      >
                        {done ? (
                          <>
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                            Done
                          </>
                        ) : active ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#004499] inline-block" />
                            Active
                          </>
                        ) : (
                          `Step ${s.stepNumber}`
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
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

            {/* Bureau-Based Final Offer */}
            {currentStage === "bureau_offer" && (
              <Stage6InitialOffer
                customerData={customerData}
                appId={appId}
                stageNumber={currentStepNumber}
                onContinueWithOffer={handleBureauOfferContinueWithOffer}
                onContinueForBanking={handleBureauOfferContinueForBanking}
                onContinue={handleBureauOfferContinue}
                onEditDetails={handleEditDetails}
                onBackToSimulation={() => (employmentRequired ? goTo("employment_verify") : goTo("simulation"))}
              />
            )}

            {/* Banking Verification Stage */}
            {currentStage === "banking_verify" && (
              <Stage7BankingVerification
                customerMobile={customerData.mobile}
                customerName={customerData.fullName}
                stageNumber={currentStepNumber}
                onComplete={handleBankingVerifyComplete}
                onBack={() => (employmentRequired ? goTo("employment_verify") : goTo("simulation"))}
              />
            )}

            {/* Banking Final Offer Screen */}
            {currentStage === "banking_offer" && (
              <Stage8FinalOffer
                customerData={customerData}
                appId={appId}
                stageNumber={currentStepNumber}
                employmentRequired={employmentRequired}
                onContinue={handleBankingOfferContinue}
                onBackToSimulation={() => goTo("banking_verify")}
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
