
import { Sprout, TrendingUp, Users, Map, Shield, Clock } from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "Real Market Prices",
    description: "Access verified prices from Nairobi, Mombasa, Kisumu, and other major Kenyan markets updated daily by farmers.",
  },
  {
    icon: Users,
    title: "Farmer Community",
    description: "Connect with over 10,000 active farmers across Kenya. Share experiences and learn from each other.",
  },
  {
    icon: Shield,
    title: "Verified Information",
    description: "All price data is community-verified and cross-checked with official market sources for accuracy.",
  },
  {
    icon: Clock,
    title: "Timely Alerts",
    description: "Get notifications about price changes, weather updates, and market opportunities in your area.",
  },
  {
    icon: Sprout,
    title: "Crop-Specific Advice",
    description: "Receive farming tips for maize, beans, potatoes, tomatoes, and other crops suited to Kenyan conditions.",
  },
  {
    icon: Map,
    title: "Location-Based Data",
    description: "Find prices and advice specific to your county and region across all 47 counties in Kenya.",
  },
];

export const Features = () => {
  return (
    <section className="py-20 px-4 bg-secondary/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Built for Kenyan Farmers</h2>
          <p className="text-foreground/80">
            Everything you need to make profitable farming decisions in Kenya's agricultural markets
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 bg-background rounded-lg shadow-sm hover:shadow-md transition-shadow animate-fade-up"
            >
              <feature.icon className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-foreground/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
