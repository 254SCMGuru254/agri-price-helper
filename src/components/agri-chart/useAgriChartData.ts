
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { KenyaAgriStatsService } from "@/services/KenyaAgriStatsService";

export function useAgriChartData() {
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');
  const [yearFilter, setYearFilter] = useState<number | null>(null);
  const [productFilter, setProductFilter] = useState<string | null>(null);
  
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['agriStats'],
    queryFn: KenyaAgriStatsService.fetchStats,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
    retry: 3, // Retry 3 times on failure
  });

  // Get unique product names for the filter
  const productNames = useMemo(() => {
    if (!stats) return [];
    return KenyaAgriStatsService.getUniqueProductNames(stats);
  }, [stats]);

  // Process data for better visualization
  const processedData = useMemo(() => {
    if (!stats) return [];
    
    // First apply product filter if set
    let filteredStats = stats;
    if (productFilter) {
      filteredStats = KenyaAgriStatsService.filterStatsByProduct(filteredStats, productFilter);
    }
    
    // Then apply year filter if set
    if (yearFilter) {
      filteredStats = filteredStats.filter(item => item.year === yearFilter);
    }
    
    // Sort by year for better timeline view
    return [...filteredStats].sort((a, b) => a.year - b.year);
  }, [stats, yearFilter, productFilter]);

  // Get unique years for filter
  const availableYears = useMemo(() => {
    if (!stats) return [];
    const years = Array.from(new Set(stats.map(item => item.year))).sort();
    return years;
  }, [stats]);

  const handleResetFilters = () => {
    setYearFilter(null);
    setProductFilter(null);
  };

  return {
    chartType,
    setChartType,
    yearFilter,
    setYearFilter,
    productFilter,
    setProductFilter,
    productNames,
    processedData,
    availableYears,
    stats,
    isLoading,
    error,
    handleResetFilters
  };
}
