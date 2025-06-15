
import { supabase } from "@/integrations/supabase/client";
import { KenyaAgriStatsService } from "../KenyaAgriStatsService";
import type { DataSyncResult } from "./types";

export class OfficialDataSyncService {
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
            ignoreDuplicates: false 
          }
        )
        .select();

      if (priceError) {
        result.errors.push(`Price sync error: ${priceError.message}`);
      } else if (insertedPrices) {
        result.recordsProcessed += insertedPrices.length;
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
              ignoreDuplicates: false 
            }
          )
          .select();

        if (statsError) {
          result.errors.push(`Statistics sync error: ${statsError.message}`);
        } else if (insertedStats) {
          result.recordsProcessed += insertedStats.length;
        }
      }

      result.success = result.errors.length === 0;
      console.log('Official data sync completed:', result);
      
      return result;
    } catch (error) {
      console.error('Data sync failed:', error);
      result.errors.push(`Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return result;
    }
  }
}
