"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, differenceInYears } from "date-fns";
import {
  User,
  GraduationCap,
  MapPin,
  Calendar as CalendarIcon,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Clock,
  ArrowRight,
  Info,
  Sparkles,
  RotateCcw,
  Ban,
} from "lucide-react";
import { cn } from "@/utils";
import { useToast } from "@/hooks/useToast";
import {
  DEMO_PROFILES,
  DemoProfile,
  MOCK_COURSES,
  MOCK_INSTITUTIONS,
  PIN_LOCATION_MAP,
} from "../constants/el-mock-data";

const EMPTY_EL_PROFILE: DemoProfile = {
  id: "",
  label: "",
  description: "",
  scenario: "success",
  fullName: "",
  fatherName: "",
  gender: "",
  maritalStatus: "",
  pan: "",
  dob: "",
  mobile: "",
  email: "",
  address: "",
  landmark: "",
  pinCode: "",
  city: "",
  state: "",
  courseName: "",
  institutionName: "",
  admissionStatus: "",
  loanAmount: 0,
  loanTenure: 0,
  employmentType: "Salaried",
};

type CaseType = "new" | "wip" | "rejected" | null;

interface Props {
  initialMobile?: string;
  initialCase?: string | null;
  initialData?: Partial<DemoProfile>;
  onComplete: (data: DemoProfile) => void;
  onResumeExistingLead?: (leadAppId: string) => void;
  onUpdateInsightBackend?: (activity: string, secondsLeft: number) => void;
  isSimulatingLoader?: boolean;
  setIsSimulatingLoader?: (val: boolean) => void;
  fastForwardTrigger?: number;
}

export default function Stage3BasicDetails({
  initialMobile,
  initialCase,
  initialData,
  onComplete,
  onResumeExistingLead,
}: Props) {
  const { toast } = useToast();
  const defaultProfile = DEMO_PROFILES[0];

  const [mobileInput, setMobileInput] = useState<string>(initialMobile || "");
  const [checkingStatus, setCheckingStatus] = useState<boolean>(false);
  const [statusChecked, setStatusChecked] = useState<boolean>(
    Boolean(initialMobile && initialCase !== "new")
  );
  const [selectedCase, setSelectedCase] = useState<CaseType>(
    initialCase === "new" ? "new" : null
  );
  const [isDemoFilled, setIsDemoFilled] = useState<boolean>(false);

  const [formData, setFormData] = useState<DemoProfile>({
    ...EMPTY_EL_PROFILE,
    mobile: initialMobile || "",
    ...initialData,
  });

  const [selectedDob, setSelectedDob] = useState<Date | undefined>(
    formData.dob ? new Date(formData.dob) : undefined
  );
  const [pinValidationMsg, setPinValidationMsg] = useState<string>("");
  const [pinIsServiceable, setPinIsServiceable] = useState<boolean>(true);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleToggleDemo = () => {
    if (isDemoFilled) {
      setMobileInput(initialMobile || "");
      if (!initialMobile) {
        setSelectedCase(null);
        setStatusChecked(false);
      }
      setCheckingStatus(false);
      setFormData({
        ...EMPTY_EL_PROFILE,
        mobile: initialMobile || "",
      });
      setSelectedDob(undefined);
      setValidationErrors({});
      setIsDemoFilled(false);
      toast({
        title: "Details Cleared",
        description: "All customer details fields have been removed.",
      });
    } else {
      const demo = DEMO_PROFILES[0];
      setMobileInput(initialMobile || demo.mobile);
      setSelectedCase("new");
      setStatusChecked(true);
      setCheckingStatus(false);
      setFormData({
        ...demo,
        mobile: initialMobile || demo.mobile,
      });
      setSelectedDob(demo.dob ? new Date(demo.dob) : undefined);
      setValidationErrors({});
      setIsDemoFilled(true);
      toast({
        title: "Demo Details Populated",
        description: "All customer details fields have been auto-filled.",
      });
    }
  };

  // Check Status logic (Exact BL Journey)
  const checkStatus = () => {
    if (mobileInput.length !== 10) return;
    setCheckingStatus(true);
    setStatusChecked(false);
    setSelectedCase(null);

    // 2-second verification simulation
    setTimeout(() => {
      setCheckingStatus(false);
      setStatusChecked(true);
    }, 2000);
  };

  // Handle PIN change & auto-populate City / State
  const handlePinChange = (pin: string) => {
    const cleanPin = pin.replace(/\D/g, "").slice(0, 6);
    setFormData((prev) => ({ ...prev, pinCode: cleanPin }));

    if (cleanPin.length === 6) {
      const location = PIN_LOCATION_MAP[cleanPin];
      if (location) {
        setFormData((prev) => ({
          ...prev,
          city: location.city,
          state: location.state,
        }));
        setPinIsServiceable(location.serviceable);
        setPinValidationMsg(
          location.serviceable ? "" : "Notice: PIN code 999999 is outside active lending territories."
        );
      } else {
        setFormData((prev) => ({
          ...prev,
          city: prev.city || "Urban District",
          state: prev.state || "State Capital",
        }));
        setPinIsServiceable(true);
        setPinValidationMsg("");
      }
    } else {
      setPinValidationMsg("");
      setPinIsServiceable(true);
    }
  };

  // DOB change & Age calculation
  const handleDobChange = (date: Date | undefined) => {
    setSelectedDob(date);
    if (date) {
      const formatted = format(date, "yyyy-MM-dd");
      setFormData((prev) => ({ ...prev, dob: formatted }));

      const age = differenceInYears(new Date(), date);
      if (age < 18) {
        setValidationErrors((prev) => ({
          ...prev,
          dob: "Customer must be at least 18 years old to apply.",
        }));
      } else {
        setValidationErrors((prev) => {
          const next = { ...prev };
          delete next.dob;
          return next;
        });
      }
    }
  };

  // Trigger form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCase !== "new") return;

    if (formData.employmentType === "Self-employed") {
      toast({
        title: "Action Not Allowed",
        description: "Education loan is not available for Self-employed applicants online. Please select Salaried to proceed.",
        variant: "destructive",
      });
      return;
    }

    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.fatherName.trim()) errors.fatherName = "Father's name is required";
    if (!formData.pan.trim() || formData.pan.length !== 10) errors.pan = "Valid 10-character PAN required";
    if (!formData.email.trim() || !formData.email.includes("@")) errors.email = "Valid email is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.pinCode || formData.pinCode.length !== 6) errors.pinCode = "6-digit PIN code required";
    if (!pinIsServiceable) errors.pinCode = "Selected PIN code is unserviceable.";
    if (formData.loanAmount < 100000 || formData.loanAmount > 4999999) {
      errors.loanAmount = "Loan amount must be between ₹1,00,000 and ₹49,99,999";
    }

    if (selectedDob) {
      const age = differenceInYears(new Date(), selectedDob);
      if (age < 18) {
        errors.dob = "Applicant age is below 18 years. Education loan requires age >= 18.";
      }
    } else {
      errors.dob = "Date of birth is required.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    onComplete({
      ...formData,
      mobile: mobileInput,
      dob: selectedDob ? format(selectedDob, "yyyy-MM-dd") : formData.dob,
    });
  };

  // State 1: Checking Status Loader (Exact BL Journey)
  if (checkingStatus) {
    return (
      <Card className="border-0 shadow-none bg-slate-50/50 py-12">
        <CardContent className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-12 w-12 text-[#004499] animate-spin" />
          <div className="text-center">
            <h3 className="text-lg font-semibold text-slate-900">Validating Mobile Number</h3>
            <p className="text-sm text-slate-500">Checking existing applications in our records...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // State 2: Verification Result Options (Exact Match to Verification Result Screen)
  if (statusChecked && !selectedCase) {
    return (
      <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-slate-900">Verification Result</h3>
          <p className="text-sm text-slate-500 mt-1">Select the appropriate case type for {mobileInput}</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <button
            type="button"
            onClick={() => {
              setSelectedCase("new");
              setFormData((prev) => ({ ...prev, mobile: mobileInput }));
            }}
            className="flex items-center p-4 bg-white border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50/30 rounded-xl transition-all text-left group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="text-emerald-600 h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-slate-900">New Case</p>
              <p className="text-xs text-slate-500">No existing record found. Proceed to creation.</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCase("wip")}
            className="flex items-center p-4 bg-white border-2 border-slate-100 hover:border-amber-500 hover:bg-amber-50/30 rounded-xl transition-all text-left group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
              <Clock className="text-amber-600 h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-900">WIP Case</p>
              <p className="text-xs text-slate-500">Application #APP-847291-X is already in progress.</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCase("rejected")}
            className="flex items-center p-4 bg-white border-2 border-slate-100 hover:border-red-500 hover:bg-red-50/30 rounded-xl transition-all text-left group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
              <AlertCircle className="text-red-600 h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Rejected Case</p>
              <p className="text-xs text-slate-500">Application #APP-102938-R was recently declined.</p>
            </div>
          </button>
        </div>

        <Button
          variant="ghost"
          onClick={() => {
            setStatusChecked(false);
            setSelectedCase(null);
          }}
          className="w-full text-slate-400 hover:text-slate-600 hover:bg-slate-50"
        >
          Back to Search
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* ── Top Header Banner (Exact BL Style) ── */}
      <div className="mb-6 border-l-4 border-blue-600 pl-4 pr-3 py-2 bg-blue-50/50 rounded-r-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Stage 1 — Customer Details</h3>
          <p className="text-sm text-slate-500">
            Enter details as per official documents (PAN/Aadhaar). These details will be used for CIBIL check.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleToggleDemo}
            className={cn(
              "h-8 px-3 text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer",
              isDemoFilled
                ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:border-rose-300"
                : "border-blue-300 bg-white text-[#004499] hover:bg-blue-50 hover:border-blue-400"
            )}
            title={isDemoFilled ? "Remove demo details from all fields" : "Fill all fields with demo customer details"}
          >
            {isDemoFilled ? (
              <>
                <RotateCcw className="h-3.5 w-3.5 text-rose-600" />
                <span>Remove Demo Details</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 text-[#004499]" />
                <span>Fill Demo Details</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── Mobile Number Section (Exact BL Style) ── */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-inner">
          <Label className="text-[#004499] font-bold text-sm block mb-2">Mobile Number</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Enter 10 digit mobile"
              value={mobileInput}
              onChange={(e) => setMobileInput(e.target.value.replace(/\D/g, "").slice(0, 10))}
              className="bg-white text-lg h-12 tracking-widest font-mono"
              maxLength={10}
              disabled={selectedCase !== null}
            />
            {!selectedCase && (
              <Button
                type="button"
                onClick={checkStatus}
                disabled={mobileInput.length !== 10}
                className="bg-[#004499] hover:bg-[#003377] text-white h-12 px-6 font-semibold"
              >
                Check Status
              </Button>
            )}
            {selectedCase && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSelectedCase(null);
                  setStatusChecked(false);
                  setIsDemoFilled(false);
                }}
                className="h-12 px-5 text-slate-600 border-slate-300 hover:bg-slate-100"
              >
                Change Number
              </Button>
            )}
          </div>
          {selectedCase === "new" ? (
            <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> Mobile number verified. No duplicate records found.
            </p>
          ) : (
            <p className="text-xs text-slate-400 mt-2">
              Enter 10-digit mobile number to verify dedupe & application status.
            </p>
          )}
        </div>

        {/* ── Case Outlines: WIP or Rejected Blocker (Exact BL Style) ── */}
        {selectedCase === "wip" && (
          <div className="p-8 border-2 border-dashed border-amber-300 rounded-xl bg-amber-50/50 flex flex-col items-center text-center space-y-3 animate-in fade-in duration-300">
            <Clock className="h-12 w-12 text-amber-500" />
            <div>
              <h4 className="font-bold text-slate-900 text-lg">Case In Progress</h4>
              <p className="text-sm text-slate-500 max-w-sm mt-1">
                An application for this mobile number is already active in our system (APP-EL-84920). Duplicate leads cannot be created.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              {onResumeExistingLead && (
                <Button
                  type="button"
                  onClick={() => onResumeExistingLead("EL-84920")}
                  className="bg-[#004499] hover:bg-[#003377] text-white"
                >
                  Resume Application
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSelectedCase(null);
                  setStatusChecked(false);
                }}
              >
                Try Another Number
              </Button>
            </div>
          </div>
        )}

        {selectedCase === "rejected" && (
          <div className="p-8 border-2 border-dashed border-red-300 rounded-xl bg-red-50/50 flex flex-col items-center text-center space-y-3 animate-in fade-in duration-300">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <div>
              <h4 className="font-bold text-slate-900 text-lg">Lead Restricted</h4>
              <p className="text-sm text-slate-500 max-w-sm mt-1">
                A recent application (APP-EL-102938-R) for this number was rejected. New lead creation is cooling off for 90 days.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              className="mt-2"
              onClick={() => {
                setSelectedCase(null);
                setStatusChecked(false);
              }}
            >
              Try Another Number
            </Button>
          </div>
        )}

        {/* ── Case New: Full Customer Form Unlocked (Exact BL Form Flow) ── */}
        {selectedCase === "new" && (
          <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
            {/* Personal & Identification Details */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <User className="h-5 w-5 text-[#004499]" />
                <h3 className="font-bold text-slate-900 text-base">Personal & Identity Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-600">Full Name (As per PAN) *</Label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="bg-slate-50 border-slate-200 focus:bg-white text-sm"
                    placeholder="Applicant full name"
                  />
                  {validationErrors.fullName && (
                    <p className="text-[11px] text-red-600 font-medium">{validationErrors.fullName}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-600">Father's Name *</Label>
                  <Input
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    className="bg-slate-50 border-slate-200 focus:bg-white text-sm"
                    placeholder="Father's full name"
                  />
                  {validationErrors.fatherName && (
                    <p className="text-[11px] text-red-600 font-medium">{validationErrors.fatherName}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-600">Gender *</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(val) => setFormData({ ...formData, gender: val })}
                  >
                    <SelectTrigger className="bg-slate-50 border-slate-200 text-sm">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-600">Marital Status *</Label>
                  <Select
                    value={formData.maritalStatus}
                    onValueChange={(val) => setFormData({ ...formData, maritalStatus: val })}
                  >
                    <SelectTrigger className="bg-slate-50 border-slate-200 text-sm">
                      <SelectValue placeholder="Select marital status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="Divorced">Divorced</SelectItem>
                      <SelectItem value="Widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* PAN Input */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-600">PAN Number *</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      value={formData.pan}
                      maxLength={10}
                      onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                      className="pl-9 bg-slate-50 border-slate-200 focus:bg-white uppercase font-mono text-sm tracking-wider"
                      placeholder="ABCDE1234F"
                    />
                  </div>
                  {validationErrors.pan && (
                    <p className="text-[11px] text-red-600 font-medium">{validationErrors.pan}</p>
                  )}
                </div>

                {/* DOB with DatePicker & 18+ validation */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-600">Date of Birth (Min 18 Yrs) *</Label>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      className="h-10 bg-slate-50 border-slate-200 text-sm flex-1"
                      value={selectedDob ? format(selectedDob, "yyyy-MM-dd") : ""}
                      onChange={(e) => {
                        const d = new Date(e.target.value);
                        if (!isNaN(d.getTime())) handleDobChange(d);
                      }}
                      max={format(new Date(new Date().setFullYear(new Date().getFullYear() - 18)), "yyyy-MM-dd")}
                    />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="px-3 border-slate-200 h-10 w-10 p-0 flex items-center justify-center shrink-0"
                        >
                          <CalendarIcon className="h-4 w-4 text-slate-500" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDob}
                          onSelect={handleDobChange}
                          captionLayout="dropdown"
                          fromYear={1960}
                          toYear={new Date().getFullYear() - 18}
                          disabled={(date) =>
                            date > new Date(new Date().setFullYear(new Date().getFullYear() - 18)) ||
                            date < new Date("1950-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  {validationErrors.dob && (
                    <p className="text-[11px] text-red-600 font-medium flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {validationErrors.dob}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5 md:col-span-3">
                  <Label className="text-xs font-bold text-slate-600">Email Address *</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-slate-50 border-slate-200 focus:bg-white text-sm"
                    placeholder="applicant@university.edu"
                  />
                  {validationErrors.email && (
                    <p className="text-[11px] text-red-600 font-medium">{validationErrors.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Address & PIN Code Auto-Population */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#004499]" />
                  <h3 className="font-bold text-slate-900 text-base">Address & Location Details</h3>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">PIN-to-City Auto-Lookup Enabled</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <Label className="text-xs font-bold text-slate-600">Residential Address *</Label>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="bg-slate-50 border-slate-200 focus:bg-white text-sm"
                    placeholder="House / Flat No, Street, Locality"
                  />
                  {validationErrors.address && (
                    <p className="text-[11px] text-red-600 font-medium">{validationErrors.address}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-600">Nearby Landmark</Label>
                  <Input
                    value={formData.landmark}
                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                    className="bg-slate-50 border-slate-200 focus:bg-white text-sm"
                    placeholder="Near landmark / metro"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-600">PIN Code *</Label>
                  <Input
                    value={formData.pinCode}
                    maxLength={6}
                    onChange={(e) => handlePinChange(e.target.value)}
                    className="bg-slate-50 border-slate-200 focus:bg-white text-sm font-mono font-bold"
                    placeholder="e.g. 560001, 400051"
                  />
                  {pinValidationMsg && (
                    <p className="text-[11px] text-amber-700 font-medium flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {pinValidationMsg}
                    </p>
                  )}
                  {validationErrors.pinCode && (
                    <p className="text-[11px] text-red-600 font-medium">{validationErrors.pinCode}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-600">City (Auto-populated)</Label>
                  <Input
                    value={formData.city}
                    readOnly
                    className="bg-slate-100 border-slate-200 text-sm font-semibold text-slate-700 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-600">State (Auto-populated)</Label>
                  <Input
                    value={formData.state}
                    readOnly
                    className="bg-slate-100 border-slate-200 text-sm font-semibold text-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Course & Education Loan Request */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <GraduationCap className="h-5 w-5 text-[#004499]" />
                <h3 className="font-bold text-slate-900 text-base">Course & Loan Requirements</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-600">Course Name (10 Approved Programs) *</Label>
                  <Select
                    value={formData.courseName}
                    onValueChange={(val) => setFormData({ ...formData, courseName: val })}
                  >
                    <SelectTrigger className="bg-slate-50 border-slate-200 text-sm">
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {MOCK_COURSES.map((course, idx) => (
                        <SelectItem key={idx} value={course} className="text-xs py-2">
                          {course}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-600">Institution Name (10 Accredited Colleges) *</Label>
                  <Select
                    value={formData.institutionName}
                    onValueChange={(val) => setFormData({ ...formData, institutionName: val })}
                  >
                    <SelectTrigger className="bg-slate-50 border-slate-200 text-sm">
                      <SelectValue placeholder="Select institution" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {MOCK_INSTITUTIONS.map((inst, idx) => (
                        <SelectItem key={idx} value={inst} className="text-xs py-2">
                          {inst}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-600">Admission / Enrollment Status *</Label>
                  <Select
                    value={formData.admissionStatus}
                    onValueChange={(val) => setFormData({ ...formData, admissionStatus: val })}
                  >
                    <SelectTrigger className="bg-slate-50 border-slate-200 text-sm">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Confirmed Admission">Confirmed Admission</SelectItem>
                      <SelectItem value="Conditional Offer">Conditional Offer Letter</SelectItem>
                      <SelectItem value="Applied / Awaiting Merit List">Applied / Awaiting Result</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-slate-600">Loan Amount Required (₹1L - ₹49.99L) *</Label>
                    <span className="font-mono text-xs font-bold text-[#004499]">
                      ₹ {formData.loanAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <Input
                    type="number"
                    min={100000}
                    max={4999999}
                    value={formData.loanAmount}
                    onChange={(e) => setFormData({ ...formData, loanAmount: Number(e.target.value) })}
                    className="bg-slate-50 border-slate-200 focus:bg-white text-sm font-semibold"
                  />
                  {validationErrors.loanAmount && (
                    <p className="text-[11px] text-red-600 font-medium">{validationErrors.loanAmount}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-600">Requested Loan Tenure *</Label>
                  <Select
                    value={formData.loanTenure.toString()}
                    onValueChange={(val) => setFormData({ ...formData, loanTenure: Number(val) })}
                  >
                    <SelectTrigger className="bg-slate-50 border-slate-200 text-sm">
                      <SelectValue placeholder="Select tenure" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24">24 Months (2 Years)</SelectItem>
                      <SelectItem value="36">36 Months (3 Years)</SelectItem>
                      <SelectItem value="48">48 Months (4 Years)</SelectItem>
                      <SelectItem value="60">60 Months (5 Years)</SelectItem>
                      <SelectItem value="72">72 Months (6 Years)</SelectItem>
                      <SelectItem value="84">84 Months (7 Years)</SelectItem>
                      <SelectItem value="96">96 Months (8 Years)</SelectItem>
                      <SelectItem value="120">120 Months (10 Years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Employment Type Radio */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-600">Employment Type *</Label>
                  <RadioGroup
                    value={formData.employmentType}
                    onValueChange={(val: "Salaried" | "Self-employed") =>
                      setFormData({ ...formData, employmentType: val })
                    }
                    className="flex gap-4 pt-1"
                  >
                    <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 cursor-pointer">
                      <RadioGroupItem value="Salaried" id="r-salaried" />
                      <Label htmlFor="r-salaried" className="text-xs font-bold text-slate-800 cursor-pointer">
                        Salaried
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 cursor-pointer">
                      <RadioGroupItem value="Self-employed" id="r-self" />
                      <Label htmlFor="r-self" className="text-xs font-bold text-slate-800 cursor-pointer">
                        Self-employed
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {formData.employmentType === "Self-employed" && (
                <div className="bg-rose-50/90 border border-rose-200 rounded-xl p-4 flex items-start gap-3 animate-in fade-in">
                  <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-rose-900 space-y-1">
                    <p className="font-bold text-rose-700">Self-Employed Applicant Policy Restriction:</p>
                    <p>
                      Digital Education Loan application is currently available only for <strong>Salaried</strong> individuals.
                      Applicants with Self-employed status cannot proceed to the next stage in this online journey.
                    </p>
                    <p className="text-rose-600 font-medium pt-0.5">
                      Please select <strong>Salaried</strong> if eligible, or contact a branch representative for offline assisted loan options.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ── Submit CTA ── */}
            <div className="flex flex-col items-end gap-2 pt-4">
              {formData.employmentType === "Self-employed" && (
                <p className="text-xs font-semibold text-rose-600 flex items-center gap-1.5 animate-in fade-in">
                  <Ban className="h-3.5 w-3.5" /> Save & Proceed disabled: Self-employed applicants are not eligible for digital education loans.
                </p>
              )}
              <Button
                type="submit"
                size="lg"
                disabled={formData.employmentType === "Self-employed"}
                className={cn(
                  "px-8 h-12 rounded-xl font-bold uppercase tracking-wider text-xs gap-2 w-full md:w-auto transition-all",
                  formData.employmentType === "Self-employed"
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed hover:bg-slate-200 shadow-none border border-slate-300 pointer-events-none"
                    : "bg-[#004499] hover:bg-[#003377] text-white shadow-lg shadow-blue-100"
                )}
              >
                Save & Proceed to Consent <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
