
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Crown, Zap } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PayPalFeatureUpgradeProps {
  businessId: string;
}

export const PayPalFeatureUpgrade: React.FC<PayPalFeatureUpgradeProps> = ({ businessId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const handlePayPalPayment = async (duration: number, amount: number) => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Create payment record
      const { data: payment, error: paymentError } = await supabase
        .from('featured_payments')
        .insert({
          business_listing_id: businessId,
          user_id: user.id,
          payment_method: 'paypal',
          amount: amount,
          duration_months: duration,
          currency: 'USD'
        })
        .select()
        .single();

      if (paymentError) throw paymentError;

      // Create PayPal payment
      const response = await supabase.functions.invoke('create-paypal-payment', {
        body: {
          amount: amount,
          currency: 'USD',
          description: `Feature business listing for ${duration} month(s)`,
          payment_id: payment.id,
          business_id: businessId
        }
      });

      if (response.error) throw response.error;
      
      const paypalData = response.data;
      
      if (paypalData.links) {
        // Update payment with PayPal order ID
        await supabase
          .from('featured_payments')
          .update({ paypal_order_id: paypalData.id })
          .eq('id', payment.id);

        // Redirect to PayPal
        const approvalUrl = paypalData.links.find((link: any) => link.rel === 'approve')?.href;
        if (approvalUrl) {
          window.location.href = approvalUrl;
        }
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!showUpgrade) {
    return (
      <Button 
        size="sm" 
        variant="outline" 
        onClick={() => setShowUpgrade(true)}
        className="w-full border-primary text-primary hover:bg-primary hover:text-white"
      >
        <Star className="h-3 w-3 mr-1" />
        Feature This Listing
      </Button>
    );
  }

  return (
    <Card className="border-primary">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center">
          <Crown className="h-4 w-4 mr-1 text-primary" />
          Feature Your Business
        </CardTitle>
        <CardDescription className="text-xs">
          Get more visibility with featured placement!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between items-center p-2 border rounded border-primary bg-primary/5">
            <div>
              <p className="font-medium text-sm flex items-center">
                <Zap className="h-3 w-3 mr-1" />
                3 Months Featured
              </p>
              <p className="text-xs text-muted-foreground">Best value! Top placement</p>
            </div>
            <div className="text-right">
              <Badge className="bg-primary">$20.00</Badge>
              <Button 
                size="sm" 
                onClick={() => handlePayPalPayment(3, 20.00)}
                disabled={loading}
                className="ml-2 mt-1"
              >
                {loading ? 'Processing...' : 'Pay Now'}
              </Button>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
          <p className="font-medium mb-1">💡 Pro Tip:</p>
          <p>Top contributors get 3 months FREE featuring! Submit market prices, share advice, and engage with the community to earn points.</p>
        </div>

        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowUpgrade(false)}
          className="w-full text-xs"
        >
          Maybe Later
        </Button>
      </CardContent>
    </Card>
  );
};
