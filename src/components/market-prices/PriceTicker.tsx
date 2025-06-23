import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, MinusIcon } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";

type SupabaseMarketPrice = Database["public"]["Tables"]["market_prices"]["Row"];

interface PriceTickerProps {
  prices: SupabaseMarketPrice[];
  location: string;
}

export const PriceTicker = ({ prices, location }: PriceTickerProps) => {
  const [offset, setOffset] = useState(0);
  const [combinedPrices, setCombinedPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch and combine API market prices with farmer submitted prices
    const fetchCombinedPrices = async () => {
      try {
        setLoading(true);
        // Get real API prices and combine with farmer submitted prices
        const combined = await KenyaAgriStatsService.combineMarketPrices(prices);
        
        // Filter for the requested location if provided
        const filteredPrices = location === "All" 
          ? combined 
          : combined.filter(p => p.location === location);
        
        setCombinedPrices(filteredPrices);
      } catch (error) {
        console.error("Error fetching combined market prices:", error);
        // Fallback to just formatting the provided prices
        const fallbackPrices: MarketPrice[] = prices.map(price => ({
          commodity: price.commodity,
          price: price.price,
          location: price.location,
          unit: price.unit,
          source: "Farmer",
          date: price.created_at,
          isOrganic: price.is_organic,
          trend: Math.random() > 0.5 ? 'up' : 'down'
        }));
        setCombinedPrices(fallbackPrices);
      } finally {
        setLoading(false);
      }
    };

    fetchCombinedPrices();

    // Animate the ticker
    const interval = setInterval(() => {
      setOffset(prev => {
        const tickerWidth = combinedPrices.length * 220;
        // Reset when we've scrolled the entire width
        if (Math.abs(prev) >= tickerWidth) {
          return 0;
        }
        return prev - 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [prices, location]);

  // Show loading state
  if (loading) {
    return (
      <div className="relative w-full overflow-hidden bg-background border rounded-lg p-2 shadow-sm">
        <h3 className="text-sm font-medium mb-2">{location} - Loading market prices...</h3>
        <div className="animate-pulse h-6 bg-muted/50 rounded"></div>
      </div>
    );
  }

  // No prices available
  if (combinedPrices.length === 0) {
    return (
      <div className="relative w-full overflow-hidden bg-background border rounded-lg p-2 shadow-sm">
        <h3 className="text-sm font-medium mb-2">{location}</h3>
        <p className="text-muted-foreground text-sm">No market prices available for this location</p>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden bg-background border rounded-lg p-2 shadow-sm">
      <h3 className="text-sm font-medium mb-2">{location} Market Prices</h3>
      <div className="flex space-x-8" style={{ transform: `translateX(${offset}px)`, whiteSpace: "nowrap" }}>
        {combinedPrices.map((price, index) => (
          <div
            key={`${price.commodity}-${price.location}-${index}`}
            className="flex items-center space-x-2 whitespace-nowrap"
          >
            <span className="font-medium">{price.commodity}{price.isOrganic ? " (Organic)" : ""}:</span>
            <span className={cn(
              "font-bold",
              price.trend === 'up' ? "text-green-500" : 
              price.trend === 'down' ? "text-red-500" : 
              "text-yellow-500"
            )}>
              {price.price} KES/{price.unit}
            </span>
            {price.trend === 'up' ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : price.trend === 'down' ? (
              <TrendingDown className="h-4 w-4 text-red-500" />
            ) : (
              <MinusIcon className="h-4 w-4 text-yellow-500" />
            )}
            <span className="text-xs text-muted-foreground border-l pl-2 ml-1">
              {price.source}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
