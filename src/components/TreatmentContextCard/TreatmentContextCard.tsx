import { useEffect, useState, useCallback } from "react";
import styles from "./TreatmentContextCard.module.css";
import Button from "../Button/Button";
import { TextArea } from "../TextArea/TextArea";
import { showSuccess, showError, showConfirm } from "../../utils/swal";
import {
  getContextWithDraft,
  applyDraft,
  rejectDraft,
  updateContext,
} from "../../api/treatmentContext.service";
import type {
  TreatmentContextWithDraft,
  TreatmentContextUpdatePayload,
} from "../../types/treatmentContext";

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

  if (isLoading) return <div>Carregando contexto...</div>;

  return (
    <div className={`${styles.card} ${isEditing ? styles.cardEditing : ""}`}>
      <div className={styles.header}>
        <h2>Contexto Clínico</h2>
        {hasDraft && !isEditing && (
          <span className={styles.badge}>Nova sugestão da IA pendente</span>
        )}
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
                    <p>{contextVal}</p>
                  ) : (
                    <p className={styles.emptyState}>Não definido.</p>
                  )}

                  {hasDraftChange && (
                    <div className={styles.draftBox}>
                      <span className={styles.draftLabel}>Sugestão IA:</span>
                      <p>{draftVal}</p>
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
                    <p>{draftChange}</p>
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
    </div>
  );
}
