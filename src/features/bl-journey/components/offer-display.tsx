"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { PartyPopper, ExternalLink, Calculator, Calendar, Banknote, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";

interface OfferDisplayProps {
  onComplete: (requiresBrp: boolean) => void;
}

export default function OfferDisplay({ onComplete }: OfferDisplayProps) {
  const [amount, setAmount] = useState([7600000]);
  const [tenure, setTenure] = useState([12]);
  const [showFinalOffer, setShowFinalOffer] = useState(false);
  const [breFlag, setBreFlag] = useState(true);
  const [maxEmi, setMaxEmi] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const calculateEMI = (p: number, n: number) => {
    const r = 20 / 12 / 100; // 20% annual interest as per prompt example
    const emi = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    return Math.round(emi);
  };

  useEffect(() => {
    const initialEmi = calculateEMI(7600000, 12);
    setMaxEmi(initialEmi);
  }, []);

  const processingFee = amount[0] * 0.02;
  const gst = processingFee * 0.18;
  const stampDuty = 500;
  const docCharges = 3540;
  const finalDisbursement = amount[0] - (processingFee + gst + stampDuty + docCharges);
  const currentEmi = calculateEMI(amount[0], tenure[0]);

  const handleAmountChange = (val: number[]) => {
    const nextEmi = calculateEMI(val[0], tenure[0]);
    if (nextEmi > maxEmi) {
      setError(`EMI amount can't exceed ${formatCurrency(maxEmi)}`);
    } else {
      setError(null);
      setAmount(val);
    }
  };

  const handleTenureChange = (val: number[]) => {
    const nextEmi = calculateEMI(amount[0], val[0]);
    if (nextEmi > maxEmi) {
      setError(`EMI amount can't exceed ${formatCurrency(maxEmi)}`);
    } else {
      setError(null);
      setTenure(val);
    }
  };

  const handleGenerateOffer = () => {
    setShowFinalOffer(true);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0 }, // Top of screen
      colors: ['#004499', '#fbbf24', '#10b981']
    });
  };

  if (showFinalOffer) {
    return (
      <div className="max-w-3xl mx-auto py-8 animate-in zoom-in-95 duration-700">
        <Card className="border-0 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-emerald-500" />
          
          <CardHeader className="text-center pt-12 pb-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PartyPopper className="text-emerald-600 h-8 w-8" />
            </div>
            <h2 className="text-3xl font-heading font-bold text-slate-900">Offer Generated!</h2>
            <p className="text-slate-500 mt-2">Your customized loan offer is ready for acceptance.</p>
          </CardHeader>

          <CardContent className="text-center pb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Loan Amount</p>
                <div className="text-2xl font-bold text-[#004499]">{formatCurrency(amount[0])}</div>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Tenure</p>
                <div className="text-2xl font-bold text-[#004499]">{tenure[0]} Months</div>
              </div>
            </div>

            <div className="py-8 mb-8 bg-emerald-50 rounded-2xl border border-emerald-100">
              <p className="text-sm font-semibold text-emerald-700 uppercase tracking-widest mb-2">Estimated Monthly EMI</p>
              <div className="text-5xl font-bold text-emerald-800">
                {formatCurrency(calculateEMI(amount[0], tenure[0]))}
              </div>
              <p className="text-xs text-emerald-600 mt-4 font-medium">Interest Rate: 12% p.a. (Fixed)</p>
            </div>

            <div className="space-y-4">
               <div className="flex items-center justify-center gap-2 mb-6">
                <label className="text-[10px] text-slate-400 font-mono uppercase">Internal: BRP Requirement Toggle</label>
                <Button variant="outline" size="sm" onClick={() => setBreFlag(!breFlag)} className="h-5 text-[10px] px-2">
                  {breFlag ? 'BRP: YES' : 'BRP: NO'}
                </Button>
              </div>

              <Button 
                onClick={() => onComplete(breFlag)}
                className="h-12 px-8 text-lg bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200"
              >
                {breFlag ? 'Accept & Continue to BRP' : 'Accept & Complete'}
                <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="border-0 shadow-xl overflow-hidden">
        <CardHeader className="bg-[#004499] text-white p-8">
          <h2 className="text-2xl font-heading font-bold">Configure Loan Offer</h2>
          <p className="text-blue-100 text-sm mt-1">Adjust the sliders to find the perfect plan for the customer.</p>
        </CardHeader>
        
        <CardContent className="p-8 space-y-12">
          {/* Loan Amount Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Banknote className="h-5 w-5 text-[#004499]" />
                <label className="font-bold text-slate-700">Loan Amount</label>
              </div>
              <div className="text-2xl font-black text-[#004499] bg-blue-50 px-4 py-1 rounded-lg border border-blue-100">
                {formatCurrency(amount[0])}
              </div>
            </div>
            <Slider
              value={amount}
              onValueChange={handleAmountChange}
              min={100000}
              max={10000000}
              step={10000}
              className="py-4"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              <span>Min: ₹1,00,000</span>
              <span>Max: ₹1,00,00,000</span>
            </div>
          </div>

          {/* Tenure Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#004499]" />
                <label className="font-bold text-slate-700">Loan Tenure</label>
              </div>
              <div className="text-2xl font-black text-[#004499] bg-blue-50 px-4 py-1 rounded-lg border border-blue-100">
                {tenure[0]} <span className="text-sm font-medium">Months</span>
              </div>
            </div>
            <Slider
              value={tenure}
              onValueChange={handleTenureChange}
              min={12}
              max={60}
              step={6}
              className="py-4"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              <span>12 Months</span>
              <span>60 Months (6m Steps)</span>
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="h-5 w-5 text-rose-600" />
              <p className="text-sm font-bold text-rose-700">{error}</p>
            </div>
          )}

          {/* Real-time Fees Preview */}
          <div className="pt-6 border-t border-slate-100 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-100 space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Processing Fee (2%)</p>
                <p className="text-sm font-bold text-slate-700">{formatCurrency(processingFee)}</p>
              </div>
              <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-100 space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">GST (18% on PF)</p>
                <p className="text-sm font-bold text-slate-700">{formatCurrency(gst)}</p>
              </div>
              <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-100 space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stamp Duty</p>
                <p className="text-sm font-bold text-slate-700">{formatCurrency(stampDuty)}</p>
              </div>
              <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-100 space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Doc Charges</p>
                <p className="text-sm font-bold text-slate-700">{formatCurrency(docCharges)}</p>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Final Disbursement</p>
                <p className="text-[10px] text-emerald-600 italic">Net amount to bank account</p>
              </div>
              <div className="text-2xl font-black text-emerald-800">
                {formatCurrency(finalDisbursement)}
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Calculator className="h-5 w-5 text-[#004499]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Estimated EMI</p>
                  <p className="text-xs text-slate-400 italic">@ 12% Fixed Interest</p>
                </div>
              </div>
              <div className="text-3xl font-black text-slate-900">
                {formatCurrency(currentEmi)}
                <span className="text-xs font-medium text-slate-400 ml-1">/mo</span>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleGenerateOffer}
            disabled={!!error}
            className="w-full h-14 bg-[#004499] hover:bg-[#003377] text-lg font-bold shadow-lg shadow-blue-100 group transition-all"
          >
            Generate Offer
            <PartyPopper className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
