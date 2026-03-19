import { api } from "./axios";
import type { DashboardStatistics, DashboardParams } from "../types/dashboard";

export async function getDashboardStatistics(
  params?: DashboardParams,
): Promise<DashboardStatistics> {
  const response = await api.get<DashboardStatistics>(
    "/dashboard/statistics",
    { params },
  );
  return response.data;
}
