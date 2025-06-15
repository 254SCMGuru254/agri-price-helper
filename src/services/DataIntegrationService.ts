
import { OfficialDataSyncService } from "./integration/OfficialDataSyncService";
import { PriceAnalysisService } from "./integration/PriceAnalysisService";
import { SyncLoggingService } from "./integration/SyncLoggingService";
import { IntegrationRecommendationsService } from "./integration/IntegrationRecommendationsService";
import type { DataSyncResult, IntegrationRecommendation } from "./integration/types";

export type { DataSyncResult };

export class DataIntegrationService {
  
  // Sync official API data with local storage
  static async syncOfficialData(): Promise<DataSyncResult> {
    const result = await OfficialDataSyncService.syncOfficialData();
    
    // Log sync activity
    await SyncLoggingService.logSyncActivity('OFFICIAL_DATA_SYNC', result);
    
    return result;
  }

  // Compare farmer prices with official data
  static async analyzePriceVariance() {
    return await PriceAnalysisService.analyzePriceVariance();
  }

  // Free third-party integrations for data processing
  static getRecommendedIntegrations(): IntegrationRecommendation[] {
    return IntegrationRecommendationsService.getRecommendedIntegrations();
  }
}
