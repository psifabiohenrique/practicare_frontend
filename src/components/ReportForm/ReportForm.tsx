import { useEffect, useState } from "react";
import {
  createReport,
  createReportWithAi,
  getReport,
  updateReport,
} from "../../api/report.service";
import Form from "../Form/Form";
import TextField from "../TextField/TextField";
import { TextArea } from "../TextArea/TextArea";
import Button from "../Button/Button";
import { showConfirm, showSuccess, showError } from "../../utils/swal";
import type {
  ReportPayload,
  ReportType,
  ReportUpdatePayload,
  ReportWithAiPayload,
} from "../../types/report";
import styles from "./ReportForm.module.css";

interface ReportFormProps {
  treatmentUuid?: string;
  reportUuid?: string;
  onSuccess: () => void;
}

type Mode = "select" | "ai" | "manual";

const REPORT_TYPES: { value: ReportType; label: string; description: string }[] =
  [
    {
      value: "COMPLETO",
      label: "Completo",
      description:
        "Cobre todos os prontuários do tratamento, do início até hoje.",
    },
    {
      value: "PERIODICO",
      label: "Periódico",
      description:
        "Baseado em um período específico. Se não informado, usa do último relatório até hoje.",
    },
    {
      value: "FOCADO",
      label: "Focado",
      description:
        "Guiado por uma instrução personalizada que define a finalidade do relatório.",
    },
  ];

export function ReportForm({
  treatmentUuid,
  reportUuid,
  onSuccess,
}: ReportFormProps) {
  // Edit mode uses the manual form directly
  const isUpdate = !!reportUuid;

  // Step / mode state
  const [mode, setMode] = useState<Mode>(isUpdate ? "manual" : "select");

  // AI report state
  const [reportType, setReportType] = useState<ReportType>("PERIODICO");
  const [aiStartDate, setAiStartDate] = useState("");
  const [aiEndDate, setAiEndDate] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");

  // Manual report state
  const [demandDescription, setDemandDescription] = useState("");
  const [procedures, setProcedures] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [conclusion, setConclusion] = useState("");
  const [issueDate, setIssueDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [startDatePeriod, setStartDatePeriod] = useState("");
  const [endDatePeriod, setEndDatePeriod] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (reportUuid) {
      async function fetchReport() {
        try {
          setIsFetching(true);
          const report = await getReport(reportUuid!);
          setDemandDescription(report.demand_description);
          setProcedures(report.procedures);
          setAnalysis(report.analysis);
          setConclusion(report.conclusion);
          setIssueDate(report.issue_date);
          setStartDatePeriod(report.start_date_period);
          setEndDatePeriod(report.end_date_period);
        } catch (err) {
          console.error("Error fetching report for form:", err);
          showError("Erro", "Erro ao carregar dados para edição.");
        } finally {
          setIsFetching(false);
        }
      }
      fetchReport();
    }
  }, [reportUuid]);

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!treatmentUuid) return;

    if (
      !(await showConfirm(
        "Gerar relatório",
        "Confirma a geração do relatório com IA?",
      ))
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const payload: ReportWithAiPayload = {
        report_type: reportType,
        start_date_period: aiStartDate || null,
        end_date_period: aiEndDate || null,
        system_prompt: systemPrompt || null,
      };
      await createReportWithAi(treatmentUuid, payload);
      await showSuccess(
        "Sucesso",
        "Solicitação enviada! O relatório será gerado em breve.",
      );
      onSuccess();
    } catch {
      showError(
        "Erro",
        "Falha ao gerar relatório. Verifique os dados e tente novamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isUpdate && reportUuid) {
        const payload: ReportUpdatePayload = {
          demand_description: demandDescription,
          procedures,
          analysis,
          conclusion,
          issue_date: issueDate,
          start_date_period: startDatePeriod,
          end_date_period: endDatePeriod,
        };
        await updateReport(reportUuid, payload);
      } else if (treatmentUuid) {
        const payload: ReportPayload = {
          treatment_uuid: treatmentUuid,
          demand_description: demandDescription,
          procedures,
          analysis,
          conclusion,
          issue_date: issueDate,
          start_date_period: startDatePeriod,
          end_date_period: endDatePeriod,
        };
        await createReport(payload);
      }
      onSuccess();
    } catch (err) {
      console.error("Error saving report:", err);
      showError(
        "Erro",
        "Erro ao salvar o relatório. Verifique os dados e tente novamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching)
    return <div className={styles.loading}>Carregando...</div>;

  // ── Step 1: Mode selection ──────────────────────────────────────────
  if (mode === "select") {
    return (
      <div className={styles.modeSelect}>
        <p className={styles.modeHint}>Como deseja criar o relatório?</p>
        <div className={styles.modeCards}>
          <button
            id="report-mode-ai"
            type="button"
            className={styles.modeCard}
            onClick={() => setMode("ai")}
          >
            <span className={styles.modeIcon}>🤖</span>
            <span className={styles.modeLabel}>Gerar com IA</span>
            <span className={styles.modeDesc}>
              A IA redige o relatório com base nos prontuários.
            </span>
          </button>
          <button
            id="report-mode-manual"
            type="button"
            className={styles.modeCard}
            onClick={() => setMode("manual")}
          >
            <span className={styles.modeIcon}>✏️</span>
            <span className={styles.modeLabel}>Preencher manualmente</span>
            <span className={styles.modeDesc}>
              Escreva o relatório sem auxílio da IA.
            </span>
          </button>
        </div>
      </div>
    );
  }

  // ── Step 2a: AI Form ────────────────────────────────────────────────
  if (mode === "ai") {
    return (
      <Form onSubmit={handleAiSubmit} grid={false}>
        <div className={styles.typeSelectorWrapper}>
          <p className={styles.typeLabel}>Tipo de relatório</p>
          <div className={styles.typeCards}>
            {REPORT_TYPES.map((rt) => (
              <button
                id={`report-type-${rt.value.toLowerCase()}`}
                key={rt.value}
                type="button"
                className={`${styles.typeCard} ${reportType === rt.value ? styles.typeCardActive : ""}`}
                onClick={() => setReportType(rt.value)}
              >
                <strong>{rt.label}</strong>
                <span>{rt.description}</span>
              </button>
            ))}
          </div>
        </div>

        {reportType === "PERIODICO" && (
          <>
            <p className={styles.hint}>
              📅 Datas opcionais. Se não preenchidas, o relatório cobrirá desde
              o último relatório gerado até hoje.
            </p>
            <div className={styles.row}>
              <TextField
                label="Início do Período (opcional)"
                type="date"
                name="ai_start_date"
                value={aiStartDate}
                onChange={(e) => setAiStartDate(e.target.value)}
              />
              <TextField
                label="Fim do Período (opcional)"
                type="date"
                name="ai_end_date"
                value={aiEndDate}
                onChange={(e) => setAiEndDate(e.target.value)}
              />
            </div>
          </>
        )}

        {reportType === "COMPLETO" && (
          <p className={styles.hint}>
            📋 O relatório cobrirá todos os prontuários do tratamento, do início
            até hoje.
          </p>
        )}

        {reportType === "FOCADO" && (
          <>
            <p className={styles.hint}>
              🎯 Datas opcionais — sem datas cobrirá todo o histórico.
            </p>
            <div className={styles.row}>
              <TextField
                label="Início do Período (opcional)"
                type="date"
                name="ai_start_date_focado"
                value={aiStartDate}
                onChange={(e) => setAiStartDate(e.target.value)}
              />
              <TextField
                label="Fim do Período (opcional)"
                type="date"
                name="ai_end_date_focado"
                value={aiEndDate}
                onChange={(e) => setAiEndDate(e.target.value)}
              />
            </div>
            <TextArea
              label="Instrução específica para a IA *"
              name="system_prompt"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              required
              rows={4}
              placeholder="Ex: Foque na evolução da ansiedade social e nas intervenções de exposição utilizadas..."
            />
          </>
        )}

        <div className={styles.actions}>
          <Button
            type="button"
            disabled={isLoading}
            onClick={() => setMode("select")}
          >
            Voltar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Gerando..." : "Gerar Relatório com IA"}
          </Button>
        </div>
      </Form>
    );
  }

  // ── Step 2b: Manual Form ────────────────────────────────────────────
  return (
    <Form onSubmit={handleManualSubmit} grid={false}>
      <TextField
        label="Data de Emissão"
        type="date"
        name="issue_date"
        value={issueDate}
        onChange={(e) => setIssueDate(e.target.value)}
        required
      />

      <div className={styles.row}>
        <TextField
          label="Início do Período"
          type="date"
          name="start_date_period"
          value={startDatePeriod}
          onChange={(e) => setStartDatePeriod(e.target.value)}
          required
        />
        <TextField
          label="Fim do Período"
          type="date"
          name="end_date_period"
          value={endDatePeriod}
          onChange={(e) => setEndDatePeriod(e.target.value)}
          required
        />
      </div>

      <TextArea
        label="Descrição da Demanda"
        name="demand_description"
        value={demandDescription}
        onChange={(e) => setDemandDescription(e.target.value)}
        required
        rows={4}
        placeholder="Descreva a demanda do paciente..."
      />

      <TextArea
        label="Procedimentos Realizados"
        name="procedures"
        value={procedures}
        onChange={(e) => setProcedures(e.target.value)}
        required
        rows={4}
        placeholder="Descreva os procedimentos realizados..."
      />

      <TextArea
        label="Análise"
        name="analysis"
        value={analysis}
        onChange={(e) => setAnalysis(e.target.value)}
        required
        rows={6}
        placeholder="Descreva a análise técnica..."
      />

      <TextArea
        label="Conclusão"
        name="conclusion"
        value={conclusion}
        onChange={(e) => setConclusion(e.target.value)}
        required
        rows={4}
        placeholder="Descreva a conclusão e possíveis encaminhamentos..."
      />

      <div className={styles.actions}>
        {!isUpdate && (
          <Button
            type="button"
            disabled={isLoading}
            onClick={() => setMode("select")}
          >
            Voltar
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : isUpdate ? "Atualizar" : "Salvar"}
        </Button>
      </div>
    </Form>
  );
}
