import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchStats, fetchVoteSeries } from "./api";

export function useAdminStats() {
  return useQuery({
    queryKey: queryKeys.admin.stats(),
    queryFn: fetchStats,
  });
}

export function useVoteSeries(days = 14) {
  return useQuery({
    queryKey: queryKeys.admin.voteSeries(days),
    queryFn: () => fetchVoteSeries(days),
  });
}
