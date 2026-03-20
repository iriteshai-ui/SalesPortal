import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle2, AlertCircle, Clock, Smartphone, Timer, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type CaseStatus = "new" | "wip" | "rejected" | null;
type ConsentStatus = "idle" | "sending" | "waiting" | "approved" | "rejected";

interface Props {
  onComplete: (mobile: string) => void;
}

export default function Stage1MobileConsent({ onComplete }: Props) {
  const [mobile, setMobile] = useState("9876543210");
  const [checking, setChecking] = useState(false);
  const [caseStatus, setCaseStatus] = useState<CaseStatus>(null);
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>("idle");
  const [timeLeft, setTimeLeft] = useState(30);

  // Check Status
  const checkStatus = () => {
    if (mobile.length !== 10) return;
    setChecking(true);
    setCaseStatus(null);
    setTimeout(() => { setChecking(false); setCaseStatus(null); setShowResult(true); }, 3000);
  };

  const [showResult, setShowResult] = useState(false);

  // Consent timer
  useEffect(() => {
    let t: NodeJS.Timeout;
    if (consentStatus === "waiting" && timeLeft > 0) {
      t = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    }
    return () => clearInterval(t);
  }, [consentStatus, timeLeft]);

  const sendConsentLink = () => {
    setConsentStatus("sending");
    setTimeout(() => { setConsentStatus("waiting"); setTimeLeft(30); }, 1200);
  };

  const simulateConsent = (action: "approve" | "reject") => {
    if (action === "approve") {
      setConsentStatus("approved");
      setTimeout(() => onComplete(mobile), 1200);
    } else {
      setConsentStatus("rejected");
    }
  };

  // ── Checking loader ────────────────────────────────────────────────────────
  if (checking) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="h-12 w-12 text-[#004499] animate-spin" />
        <p className="font-semibold text-slate-700 text-lg">Validating Mobile Number…</p>
        <p className="text-sm text-slate-400">Checking existing applications in our records</p>
      </div>
    );
  }

  // ── Case result picker ─────────────────────────────────────────────────────
  if (showResult && !caseStatus) {
    return (
      <div className="max-w-lg mx-auto space-y-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-slate-900">Verification Result</h3>
          <p className="text-sm text-slate-500 mt-1">Select result for {mobile}</p>
        </div>
        {[
          { key: "new", icon: <CheckCircle2 className="h-6 w-6 text-emerald-600" />, bg: "bg-emerald-100", label: "New Case", desc: "No existing record found. Proceed to consent." },
          { key: "wip", icon: <Clock className="h-6 w-6 text-amber-600" />, bg: "bg-amber-100", label: "WIP Case", desc: "Application #APP-847291-X already in progress." },
          { key: "rejected", icon: <AlertCircle className="h-6 w-6 text-red-600" />, bg: "bg-red-100", label: "Rejected Case", desc: "Application #APP-102938-R recently declined." },
        ].map((opt) => (
          <button key={opt.key} type="button" onClick={() => setCaseStatus(opt.key as CaseStatus)}
            className="w-full flex items-center p-4 bg-white border-2 border-slate-100 hover:border-emerald-400 hover:bg-emerald-50/30 rounded-xl transition-all text-left group">
            <div className={`w-12 h-12 rounded-full ${opt.bg} flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}>{opt.icon}</div>
            <div>
              <p className="font-bold text-slate-900">{opt.label}</p>
              <p className="text-xs text-slate-500">{opt.desc}</p>
            </div>
          </button>
        ))}
        <Button variant="ghost" onClick={() => { setShowResult(false); }} className="w-full text-slate-400">Back to Search</Button>
      </div>
    );
  }

  // ── WIP / Rejected blocker ─────────────────────────────────────────────────
  if (caseStatus === "wip" || caseStatus === "rejected") {
    return (
      <div className="max-w-md mx-auto py-16 flex flex-col items-center text-center space-y-4 animate-in fade-in duration-300">
        {caseStatus === "wip" ? <Clock className="h-14 w-14 text-amber-500" /> : <AlertCircle className="h-14 w-14 text-red-500" />}
        <h4 className="font-bold text-slate-900 text-xl">{caseStatus === "wip" ? "Case In Progress" : "Lead Restricted"}</h4>
        <p className="text-sm text-slate-500 max-w-sm">
          {caseStatus === "wip"
            ? "An application for this mobile number is already active (APP-847291-X). Duplicate leads cannot be created."
            : "A recent application (APP-102938-R) for this number was rejected. New lead creation is cooling off for 90 days."}
        </p>
        <Button variant="outline" onClick={() => { setCaseStatus(null); setShowResult(false); }}>Try Another Number</Button>
      </div>
    );
  }

  // ── Consent flow (New Case selected) ──────────────────────────────────────
  if (caseStatus === "new") {
    return (
      <div className="max-w-xl mx-auto py-8 text-center animate-in fade-in zoom-in-95 duration-400 space-y-6">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 inline-flex items-center gap-2 text-emerald-700 text-sm font-semibold mx-auto">
          <CheckCircle2 className="h-4 w-4" /> New Case — +91 {mobile}
        </div>

        {consentStatus === "idle" && (
          <>
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
              <Smartphone className="w-10 h-10 text-[#004499]" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Request CIBIL Consent</h2>
            <p className="text-slate-500 max-w-sm mx-auto">
              An SMS with a consent link will be sent to <b>+91 {mobile}</b> to authorise credit bureau access.
            </p>
            <Button onClick={sendConsentLink} size="lg" className="bg-[#004499] hover:bg-[#003377] w-full max-w-xs">
              Send Consent Link
            </Button>
          </>
        )}

        {(consentStatus === "sending" || consentStatus === "waiting") && (
          <>
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto">
              <Timer className="w-10 h-10 text-amber-600 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Waiting for Customer…</h2>
            <p className="text-slate-500">Link sent to <b>+91 {mobile}</b>. Ask the customer to click and approve.</p>
            <div className="max-w-xs mx-auto space-y-2">
              <Progress value={((30 - timeLeft) / 30) * 100} className="h-2" />
              <p className="text-xs text-slate-400">Time remaining: {timeLeft}s</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-xs font-mono text-slate-400 mb-3">UAT: SIMULATE CUSTOMER ACTION</p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" size="sm" onClick={() => simulateConsent("approve")} className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">Simulate Approve</Button>
                <Button variant="outline" size="sm" onClick={() => simulateConsent("reject")} className="text-red-600 border-red-200 hover:bg-red-50">Simulate Reject</Button>
              </div>
            </div>
          </>
        )}

        {consentStatus === "approved" && (
          <>
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-emerald-700">Consent Approved</h2>
            <p className="text-emerald-600">Fetching Bureau Data…</p>
          </>
        )}

        {consentStatus === "rejected" && (
          <>
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-red-700">Consent Rejected</h2>
            <p className="text-slate-500">The customer denied permission. Journey cannot proceed.</p>
            <Button variant="outline" onClick={() => setConsentStatus("idle")}>Retry Consent</Button>
          </>
        )}
      </div>
    );
  }

  // ── Default: mobile entry ──────────────────────────────────────────────────
  return (
    <div className="max-w-md mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-l-4 border-[#004499] pl-4 py-1 bg-blue-50/50 rounded-r-md">
        <h3 className="text-lg font-semibold text-slate-900">Stage 1 — Mobile Number & Consent</h3>
        <p className="text-sm text-slate-500">Enter customer's mobile to check existing records and capture consent.</p>
      </div>
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="pt-6 space-y-4">
          <label className="text-sm font-bold text-slate-700 block">Mobile Number <span className="text-red-500">*</span></label>
          <div className="flex gap-2">
            <Input
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="10-digit mobile number"
              className="font-mono text-lg h-12 tracking-widest"
              maxLength={10}
            />
            <Button onClick={checkStatus} disabled={mobile.length !== 10} className="bg-[#004499] h-12 px-6">
              Check Status
            </Button>
          </div>
          <p className="text-xs text-slate-400">This will be used for CIBIL and consent verification.</p>
        </CardContent>
      </Card>
    </div>
  );
}
