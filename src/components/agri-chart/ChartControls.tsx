
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, BarChart3, AreaChart } from "lucide-react";
import { useLanguage } from "@/components/LanguageContext";
import { Badge } from "@/components/ui/badge";

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
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <h2 className="text-2xl font-bold">
          {t('stats.timeSeriesTitle') || 'Agricultural Time Series'}
        </h2>
        
        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
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
      
      {/* Product Filter - More Prominent */}
      <div className="bg-muted p-3 rounded-lg">
        <div className="mb-2 font-medium">Select Crop/Product:</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Select 
            value={productFilter || "all-products"} 
            onValueChange={(value) => setProductFilter(value === "all-products" ? null : value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-products">All Products</SelectItem>
              {productNames.map(name => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Year Filter */}
          <Select 
            value={yearFilter?.toString() || "all-years"} 
            onValueChange={(value) => setYearFilter(value === "all-years" ? null : Number(value))}
          >
            <SelectTrigger className="w-full">
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
        
        {/* Active filters display */}
        <div className="flex flex-wrap gap-2 mt-3">
          {productFilter && (
            <Badge variant="outline" className="bg-primary/10">
              {productFilter}
              <button 
                className="ml-2 hover:text-destructive" 
                onClick={() => setProductFilter(null)}
              >
                ×
              </button>
            </Badge>
          )}
          {yearFilter && (
            <Badge variant="outline" className="bg-primary/10">
              Year: {yearFilter}
              <button 
                className="ml-2 hover:text-destructive" 
                onClick={() => setYearFilter(null)}
              >
                ×
              </button>
            </Badge>
          )}
          {(yearFilter || productFilter) && (
            <Button variant="ghost" size="sm" onClick={handleResetFilters} className="h-7">
              Reset Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
