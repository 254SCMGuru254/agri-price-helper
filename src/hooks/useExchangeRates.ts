
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export interface ExchangeRates {
  KES: number;
  USD: number;
  EUR: number;
  GBP: number;
}

export const useExchangeRates = () => {
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(null);
  const [loadingRates, setLoadingRates] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        setExchangeRates({
          KES: data.rates.KES,
          USD: 1,
          EUR: data.rates.EUR,
          GBP: data.rates.GBP
        });
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
        toast({
          title: "Error",
          description: "Failed to load exchange rates",
          variant: "destructive",
        });
      } finally {
        setLoadingRates(false);
      }
    };

    fetchExchangeRates();
  }, [toast]);

  return { exchangeRates, loadingRates };
};
