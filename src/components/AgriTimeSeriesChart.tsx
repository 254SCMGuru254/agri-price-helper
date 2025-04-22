
import { Card } from "@/components/ui/card";
import { useLanguage } from "./LanguageContext";
import { useAgriChartData } from "./agri-chart/useAgriChartData";
import { ChartControls } from "./agri-chart/ChartControls";
import { ChartRenderer } from "./agri-chart/ChartRenderer";
import { ChartFooter } from "./agri-chart/ChartFooter";

export const AgriTimeSeriesChart = () => {
  const { t } = useLanguage();
  const {
    chartType,
    setChartType,
    yearFilter,
    setYearFilter,
    productFilter,
    setProductFilter,
    productNames,
    processedData,
    availableYears,
    isLoading,
    error,
    handleResetFilters
  } = useAgriChartData();

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

  // No data after filtering
  if (processedData.length === 0) {
    return (
      <Card className="p-6">
        <ChartControls 
          chartType={chartType}
          setChartType={setChartType}
          yearFilter={yearFilter}
          setYearFilter={setYearFilter}
          productFilter={productFilter}
          setProductFilter={setProductFilter}
          availableYears={availableYears}
          productNames={productNames}
          handleResetFilters={handleResetFilters}
        />
        <div className="flex items-center justify-center h-[400px]">
          <div className="text-center text-muted-foreground">
            {t('stats.noDataAvailable') || 'No data available for the selected filters'}
          </div>
        </div>
        <ChartFooter />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <ChartControls 
        chartType={chartType}
        setChartType={setChartType}
        yearFilter={yearFilter}
        setYearFilter={setYearFilter}
        productFilter={productFilter}
        setProductFilter={setProductFilter}
        availableYears={availableYears}
        productNames={productNames}
        handleResetFilters={handleResetFilters}
      />
      
      <div className="h-[400px] mt-4">
        <ChartRenderer 
          chartType={chartType}
          processedData={processedData}
          productFilter={productFilter}
        />
      </div>
      
      <ChartFooter />
    </Card>
  );
};
