"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Loader2, TrendingUp, XCircle, ArrowRight, CheckCircle2, Calculator, Banknote, CalendarIcon, Clock } from "lucide-react";
import confetti from "canvas-confetti";

interface Props { onComplete: () => void; }
const fmt = (v: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);
const calcEMI = (p: number, n: number) => { const r = 18 / 12 / 100; return Math.round(p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)); };

export default function Stage7GstOffer({ onComplete }: Props) {
  const [phase, setPhase] = useState<"sending" | "freeze" | "found" | "reject" | "offer">("sending");
  const [countdown, setCountdown] = useState(10);
  const [amount, setAmount] = useState([900000]);
  const [tenure, setTenure] = useState([36]);

  useEffect(() => {
    if (phase === "sending") { const t = setTimeout(() => { setPhase("freeze"); setCountdown(10); }, 1500); return () => clearTimeout(t); }
    if (phase === "freeze") {
      if (countdown <= 0) return;
      const t = setTimeout(() => setCountdown((p) => p - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [phase, countdown]);

  const showResult = (r: "found" | "reject") => {
    setPhase(r);
    if (r === "found") confetti({ particleCount: 120, spread: 70, origin: { y: 0.4 }, colors: ["#004499", "#10b981", "#fbbf24"] });
  };

  // Sending link
  if (phase === "sending") {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 animate-in fade-in duration-400">
        <Loader2 className="h-12 w-12 text-[#004499] animate-spin" />
        <p className="font-semibold text-slate-700">Sending GST verification link to customer…</p>
      </div>
    );
  }

  // Freeze: AA offer locked for 10s while GST checked
  if (phase === "freeze") {
    const freezeDone = countdown === 0;
    return (
      <div className="max-w-lg mx-auto py-8 space-y-6 text-center animate-in fade-in duration-400">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
          <TrendingUp className="w-10 h-10 text-[#004499] animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Loading GST Simulator…</h2>
        <p className="text-slate-500">Checking best offer based on GST income (up to ₹7–10 Lakhs). AA/Banking offer is frozen during this analysis.</p>
        <div className="bg-slate-100 rounded-xl p-4 space-y-2">
          <p className="text-xs text-slate-500 font-mono uppercase font-bold">AA Offer Frozen</p>
          <p className="text-2xl font-black text-slate-400">₹8,50,000</p>
          <div className="flex gap-1 justify-center">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className={`h-2 w-5 rounded-full transition-all duration-500 ${i < (10 - countdown) ? "bg-[#004499]" : "bg-slate-300"}`} />
            ))}
          </div>
          <p className="text-xs text-slate-400">{freezeDone ? "Analysis complete" : `Freeze: ${countdown}s remaining`}</p>
        </div>
        {freezeDone && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <p className="text-xs font-mono font-black text-slate-400 uppercase">UAT: Simulate GST Result</p>
            <div className="flex gap-3 justify-center">
              <Button size="sm" onClick={() => showResult("found")} className="bg-emerald-600 hover:bg-emerald-700 gap-1"><CheckCircle2 className="h-4 w-4" /> Offer Found</Button>
              <Button size="sm" variant="outline" onClick={() => showResult("reject")} className="text-red-600 border-red-200 hover:bg-red-50 gap-1"><XCircle className="h-4 w-4" /> Reject</Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Rejection
  if (phase === "reject") {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-5 animate-in fade-in duration-400">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
          <XCircle className="h-10 w-10 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-red-800">GST Offer Not Available</h2>
        <p className="text-slate-500">GST income does not qualify for a higher offer. We'll proceed with the AA-verified offer of ₹8,50,000.</p>
        <Button onClick={onComplete} className="bg-[#004499] hover:bg-[#003377] w-full h-11 gap-2">
          Continue with AA Offer <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  // Offer found — show GST offer screen
  if (phase === "found" || phase === "offer") {
    const emi = calcEMI(amount[0], tenure[0]);
    const pf = amount[0] * 0.02;
    const gst = pf * 0.18;
    const netDisburse = amount[0] - pf - gst - 500 - 3540;
    return (
      <div className="max-w-2xl mx-auto py-6 space-y-6 animate-in fade-in duration-400">
        <div className="text-center space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black uppercase tracking-wider">GST-Based Offer</span>
          <h2 className="text-2xl font-bold text-slate-900">Enhanced Offer Found!</h2>
          <p className="text-sm text-slate-500">Based on GST income analysis — higher than AA offer</p>
        </div>
        {/* Sliders */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-bold text-slate-700">Loan Amount</p>
              <div className="text-2xl font-black text-[#004499] bg-blue-50 px-4 py-1 rounded-lg">{fmt(amount[0])}</div>
            </div>
            <Slider value={amount} onValueChange={setAmount} min={700000} max={1000000} step={10000} className="py-2" />
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
              <span>₹7,00,000</span><span>₹10,00,000</span>
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
              <p className="text-xs text-slate-400">@ 18% p.a.</p>
            </div>
            <p className="text-3xl font-black text-slate-900">{fmt(emi)}<span className="text-xs font-medium text-slate-400 ml-1">/mo</span></p>
          </div>
        </div>
        <Button onClick={onComplete} className="w-full h-12 bg-[#004499] hover:bg-[#003377] font-bold text-base gap-2">
          Accept GST Offer <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return null;
}
