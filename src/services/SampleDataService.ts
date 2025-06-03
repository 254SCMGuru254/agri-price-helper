
import { supabase } from "@/integrations/supabase/client";

// Sample market data for demonstration
const SAMPLE_MARKET_DATA = [
  {
    commodity: "Maize",
    price: 45.00,
    unit: "kg",
    location: "Nairobi City Market",
    is_organic: false,
    submitted_by: "sample-user",
    status: "verified"
  },
  {
    commodity: "Tomatoes",
    price: 80.00,
    unit: "kg", 
    location: "Kisumu Central Market",
    is_organic: false,
    submitted_by: "sample-user",
    status: "verified"
  },
  {
    commodity: "Beans",
    price: 120.00,
    unit: "kg",
    location: "Mombasa Municipal Market", 
    is_organic: true,
    submitted_by: "sample-user",
    status: "verified"
  },
  {
    commodity: "Potatoes",
    price: 35.00,
    unit: "kg",
    location: "Eldoret Market",
    is_organic: false,
    submitted_by: "sample-user", 
    status: "verified"
  },
  {
    commodity: "Onions",
    price: 60.00,
    unit: "kg",
    location: "Nakuru Town Market",
    is_organic: false,
    submitted_by: "sample-user",
    status: "verified"
  }
];

export class SampleDataService {
  static async populateSampleData() {
    try {
      // Check if sample data already exists
      const { data: existingData } = await supabase
        .from('market_prices')
        .select('id')
        .eq('submitted_by', 'sample-user')
        .limit(1);

      if (existingData && existingData.length > 0) {
        console.log('Sample data already exists');
        return;
      }

      // Insert sample data
      const { error } = await supabase
        .from('market_prices')
        .insert(SAMPLE_MARKET_DATA);

      if (error) {
        console.error('Error inserting sample data:', error);
      } else {
        console.log('Sample market data inserted successfully');
      }
    } catch (error) {
      console.error('Error populating sample data:', error);
    }
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
