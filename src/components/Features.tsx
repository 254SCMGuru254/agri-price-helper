import { Sprout, TrendingUp, Users, Map } from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "Real-Time Market Prices",
    description: "Access up-to-date agricultural commodity prices verified by the community.",
  },
  {
    icon: Sprout,
    title: "Agricultural Advice",
    description: "Get location-specific farming tips and best practices.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Contribute and verify market prices to help fellow farmers.",
  },
  {
    icon: Map,
    title: "Location Based",
    description: "Find relevant prices and advice for your specific region.",
  },
];

export const Features = () => {
  return (
    <section className="py-20 px-4 bg-secondary/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Our Platform?</h2>
          <p className="text-foreground/80">
            Everything you need to make informed farming decisions
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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