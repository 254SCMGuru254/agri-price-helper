import { supabase } from "@/integrations/supabase/client";

export class NotificationService {
  private static vapidPublicKey = 'YOUR_VAPID_PUBLIC_KEY'; // Replace with actual VAPID key

  static async requestPermission() {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  static async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        return registration;
      } catch (error) {
        console.error('Service worker registration failed:', error);
        return null;
      }
    }
    return null;
  }

  static async subscribeToPushNotifications(userId: string) {
    const registration = await this.registerServiceWorker();
    if (!registration) return null;

    try {
      let subscription = await registration.pushManager.getSubscription();
      
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.vapidPublicKey
        });
      }

      // Store subscription in database
      const { error } = await supabase
        .from('push_subscriptions')
        .upsert({
          user_id: userId,
          subscription: subscription.toJSON(),
          created_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;
      return subscription;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      return null;
    }
  }

  static async unsubscribeFromPushNotifications(userId: string) {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      await subscription.unsubscribe();
      
      // Remove subscription from database
      await supabase
        .from('push_subscriptions')
        .delete()
        .eq('user_id', userId);
    }
  }

  // Notification preferences
  static async updateNotificationPreferences(userId: string, preferences: {
    price_changes: boolean;
    business_offers: boolean;
    community_activity: boolean;
    points_updates: boolean;
  }) {
    const { error } = await supabase
      .from('notification_preferences')
      .upsert({
        user_id: userId,
        preferences,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (error) throw error;
  }

  static async getNotificationPreferences(userId: string) {
    const { data, error } = await supabase
      .from('notification_preferences')
      .select('preferences')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data?.preferences || {
      price_changes: true,
      business_offers: true,
      community_activity: true,
      points_updates: true
    };
  }
} 