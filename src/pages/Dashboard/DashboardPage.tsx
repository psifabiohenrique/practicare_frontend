import { useMemo, useState } from "react";
import { useUser } from "../../hooks/useUser";
import { useDashboard } from "../../hooks/useDashboard";
import StatCard from "../../components/StatCard/StatCard";
import DateRangeFilter from "../../components/DateRangeFilter/DateRangeFilter";
import Button from "../../components/Button/Button";
import { downloadBackup } from "../../api/export.service";
import { showError, showSuccess } from "../../utils/swal";
import type { DashboardParams } from "../../types/dashboard";
import styles from "./DashboardPage.module.css";

function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  if (minutes < 60) {
    return `${minutes}min ${remainingSeconds}s`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}min`;
}

function formatTokens(count: number): string {
  if (count < 1000) return count.toString();
  if (count < 1_000_000) return `${(count / 1000).toFixed(1)}K`;
  return `${(count / 1_000_000).toFixed(2)}M`;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);
}

const INPUT_PRICE = Number(
  import.meta.env.VITE_INPUT_TOKEN_PRICE_PER_MILLION || 0.5,
);
const OUTPUT_PRICE = Number(
  import.meta.env.VITE_OUTPUT_TOKEN_PRICE_PER_MILLION || 1.5,
);

function getDefaultDates(): { start: string; end: string } {
  const end = new Date();
  const start = new Date(end.getFullYear(), end.getMonth(), 1);
  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
}

export function DashboardPage() {
  const { data: user, isLoading: userLoading } = useUser();
  const defaults = useMemo(getDefaultDates, []);

  const [params, setParams] = useState<DashboardParams>({
    start_date: defaults.start,
    end_date: defaults.end,
  });
  const [isExporting, setIsExporting] = useState(false);

  const { data: stats, isLoading: statsLoading, error } = useDashboard(params);

  const totalCost = useMemo(() => {
    if (!stats) return 0;
    const inputCost = (stats.total_input_tokens / 1_000_000) * INPUT_PRICE;
    const outputCost = (stats.total_output_tokens / 1_000_000) * OUTPUT_PRICE;
    return inputCost + outputCost;
  }, [stats]);

  const handleApplyFilter = (startDate: string, endDate: string) => {
    setParams({ start_date: startDate, end_date: endDate });
  };

  const handleExportBackup = async () => {
    setIsExporting(true);
    try {
      const blob = await downloadBackup();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `backup_prontuarios_${new Date().toISOString().split("T")[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showSuccess("Backup gerado com sucesso!");
    } catch (err) {
      showError("Erro ao gerar backup. Tente novamente mais tarde.");
    } finally {
      setIsExporting(false);
    }
  };

  if (userLoading) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  if (error) {
    return (
      <div className={styles.error}>
        Erro ao carregar as estatísticas. Tente novamente.
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Bem-vindo ao Practicare, {user?.name}</h1>
        <p className={styles.subtitle}>
          Acompanhe suas estatísticas de uso e produtividade.
        </p>
      </div>

      <div className={styles.filterSection} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <DateRangeFilter
          initialStartDate={params.start_date ?? defaults.start}
          initialEndDate={params.end_date ?? defaults.end}
          onApply={handleApplyFilter}
          isLoading={statsLoading}
        />
        <Button onClick={handleExportBackup} disabled={isExporting}>
          {isExporting ? "Gerando Backup..." : "Solicitar Backup (.zip)"}
        </Button>
      </div>

      {statsLoading ? (
        <div className={styles.statsLoading}>
          <p>Carregando estatísticas...</p>
        </div>
      ) : (
        stats && (
          <>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Consumo de IA</h2>
              <div className={styles.grid}>
                <StatCard
                  label="Tokens de entrada"
                  value={formatTokens(stats.total_input_tokens)}
                  subtitle={`${stats.total_input_tokens.toLocaleString("pt-BR")} tokens`}
                />
                <StatCard
                  label="Tokens de saída"
                  value={formatTokens(stats.total_output_tokens)}
                  subtitle={`${stats.total_output_tokens.toLocaleString("pt-BR")} tokens`}
                />
                <StatCard
                  label="Total de tokens"
                  value={formatTokens(
                    stats.total_input_tokens + stats.total_output_tokens,
                  )}
                  subtitle="Entrada + Saída"
                />
                <StatCard
                  label="Custo estimado (USD)"
                  value={formatCurrency(totalCost)}
                  subtitle="Tokens de Entrada e Saída"
                />
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Áudio</h2>
              <div className={styles.grid}>
                <StatCard
                  label="Duração total enviada"
                  value={formatDuration(stats.total_audio_duration)}
                  subtitle="Áudio original"
                />
                <StatCard
                  label="Duração após processamento"
                  value={formatDuration(stats.total_audio_duration_after_vad)}
                  subtitle="Áudio processado"
                />
                <StatCard
                  label="Transcrições"
                  value={stats.total_transcriptions}
                  subtitle="No período"
                />
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Produtividade</h2>
              <div className={styles.grid}>
                <StatCard
                  label="Prontuários gerados (IA)"
                  value={stats.total_records_generated}
                  subtitle="Gerados automaticamente"
                />
                <StatCard
                  label="Relatórios gerados (IA)"
                  value={stats.total_reports_generated}
                  subtitle="Gerados automaticamente"
                />
                <StatCard
                  label="Prontuários criados"
                  value={stats.records_count}
                  subtitle="Total no período"
                />
                <StatCard
                  label="Relatórios criados"
                  value={stats.reports_count}
                  subtitle="Total no período"
                />
                <StatCard
                  label="Tratamentos ativos"
                  value={stats.active_treatments_count}
                  subtitle="Atualmente"
                />
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
}
