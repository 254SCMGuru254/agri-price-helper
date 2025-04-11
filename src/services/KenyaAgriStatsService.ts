
export interface AgriStatistic {
  id: number;
  name: string;
  value: number;
  year: number;
  month?: number;
  category?: string;
}

// Use HTTPS for secure connection
const BASE_URL = 'https://statistics.kilimo.go.ke/en/api';

// Helper function to sanitize incoming data
const sanitizeData = (data: any[]): AgriStatistic[] => {
  return data
    .filter(item => 
      typeof item.id === 'number' && 
      typeof item.value === 'number' && 
      typeof item.year === 'number'
    )
    .map(item => ({
      id: Number(item.id),
      name: String(item.name || 'Unknown'),
      value: Number(item.value),
      year: Number(item.year),
      month: item.month ? Number(item.month) : undefined,
      category: item.category ? String(item.category) : undefined
    }));
};

export const KenyaAgriStatsService = {
  async fetchStats(): Promise<AgriStatistic[]> {
    try {
      // Use AbortController for timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`${BASE_URL}/apputils/?format=json`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch agricultural statistics: ${response.status}`);
      }
      
      const data = await response.json();
      return sanitizeData(data);
    } catch (error) {
      console.error('Error fetching agricultural statistics:', error);
      throw error;
    }
  }
};
