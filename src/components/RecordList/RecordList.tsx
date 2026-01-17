import { RecordListCard } from "../RecordListCard/RecordListCard";
import styles from "./RecordList.module.css";
import Button from "../Button/Button";
import { useEffect, useState, useCallback } from "react";
import { type Record } from "../../types/record";
import { listRecords } from "../../api/record.service";
import type { ModalType } from "../../pages/Dashboard/patients/PatientDetailPage";

interface RecordListProps {
  treatmentId: string;
  onOpenModal: (type: ModalType, uuid?: string) => void;
  refreshKey?: number;
}

export function RecordList({
  treatmentId,
  onOpenModal,
  refreshKey,
}: RecordListProps) {
  const [records, setRecords] = useState<Record[]>([]);
  const [params, setParams] = useState({ skip: 0, limit: 4 });

  const fetchRecords = useCallback(async () => {
    const records = await listRecords(treatmentId, params);
    setRecords(records);
  }, [treatmentId, params]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords, refreshKey]);

  return (
    <div className={styles.recordContainer}>
      <header className={styles.header}>
        <h1>Prontuários</h1>
      </header>

      <div className={styles.button}>
      <Button
        onClick={() => onOpenModal("record_form")}
        style={{ width: "200px" }}
      >
        Adicionar Registro
      </Button>
      </div>
      <div className={styles.recordsGrid}>
        {records && records.length > 0 ? (
          records.map((record) => (
            <RecordListCard
              key={record.uuid}
              record={record}
              onOpenModal={onOpenModal}
            />
          ))
        ) : (
          <p>Nenhum registro encontrado</p>
        )}
      </div>

      <div className={styles.pagination}>
        <Button
          onClick={() =>
            setParams({ ...params, skip: Math.max(0, params.skip - 4) })
          }
          disabled={params.skip === 0}
        >
          Anterior
        </Button>
        <Button onClick={() => setParams({ ...params, skip: params.skip + 4 })}>
          Próximo
        </Button>
      </div>
    </div>
  );
}
