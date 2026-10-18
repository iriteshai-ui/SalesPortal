"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Send,
  FileText,
  IndianRupee,
  CreditCard,
  Fingerprint,
  PenLine,
  Zap,
} from "lucide-react";
import { useToast } from "@/hooks/useToast";
import confetti from "canvas-confetti";
import { cn } from "@/utils";

interface Props {
  customerMobile?: string;
  customerName?: string;
  onComplete: () => void;
  onUpdateInsightBackend?: (activity: string, secondsLeft: number) => void;
  fastForwardTrigger?: number;
}

interface TimelineStep {
  id: string;
  label: string;
  desc: string;
  icon: React.ReactNode;
}

const DEFAULT_STEPS: TimelineStep[] = [
  {
    id: "offer",
    label: "Final Offer Summary",
    desc: "Customer reviews and accepts the final loan offer terms",
    icon: <IndianRupee className="h-5 w-5" />,
  },
  {
    id: "kfs",
    label: "KFS",
    desc: "Key Fact Statement signed by customer",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    id: "pennydrop",
    label: "Penny Drop Verification",
    desc: "₹1 test credit to verify bank account",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    id: "enach",
    label: "eNACH",
    desc: "Electronic NACH mandate registered for EMI deduction",
    icon: <Fingerprint className="h-5 w-5" />,
  },
  {
    id: "esign",
    label: "eSign",
    desc: "Digital signature on loan agreement",
    icon: <PenLine className="h-5 w-5" />,
  },
];

export default function Stage9CustomerTimeline({
  customerMobile = "9820012345",
  customerName = "Aarav Sharma",
  onComplete,
}: Props) {
  const { toast } = useToast();
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [linkSent, setLinkSent] = useState<boolean>(false);

  const currentSteps = DEFAULT_STEPS;
  const allDone = currentSteps.length > 0 && currentSteps.every((s) => completed.has(s.id));

  // Toggle step completion on tile click (exact BL functionality)
  const toggle = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleCompleteAll = () => {
    setCompleted(new Set(currentSteps.map((s) => s.id)));
    toast({
      title: "All Steps Completed",
      description: "All customer timeline milestones marked as completed.",
    });
  };

  const sendLink = () => {
    setLinkSent(true);
    toast({
      title: "Link Sent",
      description: `Final offer and signing links dispatched to customer mobile +91 ${customerMobile}.`,
    });
  };

  const handleComplete = () => {
    if (!allDone) {
      toast({
        variant: "destructive",
        title: "Incomplete Timeline",
        description: "Please complete all milestones before finishing the journey.",
      });
      return;
    }

    confetti({
      particleCount: 300,
      spread: 120,
      origin: { y: 0.3 },
      colors: ["#004499", "#10b981", "#fbbf24", "#f43f5e"],
    });

    toast({
      title: "🎉 Application Complete!",
      description: "Education Loan timeline milestones completed successfully.",
    });

    setTimeout(onComplete, 1800);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in duration-400">
      {/* ── Header Banner (Exact BL Style) ── */}
      <div className="border-l-4 border-[#004499] pl-4 py-1 bg-blue-50/50 rounded-r-md">
        <h3 className="text-lg font-semibold text-slate-900">Final Offer Stage</h3>
        <p className="text-sm text-slate-500">
          Mark each step as completed to finish the journey for{" "}
          <span className="font-semibold text-slate-800">{customerName}</span>.
        </p>
      </div>

      {/* ── Send Final Offer Link CTA (Exact BL Style) ── */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div>
          <p className="font-bold text-slate-800 text-sm">Send Final Offer Link</p>
          <p className="text-xs text-slate-500">
            Send all signing links to the customer's mobile (+91 {customerMobile})
          </p>
        </div>
        <Button
          onClick={sendLink}
          size="sm"
          className={cn(
            "gap-1.5 font-bold text-xs uppercase tracking-wider h-9 px-4 shrink-0",
            linkSent
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : "bg-[#004499] hover:bg-[#003377] text-white"
          )}
        >
          {linkSent ? (
            <>
              <CheckCircle2 className="h-4 w-4" /> Sent
            </>
          ) : (
            <>
              <Send className="h-4 w-4" /> Send Link
            </>
          )}
        </Button>
      </div>

      {/* ── Timeline Tiles (Exact BL Journey Tile Line & Connecting Line) ── */}
      <div className="relative">
        {/* Continuous Connecting Vertical Line */}
        <div className="absolute left-9 top-0 bottom-0 w-0.5 bg-slate-200 z-0" />

        <div className="space-y-3 relative z-10">
          {currentSteps.map((step, idx) => {
            const done = completed.has(step.id);
            const prevDone = idx === 0 || completed.has(currentSteps[idx - 1].id);

            return (
              <div
                key={step.id}
                onClick={() => toggle(step.id)}
                className={cn(
                  "relative flex items-start gap-4 bg-white border-2 rounded-xl p-4 transition-all cursor-pointer select-none",
                  done
                    ? "border-emerald-300 bg-emerald-50/50 shadow-xs"
                    : "border-slate-200 hover:border-[#004499]/30 hover:bg-blue-50/20 shadow-xs"
                )}
              >
                {/* Timeline Icon Node */}
                <div
                  className={cn(
                    "relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all shadow-xs",
                    done
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "bg-white border-slate-300 text-slate-400"
                  )}
                >
                  {done ? <CheckCircle2 className="h-5 w-5 stroke-[2.5]" /> : step.icon}
                </div>

                {/* Tile Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={cn(
                        "font-bold text-sm",
                        done ? "text-emerald-800" : "text-slate-900"
                      )}
                    >
                      {step.label}
                    </p>

                    {/* Status Badge */}
                    <span
                      className={cn(
                        "text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full",
                        done
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      )}
                    >
                      {done ? "Completed" : "Pending"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Progress Card (Exact BL Style with Dash Pill Bars) ── */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <p className="text-sm font-bold text-slate-700">Progress</p>
          <button
            type="button"
            onClick={handleCompleteAll}
            className="text-[10px] font-bold text-[#004499] hover:underline flex items-center gap-1"
          >
            <Zap className="h-3 w-3 text-amber-500 fill-amber-500" /> Complete All
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Dash Pill Indicators */}
          <div className="flex gap-1">
            {currentSteps.map((s) => (
              <div
                key={s.id}
                className={cn(
                  "w-6 h-2 rounded-full transition-all",
                  completed.has(s.id) ? "bg-emerald-500" : "bg-slate-200"
                )}
              />
            ))}
          </div>

          <p className="text-sm font-black text-slate-700 font-mono ml-1">
            {completed.size}/{currentSteps.length}
          </p>
        </div>
      </div>

      {/* ── Complete Application CTA (Exact BL Style) ── */}
      <Button
        onClick={handleComplete}
        disabled={!allDone}
        className={cn(
          "w-full h-12 font-bold text-base gap-2 rounded-xl transition-all shadow-md",
          allDone
            ? "bg-[#004499] hover:bg-[#003377] text-white cursor-pointer"
            : "bg-slate-300 text-slate-500 cursor-not-allowed opacity-50"
        )}
      >
        <CheckCircle2 className="h-5 w-5" /> Complete Application
      </Button>
    </div>
  );
}
