import React, { useState, useEffect } from "react";
import { useAuth, MOCK_USERS } from "@/context/auth-context";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, ShieldCheck, AlertCircle, User, Zap } from "lucide-react";
import loginBg from "@/assets/login-bg.jpg";
import { Badge } from "@/components/ui/badge";

const PRODUCT_COLORS: Record<string, string> = {
  BL: "bg-blue-100 text-blue-700",
  PL: "bg-violet-100 text-violet-700",
  EL: "bg-amber-100 text-amber-700",
  HL: "bg-rose-100 text-rose-700",
};

const MANAGEMENT_KEY = "NBFC-SEC-8472-9103-KM92-X";

export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("admin@nbfc.com");
  const [password, setPassword] = useState("Admin@1234");
  const [secureKey, setSecureKey] = useState(MANAGEMENT_KEY);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (secureKey.trim().toUpperCase() !== MANAGEMENT_KEY) {
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

  const quickLogin = (u: typeof MOCK_USERS[0]) => {
    setEmail(u.email);
    setPassword(u.password);
    setSecureKey(MANAGEMENT_KEY);
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
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#004499]">
        <div className="absolute inset-0 bg-[#004499]/90 mix-blend-multiply z-10" />
        <img
          src={loginBg}
          alt="Office"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
        />
        <div className="relative z-20 flex flex-col justify-between p-12 h-full text-white">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded flex items-center justify-center border border-white/20">
                <ShieldCheck className="text-white" />
              </div>
              <span className="font-heading font-bold text-2xl tracking-tight">SalesAssure</span>
            </div>
            <div className="max-w-md">
              <h1 className="font-heading text-4xl font-bold mb-6 leading-tight">
                Secure Pre-Offer Journey Management
              </h1>
              <p className="text-blue-100 text-lg leading-relaxed">
                Empowering sales teams to deliver faster turnarounds with bank-grade security and compliance.
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
                  onClick={() => quickLogin(u)}
                  className="w-full text-left bg-white/10 hover:bg-white/20 border border-white/15 hover:border-white/30 rounded-lg px-3 py-2 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">{u.name}</p>
                      <p className="text-[10px] text-blue-200">{u.email}</p>
                    </div>
                    <div className="flex gap-1 flex-wrap justify-end max-w-[80px]">
                      {u.products.length === 4 ? (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-400/30 text-emerald-200 uppercase tracking-wider">All</span>
                      ) : (
                        u.products.map((p) => (
                          <span key={p} className="text-[9px] font-black px-1.5 py-0.5 rounded bg-white/15 text-white uppercase">{p}</span>
                        ))
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-blue-300 mt-1">Click any account to auto-fill credentials.</p>
          </div>

          <div className="text-sm text-blue-200">© 2024 NBFC Enterprise Portal</div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <Card className="w-full max-w-md border-0 shadow-xl bg-white">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-slate-900">
              Sales Officer Login
            </CardTitle>
            <CardDescription className="text-center text-slate-500">
              Enter your ADID credentials to access the portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* ── Quick Test Account Selector ── */}
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
                <option value="" disabled>Select a test account…</option>
                {MOCK_USERS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} — {u.role} ({u.products.length === 4 ? "All Products" : u.products.join(", ")})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400">Selecting an account auto-fills the credentials below.</p>
            </div>
            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                <span className="bg-white px-3 text-slate-400 font-bold">or enter manually</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {loginError}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">ADID / Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@nbfc.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setLoginError(""); }}
                  className="h-11 bg-slate-50 border-slate-200 focus:border-[#004499] focus:ring-[#004499]/20 transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setLoginError(""); }}
                  className="h-11 bg-slate-50 border-slate-200 focus:border-[#004499] focus:ring-[#004499]/20 transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secureKey" className="flex items-center gap-2">
                  Management Secure Key (23-digits)
                  <ShieldCheck size={14} className="text-[#004499]" />
                </Label>
                <Input
                  id="secureKey"
                  type="text"
                  placeholder="XXXX-XXXX-XXXX-XXXX-XXXX-XXX"
                  value={secureKey}
                  onChange={(e) => { setSecureKey(e.target.value.toUpperCase()); setLoginError(""); }}
                  className="h-11 font-mono text-xs tracking-widest bg-slate-50 border-slate-200 focus:border-[#004499] focus:ring-[#004499]/20 transition-all"
                  required
                  maxLength={30}
                />
                <p className="text-[10px] text-slate-400">Enterprise-grade 23-digit key required for management demo.</p>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-[#004499] hover:bg-[#003377] text-white font-medium transition-all shadow-md hover:shadow-lg mt-2"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "Verifying..." : (
                  <span className="flex items-center gap-2">
                    <Lock size={16} /> Secure Login
                  </span>
                )}
              </Button>
            </form>

            {/* Mobile quick-login (shown only on small screens) */}
            <div className="lg:hidden mt-6 border-t border-slate-100 pt-5 space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <Zap className="h-3 w-3" /> Quick Test Login
              </p>
              {MOCK_USERS.map((u) => (
                <button
                  key={u.id}
                  onClick={() => quickLogin(u)}
                  className="w-full text-left bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-[#004499]/30 rounded-lg px-3 py-2 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-700">{u.name}</p>
                      <p className="text-[10px] text-slate-400">{u.email}</p>
                    </div>
                    <div className="flex gap-1 flex-wrap justify-end max-w-[80px]">
                      {u.products.length === 4 ? (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 uppercase">All</span>
                      ) : (
                        u.products.map((p) => (
                          <span key={p} className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${PRODUCT_COLORS[p] || "bg-slate-100 text-slate-600"}`}>{p}</span>
                        ))
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 border-t border-slate-100 pt-6">
            <div className="text-center text-xs text-slate-400">
              <p>By logging in, you agree to the Compliance Policy.</p>
              <p>Access is monitored and logged for security.</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
