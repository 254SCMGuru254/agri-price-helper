
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";

export const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAuthenticatedAction = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access this feature",
      });
      navigate("/auth");
      return;
    }

    navigate("/dashboard");
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Real Agricultural Market Prices for Kenyan Farmers
        </h1>
        <p className="text-xl text-foreground/80 mb-4 max-w-4xl mx-auto">
          Stop losing money to middlemen and outdated price information. Connect directly with other farmers, 
          share real-time market prices, and make informed selling decisions.
        </p>
        <p className="text-lg text-foreground/70 mb-8 max-w-3xl mx-auto">
          <strong>The Problem:</strong> Farmers across Kenya struggle with price transparency, often selling below market value. 
          <strong> Our Solution:</strong> A community-driven platform where farmers verify and share actual market prices, 
          helping everyone get fair value for their crops.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={handleAuthenticatedAction}
            className="bg-accent hover:bg-accent/90"
          >
            {user ? 'Go to Dashboard' : 'Join the Community'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => scrollToSection('how-it-works')}
          >
            Learn How It Works
            <BookOpen className="ml-2 h-5 w-5" />
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-background/50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2 text-green-600">🌾 For Farmers</h3>
            <p className="text-sm">Share and access real market prices from Nairobi, Mombasa, Kisumu, and other major markets</p>
          </div>
          <div className="bg-background/50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2 text-blue-600">📊 Real Data</h3>
            <p className="text-sm">Community-verified prices, weather updates, and agricultural advice specific to Kenyan conditions</p>
          </div>
          <div className="bg-background/50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2 text-orange-600">🤝 Community</h3>
            <p className="text-sm">Connect with fellow farmers, share experiences, and build a stronger agricultural network</p>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
    </section>
  );
};
