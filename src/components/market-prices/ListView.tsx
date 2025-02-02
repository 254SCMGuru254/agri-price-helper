import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, CheckCircle2 } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type MarketPrice = Database["public"]["Tables"]["market_prices"]["Row"];

interface ListViewProps {
  prices: MarketPrice[];
  onShare: (price: MarketPrice) => void;
}

export const ListView = ({ prices, onShare }: ListViewProps) => {
  const organicPrices = prices.filter(price => price.is_organic);
  const nonOrganicPrices = prices.filter(price => !price.is_organic);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Organic Products</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {organicPrices.map((price) => (
            <Card key={price.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{price.commodity}</h3>
                  {price.verified_at && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onShare(price)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 space-y-1 text-sm">
                <p className="text-2xl font-bold">
                  ${price.price} / {price.unit}
                </p>
                <p className="text-muted-foreground">Location: {price.location}</p>
                <p className="text-green-600 font-medium">Organic</p>
                <p className="text-muted-foreground text-xs">
                  Posted:{" "}
                  {new Date(price.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Non-Organic Products</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {nonOrganicPrices.map((price) => (
            <Card key={price.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{price.commodity}</h3>
                  {price.verified_at && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onShare(price)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 space-y-1 text-sm">
                <p className="text-2xl font-bold">
                  ${price.price} / {price.unit}
                </p>
                <p className="text-muted-foreground">Location: {price.location}</p>
                <p className="text-gray-600">Non-Organic</p>
                <p className="text-muted-foreground text-xs">
                  Posted:{" "}
                  {new Date(price.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};