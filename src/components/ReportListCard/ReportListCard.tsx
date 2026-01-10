import { type Report } from "../../types/report";
import { formatDate } from "../../utils/formatters";
import type { ModalType } from "../../pages/Dashboard/patients/PatientDetailPage";
import Button from "../Button/Button";
import styles from "./ReportListCard.module.css";

interface ReportListCardProps {
  report: Report;
  onOpenModal: (type: ModalType, uuid?: string) => void;
}

export function ReportListCard({ report, onOpenModal }: ReportListCardProps) {
  return (
    <div className={styles.reportListCardContainer}>
      <div className={styles.info}>
        <span className={styles.reportTitle}>Relatório</span>
        <span className={styles.date}>
          Emissão: {formatDate(report.issue_date)}
        </span>
      </div>
      <div className={styles.actions}>
        <Button
          className={styles.viewButton}
          onClick={() => onOpenModal("report_detail", report.uuid)}
        >
          Visualizar
        </Button>
        <Button
          className={styles.editButton}
          onClick={() => onOpenModal("report_form", report.uuid)}
        >
          Editar
        </Button>
      </div>
    </div>
  );
}
