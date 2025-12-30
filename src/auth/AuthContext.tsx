import { createContext, useContext, useState } from "react";
import { login as loginService } from "../api/auth.service";
import { logout as logoutService } from "../api/auth.service";

interface AuthContextData {
  isAuthenticated: boolean;
  login(email: string, password: string): Promise<void>;
  logout(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("access_token")
  );

  async function login(email: string, password: string) {
    const data = await loginService({ username: email, password });
    localStorage.setItem("access_token", data.access_token);
    setIsAuthenticated(true);
  }

  function logout() {
    localStorage.removeItem("access_token");
    logoutService();
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
