
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { KenyaAgriStatsService } from "@/services/KenyaAgriStatsService";

export function useAgriChartData() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['agriStats'],
    queryFn: KenyaAgriStatsService.fetchStats,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const processedData = useMemo(() => {
    if (!stats) return [];
    return [...stats].sort((a, b) => a.year - b.year);
  }, [stats]);

  const productionShare = useMemo(() => {
    if (!stats) return [];
    return KenyaAgriStatsService.calculateProductionShare(stats);
  }, [stats]);

  const yearlyGrowth = useMemo(() => {
    if (!stats) return [];
    return KenyaAgriStatsService.calculateYearlyGrowth(stats);
  }, [stats]);

  return {
    processedData,
    productionShare,
    yearlyGrowth,
    isLoading,
    error,
  };
}
