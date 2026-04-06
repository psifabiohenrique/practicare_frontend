import { type Report } from "../../types/report";
import { formatDate } from "../../utils/formatters";
import type { ModalType } from "../../pages/Dashboard/patients/PatientDetailPage";
import Button from "../Button/Button";
import { deleteReport } from "../../api/report.service";
import { showConfirm, showError, showToast } from "../../utils/swal";
import styles from "./ReportListCard.module.css";

interface ReportListCardProps {
  report: Report;
  onOpenModal: (type: ModalType, uuid?: string) => void;
  onDeleted: () => void;
}

const TYPE_LABELS: Record<string, string> = {
  COMPLETO: "Completo",
  PERIODICO: "Periódico",
  FOCADO: "Focado",
};

export function ReportListCard({
  report,
  onOpenModal,
  onDeleted,
}: ReportListCardProps) {
  const handleDelete = async () => {
    const confirmed = await showConfirm(
      "Excluir relatório",
      "Esta ação não pode ser desfeita. Deseja continuar?",
      "Excluir",
      "Cancelar",
    );
    if (!confirmed) return;

    try {
      await deleteReport(report.uuid);
      showToast("Relatório excluído com sucesso!");
      onDeleted();
    } catch {
      showError("Erro", "Não foi possível excluir o relatório.");
    }
  };

  const reportType = report.report_type ?? "PERIODICO";
  const typeLabel = TYPE_LABELS[reportType] ?? reportType;

  return (
    <div className={styles.reportListCardContainer}>
      <div className={styles.info}>
        <div className={styles.titleRow}>
          <span className={styles.reportTitle}>Relatório</span>
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
        <Button
          className={styles.editButton}
          onClick={() => onOpenModal("report_form", report.uuid)}
        >
          Editar
        </Button>
        <Button className={styles.deleteButton} onClick={handleDelete}>
          Excluir
        </Button>
      </div>
    </div>
  );
}
