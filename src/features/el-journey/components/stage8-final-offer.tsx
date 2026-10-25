"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Banknote,
  Percent,
  Calendar,
  FileCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Layers,
  Calculator,
  AlertCircle,
  Loader2,
  RotateCcw,
  Zap,
  Building2,
  Lock,
  GraduationCap,
  Clock,
  Receipt,
  TrendingUp,
} from "lucide-react";
import confetti from "canvas-confetti";
import { DemoProfile } from "../constants/el-mock-data";

interface Props {
  customerData: DemoProfile;
  appId: string;
  stageNumber?: number;
  employmentRequired?: boolean;
  onContinue: () => void;
  onBackToSimulation?: () => void;
  onUpdateInsightBackend?: (activity: string, secondsLeft: number) => void;
  isSimulatingLoader: boolean;
  setIsSimulatingLoader: (val: boolean) => void;
  fastForwardTrigger?: number;
}

const formatCurrency = (num: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
};

export default function Stage8FinalOffer({
  customerData,
  appId,
  stageNumber = 6,
  employmentRequired = true,
  onContinue,
  onBackToSimulation,
  onUpdateInsightBackend,
  isSimulatingLoader,
  setIsSimulatingLoader,
  fastForwardTrigger,
}: Props) {
  const [countdown, setCountdown] = useState<number>(2); // Brief 2s simulation for instant agent friendliness
  const [hasShownConfetti, setHasShownConfetti] = useState<boolean>(false);

  // ── Static Banking Offer Parameters (Non-Editable as per requirements) ──
  const loanAmount = 1500000; // Hardcoded ₹15,00,000 (₹15 Lakh)
  const tenureMonths = 60; // 60 Months (5.0 Years)
  const interestRate = 9.25; // 9.25% P.A. (Preferential rate unlocked via banking records)

  // Financial Calculations
  const monthlyRate = interestRate / 12 / 100;
  const currentEmi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  ); // ₹31,326

  // Transparent Fee Breakdown
  const processingFeeIncGst = Math.round(loanAmount * 0.01 * 1.18); // 1.0% + 18% GST = ₹17,700
  const stampDuty = 50; // Hardcoded at ₹50 as required
  const totalCharges = processingFeeIncGst + stampDuty; // ₹17,750
  // Net Disbursement Amount must always equal Applied Loan Amount without deductions
  const netDisbursement = loanAmount; // ₹15,00,000
  const totalAmount = loanAmount + totalCharges; // ₹15,17,750

  // Auto-start loader on mount if requested
  useEffect(() => {
    setIsSimulatingLoader(true);
    setCountdown(2);
  }, []);

  useEffect(() => {
    if (!isSimulatingLoader) return;

    if (countdown <= 0) {
      setIsSimulatingLoader(false);
      if (!hasShownConfetti) {
        setHasShownConfetti(true);
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.4 },
          colors: ["#004499", "#10b981", "#fbbf24"],
        });
      }
      return;
    }

    const t = setTimeout(() => {
      setCountdown((p) => p - 1);
    }, 1000);

    return () => clearTimeout(t);
  }, [isSimulatingLoader, countdown]);

  // Fast forward trigger
  useEffect(() => {
    if (isSimulatingLoader && fastForwardTrigger) {
      setCountdown(0);
    }
  }, [isSimulatingLoader, fastForwardTrigger]);

  if (isSimulatingLoader) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6 animate-in fade-in duration-500">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-[#004499]/10 flex items-center justify-center">
            <Loader2 className="h-10 w-10 text-[#004499] animate-spin" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-black text-sm border-2 border-white shadow-xs">
            {countdown}
          </div>
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-xl font-bold text-slate-900">Structuring Final Offer…</h3>
          <p className="text-xs text-slate-500 max-w-md">
            Analyzing verified Account Aggregator transaction flows, salary stability, and credit FOIR metrics…
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setCountdown(0)}
          className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200"
        >
          <Zap className="h-3.5 w-3.5 text-emerald-600 fill-emerald-600 mr-1" /> View Final Offer Instantly
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── Top Header Banner (Unified, Clean & Compact) ── */}
      <div className="border-l-4 border-emerald-600 pl-4 py-2.5 bg-gradient-to-r from-emerald-50/70 via-emerald-50/40 to-transparent rounded-r-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Stage {stageNumber} • Formal Sanction Approved
            </span>
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] font-bold px-2 py-0.5">
              <Award className="h-3 w-3 mr-1 text-emerald-700 inline" /> Sanction Approved
            </Badge>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            Final Offer — ₹15,00,000
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Enhanced sanction terms underwritten against verified Account Aggregator banking records and cash flows for{" "}
            <strong className="text-slate-800">{customerData.fullName || "Aarav Sharma"}</strong>.
          </p>
        </div>
        <Badge className="bg-emerald-100 text-emerald-900 border-emerald-200 text-xs font-bold px-3 py-1.5 self-start sm:self-auto shrink-0 shadow-2xs">
          <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-emerald-600 inline" /> Credit Committee Approved
        </Badge>
      </div>

      {/* ── 2-Column Balanced Responsive Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* ── Left Column: Applicant Details, Parameters, Verification & Total Loan Amount ── */}
        <div className="space-y-4">
          {/* Academic Alignment Card */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-[#004499]" />
                Applicant & Academic Details
              </span>
              <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                #{appId}
              </span>
            </div>

            <div className="space-y-0.5">
              <p className="font-bold text-slate-900 text-sm">
                {customerData.fullName || "Aarav Sharma"}
              </p>
              <p className="text-xs font-semibold text-[#004499]">
                {customerData.courseName || "MS in Data Science & Artificial Intelligence"}
              </p>
              <p className="text-xs text-slate-500">
                {customerData.employerName ? `${customerData.employerName} • ` : ""}{customerData.highestEducation || "Graduate / Bachelor's Degree"}
              </p>
            </div>
          </div>

          {/* Sanctioned Offer Parameters Grid */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Sanctioned Loan Parameters (Non-Editable)
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Sanction Amount */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Banknote className="h-3 w-3 text-emerald-600" /> Sanction Amount
                  </span>
                </div>
                <p className="text-xl font-black text-emerald-700 font-mono">
                  {formatCurrency(loanAmount)}
                </p>
                <p className="text-[10px] text-slate-400">Final Sanction Cap</p>
              </div>

              {/* Repayment Tenure */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-[#004499]" /> Repayment Term
                  </span>
                </div>
                <p className="text-xl font-black text-slate-800 font-mono">
                  {tenureMonths} <span className="text-xs font-normal text-slate-500">Months</span>
                </p>
                <p className="text-[10px] text-slate-400">5.0 Years Extended Tenor</p>
              </div>

              {/* Interest Rate */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 col-span-2 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Percent className="h-3 w-3 text-emerald-600" /> Prime Rate
                  </span>
                  <p className="text-xl font-black text-emerald-700 font-mono mt-0.5">
                    {interestRate}% <span className="text-xs font-normal text-slate-500">p.a.</span>
                  </p>
                </div>
                <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[10px] font-medium">
                  Discounted Prime Rate
                </Badge>
              </div>
            </div>
          </div>

          {/* Banking Verification Credentials Card */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Underwriting Verification Highlights
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-0.5">
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[9px] uppercase font-bold">Banking Assessment</span>
                <span className="font-bold text-emerald-700">Verified Prime Tier</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[9px] uppercase font-bold">Avg. Salary Credit</span>
                <span className="font-bold text-slate-800">₹85,000 / month</span>
              </div>
            </div>
          </div>

          {/* Prominent Total Loan Amount Including Charges Banner */}
          <div className="bg-blue-50/90 rounded-2xl p-4 sm:p-5 border-2 border-blue-200 space-y-2 shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black text-[#004499] uppercase tracking-widest flex items-center gap-1.5">
                  <Banknote className="h-3.5 w-3.5 text-[#004499]" /> Total Loan Amount Including Charges
                </span>
                <p className="text-xs text-blue-900 font-medium">
                  Total aggregate payable including statutory charges & processing fee
                </p>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#004499] font-mono shrink-0">
                {formatCurrency(totalAmount)}
              </div>
            </div>
            <div className="pt-2 border-t border-blue-200/80">
              <p className="text-[10px] text-blue-700 font-mono leading-relaxed">
                Total Amount = {formatCurrency(loanAmount)} (Loan) + {formatCurrency(processingFeeIncGst)} (PF inc. GST) + {formatCurrency(stampDuty)} (Stamp Duty)
              </p>
            </div>
          </div>
        </div>

        {/* ── Right Column: EMI Hero Card, Charges Breakdown, Net Disbursal & Assurance Note ── */}
        <div className="space-y-4">
          {/* Estimated Monthly EMI Blue Hero Card */}
          <div className="p-5 sm:p-6 bg-[#004499] text-white rounded-2xl shadow-xl shadow-blue-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
              <Calculator size={110} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-black text-blue-200 uppercase tracking-widest">
                  Estimated Monthly EMI
                </span>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-400/40">
                  Prime Rate: {interestRate}% P.A.
                </span>
              </div>

              <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight">
                {formatCurrency(currentEmi)}
                <span className="text-sm font-normal text-blue-200 ml-1">/month</span>
              </div>
              <p className="text-xs text-blue-100/80 mt-1">
                Amortized over {tenureMonths} monthly installments
              </p>
            </div>
          </div>

          {/* Transparent Charges Breakdown 2-Column Grid */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px] text-slate-400">
                <Receipt className="h-3.5 w-3.5 text-[#004499]" />
                Transparent Charges Breakdown
              </span>
              <span className="text-slate-400 font-normal text-[10px]">Static Non-Modifiable</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Processing Fees (inc. GST) */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-0.5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Processing Fees (inc. GST)
                </p>
                <p className="text-sm font-bold text-slate-900 font-mono">
                  {formatCurrency(processingFeeIncGst)}
                </p>
                <p className="text-[9px] text-slate-400">1.0% + 18% GST included</p>
              </div>

              {/* Stamp Duty */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-0.5">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Stamp Duty
                  </p>
                  <Badge className="bg-slate-200 text-slate-700 text-[8px] px-1 py-0 font-mono">
                    Statutory ₹50
                  </Badge>
                </div>
                <p className="text-sm font-bold text-slate-900 font-mono">
                  {formatCurrency(stampDuty)}
                </p>
                <p className="text-[9px] text-slate-400">Statutory e-Stamp charges</p>
              </div>
            </div>

            {/* Total Charges Summary Line */}
            <div className="flex items-center justify-between px-3 py-2 bg-slate-100/80 rounded-xl text-xs text-slate-600 border border-slate-200">
              <span className="font-semibold text-[11px]">Total Applicable Charges</span>
              <span className="font-mono font-bold text-slate-900">
                {formatCurrency(totalCharges)}
              </span>
            </div>
          </div>

          {/* Prominent Net Disbursement Banner */}
          <div className="bg-emerald-50 rounded-2xl p-4 sm:p-5 border-2 border-emerald-200 space-y-2 shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Net Disbursal Amount
                </span>
                <p className="text-xs text-emerald-700 font-medium">
                  Direct transfer to customer / beneficiary bank account
                </p>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-900 font-mono shrink-0">
                {formatCurrency(netDisbursement)}
              </div>
            </div>
            <div className="pt-2 border-t border-emerald-200/80">
              <p className="text-[10px] text-emerald-700 font-mono font-medium leading-relaxed">
                Full Applied Loan Amount: {formatCurrency(loanAmount)} (No deductions from disbursal)
              </p>
            </div>
          </div>

          {/* Underwriting Assurance Note */}
          <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-900">
            <Sparkles className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Sanction Confirmed:</strong> Credit committee formal sanction of <strong>₹15,00,000</strong> unlocked via verified banking records. Terms are locked and non-modifiable.
            </p>
          </div>
        </div>
      </div>

      {/* ── Action CTA ── */}
      <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-500">
          Formal Sanction Ref: <span className="font-mono font-bold text-slate-700">SANCT-{appId}-RT2</span>
        </div>

        <Button
          type="button"
          onClick={onContinue}
          className="h-12 sm:h-14 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-wider text-xs sm:text-sm rounded-2xl shadow-xl shadow-emerald-200/50 flex items-center justify-center gap-2.5 group transition-all cursor-pointer w-full sm:w-auto"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Select Offer & Send DIY Journey Link</span>
          <ArrowRight className="h-4 w-4 opacity-80 group-hover:translate-x-1 transition-transform shrink-0" />
        </Button>
      </div>
    </div>
  );
}
