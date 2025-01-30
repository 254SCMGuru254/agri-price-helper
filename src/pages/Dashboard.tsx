import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { Award, TrendingUp, BookOpen } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Welcome back!</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Market Prices</h3>
                <p className="text-sm text-muted-foreground">View latest prices</p>
              </div>
            </div>
            <Button className="w-full mt-4">View Prices</Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <BookOpen className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Agricultural Advice</h3>
                <p className="text-sm text-muted-foreground">Get expert tips</p>
              </div>
            </div>
            <Button className="w-full mt-4">View Advice</Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <Award className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Rewards</h3>
                <p className="text-sm text-muted-foreground">View your points</p>
              </div>
            </div>
            <Button className="w-full mt-4">View Rewards</Button>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;