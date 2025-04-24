
import { useAgriChartData } from "./useAgriChartData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChartBarIcon, ChartPieIcon, Users } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const AgriAnalyticsDashboard = () => {
  const {
    processedData,
    productionShare,
    yearlyGrowth,
    isLoading,
    error
  } = useAgriChartData();
  
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <Card className="p-4 md:p-6 mb-8">
        <CardHeader className="pb-2">
          <CardTitle>Agricultural Analytics</CardTitle>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4 md:p-6 mb-8">
        <CardHeader className="pb-2">
          <CardTitle>Agricultural Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-destructive">Failed to load agricultural data</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-4 md:p-6 mb-8">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
          <ChartBarIcon className="h-5 w-5" />
          Agricultural Insights Dashboard
        </CardTitle>
        <p className="text-muted-foreground text-sm">Key metrics to support farming decisions, market analysis, and policy making</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="shadow-sm">
              <CardHeader className="py-3">
                <CardTitle className="text-base md:text-lg flex items-center gap-2">
                  <ChartPieIcon className="h-4 w-4" />
                  Crop Production Distribution
                </CardTitle>
                <p className="text-xs text-muted-foreground">Market share by crop type</p>
              </CardHeader>
              <CardContent className={`${isMobile ? 'h-[220px]' : 'h-[260px]'}`}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={productionShare}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={isMobile ? 60 : 80}
                      fill="#22c55e"
                      label={({ name, percent }) => 
                        `${name.split(' ')[0]}: ${(percent * 100).toFixed(0)}%`
                      }
                    />
                    <Tooltip 
                      formatter={(value) => [`${value.toLocaleString()} tons`, 'Production']}
                      labelFormatter={(name) => `Crop: ${name}`}
                    />
                    <Legend layout={isMobile ? "horizontal" : "vertical"} verticalAlign="bottom" align={isMobile ? "center" : "right"} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="py-3">
                <CardTitle className="text-base md:text-lg flex items-center gap-2">
                  <ChartBarIcon className="h-4 w-4" />
                  Annual Production Trends
                </CardTitle>
                <p className="text-xs text-muted-foreground">Yearly output for informed decision making</p>
              </CardHeader>
              <CardContent className={`${isMobile ? 'h-[220px]' : 'h-[260px]'}`}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={processedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value.toLocaleString()} tons`, 'Production']}
                      labelFormatter={(label) => `Year: ${label}`}
                    />
                    <Legend />
                    <Bar dataKey="value" name="Total Production" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm">
            <CardHeader className="py-3">
              <CardTitle className="text-base md:text-lg flex items-center gap-2">
                <Users className="h-4 w-4" />
                Crop Production Comparison
              </CardTitle>
              <p className="text-xs text-muted-foreground">Compare crop performance over time for optimal planting decisions</p>
            </CardHeader>
            <CardContent className="h-[260px] md:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yearlyGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value.toLocaleString()} tons`, 'Production']}
                    labelFormatter={(label) => `Year: ${label}`}
                  />
                  <Legend />
                  {Object.keys(yearlyGrowth[0] || {})
                    .filter(key => key !== 'year')
                    .slice(0, isMobile ? 3 : 5)  // Limit items on mobile
                    .map((key, index) => (
                      <Line 
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={`hsl(${index * 45 + 100}, 70%, 50%)`}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    ))}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
