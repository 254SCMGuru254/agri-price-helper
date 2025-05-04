
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketFilters } from "./market-prices/MarketFilters";
import PriceMap from "./PriceMap";
import { CarouselView } from "./market-prices/CarouselView";
import { ListView } from "./market-prices/ListView";
import { ExchangeRatesView } from "./market-prices/ExchangeRatesView";
import { PriceTickerSection } from "./market-prices/PriceTickerSection";
import { useMarketPrices } from "@/hooks/useMarketPrices";
import { useExchangeRates } from "@/hooks/useExchangeRates";
import { usePriceSharing } from "./market-prices/PriceSharing";

export const MarketPrices = () => {
  const { 
    filteredPrices, 
    loading, 
    categories, 
    filters, 
    setFilters 
  } = useMarketPrices();
  
  const { exchangeRates, loadingRates } = useExchangeRates();
  const { handleShare } = usePriceSharing();

  if (loading) {
    return <div className="text-center">Loading market prices...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 p-4">
        <MarketFilters
          filters={filters}
          categories={categories}
          onFilterChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))}
        />
      </div>

      <PriceTickerSection filteredPrices={filteredPrices} />

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
