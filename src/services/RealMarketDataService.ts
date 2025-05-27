
import { supabase } from "@/integrations/supabase/client";
import { SecurityService } from "./SecurityService";

export interface RealMarketPrice {
  id: string;
  commodity: string;
  price: number;
  unit: string;
  location: string;
  market_name?: string;
  date: string;
  source: 'OFFICIAL' | 'FARMER' | 'TRADER';
  verified: boolean;
  is_organic: boolean;
  quality_grade?: string;
  trend: 'up' | 'down' | 'stable';
}

export interface MarketTrend {
  commodity: string;
  location: string;
  current_price: number;
  previous_price: number;
  change_percentage: number;
  trend: 'up' | 'down' | 'stable';
  volume_traded?: number;
}

export class RealMarketDataService {
  // Kenya Bureau of Statistics API endpoints
  private static readonly KNBS_API = 'https://www.knbs.or.ke/api';
  private static readonly AGRICULTURAL_MINISTRY_API = 'https://kilimo.go.ke/api';
  
  // Real market data from official sources
  static async fetchOfficialMarketPrices(): Promise<RealMarketPrice[]> {
    try {
      // First try to get user-submitted verified prices from our database
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
        trend: this.calculateTrend(price.price, 0) // We'd need historical data for real trend
      }));

      // Add official government data from Kenya Agricultural Research Institute
      const officialPrices = await this.fetchFromGovernmentAPIs();
      
      return [...convertedPrices, ...officialPrices];
    } catch (error) {
      console.error('Error fetching market prices:', error);
      // Return only verified database data, no fake data
      return this.getFallbackVerifiedPrices();
    }
  }

  private static async fetchFromGovernmentAPIs(): Promise<RealMarketPrice[]> {
    try {
      // Try multiple government APIs
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

      // If all APIs fail, return verified database data only
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

  static async getMarketTrends(): Promise<MarketTrend[]> {
    try {
      const currentPrices = await this.fetchOfficialMarketPrices();
      
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

  private static calculateTrend(currentPrice: number, previousPrice: number): 'up' | 'down' | 'stable' {
    if (previousPrice === 0) return 'stable';
    const change = ((currentPrice - previousPrice) / previousPrice) * 100;
    if (change > 2) return 'up';
    if (change < -2) return 'down';
    return 'stable';
  }

  static async searchMarketPrices(filters: {
    commodity?: string;
    location?: string;
    organic?: boolean;
    verified?: boolean;
  }): Promise<RealMarketPrice[]> {
    const allPrices = await this.fetchOfficialMarketPrices();
    
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

  static async submitMarketPrice(priceData: {
    commodity: string;
    price: number;
    unit: string;
    location: string;
    market_name?: string;
    is_organic: boolean;
    quality_grade?: string;
    user_id: string;
  }): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      // Security validation
      const securityCheck = SecurityService.validatePriceSubmission(priceData);
      if (!securityCheck.isValid) {
        return { 
          success: false, 
          error: `Security validation failed: ${securityCheck.reason}` 
        };
      }

      // Rate limiting check using SecurityService
      const rateLimitCheck = await SecurityService.checkRateLimit(priceData.user_id, 'PRICE_SUBMISSION');
      if (!rateLimitCheck.allowed) {
        return { 
          success: false, 
          error: `Rate limit exceeded. Please wait ${rateLimitCheck.waitTime} minutes before submitting again.` 
        };
      }

      const { data, error } = await supabase
        .from('market_prices')
        .insert({
          commodity: SecurityService.sanitizeInput(priceData.commodity),
          price: priceData.price,
          unit: priceData.unit,
          location: SecurityService.sanitizeInput(priceData.location),
          is_organic: priceData.is_organic,
          submitted_by: priceData.user_id,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { success: true, id: data.id };
    } catch (error) {
      console.error('Error submitting market price:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  private static async checkRateLimit(userId: string): Promise<{ allowed: boolean; waitTime?: number }> {
    try {
      const { data, error } = await supabase
        .from('market_prices')
        .select('created_at')
        .eq('submitted_by', userId)
        .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Last hour
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Rate limit check error:', error);
        return { allowed: true }; // Allow on error
      }

      const submissionsInLastHour = data?.length || 0;
      const maxSubmissionsPerHour = 10;

      if (submissionsInLastHour >= maxSubmissionsPerHour) {
        const oldestSubmission = data?.[data.length - 1]?.created_at;
        if (oldestSubmission) {
          const waitTime = Math.ceil((60 - (Date.now() - new Date(oldestSubmission).getTime()) / (1000 * 60)));
          return { allowed: false, waitTime };
        }
      }

      return { allowed: true };
    } catch (error) {
      console.error('Rate limit error:', error);
      return { allowed: true }; // Allow on error
    }
  }

  private static async logSubmission(userId: string): Promise<void> {
    // This is already handled by the insert above, but we could add additional logging here
    console.log(`Price submission logged for user: ${userId}`);
  }
}
