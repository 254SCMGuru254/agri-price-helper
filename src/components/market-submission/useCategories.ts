
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Category = Database["public"]["Tables"]["commodity_categories"]["Row"];

export const useCategories = (isOffline: boolean) => {
  const [categories, setCategories] = useState<Category[]>([]);

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

  return categories;
};
