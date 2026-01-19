import { api } from "./axios";
import type {
  Report,
  ReportPayload,
  ReportUpdatePayload,
  ReportListParams,
  ReportWithAiPayload,
} from "../types/report";

export async function listReports(
  treatment_uuid: string,
  params: ReportListParams,
) {
  const response = await api.get<Report[]>(
    `/treatment-reports/treatment/${treatment_uuid}`,
    { params },
  );
  return response.data;
}

export async function getReport(report_uuid: string): Promise<Report> {
  const response = await api.get(`/treatment-reports/${report_uuid}`);
  return response.data;
}

export async function createReport(payload: ReportPayload): Promise<Report> {
  const response = await api.post(`/treatment-reports`, payload);
  return response.data;
}

export async function updateReport(
  report_uuid: string,
  payload: ReportUpdatePayload,
): Promise<Report> {
  const response = await api.patch(
    `/treatment-reports/${report_uuid}`,
    payload,
  );
  return response.data;
}

export async function createReportWithAi(
  treatment_uuid: string,
  payload: ReportWithAiPayload,
): Promise<Report> {
  const response = await api.post(
    `/treatment-reports/treatments/${treatment_uuid}/automated-report`,
    payload,
  );
  return response.data;
}
