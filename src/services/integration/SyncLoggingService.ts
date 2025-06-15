
import { supabase } from "@/integrations/supabase/client";
import type { DataSyncResult } from "./types";

export class SyncLoggingService {
  static async logSyncActivity(activityType: string, result: DataSyncResult) {
    try {
      await supabase
        .from('sync_logs')
        .insert({
          activity_type: activityType,
          records_processed: result.recordsProcessed,
          success: result.success,
          errors: result.errors,
          created_at: result.lastSync
        });
    } catch (error) {
      console.error('Failed to log sync activity:', error);
    }
  }
}
