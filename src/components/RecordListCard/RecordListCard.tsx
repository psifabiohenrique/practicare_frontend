import { type Record } from "../../types/record";
import { formatDate } from "../../utils/formatters";

import styles from "./RecordListCard.module.css";

interface RecordListCardProps {
  record: Record;
}

export function RecordListCard({ record }: RecordListCardProps) {
  return (
    <div className={styles.recordListCardContainer}>
      <span>Número do Registro: {record.record_number}</span>
      <span>Data: {formatDate(record.date)}</span>
    </div>
  );
}
