import { PriceCarousel } from "./PriceCarousel";
import type { Database } from "@/integrations/supabase/types";

type MarketPrice = Database["public"]["Tables"]["market_prices"]["Row"];

interface CarouselViewProps {
  prices: MarketPrice[];
  onShare: (price: MarketPrice) => void;
}

export const CarouselView = ({ prices, onShare }: CarouselViewProps) => {
  const organicPrices = prices.filter(price => price.is_organic);
  const nonOrganicPrices = prices.filter(price => !price.is_organic);
  const pricesByLocation = prices.reduce((acc, price) => {
    if (!acc[price.location]) {
      acc[price.location] = [];
    }
    acc[price.location].push(price);
    return acc;
  }, {} as Record<string, MarketPrice[]>);

  return (
    <div className="space-y-8">
      <PriceCarousel prices={organicPrices} title="Organic Products" onShare={onShare} />
      <PriceCarousel prices={nonOrganicPrices} title="Non-Organic Products" onShare={onShare} />
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Prices by Location</h2>
        {Object.entries(pricesByLocation).map(([location, locationPrices]) => (
          <PriceCarousel
            key={location}
            prices={locationPrices}
            title={`Market Prices in ${location}`}
            onShare={onShare}
          />
        ))}
      </div>
    </div>
  );
};