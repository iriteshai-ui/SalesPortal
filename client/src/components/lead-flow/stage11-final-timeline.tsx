import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Send, FileText, IndianRupee, Fingerprint, CreditCard, PenLine } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

interface Props { onComplete: () => void; }

const STEPS = [
  { id: "offer", label: "Final Offer Summary", desc: "Customer reviews and accepts the final loan offer terms", icon: <IndianRupee className="h-5 w-5" /> },
  { id: "kfs", label: "KFS", desc: "Key Fact Statement signed by customer", icon: <FileText className="h-5 w-5" /> },
  { id: "pennydrop", label: "Penny Drop Verification", desc: "₹1 test credit to verify bank account", icon: <CreditCard className="h-5 w-5" /> },
  { id: "enach", label: "eNACH", desc: "Electronic NACH mandate registered for EMI deduction", icon: <Fingerprint className="h-5 w-5" /> },
  { id: "esign", label: "eSign", desc: "Digital signature on loan agreement", icon: <PenLine className="h-5 w-5" /> },
];

export default function Stage11FinalTimeline({ onComplete }: Props) {
  const { toast } = useToast();
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [linkSent, setLinkSent] = useState(false);

  const toggle = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const allDone = STEPS.every((s) => completed.has(s.id));

  const sendLink = () => {
    setLinkSent(true);
    toast({ title: "Link Sent", description: "Final offer link sent to customer's mobile." });
  };

  const handleComplete = () => {
    if (!allDone) { toast({ variant: "destructive", title: "Complete all steps first" }); return; }
    confetti({ particleCount: 300, spread: 120, origin: { y: 0.3 }, colors: ["#004499", "#10b981", "#fbbf24", "#f43f5e"] });
    toast({ title: "🎉 Application Complete!", description: "Business Loan journey completed successfully." });
    setTimeout(onComplete, 1800);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in duration-400">
      <div className="border-l-4 border-[#004499] pl-4 py-1 bg-blue-50/50 rounded-r-md">
        <h3 className="text-lg font-semibold text-slate-900">Final Offer Stage</h3>
        <p className="text-sm text-slate-500">Mark each step as completed to finish the journey.</p>
      </div>

      {/* Send Link CTA */}
      <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-4">
        <div>
          <p className="font-bold text-slate-800 text-sm">Send Final Offer Link</p>
          <p className="text-xs text-slate-500">Send all signing links to the customer's mobile</p>
        </div>
        <Button onClick={sendLink} size="sm" className={`gap-1.5 ${linkSent ? "bg-emerald-600 hover:bg-emerald-700" : "bg-[#004499] hover:bg-[#003377]"}`}>
          {linkSent ? <><CheckCircle2 className="h-4 w-4" /> Sent</> : <><Send className="h-4 w-4" /> Send Link</>}
        </Button>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200" />
        <div className="space-y-3">
          {STEPS.map((step, idx) => {
            const done = completed.has(step.id);
            const prevDone = idx === 0 || completed.has(STEPS[idx - 1].id);
            return (
              <div key={step.id} className={`relative flex items-start gap-4 bg-white border-2 rounded-xl p-4 transition-all cursor-pointer
                ${done ? "border-emerald-300 bg-emerald-50/50" : prevDone ? "border-slate-200 hover:border-[#004499]/30 hover:bg-blue-50/20" : "border-slate-100 opacity-60 cursor-not-allowed"}`}
                onClick={() => prevDone && toggle(step.id)}>
                {/* Timeline dot */}
                <div className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                  ${done ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-slate-300 text-slate-400"}`}>
                  {done ? <CheckCircle2 className="h-5 w-5" /> : step.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`font-bold text-sm ${done ? "text-emerald-800" : "text-slate-900"}`}>{step.label}</p>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${done ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                      {done ? "Completed" : "Pending"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
        <p className="text-sm font-bold text-slate-700">Progress</p>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {STEPS.map((s) => (
              <div key={s.id} className={`w-6 h-2 rounded-full transition-all ${completed.has(s.id) ? "bg-emerald-500" : "bg-slate-200"}`} />
            ))}
          </div>
          <p className="text-sm font-black text-slate-700">{completed.size}/{STEPS.length}</p>
        </div>
      </div>

      <Button onClick={handleComplete} disabled={!allDone} className="w-full h-12 bg-[#004499] hover:bg-[#003377] font-bold text-base disabled:opacity-40 gap-2">
        <CheckCircle2 className="h-5 w-5" /> Complete Application
      </Button>
    </div>
  );
}
