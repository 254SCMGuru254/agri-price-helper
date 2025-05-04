
import { PriceTicker } from "./PriceTicker";
import type { Database } from "@/integrations/supabase/types";

type MarketPrice = Database["public"]["Tables"]["market_prices"]["Row"];

interface PriceTickerSectionProps {
  filteredPrices: MarketPrice[];
}

export const PriceTickerSection = ({ filteredPrices }: PriceTickerSectionProps) => {
  const locations = ['All', ...Array.from(new Set(filteredPrices.map(p => p.location)))];

  return (
    <div className="space-y-2">
      {locations.map(loc => (
        <PriceTicker key={loc} location={loc} prices={filteredPrices} />
      ))}
    </div>
  );
};
