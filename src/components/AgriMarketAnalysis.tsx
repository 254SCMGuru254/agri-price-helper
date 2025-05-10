
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { MCPDataService, type MCPServerData } from "@/services/MCPDataService";
import { LangChainService, type AnalysisResult } from "@/services/LangChainService";
import { AlertTriangle, TrendingUp, TrendingDown, Compass, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const AgriMarketAnalysis = () => {
  const [cropData, setCropData] = useState<MCPServerData[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<string>("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("market-data");

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await MCPDataService.fetchCropData();
        setCropData(data);
        
        if (data.length > 0 && !selectedCrop) {
          setSelectedCrop(data[0].cropName);
          const analysisResult = await LangChainService.analyzeMarketTrends(data[0].cropName);
          setAnalysis(analysisResult);
        }
      } catch (error) {
        console.error("Error fetching market data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCropChange = async (cropName: string) => {
    setSelectedCrop(cropName);
    setIsLoading(true);
    
    try {
      const analysisResult = await LangChainService.analyzeMarketTrends(cropName);
      setAnalysis(analysisResult);
    } catch (error) {
      console.error("Error analyzing crop:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate market demand distribution
  const marketDemandData = [
    { name: 'High Demand', value: cropData.filter(c => c.marketDemand === 'high').length },
    { name: 'Medium Demand', value: cropData.filter(c => c.marketDemand === 'medium').length },
    { name: 'Low Demand', value: cropData.filter(c => c.marketDemand === 'low').length }
  ].filter(item => item.value > 0);

  // Format price data for charts
  const priceComparisonData = cropData.map(crop => ({
    name: crop.cropName,
    currentPrice: crop.currentPrice,
    forecastPrice: crop.forecastPrice,
    accuracy: crop.forecastAccuracy,
  })).slice(0, 10); // Limit to 10 crops for readability

  // Get trend icon
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising':
        return <TrendingUp className="text-green-500" />;
      case 'falling':
        return <TrendingDown className="text-red-500" />;
      default:
        return <Compass className="text-blue-500" />;
    }
  };

  if (isLoading && cropData.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Agricultural Market Analysis</h2>
        <Card className="p-6">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-slate-200 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                  <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Agricultural Market Analysis</h2>
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">Select Crop:</p>
          <Select 
            value={selectedCrop} 
            onValueChange={handleCropChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select crop" />
            </SelectTrigger>
            <SelectContent>
              {cropData.map((crop) => (
                <SelectItem key={crop.cropId} value={crop.cropName}>
                  {crop.cropName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="market-data">Market Data</TabsTrigger>
          <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="forecast">Price Forecast</TabsTrigger>
        </TabsList>

        <TabsContent value="market-data">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3">Price Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={priceComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="currentPrice" fill="#4f46e5" name="Current Price" />
                  <Bar dataKey="forecastPrice" fill="#10b981" name="Forecast Price" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3">Market Demand Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={marketDemandData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {marketDemandData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card className="p-4 mt-4">
            <h3 className="text-lg font-semibold mb-3">Market Trends by Crop</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {cropData.slice(0, 6).map((crop) => (
                <div key={crop.cropId} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{crop.cropName}</h4>
                    {getTrendIcon(crop.seasonalTrend)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Region: {crop.region}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant={crop.marketDemand === 'high' ? "default" : crop.marketDemand === 'medium' ? "secondary" : "outline"}>
                      {crop.marketDemand.charAt(0).toUpperCase() + crop.marketDemand.slice(1)} Demand
                    </Badge>
                    <p className="text-sm font-medium">
                      {crop.currentPrice.toFixed(2)} KES/kg
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="analysis">
          <Card className="p-4">
            {analysis ? (
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <BrainCircuit className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold">AI Market Analysis for {selectedCrop}</h3>
                    <p className="text-muted-foreground">
                      Confidence Score: {analysis.confidenceScore.toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-muted rounded-lg">
                  <p>{analysis.summary}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Recommendations</h4>
                    <ul className="space-y-2">
                      {analysis.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-green-500 font-bold">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Risk Factors</h4>
                    <ul className="space-y-2">
                      {analysis.riskFactors.map((risk, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium mb-2">Market Insights</h4>
                  <p>{analysis.marketInsights}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-40">
                <p>Select a crop to view AI analysis</p>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="forecast">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3">Price Forecast Accuracy</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={priceComparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#4f46e5" />
                <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="currentPrice" stroke="#4f46e5" name="Current Price" />
                <Line yAxisId="left" type="monotone" dataKey="forecastPrice" stroke="#10b981" name="Forecast Price" />
                <Line yAxisId="right" type="monotone" dataKey="accuracy" stroke="#8884d8" name="Forecast Accuracy %" />
              </LineChart>
            </ResponsiveContainer>
            
            <div className="mt-4">
              <h4 className="font-medium mb-2">Forecasting Method</h4>
              <p className="text-sm text-muted-foreground">
                Our advanced AI model combines historical pricing data, seasonal trends, weather forecasts, 
                and global market indicators to predict future price movements with high accuracy.
                The model is continuously trained on real market data from Kenya's agricultural sector.
              </p>
              
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm">
                  Export Forecast Data
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
