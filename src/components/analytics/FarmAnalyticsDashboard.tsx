import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, BarChart } from '@/components/ui/chart';
import { FarmAnalyticsService, FarmAnalytics } from '@/services/analytics/FarmAnalyticsService';
import { useAuth } from '@/components/AuthProvider';
import { TrendingUp, Sprout, BarChart as BarChartIcon, Droplets } from 'lucide-react';

export const FarmAnalyticsDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<FarmAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return;
      
      try {
        const [margins, yields, trends, usage] = await Promise.all([
          FarmAnalyticsService.getProfitMargins(user.id),
          FarmAnalyticsService.getYieldPredictions(user.id),
          FarmAnalyticsService.getMarketTrends(),
          FarmAnalyticsService.getResourceUsage(user.id)
        ]);

        setAnalytics({
          profitMargins: margins,
          yieldPredictions: yields,
          marketTrends: trends,
          resourceUsage: usage
        });
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [user]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">No analytics data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Farm Analytics Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="profits" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profits">
              <TrendingUp className="h-4 w-4 mr-2" />
              Profits
            </TabsTrigger>
            <TabsTrigger value="yields">
              <Sprout className="h-4 w-4 mr-2" />
              Yields
            </TabsTrigger>
            <TabsTrigger value="market">
              <BarChartIcon className="h-4 w-4 mr-2" />
              Market
            </TabsTrigger>
            <TabsTrigger value="resources">
              <Droplets className="h-4 w-4 mr-2" />
              Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profits" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Profit Margins</h3>
                    <div className={`flex items-center ${
                      analytics.profitMargins.trend === 'up' ? 'text-green-500' :
                      analytics.profitMargins.trend === 'down' ? 'text-red-500' :
                      'text-yellow-500'
                    }`}>
                      {analytics.profitMargins.trend === 'up' ? '↑' :
                       analytics.profitMargins.trend === 'down' ? '↓' : '→'}
                      {analytics.profitMargins.current.toFixed(1)}%
                    </div>
                  </div>
                  <LineChart
                    data={{
                      labels: ['Previous', 'Current'],
                      datasets: [{
                        label: 'Profit Margin %',
                        data: [analytics.profitMargins.previous, analytics.profitMargins.current]
                      }]
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="yields" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Yield Predictions</h3>
                  <div className="grid gap-4">
                    {analytics.yieldPredictions.map((prediction, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{prediction.crop}</p>
                          <p className="text-sm text-muted-foreground">
                            Confidence: {(prediction.confidence * 100).toFixed(0)}%
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{prediction.predictedYield.toFixed(1)} kg/acre</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="market" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Market Trends</h3>
                  <BarChart
                    data={{
                      labels: analytics.marketTrends.map(trend => trend.commodity),
                      datasets: [{
                        label: 'Price Change %',
                        data: analytics.marketTrends.map(trend => trend.priceChange)
                      }]
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Resource Usage vs Benchmarks</h3>
                  <div className="grid gap-4">
                    {analytics.resourceUsage.map((resource, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <p className="font-medium">{resource.category}</p>
                          <p className="text-sm text-muted-foreground">
                            {resource.usage} vs {resource.benchmark} (benchmark)
                          </p>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              resource.usage <= resource.benchmark ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            style={{
                              width: `${Math.min(100, (resource.usage / resource.benchmark) * 100)}%`
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}; 