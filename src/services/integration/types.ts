
export interface DataSyncResult {
  success: boolean;
  recordsProcessed: number;
  errors: string[];
  lastSync: string;
}

export interface PriceVarianceItem {
  commodity: string;
  location: string;
  farmer_price: number;
  official_price: number;
  variance_percentage: number;
  alert_level: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface IntegrationRecommendation {
  name: string;
  description: string;
  integration: string;
  cost: string;
}
