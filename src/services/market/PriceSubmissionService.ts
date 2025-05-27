
import { supabase } from "@/integrations/supabase/client";
import { SecurityService } from "../SecurityService";
import type { PriceSubmissionData, SubmissionResult } from './MarketDataTypes';

export class PriceSubmissionService {
  static async submitMarketPrice(priceData: PriceSubmissionData): Promise<SubmissionResult> {
    try {
      // Security validation
      const securityCheck = SecurityService.validatePriceSubmission(priceData);
      if (!securityCheck.isValid) {
        return { 
          success: false, 
          error: `Security validation failed: ${securityCheck.reason}` 
        };
      }

      // Rate limiting check
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
}
