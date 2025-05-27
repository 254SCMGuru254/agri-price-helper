
import { supabase } from "@/integrations/supabase/client";

export interface SecurityCheck {
  isValid: boolean;
  reason?: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export class BehaviorAnalysisService {
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

  // Check for spam patterns in forum posts
  static async checkForumSpam(userId: string): Promise<SecurityCheck> {
    try {
      const { data: recentPosts, error } = await supabase
        .from('forum_posts')
        .select('*')
        .eq('author_id', userId)
        .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Last hour
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error checking forum spam:', error);
        return { isValid: true, riskLevel: 'low' };
      }

      const postCount = recentPosts?.length || 0;
      
      if (postCount > 10) { // More than 10 posts per hour
        return {
          isValid: false,
          reason: 'Possible spam detected',
          riskLevel: 'high'
        };
      }

      if (postCount > 5) {
        return {
          isValid: true,
          reason: 'High posting activity',
          riskLevel: 'medium'
        };
      }

      return { isValid: true, riskLevel: 'low' };
    } catch (error) {
      console.error('Forum spam check error:', error);
      return { isValid: true, riskLevel: 'low' };
    }
  }
}
