import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PriceMap from "./PriceMap";
import { CarouselView } from "./market-prices/CarouselView";
import { ListView } from "./market-prices/ListView";
import { ExchangeRatesView } from "./market-prices/ExchangeRatesView";

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

    const channel = supabase
      .channel("market-prices-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "market_prices",
        },
        (payload) => {
          setPrices((current) => [payload.new as MarketPrice, ...current]);
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
  );
};