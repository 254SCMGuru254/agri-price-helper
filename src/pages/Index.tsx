
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { ExpertQA } from "@/components/ExpertQA";
import { CommunityForum } from "@/components/CommunityForum";
import { SuccessStories } from "@/components/SuccessStories";
import { UserPoints } from "@/components/UserPoints";
import { WeatherUpdates } from "@/components/WeatherUpdates";
import { AgriTimeSeriesChart } from "@/components/AgriTimeSeriesChart";
import { MarketPriceSubmission } from "@/components/MarketPriceSubmission";
import { MessagingContainer } from "@/components/messaging/MessagingContainer";
import { Card } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4">
        <Hero />
        <UserPoints />
        <div className="py-8">
          <AgriTimeSeriesChart />
        </div>
        
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Submit Market Prices</h2>
              <MarketPriceSubmission />
            </Card>
            
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Farmer Messaging</h2>
              <MessagingContainer />
            </Card>
          </div>
        </div>
        
        <div className="py-8 space-y-16">
          <WeatherUpdates />
          <ExpertQA />
          <CommunityForum />
          <SuccessStories />
        </div>
        <div id="features">
          <Features />
        </div>
        <div id="how-it-works">
          <HowItWorks />
        </div>
      </main>
    </div>
  );
};

export default Index;
