import { useState, useEffect } from "react";
import styles from "./dateRangeFilter.module.css";

interface DateRangeFilterProps {
  initialStartDate: string;
  initialEndDate: string;
  onApply: (startDate: string, endDate: string) => void;
  isLoading?: boolean;
}

export default function DateRangeFilter({
  initialStartDate,
  initialEndDate,
  onApply,
  isLoading = false,
}: DateRangeFilterProps) {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  // Sync with props if they change from parent
  useEffect(() => {
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
  }, [initialStartDate, initialEndDate]);

  const handleApply = () => {
    onApply(startDate, endDate);
  };

  const applyPreset = (start: Date, end: Date) => {
    const s = start.toISOString().split("T")[0];
    const e = end.toISOString().split("T")[0];
    setStartDate(s);
    setEndDate(e);
    onApply(s, e);
  };

  const setCurrentMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    applyPreset(start, now);
  };

  const setLast30Days = () => {
    const now = new Date();
    const start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    applyPreset(start, now);
  };

  const setLast3Months = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
    applyPreset(start, now);
  };

  const setLast6Months = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
    applyPreset(start, now);
  };

  return (
    <div className={styles.container}>
      <div className={styles.presets}>
        <button
          type="button"
          onClick={setCurrentMonth}
          className={styles.presetButton}
          disabled={isLoading}
        >
          Mês atual
        </button>
        <button
          type="button"
          onClick={setLast30Days}
          className={styles.presetButton}
          disabled={isLoading}
        >
          Últimos 30 dias
        </button>
        <button
          type="button"
          onClick={setLast3Months}
          className={styles.presetButton}
          disabled={isLoading}
        >
          Últimos 3 meses
        </button>
        <button
          type="button"
          onClick={setLast6Months}
          className={styles.presetButton}
          disabled={isLoading}
        >
          Últimos 6 meses
        </button>
      </div>

      <div className={styles.form}>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="dashboard-start-date">
            Data inicial
          </label>
          <input
            id="dashboard-start-date"
            type="date"
            className={styles.dateInput}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel} htmlFor="dashboard-end-date">
            Data final
          </label>
          <input
            id="dashboard-end-date"
            type="date"
            className={styles.dateInput}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <button
          id="dashboard-apply-filter"
          className={styles.applyButton}
          onClick={handleApply}
          type="button"
          disabled={isLoading}
        >
          {isLoading ? "Aplicando..." : "Aplicar"}
        </button>
      </div>
    </div>
  );
}
