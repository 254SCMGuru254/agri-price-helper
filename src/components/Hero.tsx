import { ArrowRight, BookOpen, MessageSquare, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";

export const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAuthenticatedAction = (action: string, sectionId?: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access this feature",
      });
      navigate("/auth");
      return;
    }

    if (sectionId) {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate("/dashboard");
    }
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
          <div className="space-y-4">
            <MessageSquare className="h-12 w-12 mx-auto text-primary" />
            <h3 className="text-xl font-semibold">Expert Q&A</h3>
            <p className="text-muted-foreground">
              Connect with agricultural experts and get answers to your farming questions. Share knowledge and grow together.
            </p>
            <Button 
              variant="outline"
              onClick={() => handleAuthenticatedAction('Ask Experts', 'expert-qa')}
            >
              Ask Experts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <Users className="h-12 w-12 mx-auto text-primary" />
            <h3 className="text-xl font-semibold">Community Forum</h3>
            <p className="text-muted-foreground">
              Join discussions with fellow farmers, share experiences, and learn from the community's collective wisdom.
            </p>
            <Button 
              variant="outline"
              onClick={() => handleAuthenticatedAction('Join Discussion', 'community-forum')}
            >
              Join Discussion
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <Award className="h-12 w-12 mx-auto text-primary" />
            <h3 className="text-xl font-semibold">Success Stories</h3>
            <p className="text-muted-foreground">
              Read inspiring stories from farmers who've achieved remarkable results. Share your own success story!
            </p>
            <Button 
              variant="outline"
              onClick={() => handleAuthenticatedAction('Share Success', 'success-stories')}
            >
              Share Success
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={() => user ? navigate('/dashboard') : navigate('/auth')}
            className="bg-accent hover:bg-accent/90"
          >
            {user ? 'Go to Dashboard' : 'Get Started'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
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