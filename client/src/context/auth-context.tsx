import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "wouter";

interface User {
  id: string;
  name: string;
  role: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

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
        if (parsed && typeof parsed === 'object') {
          setUser(parsed);
        }
      } catch (e) {
        localStorage.removeItem("sales_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (email: string) => {
    const mockUser = {
      id: "EMP-001",
      name: "Vikram Malhotra",
      role: "Sales Officer",
      email: email,
    };
    setUser(mockUser);
    localStorage.setItem("sales_user", JSON.stringify(mockUser));
    setLocation("/dashboard");
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
