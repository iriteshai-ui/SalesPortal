"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Banknote,
  Calendar,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Calculator,
  Clock,
  Building2,
  Lock,
  GraduationCap,
  Percent,
  Receipt,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { DemoProfile } from "../constants/el-mock-data";

interface Props {
  customerData: DemoProfile;
  appId: string;
  onContinue?: () => void;
  onContinueWithOffer?: (offerData?: any) => void;
  onContinueForBanking?: (offerData?: any) => void;
  onEditDetails: () => void;
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
  onContinue,
  onContinueWithOffer,
  onContinueForBanking,
  onEditDetails,
}: Props) {
  // ── Static Offer Parameters (Non-Editable as per requirements) ──
  const loanAmount = 500000; // Hardcoded ₹5,00,000
  const tenureMonths = 24; // Fixed 24 Months (2.0 Years)
  const interestRate = 10.5; // 10.50% P.A.

  // Financial Calculations
  const monthlyRate = interestRate / 12 / 100;
  const currentEmi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  ); // ₹23,191

  // Consistent Fee Breakdown (Matching Banking Offer Screen structure)
  const processingFee = Math.round(loanAmount * 0.01); // 1.0% = ₹5,000
  const gst = Math.round(processingFee * 0.18); // 18% of PF = ₹900
  const stampDuty = 50; // Hardcoded at ₹50 as required
  const docCharges = 0; // Waived
  const totalDeductions = processingFee + gst + stampDuty + docCharges; // ₹5,950
  const netDisbursement = loanAmount - totalDeductions; // ₹4,94,050

  const handleContinueWithOffer = () => {
    const offerData = {
      amount: loanAmount,
      tenure: tenureMonths,
      emi: currentEmi,
      netDisbursement,
      interestRate,
      processingFee,
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
      interestRate,
      offerType: "banking",
    };
    if (onContinueForBanking) {
      onContinueForBanking(offerData);
    } else if (onContinue) {
      onContinue();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-400">
      {/* ── Top Header ── */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-200">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Initial Offer Unlocked
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Initial Loan Offer — ₹5,00,000
        </h2>
        <p className="text-slate-500 font-medium text-sm max-w-xl mx-auto">
          Pre-approved bureau sanction based on applicant profile. Review the terms below or proceed to
          Banking Verification to unlock an enhanced <strong className="text-slate-800">₹15 Lakh Banking Offer</strong>.
        </p>
      </div>

      {/* ── 2-Column Responsive Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ── Left Column: Fixed Loan Details & Academic Alignment (Non-Editable) ── */}
        <div className="space-y-6 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200/80 flex flex-col justify-between">
          <div className="space-y-5">
            {/* Academic Alignment Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5 text-[#004499]" />
                  Applicant & Academic Details
                </span>
                <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  #{appId}
                </span>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-slate-900 text-sm">
                  {customerData.fullName || "Aarav Sharma"}
                </p>
                <p className="text-xs font-semibold text-[#004499]">
                  {customerData.courseName || "MS in Data Science & Artificial Intelligence"}
                </p>
                <p className="text-xs text-slate-500">
                  {customerData.institutionName || "Indian Institute of Science (IISc) / BITS Pilani"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-700 border-slate-200">
                  Admission: {customerData.admissionStatus || "Confirmed Admission"}
                </Badge>
                <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                  Sec 80E Tax Benefit Eligible
                </Badge>
              </div>
            </div>

            {/* Fixed Offer Parameters Grid (Zero Sliders, Fully Static) */}
            <div className="space-y-3">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Approved Loan Parameters (Fixed & Non-Editable)
              </span>

              <div className="grid grid-cols-2 gap-3">
                {/* Fixed Loan Amount */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Banknote className="h-3 w-3 text-[#004499]" /> Sanction Amount
                    </span>
                    <Badge className="bg-blue-50 text-[#004499] border-blue-200 text-[9px] px-1.5 py-0 font-bold">
                      <Lock className="h-2.5 w-2.5 mr-0.5" /> Fixed
                    </Badge>
                  </div>
                  <p className="text-xl font-black text-[#004499] font-mono">
                    {formatCurrency(loanAmount)}
                  </p>
                  <p className="text-[10px] text-slate-400">Pre-approved Bureau Cap</p>
                </div>

                {/* Fixed Repayment Tenure */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-[#004499]" /> Repayment Term
                    </span>
                    <Badge className="bg-blue-50 text-[#004499] border-blue-200 text-[9px] px-1.5 py-0 font-bold">
                      <Lock className="h-2.5 w-2.5 mr-0.5" /> Fixed
                    </Badge>
                  </div>
                  <p className="text-xl font-black text-slate-800 font-mono">
                    {tenureMonths} <span className="text-xs font-normal text-slate-500">Months</span>
                  </p>
                  <p className="text-[10px] text-slate-400">2.0 Years Standard Tenor</p>
                </div>

                {/* Fixed Interest Rate */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Percent className="h-3 w-3 text-[#004499]" /> Interest Rate
                  </span>
                  <p className="text-lg font-bold text-slate-800 font-mono">
                    {interestRate}% <span className="text-xs font-normal text-slate-500">p.a.</span>
                  </p>
                  <p className="text-[10px] text-slate-400">Fixed Reducing Rate</p>
                </div>

                {/* Moratorium Period */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Clock className="h-3 w-3 text-[#004499]" /> Moratorium
                  </span>
                  <p className="text-xs font-bold text-emerald-700 leading-tight">
                    Course Duration + 6 Months
                  </p>
                  <p className="text-[10px] text-slate-400">Principal Holiday Period</p>
                </div>
              </div>
            </div>
          </div>

          {/* Value Proposition Note for Agent */}
          <div className="mt-4 p-4 bg-blue-50/80 border border-blue-200 rounded-2xl flex items-start gap-2.5 text-xs text-blue-900">
            <Sparkles className="h-4 w-4 text-[#004499] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Agent Guidance:</strong> The applicant can accept this initial <strong>₹5,00,000</strong> offer immediately,
              or click <strong>Continue for Banking Offer</strong> to verify bank statements and qualify for up to <strong>₹15,00,000</strong>.
            </p>
          </div>
        </div>

        {/* ── Right Column: EMI Hero Card & Transparent Charges Breakdown ── */}
        <div className="space-y-6">
          {/* Estimated Monthly EMI Blue Hero Card */}
          <div className="p-7 bg-[#004499] text-white rounded-3xl shadow-xl shadow-blue-100 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <Calculator size={130} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black text-blue-200 uppercase tracking-widest">
                  Estimated Monthly EMI
                </span>
                <span className="text-[10px] font-bold text-blue-100 bg-blue-800/60 px-3 py-1 rounded-full border border-blue-700/60">
                  Fixed Rate: {interestRate}% P.A.
                </span>
              </div>

              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight">
                {formatCurrency(currentEmi)}
                <span className="text-base font-normal text-blue-200 ml-1">/month</span>
              </div>
              <p className="text-xs text-blue-100/80 mt-2">
                Amortized over {tenureMonths} monthly installments • Commences after moratorium
              </p>
            </div>
          </div>

          {/* Transparent Charges Breakdown 2x2 Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px] text-slate-400">
                <Receipt className="h-3.5 w-3.5 text-[#004499]" />
                Transparent Charges Breakdown
              </span>
              <span className="text-slate-400 font-normal text-[11px]">Static Non-Modifiable</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Processing Fee */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Processing Fee (1.0%)
                </p>
                <p className="text-base font-bold text-slate-900 font-mono">
                  {formatCurrency(processingFee)}
                </p>
                <p className="text-[10px] text-slate-400">1.0% of {formatCurrency(loanAmount)}</p>
              </div>

              {/* GST */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  GST (18% on PF)
                </p>
                <p className="text-base font-bold text-slate-900 font-mono">
                  {formatCurrency(gst)}
                </p>
                <p className="text-[10px] text-slate-400">Statutory GST on processing fee</p>
              </div>

              {/* Stamp Duty (Hardcoded at ₹50 as required) */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Stamp Duty
                  </p>
                  <Badge className="bg-slate-200 text-slate-700 text-[8px] px-1 py-0 font-mono">
                    Fixed ₹50
                  </Badge>
                </div>
                <p className="text-base font-bold text-slate-900 font-mono">
                  {formatCurrency(stampDuty)}
                </p>
                <p className="text-[10px] text-slate-400">Statutory e-Stamp charges</p>
              </div>

              {/* Documentation / Verification Charges */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Doc / Legal Fee
                  </p>
                  <Badge className="bg-emerald-100 text-emerald-800 text-[8px] px-1 py-0">
                    Waived
                  </Badge>
                </div>
                <p className="text-base font-bold text-emerald-700 font-mono">
                  ₹0
                </p>
                <p className="text-[10px] text-slate-400">Zero additional paperwork fees</p>
              </div>
            </div>

            {/* Total Deductions Summary Line */}
            <div className="flex items-center justify-between px-3.5 py-2 bg-slate-100/80 rounded-xl text-xs text-slate-600 border border-slate-200">
              <span className="font-semibold">Total Applicable Deductions</span>
              <span className="font-mono font-bold text-slate-900">
                {formatCurrency(totalDeductions)}
              </span>
            </div>
          </div>

          {/* Prominent Net Disbursement Banner */}
          <div className="bg-emerald-50 rounded-2xl p-5 sm:p-6 border-2 border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" /> Net Disbursal Amount
              </span>
              <p className="text-xs text-emerald-700 font-medium">
                Direct transfer to institution / student bank account
              </p>
              <p className="text-[10px] text-emerald-600 font-mono">
                Formula: {formatCurrency(loanAmount)} − {formatCurrency(totalDeductions)}
              </p>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-900 font-mono text-left sm:text-right">
              {formatCurrency(netDisbursement)}
            </div>
          </div>
        </div>
      </div>

      {/* ── 2 Action CTAs + Back Link ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
        <Button
          type="button"
          variant="outline"
          onClick={onEditDetails}
          className="h-14 px-6 rounded-2xl border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wider gap-2 hover:bg-slate-100 w-full sm:w-auto"
        >
          <ArrowLeft className="h-4 w-4" /> Edit Details
        </Button>

        <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full sm:w-auto justify-end">
          {/* CTA 1: Continue with this offer */}
          <Button
            type="button"
            onClick={handleContinueWithOffer}
            className="h-14 sm:h-16 flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-wider text-xs sm:text-sm rounded-2xl shadow-xl shadow-emerald-100 flex items-center justify-center gap-2 group transition-all cursor-pointer"
          >
            <CheckCircle2 className="h-5 w-5" />
            Continue with ₹5 Lakh Offer
            <ArrowRight className="h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
          </Button>

          {/* CTA 2: Continue for Banking Offer */}
          <Button
            type="button"
            onClick={handleContinueForBanking}
            className="h-14 sm:h-16 flex-1 bg-[#004499] hover:bg-[#003377] text-white font-black uppercase tracking-wider text-xs sm:text-sm rounded-2xl shadow-xl shadow-blue-100 flex items-center justify-center gap-2 group transition-all cursor-pointer"
          >
            <TrendingUp className="h-5 w-5" />
            Continue for Banking Offer (₹15 Lakh)
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
