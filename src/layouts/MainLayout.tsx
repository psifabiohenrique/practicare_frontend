import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useAuth } from "../auth/AuthContext";
import { listDailyTreatments } from "../api/patient.service";
import type { Patient, Weekdays } from "../types/patient";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";
import styles from "./Layout.module.css";

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

  return (
    <div className={styles.layoutWrapper}>
      <Sidebar
        dailyTreatments={dailyTreatments}
        selectedWeekday={selectedWeekday}
        isLoading={isLoading}
        onWeekdayChange={setSelectedWeekday}
        onFetchDaily={handleFetchDaily}
      />

      <main className={styles.mainContent}>
        <Navbar onLogout={logout} />

        <section className={styles.pageContent}>{children}</section>
      </main>
    </div>
  );
}
