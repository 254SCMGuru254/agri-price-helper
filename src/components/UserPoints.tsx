
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Award, Users, MessageSquare, Share, Flag, Gift } from "lucide-react";

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

  const pointActivities = [
    { icon: MessageSquare, label: "Market Price Submission", points: 10 },
    { icon: Users, label: "Forum Discussion", points: 5 },
    { icon: Share, label: "Success Story", points: 15 },
    { icon: Flag, label: "Report/Verify Price", points: 8 },
    { icon: Users, label: "Invite a Friend", points: 25 },
    { icon: Share, label: "Share News/Article", points: 12 },
    { icon: Gift, label: "Receive Shared Points", points: "varies" }
  ];

  return (
    <Card className="p-4 bg-primary/5">
      <div className="flex items-center gap-2 mb-4">
        <Award className="h-5 w-5 text-primary" />
        <div>
          <p className="font-medium">Your Points</p>
          <p className="text-2xl font-bold text-primary">{profile.points || 0}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">How to Earn Points:</p>
        <div className="grid grid-cols-1 gap-1">
          {pointActivities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <activity.icon className="h-3 w-3" />
                <span>{activity.label}</span>
              </div>
              <span className="font-medium text-primary">+{activity.points}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          💡 Top 3 contributors monthly get <strong>3 months FREE</strong> business featuring!
        </p>
      </div>
    </Card>
  );
};
