import { useState } from "react";
import styles from "./dateRangeFilter.module.css";

interface DateRangeFilterProps {
  defaultStartDate: string;
  defaultEndDate: string;
  onApply: (startDate: string, endDate: string) => void;
}

export default function DateRangeFilter({
  defaultStartDate,
  defaultEndDate,
  onApply,
}: DateRangeFilterProps) {
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  const handleApply = () => {
    onApply(startDate, endDate);
  };

  return (
    <div className={styles.container}>
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
        />
      </div>
      <button
        id="dashboard-apply-filter"
        className={styles.applyButton}
        onClick={handleApply}
        type="button"
      >
        Aplicar
      </button>
    </div>
  );
}
