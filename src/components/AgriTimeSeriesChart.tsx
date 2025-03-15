
import { useQuery } from "@tanstack/react-query";
import { KenyaAgriStatsService, AgriStatistic } from "@/services/KenyaAgriStatsService";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { useLanguage } from "./LanguageContext";

export const AgriTimeSeriesChart = () => {
  const { t } = useLanguage();
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['agriStats'],
    queryFn: KenyaAgriStatsService.fetchStats
  });

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

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        {t('stats.timeSeriesTitle') || 'Agricultural Time Series'}
      </h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={stats}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="year"
              label={{ value: 'Year', position: 'bottom' }}
            />
            <YAxis 
              label={{ 
                value: 'Value', 
                angle: -90, 
                position: 'insideLeft' 
              }} 
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              name="Agricultural Data"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
