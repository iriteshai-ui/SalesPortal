import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Smartphone,
  Loader2,
  XCircle,
  CheckCircle2,
  CreditCard,
  Mail,
  User as UserIcon,
  Calendar as CalendarIcon,
  MapPin,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Users,
  Landmark,
  Plus,
  Trash2,
  Edit,
  Copy,
  Link as LinkIcon,
  Lock,
  Check,
  ShieldCheck,
  IndianRupee,
  FileCheck,
  CreditCard as PaymentIcon,
  FileText,
  Upload,
  Building,
  PartyPopper,
  MailCheck,
  ExternalLink,
} from "lucide-react";
import confetti from "canvas-confetti";
import { addElLead } from "@/lib/mock-data";

interface CoApplicant {
  id: string;
  mobile: string;
  otpSent: boolean;
  otpVerified: boolean;
  otp: string;
  pan: string;
  relationship: string;
  name: string;
  dob: Date | null;
  gender: string;
  email: string;
  coApplicantType: string[];
  professionType: string;
  address1: string;
  address2: string;
  pincode: string;
  city: string;
  state: string;
  saved: boolean;
  expanded: boolean;
}

type JourneyStage = "mobile" | "stage1" | "stage2" | "stage3" | "stage4" | "stage5" | "stage6" | "stage7" | "stage8" | "stage8email" | "stage9" | "stage10" | "loading";

const STAGES = [
  { id: 1, title: "Basic Details" },
  { id: 2, title: "Academic Info" },
  { id: 3, title: "Co-Applicant" },
  { id: 4, title: "Bank Connect" },
  { id: 5, title: "Offer" },
  { id: 6, title: "KYC" },
  { id: 7, title: "Payment" },
  { id: 8, title: "Additional" },
  { id: 9, title: "Documents" },
  { id: 10, title: "Approval" },
];

const APPLICANT_DOC_SECTIONS = [
  {
    title: "Academic Documents",
    docs: [
      "12th Certificate",
      "1st Semester Marksheet", "2nd Semester Marksheet", "3rd Semester Marksheet", "4th Semester Marksheet",
      "5th Semester Marksheet", "6th Semester Marksheet", "7th Semester Marksheet", "8th Semester Marksheet",
    ],
  },
  {
    title: "Additional Academic Documents",
    docs: [
      "1st Additional Marksheet", "2nd Additional Marksheet", "3rd Additional Marksheet", "4th Additional Marksheet",
      "Graduation Certificate", "Additional Degree Certificate", "English Test Marksheet", "Other Test Sheet",
    ],
  },
  {
    title: "Admission and Personal Documents",
    docs: [
      "Admit Letter", "Resume", "Applicant PAN Card Photo", "Passport Size Photo",
      "Passport Front Photo", "Passport Back Photo", "Work Experience Letter",
    ],
  },
];

const COAPPLICANT_DOCS = ["Collateral Proof", "Passport Size Photo", "Co-Applicant PAN Card Photo"];

function mockPincodeApi(pincode: string): Promise<{ city: string; state: string } | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const map: Record<string, { city: string; state: string }> = {
        "400001": { city: "Mumbai", state: "Maharashtra" },
        "400051": { city: "Mumbai", state: "Maharashtra" },
        "110001": { city: "New Delhi", state: "Delhi" },
        "560001": { city: "Bangalore", state: "Karnataka" },
        "600001": { city: "Chennai", state: "Tamil Nadu" },
        "700001": { city: "Kolkata", state: "West Bengal" },
        "500001": { city: "Hyderabad", state: "Telangana" },
        "411001": { city: "Pune", state: "Maharashtra" },
        "380001": { city: "Ahmedabad", state: "Gujarat" },
        "302001": { city: "Jaipur", state: "Rajasthan" },
        "226001": { city: "Lucknow", state: "Uttar Pradesh" },
      };
      resolve(map[pincode] || null);
    }, 500);
  });
}

function mockSendOtp(): Promise<boolean> {
  return new Promise((resolve) => setTimeout(() => resolve(true), 1000));
}

function mockVerifyOtp(otp: string): Promise<boolean> {
  return new Promise((resolve) => setTimeout(() => resolve(otp === "123456"), 1000));
}

function createEmptyCoApplicant(): CoApplicant {
  return {
    id: crypto.randomUUID(),
    mobile: "",
    otpSent: false,
    otpVerified: false,
    otp: "",
    pan: "",
    relationship: "",
    name: "",
    dob: null,
    gender: "",
    email: "",
    coApplicantType: [],
    professionType: "",
    address1: "",
    address2: "",
    pincode: "",
    city: "",
    state: "",
    saved: false,
    expanded: true,
  };
}

export default function ElLeadJourneyPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [stage, setStage] = useState<JourneyStage>("mobile");
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loadingTarget, setLoadingTarget] = useState<JourneyStage>("stage1");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [mobile, setMobile] = useState("9876543210");
  const [mobileError, setMobileError] = useState("");

  const [s1, setS1] = useState({
    pan: "ABCPD1234E",
    name: "Rahul Sharma",
    dob: new Date("2002-05-15"),
    email: "rahul.sharma@gmail.com",
    gender: "Male",
    address1: "42 Sunrise Apartments, MG Road",
    address2: "Near City Mall",
    pincode: "400001",
    city: "Mumbai",
    state: "Maharashtra",
  });
  const [s1Errors, setS1Errors] = useState<Record<string, string>>({});

  const [s2, setS2] = useState({
    qualification: "ug",
    universitySelected: "yes",
    country: "India",
    universityName: "Mumbai University",
    instituteName: "St. Xavier's College",
    courseName: "B.Tech Computer Science",
    courseDuration: "48",
    tenthYear: "2018",
    twelfthYear: "2020",
    graduationYear: "",
    graduationDuration: "",
    graduationScore: "",
    loanAmount: "500000",
  });
  const [s2Errors, setS2Errors] = useState<Record<string, string>>({});

  const [coApplicants, setCoApplicants] = useState<CoApplicant[]>([
    {
      id: "demo-ca-1",
      mobile: "9871112222",
      otpSent: true,
      otpVerified: true,
      otp: "123456",
      pan: "BWRPS4321K",
      relationship: "Father",
      name: "Suresh Sharma",
      dob: new Date("1972-08-20"),
      gender: "Male",
      email: "suresh.sharma@gmail.com",
      coApplicantType: ["Financial"],
      professionType: "Salaried",
      address1: "42 Sunrise Apartments, MG Road",
      address2: "Near City Mall",
      pincode: "400001",
      city: "Mumbai",
      state: "Maharashtra",
      saved: false,
      expanded: true,
    },
    {
      id: "demo-ca-2",
      mobile: "9873334444",
      otpSent: true,
      otpVerified: true,
      otp: "123456",
      pan: "CXRPS6789L",
      relationship: "Mother",
      name: "Anita Sharma",
      dob: new Date("1975-03-10"),
      gender: "Female",
      email: "anita.sharma@gmail.com",
      coApplicantType: ["Non-financial"],
      professionType: "Self Employed",
      address1: "42 Sunrise Apartments, MG Road",
      address2: "Near City Mall",
      pincode: "400001",
      city: "Mumbai",
      state: "Maharashtra",
      saved: false,
      expanded: true,
    },
    {
      id: "demo-ca-3",
      mobile: "9875556666",
      otpSent: true,
      otpVerified: true,
      otp: "123456",
      pan: "DYRPS2468M",
      relationship: "Brother",
      name: "Amit Sharma",
      dob: new Date("1998-11-25"),
      gender: "Male",
      email: "amit.sharma@gmail.com",
      coApplicantType: ["Financial", "Non-financial"],
      professionType: "Salaried",
      address1: "15 Green Valley Society, Andheri West",
      address2: "Opposite Metro Station",
      pincode: "400051",
      city: "Mumbai",
      state: "Maharashtra",
      saved: false,
      expanded: true,
    },
  ]);
  const [s3Errors, setS3Errors] = useState<Record<string, Record<string, string>>>({});

  const stageToNum = (s: JourneyStage): number => {
    const map: Record<string, number> = {
      mobile: 0, stage1: 1, stage2: 2, stage3: 3, stage4: 4,
      stage5: 5, stage6: 6, stage7: 7, stage8: 8, stage8email: 8, stage9: 9, stage10: 10,
    };
    return map[s] ?? 0;
  };

  const currentStageId = stage === "loading" ? stageToNum(loadingTarget) : stageToNum(stage);
  const progressPercentage = stage === "mobile" ? 0 : Math.round((currentStageId / 10) * 100);
  const MOCK_AGENT = { name: "Rohit Joshi", code: "AG-PUN-3304" };

  const getActiveStageId = () => {
    if (stage === "mobile") return 0;
    if (stage === "loading") {
      return stageToNum(loadingTarget) > 0 ? stageToNum(loadingTarget) - 1 : 0;
    }
    return stageToNum(stage);
  };

  const activeStageId = getActiveStageId();

  const handleMobileSubmit = () => {
    const trimmed = mobile.trim();
    if (!trimmed) {
      setMobileError("Mobile number is required.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(trimmed)) {
      setMobileError("Enter a valid 10-digit Indian mobile number starting with 6-9.");
      return;
    }
    setMobileError("");
    setStage("stage1");
  };

  const validatePan = (pan: string) => {
    const pattern = /^[A-Z]{3}P[A-Z]\d{4}[A-Z]$/;
    return pattern.test(pan.toUpperCase());
  };

  const handlePincodeBlur = async (pincode: string, setter: (city: string, state: string) => void, errorSetter: (field: string, msg: string) => void) => {
    if (!/^\d{6}$/.test(pincode)) {
      errorSetter("pincode", "Enter a valid 6-digit pin code.");
      setter("", "");
      return;
    }
    const result = await mockPincodeApi(pincode);
    if (result) {
      setter(result.city, result.state);
      errorSetter("pincode", "");
    } else {
      errorSetter("pincode", "Invalid pin code. Unable to fetch city/state.");
      setter("", "");
    }
  };

  const validateStage1 = () => {
    const errors: Record<string, string> = {};

    if (!s1.pan.trim()) errors.pan = "PAN is required.";
    else if (!validatePan(s1.pan)) errors.pan = "Invalid PAN format. Expected: AAAAP9999A (4th char must be P).";

    if (!s1.name.trim()) errors.name = "Full name is required.";
    else if (s1.name.length > 20) errors.name = "Name must not exceed 20 characters.";
    else if (!/^[A-Za-z\s]+$/.test(s1.name)) errors.name = "Name must contain only letters and spaces.";

    if (!s1.dob) errors.dob = "Date of birth is required.";
    else {
      const age = Math.floor((Date.now() - s1.dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      if (age < 18) errors.dob = "Applicant must be at least 18 years old.";
    }

    if (!s1.email.trim()) errors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s1.email)) errors.email = "Enter a valid email address.";

    if (!s1.gender) errors.gender = "Gender is required.";

    if (!s1.address1.trim()) errors.address1 = "Address Line 1 is required.";
    else if (s1.address1.trim().length < 10) errors.address1 = "Address Line 1 must be at least 10 characters.";

    if (!s1.pincode.trim()) errors.pincode = "Pin code is required.";
    else if (!/^\d{6}$/.test(s1.pincode)) errors.pincode = "Enter a valid 6-digit pin code.";
    else if (!s1.city || !s1.state) errors.pincode = "Invalid pin code. Unable to fetch city/state.";

    setS1Errors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleStage1Submit = () => {
    if (!validateStage1()) return;
    setIsSubmitting(true);
    setLoadingMessage("We are processing your request.");
    setLoadingTarget("stage2");
    setStage("loading");
    setTimeout(() => { setStage("stage2"); setIsSubmitting(false); }, 5000);
  };

  const validateStage2 = () => {
    const errors: Record<string, string> = {};
    const currentYear = new Date().getFullYear();

    if (!s2.qualification) errors.qualification = "Qualification is required.";
    if (!s2.universitySelected) errors.universitySelected = "Please select whether your university is selected.";
    if (!s2.country.trim()) errors.country = "Country is required.";
    if (!s2.universityName.trim()) errors.universityName = "University name is required.";
    if (!s2.instituteName.trim()) errors.instituteName = "Institute name is required.";
    if (!s2.courseName.trim()) errors.courseName = "Course name is required.";

    if (!s2.courseDuration.trim()) errors.courseDuration = "Course duration is required.";
    else if (!/^\d+$/.test(s2.courseDuration) || parseInt(s2.courseDuration) <= 0) errors.courseDuration = "Enter a valid positive number for course duration.";

    if (!s2.tenthYear.trim()) errors.tenthYear = "10th passing year is required.";
    else {
      const y = parseInt(s2.tenthYear);
      if (!/^\d{4}$/.test(s2.tenthYear) || y < 1980 || y > currentYear) errors.tenthYear = `Enter a valid year between 1980 and ${currentYear}.`;
    }

    if (!s2.twelfthYear.trim()) errors.twelfthYear = "12th passing year is required.";
    else {
      const y = parseInt(s2.twelfthYear);
      if (!/^\d{4}$/.test(s2.twelfthYear) || y < 1980 || y > currentYear) errors.twelfthYear = `Enter a valid year between 1980 and ${currentYear}.`;
      else if (parseInt(s2.tenthYear) && y < parseInt(s2.tenthYear)) errors.twelfthYear = "12th year must be >= 10th passing year.";
    }

    if (s2.qualification === "pg") {
      if (!s2.graduationYear.trim()) errors.graduationYear = "Graduation passing year is required.";
      else {
        const y = parseInt(s2.graduationYear);
        if (!/^\d{4}$/.test(s2.graduationYear) || y < 1980 || y > currentYear) errors.graduationYear = `Enter a valid year between 1980 and ${currentYear}.`;
        else if (parseInt(s2.twelfthYear) && y < parseInt(s2.twelfthYear)) errors.graduationYear = "Graduation year must be >= 12th passing year.";
      }

      if (!s2.graduationDuration.trim()) errors.graduationDuration = "Graduation duration is required.";
      else if (isNaN(Number(s2.graduationDuration)) || Number(s2.graduationDuration) <= 0) errors.graduationDuration = "Enter a valid positive number.";

      if (s2.universitySelected === "yes") {
        if (!s2.graduationScore.trim()) errors.graduationScore = "Graduation score is required.";
        else {
          const score = parseFloat(s2.graduationScore);
          if (isNaN(score) || score < 0 || score > 100) errors.graduationScore = "Enter a score between 0 and 100.";
          else if (!/^\d+(\.\d{1,2})?$/.test(s2.graduationScore)) errors.graduationScore = "Score allows up to 2 decimal places.";
        }
      }
    }

    if (!s2.loanAmount.trim()) errors.loanAmount = "Expected loan amount is required.";
    else if (isNaN(Number(s2.loanAmount.replace(/,/g, ""))) || Number(s2.loanAmount.replace(/,/g, "")) <= 0) errors.loanAmount = "Enter a valid positive amount.";

    setS2Errors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleStage2Submit = () => {
    if (!validateStage2()) return;
    setIsSubmitting(true);
    setLoadingMessage("We are processing your request.");
    setLoadingTarget("stage3");
    setStage("loading");
    setTimeout(() => { setStage("stage3"); setIsSubmitting(false); }, 10000);
  };

  const addCoApplicant = () => {
    if (coApplicants.length >= 4) return;
    setCoApplicants([...coApplicants, createEmptyCoApplicant()]);
  };

  const removeCoApplicant = (id: string) => {
    setCoApplicants(coApplicants.filter((c) => c.id !== id));
  };

  const updateCoApplicant = (id: string, updates: Partial<CoApplicant>) => {
    setCoApplicants(coApplicants.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const handleSendOtp = async (id: string) => {
    const ca = coApplicants.find((c) => c.id === id);
    if (!ca) return;
    if (!/^[6-9]\d{9}$/.test(ca.mobile)) {
      setS3Errors((prev) => ({ ...prev, [id]: { ...prev[id], mobile: "Enter a valid 10-digit mobile number." } }));
      return;
    }
    setS3Errors((prev) => ({ ...prev, [id]: { ...prev[id], mobile: "" } }));
    const success = await mockSendOtp();
    if (success) {
      updateCoApplicant(id, { otpSent: true });
      toast({ title: "OTP Sent", description: "OTP sent successfully to the mobile number." });
    }
  };

  const handleVerifyOtp = async (id: string) => {
    const ca = coApplicants.find((c) => c.id === id);
    if (!ca) return;
    if (!/^\d{6}$/.test(ca.otp)) {
      setS3Errors((prev) => ({ ...prev, [id]: { ...prev[id], otp: "Enter a valid 6-digit OTP." } }));
      return;
    }
    setS3Errors((prev) => ({ ...prev, [id]: { ...prev[id], otp: "" } }));
    const success = await mockVerifyOtp(ca.otp);
    if (success) {
      updateCoApplicant(id, { otpVerified: true });
      toast({ title: "OTP Verified", description: "Mobile number verified successfully." });
    } else {
      setS3Errors((prev) => ({ ...prev, [id]: { ...prev[id], otp: "Invalid OTP, please try again. (Hint: use 123456)" } }));
    }
  };

  const validateCoApplicant = (ca: CoApplicant) => {
    const errors: Record<string, string> = {};

    if (!ca.pan.trim()) errors.pan = "PAN is required.";
    else if (!validatePan(ca.pan)) errors.pan = "Invalid PAN format. Expected: AAAAP9999A.";

    if (!ca.relationship) errors.relationship = "Relationship is required.";

    if (!ca.name.trim()) errors.name = "Name is required.";
    else if (!/^[A-Za-z\s]+$/.test(ca.name)) errors.name = "Name must contain only letters and spaces.";

    if (!ca.dob) errors.dob = "Date of birth is required.";
    else {
      const age = Math.floor((Date.now() - ca.dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      if (age < 18) errors.dob = "Co-applicant must be at least 18 years old.";
    }

    if (!ca.gender) errors.gender = "Gender is required.";

    if (!ca.email.trim()) errors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ca.email)) errors.email = "Enter a valid email address.";

    if (ca.coApplicantType.length === 0) errors.coApplicantType = "Select at least one type.";

    if (!ca.professionType) errors.professionType = "Profession type is required.";

    if (!ca.address1.trim()) errors.address1 = "Address Line 1 is required.";
    else if (ca.address1.trim().length < 10) errors.address1 = "Address Line 1 must be at least 10 characters.";

    if (!ca.pincode.trim()) errors.pincode = "Pin code is required.";
    else if (!/^\d{6}$/.test(ca.pincode)) errors.pincode = "Enter a valid 6-digit pin code.";
    else if (!ca.city || !ca.state) errors.pincode = "Invalid pin code.";

    return errors;
  };

  const handleSaveCoApplicant = (id: string) => {
    const ca = coApplicants.find((c) => c.id === id);
    if (!ca) return;
    const errors = validateCoApplicant(ca);
    setS3Errors((prev) => ({ ...prev, [id]: errors }));
    if (Object.keys(errors).length === 0) {
      updateCoApplicant(id, { saved: true, expanded: false });
      toast({ title: "Co-Applicant Saved", description: `${ca.name || "Co-applicant"} details saved successfully.` });
    }
  };

  const savedCount = coApplicants.filter((c) => c.saved).length;
  const canContinueStage3 = savedCount >= 2;

  const handleStage3Continue = () => {
    if (!canContinueStage3) return;
    setStage("stage4");
  };

  const [isStp] = useState(true);

  const [kycStatus, setKycStatus] = useState<"pending" | "sent" | "verifying" | "approved" | "rejected">("pending");
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "sent" | "success" | "failed">("pending");

  const [s8, setS8] = useState({
    sscBoard: "Maharashtra State Board",
    sscScore: "89.60",
    hscBoard: "Maharashtra State Board",
    hscScore: "91.40",
    gradUniversity: "Mumbai University",
    collateralOffered: "yes",
    collateralType: "Property",
    collateralSubtype: "Residential",
    propertyType: "Flat",
    natureOfProperty: "Self Constructed",
    propertyValue: "7500000",
    propertyPurpose: "Self Occupied",
    propertyClassification: "Urban",
    propertyOwnership: "Self Owned",
    builtUpArea: "1200",
    carpetArea: "950",
    ageOfProperty: "8",
    residualAge: "50+ Years",
    addressType: "Permanent",
    propertyCity: "Mumbai",
    propertyState: "Maharashtra",
    propertyCountry: "India",
    propertyPincode: "400001",
    flatPlotNo: "A-402",
    ownershipStatus: "Owned",
    ownerType: "Individual",
    ownerName: "Suresh Sharma",
    linkedApplicant: "RAHUL SHARMA",
    percentageShare: "100",
    ownershipFrom: new Date("2016-03-15"),
    ownershipTo: null as Date | null,
  });

  const [emailVerified, setEmailVerified] = useState(false);
  const [emailVerifying, setEmailVerifying] = useState(false);

  const [uploadedDocs, setUploadedDocs] = useState<Record<string, string>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ "Academic Documents": true });
  const [additionalApplicantDocs, setAdditionalApplicantDocs] = useState(false);
  const [additionalCoapplicantDocs, setAdditionalCoapplicantDocs] = useState(false);

  const handleUploadDoc = (docName: string) => {
    setUploadedDocs((prev) => ({ ...prev, [docName]: `${docName.replace(/\s/g, "_")}_${Date.now()}.pdf` }));
    toast({ title: "Document Uploaded", description: `${docName} uploaded successfully.` });
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleKycSend = () => {
    setKycStatus("sent");
    toast({ title: "KYC Link Sent", description: "KYC verification link has been sent to the applicant." });
  };

  const handleKycSimulate = (result: "approved" | "rejected") => {
    setKycStatus("verifying");
    setTimeout(() => {
      setKycStatus(result);
      toast({
        title: result === "approved" ? "KYC Approved" : "KYC Rejected",
        description: result === "approved" ? "KYC verification completed successfully." : "KYC verification failed. Please retry.",
      });
    }, 2000);
  };

  const handlePaymentSend = () => {
    setPaymentStatus("sent");
    toast({ title: "Payment Link Sent", description: "Payment link has been sent to the applicant." });
  };

  const handlePaymentSimulate = (result: "success" | "failed") => {
    setPaymentStatus(result === "success" ? "success" : "failed");
    toast({
      title: result === "success" ? "Payment Successful" : "Payment Failed",
      description: result === "success" ? "Payment has been received." : "Payment failed. Please retry.",
    });
  };

  const [emailFailed, setEmailFailed] = useState(false);

  const handleEmailVerify = () => {
    setEmailVerifying(true);
    setEmailFailed(false);
  };

  const handleEmailSimulate = (result: "success" | "failed") => {
    setEmailVerifying(false);
    if (result === "success") {
      setEmailVerified(true);
      setEmailFailed(false);
      toast({ title: "Email Verified", description: "Applicant email has been verified successfully." });
    } else {
      setEmailFailed(true);
      toast({ title: "Verification Failed", description: "Email verification failed. Please retry." });
    }
  };

  const handleBackToDashboard = () => {
    addElLead(s1.name || "Student Applicant", mobile, s1.pan);
    toast({ title: "Lead Added", description: "Education Loan lead has been added to the dashboard." });
    setLocation("/dashboard");
  };

  const handleStage10 = () => {
    try { confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } }); } catch {}
    setStage("stage10");
  };

  const demoLink = "https://aa.finvu.in/verify/el-bank-connect?session=EL" + Date.now();

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" className="w-fit pl-0 hover:bg-transparent text-slate-500 hover:text-[#004499] group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-heading font-black text-slate-900 tracking-tight">EL Lead Journey</h1>
            <p className="text-slate-500 mt-1 font-medium italic">Assisted education loan application flow.</p>
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

        {stage !== "mobile" && (
          <div className="relative py-6 px-2">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-[#004499] -translate-y-1/2 transition-all duration-700 ease-in-out rounded-full shadow-[0_0_12px_rgba(0,68,153,0.4)]"
              style={{ width: `${progressPercentage}%` }}
            />
            <div className="relative flex justify-between items-center">
              {STAGES.map((s) => {
                const isCompleted = activeStageId > s.id;
                const isActive = activeStageId === s.id;
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
                      {isCompleted ? <Check className="h-5 w-5" strokeWidth={3} /> : s.id}
                    </div>
                    <span
                      className={cn(
                        "mt-3 text-[10px] font-black uppercase tracking-widest transition-colors duration-300",
                        isActive ? "text-[#004499]" : isCompleted ? "text-emerald-600" : "text-slate-400"
                      )}
                    >
                      {s.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <Card className="shadow-2xl border-slate-200/60 overflow-hidden rounded-2xl">
        <CardContent className="p-0">
          {stage === "mobile" && (
            <div className="p-12 max-w-lg mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
                  <GraduationCap className="text-[#004499] h-8 w-8" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Start Application</h2>
                <p className="text-slate-500 text-sm font-medium">Enter the student's mobile number to begin the education loan journey.</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Mobile Number</Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                    <Input
                      type="tel"
                      value={mobile}
                      onChange={(e) => { setMobile(e.target.value); setMobileError(""); }}
                      placeholder="Enter 10 digit number"
                      className={cn(
                        "pl-10 text-lg h-14 font-black tracking-widest bg-slate-50 border-slate-200 focus:bg-white transition-all",
                        mobileError && "border-rose-500 bg-rose-50"
                      )}
                      maxLength={10}
                    />
                  </div>
                  {mobileError && <p className="text-rose-500 text-xs font-bold flex items-center gap-1"><XCircle className="h-3 w-3" /> {mobileError}</p>}
                </div>
                <Button
                  onClick={handleMobileSubmit}
                  disabled={!/^[6-9]\d{9}$/.test(mobile.trim())}
                  className="w-full h-14 bg-[#004499] hover:bg-[#003377] text-lg font-black uppercase tracking-widest shadow-xl shadow-blue-100 group disabled:opacity-50"
                >
                  Continue
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          )}

          {stage === "loading" && (
            <div className="p-20 flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-slate-100 border-t-[#004499] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <GraduationCap className="h-8 w-8 text-[#004499]/40" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Processing</h3>
                <p className="text-slate-500 font-medium italic animate-pulse">{loadingMessage}</p>
              </div>
            </div>
          )}

          {stage === "stage1" && (
            <div className="p-10 space-y-8 animate-in slide-in-from-right-8 duration-500">
              <div className="border-l-4 border-[#004499] pl-6 py-2">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Stage 1 of 10 — Student Basic Details</h2>
                <p className="text-slate-500 text-sm font-medium italic">Capture the student's personal information.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <CreditCard className="h-3 w-3" /> PAN
                  </Label>
                  <Input
                    value={s1.pan}
                    onChange={(e) => setS1({ ...s1, pan: e.target.value.toUpperCase() })}
                    placeholder="AAAAP9999A"
                    className="h-12 font-mono uppercase font-bold tracking-widest"
                    maxLength={10}
                  />
                  {s1Errors.pan && <p className="text-rose-500 text-xs font-bold flex items-center gap-1"><XCircle className="h-3 w-3" /> {s1Errors.pan}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <UserIcon className="h-3 w-3" /> Full Name
                  </Label>
                  <Input
                    value={s1.name}
                    onChange={(e) => setS1({ ...s1, name: e.target.value })}
                    placeholder="Full Name"
                    className="h-12 font-bold"
                    maxLength={20}
                  />
                  {s1Errors.name && <p className="text-rose-500 text-xs font-bold flex items-center gap-1"><XCircle className="h-3 w-3" /> {s1Errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <CalendarIcon className="h-3 w-3" /> Date of Birth
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      className="h-12 font-bold"
                      value={s1.dob ? format(s1.dob, "yyyy-MM-dd") : ""}
                      max={format(new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()), "yyyy-MM-dd")}
                      onChange={(e) => {
                        const d = new Date(e.target.value);
                        if (!isNaN(d.getTime())) setS1({ ...s1, dob: d });
                      }}
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
                          selected={s1.dob || undefined}
                          onSelect={(d) => d && setS1({ ...s1, dob: d })}
                          fromYear={1950}
                          toYear={new Date().getFullYear() - 18}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  {s1Errors.dob && <p className="text-rose-500 text-xs font-bold flex items-center gap-1"><XCircle className="h-3 w-3" /> {s1Errors.dob}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Mail className="h-3 w-3" /> Email
                  </Label>
                  <Input
                    type="email"
                    value={s1.email}
                    onChange={(e) => setS1({ ...s1, email: e.target.value })}
                    placeholder="student@email.com"
                    className="h-12 font-bold"
                  />
                  {s1Errors.email && <p className="text-rose-500 text-xs font-bold flex items-center gap-1"><XCircle className="h-3 w-3" /> {s1Errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Gender</Label>
                  <RadioGroup value={s1.gender} onValueChange={(v) => setS1({ ...s1, gender: v })} className="flex gap-6 pt-2">
                    {["Male", "Female", "Other"].map((g) => (
                      <div key={g} className="flex items-center space-x-2">
                        <RadioGroupItem value={g} id={`gender-${g}`} />
                        <label htmlFor={`gender-${g}`} className="text-sm font-bold cursor-pointer">{g}</label>
                      </div>
                    ))}
                  </RadioGroup>
                  {s1Errors.gender && <p className="text-rose-500 text-xs font-bold flex items-center gap-1"><XCircle className="h-3 w-3" /> {s1Errors.gender}</p>}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-sm font-black text-slate-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Communication Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Address Line 1</Label>
                    <Input
                      value={s1.address1}
                      onChange={(e) => setS1({ ...s1, address1: e.target.value })}
                      placeholder="House/Flat No., Building Name, Street"
                      className="h-12 font-bold"
                    />
                    {s1Errors.address1 && <p className="text-rose-500 text-xs font-bold flex items-center gap-1"><XCircle className="h-3 w-3" /> {s1Errors.address1}</p>}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Address Line 2 <span className="text-slate-300">(Optional)</span></Label>
                    <Input
                      value={s1.address2}
                      onChange={(e) => setS1({ ...s1, address2: e.target.value })}
                      placeholder="Landmark, Area"
                      className="h-12 font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Pin Code</Label>
                    <Input
                      value={s1.pincode}
                      onChange={(e) => setS1({ ...s1, pincode: e.target.value.replace(/\D/g, ""), city: "", state: "" })}
                      onBlur={() =>
                        handlePincodeBlur(
                          s1.pincode,
                          (city, state) => setS1((prev) => ({ ...prev, city, state })),
                          (field, msg) => setS1Errors((prev) => ({ ...prev, [field]: msg }))
                        )
                      }
                      placeholder="6-digit pin code"
                      className="h-12 font-bold"
                      maxLength={6}
                    />
                    {s1Errors.pincode && <p className="text-rose-500 text-xs font-bold flex items-center gap-1"><XCircle className="h-3 w-3" /> {s1Errors.pincode}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">City</Label>
                      <Input value={s1.city} readOnly className="h-12 font-bold bg-slate-50 text-slate-500" placeholder="Auto-filled" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">State</Label>
                      <Input value={s1.state} readOnly className="h-12 font-bold bg-slate-50 text-slate-500" placeholder="Auto-filled" />
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleStage1Submit}
                disabled={isSubmitting}
                className="w-full h-14 bg-[#004499] hover:bg-[#003377] text-lg font-black uppercase tracking-widest shadow-xl shadow-blue-100 group disabled:opacity-50"
              >
                Continue
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          )}

          {stage === "stage2" && (
            <div className="p-10 space-y-8 animate-in slide-in-from-right-8 duration-500">
              <div className="border-l-4 border-[#004499] pl-6 py-2">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Stage 2 of 10 — Academic Info (Primary)</h2>
                <p className="text-slate-500 text-sm font-medium italic">Provide the student's academic background.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Qualification</Label>
                  <RadioGroup value={s2.qualification} onValueChange={(v) => setS2({ ...s2, qualification: v })} className="flex gap-6 pt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ug" id="qual-ug" />
                      <label htmlFor="qual-ug" className="text-sm font-bold cursor-pointer">Under Graduate</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pg" id="qual-pg" />
                      <label htmlFor="qual-pg" className="text-sm font-bold cursor-pointer">Post Graduate</label>
                    </div>
                  </RadioGroup>
                  {s2Errors.qualification && <p className="text-rose-500 text-xs font-bold flex items-center gap-1"><XCircle className="h-3 w-3" /> {s2Errors.qualification}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Is your university selected?</Label>
                  <RadioGroup value={s2.universitySelected} onValueChange={(v) => setS2({ ...s2, universitySelected: v })} className="flex gap-6 pt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="uni-yes" />
                      <label htmlFor="uni-yes" className="text-sm font-bold cursor-pointer">Yes</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="uni-no" />
                      <label htmlFor="uni-no" className="text-sm font-bold cursor-pointer">No</label>
                    </div>
                  </RadioGroup>
                  {s2Errors.universitySelected && <p className="text-rose-500 text-xs font-bold flex items-center gap-1"><XCircle className="h-3 w-3" /> {s2Errors.universitySelected}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Country</Label>
                    <Input value={s2.country} onChange={(e) => setS2({ ...s2, country: e.target.value })} placeholder="e.g., India" className="h-12 font-bold" />
                    {s2Errors.country && <p className="text-rose-500 text-xs font-bold flex items-center gap-1"><XCircle className="h-3 w-3" /> {s2Errors.country}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">University Name</Label>
                    <Input value={s2.universityName} onChange={(e) => setS2({ ...s2, universityName: e.target.value })} placeholder="University Name" className="h-12 font-bold" />
                    {s2Errors.universityName && <p className="text-rose-500 text-xs font-bold flex items-center gap-1"><XCircle className="h-3 w-3" /> {s2Errors.universityName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Institute Name</Label>
                    <Input value={s2.instituteName} onChange={(e) => setS2({ ...s2, instituteName: e.target.value })} placeholder="Institute Name" className="h-12 font-bold" />
                    {s2Errors.instituteName && <p className="text-rose-500 text-xs font-bold flex items-center gap-1"><XCircle className="h-3 w-3" /> {s2Errors.instituteName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Course Name</Label>
                    <Input value={s2.courseName} onChange={(e) => setS2({ ...s2, courseName: e.target.value })} placeholder="Course Name" className="h-12 font-bold" />
                    {s2Errors.courseName && <p className="text-rose-500 text-xs font-bold flex items-center gap-1"><XCircle className="h-3 w-3" /> {s2Errors.courseName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Course Duration (Months)</Label>
                    <Input value={s2.courseDuration} onChange={(e) => setS2({ ...s2, courseDuration: e.target.value.replace(/\D/g, "") })} placeholder="e.g., 36" className="h-12 font-bold" />
                    {s2Errors.courseDuration && <p className="text-rose-500 text-xs font-bold flex items-center gap-1"><XCircle className="h-3 w-3" /> {s2Errors.courseDuration}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">10th Passing Year</Label>
                    <Input value={s2.tenthYear} onChange={(e) => setS2({ ...s2, tenthYear: e.target.value.replace(/\D/g, "") })} placeholder="e.g., 2018" className="h-12 font-bold" maxLength={4} />
                    {s2Errors.tenthYear && <p className="text-rose-500 text-xs font-bold flex items-center gap-1"><XCircle className="h-3 w-3" /> {s2Errors.tenthYear}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">12th Passing Year</Label>
                    <Input value={s2.twelfthYear} onChange={(e) => setS2({ ...s2, twelfthYear: e.target.value.replace(/\D/g, "") })} placeholder="e.g., 2020" className="h-12 font-bold" maxLength={4} />
                    {s2Errors.twelfthYear && <p className="text-rose-500 text-xs font-bold flex items-center gap-1"><XCircle className="h-3 w-3" /> {s2Errors.twelfthYear}</p>}
                  </div>

                  {s2.qualification === "pg" && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Graduation Passing Year</Label>
                        <Input value={s2.graduationYear} onChange={(e) => setS2({ ...s2, graduationYear: e.target.value.replace(/\D/g, "") })} placeholder="e.g., 2023" className="h-12 font-bold" maxLength={4} />
                        {s2Errors.graduationYear && <p className="text-rose-500 text-xs font-bold flex items-center gap-1"><XCircle className="h-3 w-3" /> {s2Errors.graduationYear}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Graduation Duration (Years)</Label>
                        <Input value={s2.graduationDuration} onChange={(e) => setS2({ ...s2, graduationDuration: e.target.value })} placeholder="e.g., 3 or 3.5" className="h-12 font-bold" />
                        {s2Errors.graduationDuration && <p className="text-rose-500 text-xs font-bold flex items-center gap-1"><XCircle className="h-3 w-3" /> {s2Errors.graduationDuration}</p>}
                      </div>
                      {s2.universitySelected === "yes" && (
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Graduation Score (up to 2 decimals)</Label>
                          <Input value={s2.graduationScore} onChange={(e) => setS2({ ...s2, graduationScore: e.target.value })} placeholder="e.g., 85.50" className="h-12 font-bold" />
                          {s2Errors.graduationScore && <p className="text-rose-500 text-xs font-bold flex items-center gap-1"><XCircle className="h-3 w-3" /> {s2Errors.graduationScore}</p>}
                        </div>
                      )}
                    </>
                  )}

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Expected Loan Amount (₹)</Label>
                    <Input value={s2.loanAmount} onChange={(e) => setS2({ ...s2, loanAmount: e.target.value })} placeholder="e.g., 500000" className="h-12 font-bold" />
                    {s2Errors.loanAmount && <p className="text-rose-500 text-xs font-bold flex items-center gap-1"><XCircle className="h-3 w-3" /> {s2Errors.loanAmount}</p>}
                  </div>
                </div>
              </div>

              <Button
                onClick={handleStage2Submit}
                disabled={isSubmitting}
                className="w-full h-14 bg-[#004499] hover:bg-[#003377] text-lg font-black uppercase tracking-widest shadow-xl shadow-blue-100 group disabled:opacity-50"
              >
                Submit Academic Info
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          )}

          {stage === "stage3" && (
            <div className="p-10 space-y-8 animate-in slide-in-from-right-8 duration-500">
              <div className="border-l-4 border-[#004499] pl-6 py-2">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Stage 3 of 10 — Co-Applicant Onboarding</h2>
                <p className="text-slate-500 text-sm font-medium italic">Add up to 4 co-applicants for the education loan.</p>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-sm text-blue-800 font-medium">
                  A co-applicant is an individual who applies for a loan alongside another person.
                  Both applicants share responsibility for repaying the debt.
                </p>
              </div>

              {coApplicants.map((ca, index) => (
                <Card key={ca.id} className="border-slate-200 shadow-md overflow-hidden">
                  <div
                    className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-100 cursor-pointer"
                    onClick={() => updateCoApplicant(ca.id, { expanded: !ca.expanded })}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-black",
                        ca.saved ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-[#004499]"
                      )}>
                        {ca.saved ? <Check className="h-4 w-4" /> : index + 1}
                      </div>
                      <span className="font-bold text-slate-900">
                        {ca.saved ? ca.name : `Co-Applicant ${index + 1}`}
                      </span>
                      {ca.saved && (
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Saved</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {ca.saved && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); updateCoApplicant(ca.id, { saved: false, expanded: true }); }}
                          className="text-[#004499] hover:bg-blue-50 h-8"
                        >
                          <Edit className="h-3 w-3 mr-1" /> Edit
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); removeCoApplicant(ca.id); }}
                        className="text-rose-500 hover:bg-rose-50 h-8"
                      >
                        <Trash2 className="h-3 w-3 mr-1" /> Remove
                      </Button>
                      {ca.expanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                    </div>
                  </div>

                  {ca.expanded && (
                    <div className="p-6 space-y-6 animate-in slide-in-from-top-2 duration-300">
                      <div className="space-y-4">
                        <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Co-applicant Mobile Number</Label>
                        <div className="flex gap-3">
                          <div className="relative flex-1">
                            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                            <Input
                              type="tel"
                              value={ca.mobile}
                              onChange={(e) => updateCoApplicant(ca.id, { mobile: e.target.value })}
                              placeholder="10-digit mobile"
                              className={cn("pl-10 h-12 font-bold tracking-widest", ca.otpVerified && "bg-slate-50")}
                              maxLength={10}
                              disabled={ca.otpVerified}
                            />
                            {ca.otpVerified && <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />}
                          </div>
                          {!ca.otpVerified && (
                            <Button
                              onClick={() => handleSendOtp(ca.id)}
                              variant="outline"
                              className="h-12 px-6 font-bold text-xs uppercase tracking-widest border-[#004499] text-[#004499] hover:bg-blue-50"
                            >
                              Send OTP
                            </Button>
                          )}
                        </div>
                        {s3Errors[ca.id]?.mobile && <p className="text-rose-500 text-xs font-bold flex items-center gap-1"><XCircle className="h-3 w-3" /> {s3Errors[ca.id].mobile}</p>}
                        {ca.otpVerified && (
                          <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold">
                            <ShieldCheck className="h-4 w-4" /> Mobile verified successfully
                          </div>
                        )}
                      </div>

                      {ca.otpSent && !ca.otpVerified && (
                        <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                          <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Enter OTP</Label>
                          <div className="flex gap-3">
                            <Input
                              value={ca.otp}
                              onChange={(e) => updateCoApplicant(ca.id, { otp: e.target.value.replace(/\D/g, "") })}
                              placeholder="6-digit OTP"
                              className="h-12 font-bold tracking-[0.3em] text-center max-w-[200px]"
                              maxLength={6}
                            />
                            <Button
                              onClick={() => handleVerifyOtp(ca.id)}
                              className="h-12 px-6 bg-[#004499] hover:bg-[#003377] font-bold text-xs uppercase tracking-widest"
                            >
                              Verify OTP
                            </Button>
                          </div>
                          <p className="text-blue-500 text-xs font-semibold flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg w-fit">Demo OTP: <span className="font-mono font-black tracking-widest ml-1">123456</span></p>
                          {s3Errors[ca.id]?.otp && <p className="text-rose-500 text-xs font-bold flex items-center gap-1"><XCircle className="h-3 w-3" /> {s3Errors[ca.id].otp}</p>}
                        </div>
                      )}

                      {ca.otpVerified && (
                        <div className="space-y-6 border-t border-slate-100 pt-6 animate-in slide-in-from-bottom-4 duration-500">
                          <h4 className="text-sm font-black text-slate-600 uppercase tracking-widest">Co-Applicant Details</h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-2">
                              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">PAN</Label>
                              <Input
                                value={ca.pan}
                                onChange={(e) => updateCoApplicant(ca.id, { pan: e.target.value.toUpperCase() })}
                                placeholder="AAAAP9999A"
                                className="h-12 font-mono uppercase font-bold tracking-widest"
                                maxLength={10}
                              />
                              {s3Errors[ca.id]?.pan && <p className="text-rose-500 text-xs font-bold flex items-center gap-1"><XCircle className="h-3 w-3" /> {s3Errors[ca.id].pan}</p>}
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Relationship with Applicant</Label>
                              <Select value={ca.relationship} onValueChange={(v) => updateCoApplicant(ca.id, { relationship: v })}>
                                <SelectTrigger className="h-12 font-bold"><SelectValue placeholder="Select Relationship" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Father">Father</SelectItem>
                                  <SelectItem value="Mother">Mother</SelectItem>
                                  <SelectItem value="Brother">Brother</SelectItem>
                                </SelectContent>
                              </Select>
                              {s3Errors[ca.id]?.relationship && <p className="text-rose-500 text-xs font-bold flex items-center gap-1"><XCircle className="h-3 w-3" /> {s3Errors[ca.id].relationship}</p>}
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Name as per PAN</Label>
                              <Input
                                value={ca.name}
                                onChange={(e) => updateCoApplicant(ca.id, { name: e.target.value })}
                                placeholder="Full Name"
                                className="h-12 font-bold"
                              />
                              {s3Errors[ca.id]?.name && <p className="text-rose-500 text-xs font-bold flex items-center gap-1"><XCircle className="h-3 w-3" /> {s3Errors[ca.id].name}</p>}
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">DOB as per PAN</Label>
                              <div className="flex gap-2">
                                <Input
                                  type="date"
                                  className="h-12 font-bold"
                                  value={ca.dob ? format(ca.dob, "yyyy-MM-dd") : ""}
                                  max={format(new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()), "yyyy-MM-dd")}
                                  onChange={(e) => {
                                    const d = new Date(e.target.value);
                                    if (!isNaN(d.getTime())) updateCoApplicant(ca.id, { dob: d });
                                  }}
                                />
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button variant="outline" className="h-12 w-12 p-0 border-slate-200">
                                      <CalendarIcon className="h-4 w-4 text-slate-400" />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="end">
                                    <Calendar
                                      mode="single"
                                      captionLayout="dropdown"
                                      selected={ca.dob || undefined}
                                      onSelect={(d) => d && updateCoApplicant(ca.id, { dob: d })}
                                      fromYear={1950}
                                      toYear={new Date().getFullYear() - 18}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>
                              {s3Errors[ca.id]?.dob && <p className="text-rose-500 text-xs font-bold flex items-center gap-1"><XCircle className="h-3 w-3" /> {s3Errors[ca.id].dob}</p>}
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Gender</Label>
                              <RadioGroup value={ca.gender} onValueChange={(v) => updateCoApplicant(ca.id, { gender: v })} className="flex gap-6 pt-2">
                                {["Male", "Female", "Other"].map((g) => (
                                  <div key={g} className="flex items-center space-x-2">
                                    <RadioGroupItem value={g} id={`ca-gender-${ca.id}-${g}`} />
                                    <label htmlFor={`ca-gender-${ca.id}-${g}`} className="text-sm font-bold cursor-pointer">{g}</label>
                                  </div>
                                ))}
                              </RadioGroup>
                              {s3Errors[ca.id]?.gender && <p className="text-rose-500 text-xs font-bold flex items-center gap-1"><XCircle className="h-3 w-3" /> {s3Errors[ca.id].gender}</p>}
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Official Email ID</Label>
                              <Input
                                type="email"
                                value={ca.email}
                                onChange={(e) => updateCoApplicant(ca.id, { email: e.target.value })}
                                placeholder="email@company.com"
                                className="h-12 font-bold"
                              />
                              {s3Errors[ca.id]?.email && <p className="text-rose-500 text-xs font-bold flex items-center gap-1"><XCircle className="h-3 w-3" /> {s3Errors[ca.id].email}</p>}
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Type of Co-applicant</Label>
                              <div className="flex gap-6 pt-2">
                                {["Financial", "Non-financial"].map((t) => (
                                  <div key={t} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`ca-type-${ca.id}-${t}`}
                                      checked={ca.coApplicantType.includes(t)}
                                      onCheckedChange={(checked) => {
                                        const updated = checked
                                          ? [...ca.coApplicantType, t]
                                          : ca.coApplicantType.filter((x) => x !== t);
                                        updateCoApplicant(ca.id, { coApplicantType: updated });
                                      }}
                                    />
                                    <label htmlFor={`ca-type-${ca.id}-${t}`} className="text-sm font-bold cursor-pointer">{t}</label>
                                  </div>
                                ))}
                              </div>
                              {s3Errors[ca.id]?.coApplicantType && <p className="text-rose-500 text-xs font-bold flex items-center gap-1"><XCircle className="h-3 w-3" /> {s3Errors[ca.id].coApplicantType}</p>}
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Profession Type</Label>
                              <RadioGroup value={ca.professionType} onValueChange={(v) => updateCoApplicant(ca.id, { professionType: v })} className="flex gap-6 pt-2">
                                {["Salaried", "Self Employed"].map((p) => (
                                  <div key={p} className="flex items-center space-x-2">
                                    <RadioGroupItem value={p} id={`ca-prof-${ca.id}-${p}`} />
                                    <label htmlFor={`ca-prof-${ca.id}-${p}`} className="text-sm font-bold cursor-pointer">{p}</label>
                                  </div>
                                ))}
                              </RadioGroup>
                              {s3Errors[ca.id]?.professionType && <p className="text-rose-500 text-xs font-bold flex items-center gap-1"><XCircle className="h-3 w-3" /> {s3Errors[ca.id].professionType}</p>}
                            </div>

                            <div className="space-y-2 md:col-span-2">
                              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Address Line 1</Label>
                              <Input
                                value={ca.address1}
                                onChange={(e) => updateCoApplicant(ca.id, { address1: e.target.value })}
                                placeholder="House/Flat No., Building Name, Street"
                                className="h-12 font-bold"
                              />
                              {s3Errors[ca.id]?.address1 && <p className="text-rose-500 text-xs font-bold flex items-center gap-1"><XCircle className="h-3 w-3" /> {s3Errors[ca.id].address1}</p>}
                            </div>

                            <div className="space-y-2 md:col-span-2">
                              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Address Line 2 <span className="text-slate-300">(Optional)</span></Label>
                              <Input
                                value={ca.address2}
                                onChange={(e) => updateCoApplicant(ca.id, { address2: e.target.value })}
                                placeholder="Landmark, Area"
                                className="h-12 font-bold"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Pin Code</Label>
                              <Input
                                value={ca.pincode}
                                onChange={(e) => updateCoApplicant(ca.id, { pincode: e.target.value.replace(/\D/g, ""), city: "", state: "" })}
                                onBlur={() =>
                                  handlePincodeBlur(
                                    ca.pincode,
                                    (city, state) => updateCoApplicant(ca.id, { city, state }),
                                    (field, msg) => setS3Errors((prev) => ({ ...prev, [ca.id]: { ...prev[ca.id], [field]: msg } }))
                                  )
                                }
                                placeholder="6-digit pin code"
                                className="h-12 font-bold"
                                maxLength={6}
                              />
                              {s3Errors[ca.id]?.pincode && <p className="text-rose-500 text-xs font-bold flex items-center gap-1"><XCircle className="h-3 w-3" /> {s3Errors[ca.id].pincode}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">City</Label>
                                <Input value={ca.city} readOnly className="h-12 font-bold bg-slate-50 text-slate-500" placeholder="Auto-filled" />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">State</Label>
                                <Input value={ca.state} readOnly className="h-12 font-bold bg-slate-50 text-slate-500" placeholder="Auto-filled" />
                              </div>
                            </div>
                          </div>

                          <Button
                            onClick={() => handleSaveCoApplicant(ca.id)}
                            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 font-bold text-sm uppercase tracking-widest shadow-lg"
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4" /> Save Co-applicant
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              ))}

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={addCoApplicant}
                  variant="outline"
                  disabled={coApplicants.length >= 4}
                  className="flex-1 h-12 border-dashed border-2 border-slate-300 text-slate-600 hover:border-[#004499] hover:text-[#004499] font-bold text-xs uppercase tracking-widest disabled:opacity-50"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {coApplicants.length >= 4 ? "Maximum 4 Co-Applicants" : "Add Co-Applicant"}
                </Button>

                <Button
                  onClick={handleStage3Continue}
                  disabled={!canContinueStage3}
                  className="flex-1 h-12 bg-[#004499] hover:bg-[#003377] font-bold text-sm uppercase tracking-widest shadow-xl shadow-blue-100 group disabled:opacity-50"
                >
                  Continue
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              {!canContinueStage3 && coApplicants.length > 0 && (
                <p className="text-amber-600 text-xs font-bold text-center">
                  At least 2 co-applicants must be saved to continue.
                </p>
              )}
            </div>
          )}

          {stage === "stage4" && (
            <div className="p-12 space-y-8 animate-in slide-in-from-right-8 duration-500">
              <div className="border-l-4 border-[#004499] pl-6 py-2">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Stage 4 of 10 — Account Aggregator (Bank Connect)</h2>
                <p className="text-slate-500 text-sm font-medium italic">Initiate bank verification for the education loan.</p>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-blue-200 shadow-sm">
                    <Landmark className="h-6 w-6 text-[#004499]" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900">Bank Verification Link</h3>
                    <p className="text-sm text-slate-500">Click the below link to initiate bank verification</p>
                  </div>
                </div>

                <div className="bg-white border border-blue-200 rounded-lg p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <LinkIcon className="h-4 w-4 text-[#004499] flex-shrink-0" />
                    <a
                      href={demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#004499] font-mono font-bold truncate hover:underline"
                    >
                      {demoLink}
                    </a>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(demoLink);
                      toast({ title: "Link Copied", description: "Bank verification link copied to clipboard." });
                    }}
                    className="flex-shrink-0 border-blue-200 text-[#004499] hover:bg-blue-50 font-bold text-xs uppercase"
                  >
                    <Copy className="h-3 w-3 mr-1" /> Copy
                  </Button>
                </div>
              </div>

              <Button
                onClick={() => setStage("stage5")}
                className="w-full h-14 bg-[#004499] hover:bg-[#003377] text-lg font-black uppercase tracking-widest shadow-xl shadow-blue-100 group"
              >
                Continue to Offer Screen
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          )}

          {/* STAGE 5: Offer Screen */}
          {stage === "stage5" && (
            <div className="p-10 space-y-8 animate-in slide-in-from-right-8 duration-500">
              <div className="border-l-4 border-[#004499] pl-6 py-2">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Stage 5 of 10 — Loan Offer</h2>
                <p className="text-slate-500 text-sm font-medium italic">Review the education loan offer details.</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8 space-y-6">
                <div className="text-center space-y-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Eligible Loan Amount</p>
                  <div className="flex items-center justify-center gap-2">
                    <IndianRupee className="h-8 w-8 text-[#004499]" />
                    <span className="text-5xl font-black text-[#004499] tracking-tight">10,00,000</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-4 text-center border border-blue-100 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Tenure</p>
                    <p className="text-lg font-black text-slate-900">180 months</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center border border-blue-100 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Processing Fee</p>
                    <p className="text-lg font-black text-slate-900">₹1200 + GST</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center border border-blue-100 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Interest</p>
                    <p className="text-lg font-black text-slate-900">12% <span className="text-xs text-slate-400">(Floating)</span></p>
                  </div>
                </div>
              </div>

              <Card className="border-slate-200 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-600 mb-4 flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Loan Offer Breakdown
                  </h3>
                  <div className="divide-y divide-slate-100">
                    {[
                      ["Loan Amount", "₹10,00,000"],
                      ["Partial Monthly Interest", "₹0 (Full Moratorium)"],
                      ["Course Period", "23 months"],
                      ["Moratorium (incl. course period)", "48 months"],
                      ["Indicative Monthly EMI (Post Moratorium)", "₹2,000"],
                      ["Total Tenure Including Moratorium", "180 months"],
                      ["Rate of Interest", "12% (Floating)"],
                      ["Processing Fee", "₹1200 + GST (Additional charges may apply)"],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between py-3">
                        <span className="text-sm font-medium text-slate-500">{label}</span>
                        <span className="text-sm font-black text-slate-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={() => setStage("stage6")}
                className="w-full h-14 bg-[#004499] hover:bg-[#003377] text-lg font-black uppercase tracking-widest shadow-xl shadow-blue-100 group"
              >
                Accept Offer & Continue
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          )}

          {/* STAGE 6: KYC */}
          {stage === "stage6" && (
            <div className="p-10 space-y-8 animate-in slide-in-from-right-8 duration-500">
              <div className="border-l-4 border-[#004499] pl-6 py-2">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Stage 6 of 10 — KYC Verification</h2>
                <p className="text-slate-500 text-sm font-medium italic">Complete Know Your Customer verification.</p>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-blue-200 shadow-sm">
                    <ShieldCheck className="h-7 w-7 text-[#004499]" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-lg">KYC Verification</h3>
                    <p className="text-sm text-slate-500">Send a KYC link to the applicant for identity verification.</p>
                  </div>
                </div>

                {kycStatus === "pending" && (
                  <Button onClick={handleKycSend} className="w-full h-12 bg-[#004499] hover:bg-[#003377] font-bold text-sm uppercase tracking-widest">
                    <ExternalLink className="mr-2 h-4 w-4" /> Send KYC Link
                  </Button>
                )}

                {kycStatus === "sent" && (
                  <div className="space-y-4">
                    <div className="bg-white border border-blue-200 rounded-xl p-4 flex items-center gap-3">
                      <MailCheck className="h-5 w-5 text-amber-500" />
                      <span className="text-sm font-bold text-slate-700">KYC link sent. Awaiting applicant response...</span>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-3">Mock Simulator</p>
                      <div className="flex gap-3">
                        <Button onClick={() => handleKycSimulate("approved")} className="flex-1 h-10 bg-emerald-600 hover:bg-emerald-700 font-bold text-xs uppercase">
                          <Check className="mr-1 h-3 w-3" /> Approve KYC
                        </Button>
                        <Button onClick={() => handleKycSimulate("rejected")} variant="destructive" className="flex-1 h-10 font-bold text-xs uppercase">
                          <XCircle className="mr-1 h-3 w-3" /> Reject KYC
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {kycStatus === "verifying" && (
                  <div className="flex items-center justify-center gap-3 py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-[#004499]" />
                    <span className="font-bold text-slate-600">Verifying KYC...</span>
                  </div>
                )}

                {kycStatus === "approved" && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                    <span className="font-bold text-emerald-700">KYC verification approved successfully!</span>
                  </div>
                )}

                {kycStatus === "rejected" && (
                  <div className="space-y-3">
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center gap-3">
                      <XCircle className="h-6 w-6 text-rose-600" />
                      <span className="font-bold text-rose-700">KYC verification rejected. Please retry.</span>
                    </div>
                    <Button onClick={() => { setKycStatus("pending"); }} variant="outline" className="w-full h-10 font-bold text-xs uppercase border-rose-200 text-rose-600">
                      Retry KYC
                    </Button>
                  </div>
                )}
              </div>

              <Button
                onClick={() => setStage(isStp ? "stage7" : "stage8")}
                disabled={kycStatus !== "approved"}
                className="w-full h-14 bg-[#004499] hover:bg-[#003377] text-lg font-black uppercase tracking-widest shadow-xl shadow-blue-100 group disabled:opacity-50"
              >
                Continue
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          )}

          {/* STAGE 7: Payment Link (STP only) */}
          {stage === "stage7" && (
            <div className="p-10 space-y-8 animate-in slide-in-from-right-8 duration-500">
              <div className="border-l-4 border-[#004499] pl-6 py-2">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Stage 7 of 10 — Payment</h2>
                <p className="text-slate-500 text-sm font-medium italic">Process the payment for STP case.</p>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-blue-200 shadow-sm">
                    <IndianRupee className="h-7 w-7 text-[#004499]" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-lg">Payment Processing</h3>
                    <p className="text-sm text-slate-500">Send a payment link to the applicant for processing fee.</p>
                  </div>
                  <div className="ml-auto bg-emerald-100 text-emerald-700 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full">STP Case</div>
                </div>

                {paymentStatus === "pending" && (
                  <Button onClick={handlePaymentSend} className="w-full h-12 bg-[#004499] hover:bg-[#003377] font-bold text-sm uppercase tracking-widest">
                    <ExternalLink className="mr-2 h-4 w-4" /> Send Payment Link
                  </Button>
                )}

                {paymentStatus === "sent" && (
                  <div className="space-y-4">
                    <div className="bg-white border border-blue-200 rounded-xl p-4 flex items-center gap-3">
                      <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
                      <span className="text-sm font-bold text-slate-700">Payment link sent. Awaiting payment...</span>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-3">Mock Simulator</p>
                      <div className="flex gap-3">
                        <Button onClick={() => handlePaymentSimulate("success")} className="flex-1 h-10 bg-emerald-600 hover:bg-emerald-700 font-bold text-xs uppercase">
                          <Check className="mr-1 h-3 w-3" /> Payment Success
                        </Button>
                        <Button onClick={() => handlePaymentSimulate("failed")} variant="destructive" className="flex-1 h-10 font-bold text-xs uppercase">
                          <XCircle className="mr-1 h-3 w-3" /> Payment Failed
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {paymentStatus === "success" && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                    <span className="font-bold text-emerald-700">Payment received successfully! Amount: ₹1,416 (₹1,200 + GST)</span>
                  </div>
                )}

                {paymentStatus === "failed" && (
                  <div className="space-y-3">
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center gap-3">
                      <XCircle className="h-6 w-6 text-rose-600" />
                      <span className="font-bold text-rose-700">Payment failed. Please retry.</span>
                    </div>
                    <Button onClick={() => setPaymentStatus("pending")} variant="outline" className="w-full h-10 font-bold text-xs uppercase border-rose-200 text-rose-600">
                      Retry Payment
                    </Button>
                  </div>
                )}
              </div>

              <Button
                onClick={() => setStage("stage8")}
                disabled={paymentStatus !== "success"}
                className="w-full h-14 bg-[#004499] hover:bg-[#003377] text-lg font-black uppercase tracking-widest shadow-xl shadow-blue-100 group disabled:opacity-50"
              >
                Continue
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          )}

          {/* STAGE 8: Additional Details */}
          {stage === "stage8" && (
            <div className="p-10 space-y-8 animate-in slide-in-from-right-8 duration-500">
              <div className="border-l-4 border-[#004499] pl-6 py-2">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Stage 8 of 10 — Additional Details</h2>
                <p className="text-slate-500 text-sm font-medium italic">Education details and collateral information.</p>
              </div>

              {/* Education Details */}
              <Card className="border-slate-200 shadow-lg">
                <CardContent className="p-6 space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-600 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" /> Applicant Education Details
                  </h3>

                  {/* SSC */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#004499]">SSC Details</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Exam Name</Label>
                        <Input value="SSC" readOnly className="h-12 font-bold bg-slate-50" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Board Name</Label>
                        <Input value={s8.sscBoard} onChange={(e) => setS8({ ...s8, sscBoard: e.target.value })} className="h-12 font-bold" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Passing Score</Label>
                        <Input value={s8.sscScore} onChange={(e) => setS8({ ...s8, sscScore: e.target.value })} className="h-12 font-bold" placeholder="Up to 2 decimal places" />
                      </div>
                    </div>
                  </div>

                  {/* HSC */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#004499]">HSC Details</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Exam Name</Label>
                        <Input value="HSC" readOnly className="h-12 font-bold bg-slate-50" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Board Name</Label>
                        <Input value={s8.hscBoard} onChange={(e) => setS8({ ...s8, hscBoard: e.target.value })} className="h-12 font-bold" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Passing Score</Label>
                        <Input value={s8.hscScore} onChange={(e) => setS8({ ...s8, hscScore: e.target.value })} className="h-12 font-bold" placeholder="Up to 2 decimal places" />
                      </div>
                    </div>
                  </div>

                  {/* Graduation */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#004499]">Graduation Details</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Exam Name</Label>
                        <Input value="Graduation" readOnly className="h-12 font-bold bg-slate-50" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Board / University Name</Label>
                        <Input value={s8.gradUniversity} onChange={(e) => setS8({ ...s8, gradUniversity: e.target.value })} className="h-12 font-bold" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Collateral Details */}
              <Card className="border-slate-200 shadow-lg">
                <CardContent className="p-6 space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-600 flex items-center gap-2">
                    <Building className="h-4 w-4" /> Collateral Details
                  </h3>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Collateral Offered</Label>
                    <RadioGroup value={s8.collateralOffered} onValueChange={(v) => setS8({ ...s8, collateralOffered: v })} className="flex gap-6 pt-1">
                      {["yes", "no"].map((v) => (
                        <div key={v} className="flex items-center space-x-2">
                          <RadioGroupItem value={v} id={`collateral-${v}`} />
                          <label htmlFor={`collateral-${v}`} className="text-sm font-bold cursor-pointer capitalize">{v}</label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {s8.collateralOffered === "yes" && (
                    <div className="space-y-6 border-t border-slate-100 pt-6">
                      {/* Collateral Info */}
                      <div className="space-y-3">
                        <p className="text-xs font-bold uppercase tracking-widest text-[#004499]">Collateral Information</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Collateral Type</Label>
                            <Input value={s8.collateralType} readOnly className="h-12 font-bold bg-slate-50" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Collateral Subtype</Label>
                            <Select value={s8.collateralSubtype} onValueChange={(v) => setS8({ ...s8, collateralSubtype: v })}>
                              <SelectTrigger className="h-12 font-bold"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {["Residential", "Commercial", "Industrial", "Agricultural"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Property Type</Label>
                            <Select value={s8.propertyType} onValueChange={(v) => setS8({ ...s8, propertyType: v })}>
                              <SelectTrigger className="h-12 font-bold"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {["Flat", "Bungalow", "Row House", "Plot", "Villa"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Nature of Property</Label>
                            <Select value={s8.natureOfProperty} onValueChange={(v) => setS8({ ...s8, natureOfProperty: v })}>
                              <SelectTrigger className="h-12 font-bold"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {["Self Constructed", "Builder Constructed", "Ready Possession", "Under Construction"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Property Value (₹)</Label>
                            <Input value={s8.propertyValue} onChange={(e) => setS8({ ...s8, propertyValue: e.target.value.replace(/\D/g, "") })} className="h-12 font-bold" />
                          </div>
                        </div>
                      </div>

                      {/* Other Details */}
                      <div className="space-y-3">
                        <p className="text-xs font-bold uppercase tracking-widest text-[#004499]">Other Details</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Property Purpose</Label>
                            <Select value={s8.propertyPurpose} onValueChange={(v) => setS8({ ...s8, propertyPurpose: v })}>
                              <SelectTrigger className="h-12 font-bold"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {["Self Occupied", "Rented", "Vacant", "Commercial Use"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Property Classification</Label>
                            <Select value={s8.propertyClassification} onValueChange={(v) => setS8({ ...s8, propertyClassification: v })}>
                              <SelectTrigger className="h-12 font-bold"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {["Urban", "Semi-Urban", "Rural", "Metropolitan"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Property Ownership</Label>
                            <Select value={s8.propertyOwnership} onValueChange={(v) => setS8({ ...s8, propertyOwnership: v })}>
                              <SelectTrigger className="h-12 font-bold"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {["Self Owned", "Family Owned", "Joint Ownership", "Leased"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Property Dimensions */}
                      <div className="space-y-3">
                        <p className="text-xs font-bold uppercase tracking-widest text-[#004499]">Property Dimensions</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Built Up Area (sq ft)</Label>
                            <Input value={s8.builtUpArea} onChange={(e) => setS8({ ...s8, builtUpArea: e.target.value })} className="h-12 font-bold" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Carpet Area (sq ft)</Label>
                            <Input value={s8.carpetArea} onChange={(e) => setS8({ ...s8, carpetArea: e.target.value })} className="h-12 font-bold" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Age of Property (Years)</Label>
                            <Input value={s8.ageOfProperty} onChange={(e) => setS8({ ...s8, ageOfProperty: e.target.value })} className="h-12 font-bold" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Residual Age</Label>
                            <Select value={s8.residualAge} onValueChange={(v) => setS8({ ...s8, residualAge: v })}>
                              <SelectTrigger className="h-12 font-bold"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {["10+ Years", "20+ Years", "30+ Years", "40+ Years", "50+ Years"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Property Address */}
                      <div className="space-y-3">
                        <p className="text-xs font-bold uppercase tracking-widest text-[#004499]">Property Address</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Address Type</Label>
                            <Input value={s8.addressType} onChange={(e) => setS8({ ...s8, addressType: e.target.value })} className="h-12 font-bold" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">City</Label>
                            <Input value={s8.propertyCity} onChange={(e) => setS8({ ...s8, propertyCity: e.target.value })} className="h-12 font-bold" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">State</Label>
                            <Input value={s8.propertyState} onChange={(e) => setS8({ ...s8, propertyState: e.target.value })} className="h-12 font-bold" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Country</Label>
                            <Input value={s8.propertyCountry} onChange={(e) => setS8({ ...s8, propertyCountry: e.target.value })} className="h-12 font-bold" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Pincode</Label>
                            <Input value={s8.propertyPincode} onChange={(e) => setS8({ ...s8, propertyPincode: e.target.value.replace(/\D/g, "") })} className="h-12 font-bold" maxLength={6} />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Flat / Plot Number</Label>
                            <Input value={s8.flatPlotNo} onChange={(e) => setS8({ ...s8, flatPlotNo: e.target.value })} className="h-12 font-bold" />
                          </div>
                        </div>
                      </div>

                      {/* Ownership Details */}
                      <div className="space-y-3">
                        <p className="text-xs font-bold uppercase tracking-widest text-[#004499]">Ownership Details</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Ownership Status</Label>
                            <Select value={s8.ownershipStatus} onValueChange={(v) => setS8({ ...s8, ownershipStatus: v })}>
                              <SelectTrigger className="h-12 font-bold"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {["Owned", "Mortgaged", "Under Dispute", "Government Allotted"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Owner Type</Label>
                            <Select value={s8.ownerType} onValueChange={(v) => setS8({ ...s8, ownerType: v })}>
                              <SelectTrigger className="h-12 font-bold"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {["Individual", "Joint", "Company", "Trust"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Owner Name</Label>
                            <Input value={s8.ownerName} onChange={(e) => setS8({ ...s8, ownerName: e.target.value })} className="h-12 font-bold" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Linked Applicant</Label>
                            <Input value={s8.linkedApplicant} readOnly className="h-12 font-bold bg-slate-50 text-slate-500" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Percentage Share (%)</Label>
                            <Input value={s8.percentageShare} onChange={(e) => setS8({ ...s8, percentageShare: e.target.value })} className="h-12 font-bold" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Ownership From</Label>
                            <Input
                              type="date"
                              className="h-12 font-bold"
                              value={s8.ownershipFrom ? format(s8.ownershipFrom, "yyyy-MM-dd") : ""}
                              onChange={(e) => { const d = new Date(e.target.value); if (!isNaN(d.getTime())) setS8({ ...s8, ownershipFrom: d }); }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Ownership To <span className="text-slate-300">(Optional)</span></Label>
                            <Input
                              type="date"
                              className="h-12 font-bold"
                              value={s8.ownershipTo ? format(s8.ownershipTo, "yyyy-MM-dd") : ""}
                              onChange={(e) => { const d = new Date(e.target.value); if (!isNaN(d.getTime())) setS8({ ...s8, ownershipTo: d }); }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Button
                onClick={() => setStage("stage8email")}
                className="w-full h-14 bg-[#004499] hover:bg-[#003377] text-lg font-black uppercase tracking-widest shadow-xl shadow-blue-100 group"
              >
                Continue to Email Verification
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          )}

          {/* STAGE 8 Email Verification */}
          {stage === "stage8email" && (
            <div className="p-10 space-y-8 animate-in slide-in-from-right-8 duration-500">
              <div className="border-l-4 border-[#004499] pl-6 py-2">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Stage 8 of 10 — Email Verification</h2>
                <p className="text-slate-500 text-sm font-medium italic">Verify the applicant's email address before proceeding.</p>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-blue-200 shadow-sm">
                    <MailCheck className="h-7 w-7 text-[#004499]" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-lg">Email Verification</h3>
                    <p className="text-sm text-slate-500">Send a verification email to <span className="font-bold text-slate-700">{s1.email}</span></p>
                  </div>
                </div>

                {!emailVerified && !emailVerifying && !emailFailed && (
                  <Button onClick={handleEmailVerify} className="w-full h-12 bg-[#004499] hover:bg-[#003377] font-bold text-sm uppercase tracking-widest">
                    <Mail className="mr-2 h-4 w-4" /> Send Verification Email
                  </Button>
                )}

                {emailVerifying && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-3 py-4">
                      <MailCheck className="h-5 w-5 text-amber-500" />
                      <span className="font-bold text-slate-600">Verification email sent. Awaiting response...</span>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-3">Mock Simulator</p>
                      <div className="flex gap-3">
                        <Button onClick={() => handleEmailSimulate("success")} className="flex-1 h-10 bg-emerald-600 hover:bg-emerald-700 font-bold text-xs uppercase">
                          <Check className="mr-1 h-3 w-3" /> Verify Success
                        </Button>
                        <Button onClick={() => handleEmailSimulate("failed")} variant="destructive" className="flex-1 h-10 font-bold text-xs uppercase">
                          <XCircle className="mr-1 h-3 w-3" /> Verify Failed
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {emailVerified && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                    <span className="font-bold text-emerald-700">Email verified successfully!</span>
                  </div>
                )}

                {emailFailed && !emailVerifying && (
                  <div className="space-y-3">
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center gap-3">
                      <XCircle className="h-6 w-6 text-rose-600" />
                      <span className="font-bold text-rose-700">Email verification failed. Please retry.</span>
                    </div>
                    <Button onClick={() => { setEmailFailed(false); handleEmailVerify(); }} variant="outline" className="w-full h-10 font-bold text-xs uppercase border-rose-200 text-rose-600">
                      Retry Email Verification
                    </Button>
                  </div>
                )}
              </div>

              <Button
                onClick={() => setStage("stage9")}
                disabled={!emailVerified}
                className="w-full h-14 bg-[#004499] hover:bg-[#003377] text-lg font-black uppercase tracking-widest shadow-xl shadow-blue-100 group disabled:opacity-50"
              >
                Continue to Document Upload
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          )}

          {/* STAGE 9: Document Upload */}
          {stage === "stage9" && (
            <div className="p-10 space-y-8 animate-in slide-in-from-right-8 duration-500">
              <div className="border-l-4 border-[#004499] pl-6 py-2">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Stage 9 of 10 — Document Upload</h2>
                <p className="text-slate-500 text-sm font-medium italic">Upload all required applicant and co-applicant documents.</p>
              </div>

              {/* Applicant Documents */}
              <Card className="border-slate-200 shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-600 flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Applicant Documents
                  </h3>

                  {APPLICANT_DOC_SECTIONS.map((section) => (
                    <div key={section.title} className="border border-slate-100 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleSection(section.title)}
                        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                      >
                        <span className="text-xs font-black uppercase tracking-widest text-slate-600">{section.title}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400">
                            {section.docs.filter((d) => uploadedDocs[d]).length}/{section.docs.length}
                          </span>
                          {expandedSections[section.title] ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                        </div>
                      </button>
                      {expandedSections[section.title] && (
                        <div className="p-4 space-y-3">
                          {section.docs.map((doc) => (
                            <div key={doc} className="flex items-center justify-between py-2 px-3 bg-white border border-slate-100 rounded-lg">
                              <div className="flex items-center gap-3">
                                {uploadedDocs[doc] ? (
                                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                ) : (
                                  <div className="h-4 w-4 rounded-full border-2 border-slate-300" />
                                )}
                                <span className="text-sm font-medium text-slate-700">{doc}</span>
                              </div>
                              {uploadedDocs[doc] ? (
                                <span className="text-xs font-bold text-emerald-600 uppercase">Uploaded</span>
                              ) : (
                                <Button onClick={() => handleUploadDoc(doc)} size="sm" variant="outline" className="h-8 text-xs font-bold uppercase tracking-widest border-[#004499] text-[#004499] hover:bg-blue-50">
                                  <Upload className="h-3 w-3 mr-1" /> Upload
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="additional-applicant"
                      checked={additionalApplicantDocs}
                      onCheckedChange={(c) => setAdditionalApplicantDocs(!!c)}
                    />
                    <label htmlFor="additional-applicant" className="text-sm font-bold text-slate-600 cursor-pointer">Upload Additional Documents</label>
                  </div>

                  {additionalApplicantDocs && (
                    <div className="border border-dashed border-slate-300 rounded-xl p-4 space-y-3">
                      {["Additional Document 1", "Additional Document 2"].map((doc) => (
                        <div key={doc} className="flex items-center justify-between py-2 px-3 bg-white border border-slate-100 rounded-lg">
                          <div className="flex items-center gap-3">
                            {uploadedDocs[doc] ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <div className="h-4 w-4 rounded-full border-2 border-slate-300" />}
                            <span className="text-sm font-medium text-slate-700">{doc}</span>
                          </div>
                          {uploadedDocs[doc] ? (
                            <span className="text-xs font-bold text-emerald-600 uppercase">Uploaded</span>
                          ) : (
                            <Button onClick={() => handleUploadDoc(doc)} size="sm" variant="outline" className="h-8 text-xs font-bold uppercase tracking-widest border-[#004499] text-[#004499] hover:bg-blue-50">
                              <Upload className="h-3 w-3 mr-1" /> Upload
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Co-Applicant Documents */}
              <Card className="border-slate-200 shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-600 flex items-center gap-2">
                    <Users className="h-4 w-4" /> Co-Applicant Documents
                  </h3>

                  {coApplicants.filter((c) => c.saved).map((ca) => (
                    <div key={ca.id} className="border border-slate-100 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleSection(`ca-${ca.id}`)}
                        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                      >
                        <span className="text-xs font-black uppercase tracking-widest text-slate-600">{ca.name} ({ca.relationship})</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400">
                            {COAPPLICANT_DOCS.filter((d) => uploadedDocs[`${ca.id}-${d}`]).length}/{COAPPLICANT_DOCS.length}
                          </span>
                          {expandedSections[`ca-${ca.id}`] ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                        </div>
                      </button>
                      {expandedSections[`ca-${ca.id}`] && (
                        <div className="p-4 space-y-3">
                          {COAPPLICANT_DOCS.map((doc) => {
                            const key = `${ca.id}-${doc}`;
                            return (
                              <div key={key} className="flex items-center justify-between py-2 px-3 bg-white border border-slate-100 rounded-lg">
                                <div className="flex items-center gap-3">
                                  {uploadedDocs[key] ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <div className="h-4 w-4 rounded-full border-2 border-slate-300" />}
                                  <span className="text-sm font-medium text-slate-700">{doc}</span>
                                </div>
                                {uploadedDocs[key] ? (
                                  <span className="text-xs font-bold text-emerald-600 uppercase">Uploaded</span>
                                ) : (
                                  <Button onClick={() => handleUploadDoc(key)} size="sm" variant="outline" className="h-8 text-xs font-bold uppercase tracking-widest border-[#004499] text-[#004499] hover:bg-blue-50">
                                    <Upload className="h-3 w-3 mr-1" /> Upload
                                  </Button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="additional-coapplicant"
                      checked={additionalCoapplicantDocs}
                      onCheckedChange={(c) => setAdditionalCoapplicantDocs(!!c)}
                    />
                    <label htmlFor="additional-coapplicant" className="text-sm font-bold text-slate-600 cursor-pointer">Upload Additional Co-Applicant Documents</label>
                  </div>

                  {additionalCoapplicantDocs && (
                    <div className="border border-dashed border-slate-300 rounded-xl p-4 space-y-3">
                      {["Co-Applicant Additional Doc 1", "Co-Applicant Additional Doc 2"].map((doc) => (
                        <div key={doc} className="flex items-center justify-between py-2 px-3 bg-white border border-slate-100 rounded-lg">
                          <div className="flex items-center gap-3">
                            {uploadedDocs[doc] ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <div className="h-4 w-4 rounded-full border-2 border-slate-300" />}
                            <span className="text-sm font-medium text-slate-700">{doc}</span>
                          </div>
                          {uploadedDocs[doc] ? (
                            <span className="text-xs font-bold text-emerald-600 uppercase">Uploaded</span>
                          ) : (
                            <Button onClick={() => handleUploadDoc(doc)} size="sm" variant="outline" className="h-8 text-xs font-bold uppercase tracking-widest border-[#004499] text-[#004499] hover:bg-blue-50">
                              <Upload className="h-3 w-3 mr-1" /> Upload
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {(() => {
                const mandatoryApplicantDocs = APPLICANT_DOC_SECTIONS.flatMap((s) => s.docs);
                const missingApplicant = mandatoryApplicantDocs.filter((d) => !uploadedDocs[d]);
                const savedCas = coApplicants.filter((c) => c.saved);
                const missingCa = savedCas.flatMap((ca) =>
                  COAPPLICANT_DOCS.filter((d) => !uploadedDocs[`${ca.id}-${d}`]).map((d) => `${ca.name}: ${d}`)
                );
                const allUploaded = missingApplicant.length === 0 && missingCa.length === 0;
                return (
                  <>
                    {!allUploaded && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-2">Missing Documents ({missingApplicant.length + missingCa.length})</p>
                        <p className="text-xs text-amber-600">
                          {missingApplicant.length > 0 && `Applicant: ${missingApplicant.slice(0, 3).join(", ")}${missingApplicant.length > 3 ? ` and ${missingApplicant.length - 3} more` : ""}. `}
                          {missingCa.length > 0 && `Co-applicant: ${missingCa.slice(0, 3).join(", ")}${missingCa.length > 3 ? ` and ${missingCa.length - 3} more` : ""}.`}
                        </p>
                      </div>
                    )}
                    <Button
                      onClick={() => handleStage10()}
                      disabled={!allUploaded}
                      className="w-full h-14 bg-[#004499] hover:bg-[#003377] text-lg font-black uppercase tracking-widest shadow-xl shadow-blue-100 group disabled:opacity-50"
                    >
                      Submit Documents & Continue
                      <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </>
                );
              })()}
            </div>
          )}

          {/* STAGE 10: Loan Approval Disbursed */}
          {stage === "stage10" && (
            <div className="p-12 space-y-8 animate-in slide-in-from-bottom-8 duration-700">
              <div className="text-center space-y-6">
                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-200 shadow-lg">
                  <PartyPopper className="h-12 w-12 text-emerald-600" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Loan Approved & Disbursed!</h2>
                  <p className="text-slate-500 text-lg font-medium">The education loan has been successfully approved and disbursed.</p>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 max-w-lg mx-auto space-y-4">
                  <div className="flex justify-between py-2 border-b border-emerald-100">
                    <span className="text-sm font-medium text-slate-500">Applicant</span>
                    <span className="text-sm font-black text-slate-900">{s1.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-emerald-100">
                    <span className="text-sm font-medium text-slate-500">Loan Amount</span>
                    <span className="text-sm font-black text-emerald-700">₹10,00,000</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-emerald-100">
                    <span className="text-sm font-medium text-slate-500">Tenure</span>
                    <span className="text-sm font-black text-slate-900">180 months</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-emerald-100">
                    <span className="text-sm font-medium text-slate-500">EMI (Post Moratorium)</span>
                    <span className="text-sm font-black text-slate-900">₹2,000/month</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm font-medium text-slate-500">Status</span>
                    <span className="text-sm font-black text-emerald-700 uppercase tracking-widest">Disbursed</span>
                  </div>
                </div>

                <Button
                  onClick={handleBackToDashboard}
                  className="w-full max-w-lg mx-auto h-14 bg-[#004499] hover:bg-[#003377] text-lg font-black uppercase tracking-widest shadow-xl shadow-blue-100 group"
                >
                  <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                  Back to Dashboard
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
