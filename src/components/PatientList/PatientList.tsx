import { PatientListCard } from "../PatientListCard/PatientListCard";
import type { Patient } from "../../types/patient";
import styles from "./PatientList.module.css";

interface PatientListProps {
  data: Patient[];
  onNameClick: () => void;
  orderDir?: "asc" | "desc";
}

export function PatientList({ data, onNameClick, orderDir }: PatientListProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>Pacientes</span>
        <button className={styles.sortButton} onClick={onNameClick}>
          Nome completo {orderDir === "asc" ? "↑" : "↓"}
        </button>
      </div>

      {data && data.length > 0 ? (
        <ul className={styles.list}>
          {data.map((patient) => (
            <PatientListCard key={patient.uuid} patient={patient} />
          ))}
        </ul>
      ) : (
        <div className={styles.emptyState}>
          <p>Nenhum paciente encontrado. Cadastre o primeiro paciente.</p>
        </div>
      )}
    </div>
  );
}
