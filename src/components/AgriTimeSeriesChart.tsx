import { Card } from "@/components/ui/card";
import { useLanguage } from "./LanguageContext";
import { useAgriChartData } from "./agri-chart/useAgriChartData";
import { ChartControls } from "./agri-chart/ChartControls";
import { ChartRenderer } from "./agri-chart/ChartRenderer";
import { ChartFooter } from "./agri-chart/ChartFooter";

export const AgriTimeSeriesChart = () => {
  // Feature removed: agricultural statistics not available
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Agricultural Statistics</h2>
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center text-muted-foreground">
          This feature is not available.
        </div>
      </div>
    </Card>
  );
};
