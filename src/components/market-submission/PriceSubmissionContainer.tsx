
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { OfflineNotice } from "./OfflineNotice";
import { PriceForm } from "./PriceForm";
import { useCategories } from "./useCategories";
import { useOfflineSync } from "./useOfflineSync";
import { useOnlineStatus } from "./useOnlineStatus";
import { RealMarketDataService } from "@/services/RealMarketDataService";

export const PriceSubmissionContainer = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isOffline = useOnlineStatus();
  const categories = useCategories(isOffline);
  
  // Initialize form data
  const [formData, setFormData] = useState({
    commodity: "",
    price: "",
    unit: "kg",
    location: "",
    is_organic: false,
    category_id: "",
  });

  // Use the offline sync hook
  useOfflineSync(isOffline, user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user && !isOffline) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit market prices",
        variant: "destructive",
      });
      return;
    }

    if (!formData.commodity || !formData.price || !formData.location) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const priceData = {
        commodity: formData.commodity.trim(),
        price: parseFloat(formData.price),
        unit: formData.unit,
        location: formData.location.trim(),
        is_organic: formData.is_organic,
        user_id: user?.id || 'offline-user',
      };

      if (isOffline) {
        const offlinePrices = JSON.parse(localStorage.getItem('offline_prices') || '[]');
        offlinePrices.push({
          ...priceData,
          category_id: formData.category_id || null,
          created_at: new Date().toISOString(),
          pending: true
        });
        localStorage.setItem('offline_prices', JSON.stringify(offlinePrices));
        
        toast({
          title: "Saved offline",
          description: "Your price has been saved locally and will be submitted when you're back online",
        });
      } else {
        // Submit the price using the RealMarketDataService
        const result = await RealMarketDataService.submitMarketPrice(priceData);

        if (result.success && result.id) {
          // Update with category if one was selected
          if (formData.category_id) {
            const { error: categoryError } = await supabase
              .from('market_prices')
              .update({ category_id: formData.category_id })
              .eq('id', result.id);

            if (categoryError) {
              console.warn('Failed to update category:', categoryError);
            }
          }

          toast({
            title: "Success!",
            description: "Market price submitted successfully and is pending verification",
          });
        } else {
          throw new Error(result.error || "Submission failed");
        }
      }

      // Reset form
      setFormData({
        commodity: "",
        price: "",
        unit: "kg",
        location: "",
        is_organic: false,
        category_id: "",
      });
    } catch (error) {
      console.error("Error submitting market price:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit market price. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <OfflineNotice isOffline={isOffline} />
      <PriceForm
        formData={formData}
        setFormData={setFormData}
        categories={categories}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
