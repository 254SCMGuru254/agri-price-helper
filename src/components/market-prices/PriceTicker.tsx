import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";

type MarketPrice = Database["public"]["Tables"]["market_prices"]["Row"];

interface PriceTickerProps {
  prices: MarketPrice[];
  location: string;
}

export const PriceTicker = ({ prices, location }: PriceTickerProps) => {
  const [offset, setOffset] = useState(0);
  const [pricesWithTrend, setPricesWithTrend] = useState<(MarketPrice & { trend: 'up' | 'down' | null })[]>([]);

  useEffect(() => {
    // Initialize prices with random trends for demo
    setPricesWithTrend(
      prices.map(price => ({
        ...price,
        trend: Math.random() > 0.5 ? 'up' : 'down'
      }))
    );

    // Animate the ticker
    const interval = setInterval(() => {
      setOffset(prev => (prev - 1) % (prices.length * 200));
    }, 50);

    return () => clearInterval(interval);
  }, [prices]);

  return (
    <div className="relative w-full overflow-hidden bg-background border rounded-lg p-2 shadow-sm">
      <h3 className="text-sm font-medium mb-2">{location}</h3>
      <div className="flex space-x-8 animate-ticker" style={{ transform: `translateX(${offset}px)` }}>
        {pricesWithTrend.map((price) => (
          <div
            key={price.id}
            className="flex items-center space-x-2 whitespace-nowrap"
          >
            <span className="font-medium">{price.commodity}:</span>
            <span className={cn(
              "font-bold",
              price.trend === 'up' ? "text-green-500" : "text-red-500"
            )}>
              ${price.price}/{price.unit}
            </span>
            {price.trend === 'up' ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};