"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  PlusCircle,
  Smartphone,
  CheckCircle2,
  Clock,
  ArrowRight,
  GraduationCap,
  Sparkles,
  RotateCcw,
  User,
  ShieldCheck,
  ChevronRight,
  AlertCircle,
  FileText,
} from "lucide-react";
import { MOCK_EXISTING_EL_LEADS } from "../constants/el-mock-data";

export default function ElDashboardView() {
  const router = useRouter();
  const [mobileQuery, setMobileQuery] = useState<string>("");
  const [searchInitiated, setSearchInitiated] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<(typeof MOCK_EXISTING_EL_LEADS)[0] | null>(null);
  const [selectedCase, setSelectedCase] = useState<"new" | "wip" | "rejected" | null>(null);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanMobile = mobileQuery.replace(/\D/g, "");
    if (cleanMobile.length !== 10) return;

    setSearchInitiated(true);
    setSelectedCase(null);
    const match = MOCK_EXISTING_EL_LEADS.find(
      (lead) => lead.mobile === cleanMobile
    );
    setSearchResult(match || null);
  };

  const handleResume = (lead: (typeof MOCK_EXISTING_EL_LEADS)[0]) => {
    router.push(
      `/leads/el?resumeStage=${lead.stageId}&ref=${lead.appId}&mobile=${lead.mobile}`
    );
  };

  const handleStartNewWithMobile = (mobile: string) => {
    router.push(`/leads/el?mobile=${mobile}&case=new`);
  };

  const handleStartBrandNew = () => {
    router.push("/leads/el");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* ── Hero Banner ── */}
      <div className="bg-gradient-to-r from-teal-700 via-[#004499] to-blue-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-teal-200 border border-white/20">
              <GraduationCap className="h-4 w-4" /> Domestic Assisted Education Loans
            </div>
            <h2 className="text-3xl font-black tracking-tight">Pulse Education Loan Portal</h2>
            <p className="text-blue-100 text-sm leading-relaxed">
              Initiate new student loan files, perform automated Bureau & CKYC assessments, and
              guide applicants through digital verification & instant disbursement.
            </p>
          </div>

          <div className="shrink-0">
            <Button
              onClick={handleStartBrandNew}
              className="bg-white hover:bg-teal-50 text-[#004499] font-black h-12 px-6 rounded-2xl shadow-lg shadow-black/10 text-xs uppercase tracking-wider gap-2 transition-all hover:scale-105"
            >
              <PlusCircle className="h-4 w-4 text-[#004499]" />
              Create EL Lead
            </Button>
          </div>
        </div>
      </div>

      {/* ── Customer Mobile Search Section (Screen 2 Requirement) ── */}
      <Card className="border border-slate-200 rounded-3xl p-6 bg-white shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#004499] flex items-center justify-center">
              <Smartphone className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Search Customer by Mobile</h3>
              <p className="text-xs text-slate-500">
                Check for existing application records to resume or initiate a fresh education loan.
              </p>
            </div>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Demo lookup numbers: 9876543210, 9988776655, 9820012345
          </span>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">
              +91
            </div>
            <Input
              type="tel"
              maxLength={10}
              value={mobileQuery}
              onChange={(e) => {
                setMobileQuery(e.target.value);
                setSearchInitiated(false);
                setSelectedCase(null);
              }}
              placeholder="Enter 10-digit customer mobile number..."
              className="pl-14 h-12 bg-slate-50 border-slate-200 text-sm font-semibold rounded-xl focus:bg-white"
            />
          </div>

          <Button
            type="submit"
            disabled={mobileQuery.replace(/\D/g, "").length !== 10}
            className="h-12 px-7 rounded-xl bg-[#004499] hover:bg-[#003377] text-white font-bold text-xs uppercase tracking-wider gap-2 shrink-0 shadow-md shadow-blue-100"
          >
            <Search className="h-4 w-4" /> Search Application
          </Button>
        </form>

        {/* ── Search Results: Verification Result Display (Exact BL Matching Style) ── */}
        {searchInitiated && !selectedCase && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300 pt-2">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Verification Result</h3>
              <p className="text-sm text-slate-500 mt-1">Select the appropriate case type for {mobileQuery}</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button
                type="button"
                onClick={() => {
                  router.push(`/leads/el?mobile=${mobileQuery.replace(/\D/g, "")}&case=new`);
                }}
                className="flex items-center p-4 bg-white border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50/30 rounded-xl transition-all text-left group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform shrink-0">
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
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform shrink-0">
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
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform shrink-0">
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
                setSearchInitiated(false);
                setSelectedCase(null);
              }}
              className="w-full text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            >
              Back to Search
            </Button>
          </div>
        )}

        {/* ── Case Option Outcome: WIP Case Alert ── */}
        {searchInitiated && selectedCase === "wip" && (
          <div className="p-8 border-2 border-dashed border-amber-300 rounded-2xl bg-amber-50/50 flex flex-col items-center text-center space-y-3 animate-in fade-in duration-300">
            <Clock className="h-12 w-12 text-amber-500" />
            <div>
              <h4 className="font-bold text-slate-900 text-lg">Case In Progress</h4>
              <p className="text-sm text-slate-500 max-w-sm mt-1">
                An application for this mobile number is already active in our system (APP-EL-84920). Duplicate leads cannot be created.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Button
                type="button"
                onClick={() => router.push(`/leads/el?resumeStage=3&ref=EL-84920&mobile=${mobileQuery.replace(/\D/g, "")}`)}
                className="bg-[#004499] hover:bg-[#003377] text-white"
              >
                Resume Application
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSelectedCase(null);
                  setSearchInitiated(false);
                }}
              >
                Try Another Number
              </Button>
            </div>
          </div>
        )}

        {/* ── Case Option Outcome: Rejected Case Alert ── */}
        {searchInitiated && selectedCase === "rejected" && (
          <div className="p-8 border-2 border-dashed border-red-300 rounded-2xl bg-red-50/50 flex flex-col items-center text-center space-y-3 animate-in fade-in duration-300">
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
                setSearchInitiated(false);
              }}
            >
              Try Another Number
            </Button>
          </div>
        )}
      </Card>

      {/* ── Recent Education Loan Journeys List (Screen 2 Requirement) ── */}
      <Card className="border border-slate-200 rounded-3xl p-6 bg-white shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Recent Education Loan Journeys</h3>
            <p className="text-xs text-slate-500">Track and resume active pipeline applications</p>
          </div>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            {MOCK_EXISTING_EL_LEADS.length} Active Records
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {MOCK_EXISTING_EL_LEADS.map((lead) => (
            <div
              key={lead.id}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors p-2 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#004499] flex items-center justify-center shrink-0">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{lead.maskedName}</span>
                    <span className="font-mono text-xs text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                      #{lead.appId}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span>{lead.course}</span>
                    <span>•</span>
                    <span className="font-mono">+91 {lead.maskedMobile}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 justify-between sm:justify-end">
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-800 font-mono">
                    ₹ {lead.requestedAmount.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[10px] text-slate-400">Stage {lead.stageId}: {lead.stageName}</p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleResume(lead)}
                  className="h-8 text-xs font-bold text-[#004499] border-blue-200 hover:bg-blue-50 gap-1"
                >
                  Resume <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
