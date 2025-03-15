
export interface AgriStatistic {
  id: number;
  name: string;
  value: number;
  year: number;
  month?: number;
  category?: string;
}

const BASE_URL = 'https://statistics.kilimo.go.ke/en/api';

export const KenyaAgriStatsService = {
  async fetchStats(): Promise<AgriStatistic[]> {
    try {
      const response = await fetch(`${BASE_URL}/apputils/?format=json`);
      if (!response.ok) {
        throw new Error('Failed to fetch agricultural statistics');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching agricultural statistics:', error);
      throw error;
    }
  }
};
