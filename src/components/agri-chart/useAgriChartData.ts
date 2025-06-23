import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

export function useAgriChartData() {
  // Stub: No agricultural statistics available
  return {
    chartType: 'line',
    setChartType: () => {},
    yearFilter: null,
    setYearFilter: () => {},
    productFilter: null,
    setProductFilter: () => {},
    processedData: [],
    productionShare: [],
    yearlyGrowth: [],
    productNames: [],
    availableYears: [],
    handleResetFilters: () => {},
    isLoading: false,
    error: null,
  };
}
