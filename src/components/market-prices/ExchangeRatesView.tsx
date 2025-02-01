import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ExchangeRatesViewProps {
  exchangeRates: {
    KES: number;
    USD: number;
    EUR: number;
    GBP: number;
  } | null;
  loadingRates: boolean;
}

export const ExchangeRatesView = ({ exchangeRates, loadingRates }: ExchangeRatesViewProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Current Exchange Rates</h2>
      {loadingRates ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : exchangeRates ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4 bg-primary/5">
            <p className="text-sm text-muted-foreground">USD/KES</p>
            <p className="text-2xl font-bold">{exchangeRates.KES.toFixed(2)}</p>
          </Card>
          <Card className="p-4 bg-primary/5">
            <p className="text-sm text-muted-foreground">USD/EUR</p>
            <p className="text-2xl font-bold">{exchangeRates.EUR.toFixed(2)}</p>
          </Card>
          <Card className="p-4 bg-primary/5">
            <p className="text-sm text-muted-foreground">USD/GBP</p>
            <p className="text-2xl font-bold">{exchangeRates.GBP.toFixed(2)}</p>
          </Card>
          <Card className="p-4 bg-primary/5">
            <p className="text-sm text-muted-foreground">Base Currency</p>
            <p className="text-2xl font-bold">USD</p>
          </Card>
        </div>
      ) : (
        <p className="text-center text-muted-foreground">Failed to load exchange rates</p>
      )}
      <p className="text-sm text-muted-foreground mt-4">
        Exchange rates are updated daily. Last updated: {new Date().toLocaleDateString()}
      </p>
    </Card>
  );
};