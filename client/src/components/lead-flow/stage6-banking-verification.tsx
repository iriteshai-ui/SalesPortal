import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Loader2, Smartphone, Monitor, Clock, XCircle, CheckCircle2, RefreshCw, TrendingUp, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import confetti from "canvas-confetti";

type BVPhase =
  | "idle"          // Choose: Send Link or Self Verify
  | "link_sent"     // Sent AA link to customer
  | "self_waiting"  // New tab opened, waiting screen
  | "waiting"       // Waiting for banking eligibility (10s min)
  | "error"         // Verification failed
  | "rejected"      // AA eligibility failed
  | "success";      // Success → show AA offer

interface Props {
  onComplete: (outcome: "want_more" | "accepted") => void;
}

const fmt = (v: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);
const calcEMI = (p: number, n: number) => { const r = 18 / 12 / 100; return Math.round(p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)); };

export default function Stage6BankingVerification({ onComplete }: Props) {
  const [phase, setPhase] = useState<BVPhase>("idle");
  const [waitSeconds, setWaitSeconds] = useState(10);
  const [waitDone, setWaitDone] = useState(false);
  const [amount, setAmount] = useState([850000]);
  const [tenure, setTenure] = useState([36]);

  // Waiting timer (min 10 seconds)
  useEffect(() => {
    if (phase !== "waiting" && phase !== "self_waiting") return;
    if (waitSeconds <= 0) { setWaitDone(true); return; }
    const t = setTimeout(() => setWaitSeconds((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, waitSeconds]);

  const startSelfVerify = () => {
    window.open("https://google.com", "_blank");
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
      confetti({ particleCount: 100, spread: 60, origin: { y: 0.5 }, colors: ["#004499", "#10b981"] });
    }
  };

  // ── Idle: choose method ────────────────────────────────────────────────────
  if (phase === "idle") {
    return (
      <div className="max-w-xl mx-auto space-y-6 animate-in fade-in duration-400">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Banking Verification</h2>
          <p className="text-sm text-slate-500">Choose how to complete Account Aggregator (AA) verification</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button onClick={() => { setPhase("link_sent"); }}
            className="p-6 bg-white border-2 border-slate-100 hover:border-[#004499] hover:bg-blue-50/30 rounded-xl transition-all text-left group">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Smartphone className="h-6 w-6 text-[#004499]" />
            </div>
            <p className="font-bold text-slate-900">Send Link to Customer</p>
            <p className="text-xs text-slate-500 mt-1">Send AA consent link to registered mobile number</p>
          </button>
          <button onClick={startSelfVerify}
            className="p-6 bg-white border-2 border-slate-100 hover:border-emerald-400 hover:bg-emerald-50/30 rounded-xl transition-all text-left group">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Monitor className="h-6 w-6 text-emerald-600" />
            </div>
            <p className="font-bold text-slate-900">Self Banking Verification</p>
            <p className="text-xs text-slate-500 mt-1">Agent starts verification (opens new tab)</p>
          </button>
        </div>
      </div>
    );
  }

  // ── AA link sent to customer ───────────────────────────────────────────────
  if (phase === "link_sent") {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-6 animate-in fade-in duration-400">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
          <Smartphone className="w-10 h-10 text-[#004499]" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">AA Link Sent</h2>
        <p className="text-slate-500">The Account Aggregator link has been sent to the customer's registered mobile number. Ask the customer to complete the authorisation.</p>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700 font-medium">
          Sent to: <span className="font-mono">+91 98765 43210</span>
        </div>
        <Button onClick={startWaiting} className="bg-[#004499] hover:bg-[#003377] w-full h-11">
          Customer Has Authorised → Continue
        </Button>
      </div>
    );
  }

  // ── Self verification: new tab opened, waiting ─────────────────────────────
  if (phase === "self_waiting") {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-6 animate-in fade-in duration-400">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto">
          <Monitor className="w-10 h-10 text-amber-600 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Verification In Progress</h2>
        <p className="text-slate-500">Banking verification portal has been opened in a new tab. Complete the process there and return here.</p>
        <div className="max-w-xs mx-auto space-y-2">
          <Progress value={((10 - waitSeconds) / 10) * 100} className="h-2" />
          <p className="text-xs text-slate-400">{waitDone ? "Minimum wait complete." : `Minimum wait: ${waitSeconds}s remaining`}</p>
        </div>
        {waitDone && (
          <Button onClick={startWaiting} className="bg-[#004499] hover:bg-[#003377] w-full h-11">
            Verification Complete → Check Result
          </Button>
        )}
      </div>
    );
  }

  // ── Waiting for banking eligibility ───────────────────────────────────────
  if (phase === "waiting") {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-6 animate-in fade-in duration-400">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto">
          <Clock className="w-10 h-10 text-amber-600 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Waiting for Banking Eligibility…</h2>
        <p className="text-slate-500">Analysing the AA data and checking banking eligibility in real-time.</p>
        <div className="max-w-xs mx-auto space-y-2">
          <Progress value={((10 - waitSeconds) / 10) * 100} className="h-2" />
          <p className="text-xs text-slate-400">{waitDone ? "Analysis complete — simulate result below." : `Processing… ${waitSeconds}s`}</p>
        </div>
        {waitDone && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <p className="text-xs font-mono font-black text-slate-400 uppercase">UAT: Simulate Result</p>
            <div className="grid grid-cols-3 gap-2">
              <Button size="sm" variant="outline" onClick={() => simulateResult("success")} className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">Success</Button>
              <Button size="sm" variant="outline" onClick={() => simulateResult("error")} className="text-amber-600 border-amber-200 hover:bg-amber-50">Error</Button>
              <Button size="sm" variant="outline" onClick={() => simulateResult("rejected")} className="text-red-600 border-red-200 hover:bg-red-50">Reject</Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Error / retry ─────────────────────────────────────────────────────────
  if (phase === "error") {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-5 animate-in fade-in zoom-in-95 duration-400">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto">
          <RefreshCw className="h-10 w-10 text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold text-amber-800">Verification Failed</h2>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left space-y-2">
          <p className="text-sm font-bold text-amber-700">Error Details</p>
          <p className="text-sm text-amber-600">ERR_AA_TIMEOUT: Account Aggregator service did not respond within the expected timeframe.</p>
        </div>
        <p className="text-sm text-slate-500">Please try again or choose an alternate verification method.</p>
        <div className="flex gap-3 flex-col">
          <Button onClick={() => { setPhase("waiting"); setWaitSeconds(10); setWaitDone(false); }} className="bg-amber-600 hover:bg-amber-700 gap-2">
            <RefreshCw className="h-4 w-4" /> Retry Verification
          </Button>
          <Button variant="outline" onClick={() => setPhase("idle")}>Change Method</Button>
        </div>
      </div>
    );
  }

  // ── Rejection screen ───────────────────────────────────────────────────────
  if (phase === "rejected") {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-5 animate-in fade-in zoom-in-95 duration-400">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
          <XCircle className="h-10 w-10 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-red-800">AA Eligibility Failed</h2>
        <p className="text-slate-500">The Account Aggregator data does not meet the minimum eligibility criteria for this loan.</p>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-left space-y-2">
          <p className="text-xs font-bold text-red-700 uppercase tracking-wider">Rejection Reasons</p>
          <p className="text-sm text-red-600">• Insufficient banking turnover (&lt; ₹5L/month)</p>
          <p className="text-sm text-red-600">• High outward return cheque frequency</p>
          <p className="text-sm text-red-600">• Irregular cash flow pattern</p>
        </div>
        <Button variant="outline" onClick={() => window.location.href = "/dashboard"} className="w-full">Return to Dashboard</Button>
      </div>
    );
  }

  // ── Success: AA Offer screen (GST-style interactive offer) ────────────────
  if (phase === "success") {
    const emi = calcEMI(amount[0], tenure[0]);
    const pf = amount[0] * 0.02;
    const gst = pf * 0.18;
    const netDisburse = amount[0] - pf - gst - 500 - 3540;
    return (
      <div className="max-w-2xl mx-auto py-6 space-y-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black uppercase tracking-wider">Banking-Verified Offer</span>
          <h2 className="text-2xl font-bold text-slate-900">Actual Offer — Banking Verified!</h2>
          <p className="text-sm text-slate-500">Based on verified AA banking data — refined from pre-offer</p>
        </div>

        {/* Sliders */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-bold text-slate-700">Loan Amount</p>
              <div className="text-2xl font-black text-[#004499] bg-blue-50 px-4 py-1 rounded-lg">{fmt(amount[0])}</div>
            </div>
            <Slider value={amount} onValueChange={setAmount} min={500000} max={1000000} step={10000} className="py-2" />
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
              <span>₹5,00,000</span><span>₹10,00,000</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-bold text-slate-700">Tenure</p>
              <div className="text-2xl font-black text-[#004499] bg-blue-50 px-4 py-1 rounded-lg">{tenure[0]} Months</div>
            </div>
            <Slider value={tenure} onValueChange={setTenure} min={12} max={60} step={6} className="py-2" />
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
              <span>12 Months</span><span>60 Months</span>
            </div>
          </div>

          {/* Financial breakdown */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            {[
              { label: "Processing Fee (2%)", value: fmt(pf) },
              { label: "GST (18% on PF)", value: fmt(gst) },
              { label: "Stamp Duty", value: "₹500" },
              { label: "Doc Charges", value: "₹3,540" },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                <p className="text-sm font-bold text-slate-700">{value}</p>
              </div>
            ))}
          </div>

          <div className="bg-emerald-50 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Net Disbursement</p>
              <p className="text-[10px] text-emerald-600 italic">Amount to bank account</p>
            </div>
            <p className="text-2xl font-black text-emerald-800">{fmt(netDisburse)}</p>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500">Monthly EMI</p>
              <p className="text-xs text-slate-400">@ 18% Fixed p.a.</p>
            </div>
            <p className="text-3xl font-black text-slate-900">{fmt(emi)}<span className="text-xs font-medium text-slate-400 ml-1">/mo</span></p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button onClick={() => onComplete("accepted")} className="h-12 bg-[#004499] hover:bg-[#003377] font-bold text-base gap-2">
            Accept Offer <ArrowRight className="h-5 w-5" />
          </Button>
          <Button onClick={() => onComplete("want_more")} variant="outline" className="h-12 border-2 border-[#004499] text-[#004499] hover:bg-blue-50 font-bold gap-2">
            <TrendingUp className="h-4 w-4" /> Want More
          </Button>
        </div>
        <p className="text-xs text-center text-slate-400">"Want More" will explore GST-based income for a higher offer</p>
      </div>
    );
  }

  return null;
}
