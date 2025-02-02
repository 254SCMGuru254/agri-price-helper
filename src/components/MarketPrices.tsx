import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Check, X } from "lucide-react";
import PriceMap from "./PriceMap";
import { CarouselView } from "./market-prices/CarouselView";
import { ListView } from "./market-prices/ListView";
import { ExchangeRatesView } from "./market-prices/ExchangeRatesView";
import { PriceTicker } from "./market-prices/PriceTicker";

type MarketPrice = Database["public"]["Tables"]["market_prices"]["Row"];
type Category = Database["public"]["Tables"]["commodity_categories"]["Row"];
type ExchangeRates = {
  KES: number;
  USD: number;
  EUR: number;
  GBP: number;
};

export const MarketPrices = () => {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [filteredPrices, setFilteredPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(null);
  const [loadingRates, setLoadingRates] = useState(true);
  const { toast } = useToast();

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    location: "",
    isOrganic: null as boolean | null,
    isVerified: null as boolean | null,
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

  // Apply filters
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

  // Group prices by location
  const pricesByLocation = filteredPrices.reduce((acc, price) => {
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

    // Subscribe to real-time updates
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

  const handleShare = async (price: MarketPrice) => {
    const shareData = {
      title: `Market Price: ${price.commodity}`,
      text: `Check out the price of ${price.commodity} in ${price.location}: $${price.price}/${price.unit}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `${shareData.title}\n${shareData.text}\n${shareData.url}`
        );
        toast({
          title: "Copied to clipboard",
          description: "Share link has been copied to your clipboard",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  if (loading) {
    return <div className="text-center">Loading market prices...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Input
            placeholder="Search commodities..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
          <Select
            value={filters.category}
            onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="Min price"
            value={filters.minPrice}
            onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
          />
          <Input
            type="number"
            placeholder="Max price"
            value={filters.maxPrice}
            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
          />
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge
            variant={filters.isOrganic === true ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilters(prev => ({ ...prev, isOrganic: prev.isOrganic === true ? null : true }))}
          >
            Organic
          </Badge>
          <Badge
            variant={filters.isOrganic === false ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilters(prev => ({ ...prev, isOrganic: prev.isOrganic === false ? null : false }))}
          >
            Non-Organic
          </Badge>
          <Badge
            variant={filters.isVerified === true ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilters(prev => ({ ...prev, isVerified: prev.isVerified === true ? null : true }))}
          >
            Verified
          </Badge>
          <Badge
            variant={filters.isVerified === false ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilters(prev => ({ ...prev, isVerified: prev.isVerified === false ? null : false }))}
          >
            Unverified
          </Badge>
        </div>
      </div>

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
          <CarouselView prices={filteredPrices} onShare={handleShare} />
        </TabsContent>
        
        <TabsContent value="list">
          <ListView prices={filteredPrices} onShare={handleShare} />
        </TabsContent>
        
        <TabsContent value="map">
          <PriceMap prices={filteredPrices} />
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