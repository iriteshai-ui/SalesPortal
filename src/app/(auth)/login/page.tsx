"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/core/contexts/auth-context";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Lock,
  ShieldCheck,
  AlertCircle,
  Zap,
  FlaskConical,
  GraduationCap,
  Sparkles,
  ArrowRight,
  UserCheck,
  Building,
  RotateCcw,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import loginBg from "@/assets/login-bg.jpg";
import { MOCK_USERS, APP_CONFIG } from "@/constants";

const PRODUCT_COLORS: Record<string, string> = {
  BL: "bg-blue-100 text-blue-700",
  PL: "bg-violet-100 text-violet-700",
  EL: "bg-amber-100 text-amber-700",
  HL: "bg-rose-100 text-rose-700",
};

export default function LoginPage() {
  const { login, bypassLogin, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Standard Login State
  const [email, setEmail] = useState("admin@nbfc.com");
  const [password, setPassword] = useState("Admin@1234");
  const [secureKey, setSecureKey] = useState(APP_CONFIG.MANAGEMENT_KEY);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [bypassMode, setBypassMode] = useState(false);
  const [selectedBypassUser, setSelectedBypassUser] = useState<(typeof MOCK_USERS)[0] | null>(
    MOCK_USERS[0]
  );

  // ── EL Dedicated Login Mode State (Screen 1 Requirement) ──
  const [isElLoginMode, setIsElLoginMode] = useState(false);
  const [elAgentType, setElAgentType] = useState<"internal" | "external">("internal");
  const [elEmail, setElEmail] = useState("sm@nbfc.com"); // Priya Sharma - Senior Manager (EL capable)
  const [elAuthLoading, setElAuthLoading] = useState(false);
  const [elAuthError, setElAuthError] = useState("");
  const [simulateFailureToggle, setSimulateFailureToggle] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (bypassMode) {
      if (!selectedBypassUser) {
        setLoginError("Please select a test user to bypass with.");
        return;
      }
      bypassLogin(selectedBypassUser);
      return;
    }

    if (secureKey.trim().toUpperCase() !== APP_CONFIG.MANAGEMENT_KEY) {
      setLoginError("Invalid Management Secure Key.");
      return;
    }
    setIsLoggingIn(true);
    const result = await login(email, password);
    if (!result.success) {
      setLoginError(result.error || "Login failed.");
      setIsLoggingIn(false);
    }
  };

  // ── Dedicated EL Login Handler (Screen 1 Requirement) ──
  const handleElLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setElAuthError("");

    const cleanEmail = elEmail.trim();
    if (!cleanEmail) {
      setElAuthError("Please enter a valid agent email address.");
      return;
    }
    if (!cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      setElAuthError("Invalid email format. Please enter a corporate or DSA partner email.");
      return;
    }

    setElAuthLoading(true);

    // 2-second simulated authentication
    setTimeout(() => {
      setElAuthLoading(false);

      if (simulateFailureToggle) {
        setElAuthError("Authentication Failed: User credentials or DSA partner authorization expired.");
        return;
      }

      // Find user or login with EL-capable account (Priya Sharma / Admin)
      const elUser =
        MOCK_USERS.find((u) => u.email.toLowerCase() === cleanEmail.toLowerCase()) ||
        MOCK_USERS.find((u) => u.products.includes("EL")) ||
        MOCK_USERS[0];

      bypassLogin(elUser);
    }, 2000);
  };

  const quickLogin = (u: (typeof MOCK_USERS)[0]) => {
    setEmail(u.email);
    setPassword(u.password);
    setSecureKey(APP_CONFIG.MANAGEMENT_KEY);
    setSelectedBypassUser(u);
    setLoginError("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004499]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-slate-50">
      {/* Left panel */}
      <div
        className={`hidden lg:flex lg:w-1/2 relative overflow-hidden transition-colors duration-500 ${
          isElLoginMode ? "bg-gradient-to-br from-teal-900 via-[#003377] to-slate-900" : "bg-[#004499]"
        }`}
      >
        <div className="absolute inset-0 bg-[#004499]/85 mix-blend-multiply z-10" />
        <Image
          src={loginBg}
          alt="Office"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
          priority
        />
        <div className="relative z-20 flex flex-col justify-between p-12 h-full text-white">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                {isElLoginMode ? (
                  <GraduationCap className="text-teal-300 h-6 w-6" />
                ) : (
                  <ShieldCheck className="text-white" />
                )}
              </div>
              <span className="font-heading font-bold text-2xl tracking-tight">
                {isElLoginMode ? "Pulse Education Loan Portal" : APP_CONFIG.NAME}
              </span>
            </div>
            <div className="max-w-md">
              <h1 className="font-heading text-4xl font-bold mb-6 leading-tight">
                {isElLoginMode
                  ? "Domestic Agent-Assisted Education Loan Gateway"
                  : "Secure Pre-Offer Journey Management"}
              </h1>
              <p className="text-blue-100 text-lg leading-relaxed">
                {isElLoginMode
                  ? "Assisted digital origination for domestic undergraduate, postgraduate & executive academic journeys."
                  : "Empowering sales teams to deliver faster turnarounds with bank-grade security and compliance."}
              </p>
            </div>
          </div>

          {/* Test user quick reference */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-300 mb-2 flex items-center gap-2">
              <Zap className="h-3 w-3" /> UAT Test Accounts
            </p>
            <div className="space-y-2">
              {MOCK_USERS.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    quickLogin(u);
                    if (isElLoginMode) {
                      setElEmail(u.email);
                    }
                  }}
                  className="w-full text-left bg-white/10 hover:bg-white/20 border border-white/15 hover:border-white/30 rounded-lg px-3 py-2 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">{u.name}</p>
                      <p className="text-[10px] text-blue-200">{u.email}</p>
                    </div>
                    <div className="flex gap-1 flex-wrap justify-end max-w-[80px]">
                      {u.products.length === 4 ? (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-400/30 text-emerald-200 uppercase tracking-wider">
                          All
                        </span>
                      ) : (
                        u.products.map((p) => (
                          <span
                            key={p}
                            className="text-[9px] font-black px-1.5 py-0.5 rounded bg-white/15 text-white uppercase"
                          >
                            {p}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-blue-300 mt-1">Click any account to auto-fill credentials.</p>
          </div>

          <div className="text-sm text-blue-200">
            Proudly implemented by{" "}
            <span className="font-bold text-white">PFL Information Technology Team</span>
            <div className="mt-1 opacity-60 text-[10px] uppercase tracking-widest">
              &copy; 2024 {APP_CONFIG.COMPANY} • Enterprise AI Gateway
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <Card className="w-full max-w-md border-0 shadow-2xl bg-white rounded-3xl overflow-hidden">
          {/* ── Top Portal Switcher CTA (Screen 1 Requirement) ── */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-100 p-3.5 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              {isElLoginMode ? (
                <>
                  <GraduationCap className="h-4 w-4 text-teal-700" /> EL Dedicated Mode
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4 text-[#004499]" /> Standard Portal
                </>
              )}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsElLoginMode(!isElLoginMode);
                setElAuthError("");
                setLoginError("");
              }}
              className="h-8 text-xs font-black text-[#004499] border-blue-200 hover:bg-white bg-white/80 uppercase tracking-wider gap-1.5"
            >
              {isElLoginMode ? (
                <>Standard Sales Login →</>
              ) : (
                <>
                  <GraduationCap className="h-3.5 w-3.5 text-teal-600" /> EL Agent Login
                </>
              )}
            </Button>
          </div>

          {/* ── EL Dedicated Login Theme (Screen 1 Requirement) ── */}
          {isElLoginMode ? (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <CardHeader className="space-y-1 pb-4 pt-6 text-center">
                <div className="w-12 h-12 bg-teal-50 border border-teal-200 rounded-2xl flex items-center justify-center mx-auto text-teal-700 mb-2">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">
                  Education Loan Agent Login
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Domestic Agent-Assisted Education Loan (EL) Journey
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5">
                {/* Agent Type Selector: Internal vs External DSA */}
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setElAgentType("internal");
                      setElEmail("sm@nbfc.com");
                    }}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${
                      elAgentType === "internal"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    Internal Officer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setElAgentType("external");
                      setElEmail("partner.el@dsa.com");
                    }}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${
                      elAgentType === "external"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    External DSA Partner
                  </button>
                </div>

                <form onSubmit={handleElLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-600">Email Address *</Label>
                    <Input
                      type="email"
                      value={elEmail}
                      onChange={(e) => setElEmail(e.target.value)}
                      placeholder="agent@institution.com"
                      className="bg-slate-50 border-slate-200 h-11 text-sm focus:bg-white"
                    />
                  </div>

                  {/* Error Alert with Retry */}
                  {elAuthError && (
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-800 space-y-1 animate-in fade-in">
                      <div className="flex items-center gap-1.5 font-bold">
                        <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                        Authentication Failed
                      </div>
                      <p>{elAuthError}</p>
                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        onClick={() => setElAuthError("")}
                        className="p-0 h-auto text-xs font-bold text-rose-700 underline"
                      >
                        Retry Authentication
                      </Button>
                    </div>
                  )}

                  {/* Simulate Failure Toggle for UAT Acceptance Criteria */}
                  <div className="flex items-center space-x-2 pt-1">
                    <Checkbox
                      id="simulate-fail"
                      checked={simulateFailureToggle}
                      onCheckedChange={(c) => setSimulateFailureToggle(!!c)}
                    />
                    <label
                      htmlFor="simulate-fail"
                      className="text-[11px] text-slate-500 font-medium cursor-pointer"
                    >
                      Simulate Authentication Failure scenario (UAT test)
                    </label>
                  </div>

                  {/* Continue/Login CTA */}
                  <Button
                    type="submit"
                    disabled={elAuthLoading}
                    className="w-full h-12 bg-gradient-to-r from-teal-600 to-[#004499] hover:from-teal-700 hover:to-[#003377] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-teal-100 gap-2"
                  >
                    {elAuthLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Authenticating Agent…
                      </>
                    ) : (
                      <>
                        Continue to Dashboard <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </div>
          ) : (
            /* ── Standard Officer Login ── */
            <>
              <CardHeader className="space-y-1 pb-6 pt-6">
                <CardTitle className="text-2xl font-bold text-center text-slate-900">
                  Sales Officer Login
                </CardTitle>
                <CardDescription className="text-center text-slate-500">
                  Enter your ADID credentials to access the portal
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Quick Test Account Selector */}
                <div className="mb-5 space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <Zap className="h-3 w-3 text-amber-500" /> Quick Test Login
                  </Label>
                  <select
                    className="w-full h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 focus:outline-none focus:border-[#004499] focus:ring-2 focus:ring-[#004499]/10 transition-all cursor-pointer"
                    defaultValue=""
                    onChange={(e) => {
                      const found = MOCK_USERS.find((u) => u.id === e.target.value);
                      if (found) quickLogin(found);
                      e.target.value = "";
                    }}
                  >
                    <option value="" disabled>
                      Select a test account…
                    </option>
                    {MOCK_USERS.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} — {u.role} (
                        {u.products.length === 4 ? "All Products" : u.products.join(", ")})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative mb-5">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                    <span className="bg-white px-3 text-slate-400 font-bold">or enter credentials</span>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div
                    className={`flex items-start gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
                      bypassMode ? "bg-amber-50 border-amber-300" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <Checkbox
                      id="bypass"
                      checked={bypassMode}
                      onCheckedChange={(c) => setBypassMode(!!c)}
                      className="mt-0.5"
                    />
                    <div className="space-y-0.5">
                      <label
                        htmlFor="bypass"
                        className="text-xs font-bold text-slate-800 cursor-pointer flex items-center gap-1"
                      >
                        <FlaskConical className="h-3.5 w-3.5 text-amber-600" /> UAT Bypass Mode
                      </label>
                      <p className="text-[10px] text-slate-500">
                        Bypass password check for fast testing.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-600">Email Address</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-slate-50 border-slate-200 h-10 text-sm"
                    />
                  </div>

                  {!bypassMode && (
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-600">Password</Label>
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-slate-50 border-slate-200 h-10 text-sm"
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-600">Management Secure Key</Label>
                    <Input
                      type="password"
                      value={secureKey}
                      onChange={(e) => setSecureKey(e.target.value)}
                      className="bg-slate-50 border-slate-200 h-10 text-sm"
                    />
                  </div>

                  {loginError && (
                    <div className="bg-rose-50 border border-rose-200 rounded-lg p-2.5 text-xs text-rose-700 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {loginError}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full bg-[#004499] hover:bg-[#003377] text-white font-bold h-11 text-xs uppercase tracking-wider rounded-xl shadow-md shadow-blue-100"
                  >
                    {isLoggingIn ? "Logging in..." : "Login to Portal"}
                  </Button>
                </form>
              </CardContent>
            </>
          )}

          <CardFooter className="flex flex-col gap-2 border-t border-slate-100 py-4 bg-slate-50/50">
            <div className="text-center text-[10px] text-slate-400">
              <p>&copy; 2024 Pulse Financial Services • Compliance &amp; Security Monitored</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
