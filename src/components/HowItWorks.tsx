import { ClipboardList, Upload, CheckCircle, Share2 } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Submit Market Prices",
    description: "Share current prices for agricultural commodities in your area.",
  },
  {
    icon: CheckCircle,
    title: "Verify Information",
    description: "Help verify prices submitted by other community members.",
  },
  {
    icon: Share2,
    title: "Share Knowledge",
    description: "Contribute agricultural advice and best practices.",
  },
  {
    icon: ClipboardList,
    title: "Earn Points",
    description: "Get rewarded for your active participation in the community.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-foreground/80">
            Join our community and make a difference in agricultural information sharing
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <step.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="mb-2 text-xl font-semibold">{step.title}</div>
              <p className="text-foreground/70">{step.description}</p>
              <div className="mt-4 text-sm font-medium text-primary">Step {index + 1}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};