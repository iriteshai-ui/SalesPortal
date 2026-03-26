import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Mail,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Copy,
  Upload,
  Heart,
  ShieldCheck,
  Loader2,
  RefreshCw,
  MapPin,
  Hospital,
  FileText,
  Link as LinkIcon,
  User as UserIcon,
  Briefcase,
  Building2,
  Users,
  AlertCircle,
} from "lucide-react";
import confetti from "canvas-confetti";

type JourneyStage = "stage1" | "stage2" | "stage3" | "stage4";

const STAGES = [
  { id: 1, title: "Login" },
  { id: 2, title: "Basic Details" },
  { id: 3, title: "Hospital Details" },
  { id: 4, title: "KYC" },
];

const HOSPITAL_MASTER = [
  { code: "HSP001", name: "Apollo Hospitals", location: "21 Greams Lane, Chennai", pincode: "600006", tier: "1" },
  { code: "HSP002", name: "Fortis Healthcare", location: "B-22, Sector 62, Noida", pincode: "201301", tier: "1" },
  { code: "HSP003", name: "Max Super Specialty", location: "1 Press Enclave Road, Saket, New Delhi", pincode: "110017", tier: "1" },
  { code: "HSP004", name: "Manipal Hospital", location: "98 HAL Airport Road, Bangalore", pincode: "560017", tier: "2" },
  { code: "HSP005", name: "Kokilaben Ambani", location: "Rao Saheb Patwardhan Marg, Mumbai", pincode: "400053", tier: "1" },
  { code: "HSP006", name: "Narayana Health", location: "258/A, Bommasandra, Bangalore", pincode: "560099", tier: "2" },
  { code: "HSP007", name: "Medanta The Medicity", location: "Sector 38, Gurugram", pincode: "122001", tier: "1" },
  { code: "HSP008", name: "AIIMS Delhi", location: "Ansari Nagar East, New Delhi", pincode: "110029", tier: "1" },
];

const TREATMENT_TYPES = [
  "Cardiac Surgery", "Orthopedic Surgery", "Oncology Treatment",
  "Neurosurgery", "Transplant Surgery", "Bariatric Surgery",
  "IVF / Fertility Treatment", "Cosmetic / Plastic Surgery",
  "Dental Surgery", "Eye Surgery", "Dialysis", "Other",
];

const PINCODE_MAP: Record<string, { city: string; state: string }> = {
  "400001": { city: "Mumbai", state: "Maharashtra" },
  "400051": { city: "Mumbai", state: "Maharashtra" },
  "400053": { city: "Mumbai", state: "Maharashtra" },
  "110001": { city: "New Delhi", state: "Delhi" },
  "110017": { city: "New Delhi", state: "Delhi" },
  "110029": { city: "New Delhi", state: "Delhi" },
  "560001": { city: "Bangalore", state: "Karnataka" },
  "560017": { city: "Bangalore", state: "Karnataka" },
  "560099": { city: "Bangalore", state: "Karnataka" },
  "600001": { city: "Chennai", state: "Tamil Nadu" },
  "600006": { city: "Chennai", state: "Tamil Nadu" },
  "700001": { city: "Kolkata", state: "West Bengal" },
  "500001": { city: "Hyderabad", state: "Telangana" },
  "411001": { city: "Pune", state: "Maharashtra" },
  "380001": { city: "Ahmedabad", state: "Gujarat" },
  "302001": { city: "Jaipur", state: "Rajasthan" },
  "226001": { city: "Lucknow", state: "Uttar Pradesh" },
  "122001": { city: "Gurugram", state: "Haryana" },
  "201301": { city: "Noida", state: "Uttar Pradesh" },
};

function mockPincode(pin: string) {
  return new Promise<{ city: string; state: string } | null>((res) =>
    setTimeout(() => res(PINCODE_MAP[pin] || null), 500)
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="text-rose-500 text-xs font-semibold mt-1 flex items-center gap-1">
      <AlertCircle className="h-3 w-3 shrink-0" /> {msg}
    </p>
  );
}

export default function HlLeadJourneyPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [stage, setStage] = useState<JourneyStage>("stage1");
  const [currentStepId, setCurrentStepId] = useState(1);

  const progressPct = Math.round(((currentStepId - 1) / (STAGES.length - 1)) * 100);

  const goTo = (s: JourneyStage, step: number) => {
    setStage(s);
    setCurrentStepId(step);
  };

  // ─── Stage 1: Login / OTP ───────────────────────────────────────────────
  const [email, setEmail] = useState("ananya.mehta@gmail.com");
  const [emailError, setEmailError] = useState("");
  const [otpSent, setOtpSent] = useState(true);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otp, setOtp] = useState("123456");
  const [otpError, setOtpError] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpRetries, setOtpRetries] = useState(0);
  const [resendTimer, setResendTimer] = useState(0);
  const resendRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startResendTimer = () => {
    setResendTimer(60);
    resendRef.current = setInterval(() => {
      setResendTimer((t) => {
        if (t <= 1) { clearInterval(resendRef.current!); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  useEffect(() => () => { if (resendRef.current) clearInterval(resendRef.current); }, []);

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSendOtp = () => {
    if (!email.trim()) { setEmailError("Email is required."); return; }
    if (!isValidEmail(email)) { setEmailError("Enter a valid email address."); return; }
    setEmailError("");
    setSendingOtp(true);
    setTimeout(() => {
      setSendingOtp(false);
      setOtpSent(true);
      startResendTimer();
      toast({ title: "OTP Sent", description: `A 6-digit OTP has been sent to ${email}` });
    }, 1200);
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    setOtp("");
    setOtpError("");
    setOtpRetries(0);
    startResendTimer();
    toast({ title: "OTP Resent", description: "A new OTP has been sent." });
  };

  const handleVerifyOtp = () => {
    if (!otp.trim()) { setOtpError("OTP is required."); return; }
    if (!/^\d{6}$/.test(otp)) { setOtpError("Enter a valid 6-digit OTP."); return; }
    setVerifyingOtp(true);
    setTimeout(() => {
      setVerifyingOtp(false);
      if (otp === "123456") {
        toast({ title: "Email Verified", description: "OTP verified successfully!" });
        goTo("stage2", 2);
      } else {
        const remaining = 2 - otpRetries;
        if (otpRetries >= 2) {
          setOtpError("Maximum retries exceeded. Please resend OTP.");
        } else {
          setOtpRetries((r) => r + 1);
          setOtpError(`Incorrect OTP. ${remaining} attempt(s) remaining. (Hint: use 123456)`);
        }
      }
    }, 1200);
  };

  // ─── Stage 2: Basic Details ─────────────────────────────────────────────
  const [s2, setS2] = useState({
    borrowerName: "Ananya Mehta",
    fatherName: "Rajesh Mehta",
    gender: "Female",
    occupation: "salaried",
    employeeName: "InfoSys Ltd",
    netSalary: "85000",
    totalExp: "6",
    officeAddress: "Tower A, EPIP Zone, Whitefield",
    incomeMode: "Bank Transfer",
    officePincode: "560066",
    officialEmail: "ananya.mehta@infosys.com",
    personalEmail: "ananya.mehta@gmail.com",
    addr1: "12 Sunrise Heights, MG Road",
    addr2: "Near City Hospital, Bangalore",
    pincode: "560001",
    city: "Bangalore",
    state: "Karnataka",
    borrowingFor: "self",
    relationship: "",
    patientName: "",
    patientGender: "",
    patientMobile: "",
  });
  const [s2Errors, setS2Errors] = useState<Record<string, string>>({});
  const [pincodeLoading, setPincodeLoading] = useState(false);

  const nameOnlyRegex = /^[A-Za-z\s]+$/;
  const addressRegex = (v: string) =>
    v.trim().length >= 10 && /\s/.test(v.trim()) && !/[^A-Za-z0-9\s,./\-]/.test(v) &&
    v.trim()[0] !== " " && v.trim()[v.trim().length - 1] !== " ";

  const handleS2PincodeBlur = async () => {
    const pin = s2.pincode;
    if (!/^\d{6}$/.test(pin) || pin[0] === "0") {
      setS2Errors((e) => ({ ...e, pincode: "Enter a valid 6-digit pincode not starting with 0." }));
      setS2({ ...s2, city: "", state: "" });
      return;
    }
    setPincodeLoading(true);
    const result = await mockPincode(pin);
    setPincodeLoading(false);
    if (result) {
      setS2({ ...s2, city: result.city, state: result.state });
      setS2Errors((e) => ({ ...e, pincode: "" }));
    } else {
      setS2Errors((e) => ({ ...e, pincode: "Pincode not found. City/State not auto-filled." }));
      setS2({ ...s2, city: "", state: "" });
    }
  };

  const validateS2 = () => {
    const errs: Record<string, string> = {};
    if (!s2.borrowerName.trim()) errs.borrowerName = "Borrower name is required.";
    else if (s2.borrowerName.length > 40) errs.borrowerName = "Max 40 characters allowed.";
    else if (!nameOnlyRegex.test(s2.borrowerName)) errs.borrowerName = "Only letters and spaces allowed.";

    if (!s2.fatherName.trim()) errs.fatherName = "Father's name is required.";
    else if (s2.fatherName.length > 40) errs.fatherName = "Max 40 characters allowed.";
    else if (!nameOnlyRegex.test(s2.fatherName)) errs.fatherName = "Only letters and spaces allowed.";

    if (!s2.gender) errs.gender = "Gender is required.";

    if (s2.occupation === "salaried") {
      if (!s2.employeeName.trim()) errs.employeeName = "Employee name is required.";
      if (!s2.netSalary.trim() || isNaN(Number(s2.netSalary)) || Number(s2.netSalary) <= 0) errs.netSalary = "Enter a valid salary amount.";
      if (!s2.totalExp.trim() || isNaN(Number(s2.totalExp)) || Number(s2.totalExp) < 0) errs.totalExp = "Enter valid experience (years).";
      if (!s2.officeAddress.trim()) errs.officeAddress = "Office address is required.";
      if (!s2.incomeMode) errs.incomeMode = "Income mode is required.";
      if (!s2.officePincode.trim() || !/^\d{6}$/.test(s2.officePincode)) errs.officePincode = "Enter a valid 6-digit pincode.";
      if (!s2.officialEmail.trim() || !isValidEmail(s2.officialEmail)) errs.officialEmail = "Enter a valid official email.";
    }

    if (!s2.personalEmail.trim()) errs.personalEmail = "Personal email is required.";
    else if (!isValidEmail(s2.personalEmail)) errs.personalEmail = "Enter a valid email address.";

    if (!s2.addr1.trim()) errs.addr1 = "Address line 1 is required.";
    else if (!addressRegex(s2.addr1)) errs.addr1 = "Min 10 chars, must contain a space, no special chars, no leading/trailing spaces.";

    if (!s2.addr2.trim()) errs.addr2 = "Address line 2 is required.";
    else if (!addressRegex(s2.addr2)) errs.addr2 = "Min 10 chars, must contain a space, no special chars, no leading/trailing spaces.";

    if (!s2.pincode.trim()) errs.pincode = "Pincode is required.";
    else if (!/^\d{6}$/.test(s2.pincode) || s2.pincode[0] === "0") errs.pincode = "Enter a valid 6-digit pincode not starting with 0.";
    else if (!s2.city || !s2.state) errs.pincode = "Pincode city/state not resolved. Please re-enter.";

    if (s2.borrowingFor === "family") {
      if (!s2.relationship) errs.relationship = "Relationship is required.";
      if (!s2.patientName.trim()) errs.patientName = "Patient name is required.";
      else if (!nameOnlyRegex.test(s2.patientName)) errs.patientName = "Only letters and spaces allowed.";
      if (!s2.patientGender) errs.patientGender = "Patient gender is required.";
      if (!s2.patientMobile.trim()) errs.patientMobile = "Mobile number is required.";
      else if (!/^[6-9]\d{9}$/.test(s2.patientMobile)) errs.patientMobile = "Enter a valid 10-digit Indian mobile number.";
    }

    setS2Errors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleS2Submit = () => {
    if (!validateS2()) return;
    goTo("stage3", 3);
  };

  // ─── Stage 3: Hospital Details ───────────────────────────────────────────
  const [s3, setS3] = useState({
    hospitalCode: "HSP005",
    hospitalName: "Kokilaben Ambani",
    hospitalLocation: "Rao Saheb Patwardhan Marg, Mumbai",
    hospitalPincode: "400053",
    hospitalTier: "1",
    financeType: "Patient Finance",
    treatmentType: "Cardiac Surgery",
    treatmentCost: "350000.00",
  });
  const [s3Errors, setS3Errors] = useState<Record<string, string>>({});
  const [journeyLink, setJourneyLink] = useState("");
  const [linkGenerated, setLinkGenerated] = useState(false);

  const handleHospitalCodeChange = (code: string) => {
    const h = HOSPITAL_MASTER.find((x) => x.code === code);
    if (h) {
      setS3({
        ...s3,
        hospitalCode: code,
        hospitalName: h.name,
        hospitalLocation: h.location,
        hospitalPincode: h.pincode,
        hospitalTier: h.tier,
      });
    } else {
      setS3({ ...s3, hospitalCode: code, hospitalName: "", hospitalLocation: "", hospitalPincode: "", hospitalTier: "" });
    }
  };

  const handleHospitalNameChange = (name: string) => {
    const h = HOSPITAL_MASTER.find((x) => x.name === name);
    if (h) {
      setS3({
        ...s3,
        hospitalName: name,
        hospitalCode: h.code,
        hospitalLocation: h.location,
        hospitalPincode: h.pincode,
        hospitalTier: h.tier,
      });
    } else {
      setS3({ ...s3, hospitalName: name });
    }
  };

  const validateS3 = () => {
    const errs: Record<string, string> = {};
    if (!s3.hospitalCode) errs.hospitalCode = "Hospital code is required.";
    if (!s3.hospitalName) errs.hospitalName = "Hospital name is required.";
    if (!s3.hospitalTier.trim() || isNaN(Number(s3.hospitalTier))) errs.hospitalTier = "Enter a valid numeric hospital tier.";
    if (!s3.financeType) errs.financeType = "Finance type is required.";
    if (!s3.treatmentType) errs.treatmentType = "Treatment type is required.";
    if (s3.treatmentCost && (isNaN(Number(s3.treatmentCost)) || Number(s3.treatmentCost) < 0))
      errs.treatmentCost = "Enter a valid positive amount.";
    setS3Errors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleGenerateLink = () => {
    if (!validateS3()) return;
    const dummy = `https://healthprime.nbfc.com/journey?ref=HP${Date.now()}&hosp=${s3.hospitalCode}&ft=${s3.financeType === "Patient Finance" ? "PF" : "RF"}&email=${encodeURIComponent(email)}`;
    setJourneyLink(dummy);
    setLinkGenerated(true);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.3 }, colors: ["#004499", "#10b981", "#fbbf24"] });
    toast({ title: "Journey Link Generated!", description: "Copy and share with the customer." });
  };

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({ title: "Copied!", description: "Link copied to clipboard." });
  };

  const handleS3Continue = () => {
    if (!linkGenerated) { toast({ variant: "destructive", title: "Generate Link First", description: "Please generate the journey link before continuing." }); return; }
    goTo("stage4", 4);
  };

  // ─── Stage 4: KYC ───────────────────────────────────────────────────────
  const kycLink = `https://kyc.nbfc.com/verify?ref=KYC${Date.now()}&email=${encodeURIComponent(email)}`;
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, { name: string; size: string }>>({});
  const [s4Errors, setS4Errors] = useState<Record<string, string>>({});
  const [invoiceAmount, setInvoiceAmount] = useState("350000");
  const [insuranceAmount, setInsuranceAmount] = useState("75000");

  const handleFileUpload = (key: string, file: File | null) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast({ variant: "destructive", title: "Invalid file type", description: "Only PDF files are supported." });
      return;
    }
    setUploadedDocs((prev) => ({ ...prev, [key]: { name: file.name, size: (file.size / 1024).toFixed(1) + " KB" } }));
    setS4Errors((e) => ({ ...e, [key]: "" }));
    toast({ title: "Document Uploaded", description: `${file.name} uploaded successfully.` });
  };

  const validateS4 = () => {
    const errs: Record<string, string> = {};
    if (!uploadedDocs["invoice"]) errs.invoice = "Invoice document is required.";
    if (!invoiceAmount.trim() || isNaN(Number(invoiceAmount)) || Number(invoiceAmount) <= 0)
      errs.invoiceAmount = "Enter a valid positive invoice amount.";
    if (s3.financeType === "Reimbursement Finance") {
      if (!uploadedDocs["insuranceDoc"]) errs.insuranceDoc = "Insurance underwriting document is required.";
      if (!insuranceAmount.trim() || isNaN(Number(insuranceAmount)) || Number(insuranceAmount) <= 0)
        errs.insuranceAmount = "Enter a valid positive insurance amount.";
    }
    setS4Errors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleS4Submit = () => {
    if (!validateS4()) return;
    confetti({ particleCount: 200, spread: 90, origin: { y: 0.4 }, colors: ["#004499", "#10b981", "#fbbf24", "#f43f5e"] });
    toast({ title: "Application Submitted!", description: "Health Prime Lead journey completed successfully." });
    setTimeout(() => setLocation("/dashboard"), 1800);
  };

  // ─── Progress Bar ────────────────────────────────────────────────────────
  const renderProgress = () => (
    <div className="relative py-6 px-2">
      <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full" />
      <div
        className="absolute top-1/2 left-0 h-1 bg-[#004499] -translate-y-1/2 transition-all duration-700 ease-in-out rounded-full shadow-[0_0_12px_rgba(0,68,153,0.4)]"
        style={{ width: `${progressPct}%` }}
      />
      <div className="relative flex justify-between items-center">
        {STAGES.map((s) => {
          const done = currentStepId > s.id;
          const active = currentStepId === s.id;
          return (
            <div key={s.id} className="flex flex-col items-center">
              <div className={cn(
                "relative w-9 h-9 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all duration-500 z-10",
                done ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100"
                  : active ? "bg-white border-[#004499] text-[#004499] ring-4 ring-blue-50 shadow-md scale-110"
                  : "bg-white border-slate-200 text-slate-300"
              )}>
                {done ? <CheckCircle2 className="h-5 w-5" /> : s.id}
              </div>
              <span className={cn(
                "mt-3 text-[10px] font-black uppercase tracking-widest transition-colors duration-300",
                active ? "text-[#004499]" : done ? "text-emerald-600" : "text-slate-400"
              )}>{s.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const handleDemoUpload = (key: string, label: string) => {
    const demoName = label.replace(/[^a-zA-Z0-9]/g, "_").replace(/_+$/, "");
    setUploadedDocs((prev) => ({ ...prev, [key]: { name: `${demoName}_demo.pdf`, size: "142.5 KB" } }));
    setS4Errors((e) => ({ ...e, [key]: "" }));
    toast({ title: "Demo Document Loaded", description: `${label} loaded with demo file.` });
  };

  // ─── File Upload Widget ───────────────────────────────────────────────────
  const FileUpload = ({ docKey, label }: { docKey: string; label: string }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const doc = uploadedDocs[docKey];
    return (
      <div className="space-y-2">
        <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</Label>
        <div
          onClick={() => inputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all",
            doc ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-slate-50 hover:border-[#004499] hover:bg-blue-50"
          )}
        >
          {doc ? (
            <div className="flex items-center justify-center gap-3">
              <FileText className="h-6 w-6 text-emerald-600" />
              <div className="text-left">
                <p className="text-sm font-bold text-emerald-700">{doc.name}</p>
                <p className="text-xs text-emerald-500">{doc.size}</p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-emerald-500 ml-auto" />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-slate-300" />
              <p className="text-sm font-semibold text-slate-500">Click to upload PDF</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">File type supported: PDF</p>
            </div>
          )}
        </div>
        <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => handleFileUpload(docKey, e.target.files?.[0] || null)} />
        {!doc && (
          <button
            type="button"
            onClick={() => handleDemoUpload(docKey, label.replace(" *", ""))}
            className="text-xs font-bold text-amber-600 hover:text-amber-700 underline underline-offset-2 flex items-center gap-1 mt-1 transition-colors"
          >
            <FileText className="h-3 w-3" /> Use Demo File (UAT only)
          </button>
        )}
        {doc && (
          <button
            type="button"
            onClick={() => setUploadedDocs((prev) => { const n = { ...prev }; delete n[docKey]; return n; })}
            className="text-xs font-bold text-rose-400 hover:text-rose-600 underline underline-offset-2 flex items-center gap-1 mt-1 transition-colors"
          >
            <XCircle className="h-3 w-3" /> Remove
          </button>
        )}
        <FieldError msg={s4Errors[docKey]} />
      </div>
    );
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
            <h1 className="text-3xl font-heading font-black text-slate-900 tracking-tight">Health Prime Lead</h1>
            <p className="text-slate-500 mt-1 font-medium italic">Healthcare finance pre-offer journey.</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Journey Progress</p>
            <p className="text-sm font-black text-[#004499]">{progressPct}% Complete</p>
          </div>
        </div>
        {renderProgress()}
      </div>
      <Card className="shadow-2xl border-slate-200/60 overflow-hidden rounded-2xl">
        <CardContent className="p-0">

          {/* ── STAGE 1: Login / OTP ── */}
          {stage === "stage1" && (
            <div className="p-10 max-w-lg mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
                  <Mail className="text-[#004499] h-8 w-8" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Email Verification</h2>
                <p className="text-slate-500 text-sm font-medium">Enter the FOS email to send an OTP.</p>
              </div>

              <div className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Email ID</Label>
                  <div className="flex gap-3">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                      placeholder="customer@email.com"
                      className={cn("h-12 flex-1 bg-slate-50 border-slate-200 focus:bg-white", emailError && "border-rose-500 bg-rose-50")}
                      disabled={otpSent}
                      autoComplete="email"
                    />
                    <Button
                      onClick={handleSendOtp}
                      disabled={sendingOtp || otpSent}
                      className="h-12 px-5 bg-[#004499] hover:bg-[#003377] font-bold text-sm whitespace-nowrap"
                    >
                      {sendingOtp ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send OTP"}
                    </Button>
                  </div>
                  <FieldError msg={emailError} />
                  {otpSent && (
                    <p className="text-emerald-600 text-xs font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> OTP sent to {email}
                    </p>
                  )}
                </div>

                {/* OTP */}
                {otpSent && (
                  <div className="space-y-2 animate-in slide-in-from-bottom-2 duration-300">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">OTP</Label>
                    <div className="flex gap-3">
                      <Input
                        value={otp}
                        onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); setOtpError(""); }}
                        placeholder="6-digit OTP"
                        className={cn("h-12 flex-1 font-mono tracking-[0.3em] text-lg bg-slate-50 border-slate-200 focus:bg-white", otpError && "border-rose-500 bg-rose-50")}
                        maxLength={6}
                      />
                      <Button
                        onClick={handleVerifyOtp}
                        disabled={verifyingOtp || otpRetries >= 3}
                        className="h-12 px-5 bg-emerald-600 hover:bg-emerald-700 font-bold text-sm whitespace-nowrap"
                      >
                        {verifyingOtp ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify OTP"}
                      </Button>
                    </div>
                    <FieldError msg={otpError} />
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] text-slate-400">
                        {otpRetries > 0 && `${3 - otpRetries} attempt(s) left • `}
                        <span className="text-slate-400 italic">Hint: use 123456</span>
                      </p>
                      <button
                        onClick={handleResendOtp}
                        disabled={resendTimer > 0}
                        className={cn(
                          "text-xs font-bold flex items-center gap-1 transition-colors",
                          resendTimer > 0 ? "text-slate-300 cursor-not-allowed" : "text-[#004499] hover:underline"
                        )}
                      >
                        <RefreshCw className="h-3 w-3" />
                        {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── STAGE 2: Basic Details ── */}
          {stage === "stage2" && (
            <div className="p-10 space-y-8 animate-in slide-in-from-right-8 duration-500">
              <div className="border-l-4 border-[#004499] pl-6 py-2">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Basic Details</h2>
                <p className="text-slate-500 text-sm font-medium italic">Capture borrower and patient information.</p>
              </div>

              <div className="space-y-8">
                {/* Borrower Info */}
                <section className="space-y-5">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <UserIcon className="h-4 w-4" /> Borrower Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Borrower Full Name *</Label>
                      <Input value={s2.borrowerName} onChange={(e) => setS2({ ...s2, borrowerName: e.target.value })} placeholder="As per Aadhaar" maxLength={40} className={cn("h-12 bg-slate-50 border-slate-200 focus:bg-white", s2Errors.borrowerName && "border-rose-500")} />
                      <FieldError msg={s2Errors.borrowerName} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Father's Full Name *</Label>
                      <Input value={s2.fatherName} onChange={(e) => setS2({ ...s2, fatherName: e.target.value })} placeholder="Father's name" maxLength={40} className={cn("h-12 bg-slate-50 border-slate-200 focus:bg-white", s2Errors.fatherName && "border-rose-500")} />
                      <FieldError msg={s2Errors.fatherName} />
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Gender *</Label>
                    <RadioGroup value={s2.gender} onValueChange={(v) => setS2({ ...s2, gender: v })} className="flex gap-8">
                      {["Male", "Female"].map((g) => (
                        <div key={g} className="flex items-center space-x-2">
                          <RadioGroupItem value={g} id={`gender-${g}`} />
                          <label htmlFor={`gender-${g}`} className="text-sm font-semibold cursor-pointer">{g}</label>
                        </div>
                      ))}
                    </RadioGroup>
                    <FieldError msg={s2Errors.gender} />
                  </div>
                </section>

                {/* Occupation */}
                <section className="space-y-5">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Briefcase className="h-4 w-4" /> Occupation
                  </h3>
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Occupation Type *</Label>
                    <RadioGroup value={s2.occupation} onValueChange={(v) => setS2({ ...s2, occupation: v })} className="flex gap-8">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="salaried" id="occ-sal" />
                        <label htmlFor="occ-sal" className="text-sm font-semibold cursor-pointer">Salaried (SAL)</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="self_employed" id="occ-se" />
                        <label htmlFor="occ-se" className="text-sm font-semibold cursor-pointer">Self-Employed (SE)</label>
                      </div>
                    </RadioGroup>
                  </div>

                  {s2.occupation === "salaried" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 mt-2 p-6 bg-blue-50/50 rounded-xl border border-blue-100 animate-in slide-in-from-top-2 duration-300">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Employee / Company Name *</Label>
                        <Input value={s2.employeeName} onChange={(e) => setS2({ ...s2, employeeName: e.target.value })} placeholder="Company name" className={cn("h-11 bg-white border-slate-200", s2Errors.employeeName && "border-rose-500")} />
                        <FieldError msg={s2Errors.employeeName} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Net Monthly Salary (₹) *</Label>
                        <Input value={s2.netSalary} onChange={(e) => setS2({ ...s2, netSalary: e.target.value.replace(/\D/g, "") })} placeholder="e.g. 75000" className={cn("h-11 bg-white border-slate-200", s2Errors.netSalary && "border-rose-500")} />
                        <FieldError msg={s2Errors.netSalary} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Experience (Years) *</Label>
                        <Input value={s2.totalExp} onChange={(e) => setS2({ ...s2, totalExp: e.target.value.replace(/\D/g, "") })} placeholder="e.g. 5" className={cn("h-11 bg-white border-slate-200", s2Errors.totalExp && "border-rose-500")} />
                        <FieldError msg={s2Errors.totalExp} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Income Mode *</Label>
                        <Select value={s2.incomeMode} onValueChange={(v) => setS2({ ...s2, incomeMode: v })}>
                          <SelectTrigger className={cn("h-11 bg-white border-slate-200", s2Errors.incomeMode && "border-rose-500")}>
                            <SelectValue placeholder="Select income mode" />
                          </SelectTrigger>
                          <SelectContent>
                            {["Bank Transfer", "Cash", "Cheque", "UPI / Digital"].map((m) => (
                              <SelectItem key={m} value={m}>{m}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FieldError msg={s2Errors.incomeMode} />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Office Work Address *</Label>
                        <Input value={s2.officeAddress} onChange={(e) => setS2({ ...s2, officeAddress: e.target.value })} placeholder="Office building, area" className={cn("h-11 bg-white border-slate-200", s2Errors.officeAddress && "border-rose-500")} />
                        <FieldError msg={s2Errors.officeAddress} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Office Pincode *</Label>
                        <Input value={s2.officePincode} onChange={(e) => setS2({ ...s2, officePincode: e.target.value.replace(/\D/g, "").slice(0, 6) })} placeholder="6-digit pincode" maxLength={6} className={cn("h-11 bg-white border-slate-200", s2Errors.officePincode && "border-rose-500")} />
                        <FieldError msg={s2Errors.officePincode} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Official Email ID *</Label>
                        <Input type="email" value={s2.officialEmail} onChange={(e) => setS2({ ...s2, officialEmail: e.target.value })} placeholder="work@company.com" className={cn("h-11 bg-white border-slate-200", s2Errors.officialEmail && "border-rose-500")} />
                        <FieldError msg={s2Errors.officialEmail} />
                      </div>
                    </div>
                  )}
                </section>

                {/* Personal Email */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Personal Email ID *</Label>
                  <Input type="email" value={s2.personalEmail} onChange={(e) => setS2({ ...s2, personalEmail: e.target.value })} placeholder="personal@email.com" className={cn("h-12 bg-slate-50 border-slate-200 focus:bg-white", s2Errors.personalEmail && "border-rose-500")} />
                  <FieldError msg={s2Errors.personalEmail} />
                </div>

                {/* Communication Address */}
                <section className="space-y-5">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Communication Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Address Line 1 *</Label>
                      <Input value={s2.addr1} onChange={(e) => setS2({ ...s2, addr1: e.target.value })} placeholder="Building/Flat no., Street (min 10 chars)" className={cn("h-12 bg-slate-50 border-slate-200 focus:bg-white", s2Errors.addr1 && "border-rose-500")} />
                      <FieldError msg={s2Errors.addr1} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Address Line 2 *</Label>
                      <Input value={s2.addr2} onChange={(e) => setS2({ ...s2, addr2: e.target.value })} placeholder="Locality, Landmark (min 10 chars)" className={cn("h-12 bg-slate-50 border-slate-200 focus:bg-white", s2Errors.addr2 && "border-rose-500")} />
                      <FieldError msg={s2Errors.addr2} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Pincode *</Label>
                      <Input
                        value={s2.pincode}
                        onChange={(e) => setS2({ ...s2, pincode: e.target.value.replace(/\D/g, "").slice(0, 6), city: "", state: "" })}
                        onBlur={handleS2PincodeBlur}
                        placeholder="6-digit pincode"
                        maxLength={6}
                        className={cn("h-12 bg-slate-50 border-slate-200 focus:bg-white", s2Errors.pincode && "border-rose-500")}
                      />
                      <FieldError msg={s2Errors.pincode} />
                      {pincodeLoading && <p className="text-xs text-slate-400 flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Fetching city/state…</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">City</Label>
                      <Input value={s2.city} readOnly placeholder="Auto-filled from pincode" className="h-12 bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">State</Label>
                      <Input value={s2.state} readOnly placeholder="Auto-filled from pincode" className="h-12 bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed" />
                    </div>
                  </div>
                </section>

                {/* Borrowing For */}
                <section className="space-y-5">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Users className="h-4 w-4" /> Borrowing For
                  </h3>
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Are you borrowing for yourself? *</Label>
                    <RadioGroup value={s2.borrowingFor} onValueChange={(v) => setS2({ ...s2, borrowingFor: v })} className="space-y-3">
                      <div className="flex items-center space-x-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-[#004499] hover:bg-blue-50/30 transition-all">
                        <RadioGroupItem value="self" id="borrow-self" />
                        <label htmlFor="borrow-self" className="text-sm font-semibold cursor-pointer">Yes, I'm borrowing for myself.</label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-[#004499] hover:bg-blue-50/30 transition-all">
                        <RadioGroupItem value="family" id="borrow-family" />
                        <label htmlFor="borrow-family" className="text-sm font-semibold cursor-pointer">No, I'm borrowing for a family member.</label>
                      </div>
                    </RadioGroup>
                  </div>

                  {s2.borrowingFor === "family" && (
                    <div className="mt-4 p-6 bg-rose-50/40 rounded-xl border border-rose-100 space-y-5 animate-in slide-in-from-top-2 duration-300">
                      <p className="text-xs font-black uppercase tracking-widest text-rose-600">Patient / Family Member Details</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Relationship *</Label>
                          <Select value={s2.relationship} onValueChange={(v) => setS2({ ...s2, relationship: v })}>
                            <SelectTrigger className={cn("h-11 bg-white border-slate-200", s2Errors.relationship && "border-rose-500")}>
                              <SelectValue placeholder="I'm borrowing for my..." />
                            </SelectTrigger>
                            <SelectContent>
                              {["Mother", "Father", "Son", "Daughter", "Spouse", "Sibling"].map((r) => (
                                <SelectItem key={r} value={r}>{r}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FieldError msg={s2Errors.relationship} />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Patient Gender *</Label>
                          <RadioGroup value={s2.patientGender} onValueChange={(v) => setS2({ ...s2, patientGender: v })} className="flex gap-6 pt-1">
                            {["Male", "Female"].map((g) => (
                              <div key={g} className="flex items-center space-x-2">
                                <RadioGroupItem value={g} id={`pg-${g}`} />
                                <label htmlFor={`pg-${g}`} className="text-sm font-semibold cursor-pointer">{g}</label>
                              </div>
                            ))}
                          </RadioGroup>
                          <FieldError msg={s2Errors.patientGender} />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Patient Name (as per Aadhaar) *</Label>
                          <Input value={s2.patientName} onChange={(e) => setS2({ ...s2, patientName: e.target.value })} placeholder="Full name" className={cn("h-11 bg-white border-slate-200", s2Errors.patientName && "border-rose-500")} />
                          <FieldError msg={s2Errors.patientName} />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Mobile Number *</Label>
                          <Input value={s2.patientMobile} onChange={(e) => setS2({ ...s2, patientMobile: e.target.value.replace(/\D/g, "").slice(0, 10) })} placeholder="10-digit mobile" maxLength={10} className={cn("h-11 bg-white border-slate-200", s2Errors.patientMobile && "border-rose-500")} />
                          <FieldError msg={s2Errors.patientMobile} />
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <Button onClick={handleS2Submit} className="h-12 px-10 bg-[#004499] hover:bg-[#003377] font-black uppercase tracking-widest shadow-xl shadow-blue-100 group">
                  Continue
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          )}

          {/* ── STAGE 3: Hospital Details ── */}
          {stage === "stage3" && (
            <div className="p-10 space-y-8 animate-in slide-in-from-right-8 duration-500">
              <div className="border-l-4 border-[#004499] pl-6 py-2">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Hospital Details</h2>
                <p className="text-slate-500 text-sm font-medium italic">Capture hospital and treatment information.</p>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Hospital className="h-4 w-4" /> Hospital & Treatment
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                  {/* Hospital Code */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Hospital Code *</Label>
                    <Select value={s3.hospitalCode} onValueChange={handleHospitalCodeChange}>
                      <SelectTrigger className={cn("h-12 bg-slate-50 border-slate-200", s3Errors.hospitalCode && "border-rose-500")}>
                        <SelectValue placeholder="Select hospital code" />
                      </SelectTrigger>
                      <SelectContent>
                        {HOSPITAL_MASTER.map((h) => (
                          <SelectItem key={h.code} value={h.code}>{h.code}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError msg={s3Errors.hospitalCode} />
                  </div>

                  {/* Hospital Name */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Hospital Name *</Label>
                    <Select value={s3.hospitalName} onValueChange={handleHospitalNameChange}>
                      <SelectTrigger className={cn("h-12 bg-slate-50 border-slate-200", s3Errors.hospitalName && "border-rose-500")}>
                        <SelectValue placeholder="Select hospital name" />
                      </SelectTrigger>
                      <SelectContent>
                        {HOSPITAL_MASTER.map((h) => (
                          <SelectItem key={h.name} value={h.name}>{h.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError msg={s3Errors.hospitalName} />
                  </div>

                  {/* Hospital Location (auto-filled) */}
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Hospital Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                      <Input value={s3.hospitalLocation ? `${s3.hospitalLocation} – ${s3.hospitalPincode}` : ""} readOnly placeholder="Auto-filled on hospital selection" className="h-12 pl-9 bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed" />
                    </div>
                    {s3.hospitalLocation && <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Auto-filled from hospital master</p>}
                  </div>

                  {/* Hospital Tier */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Hospital Tier *</Label>
                    <Input
                      value={s3.hospitalTier}
                      onChange={(e) => setS3({ ...s3, hospitalTier: e.target.value.replace(/\D/g, "") })}
                      placeholder="e.g. 1, 2, 3"
                      className={cn("h-12 bg-slate-50 border-slate-200 focus:bg-white", s3Errors.hospitalTier && "border-rose-500")}
                    />
                    <FieldError msg={s3Errors.hospitalTier} />
                    <p className="text-[10px] text-slate-400">Numeric tier classification (value may be auto-filled)</p>
                  </div>

                  {/* Finance Type */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Finance Type *</Label>
                    <Select value={s3.financeType} onValueChange={(v) => setS3({ ...s3, financeType: v })}>
                      <SelectTrigger className={cn("h-12 bg-slate-50 border-slate-200", s3Errors.financeType && "border-rose-500")}>
                        <SelectValue placeholder="Select finance type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Patient Finance">Patient Finance</SelectItem>
                        <SelectItem value="Reimbursement Finance">Reimbursement Finance</SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldError msg={s3Errors.financeType} />
                  </div>

                  {/* Treatment Type */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Treatment Type *</Label>
                    <Select value={s3.treatmentType} onValueChange={(v) => setS3({ ...s3, treatmentType: v })}>
                      <SelectTrigger className={cn("h-12 bg-slate-50 border-slate-200", s3Errors.treatmentType && "border-rose-500")}>
                        <SelectValue placeholder="Select treatment type" />
                      </SelectTrigger>
                      <SelectContent>
                        {TREATMENT_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError msg={s3Errors.treatmentType} />
                  </div>

                  {/* Treatment Cost */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Treatment Cost (₹) <span className="normal-case text-slate-300">(Optional)</span></Label>
                    <Input
                      value={s3.treatmentCost}
                      onChange={(e) => setS3({ ...s3, treatmentCost: e.target.value.replace(/[^0-9.]/g, "") })}
                      placeholder="e.g. 250000.00"
                      className={cn("h-12 bg-slate-50 border-slate-200 focus:bg-white", s3Errors.treatmentCost && "border-rose-500")}
                    />
                    <FieldError msg={s3Errors.treatmentCost} />
                  </div>
                </div>

                {/* Generate Journey Link */}
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-black text-slate-900">Generate Customer Journey Link</p>
                      <p className="text-xs text-slate-400 mt-0.5">Validate all fields and generate a shareable link for the customer.</p>
                    </div>
                    <Button onClick={handleGenerateLink} className="h-12 px-8 bg-[#004499] hover:bg-[#003377] font-black uppercase tracking-widest shadow-xl shadow-blue-100">
                      <LinkIcon className="mr-2 h-4 w-4" /> Generate Link
                    </Button>
                  </div>

                  {linkGenerated && journeyLink && (
                    <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-4 animate-in zoom-in-95 duration-300">
                      <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" /> Journey Link Generated
                      </p>
                      <div className="p-4 bg-white rounded-xl border border-emerald-100 break-all font-mono text-[12px] text-slate-700 shadow-inner leading-relaxed">
                        {journeyLink}
                      </div>
                      <div className="flex gap-3">
                        <Button onClick={() => copyLink(journeyLink)} variant="outline" className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-100/50 h-11 font-bold text-xs uppercase tracking-widest">
                          <Copy className="mr-2 h-4 w-4" /> Copy Link
                        </Button>
                        <Button onClick={() => toast({ title: "Link Shared", description: "Journey link shared via email." })} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-11 font-bold text-xs uppercase tracking-widest">
                          <Mail className="mr-2 h-4 w-4" /> Share via Email
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <Button onClick={handleS3Continue} disabled={!linkGenerated} className="h-12 px-10 bg-[#004499] hover:bg-[#003377] font-black uppercase tracking-widest shadow-xl shadow-blue-100 group disabled:opacity-50 disabled:cursor-not-allowed">
                    Continue to KYC
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ── STAGE 4: KYC ── */}
          {stage === "stage4" && (
            <div className="p-10 space-y-8 animate-in slide-in-from-right-8 duration-500">
              <div className="border-l-4 border-[#004499] pl-6 py-2">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">KYC & Documents</h2>
                <p className="text-slate-500 text-sm font-medium italic">Complete KYC verification and upload required documents.</p>
              </div>

              {/* KYC Link */}
              <section className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" /> KYC Link
                </h3>
                <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl space-y-4">
                  <p className="text-xs text-slate-500 font-medium">
                    This link will be shared with the customer to complete KYC verification.
                  </p>
                  <div className="p-4 bg-white rounded-xl border border-blue-100 break-all font-mono text-[12px] text-slate-700 shadow-inner leading-relaxed">
                    {kycLink}
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={() => copyLink(kycLink)} variant="outline" className="flex-1 border-blue-200 text-[#004499] hover:bg-blue-100/50 h-11 font-bold text-xs uppercase tracking-widest">
                      <Copy className="mr-2 h-4 w-4" /> Copy KYC Link
                    </Button>
                    <Button onClick={() => toast({ title: "KYC Link Shared", description: "KYC link sent to customer via email." })} className="flex-1 bg-[#004499] hover:bg-[#003377] text-white h-11 font-bold text-xs uppercase tracking-widest">
                      <Mail className="mr-2 h-4 w-4" /> Share via Email
                    </Button>
                  </div>
                </div>
              </section>

              {/* Document Upload */}
              <section className="space-y-5">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Document Upload
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-[#004499] text-[10px] font-black normal-case tracking-normal">
                    {s3.financeType || "Select finance type in Stage 3"}
                  </span>
                </h3>

                <div className="space-y-6">
                  {/* Invoice — both finance types */}
                  <FileUpload docKey="invoice" label="Invoice *" />

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Invoice Amount (₹) *</Label>
                    <Input
                      value={invoiceAmount}
                      onChange={(e) => { setInvoiceAmount(e.target.value.replace(/[^0-9.]/g, "")); setS4Errors((er) => ({ ...er, invoiceAmount: "" })); }}
                      placeholder="e.g. 150000"
                      className={cn("h-12 bg-slate-50 border-slate-200 focus:bg-white", s4Errors.invoiceAmount && "border-rose-500")}
                    />
                    <FieldError msg={s4Errors.invoiceAmount} />
                  </div>

                  {/* Reimbursement-only fields */}
                  {s3.financeType === "Reimbursement Finance" && (
                    <div className="space-y-6 mt-2 p-6 bg-amber-50/40 rounded-xl border border-amber-100 animate-in slide-in-from-top-2 duration-300">
                      <p className="text-xs font-black uppercase tracking-widest text-amber-700">Reimbursement Finance — Additional Documents</p>
                      <FileUpload docKey="insuranceDoc" label="Insurance Underwriting Document *" />
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Insurance Amount (₹) *</Label>
                        <Input
                          value={insuranceAmount}
                          onChange={(e) => { setInsuranceAmount(e.target.value.replace(/[^0-9.]/g, "")); setS4Errors((er) => ({ ...er, insuranceAmount: "" })); }}
                          placeholder="e.g. 50000"
                          className={cn("h-12 bg-white border-slate-200", s4Errors.insuranceAmount && "border-rose-500")}
                        />
                        <FieldError msg={s4Errors.insuranceAmount} />
                      </div>
                    </div>
                  )}
                </div>
              </section>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <Button variant="outline" onClick={() => goTo("stage3", 3)} className="h-12 px-8 border-slate-200 font-bold uppercase tracking-widest text-xs">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={handleS4Submit} className="h-12 px-10 bg-emerald-600 hover:bg-emerald-700 font-black uppercase tracking-widest shadow-xl shadow-emerald-100 group">
                  Submit Application
                  <CheckCircle2 className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
