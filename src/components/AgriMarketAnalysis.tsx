
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketPrices } from "./MarketPrices";
import { TrendAnalysis } from "./market-prices/TrendAnalysis";
import { useMarketPrices } from "@/hooks/useMarketPrices";
import { Card } from "@/components/ui/card";
import { TrendingUp, BarChart3, Map } from "lucide-react";

export const AgriMarketAnalysis = () => {
  const { prices } = useMarketPrices();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">Agricultural Market Analysis</h2>
        <p className="text-muted-foreground mt-2">
          Real-time market prices, trends, and farmer-submitted data comparison
        </p>
      </div>

      <Tabs defaultValue="prices" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="prices" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            Market Prices
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Price Trends
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics Dashboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="prices" className="space-y-4">
          <MarketPrices />
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <TrendAnalysis farmerPrices={prices} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Tableau Analytics Integration</h3>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h4 className="text-lg font-semibold mb-2">Advanced Analytics Coming Soon</h4>
                <p className="text-muted-foreground">
                  Interactive Tableau dashboards for deep agricultural data analysis
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
