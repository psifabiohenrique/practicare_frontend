import { ReportListCard } from "../ReportListCard/ReportListCard";
import styles from "./ReportList.module.css";
import Button from "../Button/Button";
import { useEffect, useState, useCallback } from "react";
import { type Report } from "../../types/report";
import { listReports } from "../../api/report.service";
import type { ModalType } from "../../pages/Dashboard/patients/PatientDetailPage";
import type { PaginatedResponse } from "../../types/pagination";

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
  const [params, setParams] = useState({ skip: 0, limit: 4, include_archived: false });
  const [pagination, setPagination] = useState<Omit<PaginatedResponse<Report>, "items">>({
    total: 0,
    page: 1,
    size: 4,
    pages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await listReports(treatmentId, params);
      setReports(data.items);
      setPagination({
        total: data.total,
        page: data.page,
        size: data.size,
        pages: data.pages,
      });
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setIsLoading(false);
    }
  }, [treatmentId, params]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports, refreshKey]);

  return (
    <div className={styles.reportContainer}>
      <header className={styles.header}>
        <h1>Relatórios</h1>
      </header>
      <div className={styles.button}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <input 
              type="checkbox" 
              checked={params.include_archived}
              onChange={(e) => setParams({ ...params, include_archived: e.target.checked, skip: 0 })}
            />
            Exibir Arquivados
          </label>
          <Button
            onClick={() => onOpenModal("report_form")}
            style={{ width: "200px" }}
            disabled={isLoading}
          >
            Novo Relatório
          </Button>
        </div>
      </div>

      <div className={styles.reportsGrid}>
        {isLoading ? (
          <p>Carregando relatórios...</p>
        ) : reports && reports.length > 0 ? (
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
          disabled={params.skip === 0 || isLoading}
        >
          Anterior
        </Button>
        <span className={styles.pageInfo}>
          Página {pagination.page} de {pagination.pages}
        </span>
        <Button 
          onClick={() => setParams({ ...params, skip: params.skip + 4 })}
          disabled={isLoading || pagination.page >= pagination.pages}
        >
          Próximo
        </Button>
      </div>
    </div>
  );
}
