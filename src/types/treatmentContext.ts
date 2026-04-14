export type ContextField = string[] | null;

export interface ContextFieldDiff {
  add: string[];
  remove: string[];
}

export interface TreatmentContext {
  uuid: string;
  treatment_uuid: string;
  life_dynamics: ContextField;
  clinical_history: ContextField;
  psychological_patterns: ContextField;
  therapeutic_goals: ContextField;
  medication_notes: ContextField;
  is_update_scheduled: boolean;
  created_at: string;
  updated_at: string;
}

export interface TreatmentContextDraft {
  uuid: string;
  treatment_context_uuid: string;
  treatment_record_uuid: string;
  life_dynamics: ContextFieldDiff | null;
  clinical_history: ContextFieldDiff | null;
  psychological_patterns: ContextFieldDiff | null;
  therapeutic_goals: ContextFieldDiff | null;
  medication_notes: ContextFieldDiff | null;
  is_applied: boolean;
  created_at: string;
}

export interface TreatmentContextWithDraft {
  context: TreatmentContext | null;
  pending_draft: TreatmentContextDraft | null;
}

/** Payload sent to PATCH /treatment/{uuid} or POST /draft/:uuid/apply */
export interface TreatmentContextUpdatePayload {
  life_dynamics?: ContextField;
  clinical_history?: ContextField;
  psychological_patterns?: ContextField;
  therapeutic_goals?: ContextField;
  medication_notes?: ContextField;
}

export interface TreatmentContextGeneratePayload {
  historical_notes?: string | null;
  include_existing_records: boolean;
}
