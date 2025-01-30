import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PriceMap from "./PriceMap";

type MarketPrice = Database["public"]["Tables"]["market_prices"]["Row"];

export const MarketPrices = () => {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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
    <Tabs defaultValue="list" className="space-y-4">
      <TabsList>
        <TabsTrigger value="list">List View</TabsTrigger>
        <TabsTrigger value="map">Map View</TabsTrigger>
      </TabsList>
      
      <TabsContent value="list">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {prices.map((price) => (
            <Card key={price.id} className="p-4">
              <h3 className="font-semibold text-lg">{price.commodity}</h3>
              <div className="mt-2 space-y-1 text-sm">
                <p className="text-2xl font-bold">
                  ${price.price} / {price.unit}
                </p>
                <p className="text-muted-foreground">Location: {price.location}</p>
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
      </TabsContent>
      
      <TabsContent value="map">
        <PriceMap prices={prices} />
      </TabsContent>
    </Tabs>
  );
};