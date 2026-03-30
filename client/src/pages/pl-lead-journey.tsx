import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Smartphone, 
  Loader2, 
  XCircle, 
  Clock, 
  CheckCircle2, 
  CreditCard, 
  Mail, 
  User as UserIcon, 
  Calendar as CalendarIcon, 
  Briefcase, 
  Building2, 
  MapPin, 
  AlertCircle,
  ChevronRight,
  ExternalLink,
  PartyPopper,
  Calculator,
  Banknote
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

type JourneyStage = "basic" | "loader" | "status" | "reject" | "wip" | "new_form" | "submitting" | "consent" | "consent_approved" | "offer" | "offer_rejected" | "bank_verification" | "bank_initiate";

const steps = [
  { id: 1, title: "Basic Details" },
  { id: 2, title: "Consent" },
  { id: 3, title: "Offer" },
  { id: 4, title: "Bank Verification" },
];

export default function PlLeadJourneyPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [stage, setStage] = useState<JourneyStage>("basic");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [randomDays, setRandomDays] = useState(0);
  const [emiError, setEmiError] = useState<string | null>(null);
  const [maxEmi, setMaxEmi] = useState(0);
  const [formData, setFormData] = useState<any>({
    pan: "ABCDE1234F",
    name: "Vikram Malhotra",
    dob: new Date("1990-05-20"),
    email: "vikram@example.com",
    gender: "Male",
    employment: "salaried",
    company: "Tech Global Solutions",
    income: "75000",
    experience: "48",
    address1: "123 Sky Tower",
    address2: "BKC Business Hub",
    pincode: "400051",
    city: "Mumbai",
    state: "Maharashtra"
  });
  const [offerAmount, setOfferAmount] = useState(0);
  const [selectedOfferRange, setSelectedOfferRange] = useState([50000]);
  const [selectedTenure, setSelectedTenure] = useState([12]);
  const [currentStepId, setCurrentStepId] = useState(1);

  // Calculate progress percentage
  const progressPercentage = Math.round(((currentStepId - 1) / (steps.length - 1)) * 100);
  const MOCK_AGENT = { name: "Priya Sharma", code: "AG-DEL-1192" };

  const calculateEMI = (p: number, n: number) => {
    const r = 20 / 12 / 100; // 20% annual interest
    const emi = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    return Math.round(emi);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const processingFee = selectedOfferRange[0] * 0.02;
  const gst = processingFee * 0.18;
  const stampDuty = 500;
  const docCharges = 3540;
  const finalDisbursement = selectedOfferRange[0] - (processingFee + gst + stampDuty + docCharges);
  const currentEmi = calculateEMI(selectedOfferRange[0], selectedTenure[0]);

  const handleMobileSubmit = () => {
    if (!/^\d{10}$/.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    setError("");
    setStage("loader");
    setTimeout(() => {
      setStage("status");
    }, 5000);
  };

  const handleStatusSelect = (status: "Reject" | "WIP" | "New") => {
    if (status === "Reject") {
      setRandomDays(Math.floor(Math.random() * 30) + 1);
      setStage("reject");
    } else if (status === "WIP") {
      setStage("wip");
    } else {
      setStage("new_form");
    }
  };

  const handlePincodeBlur = () => {
    if (formData.pincode.length === 6) {
      setFormData({ ...formData, city: "Mumbai", state: "Maharashtra" });
    }
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.employment === "salaried" && parseInt(formData.income) < 30000) {
      toast({
        variant: "destructive",
        title: "Ineligible Income",
        description: "Salary should be greater than 30,000",
      });
      return;
    }
    setStage("submitting");
    setCurrentStepId(2);
    setTimeout(() => {
      setStage("consent");
    }, 3000);
  };

  const handleConsent = (approved: boolean) => {
    if (approved) {
      setStage("consent_approved");
    } else {
      setStage("reject");
      setRandomDays(90); // Different context for consent rejection
    }
  };

  const handleOfferColor = (color: string) => {
    if (color === "red") {
      setStage("offer_rejected");
    } else if (color === "yellow") {
      setCurrentStepId(4);
      setStage("bank_initiate");
    } else if (color === "blue" || color === "green") {
      const amount = Math.floor(Math.random() * (1000000 - 100000 + 1)) + 100000;
      setOfferAmount(amount);
      setSelectedOfferRange([amount]);
      setSelectedTenure([12]);
      setMaxEmi(calculateEMI(amount, 12));
      setCurrentStepId(3);
      setStage("offer");
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0 },
        colors: ['#004499', '#fbbf24', '#10b981']
      });
    }
  };

  const handleAmountChange = (val: number[]) => {
    const nextEmi = calculateEMI(val[0], selectedTenure[0]);
    if (nextEmi > maxEmi) {
      setEmiError(`EMI amount can't exceed ${formatCurrency(maxEmi)}`);
    } else {
      setEmiError(null);
      setSelectedOfferRange(val);
    }
  };

  const handleTenureChange = (val: number[]) => {
    const nextEmi = calculateEMI(selectedOfferRange[0], val[0]);
    if (nextEmi > maxEmi) {
      setEmiError(`EMI amount can't exceed ${formatCurrency(maxEmi)}`);
    } else {
      setEmiError(null);
      setSelectedTenure(val);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" className="w-fit pl-0 hover:bg-transparent text-slate-500 hover:text-[#004499] group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Button>
        </Link>
        
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-heading font-black text-slate-900 tracking-tight">PL Lead Journey</h1>
            <p className="text-slate-500 mt-1 font-medium italic">Premium personal loan pre-approval flow.</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Agent badge */}
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
              <div className="w-7 h-7 rounded-full bg-[#004499]/10 flex items-center justify-center shrink-0">
                <UserIcon className="h-4 w-4 text-[#004499]" />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Agent</p>
                <p className="text-sm font-bold text-slate-800 leading-tight">{MOCK_AGENT.name}</p>
                <p className="text-[10px] font-mono text-[#004499] leading-none">{MOCK_AGENT.code}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Journey Progress</p>
              <p className="text-sm font-black text-[#004499]">{progressPercentage}% Complete</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative py-6 px-2">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full" />
          <div 
            className="absolute top-1/2 left-0 h-1 bg-[#004499] -translate-y-1/2 transition-all duration-700 ease-in-out rounded-full shadow-[0_0_12px_rgba(0,68,153,0.4)]" 
            style={{ width: `${progressPercentage}%` }}
          />
          
          <div className="relative flex justify-between items-center">
            {steps.map((s) => {
              const isCompleted = currentStepId > s.id;
              const isActive = currentStepId === s.id;
              
              return (
                <div key={s.id} className="flex flex-col items-center group cursor-default">
                  <div 
                    className={cn(
                      "relative w-9 h-9 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all duration-500 z-10",
                      isCompleted 
                        ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100" 
                        : isActive
                          ? "bg-white border-[#004499] text-[#004499] ring-4 ring-blue-50 shadow-md scale-110"
                          : "bg-white border-slate-200 text-slate-300"
                    )}
                  >
                    {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : s.id}
                  </div>
                  <span className={cn(
                    "mt-3 text-[10px] font-black uppercase tracking-widest transition-colors duration-300",
                    isActive ? "text-[#004499]" : isCompleted ? "text-emerald-600" : "text-slate-400"
                  )}>
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Card className="shadow-2xl border-slate-200/60 overflow-hidden rounded-2xl">
        <CardContent className="p-0">
          {/* Stage 1: Entry Screen */}
          {stage === "basic" && (
            <div className="p-12 max-w-lg mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
                  <Smartphone className="text-[#004499] h-8 w-8" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Validate Mobile</h2>
                <p className="text-slate-500 text-sm font-medium">Please enter the customer's 10-digit mobile number to begin.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Mobile Number</Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                    <Input 
                      value={mobile} 
                      onChange={(e) => setMobile(e.target.value)} 
                      placeholder="Enter 10 digit number" 
                      className={cn(
                        "pl-10 text-lg h-14 font-black tracking-widest bg-slate-50 border-slate-200 focus:bg-white focus:ring-[#004499]/20 transition-all",
                        error && "border-rose-500 bg-rose-50"
                      )}
                      maxLength={10}
                    />
                  </div>
                  {error && <p className="text-rose-500 text-xs font-bold mt-1 flex items-center gap-1 animate-pulse"><XCircle className="h-3 w-3" /> {error}</p>}
                </div>

                <Button onClick={handleMobileSubmit} className="w-full h-14 bg-[#004499] hover:bg-[#003377] text-lg font-black uppercase tracking-widest shadow-xl shadow-blue-100 mt-4 group">
                  Continue
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          )}

          {/* Loader Stage */}
          {stage === "loader" && (
            <div className="p-20 flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-slate-100 border-t-[#004499] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Smartphone className="h-8 w-8 text-[#004499]/40" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Security Protocol Active</h3>
                <p className="text-slate-500 font-medium italic animate-pulse">We are doing some backend checks. Please wait...</p>
              </div>
            </div>
          )}

          {/* Status Selection Simulator */}
          {stage === "status" && (
            <div className="p-12 max-w-xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
              <div className="text-center space-y-2 border-b border-slate-100 pb-8">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Backend Outcome Simulator</h2>
                <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Select an outcome for demo purpose</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {[
                  { id: "Reject", title: "Policy Decline", desc: "Automatic rejection due to risk score", icon: XCircle, color: "rose" },
                  { id: "WIP", title: "WIP Case", desc: "Existing application found in progress", icon: Clock, color: "amber" },
                  { id: "New", title: "Fresh Application", desc: "No existing records. Proceed to flow.", icon: CheckCircle2, color: "emerald" }
                ].map((opt) => (
                  <button 
                    key={opt.id}
                    onClick={() => handleStatusSelect(opt.id as any)}
                    className={cn(
                      "flex items-center p-6 bg-white border-2 border-slate-100 rounded-2xl transition-all text-left group hover:shadow-xl",
                      opt.id === "Reject" ? "hover:border-rose-500 hover:bg-rose-50" : 
                      opt.id === "WIP" ? "hover:border-amber-500 hover:bg-amber-50" : "hover:border-emerald-500 hover:bg-emerald-50"
                    )}
                  >
                    <div className={cn(
                      "w-14 h-14 rounded-xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform shadow-inner",
                      opt.id === "Reject" ? "bg-rose-100" : 
                      opt.id === "WIP" ? "bg-amber-100" : "bg-emerald-100"
                    )}>
                      <opt.icon className={cn(
                        "h-7 w-7",
                        opt.id === "Reject" ? "text-rose-600" : 
                        opt.id === "WIP" ? "text-amber-600" : "text-emerald-600"
                      )} />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-lg uppercase tracking-tight">{opt.id}</p>
                      <p className="text-sm text-slate-500 font-medium italic">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Rejection Stage */}
          {stage === "reject" && (
            <div className="p-16 text-center space-y-8 animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto shadow-inner border border-rose-200">
                <XCircle className="text-rose-600 h-12 w-12" />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Application Restricted</h2>
                <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl inline-block max-w-md">
                  <p className="text-rose-700 font-black text-lg">
                    User can try after <span className="text-2xl underline decoration-rose-300 decoration-4">{randomDays} days</span>.
                  </p>
                  <p className="text-xs text-rose-500 mt-2 font-bold uppercase tracking-widest">Cool-off period active</p>
                </div>
              </div>
              <Button onClick={() => setLocation("/dashboard")} variant="outline" className="border-slate-200 h-12 px-8 font-black uppercase tracking-widest text-xs">
                Back to Dashboard
              </Button>
            </div>
          )}

          {/* WIP Stage */}
          {stage === "wip" && (
            <div className="p-16 text-center space-y-8 animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto shadow-inner border border-amber-200">
                <Clock className="text-amber-600 h-12 w-12" />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Existing Case Found</h2>
                <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl inline-block max-w-md">
                  <p className="text-amber-700 font-black text-lg">
                    A demo link has been sent to <span className="text-[#004499]">{mobile}</span>.
                  </p>
                  <p className="text-xs text-amber-500 mt-2 font-bold uppercase tracking-widest">Resumed via Secure SMS Link</p>
                </div>
              </div>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => setLocation("/dashboard")} variant="outline" className="border-slate-200 h-12 px-8 font-black uppercase tracking-widest text-xs">
                  Dashboard
                </Button>
                <Button onClick={() => setStage("basic")} className="bg-[#004499] h-12 px-8 font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-100">
                  New Search
                </Button>
              </div>
            </div>
          )}

          {/* New Application Form */}
          {stage === "new_form" && (
            <div className="p-10 space-y-8 animate-in slide-in-from-right-8 duration-500">
              <div className="border-l-4 border-[#004499] pl-6 py-2">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Lead Registration</h2>
                <p className="text-slate-500 text-sm font-medium italic">Complete the verified profile for {mobile}.</p>
              </div>

              <form onSubmit={handleCreateLead} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <CreditCard className="h-3 w-3" /> PAN Number
                    </Label>
                    <Input 
                      value={formData.pan} 
                      onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })} 
                      placeholder="ABCDE1234F" 
                      className="h-12 font-mono uppercase font-bold tracking-widest"
                      required
                      maxLength={10}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <UserIcon className="h-3 w-3" /> Name as per PAN
                    </Label>
                    <Input 
                      value={formData.name} 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                      placeholder="Full Name" 
                      className="h-12 font-bold"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <CalendarIcon className="h-3 w-3" /> Date of Birth
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        className="h-12 font-bold"
                        value={formData.dob ? format(formData.dob, "yyyy-MM-dd") : ""}
                        onChange={(e) => {
                          const d = new Date(e.target.value);
                          if (!isNaN(d.getTime())) setFormData({ ...formData, dob: d });
                        }}
                        required
                      />
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="h-12 w-12 p-0 flex items-center justify-center border-slate-200">
                            <CalendarIcon className="h-4 w-4 text-slate-400" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                          <Calendar
                            mode="single"
                            captionLayout="dropdown"
                            selected={formData.dob}
                            onSelect={(d) => d && setFormData({ ...formData, dob: d })}
                            fromYear={1950}
                            toYear={new Date().getFullYear() - 18}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <Mail className="h-3 w-3" /> Email ID
                    </Label>
                    <Input 
                      type="email"
                      value={formData.email} 
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                      placeholder="customer@email.com" 
                      className="h-12 font-bold"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Gender</Label>
                    <Select value={formData.gender} onValueChange={(v) => setFormData({ ...formData, gender: v })}>
                      <SelectTrigger className="h-12 font-bold">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Employment Type</Label>
                    <div className="flex gap-8 items-center pt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="se" 
                          checked={formData.employment === "self_employed"} 
                          onCheckedChange={() => setFormData({ ...formData, employment: "self_employed" })} 
                        />
                        <label htmlFor="se" className="text-sm font-bold leading-none cursor-pointer">Self Employed</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="sal" 
                          checked={formData.employment === "salaried"} 
                          onCheckedChange={() => setFormData({ ...formData, employment: "salaried" })} 
                        />
                        <label htmlFor="sal" className="text-sm font-bold leading-none cursor-pointer">Salaried Person</label>
                      </div>
                    </div>
                  </div>
                </div>

                {formData.employment === "salaried" && (
                  <div className="p-8 bg-blue-50/50 rounded-2xl border border-blue-100/50 space-y-6 animate-in slide-in-from-top-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-600">Company Name</Label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input 
                            value={formData.company} 
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })} 
                            className="pl-10 font-bold"
                            placeholder="e.g. Google India"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-600">Total Income (Monthly)</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                          <Input 
                            type="number"
                            value={formData.income} 
                            onChange={(e) => setFormData({ ...formData, income: e.target.value })} 
                            className="pl-8 font-bold"
                            placeholder="Monthly Salary"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <MapPin className="h-5 w-5 text-[#004499]" />
                    <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Residential Address</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Address Line 1</Label>
                      <Input value={formData.address1} onChange={(e) => setFormData({ ...formData, address1: e.target.value })} className="font-bold h-12" required />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pincode</Label>
                      <Input value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} onBlur={handlePincodeBlur} className="font-bold h-12" maxLength={6} required />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full h-16 bg-[#004499] hover:bg-[#003377] text-lg font-black uppercase tracking-widest shadow-2xl shadow-blue-100">
                  Create Lead Profile
                </Button>
              </form>
            </div>
          )}

          {/* Submitting Stage */}
          {stage === "submitting" && (
            <div className="p-20 flex flex-col items-center justify-center space-y-6">
              <Loader2 className="h-16 w-16 text-[#004499] animate-spin" />
              <div className="text-center">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Generating Application ID</h3>
                <p className="text-slate-500 font-medium italic animate-pulse">Assigning lead to nearest branch...</p>
              </div>
            </div>
          )}

          {/* Consent Stage */}
          {stage === "consent" && (
            <div className="p-12 max-w-2xl mx-auto space-y-10 animate-in fade-in duration-700">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-xl">
                  <CheckCircle2 className="text-[#004499] h-10 w-10" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Digital Consent</h2>
                <p className="text-slate-500 font-medium">Lead ID: <span className="text-[#004499] font-bold">PL-2024-8892</span></p>
              </div>

              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 space-y-6">
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  I hereby authorize <span className="font-bold text-slate-900">SalesAssure NBFC</span> to fetch my credit information from CICs and perform KYC verification. I understand this will involve a hard pull on my credit report.
                </p>
                <div className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                  <div className="mt-1"><AlertCircle className="h-4 w-4 text-[#004499]" /></div>
                  <p className="text-xs text-[#004499] font-bold leading-normal italic">
                    An OTP has been sent to the customer's mobile number {mobile} for verification.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={() => handleConsent(false)} variant="outline" className="flex-1 h-14 border-slate-200 font-black text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all uppercase tracking-widest">
                  Declined
                </Button>
                <Button onClick={() => handleConsent(true)} className="flex-1 h-14 bg-emerald-600 hover:bg-emerald-700 font-black uppercase tracking-widest shadow-xl shadow-emerald-100">
                  OTP Verified
                </Button>
              </div>
            </div>
          )}

          {/* BRE Outcome Simulator */}
          {stage === "consent_approved" && (
            <div className="p-12 max-w-xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
              <div className="text-center space-y-2 border-b border-slate-100 pb-8">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">BRE Engine Simulation</h2>
                <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Select Bureau Outcome</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {[
                  { id: "red", title: "Hard Reject", desc: "Bureau score < 650", color: "bg-rose-500" },
                  { id: "yellow", title: "Manual Review", desc: "Low-match / Income issues", color: "bg-amber-500" },
                  { id: "blue", title: "Instant Approval", desc: "Excellent bureau profile", color: "bg-blue-500" },
                  { id: "green", title: "Premium Offer", desc: "High-ticket pre-approved", color: "bg-emerald-500" }
                ].map((opt) => (
                  <button 
                    key={opt.id}
                    onClick={() => handleOfferColor(opt.id)}
                    className="flex items-center p-6 bg-white border-2 border-slate-100 rounded-2xl transition-all hover:border-[#004499] hover:shadow-xl text-left group"
                  >
                    <div className={cn("w-4 h-12 rounded-full mr-6 group-hover:scale-y-110 transition-transform", opt.color)} />
                    <div>
                      <p className="font-black text-slate-900 text-lg uppercase tracking-tight">{opt.title}</p>
                      <p className="text-sm text-slate-500 font-medium italic">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Final Offer Stage with Max EMI Validation */}
          {stage === "offer" && (
            <div className="p-10 space-y-10 animate-in slide-in-from-bottom-8 duration-700">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100">
                  <CheckCircle2 className="h-3 w-3" /> Offer Unlocked
                </div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Instant Approval!</h2>
                <p className="text-slate-500 font-medium italic">Adjust the plan to match the customer's monthly budget.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Configuration Panel */}
                <div className="space-y-10 bg-slate-50 p-8 rounded-3xl border border-slate-100">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Banknote className="h-5 w-5 text-[#004499]" />
                        <Label className="font-black text-slate-700 uppercase tracking-widest text-xs">Loan Amount</Label>
                      </div>
                      <div className="text-2xl font-black text-[#004499] bg-white px-4 py-1 rounded-xl shadow-sm border border-slate-100">
                        {formatCurrency(selectedOfferRange[0])}
                      </div>
                    </div>
                    <Slider 
                      value={selectedOfferRange} 
                      onValueChange={handleAmountChange}
                      max={offerAmount} 
                      min={50000} 
                      step={5000} 
                      className="py-4"
                    />
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <span>Min: ₹50,000</span>
                      <span>Approved: {formatCurrency(offerAmount)}</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5 text-[#004499]" />
                        <Label className="font-black text-slate-700 uppercase tracking-widest text-xs">Tenure</Label>
                      </div>
                      <div className="text-2xl font-black text-[#004499] bg-white px-4 py-1 rounded-xl shadow-sm border border-slate-100">
                        {selectedTenure[0]} <span className="text-xs text-slate-400">Mo</span>
                      </div>
                    </div>
                    <Slider 
                      value={selectedTenure} 
                      onValueChange={handleTenureChange}
                      max={60} 
                      min={12} 
                      step={6} 
                      className="py-4"
                    />
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <span>12 Months</span>
                      <span>60 Months</span>
                    </div>
                  </div>

                  {emiError && (
                    <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                      <AlertCircle className="h-5 w-5 text-rose-600" />
                      <p className="text-sm font-bold text-rose-700">{emiError}</p>
                    </div>
                  )}
                </div>

                {/* Breakdown Panel */}
                <div className="space-y-6">
                  <div className="p-8 bg-[#004499] text-white rounded-3xl shadow-xl shadow-blue-100 space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Calculator size={120} />
                    </div>
                    <div className="relative z-10">
                      <p className="text-xs font-black text-blue-200 uppercase tracking-widest mb-2">Estimated Monthly EMI</p>
                      <div className="text-5xl font-black">{formatCurrency(currentEmi)}<span className="text-lg font-bold opacity-60">/mo</span></div>
                      <div className="flex items-center gap-2 mt-4 text-[10px] font-bold text-blue-100 bg-blue-800/40 w-fit px-3 py-1 rounded-full border border-blue-700/50">
                        <Clock className="h-3 w-3" /> FIXED INTEREST: 20% P.A.
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Processing Fee</p>
                      <p className="text-sm font-bold text-slate-700">{formatCurrency(processingFee)}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GST (18%)</p>
                      <p className="text-sm font-bold text-slate-700">{formatCurrency(gst)}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stamp Duty</p>
                      <p className="text-sm font-bold text-slate-700">{formatCurrency(stampDuty)}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Doc Charges</p>
                      <p className="text-sm font-bold text-slate-700">{formatCurrency(docCharges)}</p>
                    </div>
                  </div>

                  <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Net Disbursement</p>
                      <p className="text-[10px] text-emerald-600 italic">Direct to customer's account</p>
                    </div>
                    <div className="text-2xl font-black text-emerald-800">
                      {formatCurrency(finalDisbursement)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={() => setStage("offer_rejected")} variant="outline" className="h-16 flex-1 border-slate-200 font-black text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all uppercase tracking-widest text-xs">
                  Offer Rejected
                </Button>
                <Button 
                  onClick={() => {
                    setCurrentStepId(4);
                    setStage("bank_initiate");
                  }} 
                  disabled={!!emiError}
                  className="h-16 flex-1 bg-emerald-600 hover:bg-emerald-700 font-black uppercase tracking-widest shadow-2xl shadow-emerald-100 group"
                >
                  Accept Instant Offer
                  <ExternalLink className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </div>
            </div>
          )}

          {/* Offer Rejected Stage */}
          {stage === "offer_rejected" && (
            <div className="p-16 text-center space-y-8 animate-in fade-in duration-500">
              <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto shadow-inner border border-rose-200">
                <XCircle className="text-rose-600 h-12 w-12" />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Offer Withdrawn</h2>
                <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl inline-block max-w-md">
                  <p className="text-slate-600 font-medium">The customer has declined the pre-approved terms. Application closing.</p>
                </div>
              </div>
              <Button onClick={() => setLocation("/dashboard")} className="bg-[#004499] h-12 px-8 font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-100">
                Return to Dashboard
              </Button>
            </div>
          )}

          {/* Bank Verification Stage */}
          {stage === "bank_initiate" && (
            <div className="p-16 text-center space-y-8 animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-inner border border-emerald-200">
                <Building2 className="text-emerald-600 h-12 w-12" />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Bank Verification Initiated</h2>
                <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl inline-block max-w-lg">
                  <p className="text-emerald-800 font-black text-lg leading-snug">
                    A secure <span className="text-[#004499]">Penny Drop</span> and <span className="text-[#004499]">Aggregator Login</span> link has been sent to {mobile}.
                  </p>
                  <p className="text-[10px] text-emerald-600 mt-4 font-black uppercase tracking-widest">Awaiting Customer Confirmation</p>
                </div>
              </div>
              <Button onClick={() => setLocation("/dashboard")} className="bg-[#004499] h-12 px-8 font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-100">
                Finish Lead Entry
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
