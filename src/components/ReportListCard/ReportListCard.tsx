import { type Report } from "../../types/report";
import { formatDate } from "../../utils/formatters";
import type { ModalType } from "../../pages/Dashboard/patients/PatientDetailPage";
import Button from "../Button/Button";
import styles from "./ReportListCard.module.css";

interface ReportListCardProps {
  report: Report;
  onOpenModal: (type: ModalType, uuid?: string) => void;
}

const TYPE_LABELS: Record<string, string> = {
  COMPLETO: "Completo",
  PERIODICO: "Periódico",
  FOCADO: "Focado",
};

export function ReportListCard({
  report,
  onOpenModal,
}: ReportListCardProps) {
  const reportType = report.report_type ?? "PERIODICO";
  const typeLabel = TYPE_LABELS[reportType] ?? reportType;

  return (
    <div className={styles.reportListCardContainer} style={{ opacity: report.is_active ? 1 : 0.6 }}>
      <div className={styles.info}>
        <div className={styles.titleRow}>
          <span className={styles.reportTitle}>Relatório {!report.is_active && "[Arquivado]"}</span>
          <span
            className={`${styles.badge} ${styles[`badge${reportType}`]}`}
          >
            {typeLabel}
          </span>
        </div>
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
        {report.is_active && (
          <Button
            className={styles.editButton}
            onClick={() => onOpenModal("report_form", report.uuid)}
          >
            Editar
          </Button>
        )}
      </div>
    </div>
  );
}
