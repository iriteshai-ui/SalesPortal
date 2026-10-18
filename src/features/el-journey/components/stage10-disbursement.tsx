"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  PartyPopper,
  ShieldCheck,
  Building,
  GraduationCap,
  Banknote,
  Copy,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  FileText,
  Loader2,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useToast } from "@/hooks/useToast";
import { DemoProfile } from "../constants/el-mock-data";

interface Props {
  appId: string;
  customerData: DemoProfile;
  onFinishJourney: () => void;
  onUpdateInsightBackend?: (activity: string, secondsLeft: number) => void;
  isSimulatingLoader: boolean;
  setIsSimulatingLoader: (val: boolean) => void;
  fastForwardTrigger?: number;
}

export default function Stage10Disbursement({
  appId,
  customerData,
  onFinishJourney,
  onUpdateInsightBackend,
  isSimulatingLoader,
  setIsSimulatingLoader,
  fastForwardTrigger,
}: Props) {
  const { toast } = useToast();
  const [countdown, setCountdown] = useState<number>(10);
  const [disbursed, setDisbursed] = useState<boolean>(false);
  const [utrNumber] = useState<string>(() => `UTR-SBIN-2024-${Math.floor(Math.random() * 900000) + 100000}`);
  const [loanAccountNumber] = useState<string>(() => `PFL-EL-2024-${Math.floor(Math.random() * 90000) + 10000}`);

  // Auto-start loader on mount
  useEffect(() => {
    setIsSimulatingLoader(true);
    setCountdown(10);
  }, []);

  // Countdown logic
  useEffect(() => {
    if (!isSimulatingLoader) return;

    if (countdown <= 0) {
      setIsSimulatingLoader(false);
      setDisbursed(true);
      // Trigger full-screen celebratory confetti
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.35 },
        colors: ["#004499", "#10b981", "#fbbf24", "#6366f1"],
      });
      return;
    }

    const t = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(t);
  }, [isSimulatingLoader, countdown]);

  // Fast forward trigger
  useEffect(() => {
    if (isSimulatingLoader && fastForwardTrigger) {
      setCountdown(0);
    }
  }, [fastForwardTrigger]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard.`,
    });
  };

  const finalSanctionAmount = customerData.loanAmount || 2500000;
  const processingFee = Math.round((finalSanctionAmount * 0.005) * 1.18);
  const netAmount = finalSanctionAmount - processingFee;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-400">
      {/* ── Loader State (BL Style) ── */}
      {isSimulatingLoader && (
        <Card className="bg-white rounded-3xl shadow-sm border border-slate-200 text-center p-8 space-y-6 animate-in zoom-in-95">
          <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-[#004499]/10 flex items-center justify-center">
              <Loader2 className="h-12 w-12 text-[#004499] animate-spin" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-black text-sm border-2 border-white">
              {countdown}s
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900">
              Processing Final Disbursement…
            </h3>
            <p className="text-sm text-slate-500">
              Booking loan account and releasing payment transfer…
            </p>
          </div>

          <div className="flex gap-1.5 justify-center">
            {[10, 8, 6, 4, 2].map((s) => (
              <div
                key={s}
                className={`h-1.5 w-8 rounded-full transition-all duration-500 ${
                  countdown <= s ? "bg-[#004499]" : "bg-slate-200"
                }`}
              />
            ))}
          </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCountdown(0)}
              className="text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border-amber-200"
            >
              ⚡ Fast-Forward Timer (1s)
            </Button>
          </Card>
        )}

      {/* ── Disbursed Success Card ── */}
      {disbursed && (
        <div className="space-y-6 animate-in zoom-in-95 duration-500">
          <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden text-center space-y-5">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-black/10 rounded-full blur-2xl" />

            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto border-2 border-white/30 shadow-lg">
              <PartyPopper className="h-10 w-10 text-white animate-bounce" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-200">
                Loan Disbursed Successfully
              </span>
              <h2 className="text-3xl font-black tracking-tight">Funds Released to Academic Account!</h2>
              <p className="text-emerald-100 text-xs max-w-md mx-auto">
                Education loan for{" "}
                <span className="font-bold text-white">{customerData.fullName}</span> has been booked in the
                core ledger and credited via RTGS/NEFT.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 max-w-md mx-auto space-y-2 text-left text-xs">
              <div className="flex justify-between items-center py-1 border-b border-white/15">
                <span className="text-emerald-100">Disbursed Net Amount</span>
                <span className="text-xl font-black font-mono text-white">
                  ₹ {netAmount.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/15">
                <span className="text-emerald-100">Beneficiary Institution</span>
                <span className="font-bold text-white truncate max-w-[200px]">
                  {customerData.institutionName}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/15">
                <span className="text-emerald-100">Application Reference</span>
                <span className="font-mono font-bold text-white">#{appId}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-white/15">
                <span className="text-emerald-100">Loan Account No. (LAN)</span>
                <span className="font-mono font-bold text-white">{loanAccountNumber}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-emerald-100">Disbursement UTR Ref</span>
                <span className="font-mono font-bold text-white flex items-center gap-1.5">
                  {utrNumber}
                  <button
                    onClick={() => copyToClipboard(utrNumber, "UTR Reference")}
                    className="hover:text-emerald-200"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </span>
              </div>
            </div>
          </div>

          {/* Journey Completion Summary */}
          <Card className="border border-slate-200 rounded-3xl p-6 bg-white shadow-sm space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Assisted Sales Compliance Record
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">First EMI Date</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">05 Dec 2026</span>
                <span className="text-[10px] text-slate-500">Post-course Moratorium</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Auto-Debit Bank</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">SBI (A/C **4821)</span>
                <span className="text-[10px] text-emerald-600 font-semibold">eNACH Mandate Active</span>
              </div>
            </div>

            <div className="pt-2 flex justify-center">
              <Button
                onClick={onFinishJourney}
                className="w-full sm:w-auto h-12 px-8 rounded-xl bg-[#004499] hover:bg-[#003377] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-100 gap-2"
              >
                Return to Sales Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
