import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import PriceMap from "./PriceMap";

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

  const organicPrices = prices.filter(price => price.is_organic);
  const nonOrganicPrices = prices.filter(price => !price.is_organic);

  return (
    <Tabs defaultValue="list" className="space-y-4">
      <TabsList>
        <TabsTrigger value="list">List View</TabsTrigger>
        <TabsTrigger value="map">Map View</TabsTrigger>
        <TabsTrigger value="forex">Exchange Rates</TabsTrigger>
      </TabsList>
      
      <TabsContent value="list">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Organic Products</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {organicPrices.map((price) => (
                <Card key={price.id} className="p-4">
                  <h3 className="font-semibold text-lg">{price.commodity}</h3>
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
                  <h3 className="font-semibold text-lg">{price.commodity}</h3>
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
      </TabsContent>
      
      <TabsContent value="map">
        <PriceMap prices={prices} />
      </TabsContent>

      <TabsContent value="forex">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Current Exchange Rates</h2>
          {loadingRates ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : exchangeRates ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="p-4 bg-primary/5">
                <p className="text-sm text-muted-foreground">USD/KES</p>
                <p className="text-2xl font-bold">{exchangeRates.KES.toFixed(2)}</p>
              </Card>
              <Card className="p-4 bg-primary/5">
                <p className="text-sm text-muted-foreground">USD/EUR</p>
                <p className="text-2xl font-bold">{exchangeRates.EUR.toFixed(2)}</p>
              </Card>
              <Card className="p-4 bg-primary/5">
                <p className="text-sm text-muted-foreground">USD/GBP</p>
                <p className="text-2xl font-bold">{exchangeRates.GBP.toFixed(2)}</p>
              </Card>
              <Card className="p-4 bg-primary/5">
                <p className="text-sm text-muted-foreground">Base Currency</p>
                <p className="text-2xl font-bold">USD</p>
              </Card>
            </div>
          ) : (
            <p className="text-center text-muted-foreground">Failed to load exchange rates</p>
          )}
          <p className="text-sm text-muted-foreground mt-4">
            Exchange rates are updated daily. Last updated: {new Date().toLocaleDateString()}
          </p>
        </Card>
      </TabsContent>
    </Tabs>
  );
};