import { useEffect, useState } from "react";
import { getReport } from "../../api/report.service";
import type { Report } from "../../types/report";
import { formatDate, formatTime } from "../../utils/formatters";
import { CopyButton } from "../CopyButton/CopyButton";
import Button from "../Button/Button";
import { showToast } from "../../utils/swal";
import styles from "./ReportDetail.module.css";

interface ReportDetailProps {
  reportUuid: string;
}

export function ReportDetail({ reportUuid }: ReportDetailProps) {
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReport() {
      try {
        setIsLoading(true);
        const data = await getReport(reportUuid);
        setReport(data);
      } catch (err) {
        console.error("Error fetching report:", err);
        setError("Erro ao carregar os detalhes do relatório.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchReport();
  }, [reportUuid]);
  const handleCopyAll = () => {
    if (report) {
      const allContent = [
        `Descrição da demanda:\n\n${report.demand_description}`,
        `Procedimentos:\n\n${report.procedures}`,
        `Análise: \n\n${report.analysis}`,
        `Conclusão: \n\n${report.conclusion}`,
      ].join("\n\n");
      navigator.clipboard.writeText(allContent);
      showToast("Relatório completo copiado!");
    }
  };

  if (isLoading) return <div className={styles.loading}>Carregando...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!report)
    return <div className={styles.error}>Relatório não encontrado.</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>Relatório de Atendimento</span>
        <div className={styles.headerMeta}>
          <span className={styles.typeBadge} data-type={report.report_type ?? "PERIODICO"}>
            {report.report_type === "COMPLETO"
              ? "Completo"
              : report.report_type === "FOCADO"
                ? "Focado"
                : "Periódico"}
          </span>
          <span className={styles.date}>
            Emissão: {formatDate(report.issue_date)}
          </span>
        </div>
      </div>

      <div className={styles.periodRange}>
        <span>Início do Período: {formatDate(report.start_date_period)}</span>
        <span>Fim do Período: {formatDate(report.end_date_period)}</span>
      </div>

      <div className={styles.copyAllContainer}>
        <Button onClick={handleCopyAll}>Copiar Relatório Completo</Button>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Descrição da Demanda</h3>
          <CopyButton textToCopy={report.demand_description} />
        </div>
        <p className={styles.content}>{report.demand_description}</p>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Procedimentos Realizados</h3>
          <CopyButton textToCopy={report.procedures} />
        </div>
        <p className={styles.content}>{report.procedures}</p>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Análise</h3>
          <CopyButton textToCopy={report.analysis} />
        </div>
        <p className={styles.content}>{report.analysis}</p>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Conclusão</h3>
          <CopyButton textToCopy={report.conclusion} />
        </div>
        <p className={styles.content}>{report.conclusion}</p>
      </div>

      <div className={styles.footer}>
        <span className={styles.timestamp}>
          Criado em: {formatTime(report.created_at)}
        </span>
        {report.updated_at !== report.created_at && (
          <span className={styles.timestamp}>
            Atualizado em: {formatTime(report.updated_at)}
          </span>
        )}
      </div>
    </div>
  );
}
