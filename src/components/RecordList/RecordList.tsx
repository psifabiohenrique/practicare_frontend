import { RecordListCard } from "../RecordListCard/RecordListCard";
import styles from "./RecordList.module.css";
import Button from "../Button/Button";
import { useEffect, useState } from "react";
import { type Record } from "../../types/record";
import { listRecords } from "../../api/record.service";

interface RecordListProps {
  treatmentId: string;
}
export function RecordList({ treatmentId }: RecordListProps) {
  const [records, setRecords] = useState<Record[]>([]);
  const [params, setParams] = useState({ skip: 0, limit: 4 });

  async function fetchRecords() {
    const records = await listRecords(treatmentId, params);
    setRecords(records);
  }

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div className={styles.recordContainer}>
      <h1>Prontuários</h1>
      <Button>Adicionar Registro</Button>
      {records && records.length > 0 ? (
        records.map((record) => (
          <RecordListCard key={record.uuid} record={record} />
        ))
      ) : (
        <p>Nenhum registro encontrado</p>
      )}
      <Button onClick={() => setParams({ ...params, skip: params.skip - 4 })}>
        Anterior
      </Button>
      <Button onClick={() => setParams({ ...params, skip: params.skip + 4 })}>
        Proximo
      </Button>
    </div>
  );
}
