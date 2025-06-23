import { useAuth } from "@/components/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Award, Users, MessageSquare, Share, Flag, Gift, Coins, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export const UserPoints = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showRedeemDialog, setShowRedeemDialog] = useState(false);

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

  const { data: redeemHistory } = useQuery({
    queryKey: ['redeem-history', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('point_redemptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const redeemMutation = useMutation({
    mutationFn: async (redemption: { type: string, points: number }) => {
      if (!user?.id) throw new Error('Must be logged in');
      
      const { data: currentPoints } = await supabase
        .from('profiles')
        .select('points')
        .eq('id', user.id)
        .single();
      
      if (!currentPoints || currentPoints.points < redemption.points) {
        throw new Error('Insufficient points');
      }

      const { error: redemptionError } = await supabase
        .from('point_redemptions')
        .insert({
          user_id: user.id,
          redemption_type: redemption.type,
          points_spent: redemption.points,
          status: 'pending'
        });

      if (redemptionError) throw redemptionError;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ points: currentPoints.points - redemption.points })
        .eq('id', user.id);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-points'] });
      queryClient.invalidateQueries({ queryKey: ['redeem-history'] });
      setShowRedeemDialog(false);
      toast({
        title: "Success!",
        description: "Your redemption request has been submitted. Our team will process it within 24 hours.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const pointActivities = [
    { icon: MessageSquare, label: "Market Price Submission", points: 10 },
    { icon: Users, label: "Forum Discussion", points: 5 },
    { icon: Share, label: "Success Story", points: 15 },
    { icon: Flag, label: "Report/Verify Price", points: 8 },
    { icon: Users, label: "Invite a Friend", points: 25 },
    { icon: Share, label: "Share News/Article", points: 12 },
    { icon: Gift, label: "Receive Shared Points", points: "varies" }
  ];

  const redeemOptions = [
    { type: "cash_out", label: "Cash Out (M-Pesa)", points: 1000, value: "KES 500" },
    { type: "featured_listing", label: "3 Months Featured Listing", points: 2000, value: "Worth KES 2000" },
    { type: "discount_coupon", label: "Input Supplier Discount", points: 500, value: "10% off" },
    { type: "premium_access", label: "1 Month Premium Access", points: 1500, value: "Worth KES 1000" }
  ];

  if (!user || !profile) return null;

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-primary/5">
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium">Your Points</p>
            <p className="text-2xl font-bold text-primary">{profile.points || 0}</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-auto"
            onClick={() => setShowRedeemDialog(true)}
          >
            <Coins className="h-4 w-4 mr-1" />
            Redeem Points
          </Button>
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

      {redeemHistory && redeemHistory.length > 0 && (
        <Card className="p-4">
          <h3 className="font-medium mb-3">Recent Redemptions</h3>
          <div className="space-y-2">
            {redeemHistory.map((redemption) => (
              <div key={redemption.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  <span>{redemption.redemption_type.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary">-{redemption.points_spent} points</span>
                  <Badge variant={redemption.status === 'completed' ? 'default' : 'secondary'}>
                    {redemption.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Dialog open={showRedeemDialog} onOpenChange={setShowRedeemDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redeem Your Points</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {redeemOptions.map((option) => (
              <Card key={option.type} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{option.label}</h4>
                    <p className="text-sm text-muted-foreground">{option.value}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!profile.points || profile.points < option.points}
                    onClick={() => redeemMutation.mutate(option)}
                  >
                    Redeem ({option.points} points)
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
