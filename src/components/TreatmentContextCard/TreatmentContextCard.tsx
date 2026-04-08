import { useEffect, useState, useCallback } from "react";
import styles from "./TreatmentContextCard.module.css";
import Button from "../Button/Button";
import { TextArea } from "../TextArea/TextArea";
import ReactMarkdown from "react-markdown";
import { showSuccess, showError, showConfirm } from "../../utils/swal";
import {
  getContextWithDraft,
  applyDraft,
  rejectDraft,
  updateContext,
  generateContext,
} from "../../api/treatmentContext.service";
import type {
  TreatmentContextWithDraft,
  TreatmentContextUpdatePayload,
  TreatmentContextGeneratePayload,
} from "../../types/treatmentContext";
import { Modal } from "../Modal/Modal";

interface Props {
  treatmentId: string;
  refreshKey: number;
}

type FieldKey =
  | "life_dynamics"
  | "clinical_history"
  | "psychological_patterns"
  | "therapeutic_goals"
  | "medication_notes";

const FIELDS: { key: FieldKey; label: string }[] = [
  { key: "life_dynamics", label: "Dinâmicas de Vida" },
  { key: "clinical_history", label: "Histórico Clínico" },
  { key: "psychological_patterns", label: "Padrões Psicológicos" },
  { key: "therapeutic_goals", label: "Objetivos Terapêuticos" },
  { key: "medication_notes", label: "Medicações" },
];

export function TreatmentContextCard({ treatmentId, refreshKey }: Props) {
  const [data, setData] = useState<TreatmentContextWithDraft | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<TreatmentContextUpdatePayload>({});

  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [generateNotes, setGenerateNotes] = useState("");
  const [includeExisting, setIncludeExisting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getContextWithDraft(treatmentId);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [treatmentId]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshKey]);

  const hasDraft = !!data?.pending_draft;

  const startReviewOrEdit = () => {
    const initialValues: TreatmentContextUpdatePayload = {};
    for (const field of FIELDS) {
      initialValues[field.key] = data?.context?.[field.key] || "";
    }
    setEditValues(initialValues);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditValues({});
  };

  const handleApplyDraft = async () => {
    if (!data?.pending_draft) return;
    try {
      await applyDraft(data.pending_draft.uuid, editValues);
      showSuccess("Sugestões aplicadas com sucesso!");
      setIsEditing(false);
      fetchData();
    } catch (err) {
      showError("Erro ao aplicar sugestões.");
    }
  };

  const handleRejectDraft = async () => {
    if (!data?.pending_draft) return;
    if (await showConfirm("Rejeitar Sugestões", "Deseja descartar as sugestões da IA?")) {
      try {
        await rejectDraft(data.pending_draft.uuid);
        showSuccess("Sugestões descartadas.");
        setIsEditing(false);
        fetchData();
      } catch (err) {
        showError("Erro ao rejeitar sugestões.");
      }
    }
  };

  const handleSaveDirectly = async () => {
    try {
      await updateContext(treatmentId, editValues);
      showSuccess("Contexto atualizado com sucesso!");
      setIsEditing(false);
      fetchData();
    } catch (err) {
      showError("Erro ao atualizar contexto.");
    }
  };

  const handleChange = (key: FieldKey, value: string) => {
    setEditValues((prev) => ({ ...prev, [key]: value }));
  };

  const openGenerateModal = () => {
    setGenerateNotes("");
    setIncludeExisting(false);
    setIsGenerateModalOpen(true);
  };

  const handleGenerateContext = async () => {
    const confirm = await showConfirm(
      "Atenção: Sobrescrita de Contexto",
      "O contexto atual será substituído por um novo. Deseja prosseguir?"
    );
    if (!confirm) return;

    setIsGenerating(true);
    try {
      const payload: TreatmentContextGeneratePayload = {
        historical_notes: generateNotes || null,
        include_existing_records: includeExisting,
      };
      await generateContext(treatmentId, payload);
      showSuccess("Geração solicitada! A IA irá reescrever seu contexto em background e ele estará disponível como um draft em alguns minutos.");
      setIsGenerateModalOpen(false);
      fetchData();
    } catch (err) {
      showError("Erro ao solicitar geração de contexto.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) return <div>Carregando contexto...</div>;

  return (
    <div className={`${styles.card} ${isEditing ? styles.cardEditing : ""}`}>
      <div className={styles.header}>
        <h2>Contexto Clínico</h2>
        <div className={styles.headerRight}>
          {hasDraft && !isEditing && (
            <span className={styles.badge}>Nova sugestão da IA pendente</span>
          )}
          {data?.context?.is_update_scheduled && (
            <span className={styles.badge} style={{ backgroundColor: "var(--color-primary)" }}>
              Gerando contexto (IA)...
            </span>
          )}
        </div>
      </div>

      {!isEditing ? (
        <div className={styles.editorContainer}>
          {FIELDS.map((f) => {
            const contextVal = data?.context?.[f.key];
            const draftVal = data?.pending_draft?.[f.key];
            const hasDraftChange =
              hasDraft && draftVal && draftVal !== contextVal;

            return (
              <div key={f.key} className={styles.section}>
                <h3>{f.label}</h3>
                <div className={styles.contentRow}>
                  {contextVal ? (
                    <div className={styles.markdownContent}>
                      <ReactMarkdown>{contextVal}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className={styles.emptyState}>Não definido.</p>
                  )}

                  {hasDraftChange && (
                    <div className={styles.draftBox}>
                      <span className={styles.draftLabel}>Sugestão IA:</span>
                      <div className={styles.markdownContent}>
                        <ReactMarkdown>{draftVal}</ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div className={styles.buttons}>
            {hasDraft ? (
              <Button onClick={startReviewOrEdit}>Revisar Sugestões</Button>
            ) : (
              <Button onClick={startReviewOrEdit}>Editar Contexto</Button>
            )}
            <Button
              onClick={openGenerateModal}
              style={{ backgroundColor: "var(--color-secondary)" }}
              disabled={data?.context?.is_update_scheduled}
            >
              Re-gerar c/ IA
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles.editorContainer}>
          {FIELDS.map((f) => {
            const draftChange = data?.pending_draft?.[f.key];
            const showDraftSuggestion = hasDraft && draftChange;
            
            return (
              <div key={f.key} className={styles.section}>
                {showDraftSuggestion && (
                  <div className={styles.draftBox}>
                    <span className={styles.draftLabel}>Mudanças Propostas pela IA:</span>
                    <div className={styles.markdownContent}>
                      <ReactMarkdown>{draftChange}</ReactMarkdown>
                    </div>
                  </div>
                )}
                <TextArea
                  label={f.label}
                  value={editValues[f.key] || ""}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  rows={5}
                />
              </div>
            );
          })}

          <div className={styles.buttons}>
            <Button onClick={handleCancelEdit} style={{ backgroundColor: "var(--color-text-secondary)" }}>
              Cancelar
            </Button>
            {hasDraft ? (
              <>
                <Button onClick={handleRejectDraft} style={{ backgroundColor: "var(--color-error)" }}>
                  Rejeitar Sugestões
                </Button>
                <Button onClick={handleApplyDraft}>Aplicar Sugestões</Button>
              </>
            ) : (
              <Button onClick={handleSaveDirectly}>Salvar Contexto</Button>
            )}
          </div>
        </div>
      )}

      {/* Modal de Re-gerar Contexto */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => !isGenerating && setIsGenerateModalOpen(false)}
        title="Re-gerar Contexto com a IA"
        closeOnOverlayClick={false}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)" }}>
            A inteligência artificial irá reescrever seu contexto completamente com base no material fornecido.
          </p>
          <TextArea
            label="Histórico de anotações prévias (Opcional)"
            value={generateNotes}
            onChange={(e) => setGenerateNotes(e.target.value)}
            rows={8}
            placeholder="Cole aqui anotações ou evoluções de outros sistemas."
          />
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input
              type="checkbox"
              id="includeExisting"
              checked={includeExisting}
              onChange={(e) => setIncludeExisting(e.target.checked)}
            />
            <label htmlFor="includeExisting" style={{ cursor: "pointer" }}>
              Incluir todos os prontuários já cadastrados do paciente
            </label>
          </div>
          <div className={styles.buttons} style={{ marginTop: "1rem" }}>
            <Button
              onClick={() => setIsGenerateModalOpen(false)}
              style={{ backgroundColor: "var(--color-text-secondary)" }}
              disabled={isGenerating}
            >
              Cancelar
            </Button>
            <Button onClick={handleGenerateContext} disabled={isGenerating}>
              {isGenerating ? "Solicitando..." : "Gerar"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
