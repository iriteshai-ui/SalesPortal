"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  CheckCircle2,
  FileCheck,
  Building2,
  ShieldCheck,
  Zap,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  ShieldAlert,
  Percent,
  Calendar,
  Banknote,
  Sliders,
  Check,
  X,
  Layers,
  TrendingUp,
  Award,
} from "lucide-react";
import { cn } from "@/utils";
import { DemoProfile } from "../constants/el-mock-data";

interface Props {
  customerData: DemoProfile;
  appId: string;
  offerFlow: "bureau" | "banking";
  setOfferFlow: (flow: "bureau" | "banking") => void;
  employmentRequired: boolean;
  setEmploymentRequired: (required: boolean) => void;
  onProceed: () => void;
  onBack: () => void;
}

export default function StageSimulationScreen({
  customerData,
  appId,
  offerFlow,
  setOfferFlow,
  employmentRequired,
  setEmploymentRequired,
  onProceed,
  onBack,
}: Props) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── Top Header Banner (Aligned with Pulse Journey Style) ── */}
      <div className="border-l-4 border-[#004499] pl-4 py-2.5 bg-gradient-to-r from-blue-50/70 via-blue-50/40 to-transparent rounded-r-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#004499]">
              Journey Routing & BRE Simulation
            </span>
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] font-bold px-2 py-0.5">
              <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-600 inline" /> Digital Consent Approved
            </Badge>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            Simulation & Journey Configuration
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Select the underwriting offer trajectory and employment verification policy for{" "}
            <strong className="text-slate-800">{customerData.fullName || "Aarav Sharma"}</strong>. The journey
            stepper and active stages will automatically adapt based on your selection.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <Badge className="bg-slate-100 text-slate-700 border-slate-200 text-xs font-mono font-bold px-3 py-1.5 shadow-2xs">
            App ID: #{appId}
          </Badge>
        </div>
      </div>

      {/* ── Section 1: Offer Flow Selection ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="h-4 w-4 text-[#004499]" />
              1. Select Offer Assessment Flow
            </h3>
            <p className="text-xs text-slate-500">
              Choose between an instant Bureau-Based sanction or comprehensive Account Aggregator Banking underwriting.
            </p>
          </div>
          <Badge variant="outline" className="text-[10px] font-bold text-[#004499] border-blue-200 bg-blue-50">
            Selected: {offerFlow === "bureau" ? "Final Offer (Bureau Track)" : "Final Offer (Banking Track)"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card A: Final Offer (Bureau Track) */}
          <div
            onClick={() => setOfferFlow("bureau")}
            className={cn(
              "p-5 rounded-2xl border-2 cursor-pointer transition-all relative space-y-3 text-left",
              offerFlow === "bureau"
                ? "border-[#004499] bg-blue-50/30 shadow-md ring-2 ring-[#004499]/20"
                : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs"
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm",
                    offerFlow === "bureau"
                      ? "bg-[#004499] text-white"
                      : "bg-slate-100 text-slate-600"
                  )}
                >
                  <FileCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-base">Final Offer (Bureau)</h4>
                  <p className="text-[11px] text-slate-500">Bureau-Based Sanction</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Badge className="bg-blue-100 text-[#004499] border-blue-200 text-[10px] font-bold">
                  ₹5,00,000 Cap
                </Badge>
                <div
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center border transition-colors",
                    offerFlow === "bureau"
                      ? "bg-[#004499] border-[#004499] text-white"
                      : "border-slate-300 bg-white"
                  )}
                >
                  {offerFlow === "bureau" && <Check className="h-3 w-3 stroke-[3]" />}
                </div>
              </div>
            </div>

            <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Sanction Limit:</span>
                <span className="font-mono font-bold text-[#004499]">₹5,00,000</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Tenure & Rate:</span>
                <span className="font-mono font-bold text-slate-800">24 Months @ 10.5% p.a.</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Monthly EMI:</span>
                <span className="font-mono font-bold text-slate-800">₹23,188 / month</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
              <Zap className="h-3.5 w-3.5 text-amber-500 shrink-0" />
              <span>
                <strong>Behavior:</strong> Skips Bank Verification & Banking Offer stages entirely.
              </span>
            </div>
          </div>

          {/* Card B: Banking Offer */}
          <div
            onClick={() => setOfferFlow("banking")}
            className={cn(
              "p-5 rounded-2xl border-2 cursor-pointer transition-all relative space-y-3 text-left",
              offerFlow === "banking"
                ? "border-emerald-600 bg-emerald-50/30 shadow-md ring-2 ring-emerald-600/20"
                : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs"
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm",
                    offerFlow === "banking"
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-600"
                  )}
                >
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-base">Final Offer (Banking)</h4>
                  <p className="text-[11px] text-slate-500">Enhanced Bank Statement Sanction</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] font-bold">
                  Up to ₹15,00,000
                </Badge>
                <div
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center border transition-colors",
                    offerFlow === "banking"
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : "border-slate-300 bg-white"
                  )}
                >
                  {offerFlow === "banking" && <Check className="h-3 w-3 stroke-[3]" />}
                </div>
              </div>
            </div>

            <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Sanction Limit:</span>
                <span className="font-mono font-bold text-emerald-700">₹15,00,000 (Enhanced)</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Tenure & Rate:</span>
                <span className="font-mono font-bold text-slate-800">60 Months @ 9.25% p.a.</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Monthly EMI:</span>
                <span className="font-mono font-bold text-slate-800">₹31,320 / month</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>
                <strong>Behavior:</strong> Proceeds directly to Bank Verification, unlocking enhanced Final Offer.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 2: Employment Verification Required Toggle ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-[#004499]" />
              2. Employment Verification Required?
            </h3>
            <p className="text-xs text-slate-500">
              Toggle whether to mandate salary slip upload, EPFO UAN API validation, or work email OTP verification.
            </p>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] font-bold",
              employmentRequired
                ? "text-emerald-700 border-emerald-200 bg-emerald-50"
                : "text-amber-700 border-amber-200 bg-amber-50"
            )}
          >
            {employmentRequired ? "Verification Required: YES" : "Verification Skipped: NO"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* YES Option */}
          <div
            onClick={() => setEmploymentRequired(true)}
            className={cn(
              "p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 text-left",
              employmentRequired
                ? "border-emerald-600 bg-emerald-50/30 shadow-xs ring-2 ring-emerald-600/20"
                : "border-slate-200 bg-white hover:border-slate-300"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                employmentRequired ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400"
              )}
            >
              <Check className="h-4 w-4 stroke-[3]" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">YES — Include Employment Verification</span>
                <Badge className="bg-emerald-100 text-emerald-800 text-[9px] font-bold">Standard Risk</Badge>
              </div>
              <p className="text-xs text-slate-500">
                Employment Verification stage will appear in the journey sequence before final loan disbursement.
              </p>
            </div>
          </div>

          {/* NO Option */}
          <div
            onClick={() => setEmploymentRequired(false)}
            className={cn(
              "p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 text-left",
              !employmentRequired
                ? "border-amber-600 bg-amber-50/30 shadow-xs ring-2 ring-amber-600/20"
                : "border-slate-200 bg-white hover:border-slate-300"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                !employmentRequired ? "bg-amber-600 text-white" : "bg-slate-100 text-slate-400"
              )}
            >
              <X className="h-4 w-4 stroke-[3]" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">NO — Skip Employment Verification</span>
                <Badge className="bg-amber-100 text-amber-800 text-[9px] font-bold">Express Policy</Badge>
              </div>
              <p className="text-xs text-slate-500">
                Skips Employment Verification entirely. Applicant proceeds directly to the next stage without payslip checks.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 3: Live Journey Pipeline Preview ── */}
      <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-[#004499]" />
            Active Journey Pipeline Preview (Dynamic Stepper)
          </span>
          <span className="text-xs font-mono font-bold text-[#004499]">
            {offerFlow === "bureau"
              ? employmentRequired
                ? "Case 1A • 6 Active Stages"
                : "Case 1B • 5 Active Stages"
              : employmentRequired
                ? "Case 2A • 7 Active Stages"
                : "Case 2B • 6 Active Stages"}
          </span>
        </div>

        {/* Visual Stage Chain */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 text-xs">
          {/* Step 1 */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100/70 border border-emerald-200 rounded-lg text-emerald-800 font-bold shrink-0">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            1. Details (Done)
          </div>

          <ArrowRight className="h-3 w-3 text-slate-400 shrink-0" />

          {/* Step 2 */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100/70 border border-emerald-200 rounded-lg text-emerald-800 font-bold shrink-0">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            2. Consent (Done)
          </div>

          <ArrowRight className="h-3 w-3 text-slate-400 shrink-0" />

          {/* Conditional Steps */}
          {employmentRequired && (
            <>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 border border-blue-300 rounded-lg text-[#004499] font-bold shrink-0 ring-1 ring-blue-300">
                <Briefcase className="h-3.5 w-3.5 text-[#004499]" />
                3. Employment Verify
              </div>
              <ArrowRight className="h-3 w-3 text-slate-400 shrink-0" />
            </>
          )}

          {offerFlow === "bureau" ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100/80 border border-emerald-300 rounded-lg text-emerald-900 font-bold shrink-0">
              <Award className="h-3.5 w-3.5 text-emerald-700" />
              {employmentRequired ? "4. Final Offer" : "3. Final Offer"}
            </div>
          ) : (
            <>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 border border-blue-300 rounded-lg text-[#004499] font-bold shrink-0 ring-1 ring-blue-300">
                <Building2 className="h-3.5 w-3.5 text-[#004499]" />
                {employmentRequired ? "4. Banking Verify" : "3. Banking Verify"}
              </div>

              <ArrowRight className="h-3 w-3 text-slate-400 shrink-0" />
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100/80 border border-emerald-300 rounded-lg text-emerald-900 font-bold shrink-0">
                <Award className="h-3.5 w-3.5 text-emerald-700" />
                {employmentRequired ? "5. Final Offer" : "4. Final Offer"}
              </div>
            </>
          )}

          <ArrowRight className="h-3 w-3 text-slate-400 shrink-0" />
          <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 font-medium shrink-0">
            Timeline
          </div>

          <ArrowRight className="h-3 w-3 text-slate-400 shrink-0" />
          <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 font-medium shrink-0">
            Disbursement
          </div>
        </div>

        {/* Skipped Stages Tag */}
        <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600">Skipped in this Flow (Frozen on Tracker):</span>
            <div className="flex gap-1.5 flex-wrap">
              {offerFlow === "bureau" ? (
                <>
                  <Badge variant="outline" className="text-[10px] bg-red-50 text-red-700 border-red-200 line-through">
                    Bank Verification
                  </Badge>
                  <Badge variant="outline" className="text-[10px] bg-red-50 text-red-700 border-red-200 line-through">
                    Final Offer (Banking)
                  </Badge>
                </>
              ) : (
                <Badge variant="outline" className="text-[10px] bg-red-50 text-red-700 border-red-200 line-through">
                  Final Offer (Bureau)
                </Badge>
              )}
              {!employmentRequired && (
                <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-800 border-amber-200 line-through">
                  Employment Verification
                </Badge>
              )}
            </div>
          </div>
          <span className="text-[10px] text-slate-400 italic">
            *Skipped stages remain frozen in default inactive grey on the journey tracker.
          </span>
        </div>
      </div>

      {/* ── Action CTAs ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="h-12 sm:h-14 px-6 rounded-2xl border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wider gap-2 hover:bg-slate-100 w-full sm:w-auto"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Consent
        </Button>

        <Button
          type="button"
          onClick={onProceed}
          className={cn(
            "h-12 sm:h-14 px-8 text-white font-black uppercase tracking-wider text-xs sm:text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 group transition-all cursor-pointer w-full sm:w-auto flex-1 sm:flex-none",
            offerFlow === "bureau"
              ? "bg-[#004499] hover:bg-[#003377] shadow-blue-100"
              : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100"
          )}
        >
          <span>
            {employmentRequired
              ? "Proceed to Employment Verification"
              : offerFlow === "bureau"
              ? "Proceed to Final Offer (₹5 Lakh)"
              : "Proceed to Bank Verification"}
          </span>
          <ArrowRight className="h-4 w-4 opacity-80 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
