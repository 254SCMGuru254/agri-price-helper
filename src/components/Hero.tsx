import { ArrowRight, BookOpen, MessageSquare, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Empowering Farmers with Real-Time Market Insights
        </h1>
        <p className="text-xl text-foreground/80 mb-8 max-w-3xl mx-auto">
          Join our community to share and access up-to-date agricultural market prices and expert farming advice
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
          {/* Expert Q&A Section */}
          <div className="space-y-4">
            <MessageSquare className="h-12 w-12 mx-auto text-primary" />
            <h3 className="text-xl font-semibold">Expert Q&A</h3>
            <p className="text-muted-foreground">
              Connect with agricultural experts and get answers to your farming questions. Share knowledge and grow together.
            </p>
            <Button 
              variant="outline"
              onClick={() => scrollToSection('expert-qa')}
            >
              Ask Experts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Community Forum Section */}
          <div className="space-y-4">
            <Users className="h-12 w-12 mx-auto text-primary" />
            <h3 className="text-xl font-semibold">Community Forum</h3>
            <p className="text-muted-foreground">
              Join discussions with fellow farmers, share experiences, and learn from the community's collective wisdom.
            </p>
            <Button 
              variant="outline"
              onClick={() => scrollToSection('community-forum')}
            >
              Join Discussion
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Success Stories Section */}
          <div className="space-y-4">
            <Award className="h-12 w-12 mx-auto text-primary" />
            <h3 className="text-xl font-semibold">Success Stories</h3>
            <p className="text-muted-foreground">
              Read inspiring stories from farmers who've achieved remarkable results. Share your own success story!
            </p>
            <Button 
              variant="outline"
              onClick={() => scrollToSection('success-stories')}
            >
              Share Success
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={() => navigate('/auth')}
            className="bg-accent hover:bg-accent/90"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => scrollToSection('how-it-works')}
          >
            Learn More
            <BookOpen className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
    </section>
  );
};