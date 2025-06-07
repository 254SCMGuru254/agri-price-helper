
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
import { CommunityForum } from "@/components/CommunityForum";
import PriceMap from "@/components/PriceMap";
import { useMarketPrices } from "@/hooks/useMarketPrices";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Store, Award, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const { filteredPrices } = useMarketPrices();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        
        <div className="container mx-auto px-4 py-6 space-y-6 md:space-y-10">
          <div id="points" className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <UserPoints />
            </div>
            <div>
              <Card className="p-4 bg-primary/5 border-primary/20">
                <div className="text-center">
                  <Store className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold mb-2">Business Marketplace</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    List your farm, products or services. Top contributors get 3 months free featuring!
                  </p>
                  <Link to="/business-marketplace">
                    <Button size="sm" className="w-full">
                      Explore Marketplace
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
          
          <WeatherUpdates />
          
          <div id="market-prices">
            <AgriMarketAnalysis />
          </div>
          
          <Separator className="my-8" />
          
          <div id="analytics" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Connect directly with farmers and agricultural experts through these platforms:
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    <a 
                      href="https://wa.me/254700000000" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <span className="flex items-center">
                        <span className="text-green-600 mr-2">📱</span>
                        WhatsApp Community
                      </span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <a 
                      href="https://t.me/agriprice_kenya" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <span className="flex items-center">
                        <span className="text-blue-600 mr-2">✈️</span>
                        Telegram Channel
                      </span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <a 
                      href="tel:+254700000000" 
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <span className="flex items-center">
                        <span className="text-primary mr-2">📞</span>
                        Call Support: +254 700 000 000
                      </span>
                    </a>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <Separator className="my-8" />
          
          <div id="community">
            <CommunityForum />
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
