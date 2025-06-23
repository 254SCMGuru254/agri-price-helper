import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import webpush from 'https://esm.sh/web-push@3.6.1'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY') || ''
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY') || ''
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

webpush.setVapidDetails(
  'mailto:support@agripricehelper.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
)

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

serve(async (req) => {
  try {
    const { notification, user_ids } = await req.json()

    if (!notification || !user_ids || !Array.isArray(user_ids)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Get user preferences and subscriptions
    const { data: subscriptions, error: subError } = await supabase
      .from('push_subscriptions')
      .select('user_id, subscription')
      .in('user_id', user_ids)
      .innerJoin(
        'notification_preferences',
        'push_subscriptions.user_id = notification_preferences.user_id'
      )
      .filter('notification_preferences.preferences->>' + notification.type, 'eq', 'true')

    if (subError) {
      throw subError
    }

    // Send notifications
    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          // Store notification in history
          await supabase
            .from('notifications')
            .insert({
              user_id: sub.user_id,
              title: notification.title,
              body: notification.body,
              type: notification.type,
              data: notification.data
            })

          // Send push notification
          await webpush.sendNotification(
            JSON.parse(sub.subscription),
            JSON.stringify({
              title: notification.title,
              body: notification.body,
              ...notification.data
            })
          )

          return { success: true, user_id: sub.user_id }
        } catch (error) {
          console.error(`Error sending notification to user ${sub.user_id}:`, error)
          
          // If subscription is invalid, remove it
          if (error.statusCode === 410) {
            await supabase
              .from('push_subscriptions')
              .delete()
              .eq('user_id', sub.user_id)
          }
          
          return { success: false, user_id: sub.user_id, error }
        }
      })
    )

    const successes = results.filter((r) => r.status === 'fulfilled' && r.value.success)
    const failures = results.filter((r) => r.status === 'rejected' || !r.value?.success)

    return new Response(
      JSON.stringify({
        message: `Sent ${successes.length} notifications, ${failures.length} failed`,
        successes,
        failures
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing notification request:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}) 