import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Award } from "lucide-react";

export const UserPoints = () => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['user-points', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('points')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  if (!user || !profile) return null;

  return (
    <Card className="p-4 bg-primary/5">
      <div className="flex items-center gap-2">
        <Award className="h-5 w-5 text-primary" />
        <div>
          <p className="font-medium">Your Points</p>
          <p className="text-2xl font-bold text-primary">{profile.points || 0}</p>
        </div>
      </div>
    </Card>
  );
};