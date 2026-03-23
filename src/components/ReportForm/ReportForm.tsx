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
import { MessageCard } from "../MessageCard/MessageCard";
import type {
  ReportPayload,
  ReportUpdatePayload,
  ReportWithAiPayload,
} from "../../types/report";
import styles from "./ReportForm.module.css";

interface ReportFormProps {
  treatmentUuid?: string;
  reportUuid?: string;
  onSuccess: () => void;
}

export function ReportForm({
  treatmentUuid,
  reportUuid,
  onSuccess,
}: ReportFormProps) {
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
  const [messages, setMessages] = useState<string[] | null>(null);

  const isUpdate = !!reportUuid;

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
          setMessages(["Erro ao carregar dados para edição."]);
        } finally {
          setIsFetching(false);
        }
      }
      fetchReport();
    }
  }, [reportUuid]);

  const handleAiSubmit = async () => {
    if (treatmentUuid) {
      if (
        confirm(
          "Você confirma a geração de um novo relatório para o período descrito?",
        )
      ) {
        try {
          const payload: ReportWithAiPayload = {
            treatment_uuid: treatmentUuid!,
            issue_date: issueDate,
            start_date_period: startDatePeriod,
            end_date_period: endDatePeriod,
          };
          const result = await createReportWithAi(treatmentUuid, payload);
          setMessages([
            "Solicitação enviado com sucesso, aguarde o processamento",
          ]);
          setDemandDescription(result.demand_description);
          setProcedures(result.procedures);
          setAnalysis(result.analysis);
          setConclusion(result.conclusion);
          onSuccess();
        } catch {
          setMessages([
            "Falha ao realizar solicitação, verifique as datas inseridas ou tente novamente mais tarde.",
          ]);
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessages(null);
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
      setMessages([
        "Erro ao salvar o relatório. Verifique os dados e tente novamente.",
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <div className={styles.loading}>Carregando...</div>;

  return (
    <Form onSubmit={handleSubmit} grid={false}>
      {messages &&
        messages.map((message, index) => (
          <MessageCard key={index} message={message} />
        ))}

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
          <Button type="button" disabled={isLoading} onClick={handleAiSubmit}>
            Gerar relatório com IA
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : isUpdate ? "Atualizar" : "Salvar"}
        </Button>
      </div>
    </Form>
  );
}
