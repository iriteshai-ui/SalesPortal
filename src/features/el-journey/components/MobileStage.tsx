import React from "react";
import { GraduationCap, Smartphone, ChevronRight, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils";

interface MobileStageProps {
  mobile: string;
  setMobile: (val: string) => void;
  mobileError: string;
  onSubmit: () => void;
}

export const MobileStage: React.FC<MobileStageProps> = ({
  mobile,
  setMobile,
  mobileError,
  onSubmit,
}) => {
  return (
    <div className="p-12 max-w-lg mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
          <GraduationCap className="text-[#004499] h-8 w-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Start Application</h2>
        <p className="text-slate-500 text-sm font-medium">
          Enter the student's mobile number to begin the education loan journey.
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Mobile Number
          </Label>
          <div className="relative">
            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
            <Input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter 10 digit number"
              className={cn(
                "pl-10 text-lg h-14 font-black tracking-widest bg-slate-50 border-slate-200 focus:bg-white transition-all",
                mobileError && "border-rose-500 bg-rose-50"
              )}
              maxLength={10}
            />
          </div>
          {mobileError && (
            <p className="text-rose-500 text-xs font-bold flex items-center gap-1">
              <XCircle className="h-3 w-3" /> {mobileError}
            </p>
          )}
        </div>
        <Button
          onClick={onSubmit}
          disabled={!/^[6-9]\d{9}$/.test(mobile.trim())}
          className="w-full h-14 bg-[#004499] hover:bg-[#003377] text-lg font-black uppercase tracking-widest shadow-xl shadow-blue-100 group disabled:opacity-50"
        >
          Continue
          <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};
