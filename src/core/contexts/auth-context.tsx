import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/models";
import { MOCK_USERS } from "@/constants";
import { authService } from "@/services/auth-service";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  bypassLogin: (mockUser: (typeof MOCK_USERS)[0]) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem("sales_token");
    const savedUser = localStorage.getItem("sales_user");
    if (savedToken && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(parsed);
      } catch {
        localStorage.removeItem("sales_token");
        localStorage.removeItem("sales_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const result = await authService.login(email, password);
    
    if (!result.success) {
      return { success: false, error: result.error };
    }

    setToken(result.token!);
    setUser(result.user!);
    localStorage.setItem("sales_token", result.token!);
    localStorage.setItem("sales_user", JSON.stringify(result.user!));
    router.push("/dashboard");
    return { success: true };
  };

  const bypassLogin = (mockUser: (typeof MOCK_USERS)[0]) => {
    const { user: syntheticUser, token: fakeToken } = authService.bypassLogin(mockUser);
    
    setToken(fakeToken);
    setUser(syntheticUser);
    localStorage.setItem("sales_token", fakeToken);
    localStorage.setItem("sales_user", JSON.stringify(syntheticUser));
    router.push("/dashboard");
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("sales_token");
    localStorage.removeItem("sales_user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        bypassLogin,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
