import { useAgriChartData } from "./useAgriChartData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { ChartBarIcon, ChartPieIcon, Users, AlertTriangle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMarketPrices } from "@/hooks/useMarketPrices";
import { Alert, AlertDescription } from "@/components/ui/alert";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const AgriAnalyticsDashboard = () => {
  const {
    processedData,
    productionShare,
    yearlyGrowth,
    isLoading: chartsLoading,
    error: chartsError
  } = useAgriChartData();
  
  const { filteredPrices, loading: pricesLoading } = useMarketPrices();
  const isMobile = useIsMobile();

  const isLoading = chartsLoading || pricesLoading;
  const hasError = chartsError;
  const hasData = processedData.length > 0 || filteredPrices.length > 0;

  // Process real market data for charts
  const marketDataByLocation = filteredPrices.reduce((acc, price) => {
    const location = price.location || 'Unknown';
    if (!acc[location]) {
      acc[location] = { location, totalValue: 0, count: 0 };
    }
    acc[location].totalValue += price.price;
    acc[location].count += 1;
    return acc;
  }, {} as Record<string, { location: string; totalValue: number; count: number }>);

  const locationData = Object.values(marketDataByLocation).map(item => ({
    name: item.location,
    value: Math.round(item.totalValue / item.count), // Average price
    count: item.count
  })).slice(0, 8); // Limit to top 8 locations

  const commodityData = filteredPrices.reduce((acc, price) => {
    const commodity = price.commodity || 'Unknown';
    if (!acc[commodity]) {
      acc[commodity] = { commodity, totalValue: 0, count: 0, avgPrice: 0 };
    }
    acc[commodity].totalValue += price.price;
    acc[commodity].count += 1;
    acc[commodity].avgPrice = acc[commodity].totalValue / acc[commodity].count;
    return acc;
  }, {} as Record<string, { commodity: string; totalValue: number; count: number; avgPrice: number }>);

  const topCommodities = Object.values(commodityData)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
    .map(item => ({
      name: item.commodity,
      submissions: item.count,
      avgPrice: Math.round(item.avgPrice)
    }));

  if (isLoading) {
    return (
      <Card className="p-4 md:p-6 mb-8">
        <CardHeader className="pb-2">
          <CardTitle>Agricultural Insights Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (hasError) {
    return (
      <Card className="p-4 md:p-6 mb-8">
        <CardHeader className="pb-2">
          <CardTitle>Agricultural Insights Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Unable to load agricultural statistics. Displaying available market data only.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!hasData) {
    return (
      <Card className="p-4 md:p-6 mb-8">
        <CardHeader className="pb-2">
          <CardTitle>Agricultural Insights Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              No real market data available yet. Submit market prices to see analytics.
            </AlertDescription>
          </Alert>
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
        <p className="text-muted-foreground text-sm">Real market data from farmers and verified sources</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {locationData.length > 0 && (
              <Card className="shadow-sm">
                <CardHeader className="py-3">
                  <CardTitle className="text-base md:text-lg flex items-center gap-2">
                    <ChartPieIcon className="h-4 w-4" />
                    Market Activity by Location
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">Average prices by region</p>
                </CardHeader>
                <CardContent className={`${isMobile ? 'h-[220px]' : 'h-[260px]'}`}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={locationData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={isMobile ? 60 : 80}
                        label={({ name, value }) => 
                          `${name.split(' ')[0]}: ${value} KES`
                        }
                      >
                        {locationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name) => [`${value} KES (avg)`, 'Average Price']}
                        labelFormatter={(name) => `Location: ${name}`}
                      />
                      <Legend layout={isMobile ? "horizontal" : "vertical"} verticalAlign="bottom" align={isMobile ? "center" : "right"} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {topCommodities.length > 0 && (
              <Card className="shadow-sm">
                <CardHeader className="py-3">
                  <CardTitle className="text-base md:text-lg flex items-center gap-2">
                    <ChartBarIcon className="h-4 w-4" />
                    Top Commodities by Submissions
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">Most actively traded commodities</p>
                </CardHeader>
                <CardContent className={`${isMobile ? 'h-[220px]' : 'h-[260px]'}`}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topCommodities}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        fontSize={10}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [
                          name === 'submissions' ? `${value} submissions` : `${value} KES`,
                          name === 'submissions' ? 'Market Submissions' : 'Average Price'
                        ]}
                        labelFormatter={(label) => `Commodity: ${label}`}
                      />
                      <Legend />
                      <Bar dataKey="submissions" name="Submissions" fill="#22c55e" />
                      <Bar dataKey="avgPrice" name="Avg Price (KES)" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>

          {processedData.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="py-3">
                <CardTitle className="text-base md:text-lg flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Historical Agricultural Data
                </CardTitle>
                <p className="text-xs text-muted-foreground">Official statistics from Kenya Bureau of Statistics</p>
              </CardHeader>
              <CardContent className="h-[260px] md:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={yearlyGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value?.toLocaleString()} tons`, 'Production']}
                      labelFormatter={(label) => `Year: ${label}`}
                    />
                    <Legend />
                    {Object.keys(yearlyGrowth[0] || {})
                      .filter(key => key !== 'year')
                      .slice(0, isMobile ? 3 : 5)
                      .map((key, index) => (
                        <Line 
                          key={key}
                          type="monotone"
                          dataKey={key}
                          stroke={COLORS[index % COLORS.length]}
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                      ))}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          <div className="text-xs text-muted-foreground border-t pt-4">
            <p><strong>Data Sources:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Real-time market prices from farmer submissions</li>
              <li>Kenya Bureau of Statistics agricultural data</li>
              <li>Ministry of Agriculture verified prices</li>
              <li>Only verified and validated data is displayed</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
