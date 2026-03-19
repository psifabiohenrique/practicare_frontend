import { useState, useEffect, useCallback } from "react";
import { getDashboardStatistics } from "../api/dashboard.service";
import type { DashboardStatistics, DashboardParams } from "../types/dashboard";

export function useDashboard(params?: DashboardParams) {
  const [data, setData] = useState<DashboardStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchDashboard = useCallback(async (fetchParams?: DashboardParams) => {
    try {
      setIsLoading(true);
      setError(null);
      const stats = await getDashboardStatistics(fetchParams);
      setData(stats);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard(params);
  }, [params?.start_date, params?.end_date]);

  return { data, isLoading, error, refetch: fetchDashboard };
}
