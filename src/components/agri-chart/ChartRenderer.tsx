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
import { ChartContainer } from "@/components/ui/chart";
import { useLanguage } from "@/components/LanguageContext";

interface ChartRendererProps {
  chartType: 'line' | 'bar' | 'area';
  processedData: any[];
  productFilter: string | null;
}

export const ChartRenderer = ({ 
  chartType, 
  processedData, 
  productFilter 
}: ChartRendererProps) => {
  const { t } = useLanguage();
  
  // Custom tooltip formatter for displaying values properly
  const formatTooltip = (value: number) => {
    return value.toLocaleString();
  };

  // Format label for tooltip
  const formatLabel = (label: any) => {
    return `Year: ${label}`;
  };

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

  const axisProps = {
    xAxis: <XAxis 
      dataKey="year"
      label={{ value: 'Year', position: 'bottom', offset: 0 }}
    />,
    yAxis: <YAxis 
      label={{ 
        value: productFilter ? `${productFilter} (units)` : 'Value', 
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

  const getChartTitle = () => {
    if (productFilter) {
      return `${productFilter} (2019-2024)`;
    }
    return t('stats.agriculturalData') || 'Agricultural Data';
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
              name={getChartTitle()}
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
              name={getChartTitle()}
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
              name={getChartTitle()}
              stroke="var(--color-value)"
              fill="var(--color-value)"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ChartContainer>
      );
    default:
      return null;
  }
};
