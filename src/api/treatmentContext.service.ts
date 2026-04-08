import { api } from "./axios";
import { type TreatmentContext, type TreatmentContextWithDraft, type TreatmentContextUpdatePayload, type TreatmentContextGeneratePayload } from "../types/treatmentContext";

export async function generateContext(
  treatmentUuid: string,
  payload: TreatmentContextGeneratePayload,
): Promise<TreatmentContext> {
  const response = await api.post(
    `/treatment-contexts/treatment/${treatmentUuid}/generate`,
    payload,
  );
  return response.data;
}

export async function getContextWithDraft(
  treatmentUuid: string,
): Promise<TreatmentContextWithDraft> {
  const response = await api.get(`/treatment-contexts/treatment/${treatmentUuid}`);
  return response.data;
}

export async function updateContext(
  treatmentUuid: string,
  payload: TreatmentContextUpdatePayload,
): Promise<TreatmentContext> {
  const response = await api.patch(
    `/treatment-contexts/treatment/${treatmentUuid}`,
    payload,
  );
  return response.data;
}

export async function applyDraft(
  draftUuid: string,
  payload: TreatmentContextUpdatePayload,
): Promise<TreatmentContext> {
  const response = await api.post(
    `/treatment-contexts/draft/${draftUuid}/apply`,
    payload,
  );
  return response.data;
}

export async function rejectDraft(draftUuid: string): Promise<void> {
  await api.post(`/treatment-contexts/draft/${draftUuid}/reject`);
}
