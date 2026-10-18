"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, MapPin, User, Phone, ArrowRight, Loader2 } from "lucide-react";

interface Props { onComplete: () => void; }

export default function Stage10FieldInvestigation({ onComplete }: Props) {
  const [fiStatus, setFiStatus] = useState<"pending" | "in_progress" | "completed" | "failed" | null>(null);
  const [loading, setLoading] = useState(false);

  const simulate = (status: "completed" | "failed") => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setFiStatus(status); }, 2500);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="h-12 w-12 text-[#004499] animate-spin" />
        <p className="font-semibold text-slate-700">Updating FI Status…</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in duration-400">
      <div className="border-l-4 border-[#004499] pl-4 py-1 bg-blue-50/50 rounded-r-md">
        <h3 className="text-lg font-semibold text-slate-900">Field Investigation (FI)</h3>
        <p className="text-sm text-slate-500">Physical verification of customer's business and residence address.</p>
      </div>

      {/* FI details card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">FI Assignment</p>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: <User className="h-4 w-4 text-slate-400" />, label: "FI Agent", value: "Mahesh Rathore" },
            { icon: <Phone className="h-4 w-4 text-slate-400" />, label: "Agent Mobile", value: "+91 98112 33445" },
            { icon: <MapPin className="h-4 w-4 text-slate-400" />, label: "Location", value: "Mumbai – BKC Zone" },
            { icon: <Clock className="h-4 w-4 text-slate-400" />, label: "Scheduled", value: "Tomorrow, 11:00 AM" },
          ].map(({ icon, label, value }) => (
            <div key={label} className="flex items-start gap-2">
              {icon}
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                <p className="text-sm font-semibold text-slate-700">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status display */}
      {fiStatus === "completed" && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-2 animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <p className="font-bold text-emerald-800">FI Completed Successfully</p>
          </div>
          <p className="text-sm text-emerald-700">✓ Business address verified — active trading premises confirmed</p>
          <p className="text-sm text-emerald-700">✓ Residence address confirmed</p>
          <p className="text-sm text-emerald-700">✓ Business vintage ≥ 3 years verified on-site</p>
        </div>
      )}

      {fiStatus === "failed" && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 space-y-2 animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-red-600" />
            <p className="font-bold text-red-800">FI Failed</p>
          </div>
          <p className="text-sm text-red-700">✗ Customer/business not found at stated address</p>
          <p className="text-sm text-red-700">✗ Premises locked during visit; neighbours unaware</p>
        </div>
      )}

      {/* Simulate */}
      {!fiStatus && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
          <p className="text-xs font-mono font-black text-slate-400 uppercase">UAT: Simulate FI Result</p>
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={() => simulate("completed")} className="bg-emerald-600 hover:bg-emerald-700 gap-2">
              <CheckCircle2 className="h-4 w-4" /> FI Completed
            </Button>
            <Button variant="outline" onClick={() => simulate("failed")} className="text-red-600 border-red-200 hover:bg-red-50 gap-2">
              FI Failed
            </Button>
          </div>
        </div>
      )}

      {fiStatus === "completed" && (
        <Button onClick={onComplete} className="w-full h-11 bg-[#004499] hover:bg-[#003377] gap-2">
          Continue to Final Offer <ArrowRight className="h-4 w-4" />
        </Button>
      )}
      {fiStatus === "failed" && (
        <Button variant="outline" onClick={() => window.location.href = "/dashboard"} className="w-full">Return to Dashboard</Button>
      )}
    </div>
  );
}
