
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, BarChart3, AreaChart } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";

interface ChartControlsProps {
  chartType: 'line' | 'bar' | 'area';
  setChartType: (type: 'line' | 'bar' | 'area') => void;
  yearFilter: number | null;
  setYearFilter: (year: number | null) => void;
  productFilter: string | null;
  setProductFilter: (product: string | null) => void;
  availableYears: number[];
  productNames: string[];
  handleResetFilters: () => void;
}

export const ChartControls = ({
  chartType,
  setChartType,
  yearFilter,
  setYearFilter,
  productFilter,
  setProductFilter,
  availableYears,
  productNames,
  handleResetFilters
}: ChartControlsProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
      <h2 className="text-2xl font-bold">
        {t('stats.timeSeriesTitle') || 'Agricultural Time Series'}
      </h2>
      
      <div className="flex flex-col md:flex-row gap-4 mt-2 md:mt-0">
        {/* Product Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <Select 
            value={productFilter || "all-products"} 
            onValueChange={(value) => setProductFilter(value === "all-products" ? null : value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-products">All Products</SelectItem>
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
            value={yearFilter?.toString() || "all-years"} 
            onValueChange={(value) => setYearFilter(value === "all-years" ? null : Number(value))}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-years">All Years</SelectItem>
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
            <LineChart className="h-4 w-4 mr-2" />
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
            <AreaChart className="h-4 w-4 mr-2" />
            Area
          </Button>
        </div>
      </div>
    </div>
  );
};
