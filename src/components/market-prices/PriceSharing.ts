
import { useToast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";

type MarketPrice = Database["public"]["Tables"]["market_prices"]["Row"];

export const usePriceSharing = () => {
  const { toast } = useToast();

  const handleShare = async (price: MarketPrice) => {
    const shareData = {
      title: `Market Price: ${price.commodity}`,
      text: `Check out the price of ${price.commodity} in ${price.location}: $${price.price}/${price.unit}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `${shareData.title}\n${shareData.text}\n${shareData.url}`
        );
        toast({
          title: "Copied to clipboard",
          description: "Share link has been copied to your clipboard",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return { handleShare };
};
