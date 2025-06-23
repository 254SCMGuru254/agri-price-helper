import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { RefreshCw, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface TrendAnalysisProps {
  farmerPrices: any[];
}

export const TrendAnalysis = ({ farmerPrices }: TrendAnalysisProps) => {
  const [apiPrices, setApiPrices] = useState<MarketPrice[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [comparisonData, setComparisonData] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchApiData = async () => {
    setLoading(true);
    try {
      const data = await KenyaAgriStatsService.fetchMarketPrices();
      setApiPrices(data);
      
      // Compare with farmer submitted prices
      const comparison = compareWithFarmerPrices(data, farmerPrices);
      setComparisonData(comparison);
      
      toast({
        title: "Data Updated",
        description: `Fetched ${data.length} official market prices for comparison`,
      });
    } catch (error) {
      console.error("Error fetching API data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch official market data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const compareWithFarmerPrices = (officialPrices: MarketPrice[], farmerSubmitted: any[]) => {
    const comparison: any[] = [];
    
    officialPrices.forEach(officialPrice => {
      const matchingFarmerPrices = farmerSubmitted.filter(
        fp => fp.commodity.toLowerCase() === officialPrice.commodity.toLowerCase() &&
              fp.location.toLowerCase() === officialPrice.location.toLowerCase()
      );
      
      if (matchingFarmerPrices.length > 0) {
        const avgFarmerPrice = matchingFarmerPrices.reduce((sum, fp) => sum + fp.price, 0) / matchingFarmerPrices.length;
        const priceDifference = ((avgFarmerPrice - officialPrice.price) / officialPrice.price) * 100;
        
        comparison.push({
          commodity: officialPrice.commodity,
          location: officialPrice.location,
          officialPrice: officialPrice.price,
          farmerPrice: avgFarmerPrice,
          difference: priceDifference,
          farmerSubmissions: matchingFarmerPrices.length,
          unit: officialPrice.unit,
          date: officialPrice.date
        });
      }
    });
    
    return comparison;
  };

  useEffect(() => {
    fetchApiData();
  }, []);

  const filteredData = comparisonData.filter(item => {
    const cropMatch = selectedCrop === "all" || item.commodity.toLowerCase().includes(selectedCrop.toLowerCase());
    const locationMatch = selectedLocation === "all" || item.location.toLowerCase().includes(selectedLocation.toLowerCase());
    return cropMatch && locationMatch;
  });

  const crops = Array.from(new Set(comparisonData.map(item => item.commodity)));
  const locations = Array.from(new Set(comparisonData.map(item => item.location)));

  const getVarianceIcon = (difference: number) => {
    if (Math.abs(difference) > 20) return <AlertTriangle className="h-4 w-4 text-red-500" />;
    if (difference > 5) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (difference < -5) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <div className="h-4 w-4 rounded-full bg-yellow-500" />;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Price Trend Analysis</h3>
          <Button onClick={fetchApiData} disabled={loading} size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Select value={selectedCrop} onValueChange={setSelectedCrop}>
            <SelectTrigger>
              <SelectValue placeholder="Select crop" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Crops</SelectItem>
              {crops.map(crop => (
                <SelectItem key={crop} value={crop}>{crop}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map(location => (
                <SelectItem key={location} value={location}>{location}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="text-sm text-muted-foreground flex items-center">
            <div className="flex items-center space-x-2">
              <span>Data Points: {filteredData.length}</span>
            </div>
          </div>
        </div>

        {filteredData.length > 0 ? (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="commodity" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    `${value} KES`,
                    name === 'officialPrice' ? 'Official Price' : 'Farmer Average Price'
                  ]}
                />
                <Legend />
                <Bar dataKey="officialPrice" fill="#8884d8" name="Official Price" />
                <Bar dataKey="farmerPrice" fill="#82ca9d" name="Farmer Price" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            {loading ? "Loading price comparison data..." : "No comparison data available for selected filters"}
          </div>
        )}
      </Card>

      {filteredData.length > 0 && (
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4">Price Variance Analysis</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {filteredData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getVarianceIcon(item.difference)}
                  <div>
                    <span className="font-medium">{item.commodity}</span>
                    <span className="text-sm text-muted-foreground ml-2">({item.location})</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm">
                    Official: {item.officialPrice} KES | Farmer Avg: {Math.round(item.farmerPrice)} KES
                  </div>
                  <div className={`text-sm font-medium ${item.difference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.difference > 0 ? '+' : ''}{item.difference.toFixed(1)}% variance
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
