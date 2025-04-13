
import { useQuery } from "@tanstack/react-query";
import { KenyaAgriStatsService, AgriStatistic } from "@/services/KenyaAgriStatsService";
import { Card } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { useState } from "react";
import { useLanguage } from "./LanguageContext";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart3, LineChart as LineChartIcon, AreaChart as AreaChartIcon, Filter } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const AgriTimeSeriesChart = () => {
  const { t } = useLanguage();
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

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-500">
          {t('errors.failedToLoadStats') || 'Failed to load agricultural statistics'}
        </div>
      </Card>
    );
  }

  const handleResetFilters = () => {
    setYearFilter(null);
    setProductFilter(null);
  };

  // Custom tooltip formatter for displaying values properly
  const formatTooltip = (value: number) => {
    return value.toLocaleString();
  };

  // Format label for tooltip
  const formatLabel = (label: any) => {
    return `Year: ${label}`;
  };

  const renderChart = () => {
    const config = {
      value: {
        theme: {
          light: "#22c55e",
          dark: "#4ade80"
        }
      }
    };

    const commonProps = {
      data: processedData,
      margin: { top: 10, right: 30, left: 20, bottom: 40 }
    };

    const tooltipProps = {
      formatter: formatTooltip,
      labelFormatter: formatLabel
    };

    const axisProps = {
      xAxis: <XAxis 
        dataKey="year"
        label={{ value: 'Year', position: 'bottom', offset: 0 }}
      />,
      yAxis: <YAxis 
        label={{ 
          value: 'Value', 
          angle: -90, 
          position: 'insideLeft',
          offset: 10
        }} 
      />,
      cartesianGrid: <CartesianGrid strokeDasharray="3 3" />,
      tooltip: <Tooltip 
        formatter={formatTooltip}
        labelFormatter={formatLabel}
      />,
      legend: <Legend />
    };

    switch (chartType) {
      case 'line':
        return (
          <ChartContainer config={config}>
            <LineChart {...commonProps}>
              {axisProps.cartesianGrid}
              {axisProps.xAxis}
              {axisProps.yAxis}
              {axisProps.tooltip}
              {axisProps.legend}
              <Line
                type="monotone"
                dataKey="value"
                name={productFilter || (t('stats.agriculturalData') || 'Agricultural Data')}
                stroke="var(--color-value)"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ChartContainer>
        );
      case 'bar':
        return (
          <ChartContainer config={config}>
            <BarChart {...commonProps}>
              {axisProps.cartesianGrid}
              {axisProps.xAxis}
              {axisProps.yAxis}
              {axisProps.tooltip}
              {axisProps.legend}
              <Bar
                dataKey="value"
                name={productFilter || (t('stats.agriculturalData') || 'Agricultural Data')}
                fill="var(--color-value)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        );
      case 'area':
        return (
          <ChartContainer config={config}>
            <AreaChart {...commonProps}>
              {axisProps.cartesianGrid}
              {axisProps.xAxis}
              {axisProps.yAxis}
              {axisProps.tooltip}
              {axisProps.legend}
              <Area
                type="monotone"
                dataKey="value"
                name={productFilter || (t('stats.agriculturalData') || 'Agricultural Data')}
                stroke="var(--color-value)"
                fill="var(--color-value)"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ChartContainer>
        );
    }
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">
          {t('stats.timeSeriesTitle') || 'Agricultural Time Series'}
        </h2>
        
        <div className="flex flex-col md:flex-row gap-4 mt-2 md:mt-0">
          {/* Product Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <Select 
              value={productFilter || ''} 
              onValueChange={(value) => setProductFilter(value || null)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Products</SelectItem>
                {productNames.map(name => (
                  <SelectItem key={name} value={name}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Year Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <Select 
              value={yearFilter?.toString() || ''} 
              onValueChange={(value) => setYearFilter(value ? Number(value) : null)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Years</SelectItem>
                {availableYears.map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Reset button */}
          {(yearFilter || productFilter) && (
            <Button variant="ghost" size="sm" onClick={handleResetFilters}>
              Reset Filters
            </Button>
          )}
          
          {/* Chart type selector */}
          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant={chartType === 'line' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChartType('line')}
              className="rounded-none"
            >
              <LineChartIcon className="h-4 w-4 mr-2" />
              Line
            </Button>
            <Button
              variant={chartType === 'bar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChartType('bar')}
              className="rounded-none"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Bar
            </Button>
            <Button
              variant={chartType === 'area' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChartType('area')}
              className="rounded-none"
            >
              <AreaChartIcon className="h-4 w-4 mr-2" />
              Area
            </Button>
          </div>
        </div>
      </div>
      
      <div className="h-[400px] mt-4">
        {renderChart()}
      </div>
      
      <div className="mt-4 text-xs text-muted-foreground">
        <p>
          {t('stats.dataSource') || 'Data Source'}: Kenya Agricultural Statistics
        </p>
        <p>
          {t('stats.lastUpdated') || 'Last Updated'}: {new Date().toLocaleDateString()}
        </p>
      </div>
    </Card>
  );
};
