import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PriceSubmission {
  commodity: string;
  price: number;
  unit: string;
  location: string;
}

// Simple validation rules
const priceRanges: Record<string, { min: number; max: number }> = {
  'corn': { min: 3, max: 15 },
  'wheat': { min: 4, max: 20 },
  'rice': { min: 10, max: 50 },
  'soybeans': { min: 8, max: 30 },
  // Add more commodities as needed
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { commodity, price, unit, location } = await req.json() as PriceSubmission;
    
    // Convert commodity to lowercase for comparison
    const normalizedCommodity = commodity.toLowerCase();
    
    // Basic validation
    let isValid = true;
    let reason = '';

    // Check if we have price range data for this commodity
    if (priceRanges[normalizedCommodity]) {
      const range = priceRanges[normalizedCommodity];
      if (price < range.min || price > range.max) {
        isValid = false;
        reason = `Price for ${commodity} should be between $${range.min} and $${range.max} per ${unit}`;
      }
    } else {
      // For unknown commodities, apply a general reasonableness check
      if (price <= 0 || price > 1000) {
        isValid = false;
        reason = 'Price seems unreasonable';
      }
    }

    // Location validation (basic)
    if (!location || location.length < 3) {
      isValid = false;
      reason = 'Invalid location';
    }

    return new Response(
      JSON.stringify({ 
        isValid, 
        reason,
        confidence: isValid ? 0.8 : 0.2 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in validate-market-price function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});