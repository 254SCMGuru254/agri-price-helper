
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { UserPoints } from "@/components/UserPoints";
import { WeatherUpdates } from "@/components/WeatherUpdates";
import { AgriAnalyticsDashboard } from "@/components/agri-chart/AgriAnalyticsDashboard";
import { Card } from "@/components/ui/card";
import { MarketPriceSubmission } from "@/components/MarketPriceSubmission";
import { MessagingContainer } from "@/components/messaging/MessagingContainer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        
        <div className="container mx-auto px-4 py-8 space-y-8 md:space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <UserPoints />
            </div>
          </div>
          
          <WeatherUpdates />
          
          <AgriAnalyticsDashboard />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h2 className="text-xl md:text-2xl font-bold mb-4">Submit Market Prices</h2>
              <MarketPriceSubmission />
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl md:text-2xl font-bold mb-4">Farmer Messaging</h2>
              <MessagingContainer />
            </Card>
          </div>
        </div>
        
        <div id="features" className="py-12 bg-muted/30">
          <Features />
        </div>
        
        <div id="how-it-works" className="py-12">
          <HowItWorks />
        </div>
      </main>
    </div>
  );
};

export default Index;
