import { createContext, useContext, useEffect, useState } from "react";
import { login as loginService } from "../api/auth.service";
import { logout as logoutService } from "../api/auth.service";
import { getMe } from "../api/user.service";
import { useNavigate } from "react-router-dom";

interface AuthContextData {
  isAuthenticated: boolean;
  loading: boolean;
  login(email: string, password: string): Promise<void>;
  logout(): void;
  forceLogout(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  async function checkAuth() {
    try {
      await getMe();
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);

  async function login(email: string, password: string) {
    try {
      await loginService({ email: email, password });
      setIsAuthenticated(true);
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error("Credenciais inváidas");
      }
      throw error;
    }
  }

  function logout() {
    logoutService();
    setIsAuthenticated(false);
  }

  function forceLogout() {
    setIsAuthenticated(false);
    navigate("/login", { replace: true });
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, login, logout, forceLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
