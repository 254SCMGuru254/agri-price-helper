import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PriceMap from "./PriceMap";
import { CarouselView } from "./market-prices/CarouselView";
import { ListView } from "./market-prices/ListView";
import { ExchangeRatesView } from "./market-prices/ExchangeRatesView";
import { PriceTicker } from "./market-prices/PriceTicker";

type MarketPrice = Database["public"]["Tables"]["market_prices"]["Row"];
type ExchangeRates = {
  KES: number;
  USD: number;
  EUR: number;
  GBP: number;
};

export const MarketPrices = () => {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(null);
  const [loadingRates, setLoadingRates] = useState(true);
  const { toast } = useToast();

  // Group prices by location
  const pricesByLocation = prices.reduce((acc, price) => {
    if (!acc[price.location]) {
      acc[price.location] = [];
    }
    acc[price.location].push(price);
    return acc;
  }, {} as Record<string, MarketPrice[]>);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        setExchangeRates({
          KES: data.rates.KES,
          USD: 1,
          EUR: data.rates.EUR,
          GBP: data.rates.GBP
        });
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
        toast({
          title: "Error",
          description: "Failed to load exchange rates",
          variant: "destructive",
        });
      } finally {
        setLoadingRates(false);
      }
    };

    fetchExchangeRates();
  }, [toast]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const { data, error } = await supabase
          .from("market_prices")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setPrices(data || []);
      } catch (error) {
        console.error("Error fetching market prices:", error);
        toast({
          title: "Error",
          description: "Failed to load market prices",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("market-prices-changes")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all changes
          schema: "public",
          table: "market_prices",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setPrices((current) => [payload.new as MarketPrice, ...current]);
          } else if (payload.eventType === "UPDATE") {
            setPrices((current) =>
              current.map((price) =>
                price.id === payload.new.id ? (payload.new as MarketPrice) : price
              )
            );
          } else if (payload.eventType === "DELETE") {
            setPrices((current) =>
              current.filter((price) => price.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  if (loading) {
    return <div className="text-center">Loading market prices...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {Object.entries(pricesByLocation).map(([location, locationPrices]) => (
          <PriceTicker key={location} location={location} prices={locationPrices} />
        ))}
      </div>

      <Tabs defaultValue="carousel" className="space-y-4">
        <TabsList>
          <TabsTrigger value="carousel">Carousel View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
          <TabsTrigger value="forex">Exchange Rates</TabsTrigger>
        </TabsList>

        <TabsContent value="carousel">
          <CarouselView prices={prices} />
        </TabsContent>
        
        <TabsContent value="list">
          <ListView prices={prices} />
        </TabsContent>
        
        <TabsContent value="map">
          <PriceMap prices={prices} />
        </TabsContent>

        <TabsContent value="forex">
          <ExchangeRatesView 
            exchangeRates={exchangeRates}
            loadingRates={loadingRates}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};