import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Bell, BellOff } from "lucide-react";
import { NotificationService } from "@/services/NotificationService";
import { useToast } from "@/hooks/use-toast";

export const NotificationPreferences = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState({
    price_changes: true,
    business_offers: true,
    community_activity: true,
    points_updates: true
  });
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) return;
      try {
        // Check if notifications are enabled
        const permission = await NotificationService.requestPermission();
        setIsSubscribed(permission);

        // Load preferences
        const prefs = await NotificationService.getNotificationPreferences(user.id);
        setPreferences(prefs);
      } catch (error) {
        console.error('Error loading notification preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [user]);

  const handleToggleSubscription = async () => {
    if (!user) return;

    try {
      if (!isSubscribed) {
        const permission = await NotificationService.requestPermission();
        if (permission) {
          await NotificationService.subscribeToPushNotifications(user.id);
          setIsSubscribed(true);
          toast({
            title: "Notifications Enabled",
            description: "You'll now receive important updates about prices and activity.",
          });
        }
      } else {
        await NotificationService.unsubscribeFromPushNotifications(user.id);
        setIsSubscribed(false);
        toast({
          title: "Notifications Disabled",
          description: "You won't receive any more notifications.",
        });
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
      toast({
        title: "Error",
        description: "Failed to update notification settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePreferenceChange = async (key: keyof typeof preferences) => {
    if (!user) return;

    const newPreferences = {
      ...preferences,
      [key]: !preferences[key]
    };

    try {
      await NotificationService.updateNotificationPreferences(user.id, newPreferences);
      setPreferences(newPreferences);
      toast({
        title: "Preferences Updated",
        description: "Your notification preferences have been saved.",
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: "Error",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) return <div>Loading preferences...</div>;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {isSubscribed ? (
            <Bell className="h-5 w-5 text-primary" />
          ) : (
            <BellOff className="h-5 w-5 text-muted-foreground" />
          )}
          <h3 className="font-medium">Notification Preferences</h3>
        </div>
        <Switch
          checked={isSubscribed}
          onCheckedChange={handleToggleSubscription}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm">Price Changes</label>
          <Switch
            checked={preferences.price_changes}
            onCheckedChange={() => handlePreferenceChange('price_changes')}
            disabled={!isSubscribed}
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm">Business Offers</label>
          <Switch
            checked={preferences.business_offers}
            onCheckedChange={() => handlePreferenceChange('business_offers')}
            disabled={!isSubscribed}
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm">Community Activity</label>
          <Switch
            checked={preferences.community_activity}
            onCheckedChange={() => handlePreferenceChange('community_activity')}
            disabled={!isSubscribed}
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm">Points Updates</label>
          <Switch
            checked={preferences.points_updates}
            onCheckedChange={() => handlePreferenceChange('points_updates')}
            disabled={!isSubscribed}
          />
        </div>
      </div>

      {!isSubscribed && (
        <p className="text-xs text-muted-foreground mt-4">
          Enable notifications to stay updated on price changes, business offers, and community activity.
        </p>
      )}
    </Card>
  );
}; 