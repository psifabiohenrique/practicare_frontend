import React from "react";
import { Link } from "react-router-dom";
import styles from "./Sidebar.module.css";
import SelectField from "../SelectField/SelectField";
import Button from "../Button/Button";
import { formatTime } from "../../utils/formatters";
import type { Patient, Weekdays } from "../../types/patient";

interface SidebarProps {
  dailyTreatments: Patient[];
  selectedWeekday: Weekdays;
  isLoading: boolean;
  onWeekdayChange: (weekday: Weekdays) => void;
  onFetchDaily: (e: React.FormEvent) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  dailyTreatments,
  selectedWeekday,
  isLoading,
  onWeekdayChange,
  onFetchDaily,
}) => {
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
    <>
      {/* Checkbox hack for state management without React state if preferred by CSS */}
      <input
        type="checkbox"
        id="sidebarToggle"
        className={styles.sidebarToggle}
      />

      <label htmlFor="sidebarToggle" className={styles.toggleButton}>
        <span>{">"}</span>
      </label>

      <aside className={styles.sidebarContainer}>
        <div className={styles.content}>
          <h3 className={styles.title}>Tratamentos do Dia</h3>

          <form onSubmit={onFetchDaily} className={styles.form}>
            <SelectField
              label="Dia"
              value={selectedWeekday}
              onChange={(e) => onWeekdayChange(e.target.value as Weekdays)}
              options={weekdayOptions}
            />
            <Button type="submit">Atualizar</Button>
          </form>

          {isLoading ? (
            <p className={styles.loading}>Carregando...</p>
          ) : (
            <ul className={styles.treatmentList}>
              {dailyTreatments.map((t) => (
                <li key={t.uuid} className={styles.treatmentItem}>
                  <Link
                    to={`/patient/${t.uuid}`}
                    className={styles.treatmentLink}
                  >
                    <span className={styles.patientName}>
                      {t.patient.first_name}
                    </span>
                    <span className={styles.treatmentTime}>
                      {formatTime(t.start_time)} - {formatTime(t.end_time)}
                    </span>
                  </Link>
                </li>
              ))}
              {dailyTreatments.length === 0 && (
                <li className={styles.emptyMessage}>Nenhum paciente hoje.</li>
              )}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
