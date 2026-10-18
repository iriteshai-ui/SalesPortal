"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ShieldCheck,
  FileText,
  UploadCloud,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Building2,
  Mail,
  Lock,
  Unlock,
  Eye,
  RefreshCw,
  RotateCcw,
  Sparkles,
  FileCheck2,
  Check,
  X,
  FileSpreadsheet,
  AlertTriangle,
  Briefcase,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/utils";
import { DemoProfile } from "../constants/el-mock-data";

interface Props {
  customerData: DemoProfile;
  appId: string;
  stageNumber?: number;
  onComplete: () => void;
  onSkip: () => void;
  onBack?: () => void;
}

type VerificationTab = "salary_slip" | "uan" | "email_otp";

interface UploadedDocument {
  id: string;
  name: string;
  type: "PDF" | "PNG Image";
  size: string;
  uploadDate: string;
  status: "Uploaded";
}

export default function Stage5EmploymentVerification({
  customerData,
  appId,
  stageNumber = 4,
  onComplete,
  onSkip,
  onBack,
}: Props) {
  // ── Stage 4 Decision State ──
  // 'unselected' = Decision screen asking agent: "Do you want to proceed with Employment Verification?"
  // 'yes' = Proceed into Stage 4 Verification Screen
  // 'no' = Skip Stage 4 and proceed directly to next stage
  const [decision, setDecision] = useState<"unselected" | "yes" | "no">("unselected");

  // Active Verification Method Tab
  const [activeTab, setActiveTab] = useState<VerificationTab>("salary_slip");

  // ── Option A: Upload Salary Slip State ──
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "uploaded">("idle");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocument[]>([]);
  const [previewDoc, setPreviewDoc] = useState<UploadedDocument | null>(null);

  // ── Option B: UAN-Based Verification State ──
  const [uanInput, setUanInput] = useState<string>("");
  const [uanError, setUanError] = useState<string | null>(null);
  const [uanState, setUanState] = useState<"idle" | "verifying" | "verified">("idle");
  const [uanDetails, setUanDetails] = useState<{
    maskedUan: string;
    employerName: string;
    memberId: string;
    doj: string;
    timestamp: string;
  } | null>(null);

  // ── Option C: Official Email OTP Verification State ──
  const defaultWorkEmail = customerData.email
    ? customerData.email.replace(/@example\.com|@gmail\.com/, "@tcs.com")
    : "aarav.sharma@tcs.com";
  const [officialEmail, setOfficialEmail] = useState<string>(defaultWorkEmail);
  const [emailState, setEmailState] = useState<
    "idle" | "request_sent" | "checking" | "verified" | "failed"
  >("idle");
  const [simulatedDiyOutcome, setSimulatedDiyOutcome] = useState<"success" | "failure">("success");
  const [isEditableAfterVerification, setIsEditableAfterVerification] = useState<boolean>(false);
  const [editedCustomerName, setEditedCustomerName] = useState<string>(customerData.fullName || "Aarav Sharma");
  const [editedMobile, setEditedMobile] = useState<string>(customerData.mobile || "9820012345");

  // ─────────────────────────────────────────────────────────────
  // Option A Handlers
  // ─────────────────────────────────────────────────────────────
  const handleStartUpload = () => {
    setUploadState("uploading");
    setUploadProgress(20);

    const step1 = setTimeout(() => setUploadProgress(55), 400);
    const step2 = setTimeout(() => setUploadProgress(85), 800);
    const step3 = setTimeout(() => {
      setUploadProgress(100);
      setUploadedDocs([
        {
          id: "doc-1",
          name: "Salary_Slip_September_2024.pdf",
          type: "PDF",
          size: "1.4 MB",
          uploadDate: "Just now",
          status: "Uploaded",
        },
        {
          id: "doc-2",
          name: "Salary_Slip_August_2024.png",
          type: "PNG Image",
          size: "840 KB",
          uploadDate: "Just now",
          status: "Uploaded",
        },
      ]);
      setUploadState("uploaded");
    }, 1200);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
    };
  };

  const handleResetUpload = () => {
    setUploadState("idle");
    setUploadProgress(0);
    setUploadedDocs([]);
  };

  // ─────────────────────────────────────────────────────────────
  // Option B Handlers
  // ─────────────────────────────────────────────────────────────
  const handleFillDemoUan = () => {
    setUanInput("101234567890");
    setUanError(null);
  };

  const handleVerifyUan = () => {
    const cleaned = uanInput.replace(/\s+/g, "");
    if (!cleaned) {
      setUanError("UAN Number is required");
      return;
    }
    if (!/^\d{12}$/.test(cleaned)) {
      setUanError("UAN must be a valid 12-digit numeric number");
      return;
    }

    setUanError(null);
    setUanState("verifying");

    setTimeout(() => {
      setUanDetails({
        maskedUan: `${cleaned.slice(0, 4)} •••• ${cleaned.slice(-4)}`,
        employerName: "Tata Consultancy Services Ltd",
        memberId: "MH/BAN/0012345/000/0006789",
        doj: "15-Jul-2021",
        timestamp: new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      });
      setUanState("verified");
    }, 1300);
  };

  const handleResetUan = () => {
    setUanState("idle");
    setUanDetails(null);
    setUanInput("");
    setUanError(null);
  };

  // ─────────────────────────────────────────────────────────────
  // Option C Handlers
  // ─────────────────────────────────────────────────────────────
  const handleSendEmailRequest = () => {
    setEmailState("request_sent");
  };

  const handleCheckEmailStatus = () => {
    setEmailState("checking");
    setTimeout(() => {
      if (simulatedDiyOutcome === "success") {
        setEmailState("verified");
        setIsEditableAfterVerification(true);
      } else {
        setEmailState("failed");
        setIsEditableAfterVerification(false);
      }
    }, 1100);
  };

  const handleRetryEmailVerification = () => {
    setEmailState("idle");
    setIsEditableAfterVerification(false);
  };

  // ─────────────────────────────────────────────────────────────
  // RENDER: DECISION SCREEN (Section 2 Requirements)
  // ─────────────────────────────────────────────────────────────
  if (decision === "unselected") {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Top Header Banner */}
        <div className="border-l-4 border-[#004499] pl-4 py-2 bg-blue-50/50 rounded-r-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#004499]">
                Stage 4 • Navigation Decision
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">
              Employment Verification Check
            </h3>
            <p className="text-sm text-slate-600 mt-0.5">
              Determine whether this applicant requires employment verification or fast-track directly to the next stage.
            </p>
          </div>
          {onBack && (
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 shrink-0 self-start sm:self-auto"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Back to Offer
            </Button>
          )}
        </div>

        {/* Current State Info Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500">Current Stage:</span>
            <span className="font-bold text-slate-800 bg-white px-2.5 py-1 rounded border border-slate-200">
              Stage 4 — Employment Verification
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500">Applicant:</span>
            <span className="font-bold text-slate-800">{customerData.fullName}</span>
            <span className="text-slate-400">({customerData.employmentType || "Salaried"})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500">Selected Decision:</span>
            <span className="font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
              Awaiting Agent Selection
            </span>
          </div>
        </div>

        {/* Decision Card */}
        <div className="max-w-2xl mx-auto py-4 space-y-6 text-center">
          <div className="space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#004499]/10 text-[#004499] flex items-center justify-center mx-auto shadow-inner">
              <Briefcase className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-bold font-heading text-slate-900">
              Do you want to proceed with Employment Verification?
            </h2>
            <p className="text-sm text-slate-500 max-w-lg mx-auto">
              Please choose whether to verify the applicant's employment records via Salary Slip,
              EPFO UAN API, or Official Work Email, or bypass directly to the loan offer stage.
            </p>
          </div>

          {/* Two Decision Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-2">
            {/* OPTION 1: YES */}
            <div
              onClick={() => setDecision("yes")}
              className="group relative bg-white border-2 border-blue-200 hover:border-[#004499] hover:shadow-lg rounded-2xl p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#004499] group-hover:bg-[#004499] group-hover:text-white flex items-center justify-center transition-colors">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <Badge className="bg-blue-100 text-[#004499] hover:bg-blue-100 border-blue-200 text-[10px]">
                    Recommended
                  </Badge>
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-[#004499] transition-colors">
                    Yes — Continue to Stage 4
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Verify employment using Salary Slips, EPFO UAN inquiry, or customer official email OTP.
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#004499]">
                <span>Proceed with Verification</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* OPTION 2: NO (SKIP) */}
            <div
              onClick={() => {
                setDecision("no");
                onSkip();
              }}
              className="group relative bg-white border-2 border-slate-200 hover:border-slate-400 hover:shadow-lg rounded-2xl p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 group-hover:bg-slate-800 group-hover:text-white flex items-center justify-center transition-colors">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="text-slate-500 text-[10px]">
                    Fast-Track
                  </Badge>
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-slate-800 transition-colors">
                    No — Skip Stage 4
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Bypass employment verification entirely and proceed directly to the next stage.
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600 group-hover:text-slate-900">
                <span>Skip to Next Stage</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // RENDER: STAGE 4 EMPLOYMENT VERIFICATION SCREEN
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── Top Header Banner with Decision Badge ── */}
      <div className="border-l-4 border-[#004499] pl-4 py-2 bg-blue-50/50 rounded-r-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#004499]">
              Stage {stageNumber} • Employment Verification
            </span>
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] font-bold">
              <Check className="h-3 w-3 mr-1" /> Decision: Yes (Proceeding)
            </Badge>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mt-0.5">
            Verify Applicant Employment
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Select one of the three verification methods below to complete employment verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onBack && (
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 shrink-0"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Back
            </Button>
          )}
          {/* Change Decision Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDecision("unselected")}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 shrink-0"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Change Decision / Skip
          </Button>
        </div>
      </div>

      {/* ── Customer Quick Info Bar ── */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <p className="text-slate-400 font-semibold uppercase text-[10px]">Applicant</p>
          <p className="font-bold text-slate-800">{customerData.fullName}</p>
        </div>
        <div>
          <p className="text-slate-400 font-semibold uppercase text-[10px]">Employer</p>
          <p className="font-bold text-slate-800">Tata Consultancy Services</p>
        </div>
        <div>
          <p className="text-slate-400 font-semibold uppercase text-[10px]">Designation</p>
          <p className="font-bold text-slate-800">Sr. Software Engineer</p>
        </div>
        <div>
          <p className="text-slate-400 font-semibold uppercase text-[10px]">Net Monthly Income</p>
          <p className="font-bold text-emerald-600">₹74,200 / month</p>
        </div>
      </div>

      {/* ── Three Verification Options Tabs ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* TAB A: Upload Salary Slip */}
        <button
          type="button"
          onClick={() => setActiveTab("salary_slip")}
          className={cn(
            "p-4 rounded-xl border-2 text-left transition-all duration-200 relative",
            activeTab === "salary_slip"
              ? "border-[#004499] bg-blue-50/40 shadow-sm ring-1 ring-[#004499]/20"
              : "border-slate-200 bg-white hover:border-slate-300"
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={cn(
                "p-2 rounded-lg",
                activeTab === "salary_slip" ? "bg-[#004499] text-white" : "bg-slate-100 text-slate-600"
              )}
            >
              <FileSpreadsheet className="h-4 w-4" />
            </span>
            {uploadState === "uploaded" && (
              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[10px]">
                <Check className="h-3 w-3 mr-0.5" /> Uploaded
              </Badge>
            )}
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Option A</p>
          <h4 className="text-sm font-bold text-slate-800 mt-0.5">Upload Salary Slip</h4>
          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
            Verify using latest 2-3 months payslips in PDF or image format.
          </p>
        </button>

        {/* TAB B: UAN-Based Verification */}
        <button
          type="button"
          onClick={() => setActiveTab("uan")}
          className={cn(
            "p-4 rounded-xl border-2 text-left transition-all duration-200 relative",
            activeTab === "uan"
              ? "border-[#004499] bg-blue-50/40 shadow-sm ring-1 ring-[#004499]/20"
              : "border-slate-200 bg-white hover:border-slate-300"
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={cn(
                "p-2 rounded-lg",
                activeTab === "uan" ? "bg-[#004499] text-white" : "bg-slate-100 text-slate-600"
              )}
            >
              <ShieldCheck className="h-4 w-4" />
            </span>
            {uanState === "verified" && (
              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[10px]">
                <Check className="h-3 w-3 mr-0.5" /> Verified
              </Badge>
            )}
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Option B</p>
          <h4 className="text-sm font-bold text-slate-800 mt-0.5">UAN-Based Verification</h4>
          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
            EPFO API gateway simulation for instant employment validation.
          </p>
        </button>

        {/* TAB C: Official Email OTP */}
        <button
          type="button"
          onClick={() => setActiveTab("email_otp")}
          className={cn(
            "p-4 rounded-xl border-2 text-left transition-all duration-200 relative",
            activeTab === "email_otp"
              ? "border-[#004499] bg-blue-50/40 shadow-sm ring-1 ring-[#004499]/20"
              : "border-slate-200 bg-white hover:border-slate-300"
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className={cn(
                "p-2 rounded-lg",
                activeTab === "email_otp" ? "bg-[#004499] text-white" : "bg-slate-100 text-slate-600"
              )}
            >
              <Mail className="h-4 w-4" />
            </span>
            {emailState === "verified" ? (
              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[10px]">
                <Check className="h-3 w-3 mr-0.5" /> Verified
              </Badge>
            ) : emailState === "failed" ? (
              <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-[10px]">
                <X className="h-3 w-3 mr-0.5" /> Failed
              </Badge>
            ) : emailState === "request_sent" || emailState === "checking" ? (
              <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-[10px]">
                <Clock className="h-3 w-3 mr-0.5" /> Pending
              </Badge>
            ) : null}
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Option C</p>
          <h4 className="text-sm font-bold text-slate-800 mt-0.5">Official Email OTP</h4>
          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
            Verify via customer's work email through the customer DIY journey.
          </p>
        </button>
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* ── ACTIVE TAB CONTENT ── */}
      {/* ───────────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        {/* ══════════════════════════════════════════════════════════ */}
        {/* OPTION A: UPLOAD SALARY SLIP                              */}
        {/* ══════════════════════════════════════════════════════════ */}
        {activeTab === "salary_slip" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-[#004499]" />
                  Option A — Upload Salary Slip
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verify employment using customer salary slips. Sample mock documents are supported.
                </p>
              </div>
              <Badge variant="outline" className="text-xs font-mono w-fit">
                Mock Document Service
              </Badge>
            </div>

            {/* Idle State: Upload Zone */}
            {uploadState === "idle" && (
              <div className="border-2 border-dashed border-slate-200 hover:border-[#004499] rounded-2xl p-8 sm:p-12 text-center transition-colors bg-slate-50/50">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-[#004499] flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <UploadCloud className="h-8 w-8" />
                </div>
                <h5 className="text-base font-bold text-slate-800">
                  Upload Salary Documents for Verification
                </h5>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
                  Click the button below to simulate uploading the latest 2-3 months salary slip PDF and image files.
                </p>

                <Button
                  onClick={handleStartUpload}
                  className="bg-[#004499] hover:bg-[#003377] text-white font-bold px-6 py-2.5 rounded-xl shadow-md"
                >
                  <UploadCloud className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>

                <p className="text-[11px] text-slate-400 mt-4">
                  Supported formats: PDF, PNG, JPEG • Max file size: 10MB
                </p>
              </div>
            )}

            {/* Uploading State: Progress Bar */}
            {uploadState === "uploading" && (
              <div className="py-12 px-6 max-w-md mx-auto text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-[#004499] flex items-center justify-center mx-auto animate-pulse">
                  <RefreshCw className="h-6 w-6 animate-spin text-[#004499]" />
                </div>
                <div className="space-y-1">
                  <h5 className="text-sm font-bold text-slate-800">
                    Simulating Document Upload...
                  </h5>
                  <p className="text-xs text-slate-500">
                    Encrypting and extracting salary parameters... ({uploadProgress}%)
                  </p>
                </div>
                <Progress value={uploadProgress} className="h-2 w-full" />
              </div>
            )}

            {/* Uploaded State: Show Documents and Verification Status */}
            {uploadState === "uploaded" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Success Banner */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-emerald-900">
                      Mock Document Upload Successful
                    </p>
                    <p className="text-xs text-emerald-700 leading-relaxed">
                      Salary slips have been successfully uploaded and parsed. Employer details and net monthly
                      pay of <strong>₹74,200</strong> have been matched and verified.
                    </p>
                    <div className="pt-1 flex items-center gap-2">
                      <Badge className="bg-emerald-200/80 text-emerald-900 hover:bg-emerald-200 text-[10px]">
                        Sample Data Verified
                      </Badge>
                      <span className="text-[11px] text-emerald-600 italic">
                        Note: These are sample/mock documents for demonstration.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Uploaded Files List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                    <span>Uploaded Documents ({uploadedDocs.length})</span>
                    <button
                      onClick={handleResetUpload}
                      className="text-[#004499] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <RotateCcw className="h-3 w-3" /> Replace Documents
                    </button>
                  </div>

                  {uploadedDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs shrink-0",
                            doc.type === "PDF"
                              ? "bg-red-100 text-red-700"
                              : "bg-purple-100 text-purple-700"
                          )}
                        >
                          {doc.type === "PDF" ? "PDF" : "IMG"}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{doc.name}</p>
                          <p className="text-[11px] text-slate-400">
                            {doc.type} • {doc.size} • {doc.uploadDate}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 text-[10px]">
                          <Check className="h-3 w-3 mr-1" /> {doc.status}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPreviewDoc(doc)}
                          className="h-8 text-xs font-bold text-slate-700 hover:text-[#004499] border-slate-200 hover:border-[#004499]"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1.5" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Bar */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <Button
                    variant="outline"
                    onClick={handleResetUpload}
                    className="text-xs text-slate-600 hover:text-slate-900"
                  >
                    Replace Documents
                  </Button>

                  <Button
                    onClick={onComplete}
                    className="bg-[#004499] hover:bg-[#003377] text-white font-bold px-6 py-2.5 rounded-xl shadow-md text-sm"
                  >
                    Continue to Next Stage
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* OPTION B: UAN-BASED VERIFICATION                           */}
        {/* ══════════════════════════════════════════════════════════ */}
        {activeTab === "uan" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#004499]" />
                  Option B — UAN-Based Verification
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verify employment records through simulated EPFO (Employee Provident Fund Organisation) API.
                </p>
              </div>
              <Badge variant="outline" className="text-xs font-mono w-fit">
                Simulated EPFO Gateway
              </Badge>
            </div>

            {/* Input Form */}
            {uanState === "idle" && (
              <div className="space-y-6 max-w-xl">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="uan-input" className="text-xs font-bold text-slate-700">
                      UAN Number (Universal Account Number) <span className="text-red-500">*</span>
                    </Label>
                    <button
                      type="button"
                      onClick={handleFillDemoUan}
                      className="text-[11px] font-bold text-[#004499] hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="h-3 w-3" /> Fill Demo UAN (101234567890)
                    </button>
                  </div>

                  <Input
                    id="uan-input"
                    type="text"
                    maxLength={12}
                    placeholder="Enter 12-digit UAN"
                    value={uanInput}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setUanInput(val);
                      if (uanError) setUanError(null);
                    }}
                    className={cn(
                      "font-mono tracking-wider text-sm",
                      uanError ? "border-red-500 focus-visible:ring-red-500" : ""
                    )}
                  />
                  {uanError ? (
                    <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" /> {uanError}
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-400">
                      Must be a valid 12-digit numeric Universal Account Number linked to Aadhaar.
                    </p>
                  )}
                </div>

                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3.5 text-xs text-slate-600 flex items-start gap-2.5">
                  <HelpCircle className="h-4 w-4 text-[#004499] shrink-0 mt-0.5" />
                  <p>
                    <strong>Mock Integration Notice:</strong> This simulates the EPFO Unified Portal query.
                    No real government APIs are queried during this demonstration.
                  </p>
                </div>

                <Button
                  onClick={handleVerifyUan}
                  className="bg-[#004499] hover:bg-[#003377] text-white font-bold px-6 py-2.5 rounded-xl shadow-md text-sm"
                >
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Verify UAN
                </Button>
              </div>
            )}

            {/* Verifying State */}
            {uanState === "verifying" && (
              <div className="py-12 px-6 max-w-md mx-auto text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-[#004499] flex items-center justify-center mx-auto">
                  <RefreshCw className="h-6 w-6 animate-spin text-[#004499]" />
                </div>
                <div className="space-y-1">
                  <h5 className="text-sm font-bold text-slate-800">
                    Querying EPFO Unified Portal API...
                  </h5>
                  <p className="text-xs text-slate-500">
                    Matching member ID and active establishment service history...
                  </p>
                </div>
              </div>
            )}

            {/* Verified Response */}
            {uanState === "verified" && uanDetails && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Result Card */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200/60 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                        <Check className="h-4 w-4 stroke-[3]" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                          EPFO API Verification Result
                        </span>
                        <h5 className="text-base font-bold text-emerald-950">
                          Verification Result: Verified
                        </h5>
                      </div>
                    </div>
                    <Badge className="bg-emerald-600 text-white hover:bg-emerald-600 text-xs px-3 py-1 font-bold">
                      <ShieldCheck className="h-3.5 w-3.5 mr-1" /> EPFO Verified
                    </Badge>
                  </div>

                  {/* Verification Details Table/Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                    <div className="bg-white/80 rounded-lg p-3 border border-emerald-100">
                      <span className="text-slate-400 font-semibold uppercase text-[10px]">
                        Masked UAN Number
                      </span>
                      <p className="font-mono font-bold text-slate-800 text-sm mt-0.5">
                        {uanDetails.maskedUan}
                      </p>
                    </div>

                    <div className="bg-white/80 rounded-lg p-3 border border-emerald-100">
                      <span className="text-slate-400 font-semibold uppercase text-[10px]">
                        Active Employer Name
                      </span>
                      <p className="font-bold text-slate-800 text-sm mt-0.5">
                        {uanDetails.employerName}
                      </p>
                    </div>

                    <div className="bg-white/80 rounded-lg p-3 border border-emerald-100">
                      <span className="text-slate-400 font-semibold uppercase text-[10px]">
                        Member ID / Establishment
                      </span>
                      <p className="font-mono font-medium text-slate-700 text-xs mt-0.5">
                        {uanDetails.memberId}
                      </p>
                    </div>

                    <div className="bg-white/80 rounded-lg p-3 border border-emerald-100">
                      <span className="text-slate-400 font-semibold uppercase text-[10px]">
                        Date of Joining / Verified At
                      </span>
                      <p className="font-medium text-slate-700 text-xs mt-0.5">
                        DOJ: {uanDetails.doj} • {uanDetails.timestamp}
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] text-emerald-700 italic">
                    Deterministic mock EPFO response. Verified active employment with 3+ years contributing record.
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <Button
                    variant="outline"
                    onClick={handleResetUan}
                    className="text-xs text-slate-600 hover:text-slate-900"
                  >
                    Re-verify with another UAN
                  </Button>

                  <Button
                    onClick={onComplete}
                    className="bg-[#004499] hover:bg-[#003377] text-white font-bold px-6 py-2.5 rounded-xl shadow-md text-sm"
                  >
                    Continue to Next Stage
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* OPTION C: OFFICIAL EMAIL OTP VERIFICATION                 */}
        {/* ══════════════════════════════════════════════════════════ */}
        {activeTab === "email_otp" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-[#004499]" />
                  Option C — Official Email OTP Verification
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verify the customer's employment through their official work email using the customer's DIY journey.
                </p>
              </div>
              <Badge variant="outline" className="text-xs font-mono w-fit">
                Customer DIY Journey
              </Badge>
            </div>

            {/* State 1: Idle (Before sending request) */}
            {emailState === "idle" && (
              <div className="space-y-6 max-w-xl">
                <div className="space-y-2">
                  <Label htmlFor="work-email" className="text-xs font-bold text-slate-700">
                    Official Work Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="work-email"
                    type="email"
                    value={officialEmail}
                    onChange={(e) => setOfficialEmail(e.target.value)}
                    placeholder="e.g. name@corporate-domain.com"
                    className="text-sm"
                  />
                  <p className="text-[11px] text-slate-400">
                    A verification link will be sent to this email. The customer must authenticate in their DIY flow.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs text-slate-600">
                  <p className="font-bold text-slate-800">Agent Flow Instructions:</p>
                  <p>
                    1. Click "Send Email Verification Request" below.
                  </p>
                  <p>
                    2. Customer details will become locked in read-only mode while the request is pending.
                  </p>
                  <p>
                    3. Click "Check Status" once the customer completes verification in their DIY app.
                  </p>
                </div>

                <Button
                  onClick={handleSendEmailRequest}
                  className="bg-[#004499] hover:bg-[#003377] text-white font-bold px-6 py-2.5 rounded-xl shadow-md text-sm"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email Verification Request
                </Button>
              </div>
            )}

            {/* States 2, 3, 4, 5: Post-Request Initiated */}
            {emailState !== "idle" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* ── Status Banner (Section 3 Requirement) ── */}
                <div
                  className={cn(
                    "border rounded-xl p-4 flex items-start gap-3",
                    emailState === "verified"
                      ? "bg-emerald-50 border-emerald-200"
                      : emailState === "failed"
                      ? "bg-red-50 border-red-200"
                      : "bg-amber-50 border-amber-200"
                  )}
                >
                  {emailState === "verified" ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : emailState === "failed" ? (
                    <XCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                  ) : (
                    <Clock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
                  )}

                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p
                        className={cn(
                          "text-sm font-bold",
                          emailState === "verified"
                            ? "text-emerald-900"
                            : emailState === "failed"
                            ? "text-red-900"
                            : "text-amber-900"
                        )}
                      >
                        Verification Status:{" "}
                        {emailState === "verified"
                          ? "Verified"
                          : emailState === "failed"
                          ? "Failed"
                          : emailState === "checking"
                          ? "Checking Status..."
                          : "Pending Customer Action"}
                      </p>

                      <Badge
                        className={cn(
                          "text-[10px] font-bold uppercase",
                          emailState === "verified"
                            ? "bg-emerald-600 text-white hover:bg-emerald-600"
                            : emailState === "failed"
                            ? "bg-red-600 text-white hover:bg-red-600"
                            : "bg-amber-500 text-white hover:bg-amber-500"
                        )}
                      >
                        {emailState === "verified"
                          ? "Verified ✓"
                          : emailState === "failed"
                          ? "Failed ✗"
                          : "Pending"}
                      </Badge>
                    </div>

                    {/* Exact Suggested Message from Specification */}
                    {(emailState === "request_sent" || emailState === "checking") && (
                      <p className="text-xs text-amber-800 leading-relaxed font-medium">
                        "An email verification request has been initiated. The customer must complete official
                        email verification through the DIY journey. Once completed, click Check Status to
                        retrieve the verification result. Customer details cannot be modified while verification
                        is pending."
                      </p>
                    )}

                    {emailState === "verified" && (
                      <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                        The customer has successfully completed official email OTP verification on{" "}
                        <span className="font-bold underline">{officialEmail}</span> through the DIY journey.
                        Customer details are now unlocked.
                      </p>
                    )}

                    {emailState === "failed" && (
                      <div className="space-y-1">
                        <p className="text-xs text-red-800 leading-relaxed font-medium">
                          Email verification failed. The customer's OTP expired or the verification request timed out in the DIY journey.
                        </p>
                        <p className="text-[11px] text-red-600 font-semibold">
                          Customer details remain locked. You cannot manually override this status.
                          Please retry or follow the approved exception workflow.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Read-Only / Locked Customer Details Display ── */}
                <div
                  className={cn(
                    "border rounded-xl p-5 space-y-4 transition-colors",
                    emailState === "verified"
                      ? "bg-white border-slate-200"
                      : "bg-slate-50/70 border-slate-300"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {emailState === "verified" ? (
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <Unlock className="h-4 w-4" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                          <Lock className="h-4 w-4" />
                        </div>
                      )}
                      <div>
                        <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Customer Details
                        </h5>
                        <p className="text-[11px] text-slate-400">
                          {emailState === "verified"
                            ? "Unlocked for editing following successful email verification"
                            : "Read-only • Locked while official email verification is unresolved"}
                        </p>
                      </div>
                    </div>

                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] font-bold",
                        emailState === "verified"
                          ? "text-emerald-700 border-emerald-300 bg-emerald-50"
                          : "text-amber-700 border-amber-300 bg-amber-50"
                      )}
                    >
                      {emailState === "verified" ? "Unlocked" : "Locked (Read-Only)"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <Label className="text-[11px] text-slate-500">Applicant Full Name</Label>
                      <Input
                        value={editedCustomerName}
                        onChange={(e) => setEditedCustomerName(e.target.value)}
                        disabled={emailState !== "verified"}
                        className={cn(
                          "h-8 text-xs",
                          emailState !== "verified" && "bg-slate-100 text-slate-500 cursor-not-allowed"
                        )}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px] text-slate-500">Official Work Email</Label>
                      <Input
                        value={officialEmail}
                        disabled={true} // Official email remains strictly fixed
                        className="h-8 text-xs bg-slate-100 text-slate-500 cursor-not-allowed font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px] text-slate-500">Mobile Number</Label>
                      <Input
                        value={editedMobile}
                        onChange={(e) => setEditedMobile(e.target.value)}
                        disabled={emailState !== "verified"}
                        className={cn(
                          "h-8 text-xs",
                          emailState !== "verified" && "bg-slate-100 text-slate-500 cursor-not-allowed font-mono"
                        )}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px] text-slate-500">Employer Name</Label>
                      <Input
                        value="Tata Consultancy Services Ltd"
                        disabled={true}
                        className="h-8 text-xs bg-slate-100 text-slate-500 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* ── Agent Actions & DIY Status Checking ── */}
                <div className="space-y-4 pt-2">
                  {/* Simulation Helper Box for Testing Outcomes */}
                  {(emailState === "request_sent" || emailState === "checking" || emailState === "failed") && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-700 flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-[#004499]" />
                          DIY Journey Outcome Simulation:
                        </span>
                        <p className="text-[11px] text-slate-500">
                          Configure what the simulated DIY customer response will return when checking status:
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSimulatedDiyOutcome("success")}
                          className={cn(
                            "px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors",
                            simulatedDiyOutcome === "success"
                              ? "bg-emerald-600 text-white border-emerald-600"
                              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                          )}
                        >
                          Simulate Success
                        </button>
                        <button
                          type="button"
                          onClick={() => setSimulatedDiyOutcome("failure")}
                          className={cn(
                            "px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors",
                            simulatedDiyOutcome === "failure"
                              ? "bg-red-600 text-white border-red-600"
                              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                          )}
                        >
                          Simulate Failure
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {/* Check Status CTA (Required by specs) */}
                      {(emailState === "request_sent" || emailState === "checking") && (
                        <Button
                          onClick={handleCheckEmailStatus}
                          disabled={emailState === "checking"}
                          className="bg-[#004499] hover:bg-[#003377] text-white font-bold px-5 py-2 rounded-xl shadow-md text-xs"
                        >
                          <RefreshCw
                            className={cn(
                              "h-3.5 w-3.5 mr-2",
                              emailState === "checking" && "animate-spin"
                            )}
                          />
                          {emailState === "checking" ? "Checking Status..." : "Check Status"}
                        </Button>
                      )}

                      {/* Retry CTA on Failure (Required by specs) */}
                      {emailState === "failed" && (
                        <Button
                          onClick={handleRetryEmailVerification}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2 rounded-xl shadow-md text-xs"
                        >
                          <RotateCcw className="h-3.5 w-3.5 mr-2" />
                          Retry Verification / Re-initiate Request
                        </Button>
                      )}

                      {/* Reset flow when in success */}
                      {emailState === "verified" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRetryEmailVerification}
                          className="text-xs text-slate-600"
                        >
                          Re-test Email Flow
                        </Button>
                      )}
                    </div>

                    {/* Continue CTA (Only enabled on Success / Verified, never on Failure) */}
                    <div>
                      {emailState === "verified" ? (
                        <Button
                          onClick={onComplete}
                          className="bg-[#004499] hover:bg-[#003377] text-white font-bold px-6 py-2.5 rounded-xl shadow-md text-sm w-full sm:w-auto"
                        >
                          Continue to Next Stage
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      ) : (
                        <Button
                          disabled={true}
                          className="bg-slate-200 text-slate-400 cursor-not-allowed font-bold px-6 py-2.5 rounded-xl text-sm w-full sm:w-auto"
                        >
                          Continue (Awaiting Verification)
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ── SALARY SLIP PREVIEW MODAL ── */}
      {/* ───────────────────────────────────────────────────────────── */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setPreviewDoc(null)}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#004499]">
                  Document Preview
                </span>
                <h4 className="text-lg font-bold text-slate-900">{previewDoc.name}</h4>
                <p className="text-xs text-slate-400">
                  {previewDoc.type} • {previewDoc.size}
                </p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 mr-8 text-xs">
                Verified Document
              </Badge>
            </div>

            {/* Mock Salary Slip Document View */}
            <div className="border border-slate-300 rounded-xl p-6 bg-slate-50/50 space-y-6 relative overflow-hidden font-sans">
              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 rotate-[-25deg]">
                <span className="text-6xl font-black text-slate-900 uppercase">
                  SAMPLE MOCK PAYSLIP
                </span>
              </div>

              {/* Employer Header */}
              <div className="text-center border-b border-slate-200 pb-4 space-y-1">
                <h3 className="text-base font-black tracking-wider text-slate-900 uppercase">
                  Tata Consultancy Services Limited
                </h3>
                <p className="text-[10px] text-slate-500">
                  TCS House, Raveline Street, Fort, Mumbai 400001 • CIN: L22210MH1995PLC084781
                </p>
                <p className="text-xs font-bold text-[#004499] uppercase tracking-wide pt-1">
                  Payslip for the Month of September 2024
                </p>
              </div>

              {/* Employee Summary Details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px] bg-white p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[9px]">Employee Name</span>
                  <p className="font-bold text-slate-800">{customerData.fullName || "Aarav Sharma"}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[9px]">Employee Code</span>
                  <p className="font-mono font-bold text-slate-800">TCS-89410</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[9px]">Designation</span>
                  <p className="font-bold text-slate-800">Sr. Software Engineer</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[9px]">PAN</span>
                  <p className="font-mono font-bold text-slate-800">{customerData.pan || "ABCPS1234F"}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[9px]">UAN</span>
                  <p className="font-mono font-bold text-slate-800">101234567890</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[9px]">Bank A/C</span>
                  <p className="font-mono font-bold text-slate-800">HDFC ••••4589</p>
                </div>
              </div>

              {/* Earnings & Deductions Breakdown Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Earnings */}
                <div className="bg-white rounded-lg border border-slate-200 p-3 space-y-2">
                  <div className="flex justify-between items-center font-bold text-slate-800 border-b border-slate-100 pb-1.5">
                    <span>Earnings</span>
                    <span>Amount (₹)</span>
                  </div>
                  <div className="space-y-1.5 text-[11px] text-slate-600">
                    <div className="flex justify-between">
                      <span>Basic Salary</span>
                      <span className="font-mono">₹45,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>House Rent Allowance (HRA)</span>
                      <span className="font-mono">₹20,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Special Allowance</span>
                      <span className="font-mono">₹15,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conveyance Allowance</span>
                      <span className="font-mono">₹5,000</span>
                    </div>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1.5 text-xs">
                    <span>Gross Earnings</span>
                    <span className="font-mono text-emerald-600">₹85,000</span>
                  </div>
                </div>

                {/* Deductions */}
                <div className="bg-white rounded-lg border border-slate-200 p-3 space-y-2">
                  <div className="flex justify-between items-center font-bold text-slate-800 border-b border-slate-100 pb-1.5">
                    <span>Deductions</span>
                    <span>Amount (₹)</span>
                  </div>
                  <div className="space-y-1.5 text-[11px] text-slate-600">
                    <div className="flex justify-between">
                      <span>Provident Fund (PF)</span>
                      <span className="font-mono">₹5,400</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Professional Tax</span>
                      <span className="font-mono">₹200</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Income Tax (TDS)</span>
                      <span className="font-mono">₹5,200</span>
                    </div>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1.5 text-xs">
                    <span>Total Deductions</span>
                    <span className="font-mono text-red-600">₹10,800</span>
                  </div>
                </div>
              </div>

              {/* Net Pay Highlight Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Net Take-Home Pay
                  </span>
                  <p className="text-xl font-black text-[#004499]">₹74,200</p>
                  <p className="text-[10px] text-slate-500 italic">
                    (Seventy-Four Thousand Two Hundred Rupees Only)
                  </p>
                </div>
                <div className="text-right">
                  <Badge className="bg-emerald-600 text-white hover:bg-emerald-600 text-[10px]">
                    Verified by Agent Assist
                  </Badge>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                onClick={() => setPreviewDoc(null)}
                className="text-xs font-bold text-slate-700"
              >
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
