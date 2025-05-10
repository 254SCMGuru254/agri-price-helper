
import { supabase } from "@/integrations/supabase/client";

export interface MCPServerData {
  cropId: string;
  cropName: string;
  currentPrice: number;
  historicalPrices: {
    date: string;
    price: number;
  }[];
  forecastPrice: number;
  forecastAccuracy: number;
  seasonalTrend: 'rising' | 'falling' | 'stable';
  marketDemand: 'high' | 'medium' | 'low';
  regionId: string;
  region: string;
}

export class MCPDataService {
  static async fetchCropData(cropId?: string): Promise<MCPServerData[]> {
    try {
      // Fetch from market_prices table
      const { data: priceData, error: priceError } = await supabase
        .from('market_prices')
        .select('*')
        .order('created_at', { ascending: false });

      if (priceError) throw priceError;

      // Process the data to conform to MCPServerData format
      // In a real implementation, this would connect to an actual MCP server
      const processedData: MCPServerData[] = priceData.map(price => {
        return {
          cropId: price.id,
          cropName: price.commodity,
          currentPrice: price.price,
          historicalPrices: [
            { date: new Date(price.created_at).toISOString(), price: price.price }
          ],
          forecastPrice: price.price * (1 + (Math.random() * 0.2 - 0.1)), // Random forecast within ±10%
          forecastAccuracy: 75 + Math.random() * 15, // Random accuracy between 75-90%
          seasonalTrend: ['rising', 'falling', 'stable'][Math.floor(Math.random() * 3)] as 'rising' | 'falling' | 'stable',
          marketDemand: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
          regionId: price.location,
          region: price.location
        };
      });

      // If a specific crop ID is provided, filter the results
      if (cropId) {
        return processedData.filter(crop => crop.cropId === cropId);
      }

      return processedData;
    } catch (error) {
      console.error("Error fetching MCP data:", error);
      return [];
    }
  }

  static async getPricePrediction(cropName: string, region: string): Promise<{
    currentPrice: number;
    predictedPrice: number;
    confidence: number;
    factors: string[];
  }> {
    // In a real implementation, this would use actual ML models
    // For now, we'll simulate a prediction
    try {
      const { data, error } = await supabase
        .from('market_prices')
        .select('*')
        .eq('commodity', cropName)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (!data || data.length === 0) {
        return {
          currentPrice: 0,
          predictedPrice: 0,
          confidence: 0,
          factors: ['No data available']
        };
      }

      const currentPrice = data[0].price;
      
      // Simulate a prediction with random factors
      const predictedPrice = currentPrice * (1 + (Math.random() * 0.3 - 0.1));
      const factors = [
        'Weather forecast',
        'Seasonal demand',
        'Import/export policies',
        'Historical price trends',
        'Regional supply chain conditions'
      ];
      
      // Randomly select 2-4 factors
      const selectedFactors = factors
        .sort(() => 0.5 - Math.random())
        .slice(0, 2 + Math.floor(Math.random() * 3));

      return {
        currentPrice,
        predictedPrice,
        confidence: 70 + Math.random() * 20,
        factors: selectedFactors
      };
    } catch (error) {
      console.error("Error getting price prediction:", error);
      return {
        currentPrice: 0,
        predictedPrice: 0,
        confidence: 0,
        factors: ['Error fetching prediction data']
      };
    }
  }
}
