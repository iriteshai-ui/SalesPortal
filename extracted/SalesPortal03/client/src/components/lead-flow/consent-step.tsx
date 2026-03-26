import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Smartphone, Timer, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ConsentStepProps {
  onConsentApproved: () => void;
  onConsentRejected: () => void;
  mobileNumber: string;
}

export default function ConsentStep({ onConsentApproved, onConsentRejected, mobileNumber }: ConsentStepProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "waiting" | "approved" | "rejected">("idle");
  const [timeLeft, setTimeLeft] = useState(30);

  const sendLink = () => {
    setStatus("sending");
    setTimeout(() => {
      setStatus("waiting");
      setTimeLeft(30);
    }, 1500);
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === "waiting" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, timeLeft]);

  // Simulate External Action
  const simulateCustomerAction = (action: "approve" | "reject") => {
    if (action === "approve") {
      setStatus("approved");
      setTimeout(onConsentApproved, 1500);
    } else {
      setStatus("rejected");
      // setTimeout(onConsentRejected, 1500);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 text-center animate-in zoom-in-95 duration-500">
      
      {status === "idle" && (
        <div className="space-y-6">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Smartphone className="w-10 h-10 text-[#004499]" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Request CIBIL Consent</h2>
          <p className="text-slate-500 max-w-sm mx-auto">
            We need to fetch the customer's credit report. An SMS with a consent link will be sent to <b>+91 {mobileNumber}</b>.
          </p>
          <Button onClick={sendLink} size="lg" className="bg-[#004499] hover:bg-[#003377] w-full max-w-xs">
            Send Consent Link
          </Button>
        </div>
      )}

      {(status === "sending" || status === "waiting") && (
        <div className="space-y-6">
           <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <Timer className="w-10 h-10 text-amber-600 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Waiting for Customer...</h2>
          <p className="text-slate-500">
            Link sent to <b>+91 {mobileNumber}</b>. Please ask the customer to click the link and approve.
          </p>
          
          <div className="max-w-xs mx-auto space-y-2">
            <Progress value={((30 - timeLeft) / 30) * 100} className="h-2" />
            <p className="text-xs text-slate-400">Time remaining: {timeLeft}s</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 mt-8">
            <p className="text-xs font-mono text-slate-400 mb-2">DEBUG: SIMULATE CUSTOMER ACTION</p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" size="sm" onClick={() => simulateCustomerAction("approve")} className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                Simulate Approve
              </Button>
              <Button variant="outline" size="sm" onClick={() => simulateCustomerAction("reject")} className="text-red-600 border-red-200 hover:bg-red-50">
                Simulate Reject
              </Button>
            </div>
          </div>
        </div>
      )}

      {status === "approved" && (
        <div className="space-y-6">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-emerald-700">Consent Approved</h2>
          <p className="text-emerald-600">Fetching Bureau Data...</p>
        </div>
      )}

      {status === "rejected" && (
        <div className="space-y-6">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-red-700">Consent Rejected</h2>
          <p className="text-slate-500">The customer denied permission. Journey cannot proceed.</p>
          <Button variant="outline" onClick={() => setStatus("idle")}>Retry Request</Button>
        </div>
      )}

    </div>
  );
}
