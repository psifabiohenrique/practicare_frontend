export interface DashboardStatistics {
  // Token usage
  total_input_tokens: number;
  total_output_tokens: number;

  // Audio durations (in seconds)
  total_audio_duration: number;
  total_audio_duration_after_vad: number;

  // Process counts (from usage_statistics in period)
  total_transcriptions: number;
  total_records_generated: number;
  total_reports_generated: number;

  // Entity counts
  active_treatments_count: number;

  // Entity counts (period-filtered)
  records_count: number;
  reports_count: number;

  // Period
  start_date: string;
  end_date: string;
}

export interface DashboardParams {
  start_date?: string;
  end_date?: string;
}
