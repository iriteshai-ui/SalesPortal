import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, ShieldCheck } from "lucide-react";
import loginBg from "@/assets/login-bg.jpg";

export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("sales@nbfc.com");
  const [password, setPassword] = useState("password123");
  const [secureKey, setSecureKey] = useState("NBFC-SEC-8472-9103-KM92-X");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setTimeout(() => {
      login(email);
      setIsLoggingIn(false);
    }, 800);
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

          <div className="text-sm text-blue-200">
            © 2024 NBFC Enterprise Portal
          </div>
        </div>
      </div>

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
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">ADID / Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@nbfc.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
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
                  onChange={(e) => setSecureKey(e.target.value.toUpperCase())}
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
