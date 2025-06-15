
import { supabase } from "@/integrations/supabase/client";
import type { PriceVarianceItem } from "./types";

export class PriceAnalysisService {
  static async analyzePriceVariance() {
    try {
      const { data: farmerPrices, error: farmerError } = await supabase
        .from('market_prices')
        .select('*')
        .eq('source', 'FARMER')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      const { data: officialPrices, error: officialError } = await supabase
        .from('market_prices')
        .select('*')
        .eq('source', 'OFFICIAL_API')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (farmerError || officialError) {
        throw new Error('Failed to fetch price data for analysis');
      }

      const varianceAnalysis = this.calculatePriceVariance(
        farmerPrices || [], 
        officialPrices || []
      );

      // Store analysis results
      await supabase
        .from('price_analysis')
        .insert({
          analysis_type: 'VARIANCE_ANALYSIS',
          data: varianceAnalysis,
          created_at: new Date().toISOString()
        });

      return varianceAnalysis;
    } catch (error) {
      console.error('Price variance analysis failed:', error);
      return null;
    }
  }

  private static calculatePriceVariance(farmerPrices: any[], officialPrices: any[]): PriceVarianceItem[] {
    const variance: PriceVarianceItem[] = [];
    
    farmerPrices.forEach(farmerPrice => {
      const matchingOfficial = officialPrices.find(
        official => 
          official.commodity === farmerPrice.commodity &&
          official.location === farmerPrice.location
      );
      
      if (matchingOfficial) {
        const priceDiff = ((farmerPrice.price - matchingOfficial.price) / matchingOfficial.price) * 100;
        
        variance.push({
          commodity: farmerPrice.commodity,
          location: farmerPrice.location,
          farmer_price: farmerPrice.price,
          official_price: matchingOfficial.price,
          variance_percentage: priceDiff,
          alert_level: Math.abs(priceDiff) > 20 ? 'HIGH' : Math.abs(priceDiff) > 10 ? 'MEDIUM' : 'LOW'
        });
      }
    });
    
    return variance;
  }
}
