import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "wouter";

export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  products: string[];
  employeeId: string;
  branch: string;
  designation: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ─── Mock User Database ───────────────────────────────────────────────────────
export const MOCK_USERS: Array<User & { password: string }> = [
  {
    id: "EMP-ADMIN-001",
    name: "Vikram Malhotra",
    role: "Admin",
    email: "admin@nbfc.com",
    password: "Admin@1234",
    products: ["BL", "PL", "EL", "HL"],
    employeeId: "NBFC-ADM-001",
    branch: "Head Office, Mumbai",
    designation: "Sales Head",
  },
  {
    id: "EMP-BL-002",
    name: "Arjun Verma",
    role: "Sales Officer – BL",
    email: "arjun.verma@nbfc.com",
    password: "BL@2024",
    products: ["BL"],
    employeeId: "NBFC-BL-002",
    branch: "Delhi NCR Zone",
    designation: "Senior Sales Officer",
  },
  {
    id: "EMP-PL-003",
    name: "Priya Sharma",
    role: "Sales Officer – PL",
    email: "priya.sharma@nbfc.com",
    password: "PL@2024",
    products: ["PL"],
    employeeId: "NBFC-PL-003",
    branch: "Bengaluru Central",
    designation: "Sales Officer",
  },
  {
    id: "EMP-EL-004",
    name: "Rohit Joshi",
    role: "Sales Officer – EL",
    email: "rohit.joshi@nbfc.com",
    password: "EL@2024",
    products: ["EL"],
    employeeId: "NBFC-EL-004",
    branch: "Pune West",
    designation: "Sales Officer",
  },
  {
    id: "EMP-HL-005",
    name: "Ananya Mehta",
    role: "Sales Officer – HL",
    email: "ananya.mehta@nbfc.com",
    password: "HL@2024",
    products: ["HL"],
    employeeId: "NBFC-HL-005",
    branch: "Hyderabad South",
    designation: "Sales Officer",
  },
];

const MANAGEMENT_KEY = "NBFC-SEC-8472-9103-KM92-X";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const saved = localStorage.getItem("sales_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          setUser(parsed);
        }
      } catch {
        localStorage.removeItem("sales_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string): { success: boolean; error?: string } => {
    const found = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) {
      return { success: false, error: "Invalid email or password. Please check your credentials." };
    }
    const { password: _pw, ...safeUser } = found;
    setUser(safeUser);
    localStorage.setItem("sales_user", JSON.stringify(safeUser));
    setLocation("/dashboard");
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("sales_user");
    setLocation("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
