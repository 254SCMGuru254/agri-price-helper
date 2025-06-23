import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgriTimeSeriesChart } from "@/components/AgriTimeSeriesChart";
import { WeatherUpdates } from "@/components/WeatherUpdates";
import { UserPoints } from "@/components/UserPoints";
import { MarketPriceSubmission } from "@/components/MarketPriceSubmission";
import { MessagingContainer } from "@/components/messaging/MessagingContainer";
import { NotificationPreferences } from "@/components/NotificationPreferences";
import { useAuth } from "@/components/AuthProvider";
import { FarmerCollaboration } from "@/components/collaboration/FarmerCollaboration";

const Dashboard = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="prices">Market Prices</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <UserPoints />
              <WeatherUpdates />
              <AgriTimeSeriesChart />
            </div>
          </TabsContent>

          <TabsContent value="prices">
            <Card>
              <CardHeader>
                <CardTitle>Submit Market Prices</CardTitle>
                <CardDescription>
                  Share current agricultural commodity prices from your area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MarketPriceSubmission />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <NotificationPreferences />
            <MessagingContainer />
          </TabsContent>
        </Tabs>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <FarmerCollaboration />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
