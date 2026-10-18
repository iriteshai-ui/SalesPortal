"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, CheckCircle2, Send, XCircle } from "lucide-react";
import { useToast } from "@/hooks/useToast";

interface Props { onComplete: () => void; }

const PURPOSES = ["Business Expansion", "Working Capital", "Equipment Purchase", "Inventory Financing", "Office Renovation", "Debt Consolidation", "Others"];
const MARITAL = ["Single", "Married", "Divorced", "Widowed"];

export default function Stage8AdditionalDetails({ onComplete }: Props) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    purpose: "Business Expansion",
    fatherName: "Ramesh Malhotra",
    marital: "Married",
    email: "vikram.m@example.com",
    rmId: "RM-MUM-4421",
    docOnline: "yes",
  });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [docs, setDocs] = useState<Record<string, { name: string; size: string }>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addressRef = useRef<HTMLInputElement>(null);
  const ohpRef = useRef<HTMLInputElement>(null);

  const handleDoc = (key: string, file: File | null) => {
    if (!file) return;
    if (file.type !== "application/pdf") { toast({ variant: "destructive", title: "PDFs only" }); return; }
    setDocs((p) => ({ ...p, [key]: { name: file.name, size: (file.size / 1024).toFixed(1) + " KB" } }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const demoDoc = (key: string, label: string) => {
    setDocs((p) => ({ ...p, [key]: { name: `${label.replace(/ /g, "_")}_demo.pdf`, size: "156.2 KB" } }));
    setErrors((e) => ({ ...e, [key]: "" }));
    toast({ title: "Demo File Loaded", description: `${label} loaded for testing.` });
  };

  const sendOtp = () => {
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) { setErrors((e) => ({ ...e, email: "Valid email required" })); return; }
    setOtpSent(true);
    toast({ title: "OTP Sent", description: `OTP sent to ${form.email} (Demo: 123456)` });
  };

  const verifyOtp = () => {
    if (otp === "123456") { setOtpVerified(true); setErrors((e) => ({ ...e, otp: "" })); }
    else setErrors((e) => ({ ...e, otp: "Invalid OTP. Demo OTP is 123456" }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.purpose) errs.purpose = "Required";
    if (!form.fatherName.trim()) errs.fatherName = "Required";
    if (!form.marital) errs.marital = "Required";
    if (!otpVerified) errs.emailOtp = "Email OTP verification required";
    if (!form.rmId.trim()) errs.rmId = "Required";
    if (!docs["addressProof"]) errs.addressProof = "Required";
    if (!docs["ohp"]) errs.ohp = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) { toast({ variant: "destructive", title: "Please fill all required fields" }); return; }
    toast({ title: "Submitted", description: "KYC link sent to customer." });
    onComplete();
  };

  const DocUpload = ({ docKey, label, ref: inputRef }: { docKey: string; label: string; ref: React.RefObject<HTMLInputElement | null> }) => {
    const doc = docs[docKey];
    return (
      <div className="space-y-1.5">
        <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">{label} *</Label>
        <div onClick={() => inputRef.current?.click()} className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${doc ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-slate-50 hover:border-[#004499] hover:bg-blue-50"}`}>
          {doc ? (
            <div className="flex items-center justify-center gap-3">
              <FileText className="h-5 w-5 text-emerald-600" />
              <div className="text-left">
                <p className="text-sm font-bold text-emerald-700">{doc.name}</p>
                <p className="text-xs text-emerald-500">{doc.size}</p>
              </div>
              <CheckCircle2 className="h-4 w-4 text-emerald-500 ml-auto" />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <Upload className="h-6 w-6 text-slate-300" />
              <p className="text-xs text-slate-500">Click to upload PDF</p>
            </div>
          )}
        </div>
        <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => handleDoc(docKey, e.target.files?.[0] || null)} />
        {!doc && (
          <button type="button" onClick={() => demoDoc(docKey, label)} className="text-xs font-bold text-amber-600 hover:text-amber-700 underline underline-offset-2">
            Use Demo File (UAT)
          </button>
        )}
        {errors[docKey] && <p className="text-xs text-rose-500">{errors[docKey]}</p>}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-l-4 border-[#004499] pl-4 py-1 bg-blue-50/50 rounded-r-md">
        <h3 className="text-lg font-semibold text-slate-900">Additional Details</h3>
        <p className="text-sm text-slate-500">Complete all mandatory fields to submit & send KYC link.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Purpose */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Purpose of Loan *</Label>
          <Select value={form.purpose} onValueChange={(v) => setForm({ ...form, purpose: v })}>
            <SelectTrigger className="h-11 bg-slate-50"><SelectValue /></SelectTrigger>
            <SelectContent>{PURPOSES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
          </Select>
          {errors.purpose && <p className="text-xs text-rose-500">{errors.purpose}</p>}
        </div>

        {/* Father's Name */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Father's Name *</Label>
          <Input value={form.fatherName} onChange={(e) => setForm({ ...form, fatherName: e.target.value })} className="h-11 bg-slate-50" placeholder="Father's full name" />
          {errors.fatherName && <p className="text-xs text-rose-500">{errors.fatherName}</p>}
        </div>

        {/* Marital Status */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Marital Status *</Label>
          <Select value={form.marital} onValueChange={(v) => setForm({ ...form, marital: v })}>
            <SelectTrigger className="h-11 bg-slate-50"><SelectValue /></SelectTrigger>
            <SelectContent>{MARITAL.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
          </Select>
          {errors.marital && <p className="text-xs text-rose-500">{errors.marital}</p>}
        </div>

        {/* RM ID */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">RM ID *</Label>
          <Input value={form.rmId} onChange={(e) => setForm({ ...form, rmId: e.target.value })} className="h-11 bg-slate-50 font-mono" placeholder="RM-XXX-XXXX" />
          {errors.rmId && <p className="text-xs text-rose-500">{errors.rmId}</p>}
        </div>
      </div>

      {/* Email + OTP */}
      <div className="space-y-2 bg-slate-50 border border-slate-200 rounded-xl p-4">
        <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Email ID + OTP Verification *</Label>
        <div className="flex gap-2">
          <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" className="h-11 bg-white flex-1" placeholder="customer@example.com" disabled={otpVerified} />
          {!otpVerified && <Button type="button" onClick={sendOtp} className="bg-[#004499] hover:bg-[#003377] h-11 px-4">{otpSent ? "Resend" : "Send OTP"}</Button>}
          {otpVerified && <div className="flex items-center gap-1 text-emerald-600 font-semibold text-sm"><CheckCircle2 className="h-4 w-4" /> Verified</div>}
        </div>
        {otpSent && !otpVerified && (
          <div className="flex gap-2 mt-2">
            <Input value={otp} onChange={(e) => setOtp(e.target.value)} className="h-11 bg-white font-mono tracking-widest" placeholder="Enter OTP (Demo: 123456)" maxLength={6} />
            <Button type="button" onClick={verifyOtp} className="bg-emerald-600 hover:bg-emerald-700 h-11 px-4">Verify</Button>
          </div>
        )}
        {errors.emailOtp && <p className="text-xs text-rose-500">{errors.emailOtp}</p>}
        {errors.otp && <p className="text-xs text-rose-500">{errors.otp}</p>}
      </div>

      {/* DocOnline */}
      <div className="space-y-1.5">
        <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">DocOnline Option</Label>
        <div className="flex gap-3">
          {["yes", "no"].map((v) => (
            <button key={v} type="button" onClick={() => setForm({ ...form, docOnline: v })}
              className={`flex-1 h-10 rounded-lg border-2 font-semibold text-sm transition-all ${form.docOnline === v ? "border-[#004499] bg-blue-50 text-[#004499]" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}>
              {v === "yes" ? "Yes — DocOnline" : "No — Physical"}
            </button>
          ))}
        </div>
      </div>

      {/* Document uploads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DocUpload docKey="addressProof" label="Business Address Proof" ref={addressRef} />
        <DocUpload docKey="ohp" label="OHP Document" ref={ohpRef} />
      </div>

      {errors.addressProof && <p className="text-xs text-rose-500">{errors.addressProof}</p>}
      {errors.ohp && <p className="text-xs text-rose-500">{errors.ohp}</p>}

      <Button onClick={handleSubmit} className="w-full h-12 bg-[#004499] hover:bg-[#003377] font-bold text-base gap-2">
        <Send className="h-5 w-5" /> Submit & Send KYC Link
      </Button>
    </div>
  );
}
