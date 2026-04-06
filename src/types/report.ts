export type ReportType = "COMPLETO" | "PERIODICO" | "FOCADO";

export interface Report {
  uuid: string;
  treatment_uuid: string;
  demand_description: string;
  procedures: string;
  analysis: string;
  conclusion: string;
  issue_date: string;
  start_date_period: string;
  end_date_period: string;
  status: string;
  report_type: ReportType;
  system_prompt?: string | null;
  created_at: string;
  updated_at: string;
}

export type ReportPayload = Pick<
  Report,
  | "treatment_uuid"
  | "demand_description"
  | "procedures"
  | "analysis"
  | "conclusion"
  | "issue_date"
  | "start_date_period"
  | "end_date_period"
> & {
  report_type?: ReportType;
  system_prompt?: string | null;
};

export interface ReportWithAiPayload {
  report_type: ReportType;
  start_date_period?: string | null;
  end_date_period?: string | null;
  system_prompt?: string | null;
}

export type ReportUpdatePayload = Partial<
  Omit<ReportPayload, "treatment_uuid" | "created_at" | "updated_at">
>;

export type ReportListParams = {
  skip?: number;
  limit?: number;
};
