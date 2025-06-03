
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";
import { KenyaAgriStatsService } from "@/services/KenyaAgriStatsService";

type MarketPrice = Database["public"]["Tables"]["market_prices"]["Row"];
type Category = Database["public"]["Tables"]["commodity_categories"]["Row"];

export interface MarketPriceFilters {
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  location: string;
  isOrganic: boolean | null;
  isVerified: boolean | null;
}

export const useMarketPrices = () => {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [filteredPrices, setFilteredPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const { toast } = useToast();

  const [filters, setFilters] = useState<MarketPriceFilters>({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    location: "",
    isOrganic: null,
    isVerified: null,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("commodity_categories")
        .select("*")
        .order("name");
      
      if (error) {
        console.error("Error fetching categories:", error);
        return;
      }
      
      setCategories(data);
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    let filtered = [...prices];

    if (filters.search) {
      filtered = filtered.filter(price => 
        price.commodity.toLowerCase().includes(filters.search.toLowerCase()) ||
        price.location.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.category) {
      filtered = filtered.filter(price => price.category_id === filters.category);
    }

    if (filters.minPrice) {
      filtered = filtered.filter(price => price.price >= parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(price => price.price <= parseFloat(filters.maxPrice));
    }

    if (filters.location) {
      filtered = filtered.filter(price => 
        price.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.isOrganic !== null) {
      filtered = filtered.filter(price => price.is_organic === filters.isOrganic);
    }

    if (filters.isVerified !== null) {
      filtered = filtered.filter(price => 
        filters.isVerified ? price.verified_at !== null : price.verified_at === null
      );
    }

    setFilteredPrices(filtered);
  }, [filters, prices]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // First, populate sample data if needed
        const { SampleDataService } = await import("@/services/SampleDataService");
        await SampleDataService.populateSampleData();

        const { data, error } = await supabase
          .from("market_prices")
          .select("*, category:commodity_categories(name)")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setPrices(data || []);
        setFilteredPrices(data || []);
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

    // Also fetch official market prices from the Kenya Agricultural Statistics API
    const fetchOfficialPrices = async () => {
      try {
        await KenyaAgriStatsService.fetchMarketPrices();
      } catch (error) {
        console.error("Error fetching official market prices:", error);
      }
    };
    
    fetchOfficialPrices();

    const channel = supabase
      .channel("market-prices-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
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

  return {
    prices,
    filteredPrices,
    loading,
    categories,
    filters,
    setFilters,
  };
};
