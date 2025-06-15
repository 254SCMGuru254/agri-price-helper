
import { supabase } from "@/integrations/supabase/client";
import { KenyaAgriStatsService } from "./KenyaAgriStatsService";

export interface DataSyncResult {
  success: boolean;
  recordsProcessed: number;
  errors: string[];
  lastSync: string;
}

export class DataIntegrationService {
  
  // Sync official API data with local storage
  static async syncOfficialData(): Promise<DataSyncResult> {
    const result: DataSyncResult = {
      success: false,
      recordsProcessed: 0,
      errors: [],
      lastSync: new Date().toISOString()
    };

    try {
      console.log('Starting official data sync...');
      
      // Fetch latest data from official API
      const officialPrices = await KenyaAgriStatsService.fetchMarketPrices();
      const officialStats = await KenyaAgriStatsService.fetchStats();
      
      if (officialPrices.length === 0) {
        result.errors.push('No official price data received');
        return result;
      }

      // Store in Supabase for processing and comparison
      const { data: insertedPrices, error: priceError } = await supabase
        .from('market_prices')
        .upsert(
          officialPrices.map(price => ({
            commodity: price.commodity,
            price: price.price,
            unit: price.unit,
            location: price.location,
            is_organic: price.isOrganic || false,
            status: 'approved' as const,
            source: 'OFFICIAL_API',
            submitted_by: '00000000-0000-0000-0000-000000000000', // System generated
            created_at: price.date,
            metadata: {
              trend: price.trend,
              source_api: 'kilimo.go.ke',
              sync_timestamp: new Date().toISOString()
            }
          })),
          { 
            onConflict: 'commodity,location,created_at',
            ignoreDuplicates: true 
          }
        );

      if (priceError) {
        result.errors.push(`Price sync error: ${priceError.message}`);
      } else {
        // Fix: Add null check for insertedPrices
        result.recordsProcessed += Array.isArray(insertedPrices) ? insertedPrices.length : 0;
      }

      // Store agricultural statistics
      if (officialStats.length > 0) {
        const { data: insertedStats, error: statsError } = await supabase
          .from('agricultural_statistics')
          .upsert(
            officialStats.map(stat => ({
              name: stat.name,
              value: stat.value,
              year: stat.year,
              category: stat.category || 'General',
              metadata: {
                source_api: 'kilimo.go.ke',
                sync_timestamp: new Date().toISOString()
              }
            })),
            { 
              onConflict: 'name,year',
              ignoreDuplicates: true 
            }
          );

        if (statsError) {
          result.errors.push(`Statistics sync error: ${statsError.message}`);
        } else {
          result.recordsProcessed += Array.isArray(insertedStats) ? insertedStats.length : 0;
        }
      }

      // Log sync activity
      await this.logSyncActivity('OFFICIAL_DATA_SYNC', result);
      
      result.success = result.errors.length === 0;
      console.log('Official data sync completed:', result);
      
      return result;
    } catch (error) {
      console.error('Data sync failed:', error);
      result.errors.push(`Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return result;
    }
  }

  // Compare farmer prices with official data
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

  private static calculatePriceVariance(farmerPrices: any[], officialPrices: any[]) {
    const variance: any[] = [];
    
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

  // Log sync activities
  private static async logSyncActivity(activityType: string, result: DataSyncResult) {
    try {
      await supabase
        .from('sync_logs')
        .insert({
          activity_type: activityType,
          records_processed: result.recordsProcessed,
          success: result.success,
          errors: result.errors,
          created_at: result.lastSync
        });
    } catch (error) {
      console.error('Failed to log sync activity:', error);
    }
  }

  // Free third-party integrations for data processing
  static getRecommendedIntegrations() {
    return [
      {
        name: "Google Sheets",
        description: "Export and analyze data in spreadsheets",
        integration: "Use Google Sheets API for data export and collaborative analysis",
        cost: "Free"
      },
      {
        name: "Airtable",
        description: "Database-like storage with advanced filtering",
        integration: "Store and organize agricultural data with custom views",
        cost: "Free tier available"
      },
      {
        name: "Zapier",
        description: "Automate data workflows",
        integration: "Connect to 1000+ apps for data processing automation",
        cost: "Free tier available"
      },
      {
        name: "GitHub Actions",
        description: "Automated data processing workflows",
        integration: "Run scheduled data sync and analysis jobs",
        cost: "Free for public repos"
      }
    ];
  }
}
