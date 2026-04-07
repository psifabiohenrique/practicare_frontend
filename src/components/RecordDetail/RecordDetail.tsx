import { useEffect, useState } from "react";
import { getRecord, deleteRecord } from "../../api/record.service";
import type { Record as RecordType } from "../../types/record";
import { formatDate, formatTime } from "../../utils/formatters";
import { CopyButton } from "../CopyButton/CopyButton";
import Button from "../Button/Button";
import { showConfirm, showError, showToast } from "../../utils/swal";
import styles from "./RecordDetail.module.css";

interface RecordDetailProps {
  recordUuid: string;
  onArchive?: () => void;
}

export function RecordDetail({ recordUuid, onArchive }: RecordDetailProps) {
  const [record, setRecord] = useState<RecordType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecord() {
      try {
        setIsLoading(true);
        const data = await getRecord(recordUuid);
        setRecord(data);
      } catch (err) {
        console.error("Error fetching record:", err);
        setError("Erro ao carregar os detalhes do registro.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecord();
  }, [recordUuid]);

  const handleArchive = async () => {
    const confirmed = await showConfirm(
      "Arquivar prontuário",
      "Esta ação arquivará o prontuário. Deseja continuar?",
      "Arquivar",
      "Cancelar",
    );
    if (!confirmed) return;

    try {
      await deleteRecord(recordUuid);
      showToast("Prontuário arquivado com sucesso!");
      if (onArchive) onArchive();
    } catch {
      showError("Erro", "Não foi possível arquivar o prontuário.");
    }
  };


  if (isLoading) return <div className={styles.loading}>Carregando...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!record)
    return <div className={styles.error}>Registro não encontrado.</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.recordNumber}>
          Registro nº {record.record_number}
        </span>
        <span className={styles.date}>
          Prontuário do dia: {formatDate(record.date)}
        </span>
      </div>

      <div className={styles.timeRange}>
        <span>Horário de início: {formatTime(record.start_time)}</span>
        <span>Horário de fim: {formatTime(record.end_time)}</span>
      </div>

      <div className={styles.contentSection}>
        <div className={styles.contentHeader}>
          <h3>Evolução</h3>
          <CopyButton
            textToCopy={`${formatDate(record.date)}\n\n${record.content}`}
          />
        </div>
        <p className={styles.content}>{record.content}</p>
      </div>

      <div className={styles.footer}>
        <span className={styles.timestamp}>
          Criado em: {formatTime(record.created_at)}
        </span>
        {record.updated_at !== record.created_at && (
          <span className={styles.timestamp}>
            Atualizado em: {formatTime(record.updated_at)}
          </span>
        )}
      </div>

      {record.is_active && (
        <div className={styles.archiveSection}>
          <Button
            className={styles.archiveButton}
            onClick={handleArchive}
          >
            Arquivar Prontuário
          </Button>
        </div>
      )}
    </div>
  );
}
