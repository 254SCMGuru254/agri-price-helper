
import { supabase } from "@/integrations/supabase/client";
import type { RealMarketPrice } from './MarketDataTypes';

export class OfficialDataService {
  // Kenya Bureau of Statistics API endpoints
  private static readonly KNBS_API = 'https://www.knbs.or.ke/api';
  private static readonly AGRICULTURAL_MINISTRY_API = 'https://kilimo.go.ke/api';

  static async fetchOfficialMarketPrices(): Promise<RealMarketPrice[]> {
    try {
      // First get verified prices from our database
      const { data: dbPrices, error } = await supabase
        .from('market_prices')
        .select('*')
        .not('verified_at', 'is', null)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching database prices:', error);
      }

      // Convert database format to our RealMarketPrice format
      const convertedPrices: RealMarketPrice[] = (dbPrices || []).map(price => ({
        id: price.id,
        commodity: price.commodity,
        price: price.price,
        unit: price.unit,
        location: price.location,
        date: price.created_at,
        source: 'FARMER' as const,
        verified: price.verified_at !== null,
        is_organic: price.is_organic,
        trend: this.calculateTrend(price.price, 0)
      }));

      // Add official government data
      const officialPrices = await this.fetchFromGovernmentAPIs();
      
      return [...convertedPrices, ...officialPrices];
    } catch (error) {
      console.error('Error fetching market prices:', error);
      return this.getFallbackVerifiedPrices();
    }
  }

  private static async fetchFromGovernmentAPIs(): Promise<RealMarketPrice[]> {
    try {
      const apis = [
        'https://statistics.kilimo.go.ke/api/market-prices',
        'https://www.knbs.or.ke/api/agricultural-prices',
        'https://ncpb.go.ke/api/prices'
      ];

      for (const apiUrl of apis) {
        try {
          const response = await fetch(`${apiUrl}?format=json`, {
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'AgriPriceHelper/1.0'
            },
            signal: AbortSignal.timeout(10000)
          });

          if (response.ok) {
            const data = await response.json();
            if (this.isValidAPIResponse(data)) {
              return this.transformAPIResponse(data);
            }
          }
        } catch (apiError) {
          console.warn(`API ${apiUrl} failed:`, apiError);
          continue;
        }
      }

      console.warn('All government APIs failed, using database data only');
      return [];
    } catch (error) {
      console.error('Error fetching from government APIs:', error);
      return [];
    }
  }

  private static isValidAPIResponse(data: any): boolean {
    return Array.isArray(data) && data.length > 0 && 
           data[0]?.commodity && typeof data[0]?.price === 'number';
  }

  private static transformAPIResponse(data: any[]): RealMarketPrice[] {
    return data.slice(0, 50).map((item, index) => ({
      id: `official-${Date.now()}-${index}`,
      commodity: item.commodity || item.product_name || 'Unknown',
      price: parseFloat(item.price) || 0,
      unit: item.unit || 'kg',
      location: item.location || item.market || 'Kenya',
      market_name: item.market_name || item.source,
      date: item.date || new Date().toISOString(),
      source: 'OFFICIAL' as const,
      verified: true,
      is_organic: item.is_organic || false,
      quality_grade: item.grade || item.quality,
      trend: this.determineTrend(item.trend || item.price_change)
    }));
  }

  private static determineTrend(value: any): 'up' | 'down' | 'stable' {
    if (typeof value === 'string') {
      if (value.includes('up') || value.includes('increase')) return 'up';
      if (value.includes('down') || value.includes('decrease')) return 'down';
    }
    if (typeof value === 'number') {
      if (value > 0) return 'up';
      if (value < 0) return 'down';
    }
    return 'stable';
  }

  private static async getFallbackVerifiedPrices(): Promise<RealMarketPrice[]> {
    try {
      const { data, error } = await supabase
        .from('market_prices')
        .select('*')
        .not('verified_at', 'is', null)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error || !data?.length) {
        console.warn('No verified prices available in database');
        return [];
      }

      return data.map(price => ({
        id: price.id,
        commodity: price.commodity,
        price: price.price,
        unit: price.unit,
        location: price.location,
        date: price.created_at,
        source: 'FARMER' as const,
        verified: true,
        is_organic: price.is_organic,
        trend: 'stable' as const
      }));
    } catch (error) {
      console.error('Error getting fallback prices:', error);
      return [];
    }
  }

  private static calculateTrend(currentPrice: number, previousPrice: number): 'up' | 'down' | 'stable' {
    if (previousPrice === 0) return 'stable';
    const change = ((currentPrice - previousPrice) / previousPrice) * 100;
    if (change > 2) return 'up';
    if (change < -2) return 'down';
    return 'stable';
  }
}
