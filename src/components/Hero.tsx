import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-center px-4 animate-fade-in">
      <div className="max-w-3xl text-center space-y-6">
        <span className="px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full">
          Community-Driven Agricultural Insights
        </span>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Empowering Farmers with Real-Time Market Intelligence
        </h1>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          Access community-verified market prices and expert agricultural advice - all in one place, completely free.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
};