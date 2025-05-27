
import { supabase } from "@/integrations/supabase/client";

export interface SecurityCheck {
  isValid: boolean;
  reason?: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface RateLimitResult {
  allowed: boolean;
  remainingRequests: number;
  resetTime: Date;
  waitTime?: number;
}

export class SecurityService {
  // Rate limiting configurations
  private static readonly RATE_LIMITS = {
    PRICE_SUBMISSION: { requests: 10, windowMinutes: 60 },
    AI_ANALYSIS: { requests: 20, windowMinutes: 60 },
    MESSAGE_SENDING: { requests: 50, windowMinutes: 60 },
    API_CALLS: { requests: 100, windowMinutes: 60 }
  };

  // Security validation for market price submissions
  static validatePriceSubmission(data: any): SecurityCheck {
    const errors = [];

    // Price validation
    if (typeof data.price !== 'number' || data.price <= 0 || data.price > 1000000) {
      errors.push('Invalid price range');
    }

    // Commodity validation
    if (!data.commodity || typeof data.commodity !== 'string' || data.commodity.length > 100) {
      errors.push('Invalid commodity name');
    }

    // Location validation
    if (!data.location || typeof data.location !== 'string' || data.location.length > 200) {
      errors.push('Invalid location');
    }

    // Unit validation
    const validUnits = ['kg', 'g', 'ton', 'piece', 'litre', 'bag', 'crate'];
    if (!validUnits.includes(data.unit)) {
      errors.push('Invalid unit');
    }

    // Check for suspicious patterns
    const riskLevel = this.assessRiskLevel(data);

    return {
      isValid: errors.length === 0,
      reason: errors.join(', '),
      riskLevel
    };
  }

  private static assessRiskLevel(data: any): 'low' | 'medium' | 'high' {
    let riskScore = 0;

    // Extremely high or low prices
    if (data.price > 100000 || data.price < 1) riskScore += 2;

    // Suspicious text patterns
    const suspiciousPatterns = ['test', 'fake', 'demo', 'xxx', '123'];
    const text = `${data.commodity} ${data.location}`.toLowerCase();
    if (suspiciousPatterns.some(pattern => text.includes(pattern))) {
      riskScore += 3;
    }

    // Location inconsistencies
    if (!this.isValidKenyanLocation(data.location)) {
      riskScore += 1;
    }

    if (riskScore >= 4) return 'high';
    if (riskScore >= 2) return 'medium';
    return 'low';
  }

  private static isValidKenyanLocation(location: string): boolean {
    const kenyanLocations = [
      'nairobi', 'mombasa', 'kisumu', 'nakuru', 'eldoret', 'thika', 'malindi',
      'kitale', 'garissa', 'kakamega', 'meru', 'nyeri', 'machakos', 'kericho',
      'embu', 'migori', 'homa bay', 'kilifi', 'voi', 'bungoma', 'webuye',
      'kiambu', 'isiolo', 'marsabit', 'wajir', 'mandera', 'moyale', 'lodwar'
    ];
    
    const locationLower = location.toLowerCase();
    return kenyanLocations.some(validLocation => 
      locationLower.includes(validLocation) || validLocation.includes(locationLower)
    );
  }

  // Rate limiting implementation using existing tables
  static async checkRateLimit(
    userId: string, 
    action: keyof typeof SecurityService.RATE_LIMITS
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

  // Content sanitization
  static sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
      .substring(0, 1000); // Limit length
  }

  // Validate file uploads (for future image uploads)
  static validateFileUpload(file: File): SecurityCheck {
    const errors = [];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      errors.push('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
    }

    if (file.size > maxSize) {
      errors.push('File too large. Maximum size is 5MB.');
    }

    return {
      isValid: errors.length === 0,
      reason: errors.join(' '),
      riskLevel: errors.length > 0 ? 'high' : 'low'
    };
  }

  // Check for suspicious user behavior using existing tables
  static async checkUserBehavior(userId: string): Promise<SecurityCheck> {
    try {
      // Check recent price submissions
      const { data: recentPrices, error: priceError } = await supabase
        .from('market_prices')
        .select('*')
        .eq('submitted_by', userId)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (priceError) {
        console.error('Error checking user behavior:', priceError);
        return { isValid: true, riskLevel: 'low' };
      }

      const priceCount = recentPrices?.length || 0;
      
      // Flag unusual activity patterns
      if (priceCount > 50) { // More than 50 price submissions per day
        return {
          isValid: false,
          reason: 'Unusual activity pattern detected',
          riskLevel: 'high'
        };
      }

      if (priceCount > 20) {
        return {
          isValid: true,
          reason: 'High activity detected',
          riskLevel: 'medium'
        };
      }

      return { isValid: true, riskLevel: 'low' };
    } catch (error) {
      console.error('Behavior check error:', error);
      return { isValid: true, riskLevel: 'low' };
    }
  }
}
