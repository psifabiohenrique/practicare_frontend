import { useEffect, useState, useCallback } from "react";
import styles from "./TreatmentContextCard.module.css";
import Button from "../Button/Button";
import { showSuccess, showError, showConfirm } from "../../utils/swal";
import {
  getContextWithDraft,
  applyDraft,
  rejectDraft,
  updateContext,
  generateContext,
} from "../../api/treatmentContext.service";
import type {
  ContextField,
  ContextFieldDiff,
  TreatmentContextWithDraft,
  TreatmentContextUpdatePayload,
  TreatmentContextGeneratePayload,
} from "../../types/treatmentContext";
import { Modal } from "../Modal/Modal";
import { TextArea } from "../TextArea/TextArea";

interface Props {
  treatmentId: string;
  refreshKey: number;
}

type FieldKey =
  | "life_dynamics"
  | "clinical_history"
  | "psychological_patterns"
  | "therapeutic_goals"
  | "medication_notes"
  | "techniques"
  | "requested_activities";

const FIELDS: { key: FieldKey; label: string }[] = [
  { key: "life_dynamics", label: "Dinâmicas de Vida" },
  { key: "clinical_history", label: "Histórico Clínico" },
  { key: "psychological_patterns", label: "Padrões Psicológicos" },
  { key: "therapeutic_goals", label: "Objetivos Terapêuticos" },
  { key: "medication_notes", label: "Medicações" },
  { key: "techniques", label: "Técnicas/Procedimentos" },
  { key: "requested_activities", label: "Atividades Solicitadas" },
];

// ─── Bullet line editor sub-component ──────────────────────────────────────

interface BulletEditorProps {
  label: string;
  value: string[];
  onChange: (bullets: string[]) => void;
}

function BulletEditor({ label, value, onChange }: BulletEditorProps) {
  const updateLine = (idx: number, text: string) => {
    const next = [...value];
    next[idx] = text;
    onChange(next);
  };

  const removeLine = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  const addLine = () => {
    onChange([...value, ""]);
  };

  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "var(--font-size-sm)",
          fontWeight: 600,
          color: "var(--color-text-secondary)",
          marginBottom: "6px",
        }}
      >
        {label}
      </label>
      <div className={styles.bulletEditor}>
        {value.map((bullet, idx) => (
          <div key={idx} className={styles.bulletEditorRow}>
            <span
              style={{
                color: "var(--color-primary)",
                fontWeight: "bold",
                fontSize: "14px",
                marginTop: "1px",
              }}
            >
              •
            </span>
            <input
              className={styles.bulletEditorInput}
              value={bullet}
              placeholder="Digite o bullet point..."
              onChange={(e) => updateLine(idx, e.target.value)}
            />
            <button
              type="button"
              className={styles.iconBtn}
              title="Remover linha"
              onClick={() => removeLine(idx)}
            >
              {/* Trash icon */}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
            </button>
          </div>
        ))}
        <button type="button" className={styles.addLineBtn} onClick={addLine}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Adicionar linha
        </button>
      </div>
    </div>
  );
}

// ─── Not-found warning ───────────────────────────────────────────────────────

function NotFoundWarning({ text }: { text: string }) {
  return (
    <div className={styles.notFoundWarning}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      Bullet não encontrado no contexto: "{text}" — remova manualmente se necessário.
    </div>
  );
}

// ─── Suggestion item (add or remove) ────────────────────────────────────────

interface SuggestionItemProps {
  type: "add" | "remove";
  text: string;
  notFound?: boolean;
  onAdd?: () => void;
  onRemove?: () => void;
}

function SuggestionItem({ type, text, notFound, onAdd, onRemove }: SuggestionItemProps) {
  return (
    <div>
      <div className={`${styles.suggestionItem} ${type === "add" ? styles.addItem : styles.removeItem}`}>
        <span className={styles.suggestionText}>{text}</span>
        {type === "add" && onAdd && (
          <button type="button" className={`${styles.suggestionBtn} ${styles.acceptBtn}`} onClick={onAdd}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Aceitar
          </button>
        )}
        {type === "remove" && onRemove && (
          <button type="button" className={`${styles.suggestionBtn} ${styles.removeBtn}`} onClick={onRemove}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14H6L5 6" />
            </svg>
            Remover
          </button>
        )}
      </div>
      {notFound && <NotFoundWarning text={text} />}
    </div>
  );
}

// ─── Draft review panel for a single field ──────────────────────────────────

interface DraftFieldPanelProps {
  diff: ContextFieldDiff;
  currentBullets: string[];
  notFoundItems: Set<string>;
  onAcceptOne: (bullet: string) => void;
  onRemoveOne: (bullet: string) => void;
  onAcceptAll: () => void;
}

function DraftFieldPanel({
  diff,
  currentBullets,
  notFoundItems,
  onAcceptOne,
  onRemoveOne,
  onAcceptAll,
}: DraftFieldPanelProps) {
  const hasAdd = diff.add.length > 0;
  const hasRemove = diff.remove.length > 0;

  return (
    <div className={styles.draftBox}>
      <div className={styles.draftHeader}>
        <span className={styles.draftLabel}>Sugestão da IA</span>
        <div className={styles.draftActions}>
          <button
            type="button"
            className={`${styles.suggestionBtn} ${styles.acceptBtn}`}
            onClick={onAcceptAll}
            title="Aceitar todas as sugestões deste campo"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Aceitar tudo
          </button>
        </div>
      </div>
      <div className={styles.draftBody}>
        {hasAdd && (
          <div className={styles.draftSection}>
            <span className={`${styles.draftSectionLabel} ${styles.add}`}>
              + Adicionar
            </span>
            {diff.add
              .filter((b) => !currentBullets.includes(b))
              .map((bullet) => (
                <SuggestionItem
                  key={bullet}
                  type="add"
                  text={bullet}
                  onAdd={() => onAcceptOne(bullet)}
                />
              ))}
            {diff.add.filter((b) => currentBullets.includes(b)).length > 0 && (
              <p style={{ fontSize: "11px", color: "var(--color-text-secondary)", fontStyle: "italic", margin: 0 }}>
                Todos os bullets de adição já foram aceitos.
              </p>
            )}
          </div>
        )}
        {hasRemove && (
          <div className={styles.draftSection}>
            <span className={`${styles.draftSectionLabel} ${styles.remove}`}>
              − Remover
            </span>
            {diff.remove.map((bullet) => (
              <SuggestionItem
                key={bullet}
                type="remove"
                text={bullet}
                notFound={notFoundItems.has(bullet)}
                onRemove={() => onRemoveOne(bullet)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export function TreatmentContextCard({ treatmentId, refreshKey }: Props) {
  const [data, setData] = useState<TreatmentContextWithDraft | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // editValues: what we'll save — list of bullets per field
  const [editValues, setEditValues] = useState<Record<FieldKey, string[]>>(
    () => Object.fromEntries(FIELDS.map((f) => [f.key, []] as [FieldKey, string[]])) as Record<FieldKey, string[]>
  );

  // Track which "remove" bullets weren't found in context
  const [notFoundMap, setNotFoundMap] = useState<Record<FieldKey, Set<string>>>(
    () => Object.fromEntries(FIELDS.map((f) => [f.key, new Set<string>()] as [FieldKey, Set<string>])) as Record<FieldKey, Set<string>>
  );

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

  // ── Start edit (review draft or direct edit) ────────────────────────────

  const startEdit = () => {
    const initial = Object.fromEntries(
      FIELDS.map((f) => [f.key, data?.context?.[f.key] ?? []])
    ) as Record<FieldKey, string[]>;
    setEditValues(initial);
    setNotFoundMap(
      Object.fromEntries(FIELDS.map((f) => [f.key, new Set<string>()])) as Record<FieldKey, Set<string>>
    );
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // ── Accept a single "add" bullet for a field ────────────────────────────

  const handleAcceptOne = (field: FieldKey, bullet: string) => {
    setEditValues((prev) => {
      const current = prev[field] ?? [];
      if (current.includes(bullet)) return prev;
      return { ...prev, [field]: [...current, bullet] };
    });
  };

  // ── Remove a single "remove" bullet suggestion for a field ──────────────

  const handleRemoveOne = (field: FieldKey, bullet: string) => {
    setEditValues((prev) => {
      const current = prev[field] ?? [];
      const idx = current.findIndex(
        (b) => b.toLowerCase().trim() === bullet.toLowerCase().trim()
      );
      if (idx === -1) {
        // Not found — mark as not found
        setNotFoundMap((pfm) => ({
          ...pfm,
          [field]: new Set([...pfm[field], bullet]),
        }));
        return prev;
      }
      // Remove it
      setNotFoundMap((pfm) => {
        const next = new Set(pfm[field]);
        next.delete(bullet);
        return { ...pfm, [field]: next };
      });
      return { ...prev, [field]: current.filter((_, i) => i !== idx) };
    });
  };

  // ── Accept ALL suggestions for a field ─────────────────────────────────

  const handleAcceptAllForField = (field: FieldKey) => {
    const diff = data?.pending_draft?.[field];
    if (!diff) return;

    setEditValues((prev) => {
      const current = [...(prev[field] ?? [])];
      // Add items not already present
      for (const b of diff.add) {
        if (!current.includes(b)) current.push(b);
      }
      // Remove items (fuzzy match)
      for (const b of diff.remove) {
        const idx = current.findIndex(
          (x) => x.toLowerCase().trim() === b.toLowerCase().trim()
        );
        if (idx !== -1) current.splice(idx, 1);
      }
      return { ...prev, [field]: current };
    });

    // Clear not-found for items that were attempted
    setNotFoundMap((pfm) => {
      const next = new Set(pfm[field]);
      for (const b of diff.remove) next.delete(b);
      return { ...pfm, [field]: next };
    });
  };

  // ── Save — direct edit (no draft) ──────────────────────────────────────

  const handleSaveDirectly = async () => {
    const payload: TreatmentContextUpdatePayload = {};
    for (const f of FIELDS) {
      const bullets = editValues[f.key].filter((b) => b.trim() !== "");
      payload[f.key] = bullets.length > 0 ? bullets : null;
    }
    try {
      await updateContext(treatmentId, payload);
      showSuccess("Contexto atualizado com sucesso!");
      setIsEditing(false);
      fetchData();
    } catch {
      showError("Erro ao atualizar contexto.");
    }
  };

  // ── Apply draft — sends final reviewed lists ────────────────────────────

  const handleApplyDraft = async () => {
    if (!data?.pending_draft) return;
    const payload: TreatmentContextUpdatePayload = {};
    for (const f of FIELDS) {
      const bullets = editValues[f.key].filter((b) => b.trim() !== "");
      payload[f.key] = bullets.length > 0 ? bullets : null;
    }
    try {
      await applyDraft(data.pending_draft.uuid, payload);
      showSuccess("Sugestões aplicadas com sucesso!");
      setIsEditing(false);
      fetchData();
    } catch {
      showError("Erro ao aplicar sugestões.");
    }
  };

  // ── Reject draft ────────────────────────────────────────────────────────

  const handleRejectDraft = async () => {
    if (!data?.pending_draft) return;
    if (await showConfirm("Rejeitar Sugestões", "Deseja descartar as sugestões da IA?")) {
      try {
        await rejectDraft(data.pending_draft.uuid);
        showSuccess("Sugestões descartadas.");
        setIsEditing(false);
        fetchData();
      } catch {
        showError("Erro ao rejeitar sugestões.");
      }
    }
  };

  // ── Generate modal ──────────────────────────────────────────────────────

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
      showSuccess(
        "Geração solicitada! A IA irá reescrever seu contexto em background e ele estará disponível como um draft em alguns minutos."
      );
      setIsGenerateModalOpen(false);
      fetchData();
    } catch {
      showError("Erro ao solicitar geração de contexto.");
    } finally {
      setIsGenerating(false);
    }
  };

  // ── Rendering ───────────────────────────────────────────────────────────

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

      {/* ── View mode ──────────────────────────────────────────────────── */}
      {!isEditing ? (
        <div className={styles.editorContainer}>
          {FIELDS.map((f) => {
            const contextBullets: ContextField = data?.context?.[f.key] ?? null;
            const diff: ContextFieldDiff | null = data?.pending_draft?.[f.key] ?? null;
            const hasDiffChange = hasDraft && diff && (diff.add.length > 0 || diff.remove.length > 0);

            return (
              <div key={f.key} className={styles.section}>
                <h3>{f.label}</h3>
                <div className={styles.contentRow}>
                  {/* Current context bullets */}
                  {contextBullets && contextBullets.length > 0 ? (
                    <ul className={styles.bulletList}>
                      {contextBullets.map((bullet, idx) => {
                        const markedForRemoval = diff?.remove.some(
                          (r) => r.toLowerCase().trim() === bullet.toLowerCase().trim()
                        );
                        return (
                          <li key={idx} className={styles.bulletItem}>
                            <span className={styles.bulletDot} />
                            <span
                              className={`${styles.bulletText} ${markedForRemoval ? styles.bulletRemoved : ""}`}
                            >
                              {bullet}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className={styles.emptyState}>Não definido.</p>
                  )}

                  {/* Draft diff panel (view-only in read mode) */}
                  {hasDiffChange && diff && (
                    <div className={styles.draftBox}>
                      <div className={styles.draftHeader}>
                        <span className={styles.draftLabel}>Sugestão da IA</span>
                      </div>
                      <div className={styles.draftBody}>
                        {diff.add.length > 0 && (
                          <div className={styles.draftSection}>
                            <span className={`${styles.draftSectionLabel} ${styles.add}`}>
                              + Adicionar
                            </span>
                            {diff.add.map((b) => (
                              <div key={b} className={`${styles.suggestionItem} ${styles.addItem}`}>
                                <span className={styles.suggestionText}>{b}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {diff.remove.length > 0 && (
                          <div className={styles.draftSection}>
                            <span className={`${styles.draftSectionLabel} ${styles.remove}`}>
                              − Remover
                            </span>
                            {diff.remove.map((b) => (
                              <div key={b} className={`${styles.suggestionItem} ${styles.removeItem}`}>
                                <span className={styles.suggestionText}>{b}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div className={styles.buttons}>
            {hasDraft ? (
              <Button onClick={startEdit}>Revisar Sugestões</Button>
            ) : (
              <Button onClick={startEdit}>Editar Contexto</Button>
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

      /* ── Edit / review mode ────────────────────────────────────────── */
      ) : (
        <div className={styles.editorContainer}>
          {FIELDS.map((f) => {
            const diff: ContextFieldDiff | null = data?.pending_draft?.[f.key] ?? null;
            const hasDiff = hasDraft && diff && (diff.add.length > 0 || diff.remove.length > 0);

            return (
              <div key={f.key} className={styles.section}>
                <h3>{f.label}</h3>

                {/* Draft suggestion panel with interactive buttons */}
                {hasDiff && diff && (
                  <DraftFieldPanel
                    diff={diff}
                    currentBullets={editValues[f.key]}
                    notFoundItems={notFoundMap[f.key]}
                    onAcceptOne={(b) => handleAcceptOne(f.key, b)}
                    onRemoveOne={(b) => handleRemoveOne(f.key, b)}
                    onAcceptAll={() => handleAcceptAllForField(f.key)}
                  />
                )}

                {/* Bullet line editor */}
                <BulletEditor
                  label={hasDiff ? "Contexto atual (editável):" : f.label}
                  value={editValues[f.key]}
                  onChange={(bullets) =>
                    setEditValues((prev) => ({ ...prev, [f.key]: bullets }))
                  }
                />
              </div>
            );
          })}

          <div className={styles.buttons}>
            <Button
              onClick={handleCancelEdit}
              style={{ backgroundColor: "var(--color-text-secondary)" }}
            >
              Cancelar
            </Button>
            {hasDraft ? (
              <>
                <Button
                  onClick={handleRejectDraft}
                  style={{ backgroundColor: "var(--color-error)" }}
                >
                  Rejeitar Sugestões
                </Button>
                <Button onClick={handleApplyDraft}>Aplicar e Salvar</Button>
              </>
            ) : (
              <Button onClick={handleSaveDirectly}>Salvar Contexto</Button>
            )}
          </div>
        </div>
      )}

      {/* ── Generate modal ─────────────────────────────────────────────── */}
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
