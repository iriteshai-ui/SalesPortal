"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Loader2,
  ArrowRight,
  RotateCcw,
  User,
  GraduationCap,
  Building,
  CreditCard,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { cn } from "@/utils";
import { DemoProfile } from "../constants/el-mock-data";

interface VerificationCheck {
  id: string;
  title: string;
  description: string;
  status: "Completed" | "In Progress" | "Pending" | "Failed";
  scoreOrDetail?: string;
}

interface Props {
  appId: string;
  customerData: DemoProfile;
  onComplete: () => void;
  onUpdateInsightBackend?: (activity: string, secondsLeft: number) => void;
  isSimulatingLoader: boolean;
  setIsSimulatingLoader: (val: boolean) => void;
  fastForwardTrigger?: number;
}

export default function Stage5EligibilityVerification({
  appId,
  customerData,
  onComplete,
  onUpdateInsightBackend,
  isSimulatingLoader,
  setIsSimulatingLoader,
  fastForwardTrigger,
}: Props) {
  const [countdown, setCountdown] = useState<number>(10);
  const [outcomeState, setOutcomeState] = useState<"in_progress" | "success" | "pending" | "ineligible">("in_progress");

  const [checks, setChecks] = useState<VerificationCheck[]>([
    {
      id: "customer_info",
      title: "Customer Information Verification",
      description: "Match PAN, Name, DOB, and biometric records against UIDAI / CKYC database.",
      status: "In Progress",
      scoreOrDetail: "100% Match Confidence",
    },
    {
      id: "product_mapping",
      title: "Product Eligibility Mapping",
      description: "Evaluate course accreditation, domestic study norms, and ticket-size thresholds.",
      status: "Pending",
      scoreOrDetail: "Category-A Tier 1 Course",
    },
    {
      id: "income_verification",
      title: "Income & Financial Assessment",
      description: "Analyze parent/sponsor cash flow, income tax returns, and declared earnings.",
      status: "Pending",
      scoreOrDetail: "Assessed FOIR: 42%",
    },
    {
      id: "employment_verification",
      title: "Employment & Business Stability Check",
      description: "Verify corporate employer / business registry details and EPFO records.",
      status: "Pending",
      scoreOrDetail: `${customerData.employmentType} Profile Validated`,
    },
    {
      id: "policy_checks",
      title: "Configured Policy & Risk Rules",
      description: "Run risk underwriting rules, de-dupe registry, and negative geographical listings.",
      status: "Pending",
      scoreOrDetail: "Zero Adverse Bureau Delinquencies",
    },
  ]);

  // Loading sequence steps
  const loadingActivities = [
    { sec: 10, checkIdx: 0, text: "Verifying customer information across Aadhaar & PAN..." },
    { sec: 8, checkIdx: 1, text: "Mapping course & university to sanctioned tier catalog..." },
    { sec: 6, checkIdx: 2, text: "Computing applicant & co-earner income eligibility..." },
    { sec: 4, checkIdx: 3, text: "Cross-checking EPFO / MCA records for employer stability..." },
    { sec: 2, checkIdx: 4, text: "Running BRE risk matrix & generating indicative offer parameters..." },
  ];

  // Auto-start 10s evaluation loader on first mount
  useEffect(() => {
    setIsSimulatingLoader(true);
    setCountdown(10);
  }, []);

  // 10s countdown logic
  useEffect(() => {
    if (!isSimulatingLoader) return;

    const currentStep = loadingActivities.find((a) => a.sec === countdown);
    if (currentStep) {
      // Mark preceding checks as completed
      setChecks((prev) =>
        prev.map((c, idx) => {
          if (idx < currentStep.checkIdx) return { ...c, status: "Completed" };
          if (idx === currentStep.checkIdx) return { ...c, status: "In Progress" };
          return { ...c, status: "Pending" };
        })
      );
    }

    if (onUpdateInsightBackend) {
      onUpdateInsightBackend(
        currentStep?.text || "Evaluating eligibility criteria against Pulse EL Policy Engine...",
        countdown
      );
    }

    if (countdown <= 0) {
      setIsSimulatingLoader(false);
      // Mark all checks completed
      setChecks((prev) => prev.map((c) => ({ ...c, status: "Completed" })));
      setOutcomeState("success");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isSimulatingLoader, countdown]);

  // Fast forward trigger
  useEffect(() => {
    if (isSimulatingLoader && fastForwardTrigger) {
      setCountdown(0);
    }
  }, [fastForwardTrigger]);

  // UAT Simulate Outcome Switcher
  const handleSimulateOutcome = (outcome: "success" | "pending" | "ineligible") => {
    setOutcomeState(outcome);
    if (outcome === "success") {
      setChecks((prev) => prev.map((c) => ({ ...c, status: "Completed" })));
    } else if (outcome === "pending") {
      setChecks((prev) =>
        prev.map((c, i) => (i === 2 ? { ...c, status: "In Progress" } : i > 2 ? { ...c, status: "Pending" } : { ...c, status: "Completed" }))
      );
    } else {
      setChecks((prev) =>
        prev.map((c, i) => (i === 4 ? { ...c, status: "Failed", scoreOrDetail: "High debt-to-income ratio exceeds 65%" } : { ...c, status: "Completed" }))
      );
    }
  };

  const getStatusBadge = (status: VerificationCheck["status"]) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 font-bold">Completed</Badge>;
      case "In Progress":
        return <Badge className="bg-blue-100 text-[#004499] border-blue-300 font-bold animate-pulse">In Progress</Badge>;
      case "Pending":
        return <Badge className="bg-slate-100 text-slate-500 border-slate-200">Pending</Badge>;
      case "Failed":
        return <Badge className="bg-red-100 text-red-800 border-red-300 font-bold">Failed</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── Customer Summary Snapshot Header (BL Style) ── */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#004499] flex items-center justify-center text-white font-bold shadow-md">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">{customerData.fullName}</h3>
                <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                  #{appId}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {customerData.courseName} • {customerData.institutionName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-200">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Requested Amount</p>
              <p className="text-sm font-bold text-slate-900 font-mono">
                ₹ {customerData.loanAmount.toLocaleString("en-IN")}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Tenure</p>
              <p className="text-sm font-bold text-slate-900">{customerData.loanTenure} Months</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Employment</p>
              <p className="text-sm font-bold text-[#004499]">{customerData.employmentType}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Active Verification In-Card Banner (BL Style) ── */}
      {isSimulatingLoader && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#004499]/10 flex items-center justify-center shrink-0">
              <Loader2 className="h-5 w-5 text-[#004499] animate-spin" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#004499]">
                  Underwriting & Policy Check in Progress
                </span>
                <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded border border-blue-200 text-[#004499]">
                  {countdown}s remaining
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Automated underwriting evaluation in progress…
              </p>
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setCountdown(0)}
            className="text-xs font-bold text-amber-700 bg-white hover:bg-amber-50 border-amber-200 shrink-0 self-end sm:self-auto"
          >
            <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500 mr-1" /> Fast-Forward (1s)
          </Button>
        </div>
      )}

      {/* ── Verification Activities Checklist ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Automated Underwriting & Eligibility Checks
          </h4>
          <span className="text-xs text-slate-400 font-medium">5 Mandatory Rules</span>
        </div>

        {checks.map((check, idx) => (
          <Card
            key={check.id}
            className={cn(
              "border-2 transition-all duration-300",
              check.status === "Completed"
                ? "border-emerald-200 bg-emerald-50/20"
                : check.status === "In Progress"
                ? "border-blue-300 bg-blue-50/20"
                : check.status === "Failed"
                ? "border-rose-300 bg-rose-50/30"
                : "border-slate-200 bg-white"
            )}
          >
            <CardContent className="p-4 sm:p-5 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3.5 flex-1">
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center shrink-0 border mt-0.5",
                    check.status === "Completed"
                      ? "bg-emerald-500 border-emerald-500 text-white shadow-sm"
                      : check.status === "In Progress"
                      ? "bg-blue-100 border-blue-300 text-[#004499]"
                      : check.status === "Failed"
                      ? "bg-rose-500 border-rose-500 text-white"
                      : "bg-slate-100 border-slate-200 text-slate-400"
                  )}
                >
                  {check.status === "Completed" ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : check.status === "In Progress" ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : check.status === "Failed" ? (
                    <XCircle className="h-5 w-5" />
                  ) : (
                    <Clock className="h-4 w-4" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-sm">{check.title}</span>
                    {check.scoreOrDetail && (
                      <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {check.scoreOrDetail}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{check.description}</p>
                </div>
              </div>

              <div className="shrink-0">{getStatusBadge(check.status)}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── UAT Prototype Scenario Switcher ── */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Zap className="h-4 w-4 text-amber-500 fill-amber-500" /> Prototype Outcome Controls:
        </span>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleSimulateOutcome("success")}
            className="h-8 text-xs font-bold text-emerald-700 border-emerald-300 hover:bg-emerald-50"
          >
            Simulate Eligible (Success)
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleSimulateOutcome("pending")}
            className="h-8 text-xs font-bold text-amber-700 border-amber-300 hover:bg-amber-50"
          >
            Simulate Pending Check
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleSimulateOutcome("ineligible")}
            className="h-8 text-xs font-bold text-rose-700 border-rose-300 hover:bg-rose-50"
          >
            Simulate Ineligible
          </Button>
        </div>
      </div>

      {/* Outcome message banners */}
      {outcomeState === "pending" && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-900">
          <Clock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Income Verification Pending with Underwriter</p>
            <p>
              Manual income calculation is in progress. The agent may retry verification now or save the lead
              to continue later from the Dashboard.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleSimulateOutcome("success")}
              className="mt-2 h-7 text-xs font-bold text-amber-800 border-amber-300"
            >
              Retry Verification
            </Button>
          </div>
        </div>
      )}

      {outcomeState === "ineligible" && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3 text-xs text-rose-900">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Policy Check Failed — Ineligible for Domestic Education Loan</p>
            <p>
              The calculated debt-to-income ratio (FOIR) exceeds maximum policy parameters. As per credit risk
              rules, loan progression is restricted.
            </p>
          </div>
        </div>
      )}

      {/* ── Progression CTA ── */}
      <div className="flex justify-end pt-2">
        {outcomeState === "success" && (
          <Button
            onClick={onComplete}
            disabled={isSimulatingLoader}
            className="bg-[#004499] hover:bg-[#003377] text-white px-8 h-12 rounded-xl font-bold uppercase tracking-wider text-xs shadow-lg shadow-blue-100 gap-2"
          >
            View RT1 Initial Offer <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
