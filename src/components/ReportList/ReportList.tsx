import { ReportListCard } from "../ReportListCard/ReportListCard";
import styles from "./ReportList.module.css";
import Button from "../Button/Button";
import { useEffect, useState, useCallback } from "react";
import { type Report } from "../../types/report";
import { listReports } from "../../api/report.service";
import type { ModalType } from "../../pages/Dashboard/patients/PatientDetailPage";

interface ReportListProps {
  treatmentId: string;
  onOpenModal: (type: ModalType, uuid?: string) => void;
  refreshKey?: number;
}

export function ReportList({
  treatmentId,
  onOpenModal,
  refreshKey,
}: ReportListProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [params, setParams] = useState({ skip: 0, limit: 4 });

  const fetchReports = useCallback(async () => {
    try {
      const data = await listReports(treatmentId, params);
      setReports(data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  }, [treatmentId, params]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports, refreshKey]);

  return (
    <div className={styles.reportContainer}>
      <header className={styles.header}>
        <h1>Relatórios</h1>
        <Button onClick={() => onOpenModal("report_form")}>
          Novo Relatório
        </Button>
      </header>

      <div className={styles.reportsGrid}>
        {reports && reports.length > 0 ? (
          reports.map((report) => (
            <ReportListCard
              key={report.uuid}
              report={report}
              onOpenModal={onOpenModal}
            />
          ))
        ) : (
          <p>Nenhum relatório encontrado</p>
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
