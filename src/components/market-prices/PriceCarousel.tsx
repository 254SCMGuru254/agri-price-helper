import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type MarketPrice = Database["public"]["Tables"]["market_prices"]["Row"];

interface PriceCarouselProps {
  prices: MarketPrice[];
  title: string;
}

export const PriceCarousel = ({ prices, title }: PriceCarouselProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="relative">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {prices.map((price) => (
              <CarouselItem key={price.id} className="md:basis-1/2 lg:basis-1/3">
                <Card className="p-4">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-lg">{price.commodity}</h3>
                    <div className="flex items-center space-x-1 text-sm">
                      {Math.random() > 0.5 ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  <div className="mt-2 space-y-1 text-sm">
                    <p className="text-2xl font-bold">
                      ${price.price} / {price.unit}
                    </p>
                    <p className="text-muted-foreground">Location: {price.location}</p>
                    <p className={price.is_organic ? "text-green-600 font-medium" : "text-gray-600"}>
                      {price.is_organic ? "Organic" : "Non-Organic"}
                    </p>
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
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};