import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import type { Database } from "@/integrations/supabase/types";

type Category = Database["public"]["Tables"]["commodity_categories"]["Row"];

export const MarketPriceSubmission = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [formData, setFormData] = useState({
    commodity: "",
    price: "",
    unit: "kg",
    location: "",
    is_organic: false,
    category_id: "",
  });

  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOffline(!navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const cachedCategories = localStorage.getItem('commodity_categories');
      if (cachedCategories) {
        setCategories(JSON.parse(cachedCategories));
      }

      if (navigator.onLine) {
        try {
          const { data, error } = await supabase
            .from("commodity_categories")
            .select("*")
            .order("name");
          
          if (error) {
            console.error("Error fetching categories:", error);
            return;
          }
          
          localStorage.setItem('commodity_categories', JSON.stringify(data));
          setCategories(data);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      }
    };

    fetchCategories();
  }, [isOffline]);

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

    setIsSubmitting(true);
    try {
      const priceData = {
        commodity: formData.commodity,
        price: parseFloat(formData.price),
        unit: formData.unit,
        location: formData.location,
        is_organic: formData.is_organic,
        submitted_by: user?.id || 'offline-user',
        category_id: formData.category_id || null,
      };

      if (isOffline) {
        const offlinePrices = JSON.parse(localStorage.getItem('offline_prices') || '[]');
        offlinePrices.push({
          ...priceData,
          created_at: new Date().toISOString(),
          pending: true
        });
        localStorage.setItem('offline_prices', JSON.stringify(offlinePrices));
        
        toast({
          title: "Saved offline",
          description: "Your price has been saved locally and will be submitted when you're back online",
        });
      } else {
        const { error } = await supabase.from("market_prices").insert(priceData);

        if (error) throw error;

        toast({
          title: "Success!",
          description: "Market price submitted successfully",
        });
      }

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
        description: "Failed to submit market price. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const syncOfflineData = async () => {
    if (!navigator.onLine || !user) return;
    
    const offlinePrices = JSON.parse(localStorage.getItem('offline_prices') || '[]');
    if (offlinePrices.length === 0) return;
    
    let successCount = 0;
    const failedSubmissions = [];
    
    for (const price of offlinePrices) {
      price.submitted_by = user.id;
      
      try {
        const { error } = await supabase.from("market_prices").insert(price);
        if (error) {
          failedSubmissions.push(price);
        } else {
          successCount++;
        }
      } catch (error) {
        failedSubmissions.push(price);
      }
    }
    
    localStorage.setItem('offline_prices', JSON.stringify(failedSubmissions));
    
    if (successCount > 0) {
      toast({
        title: "Offline Data Synced",
        description: `Successfully submitted ${successCount} saved prices`,
      });
    }
  };

  useEffect(() => {
    if (!isOffline && user) {
      syncOfflineData();
    }
  }, [isOffline, user]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto p-6">
      {isOffline && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
          <p className="text-yellow-700">
            You're currently offline. Your submissions will be saved locally and submitted when you're back online.
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={formData.category_id}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, category_id: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="commodity">Commodity</Label>
        <Input
          id="commodity"
          required
          value={formData.commodity}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, commodity: e.target.value }))
          }
          placeholder="e.g., Tomatoes"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          required
          min="0"
          step="0.01"
          value={formData.price}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, price: e.target.value }))
          }
          placeholder="0.00"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="unit">Unit</Label>
        <Select
          value={formData.unit}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, unit: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select unit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="kg">Kilogram (kg)</SelectItem>
            <SelectItem value="g">Gram (g)</SelectItem>
            <SelectItem value="ton">Ton</SelectItem>
            <SelectItem value="piece">Piece</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          required
          value={formData.location}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, location: e.target.value }))
          }
          placeholder="e.g., Nairobi"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="organic"
          checked={formData.is_organic}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, is_organic: checked }))
          }
        />
        <Label htmlFor="organic">Organic Product</Label>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Price"}
      </Button>
    </form>
  );
};
