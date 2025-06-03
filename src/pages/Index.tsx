
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { UserPoints } from "@/components/UserPoints";
import { WeatherUpdates } from "@/components/WeatherUpdates";
import { AgriAnalyticsDashboard } from "@/components/agri-chart/AgriAnalyticsDashboard";
import { Card } from "@/components/ui/card";
import { MarketPriceSubmission } from "@/components/MarketPriceSubmission";
import { FarmerContact } from "@/components/FarmerContact";
import { AgriMarketAnalysis } from "@/components/AgriMarketAnalysis";
import PriceMap from "@/components/PriceMap";
import { useMarketPrices } from "@/hooks/useMarketPrices";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  const { filteredPrices } = useMarketPrices();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        
        <div className="container mx-auto px-4 py-6 space-y-6 md:space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <UserPoints />
            </div>
          </div>
          
          <WeatherUpdates />
          
          <AgriMarketAnalysis />
          
          <Separator className="my-8" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <AgriAnalyticsDashboard />
            
              <Card className="p-4 md:p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4">Submit Market Prices</h2>
                <MarketPriceSubmission />
              </Card>
            </div>
            
            <div className="space-y-6">
              <div className="h-[500px]">
                <PriceMap prices={filteredPrices} height="100%" />
              </div>
              
              <Card className="p-4 md:p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4">Connect with Farmers</h2>
                <FarmerContact />
              </Card>
            </div>
          </div>
        </div>
        
        <div id="features" className="py-10 bg-muted/30 mt-8">
          <Features />
        </div>
        
        <div id="how-it-works" className="py-10">
          <HowItWorks />
        </div>
      </main>
    </div>
  );
};

export default Index;
