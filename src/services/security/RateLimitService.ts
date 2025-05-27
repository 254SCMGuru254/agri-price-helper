
import { supabase } from "@/integrations/supabase/client";

export interface RateLimitResult {
  allowed: boolean;
  remainingRequests: number;
  resetTime: Date;
  waitTime?: number;
}

export class RateLimitService {
  // Rate limiting configurations
  private static readonly RATE_LIMITS = {
    PRICE_SUBMISSION: { requests: 10, windowMinutes: 60 },
    AI_ANALYSIS: { requests: 20, windowMinutes: 60 },
    MESSAGE_SENDING: { requests: 50, windowMinutes: 60 },
    API_CALLS: { requests: 100, windowMinutes: 60 }
  };

  // Rate limiting implementation using existing tables
  static async checkRateLimit(
    userId: string, 
    action: keyof typeof RateLimitService.RATE_LIMITS
  ): Promise<RateLimitResult> {
    const config = this.RATE_LIMITS[action];
    const windowStart = new Date(Date.now() - config.windowMinutes * 60 * 1000);

    try {
      // Use existing tables for rate limiting
      let query;
      switch (action) {
        case 'PRICE_SUBMISSION':
          query = supabase
            .from('market_prices')
            .select('created_at')
            .eq('submitted_by', userId)
            .gte('created_at', windowStart.toISOString());
          break;
        case 'MESSAGE_SENDING':
          query = supabase
            .from('messages')
            .select('timestamp')
            .eq('user_id', userId)
            .gte('timestamp', windowStart.toISOString());
          break;
        default:
          // For other actions, use a more permissive approach
          return {
            allowed: true,
            remainingRequests: config.requests,
            resetTime: new Date(Date.now() + config.windowMinutes * 60 * 1000)
          };
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Rate limit check error:', error);
        return {
          allowed: true,
          remainingRequests: config.requests,
          resetTime: new Date(Date.now() + config.windowMinutes * 60 * 1000)
        };
      }

      const requestCount = data?.length || 0;
      const remainingRequests = Math.max(0, config.requests - requestCount);
      const allowed = requestCount < config.requests;

      let waitTime;
      if (!allowed && data && data.length > 0) {
        const timeField = action === 'MESSAGE_SENDING' ? 'timestamp' : 'created_at';
        const oldestRequest = new Date(data[data.length - 1][timeField]);
        waitTime = Math.ceil((config.windowMinutes * 60 * 1000 - (Date.now() - oldestRequest.getTime())) / (1000 * 60));
      }

      return {
        allowed,
        remainingRequests,
        resetTime: new Date(Date.now() + config.windowMinutes * 60 * 1000),
        waitTime
      };
    } catch (error) {
      console.error('Rate limiting error:', error);
      // Allow on error to prevent blocking legitimate users
      return {
        allowed: true,
        remainingRequests: config.requests,
        resetTime: new Date(Date.now() + config.windowMinutes * 60 * 1000)
      };
    }
  }
}
