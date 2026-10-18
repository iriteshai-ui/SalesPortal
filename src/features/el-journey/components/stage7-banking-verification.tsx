"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Smartphone,
  Monitor,
  Clock,
  XCircle,
  CheckCircle2,
  RefreshCw,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Building2,
  FileSpreadsheet,
  AlertCircle,
  Zap,
} from "lucide-react";
import confetti from "canvas-confetti";
import { cn } from "@/utils";

type BVPhase =
  | "idle" // Choose: Send Link or Self Verify
  | "link_sent" // Sent AA link to customer
  | "self_waiting" // New tab opened, waiting screen
  | "waiting" // 10s waiting for banking eligibility
  | "error" // Verification failed
  | "rejected" // AA eligibility failed
  | "success"; // Success -> proceed to RT2 final offer

interface Props {
  customerMobile?: string;
  customerName?: string;
  onComplete: () => void;
  onUpdateInsightBackend?: (activity: string, secondsLeft: number) => void;
  fastForwardTrigger?: number;
}

export default function Stage7BankingVerification({
  customerMobile = "9820012345",
  customerName = "Aarav Sharma",
  onComplete,
  onUpdateInsightBackend,
  fastForwardTrigger,
}: Props) {
  const [phase, setPhase] = useState<BVPhase>("idle");
  const [waitSeconds, setWaitSeconds] = useState<number>(10);
  const [waitDone, setWaitDone] = useState<boolean>(false);

  // 10s countdown timer
  const waitSteps = [
    { sec: 10, text: "Validating bank account credentials with Account Aggregator..." },
    { sec: 7, text: "Fetching last 6 months transaction history & salary credits..." },
    { sec: 4, text: "Generating banking health score & debt-to-income FOIR matrix..." },
    { sec: 1, text: "Finalizing banking score & structuring final loan sanction..." },
  ];

  useEffect(() => {
    if (phase !== "waiting" && phase !== "self_waiting") return;

    const step = waitSteps.find((s) => s.sec === waitSeconds);
    if (onUpdateInsightBackend) {
      onUpdateInsightBackend(
        step?.text || "Verifying banking information across RBI-approved Account Aggregator...",
        waitSeconds
      );
    }

    if (waitSeconds <= 0) {
      setWaitDone(true);
      return;
    }

    const t = setTimeout(() => setWaitSeconds((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, waitSeconds]);

  // Fast forward trigger
  useEffect(() => {
    if ((phase === "waiting" || phase === "self_waiting") && fastForwardTrigger) {
      setWaitSeconds(0);
      setWaitDone(true);
    }
  }, [fastForwardTrigger]);

  const startSelfVerify = () => {
    // Simulate opening Account Aggregator consent sandbox
    window.open("https://onetere.in", "_blank");
    setPhase("self_waiting");
    setWaitSeconds(10);
    setWaitDone(false);
  };

  const startWaiting = () => {
    setPhase("waiting");
    setWaitSeconds(10);
    setWaitDone(false);
  };

  const simulateResult = (result: "success" | "error" | "rejected") => {
    setPhase(result);
    if (result === "success") {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.5 },
        colors: ["#004499", "#10b981", "#3b82f6"],
      });
    }
  };

  // ── Phase 1: Idle (Choose Method - Exact BL style) ──
  if (phase === "idle") {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-400">
        <div className="text-center space-y-2">
          <Badge className="bg-blue-100 text-[#004499] text-xs font-bold uppercase tracking-wider">
            Account Aggregator Verification
          </Badge>
          <h2 className="text-2xl font-black text-slate-900">Banking & Income Verification</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Select preferred verification channel to fetch bank statements for{" "}
            <span className="font-semibold text-slate-900">{customerName}</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setPhase("link_sent")}
            className="p-6 bg-white border-2 border-slate-200 hover:border-[#004499] hover:bg-blue-50/30 rounded-2xl transition-all text-left group shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Smartphone className="h-6 w-6 text-[#004499]" />
            </div>
            <p className="font-bold text-slate-900 text-base">Send Link to Customer</p>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Dispatches an encrypted Account Aggregator verification link to the applicant's mobile number (+91 {customerMobile.slice(0, 2)}******{customerMobile.slice(-2)}).
            </p>
          </button>

          <button
            type="button"
            onClick={startSelfVerify}
            className="p-6 bg-white border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 rounded-2xl transition-all text-left group shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Monitor className="h-6 w-6 text-emerald-700" />
            </div>
            <p className="font-bold text-slate-900 text-base">Agent-Assisted Verification</p>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Agent initiates NetBanking or Account Aggregator credential entry in a secure browser sandbox tab.
            </p>
          </button>
        </div>
      </div>
    );
  }

  // ── Phase 2: Link Sent to Customer ──
  if (phase === "link_sent") {
    return (
      <div className="max-w-md mx-auto py-10 text-center space-y-6 animate-in fade-in duration-400">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto border-2 border-blue-100">
          <Smartphone className="w-10 h-10 text-[#004499]" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900">AA Consent Link Dispatched</h2>
          <p className="text-sm text-slate-500">
            Link sent via SMS to registered mobile: <span className="font-mono font-bold text-slate-800">+91 {customerMobile}</span>.
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 font-medium text-left">
          <p className="font-bold mb-1">Customer Instructions:</p>
          <p>1. Open SMS link received from PULSE-EL.</p>
          <p>2. Select primary salary / tuition savings bank account.</p>
          <p>3. Authorize OTP sent by Account Aggregator.</p>
        </div>
        <Button
          onClick={startWaiting}
          className="bg-[#004499] hover:bg-[#003377] w-full h-11 font-bold text-xs uppercase tracking-wider"
        >
          Customer Has Authorised → Verify Statements
        </Button>
      </div>
    );
  }

  // ── Phase 3: Self-Waiting / Waiting 10s (Exact BL style) ──
  if (phase === "waiting" || phase === "self_waiting") {
    return (
      <div className="max-w-md mx-auto py-10 text-center space-y-6 animate-in fade-in duration-400">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto border-2 border-amber-100">
          <Clock className="w-10 h-10 text-amber-600 animate-pulse" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900">Verifying banking information…</h2>
          <p className="text-sm text-slate-500">
            Synthesizing 6-month statement data, average bank balance, and calculating education EMI debt capacity.
          </p>
        </div>

        <div className="max-w-xs mx-auto space-y-2">
          <Progress value={((10 - waitSeconds) / 10) * 100} className="h-2 bg-slate-200" />
          <p className="text-xs text-slate-400 font-mono">
            {waitDone ? "Banking analysis completed!" : `Processing… ${waitSeconds}s remaining`}
          </p>
        </div>

        {/* UAT Simulation Controls */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
          <p className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">
            UAT: SIMULATE BANKING OUTCOME
          </p>
          <div className="grid grid-cols-3 gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => simulateResult("success")}
              className="text-emerald-700 border-emerald-300 hover:bg-emerald-50 text-xs font-bold"
            >
              Success
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => simulateResult("error")}
              className="text-amber-700 border-amber-300 hover:bg-amber-50 text-xs font-bold"
            >
              Timeout Error
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => simulateResult("rejected")}
              className="text-rose-700 border-rose-300 hover:bg-rose-50 text-xs font-bold"
            >
              Reject Criteria
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Phase 4: Error Screen (Exact BL style) ──
  if (phase === "error") {
    return (
      <div className="max-w-md mx-auto py-10 text-center space-y-5 animate-in fade-in zoom-in-95 duration-400">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto border-2 border-amber-200">
          <RefreshCw className="h-10 w-10 text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold text-amber-800">Banking Verification Failed</h2>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left space-y-2 text-xs">
          <p className="font-bold text-amber-900">Error Diagnostic:</p>
          <p className="text-amber-700 font-mono">
            ERR_AA_FETCH_TIMEOUT: Account Aggregator institution did not respond with 6-month statement statements within the 30-second window.
          </p>
        </div>
        <p className="text-xs text-slate-500">Please retry or switch to manual PDF statement upload.</p>
        <div className="flex gap-3 flex-col pt-2">
          <Button
            onClick={() => {
              setPhase("waiting");
              setWaitSeconds(10);
              setWaitDone(false);
            }}
            className="bg-amber-600 hover:bg-amber-700 text-white h-11 font-bold text-xs uppercase tracking-wider gap-2"
          >
            <RefreshCw className="h-4 w-4" /> Retry Banking Verification
          </Button>
          <Button variant="outline" onClick={() => setPhase("idle")}>
            Change Verification Channel
          </Button>
        </div>
      </div>
    );
  }

  // ── Phase 5: Rejected Screen (Exact BL style) ──
  if (phase === "rejected") {
    return (
      <div className="max-w-md mx-auto py-10 text-center space-y-5 animate-in fade-in zoom-in-95 duration-400">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto border-2 border-rose-200">
          <XCircle className="h-10 w-10 text-rose-600" />
        </div>
        <h2 className="text-2xl font-bold text-rose-800">Banking Eligibility Criteria Not Met</h2>
        <p className="text-xs text-slate-500">
          Account Aggregator statement analysis did not fulfill the minimum debt servicing standards for this education loan tier.
        </p>
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-left space-y-1.5 text-xs text-rose-800">
          <p className="font-bold text-rose-900 uppercase tracking-wider text-[10px]">Identified Failures:</p>
          <p>• Inward salary / business average balance is below ₹35,000 / month.</p>
          <p>• Inward ECS / NACH return frequency higher than 2 occurrences in 90 days.</p>
          <p>• FOIR exceeds maximum permissible cap of 60%.</p>
        </div>
        <Button variant="outline" onClick={() => (window.location.href = "/dashboard")} className="w-full">
          Return to Dashboard
        </Button>
      </div>
    );
  }

  // ── Phase 6: Success Screen (Proceed to RT2 Final Offer) ──
  return (
    <div className="max-w-lg mx-auto py-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-400">
      <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-200">
        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
      </div>
      <div className="space-y-1">
        <Badge className="bg-emerald-100 text-emerald-800 font-bold text-xs uppercase tracking-wider">
          Verification Complete
        </Badge>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Banking Verified Successfully!</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Account statement validated via Account Aggregator.
        </p>
      </div>

      <Button
        type="button"
        onClick={onComplete}
        className="w-full h-12 rounded-xl bg-[#004499] hover:bg-[#003377] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-100 gap-2"
      >
        Proceed to Banking Offer <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
