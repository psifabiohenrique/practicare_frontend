export interface TreatmentContext {
  uuid: string;
  treatment_uuid: string;
  life_dynamics: string | null;
  clinical_history: string | null;
  psychological_patterns: string | null;
  therapeutic_goals: string | null;
  medication_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface TreatmentContextDraft {
  uuid: string;
  treatment_context_uuid: string;
  treatment_record_uuid: string;
  life_dynamics: string | null;
  clinical_history: string | null;
  psychological_patterns: string | null;
  therapeutic_goals: string | null;
  medication_notes: string | null;
  is_applied: boolean;
  created_at: string;
}

export interface TreatmentContextWithDraft {
  context: TreatmentContext | null;
  pending_draft: TreatmentContextDraft | null;
}

export interface TreatmentContextUpdatePayload {
  life_dynamics?: string | null;
  clinical_history?: string | null;
  psychological_patterns?: string | null;
  therapeutic_goals?: string | null;
  medication_notes?: string | null;
}
