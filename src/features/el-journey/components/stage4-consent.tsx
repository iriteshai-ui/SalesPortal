"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Smartphone, CheckCircle2, XCircle, Timer } from "lucide-react";

type ConsentStatus = "idle" | "sending" | "waiting" | "approved" | "rejected";

interface Props {
  customerMobile?: string;
  customerName?: string;
  onComplete: () => void;
  onUpdateInsightBackend?: (activity: string, secondsLeft: number) => void;
  isSimulatingLoader?: boolean;
  setIsSimulatingLoader?: (val: boolean) => void;
  fastForwardTrigger?: number;
}

export default function Stage4Consent({
  customerMobile = "9820012345",
  onComplete,
}: Props) {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>("idle");
  const [timeLeft, setTimeLeft] = useState<number>(30);

  // Countdown timer while waiting for customer consent response
  useEffect(() => {
    let t: NodeJS.Timeout;
    if (consentStatus === "waiting" && timeLeft > 0) {
      t = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    }
    return () => clearInterval(t);
  }, [consentStatus, timeLeft]);

  // Send Consent Link
  const sendConsentLink = () => {
    setConsentStatus("sending");
    setTimeout(() => {
      setConsentStatus("waiting");
      setTimeLeft(30);
    }, 1000);
  };

  // Simulate UAT Customer action (exact BL journey interaction)
  const simulateConsent = (action: "approve" | "reject") => {
    if (action === "approve") {
      setConsentStatus("approved");
      // Seamlessly progress to Stage 5 after brief confirmation
      setTimeout(() => {
        onComplete();
      }, 1200);
    } else {
      setConsentStatus("rejected");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── Top Header Banner (Exact BL Style) ── */}
      <div className="border-l-4 border-[#004499] pl-4 py-1 bg-blue-50/50 rounded-r-md">
        <h3 className="text-lg font-semibold text-slate-900">Stage 2 — Digital Consent</h3>
        <p className="text-sm text-slate-500">
          Capture customer digital consent to fetch CIBIL, CKYC, academic and banking records.
        </p>
      </div>

      {/* ── Consent Flow Card (Exact BL ConsentStep Style) ── */}
      <div className="max-w-xl mx-auto py-8 text-center animate-in fade-in zoom-in-95 duration-400 space-y-6">
        {/* ── State 1: Idle ── */}
        {consentStatus === "idle" && (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Smartphone className="w-10 h-10 text-[#004499]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Request Digital Consent</h2>
              <p className="text-slate-500 max-w-sm mx-auto text-sm">
                We need to fetch the customer&apos;s credit and verification records. An SMS with a consent link will be sent to <b>+91 {customerMobile}</b>.
              </p>
            </div>
            <Button
              onClick={sendConsentLink}
              size="lg"
              className="bg-[#004499] hover:bg-[#003377] w-full max-w-xs h-12 text-sm font-bold shadow-md shadow-blue-100"
            >
              Send Consent Link
            </Button>
          </div>
        )}

        {/* ── State 2: Sending / Waiting ── */}
        {(consentStatus === "sending" || consentStatus === "waiting") && (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Timer className="w-10 h-10 text-amber-600 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Waiting for Customer…</h2>
              <p className="text-slate-500 text-sm">
                Link sent to <b>+91 {customerMobile}</b>. Ask the customer to click the link and approve.
              </p>
            </div>

            <div className="max-w-xs mx-auto space-y-2">
              <Progress value={((30 - timeLeft) / 30) * 100} className="h-2" />
              <p className="text-xs text-slate-400">Time remaining: {timeLeft}s</p>
            </div>

            {/* UAT Simulation Controls (Exact BL Component) */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mt-6">
              <p className="text-xs font-mono font-black text-slate-400 uppercase tracking-wider mb-3">
                UAT: SIMULATE CUSTOMER ACTION
              </p>
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => simulateConsent("approve")}
                  className="text-emerald-700 border-emerald-300 hover:bg-emerald-50 font-bold"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-600" /> Simulate Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => simulateConsent("reject")}
                  className="text-red-700 border-red-300 hover:bg-red-50 font-bold"
                >
                  <XCircle className="h-3.5 w-3.5 mr-1 text-red-600" /> Simulate Reject
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ── State 3: Approved ── */}
        {consentStatus === "approved" && (
          <div className="space-y-4 py-8">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-emerald-700">Consent Approved</h2>
            <p className="text-emerald-600 text-sm font-medium">Fetching Bureau & Underwriting Data…</p>
          </div>
        )}

        {/* ── State 4: Rejected ── */}
        {consentStatus === "rejected" && (
          <div className="space-y-4 py-8">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-red-700">Consent Rejected</h2>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              The customer denied permission. Education Loan journey cannot proceed without mandatory regulatory consent.
            </p>
            <Button
              variant="outline"
              onClick={() => setConsentStatus("idle")}
              className="border-slate-300 text-slate-700 font-bold"
            >
              Retry Consent
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
