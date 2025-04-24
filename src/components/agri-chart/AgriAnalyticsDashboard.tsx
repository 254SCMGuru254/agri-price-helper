
import { useAgriChartData } from "./useAgriChartData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Farmers, Users, LineChart as ChartIcon } from "lucide-react";

export const AgriAnalyticsDashboard = () => {
  const {
    processedData,
    productionShare,
    yearlyGrowth,
    isLoading,
    error
  } = useAgriChartData();

  if (isLoading) {
    return (
      <Card className="p-6">
        <CardHeader>
          <CardTitle>Agricultural Analytics Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <CardHeader>
          <CardTitle>Agricultural Analytics Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-destructive">Failed to load agricultural data</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChartIcon className="h-6 w-6" />
          Agricultural Analytics Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="farmers">For Farmers</TabsTrigger>
            <TabsTrigger value="buyers">For Buyers</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Production Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={productionShare}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="var(--color-value)"
                        label
                      />
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Production Trends</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={yearlyGrowth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {Object.keys(yearlyGrowth[0] || {})
                        .filter(key => key !== 'year')
                        .map((key, index) => (
                          <Line 
                            key={key}
                            type="monotone"
                            dataKey={key}
                            stroke={`hsl(${index * 45}, 70%, 50%)`}
                          />
                        ))}
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="farmers" className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <Farmers className="h-5 w-5" />
                  <CardTitle className="text-lg">Crop Performance Analysis</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={processedData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Production" fill="var(--color-value)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="buyers" className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <Users className="h-5 w-5" />
                  <CardTitle className="text-lg">Supply Trends</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={yearlyGrowth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {Object.keys(yearlyGrowth[0] || {})
                        .filter(key => key !== 'year')
                        .map((key, index) => (
                          <Line 
                            key={key}
                            type="monotone"
                            dataKey={key}
                            stroke={`hsl(${index * 45}, 70%, 50%)`}
                            strokeWidth={2}
                          />
                        ))}
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
