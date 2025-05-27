
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

export interface PriceSubmissionData {
  commodity: string;
  price: number;
  unit: string;
  location: string;
  market_name?: string;
  is_organic: boolean;
  quality_grade?: string;
  user_id: string;
}

export interface SubmissionResult {
  success: boolean;
  id?: string;
  error?: string;
}
