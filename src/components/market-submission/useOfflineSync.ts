
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { User } from "@supabase/supabase-js";

export const useOfflineSync = (isOffline: boolean, user: User | null) => {
  const { toast } = useToast();

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

  return { syncOfflineData };
};
