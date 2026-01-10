import { useEffect, useState } from "react";
import { getRecord } from "../../api/record.service";
import type { Record } from "../../types/record";
import { formatDate, formatTime } from "../../utils/formatters";
import styles from "./RecordDetail.module.css";

interface RecordDetailProps {
  recordUuid: string;
}

export function RecordDetail({ recordUuid }: RecordDetailProps) {
  const [record, setRecord] = useState<Record | null>(null);
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
        <h3>Evolução</h3>
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
    </div>
  );
}
