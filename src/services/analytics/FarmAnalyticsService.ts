import { supabase } from '@/integrations/supabase/client';

export interface FarmAnalytics {
  profitMargins: {
    current: number;
    previous: number;
    trend: 'up' | 'down' | 'stable';
  };
  yieldPredictions: {
    crop: string;
    predictedYield: number;
    confidence: number;
  }[];
  marketTrends: {
    commodity: string;
    priceChange: number;
    period: string;
  }[];
  resourceUsage: {
    category: string;
    usage: number;
    benchmark: number;
  }[];
}

export class FarmAnalyticsService {
  static async getProfitMargins(farmerId: string): Promise<FarmAnalytics['profitMargins']> {
    // Fetch sales and costs data from Supabase
    const { data: salesData, error: salesError } = await supabase
      .from('sales_records')
      .select('amount, timestamp')
      .eq('farmer_id', farmerId)
      .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    const { data: costsData, error: costsError } = await supabase
      .from('expense_records')
      .select('amount, timestamp')
      .eq('farmer_id', farmerId)
      .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (salesError || costsError) {
      throw new Error('Failed to fetch profit margin data');
    }

    // Calculate current and previous month's margins
    const currentMonthSales = salesData?.reduce((acc, sale) => acc + sale.amount, 0) || 0;
    const currentMonthCosts = costsData?.reduce((acc, cost) => acc + cost.amount, 0) || 0;
    const currentMargin = ((currentMonthSales - currentMonthCosts) / currentMonthSales) * 100;

    // Previous month calculation would go here...
    const previousMargin = currentMargin - 5; // Placeholder

    return {
      current: currentMargin,
      previous: previousMargin,
      trend: currentMargin > previousMargin ? 'up' : currentMargin < previousMargin ? 'down' : 'stable'
    };
  }

  static async getYieldPredictions(farmerId: string): Promise<FarmAnalytics['yieldPredictions']> {
    // Fetch historical yield data and weather conditions
    const { data: yieldData, error: yieldError } = await supabase
      .from('crop_yields')
      .select('*')
      .eq('farmer_id', farmerId);

    if (yieldError) {
      throw new Error('Failed to fetch yield prediction data');
    }

    // Simple prediction based on historical averages
    // In a real app, this would use more sophisticated ML models
    return yieldData?.map(record => ({
      crop: record.crop_name,
      predictedYield: record.average_yield * 1.1, // Simple 10% growth prediction
      confidence: 0.85
    })) || [];
  }

  static async getMarketTrends(): Promise<FarmAnalytics['marketTrends']> {
    // Fetch price history from the last 30 days
    const { data: priceData, error: priceError } = await supabase
      .from('market_prices')
      .select('*')
      .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (priceError) {
      throw new Error('Failed to fetch market trend data');
    }

    // Calculate price changes
    const trends = priceData?.reduce((acc: any, price) => {
      if (!acc[price.commodity]) {
        acc[price.commodity] = {
          oldestPrice: price.price,
          latestPrice: price.price
        };
      } else {
        if (new Date(price.timestamp) > new Date(acc[price.commodity].latestTimestamp)) {
          acc[price.commodity].latestPrice = price.price;
        }
      }
      return acc;
    }, {});

    return Object.entries(trends || {}).map(([commodity, data]: [string, any]) => ({
      commodity,
      priceChange: ((data.latestPrice - data.oldestPrice) / data.oldestPrice) * 100,
      period: '30 days'
    }));
  }

  static async getResourceUsage(farmerId: string): Promise<FarmAnalytics['resourceUsage']> {
    // Fetch resource usage data
    const { data: usageData, error: usageError } = await supabase
      .from('resource_usage')
      .select('*')
      .eq('farmer_id', farmerId);

    if (usageError) {
      throw new Error('Failed to fetch resource usage data');
    }

    // Compare with benchmarks
    return usageData?.map(usage => ({
      category: usage.resource_type,
      usage: usage.amount,
      benchmark: usage.regional_average
    })) || [];
  }
} 