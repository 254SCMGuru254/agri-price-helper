
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { KenyaAgriStatsService, AgriStatistic } from "@/services/KenyaAgriStatsService";

export function useAgriChartData() {
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');
  const [yearFilter, setYearFilter] = useState<number | null>(null);
  const [productFilter, setProductFilter] = useState<string | null>(null);

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['agriStats'],
    queryFn: KenyaAgriStatsService.fetchStats,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const processedData = useMemo(() => {
    if (!stats) return [];
    
    let filtered = [...stats];
    
    // Apply product filter
    if (productFilter) {
      filtered = filtered.filter(stat => stat.name === productFilter);
    }
    
    // Apply year filter
    if (yearFilter) {
      filtered = filtered.filter(stat => stat.year === yearFilter);
    }
    
    return filtered.sort((a, b) => a.year - b.year);
  }, [stats, productFilter, yearFilter]);

  const productionShare = useMemo(() => {
    if (!stats) return [];
    return KenyaAgriStatsService.calculateProductionShare(stats);
  }, [stats]);

  const yearlyGrowth = useMemo(() => {
    if (!stats) return [];
    return KenyaAgriStatsService.calculateYearlyGrowth(stats);
  }, [stats]);

  const productNames = useMemo(() => {
    if (!stats) return [];
    return KenyaAgriStatsService.getUniqueProductNames(stats);
  }, [stats]);

  const availableYears = useMemo(() => {
    if (!stats) return [];
    return Array.from(new Set(stats.map(s => s.year))).sort();
  }, [stats]);

  const handleResetFilters = () => {
    setYearFilter(null);
    setProductFilter(null);
    setChartType('line');
  };

  return {
    processedData,
    productionShare,
    yearlyGrowth,
    isLoading,
    error,
    chartType,
    setChartType,
    yearFilter,
    setYearFilter,
    productFilter,
    setProductFilter,
    productNames,
    availableYears,
    handleResetFilters
  };
}
