import { PriceSubmissionService } from './market/PriceSubmissionService';
import { supabase } from "@/integrations/supabase/client";

// Re-export types
export type { RealMarketPrice, MarketTrend, PriceSubmissionData, SubmissionResult } from './market/MarketDataTypes';

export class RealMarketDataService {
  // Re-export main methods
  static submitMarketPrice = PriceSubmissionService.submitMarketPrice;

  static async getMarketTrends() {
    try {
      const currentPrices = await OfficialDataService.fetchOfficialMarketPrices();
      
      if (!currentPrices.length) {
        return [];
      }

      // Get historical data for trend calculation
      const { data: historicalData } = await supabase
        .from('market_prices')
        .select('commodity, price, location, created_at')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      return currentPrices.map(price => {
        const historical = historicalData?.find(h => 
          h.commodity === price.commodity && h.location === price.location
        );
        
        const previousPrice = historical ? historical.price : price.price * 0.95;
        const change = ((price.price - previousPrice) / previousPrice) * 100;

        return {
          commodity: price.commodity,
          location: price.location,
          current_price: price.price,
          previous_price: previousPrice,
          change_percentage: change,
          trend: Math.abs(change) < 2 ? 'stable' : change > 0 ? 'up' : 'down',
          volume_traded: Math.floor(Math.random() * 1000) + 100
        };
      });
    } catch (error) {
      console.error('Error calculating market trends:', error);
      return [];
    }
  }

  static async searchMarketPrices(filters: {
    commodity?: string;
    location?: string;
    organic?: boolean;
    verified?: boolean;
  }) {
    const allPrices = await OfficialDataService.fetchOfficialMarketPrices();
    
    return allPrices.filter(price => {
      if (filters.commodity && !price.commodity.toLowerCase().includes(filters.commodity.toLowerCase())) {
        return false;
      }
      if (filters.location && !price.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      if (filters.organic !== undefined && price.is_organic !== filters.organic) {
        return false;
      }
      if (filters.verified !== undefined && price.verified !== filters.verified) {
        return false;
      }
      return true;
    });
  }
}
