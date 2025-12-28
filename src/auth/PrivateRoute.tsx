import { Navigate } from "react-router-dom"
import { useAuth } from "./AuthContext";

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}
