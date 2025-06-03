
import { supabase } from "@/integrations/supabase/client";

export class SampleDataService {
  static async populateSampleData() {
    // Sample data removed as requested - app will only use farmer submitted data
    console.log('Sample data population disabled - using only farmer submitted data');
    return;
  }

  static async clearSampleData() {
    try {
      const { error } = await supabase
        .from('market_prices')
        .delete()
        .eq('submitted_by', 'sample-user');

      if (error) {
        console.error('Error clearing sample data:', error);
      } else {
        console.log('Sample data cleared successfully');
      }
    } catch (error) {
      console.error('Error clearing sample data:', error);
    }
  }
}
