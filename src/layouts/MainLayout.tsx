import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { listDailyTreatments } from "../api/patient.service";
import type { Patient, Weekdays } from "../types/patient";
import SelectField from "../components/SelectField/SelectField";
import Button from "../components/Button/Button";
import { formatTime } from "../utils/formatters";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { logout } = useAuth();
  const [dailyTreatments, setDailyTreatments] = useState<Patient[]>([]);
  const [selectedWeekday, setSelectedWeekday] = useState<Weekdays>(
    new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
      new Date()
    ) as Weekdays
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchDaily = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDaily();
  };

  const fetchDaily = async () => {
    setIsLoading(true);
    try {
      const data = await listDailyTreatments(selectedWeekday);
      setDailyTreatments(data);
    } catch (error) {
      console.error("Erro ao buscar tratamentos diários:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDaily();
  }, []);

  const weekdayOptions = [
    { label: "Segunda", value: "Monday" },
    { label: "Terça", value: "Tuesday" },
    { label: "Quarta", value: "Wednesday" },
    { label: "Quinta", value: "Thursday" },
    { label: "Sexta", value: "Friday" },
    { label: "Sábado", value: "Saturday" },
    { label: "Domingo", value: "Sunday" },
  ];

  return (
    <div style={{ display: "flex" }}>
      {/* Side Bar */}
      <aside
        style={{
          width: "250px",
          borderRight: "1px solid #ccc",
          padding: "1rem",
        }}
      >
        <h3>Tratamentos do Dia</h3>
        <form onSubmit={handleFetchDaily}>
          <SelectField
            label="Dia"
            value={selectedWeekday}
            onChange={(e) => setSelectedWeekday(e.target.value as Weekdays)}
            options={weekdayOptions}
          />
          <Button type="submit">Atualizar</Button>
        </form>

        {isLoading ? (
          <p>Carregando...</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem" }}>
            {dailyTreatments.map((t) => (
              <Link to={`/patient/${t.uuid}`}>
                <li key={t.uuid} style={{ marginBottom: "1rem" }}>
                  <strong>{t.patient.first_name}</strong>
                  <br />
                  {formatTime(t.start_time)} - {formatTime(t.end_time)}
                </li>
              </Link>
            ))}
            {dailyTreatments.length === 0 && <p>Nenhum paciente hoje.</p>}
          </ul>
        )}
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
              <Link to="/patient">Pacientes</Link>
            </li>
            <li>
              <Link to="/patient/create">Novo Paciente</Link>
            </li>
            <li>
              <Link to="/schedule">Agenda de Sessões</Link>
            </li>
            <li>
              <Link to="/user">Atualizar Perfil</Link>
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
