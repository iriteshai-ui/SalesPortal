import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

// Stage components
import Stage1MobileConsent from "@/components/lead-flow/stage1-mobile-consent";
import BasicDetailsForm from "@/components/lead-flow/basic-details";          // Stage 2 – Customer Details
import BusinessDetailsStep from "@/components/lead-flow/business-details";    // Stage 3 – GST/Udyam
import Stage4OfferSimulation from "@/components/lead-flow/stage4-offer-simulation";
import BrpDetailsForm from "@/components/lead-flow/brp-details";              // Stage 5 – BRP
import Stage6BankingVerification from "@/components/lead-flow/stage6-banking-verification";
import Stage7GstOffer from "@/components/lead-flow/stage7-gst-offer";
import Stage8AdditionalDetails from "@/components/lead-flow/stage8-additional-details";
import Stage9KycStatus from "@/components/lead-flow/stage9-kyc-status";
import Stage10FieldInvestigation from "@/components/lead-flow/stage10-field-investigation";
import Stage11FinalTimeline from "@/components/lead-flow/stage11-final-timeline";

const ALL_STAGES = [
  { id: 1, title: "Mobile & Consent" },
  { id: 2, title: "Customer Details" },
  { id: 3, title: "GST / Udyam" },
  { id: 4, title: "Offer" },
  { id: 5, title: "BRP Details" },
  { id: 6, title: "Banking Verify" },
  { id: 7, title: "GST Offer" },
  { id: 8, title: "Additional Info" },
  { id: 9, title: "KYC Status" },
  { id: 10, title: "Field Invest." },
  { id: 11, title: "Final Offer" },
];

export default function LeadJourneyPage() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  // which stages are visible in the stepper (changes based on path taken)
  const [visibleSteps, setVisibleSteps] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);

  const appId = useMemo(() => `BL-${Math.floor(Math.random() * 90000) + 10000}`, []);
  const MOCK_AGENT = { name: "Arjun Verma", code: "AG-MUM-2841" };

  const next = (newVisible?: number[]) => {
    if (newVisible) setVisibleSteps(newVisible);
    setCurrentStep((p) => p + 1);
  };

  const goTo = (step: number, newVisible?: number[]) => {
    if (newVisible) setVisibleSteps(newVisible);
    setCurrentStep(step);
  };

  const activeStages = ALL_STAGES.filter((s) => visibleSteps.includes(s.id));
  const visibleIdx = visibleSteps.indexOf(currentStep);
  const progressPct = activeStages.length <= 1 ? 0 : Math.round((visibleIdx / (activeStages.length - 1)) * 100);

  // ── Stage transition handlers ───────────────────────────────────────────────
  const handleStage1 = (mobile: string) => {
    setFormData({ ...formData, mobile });
    goTo(2, [1, 2, 3, 4]);
  };

  const handleStage2 = (data: any) => {
    setFormData({ ...formData, ...data });
    goTo(3, [1, 2, 3, 4]);
  };

  const handleStage3 = (data: any) => {
    setFormData({ ...formData, ...data });
    goTo(4, [1, 2, 3, 4]);
  };

  const handleStage4 = (outcome: "rejected" | "blue_accepted" | "banking_verification" | "direct_banking") => {
    if (outcome === "rejected") {
      setLocation("/dashboard");
      return;
    }
    if (outcome === "blue_accepted") {
      // Blue path: go to Banking Verification (Stage 6) — banking is mandatory for all segments
      goTo(6, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
      return;
    }
    if (outcome === "direct_banking") {
      // Yellow/Green + BRP NO: skip BRP, go straight to Banking Verification (Stage 6)
      goTo(6, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
      return;
    }
    // Yellow/Green + BRP YES: go to BRP Details (Stage 5)
    goTo(5, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  };

  const handleStage5 = (data: any) => {
    setFormData({ ...formData, ...data });
    goTo(6, [1, 2, 3, 4, 5, 6, 8, 9, 10, 11]);
  };

  const handleStage6 = (outcome: "want_more" | "accepted") => {
    if (outcome === "want_more") {
      goTo(7, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    } else {
      goTo(8, [1, 2, 3, 4, 5, 6, 8, 9, 10, 11]);
    }
  };

  const handleStage7 = () => goTo(8, visibleSteps.includes(7) ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] : visibleSteps);
  const handleStage8 = () => goTo(9, [...new Set([...visibleSteps, 9])]);
  const handleStage9 = (approved: boolean) => { if (approved) goTo(10, [...new Set([...visibleSteps, 10])]); };
  const handleStage10 = () => goTo(11, [...new Set([...visibleSteps, 11])]);
  const handleStage11 = () => setLocation("/dashboard");

  return (
    <div className="max-w-5xl mx-auto">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent hover:text-[#004499]">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold font-heading text-slate-900">Business Loan Application</h1>
          <div className="flex items-center gap-3">
            {/* Agent badge */}
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
              <div className="w-7 h-7 rounded-full bg-[#004499]/10 flex items-center justify-center shrink-0">
                <User className="h-4 w-4 text-[#004499]" />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Agent</p>
                <p className="text-sm font-bold text-slate-800 leading-tight">{MOCK_AGENT.name}</p>
                <p className="text-[10px] font-mono text-[#004499] leading-none">{MOCK_AGENT.code}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progress</p>
              <p className="text-sm font-bold text-[#004499]">{progressPct}% Complete</p>
            </div>
            <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-mono">
              #{appId}
            </span>
          </div>
        </div>

        {/* Progress bar + stepper */}
        <div className="relative py-6 px-2">
          <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-100 -translate-y-1/2 rounded-full" />
          <div
            className="absolute top-1/2 left-0 h-1.5 bg-emerald-500 -translate-y-1/2 transition-all duration-700 ease-in-out rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"
            style={{ width: `${progressPct}%` }}
          />
          <div className="relative flex justify-between items-center">
            {activeStages.map((s) => {
              const done = visibleSteps.indexOf(currentStep) > visibleSteps.indexOf(s.id);
              const active = currentStep === s.id;
              return (
                <div key={s.id} className="flex flex-col items-center group cursor-default">
                  <div className={cn(
                    "relative w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-500 z-10",
                    done ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100"
                      : active ? "bg-white border-[#004499] text-[#004499] ring-4 ring-blue-50 scale-110 shadow-md"
                      : "bg-white border-slate-200 text-slate-300 scale-90"
                  )}>
                    {done ? <CheckCircle2 className="h-4 w-4" strokeWidth={3} /> : s.id}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity z-20">
                      {s.title} • {done ? "Done" : active ? "Active" : "Upcoming"}
                    </div>
                  </div>
                  <span className={cn(
                    "mt-3 text-[9px] font-bold uppercase tracking-tighter transition-colors duration-300 max-w-[60px] text-center leading-tight",
                    active ? "text-[#004499]" : done ? "text-emerald-600" : "text-slate-400"
                  )}>
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 min-h-[500px]">
        {currentStep === 1 && <Stage1MobileConsent onComplete={handleStage1} />}
        {currentStep === 2 && <BasicDetailsForm mobile={formData.mobile} onComplete={handleStage2} />}
        {currentStep === 3 && <BusinessDetailsStep onComplete={handleStage3} />}
        {currentStep === 4 && <Stage4OfferSimulation onComplete={handleStage4} />}
        {currentStep === 5 && <BrpDetailsForm onComplete={handleStage5} />}
        {currentStep === 6 && <Stage6BankingVerification onComplete={handleStage6} />}
        {currentStep === 7 && <Stage7GstOffer onComplete={handleStage7} />}
        {currentStep === 8 && <Stage8AdditionalDetails onComplete={handleStage8} />}
        {currentStep === 9 && <Stage9KycStatus onComplete={handleStage9} />}
        {currentStep === 10 && <Stage10FieldInvestigation onComplete={handleStage10} />}
        {currentStep === 11 && <Stage11FinalTimeline onComplete={handleStage11} />}
      </div>
    </div>
  );
}
