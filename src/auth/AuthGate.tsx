import { useAuth } from "./AuthContext";


export function AuthGate({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();

  if (loading) {
    return null; // ou splash screen
  }

  return <>{children}</>;
}
