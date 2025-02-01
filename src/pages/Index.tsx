import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { ExpertQA } from "@/components/ExpertQA";
import { CommunityForum } from "@/components/CommunityForum";
import { SuccessStories } from "@/components/SuccessStories";
import { UserPoints } from "@/components/UserPoints";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4">
        <Hero />
        <UserPoints />
        <div className="py-12 space-y-16">
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