import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { ChevronRight, ChevronLeft } from "lucide-react";

const steps = [
  {
    title: "Welcome to Agri Price Helper",
    description: "Get real-time market prices and agricultural advice from our community.",
  },
  {
    title: "Earn Rewards",
    description: "Watch ads, submit prices, and share advice to earn points that can be redeemed for benefits.",
  },
  {
    title: "Location Preferences",
    description: "Help us customize your experience by sharing your location.",
  },
];

export const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [location, setLocation] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleNext = async () => {
    if (currentStep === steps.length - 1) {
      try {
        await supabase
          .from("profiles")
          .update({ location })
          .eq("id", user?.id);
        
        toast({
          title: "Welcome aboard!",
          description: "Your preferences have been saved.",
        });
        
        navigate("/dashboard");
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to save preferences. Please try again.",
        });
      }
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-6 space-y-6 animate-fade-up">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold tracking-tight">
            {steps[currentStep].title}
          </h2>
          <p className="text-muted-foreground">
            {steps[currentStep].description}
          </p>
        </div>

        {currentStep === 2 && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Your Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your location"
              className="w-full p-2 border rounded-md"
            />
          </div>
        )}

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleNext}>
            {currentStep === steps.length - 1 ? "Get Started" : "Next"}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="flex justify-center space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === currentStep ? "bg-primary" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};