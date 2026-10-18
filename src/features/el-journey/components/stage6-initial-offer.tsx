"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Banknote,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Calculator,
  Percent,
  Receipt,
  ShieldCheck,
  TrendingUp,
  User,
  Coins,
} from "lucide-react";
import { DemoProfile } from "../constants/el-mock-data";

interface Props {
  customerData: DemoProfile;
  appId: string;
  stageNumber?: number;
  onContinue?: () => void;
  onContinueWithOffer?: (offerData?: any) => void;
  onContinueForBanking?: (offerData?: any) => void;
  onEditDetails?: () => void;
  onBackToSimulation?: () => void;
}

const formatCurrency = (num: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
};

export default function Stage6InitialOffer({
  customerData,
  appId,
  stageNumber = 3,
  onContinue,
  onContinueWithOffer,
  onContinueForBanking,
}: Props) {
  // ── Static Offer Parameters (Non-Editable as per requirements) ──
  const loanAmount = 500000; // ₹5,00,000
  const tenureMonths = 24; // 24 Months (2.0 Years)
  const interestRate = 10.5; // 10.50% P.A.

  // Financial Calculations
  const monthlyRate = interestRate / 12 / 100;
  const currentEmi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  ); // ~₹23,188

  // Fee Breakdown (Each fee exists strictly ONCE)
  const processingFee = Math.round(loanAmount * 0.01); // 1.0% = ₹5,000
  const gst = Math.round(processingFee * 0.18); // 18% on PF = ₹900
  const stampDuty = 50; // Statutory ₹50
  const docCharges = 0; // Waived
  const totalDeductions = processingFee + gst + stampDuty + docCharges; // ₹5,950
  const netDisbursement = loanAmount - totalDeductions; // ₹4,94,050
  const totalAmount = loanAmount + gst + stampDuty + processingFee; // ₹5,05,950

  const handleContinueWithOffer = () => {
    const offerData = {
      amount: loanAmount,
      tenure: tenureMonths,
      emi: currentEmi,
      netDisbursement,
      totalAmount,
      interestRate,
      processingFee,
      gst,
      stampDuty,
      totalDeductions,
      offerType: "initial",
    };
    if (onContinueWithOffer) {
      onContinueWithOffer(offerData);
    } else if (onContinue) {
      onContinue();
    }
  };

  const handleContinueForBanking = () => {
    const offerData = {
      amount: loanAmount,
      tenure: tenureMonths,
      emi: currentEmi,
      netDisbursement,
      totalAmount,
      interestRate,
      processingFee,
      gst,
      stampDuty,
      totalDeductions,
      offerType: "banking",
    };
    if (onContinueForBanking) {
      onContinueForBanking(offerData);
    } else if (onContinue) {
      onContinue();
    }
  };

  return (
    <div className="bg-[#F4F6F9] -m-4 sm:-m-6 p-4 sm:p-6 rounded-2xl space-y-5 animate-in fade-in duration-300">
      {/* ── TOP HEADER ── */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs font-black uppercase tracking-wider text-[#004499]">
              Stage {stageNumber || 3} • Bureau Assessment & Pre-Approval
            </span>
            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
              <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
              Bureau-Based Offer Unlocked
            </Badge>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Bureau-Based Loan Offer — ₹5,00,000
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
            Pre-approved bureau sanction based on applicant profile. Review terms or proceed to Banking Verification to qualify for up to ₹15 Lakh.
          </p>
        </div>

        <Badge
          variant="outline"
          className="self-start md:self-center border-emerald-400 bg-emerald-50/70 text-emerald-800 text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-full shadow-2xs shrink-0 flex items-center gap-1.5"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Pre-Approved Sanction
        </Badge>
      </div>

      {/* ── 2-COLUMN MAIN CONTENT (ZERO DUPLICATION) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* ── LEFT COLUMN: APPLICANT PROFILE, PARAMETERS & NET DISBURSAL ── */}
        <div className="space-y-4">
          {/* CARD 1: Applicant Profile Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Applicant Profile
                </span>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold px-2 py-0 rounded-full">
                  Verified
                </Badge>
              </div>
              <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                #{appId || "EL-10002"}
              </span>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center shrink-0 text-[#004499]">
                <User className="h-5 w-5" />
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-[#004499] truncate">
                    {customerData.fullName || "Aarav Sharma"}
                  </h3>
                  <Badge className="bg-emerald-100/80 text-emerald-800 text-[10px] font-bold px-2 py-0 border-0">
                    Student Platinum
                  </Badge>
                </div>
                <p className="text-xs font-semibold text-blue-700 leading-tight">
                  {customerData.courseName || "MS in Data Science & Artificial Intelligence"}
                </p>
                <p className="text-xs text-slate-500 leading-tight">
                  {customerData.institutionName || "Indian Institute of Science (IISc) / BITS Pilani"}
                </p>
              </div>
            </div>

            <div className="pt-1 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
              <Badge
                variant="outline"
                className="text-[11px] font-semibold bg-blue-50/70 text-[#004499] border-blue-200 px-2.5 py-0.5 rounded-lg"
              >
                Admission: {customerData.admissionStatus || "Confirmed Admission"}
              </Badge>
              <span className="text-[11px] text-slate-400 font-medium">
                Target Intake: Fall 2026
              </span>
            </div>
          </div>

          {/* CARD 2: Loan Summary & Parameter Highlights (Tenure shown ONCE only) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Loan Summary & Parameter Highlights
              </h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Approved Baseline
              </span>
            </div>

            {/* Sanction & Tenure Row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Sanction Box */}
              <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Banknote className="h-3.5 w-3.5 text-[#004499]" /> Sanction Amount
                </span>
                <p className="text-2xl font-black text-[#004499] font-mono tracking-tight">
                  {formatCurrency(loanAmount)}
                </p>
                <p className="text-[10px] text-slate-400 font-medium">Pre-approved Bureau Cap</p>
              </div>

              {/* Tenure Box (Single unique display of tenure) */}
              <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-600" /> Repayment Term
                </span>
                <p className="text-2xl font-black text-slate-800 font-mono tracking-tight">
                  {tenureMonths} <span className="text-xs font-semibold text-slate-500">Months</span>
                </p>
                <p className="text-[10px] text-slate-400 font-medium">2.0 Years Standard Tenor</p>
              </div>
            </div>

            {/* Interest Rate with Tag */}
            <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Percent className="h-3.5 w-3.5 text-[#004499]" /> Interest Rate
                </span>
                <p className="text-xl font-black text-slate-900 font-mono">
                  {interestRate}% <span className="text-xs font-normal text-slate-500">p.a.</span>
                </p>
                <p className="text-[10px] text-slate-400">Monthly reducing balance calculation</p>
              </div>
              <Badge className="bg-slate-200/80 text-slate-700 hover:bg-slate-200/80 border-slate-300 text-[10px] font-bold px-2.5 py-1 rounded-md">
                Reducing Rate
              </Badge>
            </div>
          </div>

          {/* CARD 3: Net Disbursal Amount (Vibrant Mint Green Container) */}
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50/50 to-emerald-100/60 rounded-2xl p-4 sm:p-5 border-2 border-emerald-300/80 shadow-xs space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" /> Net Disbursal Amount
                </span>
                <p className="text-xs text-emerald-700 font-medium">
                  Direct transfer to institution / student bank account
                </p>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-900 font-mono shrink-0">
                {formatCurrency(netDisbursement)}
              </div>
            </div>
            <div className="pt-2 border-t border-emerald-200/80">
              <p className="text-[11px] text-emerald-700 font-mono font-medium leading-relaxed">
                Formula: {formatCurrency(loanAmount)} (Sanction) − {formatCurrency(totalDeductions)} (Deductions)
              </p>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: EMI HERO CARD & SINGLE UNIFIED CHARGES BREAKDOWN ── */}
        <div className="space-y-4">
          {/* CARD 1: Estimated Monthly EMI Hero Card */}
          <div className="p-5 sm:p-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50/60 rounded-2xl border-2 border-emerald-200/90 shadow-sm relative overflow-hidden">
            <div className="flex items-start justify-between gap-3 relative z-10">
              <div className="space-y-1">
                <span className="text-xs font-black text-emerald-800 uppercase tracking-widest">
                  Estimated Monthly EMI
                </span>
                <div className="text-3xl sm:text-4xl font-black text-emerald-800 font-mono tracking-tight mt-1">
                  {formatCurrency(currentEmi)}
                  <span className="text-sm font-semibold text-emerald-600 ml-1">/month</span>
                </div>
                <p className="text-xs text-emerald-700 font-medium pt-1">
                  Amortized over {tenureMonths} monthly installments
                </p>
              </div>

              <div className="flex flex-col items-end gap-3 shrink-0">
                <Badge className="bg-[#004499] text-white hover:bg-[#004499] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                  Rate: {interestRate}% P.A.
                </Badge>
                <div className="w-12 h-12 rounded-2xl bg-white/90 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
                  <Calculator className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: Transparent Charges & Deductions (SINGLE AUTHORITATIVE CARD - ZERO DUPLICATION) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Receipt className="h-3.5 w-3.5 text-[#004499]" />
                Transparent Charges & Deductions Breakdown
              </h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Static Breakdown
              </span>
            </div>

            {/* Unique Itemized Charges List */}
            <div className="space-y-2.5">
              {/* Item 1: Processing Fee */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50/80 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0">
                    1
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Processing Fee (1.0%)</p>
                    <p className="text-[10px] text-slate-400">1.0% of {formatCurrency(loanAmount)}</p>
                  </div>
                </div>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {formatCurrency(processingFee)}
                </span>
              </div>

              {/* Item 2: GST on Processing Fee */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50/80 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-[#004499] font-bold text-[10px] flex items-center justify-center shrink-0">
                    2
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-800">GST (18% on PF)</p>
                    <p className="text-[10px] text-slate-400">Statutory GST on processing fee</p>
                  </div>
                </div>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {formatCurrency(gst)}
                </span>
              </div>

              {/* Item 3: Stamp Duty */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50/80 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                    3
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-800">STAMP DUTY</p>
                    <p className="text-[10px] text-slate-400">Statutory e-Stamp charge</p>
                  </div>
                </div>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {formatCurrency(stampDuty)}
                </span>
              </div>

              {/* Item 4: Doc / Legal Fee */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50/80 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                    4
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-800">DOC / LEGAL FEE</p>
                    <p className="text-[10px] text-slate-400">Zero additional paperwork charges</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-100 text-emerald-800 text-[9px] px-2 py-0 font-bold">
                    Waived
                  </Badge>
                  <span className="font-mono font-bold text-emerald-700 text-sm">₹0</span>
                </div>
              </div>
            </div>

            {/* Total Deductions Highlight Bar */}
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-100 rounded-xl border border-slate-200">
              <span className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                Total Applicable Deductions
              </span>
              <span className="font-mono font-black text-slate-900 text-base">
                {formatCurrency(totalDeductions)}
              </span>
            </div>

            {/* Total Loan Amount Including Charges Highlight Card */}
            <div className="p-3.5 bg-blue-50 rounded-xl border-2 border-blue-200/90 space-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black text-[#004499] uppercase tracking-wider block">
                    Total Loan Amount Including Charges
                  </span>
                  <p className="text-[11px] text-blue-900 font-medium">
                    Principal + Processing Fee + Statutory GST + Stamp Duty
                  </p>
                </div>
                <span className="text-xl font-black text-[#004499] font-mono">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
              <p className="text-[10px] text-blue-700 font-mono pt-1 border-t border-blue-200/70">
                Formula: {formatCurrency(loanAmount)} + {formatCurrency(processingFee)} (PF) + {formatCurrency(gst)} (GST) + {formatCurrency(stampDuty)} (Stamp Duty)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM ACTION FOOTER (FULL WIDTH, ONLY THE 2 CTAs) ── */}
      <div className="pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* CTA 1: Continue with Bureau-Based offer */}
          <Button
            type="button"
            onClick={handleContinueWithOffer}
            className="h-14 sm:h-16 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-wider text-xs sm:text-sm rounded-2xl shadow-xl shadow-emerald-200/50 flex items-center justify-center gap-2 group transition-all cursor-pointer"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>CONTINUE WITH BUREAU-BASED ₹5 LAKH OFFER</span>
            <ArrowRight className="h-4 w-4 opacity-80 group-hover:translate-x-1 transition-transform shrink-0" />
          </Button>

          {/* CTA 2: Continue for Banking Offer */}
          <Button
            type="button"
            onClick={handleContinueForBanking}
            className="h-14 sm:h-16 w-full bg-[#004499] hover:bg-[#003377] text-white font-black uppercase tracking-wider text-xs sm:text-sm rounded-2xl shadow-xl shadow-blue-200/50 flex items-center justify-center gap-2 group transition-all cursor-pointer"
          >
            <TrendingUp className="h-4 w-4 shrink-0" />
            <span>CONTINUE FOR BANKING OFFER (₹15 LAKH)</span>
            <ArrowRight className="h-4 w-4 opacity-80 group-hover:translate-x-1 transition-transform shrink-0" />
          </Button>
        </div>
      </div>
    </div>
  );
}
