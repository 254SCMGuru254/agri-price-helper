
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Users, TrendingUp, Target } from "lucide-react";

const Sponsors = () => {
  const sponsorshipTiers = [
    {
      name: "Premium Partner",
      price: "KSh 50,000/month",
      features: [
        "Logo placement on homepage",
        "Featured business profile",
        "Direct messaging to farmers",
        "Market insights dashboard",
        "Priority customer support"
      ],
      color: "bg-yellow-500"
    },
    {
      name: "Community Supporter", 
      price: "KSh 25,000/month",
      features: [
        "Business listing in directory",
        "Access to farmer network",
        "Monthly performance reports",
        "Standard customer support"
      ],
      color: "bg-blue-500"
    },
    {
      name: "Input Supplier",
      price: "KSh 15,000/month", 
      features: [
        "Product listings",
        "Seasonal promotions",
        "Basic analytics",
        "Email support"
      ],
      color: "bg-green-500"
    }
  ];

  const benefits = [
    {
      icon: Users,
      title: "Access to 10,000+ Active Farmers",
      description: "Reach farmers across Kenya who are actively engaged in agricultural markets"
    },
    {
      icon: TrendingUp,
      title: "Data-Driven Insights",
      description: "Get valuable market intelligence and farmer behavior analytics"
    },
    {
      icon: Target,
      title: "Targeted Marketing",
      description: "Reach farmers based on location, crop type, and farming practices"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Partner with AgriPrice Kenya</h1>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            Connect your business with Kenya's most engaged farming community. 
            Support agricultural development while growing your business.
          </p>
        </div>

        {/* Why Partner With Us */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Why Partner With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="p-6 text-center">
                <benefit.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-foreground/70">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Partnership Tiers */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Partnership Opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sponsorshipTiers.map((tier) => (
              <Card key={tier.name} className="p-6 relative">
                <Badge className={`${tier.color} text-white mb-4`}>
                  {tier.name}
                </Badge>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{tier.price}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full">
                  Get Started
                </Button>
              </Card>
            ))}
          </div>
        </section>

        {/* Current Partners */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Partners</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "KenGen Foundation", type: "Development Partner" },
              { name: "Equity Bank", type: "Financial Partner" },
              { name: "Kenya Seed Company", type: "Input Supplier" },
              { name: "Safaricom", type: "Technology Partner" }
            ].map((partner) => (
              <Card key={partner.name} className="p-4 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3"></div>
                <h3 className="font-semibold">{partner.name}</h3>
                <p className="text-sm text-foreground/70">{partner.type}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Information */}
        <section className="bg-muted/50 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Ready to Partner?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <Mail className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Email Us</h3>
              <p className="text-foreground/70">partnerships@agriprice.ke</p>
            </div>
            <div>
              <Phone className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Call Us</h3>
              <p className="text-foreground/70">+254 700 123 456</p>
            </div>
            <div>
              <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Visit Us</h3>
              <p className="text-foreground/70">Nairobi, Kenya</p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Button size="lg">
              Schedule a Partnership Meeting
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Sponsors;
