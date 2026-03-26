import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, ArrowRight } from "lucide-react";

interface Props { onComplete: (approved: boolean) => void; }

export default function Stage9KycStatus({ onComplete }: Props) {
  const [simulating, setSimulating] = useState(false);
  const [result, setResult] = useState<"approved" | "failed" | null>(null);

  const simulate = (res: "approved" | "failed") => {
    setSimulating(true);
    setTimeout(() => { setSimulating(false); setResult(res); }, 2000);
  };

  if (simulating) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 animate-in fade-in duration-300">
        <Loader2 className="h-12 w-12 text-[#004499] animate-spin" />
        <p className="font-semibold text-slate-700">Processing KYC…</p>
        <p className="text-sm text-slate-400">Verifying identity documents with bureau</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-6 animate-in fade-in duration-400">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 text-[#004499]" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">KYC Status</h2>
        <p className="text-slate-500">KYC link has been sent to the customer. Simulate the outcome below for UAT.</p>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
          <p className="text-xs font-mono font-black text-slate-400 uppercase">UAT: Simulate KYC Result</p>
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={() => simulate("approved")} className="bg-emerald-600 hover:bg-emerald-700 gap-2">
              <CheckCircle2 className="h-4 w-4" /> KYC Approved
            </Button>
            <Button variant="outline" onClick={() => simulate("failed")} className="text-red-600 border-red-200 hover:bg-red-50 gap-2">
              <XCircle className="h-4 w-4" /> KYC Failed
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-12 text-center space-y-6 animate-in fade-in zoom-in-95 duration-400">
      <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto ${result === "approved" ? "bg-emerald-100" : "bg-red-100"}`}>
        {result === "approved"
          ? <CheckCircle2 className="h-12 w-12 text-emerald-600" />
          : <XCircle className="h-12 w-12 text-red-600" />}
      </div>
      <h2 className={`text-2xl font-bold ${result === "approved" ? "text-emerald-800" : "text-red-800"}`}>
        {result === "approved" ? "KYC Approved" : "KYC Failed"}
      </h2>
      <div className={`border rounded-xl p-4 text-sm text-left space-y-2 ${result === "approved" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"}`}>
        {result === "approved" ? (
          <>
            <p className="font-bold">✓ Identity Verified</p>
            <p>✓ Aadhaar matched with PAN</p>
            <p>✓ Liveness check passed</p>
            <p>✓ Document authenticity confirmed</p>
          </>
        ) : (
          <>
            <p className="font-bold">✗ KYC Verification Failed</p>
            <p>✗ Liveness check failed (max attempts exceeded)</p>
            <p>✗ Document image quality insufficient</p>
          </>
        )}
      </div>
      {result === "approved" ? (
        <Button onClick={() => onComplete(true)} className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 gap-2">
          Continue to Field Investigation <ArrowRight className="h-4 w-4" />
        </Button>
      ) : (
        <div className="space-y-2">
          <Button variant="outline" onClick={() => setResult(null)} className="w-full">Retry KYC</Button>
          <Button variant="ghost" onClick={() => window.location.href = "/dashboard"} className="w-full text-slate-400">Return to Dashboard</Button>
        </div>
      )}
    </div>
  );
}
