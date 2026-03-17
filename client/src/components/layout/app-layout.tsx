import { useAuth, type User } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { 
  LogOut, 
  Bell, 
  User as UserIcon,
  LayoutDashboard
} from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 h-16 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard">
              <div className="flex items-center gap-2 cursor-pointer group">
                <div className="w-8 h-8 bg-[#004499] rounded-sm flex items-center justify-center group-hover:bg-[#003377] transition-colors">
                  <span className="text-white font-bold font-heading text-lg">S</span>
                </div>
                <span className="font-heading font-bold text-xl text-slate-900 tracking-tight group-hover:text-[#004499] transition-colors">SalesAssure</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <Link href="/dashboard">
                <div className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
                  location === "/dashboard" 
                    ? "bg-blue-50 text-[#004499]" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}>
                  <LayoutDashboard size={16} />
                  Dashboard
                </div>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-[#004499] rounded-full">
              <Bell size={20} />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-4 hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded-full transition-all">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-600">
                    <UserIcon size={16} />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-semibold text-slate-900 leading-none">{user?.name || "User"}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider font-bold">{user?.role || "Sales"}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 mt-2 shadow-xl border-slate-200">
                <DropdownMenuLabel className="pb-2">
                  <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                  <p className="text-[10px] text-slate-500 font-normal mt-0.5">{user?.email}</p>
                  {user?.employeeId && (
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{user.employeeId}</p>
                  )}
                  {user?.branch && (
                    <p className="text-[10px] text-slate-400 mt-0.5">{user.branch}</p>
                  )}
                  {user?.designation && (
                    <p className="text-[10px] text-[#004499] font-semibold mt-0.5">{user.designation}</p>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-rose-600 cursor-pointer focus:bg-rose-50 focus:text-rose-700 font-medium">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-100 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-400 font-medium uppercase tracking-widest">
            <p>&copy; 2024 SalesAssure NBFC • Enterprise Gateway</p>
            <div className="flex items-center gap-4">
              <span>System v2.4.1</span>
              <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
              <span>Compliance Verified</span>
              <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
              <span className="text-emerald-500 flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                Secure Connection
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
