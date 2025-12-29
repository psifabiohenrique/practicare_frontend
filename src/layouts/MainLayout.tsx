import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { logout } = useAuth();

  return (
    <div style={{ display: "flex" }}>
      {/* Side Bar */}
      <aside
        style={{
          width: "200px",
          borderRight: "1px solid #ccc",
          padding: "1rem",
        }}
      >
        <h3>Side Bar (Lista de Pacientes)</h3>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: "1rem" }}>
        {/* Menu */}
        <nav
          style={{
            marginBottom: "2rem",
            borderBottom: "1px solid #ccc",
            paddingBottom: "1rem",
          }}
        >
          <ul
            style={{
              listStyle: "none",
              display: "flex",
              gap: "1rem",
              padding: 0,
            }}
          >
            <li>
              <Link to="/">Dashboard</Link>
            </li>
            <li>
              <Link to="#">Pacientes</Link>
            </li>
            <li>
              <Link to="#">Novo Paciente</Link>
            </li>
            <li>
              <Link to="#">Agenda de Sessões</Link>
            </li>
            <li>
              <button onClick={logout}>Logout</button>
            </li>
          </ul>
        </nav>

        {/* Page Content */}
        <section>{children}</section>
      </main>
    </div>
  );
}
