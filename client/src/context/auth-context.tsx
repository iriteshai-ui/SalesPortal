import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "wouter";

export interface UserRole {
  id: string;
  name: string;
  products: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  branch: string | null;
  designation: string | null;
  isActive: boolean;
  role: UserRole | null;
  // Convenience derived
  products: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Kept so the login page quick-select list still works without an API call
export const MOCK_USERS = [
  { id: "EMP-ADMIN-001", name: "Vikram Malhotra", role: "Admin",           email: "admin@nbfc.com",        password: "Admin@1234", products: ["BL","PL","EL","HL"] },
  { id: "EMP-BL-002",    name: "Arjun Verma",    role: "BL Officer",       email: "arjun.verma@nbfc.com",  password: "BL@2024",    products: ["BL"] },
  { id: "EMP-PL-003",    name: "Priya Sharma",   role: "PL Officer",       email: "priya.sharma@nbfc.com", password: "PL@2024",    products: ["PL"] },
  { id: "EMP-EL-004",    name: "Rohit Joshi",    role: "EL Officer",       email: "rohit.joshi@nbfc.com",  password: "EL@2024",    products: ["EL"] },
  { id: "EMP-HL-005",    name: "Ananya Mehta",   role: "HL Officer",       email: "ananya.mehta@nbfc.com", password: "HL@2024",    products: ["HL"] },
];

const MANAGEMENT_KEY = "NBFC-SEC-8472-9103-KM92-X";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapApiUser(apiUser: any): User {
  return {
    ...apiUser,
    products: apiUser.role?.products ?? [],
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const savedToken = localStorage.getItem("sales_token");
    const savedUser = localStorage.getItem("sales_user");
    if (savedToken && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(mapApiUser(parsed));
      } catch {
        localStorage.removeItem("sales_token");
        localStorage.removeItem("sales_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.message || "Login failed." };
      }
      const mappedUser = mapApiUser(data.user);
      setToken(data.token);
      setUser(mappedUser);
      localStorage.setItem("sales_token", data.token);
      localStorage.setItem("sales_user", JSON.stringify(data.user));
      setLocation("/dashboard");
      return { success: true };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("sales_token");
    localStorage.removeItem("sales_user");
    setLocation("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
