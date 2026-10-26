"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, differenceInYears } from "date-fns";
import {
  User,
  Users,
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
  ShieldCheck,
  Briefcase,
  Building,
  Mail,
} from "lucide-react";
import { cn } from "@/utils";
import { useToast } from "@/hooks/useToast";
import {
  DEMO_PROFILES,
  DemoProfile,
  MOCK_COURSES,
  MOCK_INSTITUTIONS,
  MOCK_EDUCATION_LEVELS,
  PIN_LOCATION_MAP,
  MOCK_CO_APPLICANT_PROFILE,
  EMPTY_CO_APPLICANT_PROFILE,
  CoApplicantDetails,
  MOCK_RELATIONS,
  MOCK_MARITAL_STATUSES,
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
  salary: 85000,
  employerName: "",
  highestEducation: "Graduate / Bachelor's Degree",
  loanAmount: 0,
  loanTenure: 0,
  employmentType: "Salaried",
  isCoApplicantRequired: false,
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
  onUpdateInsightBackend,
}: Props) {
  const { toast } = useToast();

  const [mobileInput, setMobileInput] = useState<string>(initialMobile || "");
  const [checkingStatus, setCheckingStatus] = useState<boolean>(false);
  const [statusChecked, setStatusChecked] = useState<boolean>(
    Boolean(initialMobile && initialCase !== "new")
  );
  const [selectedCase, setSelectedCase] = useState<CaseType>(
    initialCase === "new" ? "new" : null
  );
  const [isDemoFilled, setIsDemoFilled] = useState<boolean>(false);

  // Main Applicant Form Data
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

  // ── Financial Decision & Co-Applicant State ──
  const [financialDecision, setFinancialDecision] = useState<"yes" | "no">(
    initialData?.financialDecision ?? "yes"
  );

  const [coApplicantData, setCoApplicantData] = useState<CoApplicantDetails>(() => {
    if (initialData?.coApplicant) return initialData.coApplicant;
    return MOCK_CO_APPLICANT_PROFILE;
  });

  const [coApplicantDob, setCoApplicantDob] = useState<Date | undefined>(() => {
    const dobStr = initialData?.coApplicant?.dob || MOCK_CO_APPLICANT_PROFILE.dob;
    return dobStr ? new Date(dobStr) : undefined;
  });

  const [coMobileVerified, setCoMobileVerified] = useState<boolean>(
    Boolean(initialData?.coApplicant?.isMobileVerified ?? true)
  );
  const [coMobileChecking, setCoMobileChecking] = useState<boolean>(false);

  const [sameAsMainApplicantAddress, setSameAsMainApplicantAddress] = useState<boolean>(
    Boolean(initialData?.coApplicant?.sameAsMainApplicantAddress ?? false)
  );

  const [coPinValidationMsg, setCoPinValidationMsg] = useState<string>("");
  const [coPinIsServiceable, setCoPinIsServiceable] = useState<boolean>(true);
  const [coValidationErrors, setCoValidationErrors] = useState<Record<string, string>>({});

  // ── Sync Address when Same As Main Applicant is True ──
  useEffect(() => {
    if (sameAsMainApplicantAddress) {
      setCoApplicantData((prev) => ({
        ...prev,
        sameAsMainApplicantAddress: true,
        address: formData.address,
        landmark: formData.landmark,
        pinCode: formData.pinCode,
        city: formData.city,
        state: formData.state,
      }));
      setCoPinValidationMsg("");
      setCoPinIsServiceable(true);
      setCoValidationErrors((prev) => {
        const next = { ...prev };
        delete next.coAddress;
        delete next.coPinCode;
        return next;
      });
    } else {
      setCoApplicantData((prev) => ({
        ...prev,
        sameAsMainApplicantAddress: false,
      }));
    }
  }, [
    sameAsMainApplicantAddress,
    formData.address,
    formData.landmark,
    formData.pinCode,
    formData.city,
    formData.state,
  ]);

  // Immediate cleanup when Financial Decision changes
  const handleFinancialDecisionChange = (val: "yes" | "no") => {
    setFinancialDecision(val);
    setCoApplicantData((prev) => ({ ...prev, financialDecision: val }));
    if (val === "yes") {
      setCoValidationErrors({});
    } else {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next.employmentType;
        delete next.employerName;
        delete next.salary;
        return next;
      });
    }
  };

  // Immediate cleanup when Employment Type changes
  const handleEmploymentTypeChange = (val: "Salaried" | "Self-employed") => {
    setFormData((prev) => ({ ...prev, employmentType: val }));
    if (validationErrors.employmentType) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next.employmentType;
        return next;
      });
    }
    if (val !== "Salaried") {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next.employerName;
        delete next.salary;
        return next;
      });
    }
  };

  // Verify Co-Applicant Mobile Number
  const handleVerifyCoMobile = () => {
    if (!coApplicantData.mobile || coApplicantData.mobile.length !== 10) return;
    setCoMobileChecking(true);
    setTimeout(() => {
      setCoMobileChecking(false);
      setCoMobileVerified(true);
      setCoValidationErrors((prev) => {
        const next = { ...prev };
        delete next.coMobile;
        return next;
      });
      toast({
        title: "Co-Applicant Mobile Verified",
        description: `Mobile number +91 ${coApplicantData.mobile} verified successfully.`,
      });
    }, 600);
  };

  // ── Validation Evaluator for Co-Applicant ──
  const isCoApplicantValid = useMemo(() => {
    if (financialDecision === "yes") return true;
    if (!coApplicantData.fullName?.trim()) return false;
    if (!coApplicantData.fatherName?.trim()) return false;
    if (!coApplicantData.gender) return false;
    if (
      !coApplicantData.mobile ||
      coApplicantData.mobile.length !== 10 ||
      !/^[6-9]\d{9}$/.test(coApplicantData.mobile)
    ) {
      return false;
    }
    if (!coApplicantData.relationWithApplicant) return false;
    if (!coApplicantData.maritalStatus) return false;
    if (
      !coApplicantData.pan?.trim() ||
      coApplicantData.pan.length !== 10 ||
      !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(coApplicantData.pan.trim())
    ) {
      return false;
    }
    if (!coApplicantDob || differenceInYears(new Date(), coApplicantDob) < 18) {
      return false;
    }
    if (!coApplicantData.email?.trim() || !coApplicantData.email.includes("@")) {
      return false;
    }
    if (!coApplicantData.highestEducation) return false;
    if (!coApplicantData.employmentType) return false;
    if (!coApplicantData.employerName?.trim()) return false;
    if (!coApplicantData.salary || Number(coApplicantData.salary) <= 0) return false;
    if (!coApplicantData.address?.trim()) return false;
    if (!coApplicantData.pinCode || coApplicantData.pinCode.length !== 6) return false;
    if (!coPinIsServiceable) return false;
    return true;
  }, [coApplicantData, coApplicantDob, coPinIsServiceable, financialDecision]);

  // ── Co-Applicant Status for Agent Insight Panel (Requirement 6) ──
  const coApplicantStatus: "Pending" | "Completed" = useMemo(() => {
    return isCoApplicantValid ? "Completed" : "Pending";
  }, [isCoApplicantValid]);

  // Notify backend insight if callback provided
  useEffect(() => {
    if (onUpdateInsightBackend) {
      onUpdateInsightBackend(
        `Co-Applicant Status: ${coApplicantStatus} | Financial Decision: ${financialDecision.toUpperCase()}`,
        0
      );
    }
  }, [coApplicantStatus, financialDecision, onUpdateInsightBackend]);

  // Toggle demo data
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
      setFinancialDecision("no");
      setCoApplicantData(EMPTY_CO_APPLICANT_PROFILE);
      setCoApplicantDob(undefined);
      setCoMobileVerified(false);
      setSameAsMainApplicantAddress(false);
      setCoValidationErrors({});
      setIsDemoFilled(false);
      toast({
        title: "Details Cleared",
        description: "All customer details and co-applicant fields have been reset.",
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

      // Set Co-Applicant Mock Profile
      setFinancialDecision("yes");
      setCoApplicantData(MOCK_CO_APPLICANT_PROFILE);
      setCoApplicantDob(new Date(MOCK_CO_APPLICANT_PROFILE.dob));
      setCoMobileVerified(true);
      setSameAsMainApplicantAddress(false);
      setCoValidationErrors({});
      setIsDemoFilled(true);
      toast({
        title: "Demo Details Populated",
        description: "All customer and co-applicant details have been auto-filled.",
      });
    }
  };

  // Check Status logic
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

  // Handle Main Applicant PIN change
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

  // Handle Co-Applicant PIN change
  const handleCoPinChange = (pin: string) => {
    const cleanPin = pin.replace(/\D/g, "").slice(0, 6);
    setCoApplicantData((prev) => ({ ...prev, pinCode: cleanPin }));

    if (cleanPin.length === 6) {
      const location = PIN_LOCATION_MAP[cleanPin];
      if (location) {
        setCoApplicantData((prev) => ({
          ...prev,
          city: location.city,
          state: location.state,
        }));
        setCoPinIsServiceable(location.serviceable);
        setCoPinValidationMsg(
          location.serviceable ? "" : "Notice: PIN code 999999 is outside active lending territories."
        );
        if (location.serviceable) {
          setCoValidationErrors((prev) => {
            const next = { ...prev };
            delete next.coPinCode;
            return next;
          });
        }
      } else {
        setCoApplicantData((prev) => ({
          ...prev,
          city: "",
          state: "",
        }));
        setCoPinIsServiceable(false);
        setCoPinValidationMsg("PIN code is not in our serviceable database.");
      }
    } else {
      setCoPinValidationMsg("");
      setCoPinIsServiceable(true);
    }
  };

  // DOB change for Main Applicant
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

  // DOB change for Co-Applicant
  const handleCoDobChange = (date: Date | undefined) => {
    setCoApplicantDob(date);
    if (date) {
      const formatted = format(date, "yyyy-MM-dd");
      setCoApplicantData((prev) => ({ ...prev, dob: formatted }));

      const age = differenceInYears(new Date(), date);
      if (age < 18) {
        setCoValidationErrors((prev) => ({
          ...prev,
          coDob: "Co-applicant must be at least 18 years old to apply.",
        }));
      } else {
        setCoValidationErrors((prev) => {
          const next = { ...prev };
          delete next.coDob;
          return next;
        });
      }
    }
  };

  // Trigger form submit (single unified CTA for main and co-applicant)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCase !== "new") return;

    if (formData.employmentType === "Self-employed") {
      toast({
        title: "Action Not Allowed",
        description:
          "Education loan is not available for Self-employed applicants online. Please select Salaried to proceed.",
        variant: "destructive",
      });
      return;
    }

    const errors: Record<string, string> = {};

    // Validate Main Applicant
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.fatherName.trim()) errors.fatherName = "Father's name is required";
    if (!formData.pan.trim() || formData.pan.length !== 10) errors.pan = "Valid 10-character PAN required";
    if (!formData.email.trim() || !formData.email.includes("@")) errors.email = "Valid email is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.pinCode || formData.pinCode.length !== 6) errors.pinCode = "6-digit PIN code required";
    if (!pinIsServiceable) errors.pinCode = "Selected PIN code is unserviceable.";

    if (selectedDob) {
      const age = differenceInYears(new Date(), selectedDob);
      if (age < 18) {
        errors.dob = "Applicant age is below 18 years. Education loan requires age >= 18.";
      }
    } else {
      errors.dob = "Date of birth is required.";
    }

    // Validate Education Section
    if (!formData.highestEducation) errors.highestEducation = "Highest education qualification is required";
    if (financialDecision === "yes") {
      if (!formData.employmentType) errors.employmentType = "Employment type is required";
    }

    // Conditional Financial and Employment Fields for Main Applicant
    // Employer Name and Salary / Monthly Income must appear only when both conditions are met:
    // Financial Decision = Yes and Employment Type = Salaried.
    const isMainApplicantFinancialRequired =
      financialDecision === "yes" && formData.employmentType === "Salaried";

    if (isMainApplicantFinancialRequired) {
      if (!formData.employerName || !formData.employerName.trim()) {
        errors.employerName = "Employer name is required";
      }
      if (!formData.salary || Number(formData.salary) < 10000) {
        errors.salary = "Valid monthly income (min ₹10,000) is required";
      }
    }

    if (!formData.courseName) errors.courseName = "Course selection is required";
    if (!formData.loanAmount || formData.loanAmount < 100000 || formData.loanAmount > 4999999) {
      errors.loanAmount = "Loan amount must be between ₹1,00,000 and ₹49,99,999";
    }
    if (!formData.loanTenure) errors.loanTenure = "Loan tenure is required";

    // Validate Co-Applicant Details only when Financial Decision = No
    const coErrors: Record<string, string> = {};
    if (financialDecision === "no") {
      if (!coApplicantData.fullName?.trim()) coErrors.coFullName = "Co-applicant full name is required";
      if (!coApplicantData.fatherName?.trim()) coErrors.coFatherName = "Father's name is required";
      if (!coApplicantData.gender) coErrors.coGender = "Gender selection is required";
      if (
        !coApplicantData.mobile ||
        coApplicantData.mobile.length !== 10 ||
        !/^[6-9]\d{9}$/.test(coApplicantData.mobile)
      ) {
        coErrors.coMobile = "Valid 10-digit mobile number required (starts with 6-9)";
      }
      if (!coApplicantData.relationWithApplicant) {
        coErrors.coRelation = "Relation with applicant is required";
      }
      if (!coApplicantData.maritalStatus) coErrors.coMarital = "Marital status is required";
      if (
        !coApplicantData.pan?.trim() ||
        coApplicantData.pan.length !== 10 ||
        !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(coApplicantData.pan.trim())
      ) {
        coErrors.coPan = "Valid 10-character PAN required (e.g. ABCPS1234F)";
      }
      if (!coApplicantDob) {
        coErrors.coDob = "Date of birth is required";
      } else if (differenceInYears(new Date(), coApplicantDob) < 18) {
        coErrors.coDob = "Co-applicant must be at least 18 years old";
      }
      if (!coApplicantData.email?.trim() || !coApplicantData.email.includes("@")) {
        coErrors.coEmail = "Valid email address is required";
      }
      if (!coApplicantData.highestEducation) coErrors.coHighestEducation = "Highest education is required";
      if (!coApplicantData.employmentType) coErrors.coEmploymentType = "Employment type is required";
      if (!coApplicantData.employerName?.trim()) coErrors.coEmployerName = "Employer name is required";
      if (!coApplicantData.salary || Number(coApplicantData.salary) <= 0) {
        coErrors.coSalary = "Valid monthly income is required";
      }
      if (!coApplicantData.address?.trim()) coErrors.coAddress = "Residential address is required";
      if (!coApplicantData.pinCode || coApplicantData.pinCode.length !== 6) {
        coErrors.coPinCode = "6-digit PIN code required";
      } else if (!coPinIsServiceable) {
        coErrors.coPinCode = "Selected PIN code is unserviceable";
      }
    }

    if (Object.keys(errors).length > 0 || Object.keys(coErrors).length > 0) {
      setValidationErrors(errors);
      setCoValidationErrors(coErrors);
      toast({
        title: "Validation Incomplete",
        description: "Please fill all mandatory fields marked with an asterisk (*) to proceed.",
        variant: "destructive",
      });
      return;
    }

    // Submit payload with or without financial fields
    onComplete({
      ...formData,
      mobile: mobileInput,
      dob: selectedDob ? format(selectedDob, "yyyy-MM-dd") : formData.dob,
      financialDecision,
      isCoApplicantRequired: financialDecision === "no",
      employerName: isMainApplicantFinancialRequired ? formData.employerName : undefined,
      salary: isMainApplicantFinancialRequired ? formData.salary : undefined,
      coApplicant: financialDecision === "no" ? {
        ...coApplicantData,
        dob: coApplicantDob ? format(coApplicantDob, "yyyy-MM-dd") : coApplicantData.dob,
        financialDecision,
        isMobileVerified: coMobileVerified,
        employerName: coApplicantData.employerName,
        salary: coApplicantData.salary,
        highestEducation: coApplicantData.highestEducation,
        employmentType: coApplicantData.employmentType || "Salaried",
      } : undefined,
    });
  };

  // State 1: Checking Status Loader
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

  // State 2: Verification Result Options
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
      <div className="border-l-4 border-blue-600 pl-4 pr-3 py-2 bg-blue-50/50 rounded-r-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
            title={
              isDemoFilled
                ? "Remove demo details from all fields"
                : "Fill all fields with demo customer & co-applicant details"
            }
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
                className="bg-[#004499] hover:bg-[#003377] text-white h-12 px-6 font-semibold cursor-pointer"
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
                className="h-12 px-5 text-slate-600 border-slate-300 hover:bg-slate-100 cursor-pointer"
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

        {/* ── Case Outlines: WIP or Rejected Blocker ── */}
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
                  className="bg-[#004499] hover:bg-[#003377] text-white cursor-pointer"
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
                className="cursor-pointer"
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
              className="mt-2 cursor-pointer"
              onClick={() => {
                setSelectedCase(null);
                setStatusChecked(false);
              }}
            >
              Try Another Number
            </Button>
          </div>
        )}

        {/* ── Case New: Full Customer Form Unlocked ── */}
        {selectedCase === "new" && (
          <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
            {/* ══════════════════════════════════════════════════════════════ */}
            {/* ── SECTION 1: MAIN APPLICANT DETAILS ── */}
            {/* ══════════════════════════════════════════════════════════════ */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#004499] shadow-2xs">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Main Applicant Details</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Primary applicant personal identity, residential address, education, and loan requirements.
                    </p>
                  </div>
                </div>
                <Badge className="text-[10px] font-bold self-start sm:self-auto bg-blue-50 text-[#004499] border-blue-200">
                  Primary Borrower
                </Badge>
              </div>

              {/* Subsection A: Main Applicant Personal & Identity Information */}
              <div className="bg-slate-50/60 rounded-xl border border-slate-200 p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2.5">
                  <User className="h-4 w-4 text-[#004499]" />
                  <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                    A. Personal & Identity Information
                  </h5>
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
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-slate-600">PAN Number *</Label>
                    {formData.pan.length === 10 && /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan) && (
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Valid PAN
                      </span>
                    )}
                  </div>
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
                      max={format(
                        new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
                        "yyyy-MM-dd"
                      )}
                    />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="px-3 border-slate-200 h-10 w-10 p-0 flex items-center justify-center shrink-0 cursor-pointer"
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

                {/* ── Financial Decision (Yes / No) Field ── */}
                <div className="md:col-span-3 pt-3 border-t border-slate-100 mt-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-2xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <Label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          Financial Decision *
                        </Label>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] font-bold px-2 py-0.5",
                            financialDecision === "yes"
                              ? "bg-blue-50 text-[#004499] border-blue-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          )}
                        >
                          {financialDecision === "yes"
                            ? "Main Applicant Financials"
                            : "Co-Applicant Required"}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {financialDecision === "yes"
                          ? "Main applicant provides employment and income details. Co-applicant is not required."
                          : "Main applicant financials skipped. Co-applicant details (Sections A, B & C) are required."}
                      </p>
                    </div>

                    <div
                      role="radiogroup"
                      aria-label="Financial Decision"
                      className="flex items-center gap-3 shrink-0"
                    >
                      <button
                        type="button"
                        role="radio"
                        aria-checked={financialDecision === "yes"}
                        id="btn-financial-decision-yes"
                        onClick={() => handleFinancialDecisionChange("yes")}
                        className={cn(
                          "flex items-center space-x-2.5 px-4 py-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all select-none",
                          financialDecision === "yes"
                            ? "bg-blue-50 border-[#004499] text-[#004499] shadow-xs ring-2 ring-[#004499]/20"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                        )}
                      >
                        <span
                          className={cn(
                            "h-4 w-4 rounded-full border flex items-center justify-center transition-all",
                            financialDecision === "yes"
                              ? "border-[#004499] bg-[#004499]"
                              : "border-slate-400 bg-white"
                          )}
                        >
                          {financialDecision === "yes" && (
                            <span className="h-1.5 w-1.5 rounded-full bg-white" />
                          )}
                        </span>
                        <span>Yes</span>
                      </button>

                      <button
                        type="button"
                        role="radio"
                        aria-checked={financialDecision === "no"}
                        id="btn-financial-decision-no"
                        onClick={() => handleFinancialDecisionChange("no")}
                        className={cn(
                          "flex items-center space-x-2.5 px-4 py-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all select-none",
                          financialDecision === "no"
                            ? "bg-blue-50 border-[#004499] text-[#004499] shadow-xs ring-2 ring-[#004499]/20"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                        )}
                      >
                        <span
                          className={cn(
                            "h-4 w-4 rounded-full border flex items-center justify-center transition-all",
                            financialDecision === "no"
                              ? "border-[#004499] bg-[#004499]"
                              : "border-slate-400 bg-white"
                          )}
                        >
                          {financialDecision === "no" && (
                            <span className="h-1.5 w-1.5 rounded-full bg-white" />
                          )}
                        </span>
                        <span>No</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              </div>

              {/* Subsection B: Main Applicant Address & Location Details */}
              <div className="bg-slate-50/60 rounded-xl border border-slate-200 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#004499]" />
                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                      B. Address & Location Details
                    </h5>
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

              {/* Subsection C: Education, Employment & Loan Requirements */}
              <div className="bg-slate-50/60 rounded-xl border border-slate-200 p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2.5">
                  <GraduationCap className="h-4 w-4 text-[#004499]" />
                  <div>
                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                      C. Education, Employment & Loan Requirements
                    </h5>
                  </div>
                </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Highest Education Qualification — mandatory */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-600">Highest Education Qualification *</Label>
                  <Select
                    value={formData.highestEducation || ""}
                    onValueChange={(val) => {
                      setFormData({ ...formData, highestEducation: val });
                      if (validationErrors.highestEducation) {
                        setValidationErrors((prev) => {
                          const n = { ...prev };
                          delete n.highestEducation;
                          return n;
                        });
                      }
                    }}
                  >
                    <SelectTrigger className="bg-slate-50 border-slate-200 text-sm">
                      <SelectValue placeholder="Select highest education qualification" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_EDUCATION_LEVELS.map((edu, idx) => (
                        <SelectItem key={idx} value={edu} className="text-xs py-2">
                          {edu}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {validationErrors.highestEducation && (
                    <p className="text-[11px] text-red-600 font-medium">{validationErrors.highestEducation}</p>
                  )}
                </div>

                {/* 2. Employment Type — mandatory dropdown: Salaried / Self-employed (only when Financial Decision = Yes) */}
                {financialDecision === "yes" && (
                  <div className="space-y-1.5 animate-in fade-in duration-300">
                    <Label className="text-xs font-bold text-slate-600">Employment Type *</Label>
                    <Select
                      value={formData.employmentType}
                      onValueChange={(val: "Salaried" | "Self-employed") => handleEmploymentTypeChange(val)}
                    >
                      <SelectTrigger className="bg-slate-50 border-slate-200 text-sm">
                        <SelectValue placeholder="Select employment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Salaried">Salaried</SelectItem>
                        <SelectItem value="Self-employed">Self-employed</SelectItem>
                      </SelectContent>
                    </Select>
                    {validationErrors.employmentType && (
                      <p className="text-[11px] text-red-600 font-medium">{validationErrors.employmentType}</p>
                    )}
                  </div>
                )}

                {/* 3. Employer Name — mandatory only when Financial Decision = Yes AND Employment Type = Salaried */}
                {financialDecision === "yes" && formData.employmentType === "Salaried" && (
                  <div className="space-y-1.5 animate-in fade-in duration-300">
                    <Label className="text-xs font-bold text-slate-600">Employer Name *</Label>
                    <Input
                      type="text"
                      placeholder="e.g. Tata Consultancy Services Ltd"
                      value={formData.employerName || ""}
                      onChange={(e) => {
                        setFormData({ ...formData, employerName: e.target.value });
                        if (validationErrors.employerName) {
                          setValidationErrors((prev) => {
                            const n = { ...prev };
                            delete n.employerName;
                            return n;
                          });
                        }
                      }}
                      className="bg-slate-50 border-slate-200 focus:bg-white text-sm"
                    />
                    {validationErrors.employerName && (
                      <p className="text-[11px] text-red-600 font-medium">{validationErrors.employerName}</p>
                    )}
                  </div>
                )}

                {/* 4. Salary / Monthly Income — mandatory only when Financial Decision = Yes AND Employment Type = Salaried */}
                {financialDecision === "yes" && formData.employmentType === "Salaried" && (
                  <div className="space-y-1.5 animate-in fade-in duration-300">
                    <Label className="text-xs font-bold text-slate-600">Salary / Monthly Income *</Label>
                    <Input
                      type="number"
                      min={10000}
                      placeholder="e.g. 85000"
                      value={formData.salary || ""}
                      onChange={(e) => {
                        setFormData({ ...formData, salary: Number(e.target.value) });
                        if (validationErrors.salary) {
                          setValidationErrors((prev) => {
                            const n = { ...prev };
                            delete n.salary;
                            return n;
                          });
                        }
                      }}
                      className="bg-slate-50 border-slate-200 focus:bg-white text-sm font-semibold"
                    />
                    {validationErrors.salary && (
                      <p className="text-[11px] text-red-600 font-medium">{validationErrors.salary}</p>
                    )}
                  </div>
                )}

                {/* 5. Course Name — retain existing validation */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-600">Course Name (10 Approved Programs) *</Label>
                  <Select
                    value={formData.courseName}
                    onValueChange={(val) => {
                      setFormData({ ...formData, courseName: val });
                      if (validationErrors.courseName) {
                        setValidationErrors((prev) => {
                          const n = { ...prev };
                          delete n.courseName;
                          return n;
                        });
                      }
                    }}
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
                  {validationErrors.courseName && (
                    <p className="text-[11px] text-red-600 font-medium">{validationErrors.courseName}</p>
                  )}
                </div>

                {/* 6. Loan Amount Required — retain existing validation */}
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

                {/* 7. Requested Loan Tenure — retain existing validation */}
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
              </div>

              {financialDecision === "yes" && formData.employmentType === "Self-employed" && (
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
              </div>

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* ── SECTION 2: CO-APPLICANT DETAILS (Visible only when Financial Decision = NO) ── */}
            {/* ══════════════════════════════════════════════════════════════ */}
            {financialDecision === "no" && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#004499] shadow-2xs">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Co-Applicant Details</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Capture co-applicant identity, relationship, and address details.
                    </p>
                  </div>
                </div>
                <Badge
                  className={cn(
                    "text-[10px] font-bold self-start sm:self-auto",
                    isCoApplicantValid
                      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                      : "bg-amber-100 text-amber-800 border-amber-300"
                  )}
                >
                  {isCoApplicantValid ? "✓ Ready to Submit" : "Pending Mandatory Fields"}
                </Badge>
              </div>

              {/* Subsection A: Co-Applicant Basic Details */}
              <div className="bg-slate-50/60 rounded-xl border border-slate-200 p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2.5">
                  <User className="h-4 w-4 text-[#004499]" />
                  <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                    A. Co-Applicant Basic Details
                  </h5>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-600">
                      Full Name (as per PAN) *
                    </Label>
                    <Input
                      value={coApplicantData.fullName}
                      onChange={(e) => {
                        setCoApplicantData({ ...coApplicantData, fullName: e.target.value });
                        if (coValidationErrors.coFullName) {
                          setCoValidationErrors((p) => {
                            const n = { ...p };
                            delete n.coFullName;
                            return n;
                          });
                        }
                      }}
                      className="bg-white border-slate-200 focus:bg-white text-sm"
                      placeholder="e.g. Aarav Sharma"
                    />
                    {coValidationErrors.coFullName && (
                      <p className="text-[11px] text-red-600 font-medium">
                        {coValidationErrors.coFullName}
                      </p>
                    )}
                  </div>

                  {/* Father's Name */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-600">Father's Name *</Label>
                    <Input
                      value={coApplicantData.fatherName}
                      onChange={(e) => {
                        setCoApplicantData({ ...coApplicantData, fatherName: e.target.value });
                        if (coValidationErrors.coFatherName) {
                          setCoValidationErrors((p) => {
                            const n = { ...p };
                            delete n.coFatherName;
                            return n;
                          });
                        }
                      }}
                      className="bg-white border-slate-200 focus:bg-white text-sm"
                      placeholder="e.g. Ramesh Sharma"
                    />
                    {coValidationErrors.coFatherName && (
                      <p className="text-[11px] text-red-600 font-medium">
                        {coValidationErrors.coFatherName}
                      </p>
                    )}
                  </div>

                  {/* Gender Dropdown */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-600">Gender *</Label>
                    <Select
                      value={coApplicantData.gender}
                      onValueChange={(val: "Male" | "Female" | "Other") => {
                        setCoApplicantData({ ...coApplicantData, gender: val });
                        if (coValidationErrors.coGender) {
                          setCoValidationErrors((p) => {
                            const n = { ...p };
                            delete n.coGender;
                            return n;
                          });
                        }
                      }}
                    >
                      <SelectTrigger className="bg-white border-slate-200 text-sm">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {coValidationErrors.coGender && (
                      <p className="text-[11px] text-red-600 font-medium">{coValidationErrors.coGender}</p>
                    )}
                  </div>

                  {/* Mobile Number with verification */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold text-slate-600">Mobile Number *</Label>
                      {coMobileVerified && (
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Mobile Verified
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400 select-none">
                          +91
                        </span>
                        <Input
                          type="tel"
                          placeholder="9876543210"
                          value={coApplicantData.mobile || ""}
                          maxLength={10}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                            setCoApplicantData((prev) => ({ ...prev, mobile: val }));
                            if (coMobileVerified) {
                              setCoMobileVerified(false);
                            }
                            if (coValidationErrors.coMobile) {
                              setCoValidationErrors((p) => {
                                const n = { ...p };
                                delete n.coMobile;
                                return n;
                              });
                            }
                          }}
                          className="pl-11 bg-white border-slate-200 text-sm font-mono tracking-wider focus:bg-white"
                        />
                      </div>
                      {!coMobileVerified ? (
                        <Button
                          type="button"
                          size="sm"
                          disabled={!coApplicantData.mobile || coApplicantData.mobile.length !== 10 || coMobileChecking}
                          onClick={handleVerifyCoMobile}
                          className="bg-[#004499] hover:bg-[#003377] text-white text-xs px-3 h-10 font-semibold cursor-pointer shrink-0"
                        >
                          {coMobileChecking ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            "Verify"
                          )}
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => setCoMobileVerified(false)}
                          className="border-slate-300 text-slate-600 text-xs px-2.5 h-10 hover:bg-slate-100 cursor-pointer shrink-0"
                        >
                          Change
                        </Button>
                      )}
                    </div>
                    {coValidationErrors.coMobile && (
                      <p className="text-[11px] text-red-600 font-medium">{coValidationErrors.coMobile}</p>
                    )}
                  </div>

                  {/* Relation with Applicant */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-600">Relation with Applicant *</Label>
                    <Select
                      value={coApplicantData.relationWithApplicant}
                      onValueChange={(val: any) => {
                        setCoApplicantData({ ...coApplicantData, relationWithApplicant: val });
                        if (coValidationErrors.coRelation) {
                          setCoValidationErrors((p) => {
                            const n = { ...p };
                            delete n.coRelation;
                            return n;
                          });
                        }
                      }}
                    >
                      <SelectTrigger className="bg-white border-slate-200 text-sm">
                        <SelectValue placeholder="Select relation" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_RELATIONS.map((rel) => (
                          <SelectItem key={rel} value={rel} className="text-xs">
                            {rel}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {coValidationErrors.coRelation && (
                      <p className="text-[11px] text-red-600 font-medium">{coValidationErrors.coRelation}</p>
                    )}
                  </div>

                  {/* Marital Status */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-600">Marital Status *</Label>
                    <Select
                      value={coApplicantData.maritalStatus}
                      onValueChange={(val: any) => {
                        setCoApplicantData({ ...coApplicantData, maritalStatus: val });
                        if (coValidationErrors.coMarital) {
                          setCoValidationErrors((p) => {
                            const n = { ...p };
                            delete n.coMarital;
                            return n;
                          });
                        }
                      }}
                    >
                      <SelectTrigger className="bg-white border-slate-200 text-sm">
                        <SelectValue placeholder="Select marital status" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_MARITAL_STATUSES.map((status) => (
                          <SelectItem key={status} value={status} className="text-xs">
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {coValidationErrors.coMarital && (
                      <p className="text-[11px] text-red-600 font-medium">{coValidationErrors.coMarital}</p>
                    )}
                  </div>

                  {/* PAN Number */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold text-slate-600">PAN Number *</Label>
                      {coApplicantData.pan.length === 10 &&
                        /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(coApplicantData.pan) && (
                          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> NSDL Verified
                          </span>
                        )}
                    </div>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        value={coApplicantData.pan}
                        maxLength={10}
                        onChange={(e) => {
                          const val = e.target.value.toUpperCase();
                          setCoApplicantData({ ...coApplicantData, pan: val });
                          if (coValidationErrors.coPan) {
                            setCoValidationErrors((p) => {
                              const n = { ...p };
                              delete n.coPan;
                              return n;
                            });
                          }
                        }}
                        className="pl-9 bg-white border-slate-200 focus:bg-white uppercase font-mono text-sm tracking-wider"
                        placeholder="ABCPS1234F"
                      />
                    </div>
                    {coValidationErrors.coPan && (
                      <p className="text-[11px] text-red-600 font-medium">{coValidationErrors.coPan}</p>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-600">
                      Date of Birth (Min 18 Yrs) *
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        className="h-10 bg-white border-slate-200 text-sm flex-1"
                        value={coApplicantDob ? format(coApplicantDob, "yyyy-MM-dd") : ""}
                        onChange={(e) => {
                          const d = new Date(e.target.value);
                          if (!isNaN(d.getTime())) handleCoDobChange(d);
                        }}
                        max={format(
                          new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
                          "yyyy-MM-dd"
                        )}
                      />
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="px-3 border-slate-200 h-10 w-10 p-0 flex items-center justify-center shrink-0 cursor-pointer"
                          >
                            <CalendarIcon className="h-4 w-4 text-slate-500" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={coApplicantDob}
                            onSelect={handleCoDobChange}
                            captionLayout="dropdown"
                            fromYear={1950}
                            toYear={new Date().getFullYear() - 18}
                            disabled={(date) =>
                              date >
                                new Date(
                                  new Date().setFullYear(new Date().getFullYear() - 18)
                                ) || date < new Date("1940-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    {coValidationErrors.coDob && (
                      <p className="text-[11px] text-red-600 font-medium flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {coValidationErrors.coDob}
                      </p>
                    )}
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-600">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        type="email"
                        value={coApplicantData.email}
                        onChange={(e) => {
                          setCoApplicantData({ ...coApplicantData, email: e.target.value });
                          if (coValidationErrors.coEmail) {
                            setCoValidationErrors((p) => {
                              const n = { ...p };
                              delete n.coEmail;
                              return n;
                            });
                          }
                        }}
                        className="pl-9 bg-white border-slate-200 focus:bg-white text-sm"
                        placeholder="aarav.sharma@example.com"
                      />
                    </div>
                    {coValidationErrors.coEmail && (
                      <p className="text-[11px] text-red-600 font-medium">{coValidationErrors.coEmail}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Subsection B: Co-Applicant Education, Employment & Income Details */}
              <div className="bg-slate-50/60 rounded-xl border border-slate-200 p-5 space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2.5">
                    <Briefcase className="h-4 w-4 text-[#004499]" />
                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                      B. Education, Employment & Income Details
                    </h5>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Highest Education */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-600">Highest Education *</Label>
                      <Select
                        value={coApplicantData.highestEducation}
                        onValueChange={(val) => {
                          setCoApplicantData({ ...coApplicantData, highestEducation: val });
                          if (coValidationErrors.coHighestEducation) {
                            setCoValidationErrors((p) => {
                              const n = { ...p };
                              delete n.coHighestEducation;
                              return n;
                            });
                          }
                        }}
                      >
                        <SelectTrigger className="bg-white border-slate-200 text-sm">
                          <SelectValue placeholder="Select education level" />
                        </SelectTrigger>
                        <SelectContent>
                          {MOCK_EDUCATION_LEVELS.map((edu, idx) => (
                            <SelectItem key={idx} value={edu} className="text-xs">
                              {edu}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {coValidationErrors.coHighestEducation && (
                        <p className="text-[11px] text-red-600 font-medium">
                          {coValidationErrors.coHighestEducation}
                        </p>
                      )}
                    </div>

                    {/* Employment Type */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-600">Employment Type *</Label>
                      <Select
                        value={coApplicantData.employmentType || "Salaried"}
                        onValueChange={(val: "Salaried" | "Self-employed") => {
                          setCoApplicantData({ ...coApplicantData, employmentType: val });
                          if (coValidationErrors.coEmploymentType) {
                            setCoValidationErrors((p) => {
                              const n = { ...p };
                              delete n.coEmploymentType;
                              return n;
                            });
                          }
                        }}
                      >
                        <SelectTrigger className="bg-white border-slate-200 text-sm">
                          <SelectValue placeholder="Select employment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Salaried">Salaried</SelectItem>
                          <SelectItem value="Self-employed">Self-employed</SelectItem>
                        </SelectContent>
                      </Select>
                      {coValidationErrors.coEmploymentType && (
                        <p className="text-[11px] text-red-600 font-medium">
                          {coValidationErrors.coEmploymentType}
                        </p>
                      )}
                    </div>

                    {/* Employer Name */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-600">Employer Name *</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          value={coApplicantData.employerName}
                          onChange={(e) => {
                            setCoApplicantData({ ...coApplicantData, employerName: e.target.value });
                            if (coValidationErrors.coEmployerName) {
                              setCoValidationErrors((p) => {
                                const n = { ...p };
                                delete n.coEmployerName;
                                return n;
                              });
                            }
                          }}
                          className="pl-9 bg-white border-slate-200 focus:bg-white text-sm"
                          placeholder="e.g. Tata Consultancy Services Ltd."
                        />
                      </div>
                      {coValidationErrors.coEmployerName && (
                        <p className="text-[11px] text-red-600 font-medium">
                          {coValidationErrors.coEmployerName}
                        </p>
                      )}
                    </div>

                    {/* Salary / Monthly Income */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-600">Salary / Monthly Income *</Label>
                      <Input
                        type="number"
                        value={coApplicantData.salary || ""}
                        onChange={(e) => {
                          setCoApplicantData({ ...coApplicantData, salary: Number(e.target.value) });
                          if (coValidationErrors.coSalary) {
                            setCoValidationErrors((p) => {
                              const n = { ...p };
                              delete n.coSalary;
                              return n;
                            });
                          }
                        }}
                        className="bg-white border-slate-200 focus:bg-white text-sm font-semibold"
                        placeholder="e.g. 85000"
                      />
                      {coValidationErrors.coSalary && (
                        <p className="text-[11px] text-red-600 font-medium">{coValidationErrors.coSalary}</p>
                      )}
                    </div>
                  </div>
                </div>

              {/* Subsection C: Co-Applicant Address & Location Details */}
              <div className="bg-slate-50/60 rounded-xl border border-slate-200 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#004499]" />
                    <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                      C. Address & Location Details
                    </h5>
                  </div>
                  {sameAsMainApplicantAddress ? (
                    <span className="text-[10px] text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full font-semibold">
                      Synced with Main Applicant
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-medium">
                      PIN-to-City Auto-Lookup Enabled
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Residential Address */}
                  <div className="space-y-1.5 md:col-span-2">
                    <Label className="text-xs font-bold text-slate-600">Residential Address *</Label>
                    <Input
                      value={coApplicantData.address}
                      disabled={sameAsMainApplicantAddress}
                      onChange={(e) => {
                        setCoApplicantData({ ...coApplicantData, address: e.target.value });
                        if (coValidationErrors.coAddress) {
                          setCoValidationErrors((p) => {
                            const n = { ...p };
                            delete n.coAddress;
                            return n;
                          });
                        }
                      }}
                      className={cn(
                        "border-slate-200 text-sm",
                        sameAsMainApplicantAddress
                          ? "bg-slate-100 text-slate-600 cursor-not-allowed"
                          : "bg-white focus:bg-white"
                      )}
                      placeholder="Flat 402, Green Glen Apartments, Bellandur"
                    />
                    {coValidationErrors.coAddress && (
                      <p className="text-[11px] text-red-600 font-medium">
                        {coValidationErrors.coAddress}
                      </p>
                    )}
                  </div>

                  {/* Nearby Landmark */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-600">Nearby Landmark</Label>
                    <Input
                      value={coApplicantData.landmark || ""}
                      disabled={sameAsMainApplicantAddress}
                      onChange={(e) =>
                        setCoApplicantData({ ...coApplicantData, landmark: e.target.value })
                      }
                      className={cn(
                        "border-slate-200 text-sm",
                        sameAsMainApplicantAddress
                          ? "bg-slate-100 text-slate-600 cursor-not-allowed"
                          : "bg-white focus:bg-white"
                      )}
                      placeholder="Near Central Mall"
                    />
                  </div>

                  {/* PIN Code */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-600">PIN Code *</Label>
                    <Input
                      value={coApplicantData.pinCode}
                      maxLength={6}
                      disabled={sameAsMainApplicantAddress}
                      onChange={(e) => handleCoPinChange(e.target.value)}
                      className={cn(
                        "border-slate-200 text-sm font-mono font-bold",
                        sameAsMainApplicantAddress
                          ? "bg-slate-100 text-slate-600 cursor-not-allowed"
                          : "bg-white focus:bg-white"
                      )}
                      placeholder="e.g. 560103"
                    />
                    {coPinValidationMsg && (
                      <p className="text-[11px] text-amber-700 font-medium flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {coPinValidationMsg}
                      </p>
                    )}
                    {coValidationErrors.coPinCode && (
                      <p className="text-[11px] text-red-600 font-medium">
                        {coValidationErrors.coPinCode}
                      </p>
                    )}
                  </div>

                  {/* City (Auto-populated) */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-600">City (Auto-populated)</Label>
                    <Input
                      value={coApplicantData.city}
                      readOnly
                      className="bg-slate-100 border-slate-200 text-sm font-semibold text-slate-700 cursor-not-allowed"
                    />
                  </div>

                  {/* State (Auto-populated) */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-600">State (Auto-populated)</Label>
                    <Input
                      value={coApplicantData.state}
                      readOnly
                      className="bg-slate-100 border-slate-200 text-sm font-semibold text-slate-700 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Same as Main Applicant Address Checkbox */}
                <div className="pt-2 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <Label
                      htmlFor="chk-same-as-main-address"
                      className="text-xs font-bold text-slate-800 cursor-pointer hover:text-[#004499] transition-colors"
                    >
                      Same as Main Applicant Address
                    </Label>
                    <p className="text-[11px] text-slate-500">
                      Auto-populate and synchronize co-applicant residential address with main applicant.
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <Checkbox
                      id="chk-same-as-main-address"
                      checked={sameAsMainApplicantAddress}
                      onCheckedChange={(checked) => setSameAsMainApplicantAddress(Boolean(checked))}
                      className="h-4 w-4 rounded border-slate-400 data-[state=checked]:bg-[#004499] data-[state=checked]:border-[#004499] cursor-pointer"
                    />
                    <Label
                      htmlFor="chk-same-as-main-address"
                      className="text-xs font-semibold text-slate-700 cursor-pointer select-none"
                    >
                      Same as Main Applicant
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          )}

            {/* ── Submit CTA (Unified Single Submission for Main + Co-Applicant) ── */}
            <div className="flex flex-col items-end gap-2 pt-4">
              {financialDecision === "yes" && formData.employmentType === "Self-employed" && (
                <p className="text-xs font-semibold text-rose-600 flex items-center gap-1.5 animate-in fade-in">
                  <Ban className="h-3.5 w-3.5" /> Save & Proceed disabled: Self-employed applicants are not eligible for digital education loans.
                </p>
              )}
              <Button
                type="submit"
                size="lg"
                disabled={financialDecision === "yes" && formData.employmentType === "Self-employed"}
                className={cn(
                  "px-8 h-12 rounded-xl font-bold uppercase tracking-wider text-xs gap-2 w-full md:w-auto transition-all cursor-pointer",
                  financialDecision === "yes" && formData.employmentType === "Self-employed"
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
