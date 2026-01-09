import { type Record } from "../../types/record";
import { formatDate } from "../../utils/formatters";
import type { ModalType } from "../../pages/Dashboard/patients/PatientDetailPage";
import Button from "../Button/Button";
import styles from "./RecordListCard.module.css";

interface RecordListCardProps {
  record: Record;
  onOpenModal: (type: ModalType, uuid?: string) => void;
}

export function RecordListCard({ record, onOpenModal }: RecordListCardProps) {
  return (
    <div className={styles.recordListCardContainer}>
      <div className={styles.info}>
        <span className={styles.recordNumber}>
          Registro #{record.record_number}
        </span>
        <span className={styles.date}>{formatDate(record.date)}</span>
      </div>
      <div className={styles.actions}>
        <Button
          className={styles.viewButton}
          onClick={() => onOpenModal("record_detail", record.uuid)}
        >
          Visualizar
        </Button>
        <Button
          className={styles.editButton}
          onClick={() => onOpenModal("record_form", record.uuid)}
        >
          Editar
        </Button>
      </div>
    </div>
  );
}
