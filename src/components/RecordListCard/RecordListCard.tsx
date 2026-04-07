import { type Record } from "../../types/record";
import { formatDate } from "../../utils/formatters";
import type { ModalType } from "../../pages/Dashboard/patients/PatientDetailPage";
import Button from "../Button/Button";
import { deleteRecord } from "../../api/record.service";
import { showConfirm, showError, showToast } from "../../utils/swal";
import styles from "./RecordListCard.module.css";

interface RecordListCardProps {
  record: Record;
  onOpenModal: (type: ModalType, uuid?: string) => void;
  onDeleted: () => void;
}

export function RecordListCard({ record, onOpenModal, onDeleted }: RecordListCardProps) {
  const handleArchive = async () => {
    const confirmed = await showConfirm(
      "Arquivar prontuário",
      "Esta ação arquivará o prontuário. Deseja continuar?",
      "Arquivar",
      "Cancelar",
    );
    if (!confirmed) return;

    try {
      await deleteRecord(record.uuid);
      showToast("Prontuário arquivado com sucesso!");
      onDeleted();
    } catch {
      showError("Erro", "Não foi possível arquivar o prontuário.");
    }
  };

  return (
    <div className={styles.recordListCardContainer} style={{ opacity: record.is_active ? 1 : 0.6 }}>
      <div className={styles.info}>
        <span className={styles.recordNumber}>
          {record.is_active ? `Registro Nº ${record.record_number}` : "Prontuário [Arquivado]"}
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
        {record.is_active && (
          <>
            <Button
              className={styles.editButton}
              onClick={() => onOpenModal("record_form", record.uuid)}
            >
              Editar
            </Button>
            <Button
              className={styles.deleteButton}
              style={{ backgroundColor: "#dc3545", color: "white" }}
              onClick={handleArchive}
            >
              Arquivar
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
