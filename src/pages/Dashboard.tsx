
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgriTimeSeriesChart } from "@/components/AgriTimeSeriesChart";
import { WeatherUpdates } from "@/components/WeatherUpdates";
import { UserPoints } from "@/components/UserPoints";
import { MarketPriceSubmission } from "@/components/MarketPriceSubmission";
import { MessagingContainer } from "@/components/messaging/MessagingContainer";
import { useAuth } from "@/components/AuthProvider";

const Dashboard = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.user_metadata?.full_name || "Farmer"}!
            </p>
          </div>
          <UserPoints />
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="submit">Submit Data</TabsTrigger>
            <TabsTrigger value="messaging">Messaging</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-8">
            <WeatherUpdates />
            <AgriTimeSeriesChart />
          </TabsContent>
          
          <TabsContent value="submit">
            <Card>
              <CardHeader>
                <CardTitle>Submit Market Prices</CardTitle>
                <CardDescription>Share current prices to help other farmers</CardDescription>
              </CardHeader>
              <CardContent>
                <MarketPriceSubmission />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="messaging">
            <Card>
              <CardHeader>
                <CardTitle>Farmer Messaging</CardTitle>
                <CardDescription>Connect with other farmers in the community</CardDescription>
              </CardHeader>
              <CardContent>
                <MessagingContainer />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
