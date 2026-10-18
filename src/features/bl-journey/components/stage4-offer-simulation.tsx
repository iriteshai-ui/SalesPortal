"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, XCircle, TrendingUp, Zap, Star, IndianRupee, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";

type Segment = "reject" | "blue" | "yellow" | "green";

interface Props {
  onComplete: (nextStage: "rejected" | "blue_accepted" | "banking_verification" | "direct_banking") => void;
}

const fmt = (v: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);

export default function Stage4OfferSimulation({ onComplete }: Props) {
  const [phase, setPhase] = useState<"loading" | "segments" | "reject" | "blue" | "segment_detail">("loading");
  const [countdown, setCountdown] = useState(5);
  const [segment, setSegment] = useState<Segment | null>(null);
  const [brpFlag, setBrpFlag] = useState(false);

  // 5-second loader
  useEffect(() => {
    if (phase !== "loading") return;
    if (countdown === 0) { setPhase("segments"); return; }
    const t = setTimeout(() => setCountdown((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  const pickSegment = (seg: Segment) => {
    setSegment(seg);
    if (seg === "reject") { setPhase("reject"); return; }
    if (seg === "blue") { setPhase("blue"); return; }
    setPhase("segment_detail");
  };

  const handleBlueAccept = () => {
    confetti({ particleCount: 120, spread: 70, origin: { y: 0.4 }, colors: ["#3b82f6", "#004499", "#10b981"] });
    onComplete("blue_accepted");
  };

  const handleYGContinue = () => {
    if (brpFlag) {
      onComplete("banking_verification"); // BRP YES → Stage 5 (BRP Details)
    } else {
      onComplete("direct_banking"); // BRP NO → Stage 6 (Banking Verification), skip BRP
    }
  };

  // ── 5-second loader ────────────────────────────────────────────────────────
  if (phase === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6 animate-in fade-in duration-500">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-[#004499]/10 flex items-center justify-center">
            <Loader2 className="h-12 w-12 text-[#004499] animate-spin" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-black text-lg border-2 border-white">
            {countdown}
          </div>
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-xl font-bold text-slate-900">Fetching best offer for you…</h3>
          <p className="text-sm text-slate-500">Analysing bureau data and income profile</p>
        </div>
        <div className="flex gap-1">
          {[0,1,2,3,4].map((i) => (
            <div key={i} className={`h-1.5 w-8 rounded-full transition-all duration-500 ${i < (5 - countdown) ? "bg-[#004499]" : "bg-slate-200"}`} />
          ))}
        </div>
      </div>
    );
  }

  // ── Segment selector ───────────────────────────────────────────────────────
  if (phase === "segments") {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-400">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-slate-900">Offer Category</h3>
          <p className="text-sm text-slate-500 mt-1">Select the segment determined by the bureau & BRE engine</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { seg: "reject" as Segment, icon: <XCircle className="h-7 w-7 text-red-600" />, bg: "bg-red-100", border: "hover:border-red-400 hover:bg-red-50/30", label: "Reject Segment", desc: "Customer does not qualify. End journey." },
            { seg: "blue" as Segment, icon: <IndianRupee className="h-7 w-7 text-blue-600" />, bg: "bg-blue-100", border: "hover:border-blue-400 hover:bg-blue-50/30", label: "Blue Segment", desc: "Show approved loan amount only." },
            { seg: "yellow" as Segment, icon: <Zap className="h-7 w-7 text-amber-600" />, bg: "bg-amber-100", border: "hover:border-amber-400 hover:bg-amber-50/30", label: "Yellow Segment", desc: "Conditional — check BRP flag." },
            { seg: "green" as Segment, icon: <Star className="h-7 w-7 text-emerald-600" />, bg: "bg-emerald-100", border: "hover:border-emerald-400 hover:bg-emerald-50/30", label: "Green Segment", desc: "Best offer — check BRP flag." },
          ].map(({ seg, icon, bg, border, label, desc }) => (
            <button key={seg} onClick={() => pickSegment(seg)}
              className={`p-5 bg-white border-2 border-slate-100 ${border} rounded-xl transition-all text-left group`}>
              <div className={`w-12 h-12 rounded-full ${bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>{icon}</div>
              <p className="font-bold text-slate-900">{label}</p>
              <p className="text-xs text-slate-500 mt-1">{desc}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Rejection screen ───────────────────────────────────────────────────────
  if (phase === "reject") {
    return (
      <div className="max-w-md mx-auto py-16 flex flex-col items-center text-center space-y-5 animate-in fade-in zoom-in-95 duration-400">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
          <XCircle className="h-12 w-12 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-red-800">Application Rejected</h2>
        <p className="text-slate-500 max-w-sm">
          Based on the bureau data and BRE evaluation, this applicant does not qualify for a Business Loan at this time.
        </p>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 w-full text-left space-y-2">
          <p className="text-xs font-bold text-red-700 uppercase tracking-wider">Reason Codes</p>
          <p className="text-sm text-red-600">• CIBIL score below threshold (&lt; 650)</p>
          <p className="text-sm text-red-600">• Insufficient business vintage</p>
          <p className="text-sm text-red-600">• High existing credit utilisation</p>
        </div>
        <Button variant="outline" onClick={() => window.location.href = "/dashboard"} className="w-full">
          Return to Dashboard
        </Button>
      </div>
    );
  }

  // ── Blue segment offer ─────────────────────────────────────────────────────
  if (phase === "blue") {
    const loanAmount = 750000;
    return (
      <div className="max-w-lg mx-auto py-8 space-y-6 animate-in fade-in zoom-in-95 duration-400">
        <div className="text-center space-y-1">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-black uppercase tracking-wider">Blue Segment</span>
          <h2 className="text-2xl font-bold text-slate-900 mt-2">Pre-Approved Offer</h2>
          <p className="text-sm text-slate-500">Based on your bureau profile, you qualify for the following:</p>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-center text-white shadow-2xl shadow-blue-200 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_white_0%,_transparent_60%)]" />
          <p className="text-sm font-bold uppercase tracking-widest text-blue-200 mb-2">Approved Loan Amount</p>
          <div className="text-5xl font-black text-white tracking-tight">{fmt(loanAmount)}</div>
          <p className="text-blue-200 text-sm mt-3">Subject to final verification</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700 space-y-1">
          <p className="font-bold">What happens next?</p>
          <p className="text-blue-600">Full offer details including EMI, interest rate, processing fees and disbursement amount will be shared after banking verification.</p>
        </div>
        <Button onClick={handleBlueAccept} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-200 gap-2">
          Accept Offer <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  // ── Yellow / Green segment detail ─────────────────────────────────────────
  if (phase === "segment_detail") {
    const isGreen = segment === "green";
    return (
      <div className="max-w-lg mx-auto py-8 space-y-6 animate-in fade-in zoom-in-95 duration-400">
        <div className="text-center space-y-2">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${isGreen ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
            {isGreen ? "Green" : "Yellow"} Segment
          </span>
          <h2 className="text-2xl font-bold text-slate-900">{isGreen ? "Best Offer Available" : "Conditional Offer"}</h2>
        </div>
        <div className={`rounded-2xl p-6 text-center ${isGreen ? "bg-gradient-to-br from-emerald-500 to-emerald-700" : "bg-gradient-to-br from-amber-500 to-amber-700"} text-white shadow-xl`}>
          <p className="text-sm font-bold uppercase tracking-widest text-white/80 mb-3">Offer Status</p>
          <div className="text-xl font-black tracking-tight">
            {isGreen ? "Best Offer Eligible" : "Conditional Offer Eligible"}
          </div>
          <p className="text-white/70 text-sm mt-2">
            Approved amount will be generated after banking verification
          </p>
        </div>

        {/* BRP Flag toggle */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
          <p className="text-xs font-black text-slate-400 uppercase tracking-wider">UAT: BRP Flag Control</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setBrpFlag(!brpFlag)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${brpFlag ? "bg-[#004499]" : "bg-slate-300"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${brpFlag ? "translate-x-6" : ""}`} />
            </button>
            <span className="text-sm font-semibold text-slate-700">BRP Flag: <span className={brpFlag ? "text-[#004499]" : "text-slate-400"}>{brpFlag ? "YES → BRP Details" : "NO → Banking Verification"}</span></span>
          </div>
        </div>

        <Button onClick={handleYGContinue} className={`w-full h-12 font-bold text-base gap-2 ${isGreen ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200" : "bg-amber-500 hover:bg-amber-600 shadow-amber-200"} text-white shadow-lg`}>
          {brpFlag ? "Continue to BRP Details" : "Continue to Banking Verification"}
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return null;
}
